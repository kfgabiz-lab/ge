package com.ge.bo.service;

import com.ge.bo.dto.SlugEntityCodeSaveRequest;
import com.ge.bo.dto.SlugEntityCodeSaveResponse;
import com.ge.bo.exception.BusinessException;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.env.Environment;
import org.springframework.core.env.Profiles;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.time.OffsetDateTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;

/**
 * SlugEntityCodeGenerator가 조립한 6개 파일 코드 문자열을 실제 bo-api 소스 디렉토리에 기록하는 전담 서비스.
 * - 경로 경계 검증(Path Traversal 방지)
 * - 기존 파일 백업 (파일명.bak.{timestamp})
 * - 이 기능으로 생성된 적 없는(마커 없는) 기존 파일과의 충돌 차단
 * - 전체 쓰기 원자성 보장 — 6개 중 하나라도 실패하면 전체 롤백 (부분 쓰기 상태로 남기지 않음)
 * - local 프로파일에서만 동작 (그 외 프로파일은 차단)
 */
@Slf4j
@Service
public class SlugEntityCodeWriter {

  private final Environment environment;

  /** application-local.yml: codegen.entity.entity-dir (기본값은 bo-api 실행 워킹디렉토리 기준 상대경로) */
  @Value("${codegen.entity.entity-dir:src/main/java/com/ge/bo/entity}")
  private String entityDir;

  @Value("${codegen.entity.dto-dir:src/main/java/com/ge/bo/dto}")
  private String dtoDir;

  @Value("${codegen.entity.repository-dir:src/main/java/com/ge/bo/repository}")
  private String repositoryDir;

  @Value("${codegen.entity.service-dir:src/main/java/com/ge/bo/service}")
  private String serviceDir;

  @Value("${codegen.entity.controller-dir:src/main/java/com/ge/bo/controller}")
  private String controllerDir;

  public SlugEntityCodeWriter(Environment environment) {
    this.environment = environment;
  }

  /** 저장 대상 파일 1개를 표현하는 내부 값 객체 */
  private record FileTarget(String baseDir, String fileName, String code) {
  }

  /** 백업 처리 결과 — 원자적 롤백을 위해 "원래 존재했는지 여부"와 "백업 경로"를 함께 보관 */
  private record BackupResult(Path targetPath, boolean existedBefore, Path backupPath) {
  }

  /**
   * 미리보기에서 받은 코드 6개를 실제 파일로 저장한다.
   *
   * @param slugEntityId 로그 기록용 원본 Slug Entity id (저장 로직 자체에는 사용하지 않음)
   * @param request      미리보기 응답을 그대로 재전송한 저장 요청
   */
  public SlugEntityCodeSaveResponse save(Long slugEntityId, SlugEntityCodeSaveRequest request) {
    guardLocalProfileOnly();
    validateFileNames(request);

    List<FileTarget> targets = List.of(
        new FileTarget(entityDir, request.entityFileName(), request.entityCode()),
        new FileTarget(dtoDir, request.requestFileName(), request.requestCode()),
        new FileTarget(dtoDir, request.responseFileName(), request.responseCode()),
        new FileTarget(repositoryDir, request.repositoryFileName(), request.repositoryCode()),
        new FileTarget(serviceDir, request.serviceFileName(), request.serviceCode()),
        new FileTarget(controllerDir, request.controllerFileName(), request.controllerCode()));

    List<Path> resolvedPaths = new ArrayList<>();
    for (FileTarget target : targets) {
      resolvedPaths.add(resolveAndGuard(target.baseDir(), target.fileName()));
    }

    /* 1단계: 이 기능이 생성한 적 없는(마커 없는) 기존 파일과의 충돌을 먼저 전부 검사 — 하나라도 있으면 전체 차단 */
    List<String> conflicts = new ArrayList<>();
    for (Path path : resolvedPaths) {
      if (Files.exists(path) && !containsGeneratedMarker(path)) {
        conflicts.add(path.getFileName().toString());
      }
    }
    if (!conflicts.isEmpty()) {
      throw BusinessException.conflict(
          "이미 존재하는 파일이 이 기능으로 생성된 파일이 아니므로 덮어쓸 수 없습니다: " + String.join(", ", conflicts));
    }

    /* 2단계: 전체 백업 — 기존에 존재하던 파일만 백업 대상 */
    String timestamp = OffsetDateTime.now().format(DateTimeFormatter.ofPattern("yyyyMMddHHmmssSSS"));
    List<BackupResult> backups = new ArrayList<>();
    try {
      for (Path path : resolvedPaths) {
        backups.add(backupIfExists(path, timestamp));
      }
    } catch (IOException e) {
      log.error("[SlugEntityCodeWriter] 백업 단계 실패 — slugEntityId={}", slugEntityId, e);
      throw BusinessException.badRequest("파일 백업 중 오류가 발생하여 저장을 중단했습니다: " + e.getMessage());
    }

    /* 3단계: 전체 쓰기 — 하나라도 실패하면 전체 롤백 (부분 쓰기 상태로 남기지 않음) */
    try {
      for (int i = 0; i < targets.size(); i++) {
        Path path = resolvedPaths.get(i);
        Files.createDirectories(path.getParent());
        Files.writeString(path, targets.get(i).code());
      }
    } catch (IOException e) {
      log.error("[SlugEntityCodeWriter] 쓰기 단계 실패 — 전체 롤백 수행. slugEntityId={}", slugEntityId, e);
      rollback(backups);
      throw BusinessException.badRequest("파일 저장 중 오류가 발생하여 전체 변경을 롤백했습니다: " + e.getMessage());
    }

    List<String> writtenPaths = resolvedPaths.stream().map(Path::toString).toList();
    List<String> backupPaths = backups.stream()
        .filter(BackupResult::existedBefore)
        .map(b -> b.backupPath().toString())
        .toList();

    log.info("[SlugEntityCodeWriter] 파일 생성 완료 — slugEntityId={}, files={}", slugEntityId, writtenPaths);
    return new SlugEntityCodeSaveResponse(writtenPaths, backupPaths);
  }

  /** local 프로파일이 아니면 코드 생성 기능 자체를 차단한다. */
  private void guardLocalProfileOnly() {
    if (!environment.acceptsProfiles(Profiles.of("local"))) {
      throw BusinessException.forbidden("Slug Entity 코드 생성 기능은 local 프로파일에서만 사용할 수 있습니다.");
    }
  }

  /** className과 각 파일명이 정확히 일치하는지 재검증한다. (임의 경로/파일명 주입 방지) */
  private void validateFileNames(SlugEntityCodeSaveRequest request) {
    String className = request.className();
    List<String> mismatches = new ArrayList<>();
    checkFileName(mismatches, request.entityFileName(), className + ".java");
    checkFileName(mismatches, request.requestFileName(), className + "Request.java");
    checkFileName(mismatches, request.responseFileName(), className + "Response.java");
    checkFileName(mismatches, request.repositoryFileName(), className + "Repository.java");
    checkFileName(mismatches, request.serviceFileName(), className + "Service.java");
    checkFileName(mismatches, request.controllerFileName(), className + "Controller.java");
    if (!mismatches.isEmpty()) {
      throw BusinessException.badRequest("className과 일치하지 않는 파일명입니다: " + String.join(", ", mismatches));
    }
  }

  private void checkFileName(List<String> mismatches, String actual, String expected) {
    if (!expected.equals(actual)) {
      mismatches.add(actual + " (기대값: " + expected + ")");
    }
  }

  /** 경로 경계 검증(Path Traversal 방지) 후 정규화된 절대 경로를 반환한다. */
  private Path resolveAndGuard(String baseDir, String fileName) {
    Path baseAbs = Paths.get(baseDir).toAbsolutePath().normalize();
    Path targetAbs = baseAbs.resolve(fileName).normalize();
    if (!targetAbs.startsWith(baseAbs)) {
      throw BusinessException.badRequest("허용되지 않는 파일 경로입니다: " + fileName);
    }
    return targetAbs;
  }

  /** 파일에 이 기능이 생성했다는 마커 주석이 포함되어 있는지 확인한다. */
  private boolean containsGeneratedMarker(Path path) {
    try {
      String content = Files.readString(path);
      return content.contains(SlugEntityCodeGenerator.GENERATED_FILE_MARKER);
    } catch (IOException e) {
      log.warn("[SlugEntityCodeWriter] 마커 검사용 파일 읽기 실패: {}", path, e);
      return false;
    }
  }

  /** 파일이 존재하면 timestamp 접미사로 백업하고, 없으면 백업 없이 상태만 기록한다. */
  private BackupResult backupIfExists(Path path, String timestamp) throws IOException {
    if (!Files.exists(path)) {
      return new BackupResult(path, false, null);
    }
    Path backupPath = Paths.get(path.toString() + ".bak." + timestamp);
    Files.copy(path, backupPath, StandardCopyOption.REPLACE_EXISTING);
    return new BackupResult(path, true, backupPath);
  }

  /** 쓰기 실패 시 전체 롤백 — 기존 파일은 백업에서 복원하고, 신규 파일은 삭제한다. */
  private void rollback(List<BackupResult> backups) {
    for (BackupResult backup : backups) {
      try {
        if (backup.existedBefore()) {
          Files.copy(backup.backupPath(), backup.targetPath(), StandardCopyOption.REPLACE_EXISTING);
          Files.deleteIfExists(backup.backupPath());
        } else {
          Files.deleteIfExists(backup.targetPath());
        }
      } catch (IOException e) {
        log.error("[SlugEntityCodeWriter] 롤백 실패 — 수동 확인이 필요합니다: {}", backup.targetPath(), e);
      }
    }
  }
}

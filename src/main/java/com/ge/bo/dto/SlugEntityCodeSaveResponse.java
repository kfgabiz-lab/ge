package com.ge.bo.dto;

import java.util.List;

/**
 * Slug Entity 기반 Java 코드 자동생성 — 저장 결과 응답 DTO
 */
public record SlugEntityCodeSaveResponse(
    /** 실제로 기록된 6개 파일의 절대경로 */
    List<String> writtenFilePaths,
    /** 기존 파일을 덮어쓰기 전 생성된 백업 파일 절대경로 (기존 파일이 없었던 항목은 포함되지 않음) */
    List<String> backupFilePaths
) {}

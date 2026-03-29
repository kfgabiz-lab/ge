package com.ge.bo.service;

import com.ge.bo.dto.PageTemplateRequest;
import com.ge.bo.dto.PageTemplateResponse;
import com.ge.bo.entity.PageTemplate;
import com.ge.bo.exception.ErrorCode;
import com.ge.bo.repository.PageTemplateRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

/**
 * 페이지 템플릿 비즈니스 로직
 * DB 저장 + TSX 파일 생성 이중 저장 담당
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class PageTemplateService {

    private final PageTemplateRepository pageTemplateRepository;
    private final PageTemplateFileService pageTemplateFileService;

    /** 전체 목록 조회 (이름 오름차순) */
    @Transactional(readOnly = true)
    public List<PageTemplateResponse> getAll() {
        return pageTemplateRepository.findAllByOrderByNameAsc()
                .stream()
                .map(PageTemplateResponse::from)
                .toList();
    }

    /** 단건 조회 (id) */
    @Transactional(readOnly = true)
    public PageTemplateResponse getById(Long id) {
        PageTemplate template = pageTemplateRepository.findById(id)
                .orElseThrow(ErrorCode.PAGE_TEMPLATE_NOT_FOUND::toException);
        return PageTemplateResponse.from(template);
    }

    /** 단건 조회 (slug) — 동적 라우트 페이지에서 사용 */
    @Transactional(readOnly = true)
    public PageTemplateResponse getBySlug(String slug) {
        PageTemplate template = pageTemplateRepository.findBySlug(slug)
                .orElseThrow(ErrorCode.PAGE_TEMPLATE_NOT_FOUND::toException);
        return PageTemplateResponse.from(template);
    }

    /**
     * 생성 — DB 저장 후 TSX 파일 쓰기
     * 파일 쓰기 실패 시 RuntimeException → @Transactional 자동 롤백 + 보상 처리
     */
    @Transactional
    public PageTemplateResponse create(PageTemplateRequest request) {
        // 이름 중복 검사
        if (pageTemplateRepository.existsByName(request.getName())) {
            throw ErrorCode.PAGE_TEMPLATE_NAME_DUPLICATE.toException();
        }
        // slug 중복 검사
        if (pageTemplateRepository.existsBySlug(request.getSlug())) {
            throw ErrorCode.PAGE_TEMPLATE_SLUG_DUPLICATE.toException();
        }

        // tsxCode가 있을 때만 TSX 파일 생성 (없으면 DB만 저장)
        String filePath = "";
        if (request.getTsxCode() != null && !request.getTsxCode().isBlank()) {
            filePath = pageTemplateFileService.writeFile(request.getSlug(), request.getTsxCode());
        }

        // DB 저장
        PageTemplate template = PageTemplate.builder()
                .name(request.getName())
                .slug(request.getSlug())
                .description(request.getDescription())
                .configJson(request.getConfigJson())
                .collapsible(request.isCollapsible())
                .filePath(filePath)
                .templateType(request.getTemplateType() != null ? request.getTemplateType() : "LIST")
                .build();

        return PageTemplateResponse.from(pageTemplateRepository.save(template));
    }

    /**
     * 수정 — DB 수정 + 기존 파일 삭제 → 신규 파일 쓰기
     */
    @Transactional
    public PageTemplateResponse update(Long id, PageTemplateRequest request) {
        PageTemplate template = pageTemplateRepository.findById(id)
                .orElseThrow(ErrorCode.PAGE_TEMPLATE_NOT_FOUND::toException);

        // 이름 중복 검사 (자신 제외)
        if (pageTemplateRepository.existsByNameAndIdNot(request.getName(), id)) {
            throw ErrorCode.PAGE_TEMPLATE_NAME_DUPLICATE.toException();
        }
        // slug 중복 검사 (자신 제외)
        if (pageTemplateRepository.existsBySlugAndIdNot(request.getSlug(), id)) {
            throw ErrorCode.PAGE_TEMPLATE_SLUG_DUPLICATE.toException();
        }

        // tsxCode가 있을 때만 파일 처리
        String newFilePath = template.getFilePath();
        if (request.getTsxCode() != null && !request.getTsxCode().isBlank()) {
            // 기존 파일 삭제 (slug 변경 대비)
            pageTemplateFileService.deleteFile(template.getFilePath());
            // 신규 파일 쓰기 (실패 시 RuntimeException → DB 롤백)
            newFilePath = pageTemplateFileService.writeFile(request.getSlug(), request.getTsxCode());
        }

        // DB 수정
        template.setName(request.getName());
        template.setSlug(request.getSlug());
        template.setDescription(request.getDescription());
        template.setConfigJson(request.getConfigJson());
        template.setCollapsible(request.isCollapsible());
        template.setFilePath(newFilePath);
        // templateType 전송 시에만 업데이트 (미전송 시 기존값 유지)
        if (request.getTemplateType() != null) {
            template.setTemplateType(request.getTemplateType());
        }

        return PageTemplateResponse.from(pageTemplateRepository.save(template));
    }

    /**
     * 삭제 — DB 삭제 + TSX 파일 삭제
     * 파일 삭제 실패는 로그만 기록 (예외 비전파)
     */
    @Transactional
    public void delete(Long id) {
        PageTemplate template = pageTemplateRepository.findById(id)
                .orElseThrow(ErrorCode.PAGE_TEMPLATE_NOT_FOUND::toException);

        pageTemplateRepository.delete(template);
        // DB 삭제 완료 후 파일 삭제 (실패해도 로그만)
        pageTemplateFileService.deleteFile(template.getFilePath());
    }
}

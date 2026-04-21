package com.ge.bo.service;

import com.ge.bo.dto.SlugRegistryRequest;
import com.ge.bo.dto.SlugRegistryResponse;
import com.ge.bo.entity.SlugRegistry;
import com.ge.bo.exception.ErrorCode;
import com.ge.bo.repository.SlugRegistryRepository;
import jakarta.persistence.criteria.Predicate;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;

/**
 * Slug 레지스트리 서비스
 */
@Service
@RequiredArgsConstructor
public class SlugRegistryService {

    private final SlugRegistryRepository slugRegistryRepository;

    /* ══════════ 목록 조회 (관리 페이지용 — 페이징) ══════════ */

    @Transactional(readOnly = true)
    public Page<SlugRegistryResponse> getList(String type, String keyword, Pageable pageable) {
        return slugRegistryRepository.findAll(buildSpec(type, keyword), pageable)
                .map(SlugRegistryResponse::from);
    }

    /* ══════════ 활성 목록 (위젯 빌더용 — 페이징 없음) ══════════ */

    @Transactional(readOnly = true)
    public List<SlugRegistryResponse> getActiveList() {
        return slugRegistryRepository.findAllByActiveTrueOrderBySlugAsc()
                .stream().map(SlugRegistryResponse::from).toList();
    }

    /* ══════════ 단건 조회 ══════════ */

    @Transactional(readOnly = true)
    public SlugRegistryResponse getOne(Long id) {
        return SlugRegistryResponse.from(findOrThrow(id));
    }

    /* ══════════ 등록 ══════════ */

    @Transactional
    public SlugRegistryResponse create(SlugRegistryRequest request) {
        /* slug 중복 확인 */
        if (slugRegistryRepository.existsBySlug(request.slug())) {
            throw ErrorCode.SLUG_REGISTRY_SLUG_DUPLICATE.toException();
        }

        SlugRegistry entity = SlugRegistry.builder()
                .slug(request.slug().trim())
                .name(request.name().trim())
                .type(request.type().trim())
                .description(trimOrNull(request.description()))
                .active(request.active() != null ? request.active() : true)
                .build();

        return SlugRegistryResponse.from(slugRegistryRepository.save(entity));
    }

    /* ══════════ 수정 (slug는 변경 불가) ══════════ */

    @Transactional
    public SlugRegistryResponse update(Long id, SlugRegistryRequest request) {
        SlugRegistry entity = findOrThrow(id);

        /* slug는 수정하지 않음 — 등록 시 확정된 값 유지 */
        entity.setName(request.name().trim());
        entity.setType(request.type().trim());
        entity.setDescription(trimOrNull(request.description()));
        if (request.active() != null) entity.setActive(request.active());

        return SlugRegistryResponse.from(entity);
    }

    /* ══════════ 삭제 ══════════ */

    @Transactional
    public void delete(Long id) {
        slugRegistryRepository.delete(findOrThrow(id));
    }

    /* ══════════ 헬퍼 ══════════ */

    private SlugRegistry findOrThrow(Long id) {
        return slugRegistryRepository.findById(id)
                .orElseThrow(ErrorCode.SLUG_REGISTRY_NOT_FOUND::toException);
    }

    private String trimOrNull(String value) {
        return (value == null || value.trim().isEmpty()) ? null : value.trim();
    }

    /**
     * 동적 필터 Specification 구성
     * - type: 정확히 일치
     * - keyword: slug 또는 name LIKE %keyword%
     */
    private Specification<SlugRegistry> buildSpec(String type, String keyword) {
        return (root, query, cb) -> {
            List<Predicate> predicates = new ArrayList<>();

            if (type != null && !type.isBlank()) {
                predicates.add(cb.equal(root.get("type"), type.trim()));
            }
            if (keyword != null && !keyword.isBlank()) {
                String like = "%" + keyword.trim() + "%";
                predicates.add(cb.or(
                        cb.like(root.get("slug"), like),
                        cb.like(root.get("name"), like)
                ));
            }

            return cb.and(predicates.toArray(new Predicate[0]));
        };
    }
}

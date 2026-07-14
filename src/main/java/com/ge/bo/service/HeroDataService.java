package com.ge.bo.service;

/**
 * [SLUG-ENTITY-CODEGEN-AUTO-GENERATED]
 * Service — 히어로
 * 생성일시: 2026-07-11T14:24:12.513193200+09:00
 * 원본 Slug Entity: id=5, tableName=hero_banner
 * 주의: 이 파일을 직접 수정한 뒤 다시 생성하면 수정 내용이 사라집니다.
 *       (재생성 시 기존 파일은 자동으로 *.bak.{timestamp} 로 백업됩니다.)
 */
import com.ge.bo.dto.HeroDataRequest;
import com.ge.bo.dto.HeroDataResponse;
import com.ge.bo.entity.HeroData;
import com.ge.bo.exception.BusinessException;
import com.ge.bo.repository.HeroDataRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * 히어로 서비스
 */
@Service
@RequiredArgsConstructor
public class HeroDataService {

  private final HeroDataRepository heroDataRepository;

  /** 목록 조회 (페이징) */
  @Transactional(readOnly = true)
  public Page<HeroDataResponse> getList(Pageable pageable) {
    return heroDataRepository.findAll(pageable).map(HeroDataResponse::from);
  }

  /** 단건 조회 */
  @Transactional(readOnly = true)
  public HeroDataResponse getOne(Long id) {
    return HeroDataResponse.from(findOrThrow(id));
  }

  /** 등록 */
  @Transactional
  public HeroDataResponse create(HeroDataRequest request) {
    HeroData entity = HeroData.builder()
        .title(request.title())
        .postDate(request.postDate())
        .titleText(request.titleText())
        .sub(request.sub())
        .btnText(request.btnText())
        .btnUrl(request.btnUrl())
        .orderNo(request.orderNo())
        .content(request.content())
        .defaultVal(request.defaultVal())
        .build();
    return HeroDataResponse.from(heroDataRepository.save(entity));
  }

  /** 수정 */
  @Transactional
  public HeroDataResponse update(Long id, HeroDataRequest request) {
    HeroData entity = findOrThrow(id);
    entity.setTitle(request.title());
    entity.setPostDate(request.postDate());
    entity.setTitleText(request.titleText());
    entity.setSub(request.sub());
    entity.setBtnText(request.btnText());
    entity.setBtnUrl(request.btnUrl());
    entity.setOrderNo(request.orderNo());
    entity.setContent(request.content());
    entity.setDefaultVal(request.defaultVal());
    return HeroDataResponse.from(entity);
  }

  /** 삭제 */
  @Transactional
  public void delete(Long id) {
    heroDataRepository.delete(findOrThrow(id));
  }

  /** id로 조회, 없으면 예외 */
  private HeroData findOrThrow(Long id) {
    return heroDataRepository.findById(id)
        .orElseThrow(() -> BusinessException.notFound("해당 데이터를 찾을 수 없습니다. id=" + id));
  }
}

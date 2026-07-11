package com.ge.bo.service;

/**
 * [SLUG-ENTITY-CODEGEN-AUTO-GENERATED]
 * Service — 배너
 * 생성일시: 2026-07-11T14:32:07.519609300+09:00
 * 원본 Slug Entity: id=1, tableName=banner
 * 주의: 이 파일을 직접 수정한 뒤 다시 생성하면 수정 내용이 사라집니다.
 *       (재생성 시 기존 파일은 자동으로 *.bak.{timestamp} 로 백업됩니다.)
 */
import com.ge.bo.dto.BannerDataRequest;
import com.ge.bo.dto.BannerDataResponse;
import com.ge.bo.entity.BannerData;
import com.ge.bo.exception.BusinessException;
import com.ge.bo.repository.BannerDataRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * 배너 서비스
 */
@Service
@RequiredArgsConstructor
public class BannerDataService {

  private final BannerDataRepository bannerDataRepository;

  /** 목록 조회 (페이징) */
  @Transactional(readOnly = true)
  public Page<BannerDataResponse> getList(Pageable pageable) {
    return bannerDataRepository.findAll(pageable).map(BannerDataResponse::from);
  }

  /** 단건 조회 */
  @Transactional(readOnly = true)
  public BannerDataResponse getOne(Long id) {
    return BannerDataResponse.from(findOrThrow(id));
  }

  /** 등록 */
  @Transactional
  public BannerDataResponse create(BannerDataRequest request) {
    BannerData entity = BannerData.builder()
        .banner_position(request.banner_position())
        .title(request.title())
        .post_date(request.post_date())
        .prefix(request.prefix())
        .main_title(request.main_title())
        .bottom_text(request.bottom_text())
        .sub_title(request.sub_title())
        .url(request.url())
        .image(request.image())
        .sort_order(request.sort_order())
        .is_visible(request.is_visible())
        .info_sort(request.info_sort())
        .build();
    return BannerDataResponse.from(bannerDataRepository.save(entity));
  }

  /** 수정 */
  @Transactional
  public BannerDataResponse update(Long id, BannerDataRequest request) {
    BannerData entity = findOrThrow(id);
    entity.setBanner_position(request.banner_position());
    entity.setTitle(request.title());
    entity.setPost_date(request.post_date());
    entity.setPrefix(request.prefix());
    entity.setMain_title(request.main_title());
    entity.setBottom_text(request.bottom_text());
    entity.setSub_title(request.sub_title());
    entity.setUrl(request.url());
    entity.setImage(request.image());
    entity.setSort_order(request.sort_order());
    entity.setIs_visible(request.is_visible());
    entity.setInfo_sort(request.info_sort());
    return BannerDataResponse.from(entity);
  }

  /** 삭제 */
  @Transactional
  public void delete(Long id) {
    bannerDataRepository.delete(findOrThrow(id));
  }

  /** id로 조회, 없으면 예외 */
  private BannerData findOrThrow(Long id) {
    return bannerDataRepository.findById(id)
        .orElseThrow(() -> BusinessException.notFound("해당 데이터를 찾을 수 없습니다. id=" + id));
  }
}

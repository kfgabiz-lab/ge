package com.ge.bo.service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.ge.bo.dto.HomepageManageDto;
import com.ge.bo.entity.HomepageManage;
import com.ge.bo.repository.HomepageManageRepository;

@Service
@RequiredArgsConstructor
public class HomepageManageService {

  private final HomepageManageRepository homepageManageRepository;

  /** 설정 조회 — row 없으면 기본값(isMultilingual=false) 반환 */
  @Transactional(readOnly = true)
  public HomepageManageDto.Response getSettings() {
    return homepageManageRepository.findById(1L)
        .map(this::toResponse)
        .orElseGet(() -> HomepageManageDto.Response.builder()
            .isMultilingual(false)
            .build());
  }

  /** 설정 수정 — row 없으면 INSERT, 있으면 UPDATE */
  @Transactional
  public HomepageManageDto.Response updateSettings(HomepageManageDto.UpdateRequest request) {
    HomepageManage entity = homepageManageRepository.findById(1L)
        .orElseGet(() -> HomepageManage.builder().build());

    entity.setMultilingual(request.getIsMultilingual());
    return toResponse(homepageManageRepository.save(entity));
  }

  private HomepageManageDto.Response toResponse(HomepageManage entity) {
    return HomepageManageDto.Response.builder()
        .isMultilingual(entity.isMultilingual())
        .build();
  }
}

package com.ge.bo.dto;

import lombok.Builder;
import lombok.Getter;

import java.util.List;

/**
 * 페이지 데이터 목록 + 페이지네이션 응답 DTO
 */
@Getter
@Builder
public class PageDataListResponse {

    /** 현재 페이지 데이터 목록 */
    private List<PageDataResponse> content;

    /** 전체 데이터 수 */
    private long totalElements;

    /** 전체 페이지 수 */
    private int totalPages;

    /** 현재 페이지 번호 (0-based) */
    private int page;

    /** 페이지 크기 */
    private int size;
}

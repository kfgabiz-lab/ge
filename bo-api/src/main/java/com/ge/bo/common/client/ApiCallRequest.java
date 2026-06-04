package com.ge.bo.common.client;

import lombok.Getter;
import org.springframework.http.HttpMethod;

import java.util.Collections;
import java.util.HashMap;
import java.util.Map;

/**
 * 외부 API 요청 파라미터
 * 사용법: ApiCallRequest.post(url).body(data).header("X-Api-Key", "abc").build()
 */
@Getter
public class ApiCallRequest {

    private final String url;
    private final HttpMethod method;
    private final Map<String, String> headers;
    private final Object body;

    private ApiCallRequest(Builder builder) {
        this.url     = builder.url;
        this.method  = builder.method;
        this.headers = Collections.unmodifiableMap(builder.headers);
        this.body    = builder.body;
    }

    /** GET 요청 빌더 시작 */
    public static Builder get(String url) {
        return new Builder(url, HttpMethod.GET);
    }

    /** POST 요청 빌더 시작 */
    public static Builder post(String url) {
        return new Builder(url, HttpMethod.POST);
    }

    /** PUT 요청 빌더 시작 */
    public static Builder put(String url) {
        return new Builder(url, HttpMethod.PUT);
    }

    /** DELETE 요청 빌더 시작 */
    public static Builder delete(String url) {
        return new Builder(url, HttpMethod.DELETE);
    }

    public static class Builder {

        private final String url;
        private final HttpMethod method;
        private final Map<String, String> headers = new HashMap<>();
        private Object body;

        private Builder(String url, HttpMethod method) {
            this.url    = url;
            this.method = method;
        }

        /** 요청 헤더 추가 */
        public Builder header(String name, String value) {
            this.headers.put(name, value);
            return this;
        }

        /** 요청 바디 설정 (POST/PUT) */
        public Builder body(Object body) {
            this.body = body;
            return this;
        }

        public ApiCallRequest build() {
            return new ApiCallRequest(this);
        }
    }
}

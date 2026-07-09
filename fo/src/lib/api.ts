/** 서버 컴포넌트에서 fo 자기 자신(같은 origin)을 절대주소로 호출하기 위한 base — 브라우저에서는 상대경로 그대로 사용 */
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3002";

type RequestOptions = {
  method?: "GET" | "POST" | "PUT" | "DELETE" | "PATCH";
  body?: unknown;
  headers?: Record<string, string>;
  cache?: RequestCache;
  revalidate?: number;
};

/**
 * 공통 API fetch 유틸 — bo-api `/api/v1/fo/**` 프록시 전용 (next.config.ts rewrites 참고)
 * 서버 컴포넌트/브라우저 어디서 호출하든 동일하게 동작하도록 실행 환경에 따라 base를 다르게 붙인다
 * (Node fetch는 상대경로를 해석 못하므로 서버 실행 시에만 SITE_URL을 붙임).
 * @param endpoint - API 경로, 반드시 /api/v1/fo/ 로 시작 (예: /api/v1/fo/main/banners)
 * @param options - 요청 옵션
 */
export async function fetchApi<T>(endpoint: string, options: RequestOptions = {}): Promise<T> {
  const { method = "GET", body, headers = {}, cache, revalidate } = options;

  const fetchOptions: RequestInit = {
    method,
    headers: {
      "Content-Type": "application/json",
      ...headers,
    },
    ...(body ? { body: JSON.stringify(body) } : {}),
    ...(cache ? { cache } : {}),
    ...(revalidate !== undefined ? { next: { revalidate } } : {}),
  };

  const url = typeof window === "undefined" ? `${SITE_URL}${endpoint}` : endpoint;
  const response = await fetch(url, fetchOptions);

  if (!response.ok) {
    throw new Error(`API 오류: ${response.status} ${response.statusText}`);
  }

  return response.json() as Promise<T>;
}

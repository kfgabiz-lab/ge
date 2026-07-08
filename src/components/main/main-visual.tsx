import { fetchApi } from "@/lib/api";
import BannerSwiper from "./banner-swiper";
import VideoSwiper from "./video-swiper";

/** page-data(banner-data) 응답 중 실제로 사용하는 필드만 정의 */
interface BannerForm {
  url: string;
  title: string;
  prefix: string;
  isVisible: string;
  bannerPosition: string;
  postDate_from: string;
  postDate_to: string;
  bottomText?: string;
}

interface BannerDataItem {
  id: number;
  templateSlug: string;
  dataJson: {
    id: number;
    bannerForm: BannerForm;
  };
  createdAt: string;
  updatedAt: string;
}

interface BannerDataResponse {
  content: BannerDataItem[];
  totalElements: number;
  totalPages: number;
  page: number;
  size: number;
}

/**
 * main_notic 섹션용 공지 배너 단건 조회
 * 조건: bannerPosition=INFORMATION, isVisible=001, 게시기간(postDate) 내, updatedAt DESC 첫 1건
 */
async function getNoticBanner(): Promise<BannerForm | null> {
  try {
    const res = await fetchApi<BannerDataResponse>(
      "/api/v1/fo/page-data/banner-data?eq_bannerPosition=INFORMATION&eq_isVisible=001&drs_postDate=in_range&sort=updatedAt,desc&page=0&size=1",
      { cache: "no-store" }
    );
    return res.content?.[0]?.dataJson?.bannerForm ?? null;
  } catch {
    // 조회 실패 시 빈 상태로 레이아웃만 유지
    return null;
  }
}

export default async function MainVisual() {
  const banner = await getNoticBanner();

  // 매칭 배너 0건일 때: 섹션은 렌더링하되 내용(prefix/txt/url)은 빈 값으로 처리 (섹션을 숨기지 않음)
  // TODO: prefix 공통코드 라벨 매핑 필요 (현재는 원본 코드값을 그대로 렌더링)
  const prefixText = banner?.prefix ?? "";
  const txtText = banner?.title ?? "";
  const urlHref = banner?.url ?? "";

  return (
    <>
      <section className="main_visual">
        <VideoSwiper />
        <BannerSwiper />
      </section>

      <section className="main_notic">
        <div className="inner">
          <a
            href={urlHref}
            className="item"
            data-slug="banner-data"
            data-slugKey="url"
            data-slugKey-attr="href"
          >
            <div className="tit_area">
              <p className="tit">
                <img loading="eager" decoding="async" src="/ico/ico_bell_20.svg" alt="" aria-hidden="true" />
                <span data-slugKey="prefix">{prefixText}</span>
              </p>
              <p className="txt" data-slugKey="txt">
                {txtText}
              </p>
            </div>
            <div className="btn_area">
              <span className="btn-text-30">
                More
                <span className="btn-text-30__icon" aria-hidden="true">
                  <span className="icon_arrow-14" aria-hidden="true" />
                </span>
              </span>
            </div>
          </a>
        </div>
      </section>
    </>
  );
}

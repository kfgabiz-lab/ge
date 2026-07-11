import type { GnbSimpleMegaMenu } from "@/data/gnb/types";

export type GnbMegaSimplePanelStateProps = {
  /** 서버에서 API로 조회해 변환한 메가 메뉴 데이터 (정적 import 대신 prop으로 주입) */
  menu: GnbSimpleMegaMenu;
  onItemClick?: () => void;
};

export type GnbMegaDevicesPanelProps = {
  activeCategoryId: string;
  activeDepth3Id: string;
  onCategoryChange: (categoryId: string) => void;
  onDepth3Change: (depth3Id: string) => void;
  onLinkClick?: () => void;
};

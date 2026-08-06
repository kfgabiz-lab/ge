import { GNB_MEGA_PANEL_ID } from "@/data/gnb/panelIds";

export type GnbGuideIcon = {
  id: string;
  fileName: string;
  path: string;
  size: number;
  usage: string;
  usedIn: string;
};

/** GNB·메가 메뉴에서 사용하는 아이콘 (`public/ico`) */
export const gnbGuideIcons: GnbGuideIcon[] = [
  {
    id: "ico_search_24",
    fileName: "ico_search_24.svg",
    path: "/ico/ico_search_24.svg",
    size: 24,
    usage: "검색 — 스크롤·반전 헤더",
    usedIn: "gnb.css (.gnb_util-btn--search), ComponentGuide Search",
  },
  {
    id: "ico_search_24_white",
    fileName: "ico_search_24_white.svg",
    path: "/ico/ico_search_24_white.svg",
    size: 24,
    usage: "검색 — 최상단 헤더",
    usedIn: "gnb.css (.main_header.is-top)",
  },
  {
    id: "ico_global_24",
    fileName: "ico_global_24.svg",
    path: "/ico/ico_global_24.svg",
    size: 24,
    usage: "글로벌(언어) — 스크롤·반전",
    usedIn: "gnb.css (.gnb_util-btn--global)",
  },
  {
    id: "ico_global_24_white",
    fileName: "ico_global_24_white.svg",
    path: "/ico/ico_global_24_white.svg",
    size: 24,
    usage: "글로벌(언어) — 최상단",
    usedIn: "gnb.css (.main_header.is-top)",
  },
  {
    id: "ico_link",
    fileName: "ico_link.svg",
    path: "/ico/ico_link.svg",
    size: 14,
    usage: "외부 링크 (btn-text-30)",
    usedIn: "gnb_mega__simple-item-link, GnbMegaItemLink",
  },
  {
    id: "ico_arrow_right_14",
    fileName: "ico_arrow_right_14.svg",
    path: "/ico/ico_arrow_right_14.svg",
    size: 14,
    usage: "Explore All Products 등 소형 CTA",
    usedIn: "gnb.css (.gnb_mega__explore-btn)",
  },
  {
    id: "ico_arrow_right_24_blue",
    fileName: "ico_arrow_right_24_blue.svg",
    path: "/ico/ico_arrow_right_24_blue.svg",
    size: 24,
    usage: "depth4 패널 타이틀 Arrow · Hover",
    usedIn: "gnb_mega__depth4-arrow-icon",
  },
  {
    id: "ico_arrow_right_18",
    fileName: "ico_arrow_right_18.svg",
    path: "/ico/ico_arrow_right_18.svg",
    size: 18,
    usage: "breadcrumb 외부 링크",
    usedIn: "markets_breadcrumb .icon_external",
  },
  {
    id: "ico_arrow_right_18_white",
    fileName: "ico_arrow_right_18_white.svg",
    path: "/ico/ico_arrow_right_18_white.svg",
    size: 18,
    usage: "breadcrumb (다크/반전)",
    usedIn: "gnb.css (is-top, is-invert)",
  },
  {
    id: "ico_home",
    fileName: "ico_home.svg",
    path: "/ico/ico_home.svg",
    size: 16,
    usage: "breadcrumb 홈",
    usedIn: "gnb.css (.markets_breadcrumb)",
  },
  {
    id: "ico_right",
    fileName: "ico_right.svg",
    path: "/ico/ico_right.svg",
    size: 10,
    usage: "breadcrumb 구분 chevron",
    usedIn: "gnb.css (.markets_breadcrumb)",
  },
  {
    id: "ico_right_white",
    fileName: "ico_right_white.svg",
    path: "/ico/ico_right_white.svg",
    size: 10,
    usage: "breadcrumb chevron (반전)",
    usedIn: "gnb.css (.is-top breadcrumb)",
  },
];

export type GnbGuidePanel = {
  navId: string;
  label: string;
  panelId: string;
  menuType: "devices (4depth)" | "simple · grid" | "simple · sections";
  dataFile: string;
  component: string;
  cssModifier: string;
  figmaNote?: string;
};

export const gnbGuidePanels: GnbGuidePanel[] = [
  {
    navId: "devices",
    label: "Devices & Systems",
    panelId: GNB_MEGA_PANEL_ID.devices,
    menuType: "devices (4depth)",
    dataFile: "src/data/gnb/mega/devices.ts",
    component: "GnbDevicesMegaPanel / GnbMegaPanel",
    cssModifier: "gnb_mega--devices",
    figmaNote: "2769:34864 (LV / EMPR 기본)",
  },
  {
    navId: "markets",
    label: "Markets",
    panelId: GNB_MEGA_PANEL_ID.markets,
    menuType: "simple · grid",
    dataFile: "src/data/gnb/mega/markets.ts",
    component: "GnbMarketsMegaPanel",
    cssModifier: "gnb_mega--simple gnb_mega--grid gnb_mega--markets",
  },
  {
    navId: "services",
    label: "Services",
    panelId: GNB_MEGA_PANEL_ID.services,
    menuType: "simple · sections",
    dataFile: "src/data/gnb/mega/services.ts",
    component: "GnbServicesMegaPanel",
    cssModifier: "gnb_mega--simple gnb_mega--sections gnb_mega--services",
    figmaNote: "2769:35379",
  },
  {
    navId: "support",
    label: "Support",
    panelId: GNB_MEGA_PANEL_ID.support,
    menuType: "simple · sections",
    dataFile: "src/data/gnb/mega/support.ts",
    component: "GnbSupportMegaPanel",
    cssModifier: "gnb_mega--simple gnb_mega--sections",
    figmaNote: "2769:35780",
  },
  {
    navId: "careers",
    label: "Careers",
    panelId: GNB_MEGA_PANEL_ID.careers,
    menuType: "simple · sections",
    dataFile: "src/data/gnb/mega/careers.ts",
    component: "GnbCareersMegaPanel",
    cssModifier: "gnb_mega--simple gnb_mega--sections gnb_mega--careers",
    figmaNote: "2769:35857",
  },
  {
    navId: "company",
    label: "Company",
    panelId: GNB_MEGA_PANEL_ID.company,
    menuType: "simple · sections",
    dataFile: "src/data/gnb/mega/company.ts",
    component: "GnbCompanyMegaPanel",
    cssModifier: "gnb_mega--simple gnb_mega--sections gnb_mega--company",
    figmaNote: "2769:35523",
  },
];

export const gnbGuideClassRefs = [
  {
    block: "헤더 래퍼",
    classes: "main_header-wrap, sub_header-wrap",
    file: "gnb.css",
  },
  {
    block: "메가 패널",
    classes: "gnb_mega, .is-mounted, .is-open",
    file: "gnb.css, getMegaPanelClassName.ts",
  },
  {
    block: "Devices 4depth",
    classes:
      "gnb_mega__col--depth2, --depth3, --depth4, gnb_mega__depth4-head, gnb_mega__depth4-arrow",
    file: "GnbMegaPanel.tsx, gnb.css",
  },
  {
    block: "Simple grid",
    classes: "gnb_mega__inner--grid, gnb_mega__simple-grid, gnb_mega__simple-item",
    file: "GnbMarketsMegaPanel.tsx",
  },
  {
    block: "Simple sections",
    classes:
      "gnb_mega__inner--sections, gnb_mega__simple-columns, gnb_mega__simple-col",
    file: "GnbServicesMegaPanel.tsx 등",
  },
  {
    block: "Explore All",
    classes: "gnb_mega--explore-all, gnbExploreAllProducts.ts",
    file: "GnbMegaExploreAll.tsx",
  },
] as const;

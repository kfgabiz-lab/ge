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
    path: "/pub/ico/ico_search_24.svg",
    size: 24,
    usage: "검색 — 스크롤·반전 헤더",
    usedIn: "gnb.css (.gnb_util-btn--search), ComponentGuide Search",
  },
  {
    id: "ico_gnb_search_ai_32",
    fileName: "ico_gnb_search_ai_32.svg",
    path: "/pub/ico/ico_gnb_search_ai_32.svg",
    size: 32,
    usage: "GNB 검색 패널 AI 마크 (필드리드)",
    usedIn: "GnbSearchPanel (.gnb_search__mark)",
  },
  {
    id: "ico_clear_12_black",
    fileName: "ico_clear_12_black.svg",
    path: "/pub/ico/ico_clear_12_black.svg",
    size: 12,
    usage: "PC GNB 검색어 초기화",
    usedIn: "GnbSearchPanel (.gnb_search__clear-icon-pc)",
  },
  {
    id: "ico_gnb_search_clear_24",
    fileName: "ico_gnb_search_clear_24.svg",
    path: "/pub/ico/ico_gnb_search_clear_24.svg",
    size: 24,
    usage: "모바일 GNB 검색어 초기화 (Figma 7334:131929)",
    usedIn: "GnbSearchPanel (.gnb_search__clear-icon-mo)",
  },
  {
    id: "ico_close_24",
    fileName: "ico_close_24.svg",
    path: "/pub/ico/ico_close_24.svg",
    size: 24,
    usage: "GNB search 닫기",
    usedIn:
      "gnb.css (.main_header__btn-search.is-close, .btn_search.is-close)",
  },
  {
    id: "ico_close_mega_24",
    fileName: "ico_close_mega_24.svg",
    path: "/pub/ico/ico_close_mega_24.svg",
    size: 24,
    usage: "Devices·Markets·Services·Support·Company 메가 패널 닫기 (Figma 8793:231518 · Icon / 24px / Close)",
    usedIn: "gnb.css (.gnb_mega__close) — Devices · Markets · Services · Support · Company",
  },
  {
    id: "ico_search_24_white",
    fileName: "ico_search_24_white.svg",
    path: "/pub/ico/ico_search_24_white.svg",
    size: 24,
    usage: "검색 — 최상단 헤더 (PC)",
    usedIn: "gnb.css (.main_header.is-top)",
  },
  {
    id: "ico_search_24_white_mo",
    fileName: "ico_search_24_white_mo.svg",
    path: "/pub/ico/ico_search_24_white_mo.svg",
    size: 24,
    usage: "검색 — 모바일 is-top · Figma 8793:234601",
    usedIn: "gnb.css (.btn_area--mobile · .main_header__actions--mobile)",
  },
  {
    id: "ico_search_24_mo",
    fileName: "ico_search_24_mo.svg",
    path: "/pub/ico/ico_search_24_mo.svg",
    size: 24,
    usage: "검색 — 모바일 invert·Menu open · Figma 8793:234602 / 234603",
    usedIn: "gnb.css (.btn_area--mobile · gnb_mobile_shell)",
  },
  {
    id: "ico_menu_24_mo",
    fileName: "ico_menu_24_mo.svg",
    path: "/pub/ico/ico_menu_24_mo.svg",
    size: 24,
    usage: "모바일 햄버거 #222 · Figma 8793:234602",
    usedIn: "gnb.css (.btn_area--mobile .icon_menu)",
  },
  {
    id: "ico_menu_24_white_mo",
    fileName: "ico_menu_24_white_mo.svg",
    path: "/pub/ico/ico_menu_24_white_mo.svg",
    size: 24,
    usage: "모바일 햄버거 white · Figma 8793:234601",
    usedIn: "gnb.css (.btn_area--mobile · .main_header.is-top .icon_menu)",
  },
  {
    id: "ico_global_24",
    fileName: "ico_global_24.svg",
    path: "/pub/ico/ico_global_24.svg",
    size: 24,
    usage: "글로벌 리전 트리거 — 스크롤·반전 · 라벨 America",
    usedIn: "gnb.css (.icon_global), GnbGlobalTriggerSubContent",
  },
  {
    id: "ico_global_24_white",
    fileName: "ico_global_24_white.svg",
    path: "/pub/ico/ico_global_24_white.svg",
    size: 24,
    usage: "글로벌 리전 트리거 — 최상단 · 라벨 America",
    usedIn: "gnb.css (.main_header.is-top .icon_global)",
  },
  {
    id: "ico_link",
    fileName: "ico_link.svg",
    path: "/pub/ico/ico_link.svg",
    size: 14,
    usage: "외부 링크 (btn-text-30)",
    usedIn: "gnb_mega__simple-item-link, GnbMegaItemLink",
  },
  {
    id: "ico_arrow_right_14",
    fileName: "ico_arrow_right_14.svg",
    path: "/pub/ico/ico_arrow_right_14.svg",
    size: 14,
    usage: "Explore All Products · Software depth3 링크",
    usedIn: "gnb.css (.gnb_mega__explore-btn, .gnb_mega__depth3-btn-arrow)",
  },
  {
    id: "ico_arrow_right_24_blue",
    fileName: "ico_arrow_right_24_blue.svg",
    path: "/pub/ico/ico_arrow_right_24_blue.svg",
    size: 24,
    usage: "depth4 패널 타이틀 Arrow · Hover",
    usedIn: "gnb_mega__depth4-arrow-icon",
  },
  {
    id: "ico_arrow_right_20_list",
    fileName: "ico_arrow_right_20_list.svg",
    path: "/pub/ico/ico_arrow_right_20_list.svg",
    size: 20,
    usage: "모바일 GNB depth1·depth2 리스트 chevron",
    usedIn: "gnb.css (.gnb_mobile_list__arrow), GnbMobileDepth1Menu, GnbMobileDepth2Menu",
  },
  {
    id: "ico_arrow_right_18_list",
    fileName: "ico_arrow_right_18_list.svg",
    path: "/pub/ico/ico_arrow_right_18_list.svg",
    size: 18,
    usage: "모바일 GNB depth3 리스트 chevron",
    usedIn: "gnb.css (.gnb_mobile_list__arrow--18), GnbMobileDepth3Menu",
  },
  {
    id: "ico_arrow_right_18",
    fileName: "ico_arrow_right_18.svg",
    path: "/pub/ico/ico_arrow_right_18.svg",
    size: 18,
    usage: "breadcrumb 외부 링크",
    usedIn: "sub_breadcrumb .icon_external",
  },
  {
    id: "ico_arrow_right_18_white",
    fileName: "ico_arrow_right_18_white.svg",
    path: "/pub/ico/ico_arrow_right_18_white.svg",
    size: 18,
    usage: "breadcrumb (다크/반전)",
    usedIn: "gnb.css (is-top, is-invert)",
  },
  {
    id: "ico_home",
    fileName: "ico_home.svg",
    path: "/pub/ico/ico_home.svg",
    size: 13,
    usage: "breadcrumb 홈 #888",
    usedIn: "gnb.css (.sub_breadcrumb)",
  },
  {
    id: "ico_home_222",
    fileName: "ico_home_222.svg",
    path: "/pub/ico/ico_home_222.svg",
    size: 13,
    usage: "breadcrumb 홈 hover #222",
    usedIn: "gnb.css (.sub_header:not(.is-gnb-hidden) .breadcrumb_home:hover)",
  },
  {
    id: "ico_right",
    fileName: "ico_right.svg",
    path: "/pub/ico/ico_right.svg",
    size: 10,
    usage: "breadcrumb 구분 chevron",
    usedIn: "gnb.css (.sub_breadcrumb)",
  },
  {
    id: "ico_right_white",
    fileName: "ico_right_white.svg",
    path: "/pub/ico/ico_right_white.svg",
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
    label: "Products & Systems",
    panelId: GNB_MEGA_PANEL_ID.devices,
    menuType: "devices (4depth)",
    dataFile: "src/data/gnb/mega/devices.ts",
    component: "GnbDevicesMegaPanel / GnbMegaPanel",
    cssModifier: "gnb_mega--devices",
    figmaNote: "2769:34864 (LV / EMPR) · Software links 8793:231550",
  },
  {
    navId: "markets",
    label: "Markets",
    panelId: GNB_MEGA_PANEL_ID.markets,
    menuType: "simple · grid",
    dataFile: "src/data/gnb/mega/markets.ts",
    component: "GnbMarketsMegaPanel",
    cssModifier: "gnb_mega--simple gnb_mega--grid gnb_mega--markets",
    figmaNote: "8793:231598",
  },
  {
    navId: "services",
    label: "Services",
    panelId: GNB_MEGA_PANEL_ID.services,
    menuType: "simple · sections",
    dataFile: "src/data/gnb/mega/services.ts",
    component: "GnbServicesMegaPanel",
    cssModifier: "gnb_mega--simple gnb_mega--sections gnb_mega--services",
    figmaNote: "8793:231658",
  },
  {
    navId: "support",
    label: "Support",
    panelId: GNB_MEGA_PANEL_ID.support,
    menuType: "simple · sections",
    dataFile: "src/data/gnb/mega/support.ts",
    component: "GnbSupportMegaPanel",
    cssModifier: "gnb_mega--simple gnb_mega--sections gnb_mega--support",
    figmaNote: "8793:231827",
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
    figmaNote: "8793:231732 — 3 columns · Search and Apply (231743) external icon right",
  },
];

/** 글로벌 리전 메뉴 — Figma 5683:60868 */
export const gnbGuideGlobal = {
  menuId: "gnb-global-menu",
  dataFile: "src/data/gnb/gnbGlobalContent.ts",
  components: "GnbGlobalTrigger.tsx, GnbGlobalMenu.tsx",
  activeRegionId: "america",
  triggerLabel: "America",
  figmaNote: "5683:60868",
} as const;

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
      "gnb_mega__col--depth2, --depth3, --depth4, gnb_mega__depth4-head, gnb_mega__depth4-arrow, gnb_mega__close",
    file: "GnbMegaPanel.tsx, gnb.css",
  },
  {
    block: "Devices Software (depth3AsLinks)",
    classes:
      "gnb_mega__col--depth3.is-links, gnb_mega__depth3-btn-arrow, gnb_mega__col--depth4.is-empty, gnb_mega__inner > .gnb_mega__close",
    file: "GnbMegaPanel.tsx, devices.ts (depth3AsLinks) · Figma 8793:231550",
  },
  {
    block: "Simple grid (Markets)",
    classes:
      "gnb_mega__inner--grid, gnb_mega__grid, gnb_mega__item, gnb_mega__close",
    file: "GnbMarketsMegaPanel.tsx · Figma 8793:231598",
  },
  {
    block: "Simple sections",
    classes:
      "gnb_mega__inner--sections, gnb_mega__simple-columns, gnb_mega__simple-col",
    file: "GnbServicesMegaPanel.tsx 등",
  },
  {
    block: "Global region",
    classes:
      "gnb_global_wrap, gnb_global_label, gnb_global_menu, gnb_global_menu__item",
    file: "GnbGlobalTrigger.tsx, GnbGlobalMenu.tsx, gnbGlobalContent.ts",
  },
  {
    block: "Explore All",
    classes: "devices_explore, gnb_mega__explore",
    file: "explore-all/page.tsx, gnbExploreAllProducts.ts",
  },
  {
    block: "Mobile panel",
    classes:
      "gnb_mobile_shell, gnb_mobile_menu, gnb_mobile_list, gnb_mobile_depth2, gnb_mobile_depth4, gnb_mobile_back, gnb_mobile_explore",
    file: "GnbMobileMenuPanel.tsx, mobileNavItems.ts, gnb.css",
  },
  {
    block: "Search overlay",
    classes:
      "gnb_search.is-open, gnb_search_dim, main_header.is-search-open, gnb_search__clear-icon-pc, gnb_search__clear-icon-mo",
    file: "GnbSearchPanel.tsx, GnbMenu.tsx, gnb.css · Figma 7334:131856",
  },
] as const;

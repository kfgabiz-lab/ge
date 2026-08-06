export type PageStatus = "완료" | "수정" | "진행"|"보류중";

export type PageIndexRow = {
  id: number;
  pageId: string;
  link: string;
  date: string;
  status: PageStatus;
  note: string;
};

export const pageIndexRows: PageIndexRow[] = [
  {
    id: 1,
    pageId: "index",
    link: "/",
    date: "2026-05-19",
    status: "진행",
    note: "페이지 인덱스 (개발용)",
  },
  {
    id: 2,
    pageId: "guide",
    link: "/guide",
    date: "2026-05-28",
    status: "진행",
    note: "Design Guide 허브 — docs/DESIGN_GUIDE.md",
  },
  {
    id: 3,
    pageId: "guide-components",
    link: "/guide/components",
    date: "2026-05-28",
    status: "진행",
    note: "Component Guide (Figma 04~09)",
  },
  {
    id: 4,
    pageId: "guide-ico",
    link: "/guide/ico",
    date: "2026-05-28",
    status: "진행",
    note: "Icon Guide — public/ico",
  },
  {
    id: 5,
    pageId: "guide-sections",
    link: "/guide/sections",
    date: "2026-05-29",
    status: "진행",
    note: "Section Guide — 클래스 레지스트리·미리보기",
  },
  {
    id: 6,
    pageId: "guide-gnb",
    link: "/guide/gnb",
    date: "2026-06-04",
    status: "진행",
    note: "GNB Guide — 메가 메뉴·gnbGuide.ts",
  },

  // 메인
  {
    id: 7,
    pageId: "P-FO-MAIN-010000P",
    link: "/main",
    date: "2026-05-19",
    status: "완료",
    note: "메인 랜딩",
  },

  // 마켓
  {
    id: 8,
    pageId: "P-FO-MKT-060000P",
    link: "/markets/commercial-residential",
    date: "2026-05-19",
    status: "완료",
    note: "Commercial & Residential",
  },
  {
    id: 9,
    pageId: "P-FO-MKT-020000P",
    link: "/markets/data-center",
    date: "2026-05-28",
    status: "진행",
    note: "Markets — Data Center (Figma 1691:12878)",
  },

  // 디바이스 & 시스템
  {
    id: 10,
    pageId: "P-FO-PROD-010000P",
    link: "/devices-systems/motor-control",
    date: "2026-05-28",
    status: "진행",
    note: "Devices & Systems — Motor Control (Figma 2232:51609) · breadcrumb: Devices & Systems > Motor Control",
  },
  {
    id: 11,
    pageId: "P-FO-PROD-020000P",
    link: "/devices-systems/lv-automation",
    date: "2026-05-28",
    status: "진행",
    note: "Devices & Systems — LV Automation (Figma 3082:52770) · breadcrumb: Devices & Systems > LV Automation",
  },
  {
    id: 12,
    pageId: "variable-frequency-drive",
    link: "/devices-systems/variable-frequency-drive",
    date: "2026-05-28",
    status: "진행",
    note: "Devices & Systems — Variable Frequency Drive · breadcrumb: Devices & Systems > LV Automation > Variable Frequency Drive",
  },
  {
    id: 13,
    pageId: "P-FO-PROD-030000P",
    link: "/devices-systems/motor-control/metasol-ms",
    date: "2026-05-28",
    status: "진행",
    note: "Devices & Systems — Product Detail Level 3 (Figma 2232:51843) · breadcrumb: Devices & Systems > Motor Control > Metasol MS",
  },
  {
    id: 14,
    pageId: "P-FO-PROD-040000P",
    link: "/devices-systems/hv-system/hvdc",
    date: "2026-05-28",
    status: "진행",
    note: "Devices & Systems — HVDC Software (Figma 3082:51663) · breadcrumb: Devices & Systems > HV System > HVDC",
  },

  // 컴퍼니
  {
    id: 15,
    pageId: "P-FO-COMP-050000P",
    link: "/company/blog",
    date: "2026-06-02",
    status: "진행",
    note: "Company — Blog List (Figma 3525:39433)",
  },
  {
    id: 16,
    pageId: "P-FO-COMP-051000P",
    link: "/company/blog/detail",
    date: "2026-06-02",
    status: "진행",
    note: "Company — Blog Detail (Figma 3525:39745)",
  },
  {
    id: 17,
    pageId: "P-FO-COMP-060000P,P-FO-COMP-080000P",
    link: "/company/press",
    date: "2026-06-02",
    status: "진행",
    note: "Company — Press List (Figma 3525:39068)",
  },
  {
    id: 18,
    pageId: "P-FO-COMP-061000P,P-FO-COMP-081000P",
    link: "/company/press/detail",
    date: "2026-06-02",
    status: "진행",
    note: "Company — Press Detail (Figma 3525:39724)",
  },
  {
    id: 19,
    pageId: "P-FO-COMP-060100P,P-FO-COMP-080100P",
    link: "/company/press/no-data",
    date: "2026-06-04",
    status: "진행",
    note: "Company — Press List No Data (Figma 3525:39164)",
  },
  {
    id: 20,
    pageId: "P-FO-COMP-070000P",
    link: "/company/events",
    date: "2026-06-04",
    status: "진행",
    note: "Company — Events List (Figma 3525:39276)",
  },
  {
    id: 21,
    pageId: "P-FO-COMP-071000P",
    link: "/company/events/detail",
    date: "2026-06-04",
    status: "진행",
    note: "Company — Events Detail (Figma 3525:39767)",
  },

  // 서포트
  {
    id: 22,
    pageId: "P-FO-SUPP-010000P",
    link: "/support/connect-portal",
    date: "2026-06-04",
    status: "진행",
    note: "Support — Connect Portal (Figma 3670:31018)",
  },
  {
    id: 23,
    pageId: "P-FO-SUPP-020000P",
    link: "/support/download-center",
    date: "2026-06-05",
    status: "진행",
    note: "Support — Download Center (Figma 3670:30518)",
  },
  {
    id: 24,
    pageId: "P-FO-SUPP-020100P",
    link: "/support/download-center/no-data",
    date: "2026-06-05",
    status: "진행",
    note: "Support — Download Center No Data (Figma 3670:31496)",
  },
  {
    id: 25,
    pageId: "P-FO-SUPP-030000P",
    link: "/support/tech-hub",
    date: "2026-06-05",
    status: "진행",
    note: "Support — LS ELECTRIC Tech Hub (Figma 3670:30813)",
  },
  {
    id: 26,
    pageId: "P-FO-SUPP-031100P",
    link: "/support/tech-hub/view",
    date: "2026-06-05",
    status: "진행",
    note: "Support — Tech Hub View (Figma 3670:31687)",
  },
  {
    id: 27,
    pageId: "P-FO-SUPP-030100P",
    link: "/support/tech-hub/no-data",
    date: "2026-06-05",
    status: "진행",
    note: "Support — Tech Hub No Data (Figma 3670:30917)",
  },
  {
    id: 28,
    pageId: "P-FO-SUPP-040000P",
    link: "/support/where-to-buy",
    date: "2026-06-05",
    status: "진행",
    note: "Support — Where to Buy (Figma 3670:30637)",
  },
  {
    id: 29,
    pageId: "P-FO-SUPP-040100P",
    link: "/support/where-to-buy/no-data",
    date: "2026-06-05",
    status: "진행",
    note: "Support — Where to Buy No Data (Figma 3670:30719)",
  },
  {
    id: 30,
    pageId: "P-FO-SUPP-050000P",
    link: "/support/contact-us",
    date: "2026-06-05",
    status: "진행",
    note: "Support — Contact Us (Figma 3670:30232)",
  },
  {
    id: 31,
    pageId: "P-FO-SUPP-050100P",
    link: "/support/contact-us/terms-modal",
    date: "2026-06-05",
    status: "진행",
    note: "Support — Contact Us Privacy Policy Modal (Figma 3670:30503)",
  },

  // {
  //   id: 9,
  //   pageId: "about",
  //   link: "/about",
  //   date: "2026-05-19",
  //   status: "진행",
  //   note: "회사 소개 (예정)",
  // },
  // {
  //   id: 10,
  //   pageId: "contact",
  //   link: "/contact",
  //   date: "2026-05-18",
  //   status: "수정",
  //   note: "문의 폼 검토 중",
  // },
];

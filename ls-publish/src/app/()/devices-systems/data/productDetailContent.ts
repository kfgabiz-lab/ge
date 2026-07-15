export type ProductSpec = {
  label: string;
  value: string;
};

export type ProductKeyFeature = {
  id: string;
  title: string;
  description: string;
};

export type ProductLineupTypeCell = {
  image: string;
  label: string;
};

export type ProductLineupRow = {
  type: ProductLineupTypeCell;
  ratedCurrent: string;
  /** Figma: pipe-separated interrupting values */
  interrupting: string[];
  standard: string;
  /** Taller row (e.g. long type label) — Figma 246px */
  tall?: boolean;
};

export type ProductDownloadFile = {
  name: string;
  size: string;
};

export type ProductDownloadDescription = {
  paragraphs: string[];
  image: string;
  imageAlt?: string;
};

export type ProductDownloadItem = {
  id: string;
  type: string;
  title: string;
  date: string;
  version: string;
  versions?: string[];
  files: ProductDownloadFile[];
  description?: ProductDownloadDescription;
};

export type ProductOtherItem = {
  id: string;
  href: string;
  image: string;
  title: string;
  /** 단일 뱃지 (badge1, 80px) — `badges` 미사용 시 호환 */
  badge?: boolean;
  /** 1: type1 (80px) · 2: type2 (72px) — 각 1개 뱃지 */
  badges?: 1 | 2;
};

export type ProductDetail = {
  slug: string;
  category: string;
  series: string;
  subtitle: string;
  description: string;
  image: string;
  specs: ProductSpec[];
  keyFeatures: ProductKeyFeature[];
  lineup: ProductLineupRow[];
  downloads: ProductDownloadItem[];
  otherProducts: ProductOtherItem[];
  youtubeVideoId: string;
  parentHref: string;
  parentLabel: string;
  configuratorHref?: string;
  configuratorExternal?: boolean;
  configuratorBannerBg?: string;
};

const sharedKeyFeatures: ProductKeyFeature[] = [
  {
    id: "kf-1",
    title: "Proven Power Equipment Heritage",
    description:
      "Building expertise in recycled & non-PVC materials for a greener future.",
  },
  {
    id: "kf-2",
    title: "Proven Power Equipment Heritage",
    description:
      "Building expertise in recycled & non-PVC materials for a greener future.",
  },
  {
    id: "kf-3",
    title: "Proven Power Equipment Heritage",
    description:
      "Building expertise in recycled & non-PVC materials for a greener future.",
  },
  {
    id: "kf-4",
    title: "Proven Power Equipment Heritage",
    description:
      "Building expertise in recycled & non-PVC materials for a greener future.",
  },
];

const sharedInterrupting = ["35 kA(Ni)", "65 kA(Hi)", "100 kA(Li)"];

const sharedLineup: ProductLineupRow[] = [
  {
    type: {
      image: "/img/devices-systems/lineup/lineup_uts150.png",
      label: "UTS150",
    },
    ratedCurrent: "40-150A",
    interrupting: sharedInterrupting,
    standard: "UL 489, CSA",
  },
  {
    type: {
      image: "/img/devices-systems/lineup/lineup_uts250.png",
      label: "UTS250",
    },
    ratedCurrent: "250A",
    interrupting: sharedInterrupting,
    standard: "UL 489, CSA",
  },
  {
    type: {
      image: "/img/devices-systems/lineup/lineup_uts400.png",
      label: "UTS400",
    },
    ratedCurrent: "250-400A",
    interrupting: sharedInterrupting,
    standard: "UL 489, CSA",
  },
  {
    type: {
      image: "/img/devices-systems/lineup/lineup_uts600.png",
      label: "UTS600",
    },
    ratedCurrent: "600A",
    interrupting: sharedInterrupting,
    standard: "UL 489, CSA",
  },
  {
    type: {
      image: "/img/devices-systems/lineup/lineup_zas.png",
      label: "ZAS",
    },
    ratedCurrent: "400-800A",
    interrupting: sharedInterrupting,
    standard: "UL 489, CSA",
  },
  {
    type: {
      image: "/img/devices-systems/lineup/lineup_uts1200.png",
      label: "HVDC(High Voltage Direct Current Transmission System)",
    },
    ratedCurrent: "800-1200A",
    interrupting: sharedInterrupting,
    standard: "UL 489, CSA",
    tall: true,
  },
];

export const productDownloadDescriptionSample: ProductDownloadDescription = {
  paragraphs: [
    "Due to internal structure changes due to the addition of the history alarm function starting from V3.80, a HistoryAlarm Error Message may occur if alarm data from the existing V3.70 or lower version remains in the device. When updating to version V3.80 or upper, be sure to check [Delete all monitoring data ]. (The device’s existing alarm, logging, and recipe data will be deleted.)",
    "Starting from V3.80.0605, the warning message has been strengthened when NVRAM data is not deleted. Please refer to the 3.80.0605 Release Note.",
    "When the HMI is turned off, turn on the backup battery switch on the back of the device and take action related to NVRAM as described in Release Note.",
  ],
  image: "/img/devices/product/download_description.png",
  imageAlt: "Download software interface screenshot",
};

const sharedDownloads: ProductDownloadItem[] = [
  {
    id: "dl-1",
    type: "Catalog",
    title: "LV SWGR Smart LV Solution",
    date: "Dec 08, 2025",
    version: "V38.0",
    versions: ["V38.0", "V37.0", "V36.0"],
    description: productDownloadDescriptionSample,
    files: [
      { name: "MC-800a, 630a, 500a.pdf", size: "12.09MB" },
      { name: "Metasol MS_MC-800a_500-800A_3P_2D CAD.pdf", size: "5.23MB" },
    ],
  },
  {
    id: "dl-2",
    type: "Manual",
    title: "EMPR [UL SPD]USPE Series Manual",
    date: "Dec 08, 2025",
    version: "V38.0",
    versions: ["V38.0", "V37.0", "V36.0"],
    files: [
      { name: "[HVDC_and_FACTS]_EN_C84602-02-201905.pdf", size: "4.62MB" },
    ],
  },
  {
    id: "dl-3",
    type: "Manual",
    title: "Cast Resin Transformer [Transformer]_Catalog_IEEE_EN_202110",
    date: "Dec 08, 2025",
    version: "V38.0",
    versions: ["V38.0", "V37.0", "V36.0"],
    files: [
      { name: "LS_Solution_Overview_EN_CZZZ02-04-202603", size: "" },
      { name: "[HVDC_and_FACTS]_EN_C84602-02-201905.pdf", size: "4.62MB" },
    ],
  },
];

export const metasolMsDetail: ProductDetail = {
  slug: "metasol-ms",
  parentHref: "/devices-systems/motor-control",
  parentLabel: "Motor Control",
  category: "Molded Case Circuit Breaker",
  series: "MCCB",
  subtitle: "High Voltage Direct Current Transmission System",
  description:
    "UL Smart MCCB is a UL-certified molded case circuit breaker that provides reliable power protection along with real-time monitoring and data analytics, enabling efficient energy management and smarter facility operation.",
  image: "/img/devices-systems/product/product_metasol_ms.png",
  specs: [
    { label: "Rated Current", value: "40-1200 A" },
    { label: "Motor Voltage", value: "1Φ 100V ~ 3Φ 240V" },
    { label: "CPU", value: "ARM Cortex A8 800MHz" },
  ],
  keyFeatures: sharedKeyFeatures,
  lineup: sharedLineup,
  downloads: sharedDownloads,
  youtubeVideoId: "WtQN9rcdI-0",
  configuratorHref: "https://www.ls-electric.com/",
  configuratorExternal: true,
  configuratorBannerBg: "/img/devices/product/banner_configurator_bg.png",
  otherProducts: [
    {
      id: "op-1",
      href: "/devices-systems/motor-control/metasol-ms",
      image: "/img/devices-systems/product/product_metasol_ms.png",
      title: "Metasol MS",
      badges: 1,
    },
    {
      id: "op-2",
      href: "",
      image: "/img/devices-systems/product/product_metasol_ms.png",
      title: "Miniature circuit breaker",
    },
    {
      id: "op-3",
      href: "",
      image: "/img/devices-systems/product/product_metasol_ms.png",
      title: "Metasol MMS",
      badges: 2,
    },
    {
      id: "op-4",
      href: "",
      image: "/img/devices-systems/product/product_metasol_ms.png",
      title: "Susol UL MCCB",
    },
    {
      id: "op-5",
      href: "",
      image: "/img/devices-systems/product/product_metasol_ms.png",
      title: "Magnetic Contactor",
    },
    {
      id: "op-6",
      href: "",
      image: "/img/devices-systems/product/product_metasol_ms.png",
      title: "Overload Relay",
      badges: 1,
    },
  ],
};

export const productDetailsBySlug: Record<string, ProductDetail> = {
  "metasol-ms": metasolMsDetail,
};

export function getProductDetail(slug: string): ProductDetail | undefined {
  return productDetailsBySlug[slug];
}

export const productDetailNavItems = [
  { id: "product-key-feature", label: "Key Feature" },
  { id: "product-lineup", label: "Lineup" },
  { id: "product-downloads", label: "Downloads" },
  { id: "product-video", label: "Video" },
  { id: "product-other", label: "Other Products" },
  { id: "product-markets", label: "Markets" },
  { id: "product-help", label: "Help" },
] as const;

import {
  productDownloadDescriptionSample,
  type ProductDownloadItem,
  type ProductOtherItem,
} from "./productDetailContent";
import type { ProductNavItem } from "../components/product/DevicesProductNav";

const hvdcImg = (file: string) => `/img/devices-systems/hvdc/${file}`;

export const hvdcHero = {
  tagline: "Visualize, Control, and Optimize Your Power Grid in Real-Time.",
  title: "SCADA",
  description:
    "LS ELECTRIC\u2019s SCADA (Supervisory Control and Data Acquisition System) system provides a robust, scalable architecture for mission-critical monitoring. From utility substations to high-tech manufacturing, gain total control over your electrical infrastructure.",
};

export const hvdcOverview = {
  image: hvdcImg("overview_hero.jpg"),
  imageAlt: "SCADA control room monitoring systems",
  title:
    "Beyond Monitoring:\nDriving Grid Resiliency through\nIntelligent Automation.",
  description:
    "Gridsol Care SCADA is stable and reliable with real-time acquired power data analysis and operator-centered immediate control activities. We provide highly reliable system operation services.",
};

export type HvdcBenefit = {
  id: string;
  title: string;
  bullets: string[];
  icon: "data" | "reliability" | "analysis" | "connectivity";
};

export const hvdcBenefitsSection = {
  title: "Engineered Benefits",
  subtitle:
    "Tailored electrical infrastructure solutions for every architectural requirement.",
  items: [
    {
      id: "benefit-1",
      title: "Stable & High-Performance Data Processing",
      bullets: [
        "Supports large-scale systems with over 200,000 points.",
        "Real-time data acquisition and screen display processed within 2 seconds without performance degradation.",
      ],
      icon: "data",
    },
    {
      id: "benefit-2",
      title: "System Reliability & Redundancy",
      bullets: [
        "24/7/365 non-stop operation through server, FEP (I/O processing), and network redundancy.",
      ],
      icon: "reliability",
    },
    {
      id: "benefit-3",
      title: "Advanced Power Quality (PQ) Analysis",
      bullets: [
        "Real-time monitoring of power quality events with harmonic, phase angle, and RMS analysis.",
        "Provides standard curve analysis functions (CBEMA, ITIC, SEMI) for accurate system diagnosis.",
      ],
      icon: "analysis",
    },
    {
      id: "benefit-4",
      title: "Operational Convenience & Connectivity",
      bullets: [
        "Familiar Windows-based GUI for user convenience.",
        "Supports various standard protocols including IEC 61850, DNP 3.0, Modbus, and RESTful API.",
        "Web and mobile services for on-site facility monitoring without separate program installation.",
      ],
      icon: "connectivity",
    },
  ] satisfies HvdcBenefit[],
};

export type HvdcApplication = {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  image: string;
};

export const hvdcApplicationsSection = {
  title: "A Comprehensive Command Suite fo Every Application.",
  description:
    "LS SCADA is classified as a representative traditional industry by applying the latest Digital Network System Integration technology to the power system. It is a power solution that transforms the electric power industry into the latest informational industry.",
  items: [
    {
      id: "app-1",
      title: "ECMS",
      subtitle: "(Electrical Equipment Control Monitoring System)",
      description:
        "Centralized monitoring of power flow and equipment status to ensure operational continuity.",
      image: hvdcImg("application_ecms.jpg"),
    },
    {
      id: "app-2",
      title: "PQMS",
      subtitle: "(Power Quality Monitoring System)",
      description:
        "Advanced analysis of harmonics, voltage sags, and swells to protect sensitive industrial loads.",
      image: hvdcImg("application_pqms.jpg"),
    },
    {
      id: "app-3",
      title: "SAS",
      subtitle: "(Substation Automation System)",
      description:
        "Intelligent automation for utility-scale substations, compliant with IEC 61850 standards.",
      image: hvdcImg("application_sas.jpg"),
    },
  ] satisfies HvdcApplication[],
};

export type HvdcWhyBlock = {
  id: string;
  title: string;
  lead?: string;
  cards: { title: string; description: string; image: string }[];
};

export const hvdcWhySection = {
  title: "Why LSE SCADA",
  blocks: [
    {
      id: "why-pq",
      title: "Enhanced PQ analysis function",
      lead: "By real-time monitoring of the substation/substation power system, when a grid accident or power quality event occurs, event information is transmitted in real time and additional information is provided. We provide services for stable facility operation by accurately recognizing the abnormal state of the system.",
      cards: [
        {
          title: "Enhanced PQ analysis function",
          description:
            "Supports PQ instantaneous value waveform analysis and harmonic, phase angle, RMS analysis function (Two cursor analysis function is provided)",
          image: hvdcImg("why_pq_01.jpg"),
        },
        {
          title: "PQ data analysis",
          description: "Provides easy data extraction of analysis results",
          image: hvdcImg("why_pq_02.jpg"),
        },
        {
          title: "Trend analysis of PQ event occurrence",
          description:
            "Provides event occurrence trend by time (specific time period, daily event, daily event occurrence)",
          image: hvdcImg("why_pq_03.jpg"),
        },
        {
          title: "Standard curve analysis (CBEMA, ITIC, SEMI)",
          description:
            "Provides CBEMA, ITIC, SEMI standard curve analysis function according to power quality standards",
          image: hvdcImg("why_pq_04.jpg"),
        },
      ],
    },
    {
      id: "why-psdr",
      title: "PSDR function",
      lead: "Accident Reproduction: Replay Your Grid's History",
      cards: [
        {
          title: "Historical data",
          description:
            "The PSDR function saves all analog and digital data every 2 seconds and manages them as files,and the user can select a file at a specific point in time. Provides a function to replay historical data for that time",
          image: hvdcImg("why_psdr_01.jpg"),
        },
        {
          title: "Create database",
          description:
            "It provides PSDR viewport and PSDR database creation functions independently of the real-time operating system",
          image: hvdcImg("why_psdr_02.jpg"),
        },
      ],
    },
  ] satisfies HvdcWhyBlock[],
};

/** Metasol MS product page와 동일 Tech Hub 배너 영상 */
export const hvdcYoutubeVideoId = "WtQN9rcdI-0";

export const hvdcDownloads: ProductDownloadItem[] = [
  {
    id: "hvdc-dl-1",
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
    id: "hvdc-dl-2",
    type: "Manual",
    title: "EMPR [UL SPD]USPE Series Manual",
    date: "Dec 08, 2025",
    version: "V38.0",
    versions: ["V38.0", "V37.0", "V36.0"],
    files: [{ name: "[HVDC_and_FACTS]_EN_C84602-02-201905.pdf", size: "4.62MB" }],
  },
  {
    id: "hvdc-dl-3",
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

export const hvdcOtherProducts: ProductOtherItem[] = [
  {
    id: "hvdc-op-1",
    href: "/devices-systems/motor-control/metasol-ms",
    image: "/img/devices-systems/product/product_metasol_ms.png",
    title: "Metasol MS",
    badges: 1,
  },
  {
    id: "hvdc-op-2",
    href: "",
    image: "/img/devices-systems/product/product_metasol_ms.png",
    title: "Miniature circuit breaker",
  },
  {
    id: "hvdc-op-3",
    href: "",
    image: "/img/devices-systems/product/product_metasol_ms.png",
    title: "Metasol MMS",
    badges: 2,
  },
  {
    id: "hvdc-op-4",
    href: "",
    image: "/img/devices-systems/product/product_metasol_ms.png",
    title: "Susol UL MCCB",
  },
  {
    id: "hvdc-op-5",
    href: "",
    image: "/img/devices-systems/product/product_metasol_ms.png",
    title: "Magnetic Contactor",
  },
  {
    id: "hvdc-op-6",
    href: "",
    image: "/img/devices-systems/product/product_metasol_ms.png",
    title: "Overload Relay",
    badges: 1,
  },
];

export const hvdcNavItems: readonly ProductNavItem[] = [
  { id: "product-overview", label: "Overview" },
  { id: "product-benefits", label: "Benefits" },
  { id: "product-applications", label: "Applications" },
  { id: "product-why", label: "Why" },
  { id: "product-downloads", label: "Downloads" },
  { id: "product-other", label: "Relavant Products" },
  { id: "product-markets", label: "Markets" },
  { id: "product-help", label: "Help" },
];

export const hvSystemIntro = {
  parentLabel: "Devices & Systems",
  parentHref: "/devices-systems/motor-control",
  title: "HV System",
  description:
    "LS ELECTRIC\u2019s SCADA (Supervisory Control and Data Acquisition System) system provides a robust, scalable architecture for mission-critical monitoring. From utility substations to high-tech manufacturing, gain total control over your electrical infrastructure.",
};

export const hvSystemProducts = [
  {
    id: "hv-1",
    href: "/devices-systems/hv-system/hvdc",
    image: hvdcImg("overview_hero.jpg"),
    title: "SCADA",
    description: hvdcHero.description,
  },
];

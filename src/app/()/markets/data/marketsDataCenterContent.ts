import type {
  BenefitItem,
  FaqItem,
  ProductItem,
  WhyItem,
} from "./marketsContent";

export const dataCenterHero = {
  subtitle: "Agile, modular power for the AI-driven era.",
  title: "Data Centers",
  heroImage: "/img/markets/data-center/hero.jpg",
};

export const dataCenterIntro = {
  titleLines: ["Powering the", "Next Generation of AI Data Centers"],
  text: "As Asia’s first and only provider of a full UL-certified switchgear line-up , LS ELECTRIC delivers the mission-critical components that power the world’s leading data centers. From hyperscale cloud environments to gigawatt-scale AI infrastructure, our field-proven technologies ensure seamless integration and strict local compliance. By supplying modular power systems and intelligent management platforms, we optimize individual site deployment, reducing overall installation time by 30%.From the high-voltage utility source to the server rack, we invest in a high-performance portfolio engineered to give next-generation data centers exactly what they need, when they need it.",
};

export type MarketStatItem = {
  id: string;
  label: string;
  value: string;
  valueUnit?: string;
  valueSuffix?: string;
  sublabel: string;
  description: string;
};

export const dataCenterStats: MarketStatItem[] = [
  {
    id: "ul",
    label: "Global safety compliant",
    value: "UL-Certified",
    sublabel: "reliability and compliance",
    description:
      "As the first and only Asian provider of a full UL-certified switchgear line-up, we ensure seamless local compliance and reliability for the most demanding North American power infrastructures.",
  },
  {
    id: "powerone",
    label: "Reduce installation time by up to",
    value: "30",
    valueUnit: "%",
    valueSuffix: " Reduce",
    sublabel: "reliability and compliance",
    description:
      'Our modular "Beyond PowerONE" solution streamlines engineering and installation, reducing construction lead times by up to 30% while maximizing space efficiency through compact design.',
  },
  {
    id: "monitoring",
    label: "Real-time monitoring of",
    value: "1,000,000",
    sublabel: "tags per second for AI workloads",
    description:
      "From 800V DC architectures to AI-driven DCIM platforms, our intelligent solutions provide real-time monitoring and predictive maintenance to power the next generation of gigawatt-scale AI workloads.",
  },
];

export const dataCenterBenefits: BenefitItem[] = [
  {
    id: "dc-b1",
    href: "",
    title: "Intelligent Grid Connection",
    description:
      "Uninterrupted operation and selective fault isolation for mission-critical power supply.",
    capabilities:
      "We provide ultra-high-voltage substation equipment (up to 154kV) and Gas Insulated Switchgear (GIS) to ensure stable interconnection with the utility grid.",
    image: "/img/markets/img_benefit_01.png",
  },
  {
    id: "dc-b2",
    href: "",
    title: "Efficient Power Distribution",
    description:
      "The first and only UL-certified full-lineup supplier in Asia, ensuring full compliance with North American local regulations.",
    capabilities:
      "We provide a full lineup of UL-certified medium-voltage (MV) and low-voltage (LV) switchgear, along with energy-efficient cast resin transformers.",
    image: "/img/markets/img_benefit_02.png",
    reverse: true,
  },
  {
    id: "dc-b3",
    href: "",
    title: "Uninterruptible<br>Power Protection",
    description:
      "Proven with over 85% market share in Korea, delivering mission-critical reliability and rapid response capability.",
    capabilities:
      "An integrated emergency power system including high-performance UPS (up to 500kVA FAT capacity), STS, and a synchronized CTTS generator transfer system.",
    image: "/img/markets/img_benefit_03.png",
  },
  {
    id: "dc-b4",
    href: "",
    title: "AI-Ready<br>Smart Automation",
    description:
      "Real-time monitoring and autonomous HVAC optimization through 3D digital twin visualization.",
    capabilities:
      "A next-generation platform (Beyond Cube) capable of processing one million data points per second, with AI-based predictive diagnostics.",
    image: "/img/markets/img_benefit_04.png",
    reverse: true,
  },
];

export const dataCenterWhyItems: WhyItem[] = [
  {
    id: "dc-why-1",
    href: "",
    title: "Fast deployment & response",
    description:
      "Extensive references in the North American market (including Big Tech companies and energy corporations)",
    icon: "/img/markets/img_why_01.png",
  },
  {
    id: "dc-why-2",
    href: "",
    title: "Proven reliability",
    description:
      "Extensive references in the North American market (including Big Tech companies and energy corporations)",
    icon: "/img/markets/img_why_02.png",
  },
  {
    id: "dc-why-3",
    href: "",
    title: "Energy efficiency",
    description:
      "Up to 40% reduction in energy consumption (applicable to HVAC Optimal Free Cooling solutions within data centers)",
    icon: "/img/markets/img_why_03.png",
  },
];

export const dataCenterWhyDescription =
  "We understand that in the public sector, failure is not an option";

export const dataCenterFaqItems: FaqItem[] = [
  {
    question: "What UL-certified switchgear does LS ELECTRIC offer for data centers?",
    answer:
      "We provide a full lineup of UL-certified medium-voltage and low-voltage switchgear, metal-clad switchgear, and arc-resistant distribution equipment designed for North American data center compliance.",
  },
  {
    question: "How does Beyond PowerONE reduce installation time?",
    answer:
      "Beyond PowerONE modular power skids streamline engineering and on-site assembly, reducing construction lead times by up to 30% compared with conventional stick-built electrical rooms.",
  },
  {
    question: "Can LS ELECTRIC support AI-scale monitoring workloads?",
    answer:
      "Yes. Our Beyond Cube DCIM platform processes up to one million data points per second with AI-based predictive diagnostics for real-time facility visibility.",
  },
];

export const dataCenterProducts: ProductItem[] = [
  {
    id: "dc-p1",
    href: "/devices-systems/motor-control/metasol-ms",
    image: "/img/markets/solutions/product_mcsg.png",
    title: "MCSG (Metal Clad Switchgear)",
    category: "Switchgear",
    badges: 1,
  },
  {
    id: "dc-p2",
    href: "",
    image: "/img/main/product_01.jpg",
    title: "Beyond PowerONE",
    category: "Modular Power",
  },
  {
    id: "dc-p3",
    href: "",
    image: "/img/markets/solutions/product_ul_lv_swgr.png",
    title: "UL LV SWGR",
    category: "Switchgear",
  },
  {
    id: "dc-p4",
    href: "",
    image: "/img/main/product_01.jpg",
    title: "Beyond Cube DCIM",
    category: "DCIM",
    badges: 2,
  },
  {
    id: "dc-p5",
    href: "",
    image: "/img/main/product_01.jpg",
    title: "High-Performance UPS",
    category: "UPS",
  },
  {
    id: "dc-p6",
    href: "",
    image: "/img/main/product_01.jpg",
    title: "ESS PCS & Battery",
    category: "BESS",
  },
  {
    id: "dc-p7",
    href: "",
    image: "/img/main/product_01.jpg",
    title: "Gas Insulated Switchgear",
    category: "GIS",
  },
  {
    id: "dc-p8",
    href: "",
    image: "/img/main/product_01.jpg",
    title: "HVAC Optimal Free Cooling",
    category: "Cooling",
  },
];

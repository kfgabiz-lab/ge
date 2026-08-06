export type IndustryTab = {
  id: string;
  label: string;
  title: string;
  description: string;
  image: string;
};

export type BenefitItem = {
  id: string;
  href: string;
  title: string;
  description: string;
  capabilities: string;
  image: string;
  reverse?: boolean;
};

export type WhyItem = {
  id: string;
  href: string;
  title: string;
  description: string;
  icon: string;
};

export type ReferenceItem = {
  id: string;
  href: string;
  image: string;
  title: string;
  description: string;
  location: string;
  country: string;
};

export type ProductItem = {
  id: string;
  href: string;
  image: string;
  title: string;
  category: string;
  /** type1 (lg) — `badges` 미사용 시 호환 */
  badge?: boolean;
  /** 1: type1 (lg) · 2: type2 (sm) */
  badges?: 1 | 2;
};

export type FaqItem = {
  question: string;
  answer: string;
};

export const industryTabs: IndustryTab[] = [
  {
    id: "power",
    label: "Power Generation",
    title: "Power Generation",
    description:
      "LS ELECTRIC’s Food & Beverage solutions are designed to ensure hygiene, consistency, and efficiency across the entire production process. They provide precise control of mixing, filling, and packaging through advanced PLCs and drives, while maintaining stable operations even in demanding environments. With integrated monitoring and traceability capabilities, the solutions support strict quality control and regulatory compliance. In addition, energy-efficient drives and smart automation help reduce operating costs and improve productivity, enabling manufacturers to achieve reliable, high-quality production at scale.",
    image: "/img/markets/building.jpg",
  },
  {
    id: "commercial",
    label: "Commercial Buildings",
    title: "Commercial Buildings",
    description:
      "LS ELECTRIC’s Food & Beverage solutions are designed to ensure hygiene, consistency, and efficiency across the entire production process. They provide precise control of mixing, filling, and packaging through advanced PLCs and drives, while maintaining stable operations even in demanding environments. With integrated monitoring and traceability capabilities, the solutions support strict quality control and regulatory compliance. In addition, energy-efficient drives and smart automation help reduce operating costs and improve productivity, enabling manufacturers to achieve reliable, high-quality production at scale.",
    image: "/img/markets/building.jpg",
  },
  {
    id: "transmission",
    label: "Transmission and Distribution",
    title: "Transmission and Distribution",
    description:
      "Comprehensive T&D solutions for grid stability, substation automation, and reliable energy delivery across utility and industrial networks.",
    image: "/img/markets/building.jpg",
  },
  {
    id: "microgrids",
    label: "Microgirds",
    title: "Microgrids",
    description:
      "Flexible microgrid architectures integrating renewable sources, storage, and intelligent control for resilient local power systems.",
    image: "/img/markets/building.jpg",
  },
  {
    id: "bess",
    label: "BESS",
    title: "BESS",
    description:
      "Battery energy storage systems optimized for peak shaving, backup power, and renewable integration in commercial and utility applications.",
    image: "/img/markets/building.jpg",
  },
  {
    id: "renewables",
    label: "Renewables",
    title: "Renewables",
    description:
      "Solar PV, wind integration, and smart inverter solutions supporting the transition to clean energy across building and grid applications.",
    image: "/img/markets/building.jpg",
  },
];

export const benefits: BenefitItem[] = [
  {
    id: "1",
    href: "",
    title: "Reliable Power <br> Infrastructure",
    description:
      "Ensures stable and secure power supply, minimizing downtime and protecting critical building operations.",
    capabilities:
      "Low-voltage protection devices, switchgear, transformers, and integrated power distribution solutions",
    image: "/img/markets/img_benefit_01.png",
  },
  {
    id: "2",
    href: "",
    title: "Energy Efficiency <br> Optimization",
    description:
      "Optimizes energy consumption, reducing operating costs while improving overall energy efficiency.",
    capabilities: "BEMS, power monitoring systems, and data-driven energy analytics",
    image: "/img/markets/img_benefit_02.png",
    reverse: true,
  },
  {
    id: "3",
    href: "",
    title: "Smart Building <br> Operation",
    description:
      "Enables real-time monitoring and data-driven operations, improving facility management and maintenance efficiency.",
    capabilities:
      "Smart electrical room solutions, digital monitoring, and integrated power management platforms",
    image: "/img/markets/img_benefit_03.png",
  },
  {
    id: "4",
    href: "",
    title: "Sustainable & <br> Future-Ready Buildings",
    description:
      "Supports carbon reduction and ESG goals while enabling sustainable and future-ready building environments.",
    capabilities: "Renewable energy integration (PV), ESS, and smart energy solutions",
    image: "/img/markets/img_benefit_04.png",
    reverse: true,
  },
];

export const whyItems: WhyItem[] = [
  {
    id: "why-1",
    href: "",
    title: "Technological Innovation",
    description:
      "Low-voltage protection devices, power distribution systems, smart electrical rooms, BEMS, and renewable energy solutions",
    icon: "/img/markets/img_why_01.png",
  },
  {
    id: "why-2",
    href: "",
    title: "Operational Optimization",
    description:
      "Optimized power consumption, reduced operating costs, and improved energy efficiency across building facilities",
    icon: "/img/markets/img_why_02.png",
  },
  {
    id: "why-3",
    href: "",
    title: "Proven Reliability",
    description:
      "Highly reliable and safe power infrastructure tailored to the demanding requirements of commercial buildings",
    icon: "/img/markets/img_why_03.png",
  },
];

export const references: ReferenceItem[] = [
  {
    id: "ref-1",
    href: "",
    image: "/img/markets/markets_ref_01.png",
    title: "Global Commercial Tower",
    description:
      "LS ELECTRIC ultimately succeeded in winning the contract to supply EHV switchgears, LV switchgears",
    location: "Ho Chi Minh",
    country: "Vietnam",
  },
  {
    id: "ref-2",
    href: "",
    image: "/img/markets/markets_ref_02.png",
    title: "LG USA New Headquarters",
    description:
      "As such, we supplied various equipment such as 38kV MV switchgears, MV transformers, UL 891 switchgears, 최대 2줄",
    location: "New Jersey",
    country: "United States",
  },
  {
    id: "ref-3",
    href: "",
    image: "/img/markets/markets_ref_03.png",
    title: "KPX Energy Management System",
    description:
      "Owing to the next-generation EMS constructed at the operators can now optimally manage power generation, analyze systems",
    location: "Naju",
    country: "South Korea",
  },
];

export const products: ProductItem[] = [
  {
    id: "mp-1",
    href: "",
    image: "/img/main/product_01.jpg",
    title: "Metasol MS",
    category: "Contactor",
  },
  {
    id: "mp-2",
    href: "",
    image: "/img/main/product_01.jpg",
    title: "Susol ACB",
    category: "Breaker",
  },
  {
    id: "mp-3",
    href: "",
    image: "/img/main/product_01.jpg",
    title: "XGT PLC",
    category: "Automation",
    badges: 1,
  },
  {
    id: "mp-4",
    href: "",
    image: "/img/main/product_01.jpg",
    title: "iG5A Drive",
    category: "Drive",
    badges: 2,
  },
  {
    id: "mp-5",
    href: "",
    image: "/img/main/product_01.jpg",
    title: "BEMS Panel",
    category: "BEMS",
  },
  {
    id: "mp-6",
    href: "",
    image: "/img/main/product_01.jpg",
    title: "Smart Meter",
    category: "Metering",
  },
  {
    id: "mp-7",
    href: "",
    image: "/img/main/product_01.jpg",
    title: "ESS PCS",
    category: "Energy Storage",
  },
  {
    id: "mp-8",
    href: "",
    image: "/img/main/product_01.jpg",
    title: "Solar Inverter",
    category: "Renewables",
  },
];

export const faqItems: FaqItem[] = [
  {
    question: "What building types does LS ELECTRIC support?",
    answer:
      "We provide solutions for commercial offices, retail, hospitality, residential complexes, and mixed-use developments with integrated power and automation systems.",
  },
  {
    question: "How does BEMS integration work with existing systems?",
    answer:
      "Our BEMS platforms connect to existing meters, HVAC, and electrical panels through standard protocols, enabling centralized monitoring without full system replacement.",
  },
  {
    question: "Can renewable energy be integrated into existing buildings?",
    answer:
      "Yes. We offer PV, ESS, and smart inverter solutions designed to integrate with current distribution infrastructure while supporting ESG and sustainability goals.",
  },
];

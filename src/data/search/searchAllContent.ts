import { downloadCenterPage } from "@/data/support/downloadCenterContent";
import {
  productDownloadFile,
  type ProductDownloadItem,
} from "@/app/()/products-systems/data/productDetailContent";

export const SEARCH_ALL_PATH = "/search";

export function buildSearchAllHref(query?: string): string {
  if (query === undefined) {
    return SEARCH_ALL_PATH;
  }
  const trimmed = query.trim();
  return trimmed
    ? `${SEARCH_ALL_PATH}?q=${encodeURIComponent(trimmed)}`
    : `${SEARCH_ALL_PATH}?q=`;
}

export const searchAllPage = {
  defaultQuery: "DC Device",
  searchPlaceholder: downloadCenterPage.searchPlaceholder,
  searchPlaceholderMobile: downloadCenterPage.searchPlaceholderMobile,
  popularSearchLabel: downloadCenterPage.popularSearchLabel,
  popularSearchLabelMobile: downloadCenterPage.popularSearchLabelMobile,
  popularTags: downloadCenterPage.popularTags,
  popularTagsMobile: downloadCenterPage.popularTagsMobile,
  aiDisclaimer: "AI-generated content may be incomplete. Verify important info.",
  aiTitle: "AI-generated summary of your search results",
} as const;

export type SearchTabId = "all" | "products" | "documents" | "media" | "pages";

export type SearchTab = {
  id: SearchTabId;
  label: string;
  count: number;
};

export const searchAllTabs: SearchTab[] = [
  { id: "all", label: "All", count: 99 },
  { id: "products", label: "Products", count: 60 },
  { id: "documents", label: "Documents", count: 20 },
  { id: "media", label: "Media", count: 10 },
  { id: "pages", label: "Pages", count: 16 },
];

export type SearchProductItem = {
  id: string;
  href: string;
  image: string;
  category: string;
  highlight: string;
  title: string;
  description: string;
};

export type SearchMediaItem = {
  id: string;
  href: string;
  image: string;
  category: string;
  title: string;
  description?: string;
  highlight?: string;
  /** Optional search metadata — rendering follows where `highlight` appears in title/description text. */
  highlightPlacement?: "title" | "description";
  variant?: "default" | "video";
};

export type SearchPageItem = {
  id: string;
  href: string;
  category: string;
  title: string;
  /** Title suffix after `I` — rendered with `search_page__mark`. */
  mark?: string;
  /** Search term — bold in description (and inline in title when present in `title`). */
  highlight?: string;
  description: string;
};

/** AI summary HTML — rendered inside `.search_all__ai-list-text` */
/* 260812 start */
export const searchAllAiSummaryShortHtml = `
<h2>Overview</h2>
<p><strong>MCCB</strong> appears in the provided materials as <strong>Molded Case Circuit Breaker</strong>.</p>
<p>The document states that the <strong>relay and measurement functions for line protection</strong> have been upgraded.</p>
`;
/* 260812 end */

export const searchAllAiSummaryHtml = `
<h1>MCCB</h1>
<h2>Overview</h2>
<ul>
<li>
<p><strong>MCCB</strong> appears in the provided materials as <strong>Molded Case Circuit Breaker</strong>.</p>
</li>
<li>
<p>In the <strong>Susol Smart MCCB</strong> material, it is described as a product developed by combining <strong>digital technology</strong> with LS ELECTRIC’s <strong>power device technology accumulated over 40 years</strong>.</p>
</li>
<li>
<p>The document states that the <strong>relay and measurement functions for line protection</strong> have been upgraded.</p>
</li>
<li>
<p>It also states that, by using <strong>accessory devices for connectivity between low-voltage devices</strong>, it is possible to <strong>diagnose and maintain devices by collecting and analyzing data</strong>.</p>
</li>
</ul>
<h2>Basic information</h2>
<h3>Susol Smart MCCB</h3>
<ul>
<li>
<p>Supports <strong>on-site monitoring</strong> and <strong>on-site maintenance convenience</strong> through a <strong>short-range wireless mobile app service</strong>.</p>
</li>
<li>
<p>Mobile app services include:</p>
<ul>
<li><strong>Real-time system and device operation status monitoring</strong></li>
<li><strong>Energy use and failure analysis service measure</strong></li>
</ul>
</li>
<li>
<p>Mobile application features include:</p>
<ul>
<li><strong>Device search and automatic recognition</strong></li>
<li><strong>Device status and operation information inquiry</strong></li>
<li><strong>Graphic chart by element</strong></li>
</ul>
</li>
</ul>
<h3>GridSol CARE related configuration</h3>
<ul>
<li>
<p><strong>Smart MCCB</strong> is listed as a component of <strong>GridSol CARE</strong>, along with:</p>
<ul>
<li>Upper level system</li>
<li>Communication device</li>
<li>Accessory device</li>
<li>ACB</li>
<li>MCB</li>
</ul>
</li>
<li>
<p>The document states that GridSol CARE provides <strong>power monitoring and control functions remotely</strong> through its software.</p>
</li>
</ul>
<h2>Features found in the provided documents</h2>
<h3>UL489 MCCB related features</h3>
<p>From the <strong>UL891 switchboard solution</strong> material using <strong>UL489 MCCBs</strong>:</p>
<ul>
<li>
<p>Meets <strong>UL67 / UL891 certification standards</strong> for bus straps and interiors utilizing UL489 MCCBs</p>
</li>
<li>
<p>Provides flexibility through:</p>
<ul>
<li><strong>Five types of interiors</strong></li>
<li><strong>Three types of bus straps</strong></li>
<li><strong>A wide range of MCCBs</strong></li>
</ul>
</li>
<li>
<p>Described as:</p>
<ul>
<li><strong>Cost effective</strong></li>
<li>Allowing <strong>safe installation</strong></li>
<li>Allowing <strong>interchangeability</strong></li>
</ul>
</li>
</ul>
<h3>Listed panel-related features</h3>
<ul>
<li>
<p><strong>UL67 / UL891 Panelboards</strong></p>
</li>
<li>
<p><strong>UL489 Molded case circuit breakers</strong></p>
</li>
<li>
<p><strong>Main bus, 1200 / 2000 / 2400 / 4000 / 6000A copper</strong></p>
</li>
<li>
<p><strong>Branch-bus direct connection</strong></p>
</li>
<li>
<p><strong>Up to 1200A breaker mounted as a branch device</strong></p>
</li>
<li>
<p><strong>Double branched 150, 250 and 400AF breakers</strong></p>
</li>
<li>
<p><strong>Interior maximum short circuit interrupting rating 100kA at 480Vac</strong></p>
</li>
<li>
<p><strong>Individual breaker protection cover plates</strong></p>
</li>
</ul>
<h2>Product line examples shown in the documents</h2>
<h3>UL489 MCCB supply scope</h3>
<ul>
<li>
<p><strong>UTS1200</strong></p>
</li>
<li>
<p><strong>UTS800</strong></p>
</li>
<li>
<p><strong>UTS600</strong></p>
</li>
<li>
<p><strong>UTS400</strong></p>
</li>
<li>
<p><strong>UTS250</strong></p>
</li>
<li>
<p><strong>UTS150</strong></p>
</li>
</ul>
<h3>Susol MCCB overview chart labels</h3>
<p>The overview image shows the following model labels:</p>
<ul>
<li>
<p><strong>TD100</strong></p>
</li>
<li>
<p><strong>TD160</strong></p>
</li>
<li>
<p><strong>TS100</strong></p>
</li>
<li>
<p><strong>TS160</strong></p>
</li>
<li>
<p><strong>TS250</strong></p>
</li>
<li>
<p><strong>TS400</strong></p>
</li>
<li>
<p><strong>TS630</strong></p>
</li>
<li>
<p><strong>TS800</strong></p>
</li>
<li>
<p><strong>TS1000</strong></p>
</li>
<li>
<p><strong>TS1250</strong></p>
</li>
<li>
<p><strong>TS1600</strong></p>
</li>
</ul>
<h2>Additional information</h2>
<ul>
<li>
<p>One document states that <strong>LSIS MCCB can operate ON / OFF remotely when using MOP (Motor Operator)</strong>.</p>
</li>
<li>
<p>It describes <strong>MOP</strong> as <strong>an accessory which contains a motor for operating</strong>.</p>
</li>
<li>
<p>The applicable range shown for <strong>Susol MCCB</strong> is:</p>
<ul>
<li><strong>TD160 ~ TS800</strong></li>
</ul>
</li>
</ul>
<h2>Note</h2>
<ul>
<li>
<p>Please refer to the official catalog for precise specifications and technical requirements.</p>
</li>
<li>
<p>For manuals, certificates, CAD drawings, or other detailed resources, please visit the <a href="https://www.ls-electric.com/support/download-center">LS ELECTRIC Download Center</a>.</p>
</li>
</ul>
`.trim();

/** @deprecated Use `searchAllAiSummaryHtml` — kept for any string-array consumers */
export const searchAllAiSummary = [searchAllAiSummaryHtml];

export const searchAllProducts: SearchProductItem[] = [
  {
    id: "sp-1",
    href: "/products-systems/motor-control/metasol-ms",
    image: "/pub/img/devices-systems/product/product_metasol_ms.png",
    category: "DC Device",
    highlight: "DC Miniature Circuit Breaker",
    title: "Metasol MS",
    description: "Metasol Contactor & Overload Relay",
  },
  {
    id: "sp-2",
    href: "/products-systems/motor-control/susol-ul-smart-mccb",
    image: "/pub/img/devices-systems/products/product_mccb.png",
    category: "DC Device",
    highlight: "DC Miniature Circuit Breaker",
    title: "Miniature circuit breaker",
    description: "The Global Standard",
  },
  {
    id: "sp-3",
    href: "/products-systems/motor-control/metasol-ms",
    image: "/pub/img/devices-systems/product/product_metasol_ms.png",
    category: "DC Device",
    highlight: "DC Miniature Circuit Breaker",
    title: "Metasol MMS",
    description: "Metasol Contactor & Overload Relay",
  },
  {
    id: "sp-4",
    href: "/products-systems/motor-control",
    image: "/pub/img/devices-systems/products/product_magnetic_contactor.png",
    category: "DC Device",
    highlight: "DC Miniature Circuit Breaker",
    title: "Metal Enclosed Load Interrupter\nSwitchgear",
    description: "Susol UL Molded Case Circuit Breaker",
  },
];

export const searchAllDocuments: ProductDownloadItem[] = [
  {
    id: "sd-1",
    type: "Catalog",
    title: "LV SWGR Smart LV Solution DC Device",
    highlight: "DC Device",
    date: "Dec 9, 2025",
    version: "V38.0",
    versions: ["V38.0", "V37.0"],
    files: [
      productDownloadFile({ name: "MC-800a, 630a, 500a.pdf", size: "12.09MB", url: "https://www.ls-electric.com/download/MC-800a%2C%20630a%2C%20500a.pdf" }),
      productDownloadFile({ name: "Metasol MS_MC-800a_500-800A_3P_2D CAD.pdf", size: "5.23MB", url: "https://www.ls-electric.com/download/Metasol%20MS_MC-800a_500-800A_3P_2D%20CAD.pdf" }),
    ],
  },
  {
    id: "sd-2",
    type: "Manual",
    title: "EMPR [UL SPD]USPE Series Manual DC Device",
    highlight: "DC Device",
    date: "Dec 9, 2025",
    version: "V38.0",
    versions: ["V38.0", "V37.0"],
    files: [productDownloadFile({ name: "[HVDC_and_FACTS]_EN_C84602-02-201905.pdf", size: "4.62MB", url: "https://www.ls-electric.com/download/%5BHVDC_and_FACTS%5D_EN_C84602-02-201905.pdf" })],
  },
  {
    id: "sd-3",
    type: "Catalog",
    title: "LV SWGR Smart LV Solution DC Device",
    highlight: "DC Device",
    date: "Dec 9, 2025",
    version: "V38.0",
    versions: ["V38.0", "V37.0"],
    files: [
      productDownloadFile({ name: "MC-800a, 630a, 500a.pdf", size: "12.09MB", url: "https://www.ls-electric.com/download/MC-800a%2C%20630a%2C%20500a.pdf" }),
      productDownloadFile({ name: "Metasol MS_MC-800a_500-800A_3P_2D CAD.pdf", size: "5.23MB", url: "https://www.ls-electric.com/download/Metasol%20MS_MC-800a_500-800A_3P_2D%20CAD.pdf" }),
    ],
  },
  {
    id: "sd-4",
    type: "Manual",
    title: "EMPR [UL SPD]USPE Series Manual DC Device",
    highlight: "DC Device",
    date: "Dec 9, 2025",
    version: "V38.0",
    versions: ["V38.0", "V37.0"],
    files: [productDownloadFile({ name: "[HVDC_and_FACTS]_EN_C84602-02-201905.pdf", size: "4.62MB", url: "https://www.ls-electric.com/download/%5BHVDC_and_FACTS%5D_EN_C84602-02-201905.pdf" })],
  },
];

export const searchAllMedia: SearchMediaItem[] = [
  {
    id: "sm-1",
    href: "/company/blog/detail",
    image: "/pub/img/company/blog/list_01.jpg",
    category: "Blog",
    title: "The Significance of Arc Resistance in Material Selection DC Device",
    highlight: "DC Device",
    description:
      "Electrical faults and equipment failures can halt operations, cause costly downtime, and pose a threat to worker safety DC Device. In fact, around 80% of electrical injuries involve thermal burns from arc flash events.",
  },
  {
    id: "sm-2",
    href: "/company/tech-hub/detail",
    image: "/pub/img/company/press/detail_video_poster.png",
    category: "Tech Hub",
    title: "[ACB] Response Manual for Electrical Closing Failure DC Device",
    highlight: "DC Device",
    variant: "video",
  },
  {
    id: "sm-3",
    href: "/company/press/detail",
    image: "/pub/img/company/press/list_01.png",
    category: "Press",
    title: "LS ELECTRIC to shake up the industry in the era of a ‘Supercycle’ DC Device",
    highlight: "DC Device",
    description:
      "Stated at the annual general meeting of shareholders held on the 26th at LS Tower in Anyang ··· All agenda items passed as proposed. Power market entering an “ultra supercycle” Stated at the annual general meeting of shareholders held on the 26th at LS Tower in Anyang ··· All agenda items passed...",
  },
  {
    id: "sm-4",
    href: "/company/events/detail",
    image: "/pub/img/company/events/featured_01.png",
    category: "Event",
    title: "All Planned Exhibitions and Webinars DC Device",
    highlight: "DC Device",
    description:
      "Events : IEEE PES T&D  /  Venue : Chicago  /  Dates : Apr 17, 2025 ~ Apr 19, 2025",
  },
];

/** Figma 6430:106470 — Pages / list */
export const searchAllPages: SearchPageItem[] = [
  {
    id: "spg-1",
    href: "/markets/data-center",
    category: "Markets",
    title: "Power your data center with reliable electrical solutions",
    mark: "DC Device",
    highlight: "DC Device",
    description:
      "On the 18th, LS ELECTRIC announced that its switchgear manufacturing subsidiary, “MCM Engineering II,” located in Iron County, Utah, has been approved for a tax-reduction incentive by the Utah Inland Port Authority (UIPA), an economic agency under the Utah state government. The key point of this incentive is a reduction of up to 30% of the increase in property taxes generated by the...",
  },
  {
    id: "spg-2",
    href: "/company/events/detail",
    category: "Company",
    title: "Int’l Smart Grid Expo (SG Expo)",
    mark: "DC Device",
    highlight: "DC Device",
    description:
      "LS Energy Solutions : LS Energy Solutions delivers advanced DC Device Energy Storage Systems (ESS) and grid optimization technologies. By integrating power electronics, control systems, and project expertise, the company supports renewable integration and  grid stability across global markets.",
  },
  {
    id: "spg-3",
    href: "/support/connect-portal",
    category: "Service",
    title: "Explore our service coverage and support options",
    mark: "DC Device",
    highlight: "DC Device",
    description:
      "On the 18th, LS ELECTRIC announced that its switchgear manufacturing subsidiary, “MCM Engineering II,” located in Iron County, Utah, has been approved for a tax-reduction incentive by the Utah Inland Port Authority (UIPA), an economic agency under the Utah state government. The key point of this DC Device incentive is a reduction of up to 30% of the increase in property taxes...",
  },
  {
    id: "spg-4",
    href: "/support/where-to-buy",
    category: "Service",
    title: "Find authorized partners for local technical support",
    mark: "DC Device",
    highlight: "DC Device",
    description:
      "LS Energy Solutions : LS Energy Solutions delivers advanced Energy Storage Systems (ESS) and grid optimization technologies. By integrating power electronics, control systems, and project expertise, the company supports renewable integration and  grid stability across global markets.",
  },
];

export const searchSectionExploreLinks: Record<
  Exclude<SearchTabId, "all">,
  string
> = {
  products: "/products-systems/explore-all",
  documents: "/support/download-center",
  media: "/company/blog",
  pages: "/",
};

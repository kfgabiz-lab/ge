export type BreadcrumbCrumb = {
  label: string;
  href?: string;
};

export type BreadcrumbConfig = {
  crumbs: BreadcrumbCrumb[];
  current: string;
};

const configs: Record<string, BreadcrumbConfig> = {
  "/markets/commercial-residential": {
    crumbs: [{ label: "Markets", href: "/markets/commercial-residential" }],
    current: "Commercial & Residential",
  },
  "/markets/data-center": {
    crumbs: [{ label: "Markets", href: "/markets/commercial-residential" }],
    current: "Data Center",
  },
  "/devices-systems/motor-control": {
    crumbs: [
      { label: "Devices & Systems", href: "/devices-systems/motor-control" },
    ],
    current: "Motor Control",
  },
  "/devices-systems/lv-automation": {
    crumbs: [
      { label: "Devices & Systems", href: "/devices-systems/motor-control" },
    ],
    current: "LV Automation",
  },
  "/devices-systems/variable-frequency-drive": {
    crumbs: [
      { label: "Devices & Systems", href: "/devices-systems/motor-control" },
      { label: "LV Automation", href: "/devices-systems/lv-automation" },
    ],
    current: "Variable Frequency Drive",
  },
  "/devices-systems/motor-control/metasol-ms": {
    crumbs: [
      { label: "Devices & Systems", href: "/devices-systems/motor-control" },
      { label: "Motor Control", href: "/devices-systems/motor-control" },
    ],
    current: "Metasol MS",
  },
  "/devices-systems/hv-system": {
    crumbs: [
      { label: "Devices & Systems", href: "/devices-systems/motor-control" },
    ],
    current: "HV System",
  },
  "/devices-systems/hv-system/hvdc": {
    crumbs: [
      { label: "Devices & Systems", href: "/devices-systems/motor-control" },
      { label: "HV System", href: "/devices-systems/hv-system" },
    ],
    current: "HVDC",
  },
  "/company/blog": {
    crumbs: [{ label: "Company", href: "/company/blog" }],
    current: "Blog",
  },
  "/company/blog/detail": {
    crumbs: [{ label: "Company", href: "/company/blog" }],
    current: "Blog",
  },
  "/company/press": {
    crumbs: [
      { label: "Company", href: "/company/blog" },
      { label: "Media" },
    ],
    current: "Press",
  },
  "/company/press/detail": {
    crumbs: [
      { label: "Company", href: "/company/blog" },
      { label: "Media" },
    ],
    current: "Press",
  },
  "/company/press/no-data": {
    crumbs: [
      { label: "Company", href: "/company/blog" },
      { label: "Media" },
    ],
    current: "Press",
  },
  "/company/events": {
    crumbs: [
      { label: "Company", href: "/company/blog" },
      { label: "Media" },
    ],
    current: "Events",
  },
  "/company/events/detail": {
    crumbs: [
      { label: "Company", href: "/company/blog" },
      { label: "Media" },
    ],
    current: "Events",
  },
  "/support/connect-portal": {
    crumbs: [{ label: "Support" }],
    current: "Connect Portal",
  },
  "/support/download-center": {
    crumbs: [{ label: "Support" }],
    current: "Download Center",
  },
  "/support/tech-hub": {
    crumbs: [{ label: "Support" }],
    current: "LS ELECTRIC Tech Hub",
  },
  "/support/tech-hub/view": {
    crumbs: [
      { label: "Support" },
      { label: "LS ELECTRIC Tech Hub", href: "/support/tech-hub" },
    ],
    current: "Video",
  },
  "/support/tech-hub/no-data": {
    crumbs: [{ label: "Support" }],
    current: "LS ELECTRIC Tech Hub",
  },
  "/support/where-to-buy": {
    crumbs: [{ label: "Support" }],
    current: "Where to Buy",
  },
  "/support/where-to-buy/no-data": {
    crumbs: [{ label: "Support" }],
    current: "Where to Buy",
  },
  "/support/contact-us": {
    crumbs: [{ label: "Support" }],
    current: "Contact Us",
  },
};

export function getBreadcrumbConfig(pathname: string): BreadcrumbConfig {
  return (
    configs[pathname] ?? {
      crumbs: [],
      current: "",
    }
  );
}

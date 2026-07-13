import { GNB_MEGA_PANEL_ID } from "@/data/gnb/panelIds";
import type { GnbSimpleMegaMenu } from "@/data/gnb/types";

/** Figma 17660:104944 — 3열 × 2행 (열 우선) Markets mega grid */
export const marketsMegaMenu: GnbSimpleMegaMenu = {
  type: "simple",
  panelId: GNB_MEGA_PANEL_ID.markets,
  layout: "grid",
  items: [
    {
      id: "data-center",
      title: "Data Center",
      description:
        "Hyperscale / Colocation / Edge Computing / Telecom",
      href: "/markets/data-center",
    },
    {
      id: "public-infrastructure",
      title: "Public Infrastructure",
      description:
        "Federal, State, and Municipal Government / Airports / Water and Wastewater / Healthcare",
      href: "/markets/public-infrastructure",
    },
    {
      id: "power-grid",
      title: "Power Grid",
      description:
        "Power Generation, Transmission and Distribution / Microgrids / BESS / Utilities / Renewables",
      href: "/markets/power-grid",
    },
    {
      id: "industrial",
      title: "Industrial",
      description:
        "Automotive / Semiconductor / Machinery / Food & Beverage",
      href: "/markets/industrial",
    },
    {
      id: "oil-gas-mining",
      title: "Oil & Gas, Mining Industries",
      description:
        "Petroleum, Chemical Refineries / Metals & Mining / Marine",
      href: "/markets/oil-gas-mining",
    },
    {
      id: "commercial-residential",
      title: "Commercial & Residential",
      description:
        "Hotels / Retail Stores / Logistics / Commercial / Buildings / Residential",
      href: "/markets/commercial-residential",
    },
  ],
};

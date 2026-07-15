import type { DevicesCategoryProduct } from "./vfdContent";

export const lvAutomationIntro = {
  parentLabel: "Motor Control",
  parentHref: "/devices-systems/motor-control",
  title: "Variable Frequency Drive",
  description:
    "EMPR is an electronic motor protection relay used to protect low voltage motors by replacing thermal overload relays, also known as electronic overcurrent relays.\nEMPR is highly reliable by its accuracy and real-time data processing.\nLEDs on EMPR indicate status of a system, and there are models which provide display of load current, saving cause of failure, and communication functions.",
};

const productImg = (file: string) =>
  `/img/devices-systems/lv-automation/${file}`;

const productDescription =
  "UL Smart MCCB is a UL-certified molded case circuit breaker that provides reliable power protection along with real-time monitoring and data analytics, enabling efficient...";

export const lvAutomationProducts: DevicesCategoryProduct[] = [
  {
    id: "lv-1",
    href: "/devices-systems/motor-control/metasol-ms",
    image: productImg("product_h100_plus.png"),
    title: "H100 Plus",
    description: productDescription,
  },
  {
    id: "lv-2",
    href: "",
    image: productImg("product_sp100.png"),
    title: "SP100",
    description: productDescription,
  },
  {
    id: "lv-3",
    href: "",
    image: productImg("product_g100.png"),
    title: "G100",
    description: productDescription,
  },
  {
    id: "lv-4",
    href: "",
    image: productImg("product_m100.png"),
    title: "M100",
    description: productDescription,
  },
  {
    id: "lv-5",
    href: "",
    image: productImg("product_s100.png"),
    title: "S100",
    description: productDescription,
  },
  {
    id: "lv-6",
    href: "",
    image: productImg("product_is7.png"),
    title: "iS7",
    description: productDescription,
  },
];

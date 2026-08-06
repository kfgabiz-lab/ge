import type { Metadata } from "next";
import NotFoundPage from "@/components/common/NotFoundPage";

export const metadata: Metadata = {
  title: "404 Not found | LS ELECTRIC",
  description:
    "It seems the link is broken or the content has moved. Don't worry, we're here to help you get back on track.",
};

/** P-FO-COMMON-010000P — Figma 7334:130743 */
export default function NotFoundRoutePage() {
  return <NotFoundPage />;
}

"use client";

import { references } from "../data/marketsContent";
import MarketsReferencesModal from "./MarketsReferencesModal";

/** Section guide — LG reference modal (multi-image gallery + list nav) */
export default function MarketsReferencesModalPreview() {
  return (
    <MarketsReferencesModal
      embedded
      open
      item={references[0] ?? null}
      items={references}
      onClose={() => undefined}
    />
  );
}

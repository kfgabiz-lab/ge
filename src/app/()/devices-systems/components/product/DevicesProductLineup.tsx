"use client";

import { Fragment, useId, useState } from "react";
import type { ProductLineupRow } from "../../data/productDetailContent";
import ProductSectionAnchor from "./ProductSectionAnchor";

type DevicesProductLineupProps = {
  items: ProductLineupRow[];
};

function LineupInterrupting({ values }: { values: string[] }) {
  return (
    <div className="devices_product_lineup__cell-values">
      {values.map((value, index) => (
        <Fragment key={value}>
          {index > 0 ? (
            <span className="devices_product_lineup__cell-sep" aria-hidden="true" />
          ) : null}
          <span>{value}</span>
        </Fragment>
      ))}
    </div>
  );
}

export default function DevicesProductLineup({ items }: DevicesProductLineupProps) {
  const [expanded, setExpanded] = useState(false);
  const gridId = useId();

  return (
    <section className="devices_product_lineup" id="product-lineup">
      <div className="inner">
        <h2 className="section_tit">Lineup</h2>
        <div className="devices_product_lineup__grid">
          <div
            id={gridId}
            className={`devices_product_lineup__grid-scroll${
              expanded ? " is-expanded" : " is-collapsed"
            }`}
          >
            <div className="devices_product_lineup__head-row" role="row">
              <div className="devices_product_lineup__head-cell" role="columnheader">
                Type
              </div>
              <div className="devices_product_lineup__head-cell" role="columnheader">
                Rated Current
              </div>
              <div className="devices_product_lineup__head-cell" role="columnheader">
                Interrupting Capacity (at 480 Vac)
              </div>
              <div className="devices_product_lineup__head-cell" role="columnheader">
                Standard
              </div>
            </div>
            {items.map((row) => (
              <div
                key={row.type.label}
                className={`devices_product_lineup__row${
                  row.tall ? " devices_product_lineup__row--tall" : ""
                }`}
                role="row"
              >
                <div className="devices_product_lineup__type-cell" role="cell">
                  <div className="devices_product_lineup__type-img">
                    <img loading="lazy" decoding="async" src={row.type.image} alt="" />
                  </div>
                  <p className="devices_product_lineup__type-label">{row.type.label}</p>
                </div>
                <div className="devices_product_lineup__cell" role="cell">
                  {row.ratedCurrent}
                </div>
                <div className="devices_product_lineup__cell" role="cell">
                  <LineupInterrupting values={row.interrupting} />
                </div>
                <div className="devices_product_lineup__cell" role="cell">
                  {row.standard}
                </div>
              </div>
            ))}
            {!expanded ? (
              <div className="devices_product_lineup__fade" aria-hidden="true" />
            ) : null}
          </div>
          <button
            type="button"
            className="devices_product_lineup__more"
            aria-expanded={expanded}
            aria-controls={gridId}
            onClick={() => setExpanded((open) => !open)}
          >
            <span className="devices_product_lineup__more-inner">
              {expanded ? "Show less" : "Show more"}
              <span
                className={`devices_product_lineup__more-icon${
                  expanded ? " is-up" : ""
                }`}
                aria-hidden
              />
            </span>
          </button>
        </div>
        <div className="devices_product_lineup__footer">
          <div className="devices_product_lineup__note">
            <p>Access all the technical assets you need in one place.</p>
            <p>
              Download high-resolution CAD drawings, detailed installation manuals, and
              the latest product catalogs to streamline your engineering workflow.
            </p>
          </div>
          <ProductSectionAnchor
            sectionId="product-downloads"
            className="btn-base btn-lv02 btn-lv02--solid"
          >
            Go to Configurator
            <span className="icon_link-14" aria-hidden="true" />
          </ProductSectionAnchor>
        </div>
      </div>
    </section>
  );
}

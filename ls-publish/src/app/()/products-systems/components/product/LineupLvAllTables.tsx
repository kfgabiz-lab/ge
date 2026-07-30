import DevicesProductLineupGrid from "./DevicesProductLineupGrid";
import { lineupLvProducts } from "../../data/lineupLvTables";

const FOOTER_NOTE = [
  "Explore all available configurations effortlessly.",
  "Our Configurator helps you select the right specifications in just a few clicks.",
] as const;

type LineupLvAllTablesProps = {
  configuratorHref?: string;
  configuratorExternal?: boolean;
};

/**
 * Preview page — all `product_etc.line_up` tables from
 * docs/product-etc-line-up-tables.txt
 */
export default function LineupLvAllTables({
  configuratorHref = "",
  configuratorExternal = false,
}: LineupLvAllTablesProps) {
  const configuratorProps = configuratorExternal
    ? { target: "_blank", rel: "noopener noreferrer" }
    : {};

  return (
    <section className="devices_product_lineup" id="product-lineup">
      <div className="inner">
        <h2 className="section_tit">Lineup</h2>
        <div className="devices_product_lineup__grids devices_product_lineup__grids--lineup-lv">
          {lineupLvProducts.map((product) => (
            <article
              key={product.id}
              className="devices_product_lineup__lv-product"
              id={`lineup-${product.id}`}
            >
              <h3 className="devices_product_lineup__lv-product-title">
                {product.name}
              </h3>
              <DevicesProductLineupGrid
                modifier="type1"
                layout={product.layout}
              >
                <div
                  data-slug="product-data"
                  data-slugkey="product_etc.line_up"
                  dangerouslySetInnerHTML={{ __html: product.html }}
                />
              </DevicesProductLineupGrid>
            </article>
          ))}
        </div>
        <div className="devices_product_lineup__footer">
          <div className="devices_product_lineup__note">
            {FOOTER_NOTE.map((line) => (
              <p key={line}>{line}</p>
            ))}
          </div>
          {configuratorHref ? (
            <a
              href={configuratorHref}
              className="btn-base btn-lv02 btn-lv02--solid"
              {...configuratorProps}
            >
              Go to Configurator
              <span className="icon_link-14" aria-hidden="true" />
            </a>
          ) : null}
        </div>
      </div>
    </section>
  );
}

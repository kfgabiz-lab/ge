import { Fragment, type ReactNode } from "react";
import { lineupLvProducts } from "../../data/lineupLvTables";
import type {
  ProductFrameLineup,
  ProductLineupRow,
  ProductLineupTypeCell,
  ProductLineupVariant,
} from "../../data/productDetailContent";
import DevicesProductLineupGrid from "./DevicesProductLineupGrid";

type DevicesProductLineupProps = {
  items?: ProductLineupRow[];
  frameLineup?: ProductFrameLineup;
  /**
   * `susol-frame` — Figma 6788:7576
   * `metasol-ms` — Figma 6788:8458
   * `susol-ul-smart-mccb` — docs/product-etc-line-up-tables-lv.txt (UTS lineup)
   * `h100-plus` — Figma 6843:65056
   * `product-template` — MMS-32 / 63 / 100 lineup (template page)
   * (미지정 시 items / frameLineup으로 동적 생성)
   */
  table?:
    | "susol-frame"
    | "metasol-ms"
    | "susol-ul-smart-mccb"
    | "h100-plus"
    | "product-template";
  /** @default "type1" — 가이드: type1(MCCB) · type2(VFD frame) */
  variant?: ProductLineupVariant;
  configuratorHref?: string;
  configuratorExternal?: boolean;
};

type LineupGridModifier = "type1" | "type2";
type LineupGridLayout = "mccb" | "spec" | "metasol";

type LineupTableColumn = {
  id: string;
  header: ReactNode;
};

type LineupTableRow = {
  key: string;
  tall?: boolean;
  rowHeader: ReactNode;
  cells: ReactNode[];
};

type LineupTableModel = {
  modifier: LineupGridModifier;
  layout?: LineupGridLayout;
  cornerHeader: string;
  columns: LineupTableColumn[];
  rows: LineupTableRow[];
};

const FOOTER_NOTE = [
  "Explore all available configurations effortlessly.",
  "Our Configurator helps you select the right specifications in just a few clicks.",
] as const;

const MCCB_COLUMNS: LineupTableColumn[] = [
  { id: "rated-current", header: "Rated Current" },
  { id: "interrupting", header: "Interrupting Capacity (at 480 Vac)" },
  { id: "standard", header: "Standard" },
];

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

function LineupTypeHeader({ type }: { type: ProductLineupTypeCell }) {
  return (
    <>
      <img loading="lazy" decoding="async" src={type.image} alt="" />
      <p>{type.label}</p>
    </>
  );
}

/** Figma 6788:7576 — Susol UL frame lineup (hardcoded) */
function SusolFrameLineupTable() {
  return (
    <div className="devices_product_lineup__grids devices_product_lineup__grids--susol-frame">
      <DevicesProductLineupGrid modifier="type1" layout="spec">
        <div className="devices_product_lineup__table devices_product_lineup__table--susol-frame">
            <table>
              <colgroup>
                <col />
                <col />
                <col />
                <col />
                <col />
              </colgroup>
              <thead>
                <tr>
                  <th scope="col" />
                  <th scope="col">Rated Operational Voltage</th>
                  <th scope="col">Rated Current(In)</th>
                  <th scope="col">Rated Short Circuit Current</th>
                  <th scope="col">Applicable Standard</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <th scope="row">
                    <img
                      loading="lazy"
                      decoding="async"
                      src="/pub/img/devices-systems/lineup/lineup_susol_ul_acb_c.png"
                      alt=""
                    />
                    <p>C Frame</p>
                  </th>
                  <td>Up to 800 Vac</td>
                  <td>400-1200 A</td>
                  <td>Up to 65 kA</td>
                  <td>UL 489</td>
                </tr>
                <tr>
                  <th scope="row">
                    <img
                      loading="lazy"
                      decoding="async"
                      src="/pub/img/devices-systems/lineup/lineup_susol_ul_acb_d.png"
                      alt=""
                    />
                    <p>D Frame</p>
                  </th>
                  <td>Up to 635 Vac</td>
                  <td>400-1600 A</td>
                  <td>Up to 85 kA</td>
                  <td>UL 1066</td>
                </tr>
                <tr>
                  <th scope="row">
                    <img
                      loading="lazy"
                      decoding="async"
                      src="/pub/img/devices-systems/lineup/lineup_susol_ul_acb_e.png"
                      alt=""
                    />
                    <p>E Frame</p>
                  </th>
                  <td>Up to 835 Vac</td>
                  <td>400-4000 A</td>
                  <td>Up to 100 kA</td>
                  <td>UL 1066</td>
                </tr>
                <tr>
                  <th scope="row">
                    <img
                      loading="lazy"
                      decoding="async"
                      src="/pub/img/devices-systems/lineup/lineup_susol_ul_acb_g.png"
                      alt=""
                    />
                    <p>G Frame</p>
                  </th>
                  <td>Up to 635 Vac</td>
                  <td>1600-6000 A</td>
                  <td>Up to 130 kA</td>
                  <td>UL 1066</td>
                </tr>
              </tbody>
            </table>
        </div>
      </DevicesProductLineupGrid>
    </div>
  );
}

function MetasolFrameMedia({
  image,
  label,
}: {
  image: string;
  label: string;
}) {
  return (
    <>
      <div className="devices_product_lineup__frame-media">
        <img loading="lazy" decoding="async" src={image} alt="" />
      </div>
      <p>{label}</p>
    </>
  );
}

/** Figma 6788:8458 — Metasol MS lineup (hardcoded) */
function MetasolMsLineupTable() {
  const img = (name: string) =>
    `/pub/img/devices-systems/lineup/lineup_metasol_ms_${name}.png`;

  return (
    <DevicesProductLineupGrid modifier="type1" layout="metasol">
      <div data-slug="product-data" data-slugkey="product_etc.line_up">
        <table>
          <colgroup>
            <col />
            <col />
            <col />
            <col />
            <col />
            <col />
          </colgroup>
          <thead>
            <tr>
              <th scope="col" colSpan={2}>
                Frame Size
              </th>
              <th scope="col">
                <MetasolFrameMedia
                  image={img("18_40af")}
                  label="18 AF / 22 AF / 40 AF"
                />
              </th>
              <th scope="col">
                <MetasolFrameMedia
                  image={img("65_100_150af")}
                  label="65 AF / 100 AF / 150 AF"
                />
              </th>
              <th scope="col">
                <MetasolFrameMedia
                  image={img("225_400_800af")}
                  label="225 AF / 400 AF / 800 AF"
                />
              </th>
              <th scope="col">
                <MetasolFrameMedia
                  image={img("1260_2650af")}
                  label="1260 AF / 2650 AF"
                />
              </th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <th
                scope="row"
                rowSpan={4}
                className="devices_product_lineup__category"
              >
                Magnetic
                <br />
                Contactor
              </th>
              <th scope="row" className="devices_product_lineup__label">
                Model
              </th>
              <td>MC-6a ~ MC-40a</td>
              <td>MC-50a ~ MC-150a</td>
              <td>MC-185a ~ MC-800a</td>
              <td>MC-1260a ~ MC-2650a</td>
            </tr>
            <tr>
              <th scope="row" className="devices_product_lineup__label">
                Rated Current
              </th>
              <td>6~40 A</td>
              <td>50~150 A</td>
              <td>185~800 A</td>
              <td>1260~2650 A</td>
            </tr>
            <tr>
              <th scope="row" className="devices_product_lineup__label">
                Rated Insulation Voltage
              </th>
              <td>690, 1000 V</td>
              <td>1000 V</td>
              <td>1000 V</td>
              <td>1000 V</td>
            </tr>
            <tr>
              <th scope="row" className="devices_product_lineup__label">
                Rated Impulse Withstand Voltage
              </th>
              <td>6, 8 kV</td>
              <td>8 kV</td>
              <td>8 kV</td>
              <td>8 kV</td>
            </tr>
            <tr>
              <th
                scope="row"
                rowSpan={4}
                className="devices_product_lineup__category"
              >
                Thermal Overload
                <br />
                Relay
              </th>
              <th scope="row" className="devices_product_lineup__label">
                Model
              </th>
              <td>MT-12 / 32</td>
              <td>MT-63 / 95 / 150</td>
              <td>MT-225 / 400 / 800</td>
              <td>-</td>
            </tr>
            <tr>
              <th scope="row" className="devices_product_lineup__label">
                Rated Insulation Voltage
              </th>
              <td>690 V</td>
              <td>Up to 690 V</td>
              <td>690 V</td>
              <td>-</td>
            </tr>
            <tr>
              <th scope="row" className="devices_product_lineup__label">
                Rated Impulse Withstand Voltage
              </th>
              <td>6 kV</td>
              <td>6 kV</td>
              <td>6 kV</td>
              <td>-</td>
            </tr>
            <tr>
              <th scope="row" className="devices_product_lineup__label">
                Current Setting Range
              </th>
              <td>0.1~40 A</td>
              <td>4~150 A</td>
              <td>65~800 A</td>
              <td>-</td>
            </tr>
          </tbody>
        </table>
      </div>
    </DevicesProductLineupGrid>
  );
}

/** Susol UL Smart MCCB — docs/product-etc-line-up-tables-lv.txt (metasol-ms 패턴) */
function SusolUlSmartMccbLineupTable() {
  const img = (name: string) =>
    `/pub/img/devices-systems/lineup/Susol_UL_Smart_MCCB/${name}.png`;

  const rows = [
    { id: "UTS150", ratedCurrent: "40~150 A" },
    { id: "UTS250", ratedCurrent: "250 A" },
    { id: "UTS400", ratedCurrent: "250~400 A" },
    { id: "UTS600", ratedCurrent: "600 A" },
    { id: "UTS800", ratedCurrent: "400~800 A" },
    { id: "UTS1200", ratedCurrent: "800~1200 A" },
  ] as const;

  const interrupting = ["35 kA(Ni)", "65 kA(Hi)", "100 kA(Li)"];

  return (
    <DevicesProductLineupGrid modifier="type1" layout="mccb">
      <div data-slug="product-data" data-slugkey="product_etc.line_up">
        <table>
          <colgroup>
            <col />
            <col />
            <col />
            <col />
          </colgroup>
          <thead>
            <tr>
              <th scope="col" />
              <th scope="col">Rated Current</th>
              <th scope="col">
                Interrupting Capacity
                <br />
                (at 480 Vac)
              </th>
              <th scope="col">Standard</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.id}>
                <th scope="row">
                  <img
                    loading="lazy"
                    decoding="async"
                    src={img(row.id)}
                    alt=""
                  />
                  <p>{row.id}</p>
                </th>
                <td>{row.ratedCurrent}</td>
                <td>
                  <LineupInterrupting values={[...interrupting]} />
                </td>
                <td>UL 489, CSA</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </DevicesProductLineupGrid>
  );
}

function LineupTableGrid({
  modifier,
  layout,
  cornerHeader,
  columns,
  rows,
}: LineupTableModel) {
  return (
    <DevicesProductLineupGrid modifier={modifier} layout={layout}>
      <div className="devices_product_lineup__table">
        <table>
          <colgroup>
            <col />
            {columns.map((column) => (
              <col key={column.id} />
            ))}
          </colgroup>
          <thead>
            <tr>
              <th scope="col">{cornerHeader}</th>
              {columns.map((column) => (
                <th key={column.id} scope="col">
                  {column.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.key} data-tall={row.tall ? "" : undefined}>
                <th scope="row">{row.rowHeader}</th>
                {row.cells.map((cell, cellIndex) => (
                  <td key={`${row.key}-${cellIndex}`}>{cell}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </DevicesProductLineupGrid>
  );
}

function buildMccbTable(items: ProductLineupRow[]): LineupTableModel {
  return {
    modifier: "type1",
    layout: "mccb",
    cornerHeader: "Type",
    columns: MCCB_COLUMNS,
    rows: items.map((row) => ({
      key: row.type.label,
      tall: row.tall,
      rowHeader: <LineupTypeHeader type={row.type} />,
      cells: [
        row.ratedCurrent,
        <LineupInterrupting key="interrupting" values={row.interrupting} />,
        row.standard,
      ],
    })),
  };
}

function buildFrameTable(lineup: ProductFrameLineup): LineupTableModel {
  return {
    modifier: "type2",
    cornerHeader: lineup.cornerHeader ?? "Frame",
    columns: lineup.columns.map((column) => ({
      id: column,
      header: column,
    })),
    rows: lineup.rows.map((row) => ({
      key: row.label,
      rowHeader: row.label,
      cells: row.values,
    })),
  };
}

/** Product template lineup — MMS-32 / MMS-63 / MMS-100 (hardcoded) */
function ProductTemplateLineupTable() {
  const img = (name: string, ext: "webp" | "png" = "webp") =>
    `/pub/img/devices-systems/lineup/lineup_mms_${name}.${ext}`;

  const productType =
    "Standard(S), High Breaking(H), Instantaneous(HI)";

  return (
    <div className="devices_product_lineup__grids devices_product_lineup__grids--product-template">
      <DevicesProductLineupGrid modifier="type1" layout="metasol">
        <div className="devices_product_lineup__table devices_product_lineup__table--product-template">
          <table>
              <colgroup>
                <col />
                <col />
                <col />
                <col />
              </colgroup>
              <thead>
                <tr>
                  <th scope="col">Item</th>
                  <th scope="col">
                    <MetasolFrameMedia image={img("32")} label="MMS-32" />
                  </th>
                  <th scope="col">
                    <MetasolFrameMedia image={img("63")} label="MMS-63" />
                  </th>
                  <th scope="col">
                    <MetasolFrameMedia image={img("100", "png")} label="MMS-100" />
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <th scope="row">Frame Size</th>
                  <td>32 AF</td>
                  <td>63 AF</td>
                  <td>100 AF</td>
                </tr>
                <tr data-tall="">
                  <th scope="row">Product Type</th>
                  <td>{productType}</td>
                  <td>{productType}</td>
                  <td>{productType}</td>
                </tr>
                <tr>
                  <th scope="row">Pole</th>
                  <td>3 Pole</td>
                  <td>3 Pole</td>
                  <td>3 Pole</td>
                </tr>
                <tr>
                  <th scope="row">Rated Operational Current</th>
                  <td>0.16~40 A</td>
                  <td>10~65 A</td>
                  <td>17~100 A</td>
                </tr>
                <tr>
                  <th scope="row">Current Setting Range</th>
                  <td>0.1~40 A</td>
                  <td>6~65 A</td>
                  <td>11~100 A</td>
                </tr>
                <tr>
                  <th scope="row">Rated Operational Voltage</th>
                  <td>Up to 690 V</td>
                  <td>Up to 690 V</td>
                  <td>Up to 690 V</td>
                </tr>
                <tr>
                  <th scope="row">Rated Insulation Voltage</th>
                  <td>690 V</td>
                  <td>1000 V</td>
                  <td>1000 V</td>
                </tr>
                <tr>
                  <th scope="row">Rated Impulse Withstand Voltage</th>
                  <td>6 kV</td>
                  <td>8 kV</td>
                  <td>8 kV</td>
                </tr>
              </tbody>
          </table>
        </div>
      </DevicesProductLineupGrid>
    </div>
  );
}

/** H100 Plus — docs/product-etc-line-up-tables-lv.txt (Ratings + Options in product-data) */
function H100PlusLineupTable() {
  const product = lineupLvProducts.find((item) => item.id === "h100-plus");
  if (!product) return null;

  return (
    <div className="devices_product_lineup__grids">
      <DevicesProductLineupGrid modifier="type1">
        <div
          data-slug="product-data"
          data-slugkey="product_etc.line_up"
          dangerouslySetInnerHTML={{ __html: product.html }}
        />
      </DevicesProductLineupGrid>
    </div>
  );
}

function resolveLineupTables(
  variant: ProductLineupVariant,
  items: ProductLineupRow[],
  frameLineup?: ProductFrameLineup,
): LineupTableModel[] {
  const tables: LineupTableModel[] = [];

  if (items.length > 0) {
    tables.push(buildMccbTable(items));
  }

  if (frameLineup) {
    tables.push(buildFrameTable(frameLineup));
  }

  if (tables.length > 0) {
    return tables;
  }

  if (variant === "type2" && frameLineup) {
    return [buildFrameTable(frameLineup)];
  }

  if (variant === "type1" && items.length > 0) {
    return [buildMccbTable(items)];
  }

  return [];
}

export default function DevicesProductLineup({
  items = [],
  frameLineup,
  table,
  variant = "type1",
  configuratorHref = "",
  configuratorExternal = false,
}: DevicesProductLineupProps) {
  const configuratorProps = configuratorExternal
    ? { target: "_blank", rel: "noopener noreferrer" }
    : {};
  const tables =
    table === "susol-frame" ||
    table === "metasol-ms" ||
    table === "susol-ul-smart-mccb" ||
    table === "h100-plus" ||
    table === "product-template"
      ? []
      : resolveLineupTables(variant, items, frameLineup);

  return (
    <section className="devices_product_lineup" id="product-lineup">
      <div className="inner">
        <h2 className="section_tit">Lineup</h2>
        {table === "susol-frame" ? (
          <SusolFrameLineupTable />
        ) : table === "metasol-ms" ? (
          <div className="devices_product_lineup__grids">
            <MetasolMsLineupTable />
          </div>
        ) : table === "susol-ul-smart-mccb" ? (
          <div className="devices_product_lineup__grids">
            <SusolUlSmartMccbLineupTable />
          </div>
        ) : table === "h100-plus" ? (
          <H100PlusLineupTable />
        ) : table === "product-template" ? (
          <ProductTemplateLineupTable />
        ) : tables.length > 0 ? (
          <div className="devices_product_lineup__grids">
            {tables.map((model, index) => (
              <LineupTableGrid
                key={`${model.modifier}-${model.layout ?? "default"}-${index}`}
                {...model}
              />
            ))}
          </div>
        ) : null}
        <div className="devices_product_lineup__footer">
          <div className="devices_product_lineup__note">
            {FOOTER_NOTE.map((line) => (
              <p key={line}>{line}</p>
            ))}
          </div>
          <a
            href={configuratorHref}
            className="btn-base btn-lv02 btn-lv02--solid"
            {...configuratorProps}
          >
            Go to Configurator
            <span className="icon_link-14" aria-hidden="true" />
          </a>
        </div>
      </div>
    </section>
  );
}

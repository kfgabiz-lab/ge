import { Fragment, type ReactNode } from "react";
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
   * `h100-plus` — Figma 6843:65056
   * `product-template` — MMS-32 / 63 / 100 lineup (template page)
   * (미지정 시 items / frameLineup으로 동적 생성)
   */
  table?: "susol-frame" | "metasol-ms" | "h100-plus" | "product-template";
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

/** product_etc.line_up styles — rendered in <style> above <table> */
const PRODUCT_ETC_LINE_UP_STYLE = `
/* product_etc.line_up — Figma 6788:8458 */

/* frame-media img — PC / mobile shared */
section.devices_product_lineup [data-slugkey="product_etc.line_up"]
  .devices_product_lineup__frame-media {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 136px;
  height: 136px;
  margin: 0 auto 12px;
  overflow: hidden;
}

section.devices_product_lineup [data-slugkey="product_etc.line_up"]
  .devices_product_lineup__frame-media
  img {
  display: block;
  width: 100%;
  height: 100%;
  object-fit: contain;
}

@media (min-width: 781px) {
  section.devices_product_lineup [data-slugkey="product_etc.line_up"]
    table {
    min-width: 1224px;
  }

  section.devices_product_lineup [data-slugkey="product_etc.line_up"]
    col:nth-child(1) {
    width: 180px;
  }

  section.devices_product_lineup [data-slugkey="product_etc.line_up"]
    col:nth-child(2) {
    width: 200px;
  }

  section.devices_product_lineup [data-slugkey="product_etc.line_up"]
    col:nth-child(n + 3) {
    width: 211px;
  }

  section.devices_product_lineup [data-slugkey="product_etc.line_up"]
    table
    thead
    th {
    height: 222px;
    min-height: 222px;
    padding: 24px 16px;
    font-size: 16px;
    font-weight: 600;
    line-height: 26px;
    text-align: center;
    vertical-align: middle;
    color: #222;
    background: #f5f7fa;
    border-right: 1px solid #ddd;
    border-bottom: 1px solid #ddd;
  }

  section.devices_product_lineup [data-slugkey="product_etc.line_up"]
    table
    thead
    th:first-child {
    height: auto;
    min-height: 0;
    padding: 20px 16px;
    font-size: 16px;
    line-height: 22px;
  }

  section.devices_product_lineup [data-slugkey="product_etc.line_up"]
    table
    thead
    th:last-child {
    border-right: 0;
  }

  section.devices_product_lineup [data-slugkey="product_etc.line_up"]
    table
    thead
    th
    p {
    margin: 0;
    font-size: 16px;
    font-weight: 600;
    line-height: 26px;
    color: #222;
    white-space: nowrap;
  }

  section.devices_product_lineup [data-slugkey="product_etc.line_up"]
    table
    tbody
    th,
  section.devices_product_lineup [data-slugkey="product_etc.line_up"]
    table
    tbody
    td {
    height: 80px;
    min-height: 80px;
    padding: 16px;
    font-size: 16px;
    line-height: 24px;
    text-align: center;
    vertical-align: middle;
    border-right: 1px solid #ddd;
    border-bottom: 1px solid #ddd;
  }

  section.devices_product_lineup [data-slugkey="product_etc.line_up"]
    table
    tbody
    th.devices_product_lineup__category {
    display: table-cell;
    width: 180px;
    height: auto;
    min-height: 0;
    padding: 16px;
    font-weight: 600;
    line-height: 24px;
    color: #222;
    background: #f5f7fa;
  }

  section.devices_product_lineup [data-slugkey="product_etc.line_up"]
    table
    tbody
    th.devices_product_lineup__label {
    display: table-cell;
    width: 200px;
    height: 80px;
    min-height: 80px;
    padding: 16px 20px;
    font-weight: 400;
    color: #222;
    background: #f5f7fa;
  }

  section.devices_product_lineup [data-slugkey="product_etc.line_up"]
    table
    tbody
    td {
    font-weight: 400;
    color: #222;
    background: #fff;
  }

  section.devices_product_lineup [data-slugkey="product_etc.line_up"]
    table
    tbody
    td:last-child {
    border-right: 0;
  }
}

@media (max-width: 780px) {
  section.devices_product_lineup [data-slugkey="product_etc.line_up"]
    table {
    min-width: 1224px;
  }

  section.devices_product_lineup [data-slugkey="product_etc.line_up"]
    col:nth-child(1) {
    width: 180px;
  }

  section.devices_product_lineup [data-slugkey="product_etc.line_up"]
    col:nth-child(2) {
    width: 200px;
  }

  section.devices_product_lineup [data-slugkey="product_etc.line_up"]
    col:nth-child(n + 3) {
    width: 211px;
  }

  section.devices_product_lineup [data-slugkey="product_etc.line_up"]
    table
    thead
    th {
    height: 222px;
    min-height: 222px;
    padding: 24px 16px;
    font-size: 13px;
    line-height: 18px;
    background: #f5f7fa;
    border-right: 1px solid #ddd;
    border-bottom: 1px solid #ddd;
  }

  section.devices_product_lineup [data-slugkey="product_etc.line_up"]
    table
    thead
    th:first-child {
    height: auto;
    min-height: 0;
    padding: 20px 16px;
  }

  section.devices_product_lineup [data-slugkey="product_etc.line_up"]
    table
    thead
    th
    p {
    font-size: 12px;
    line-height: 18px;
    white-space: normal;
  }

  section.devices_product_lineup [data-slugkey="product_etc.line_up"]
    table
    tbody
    th,
  section.devices_product_lineup [data-slugkey="product_etc.line_up"]
    table
    tbody
    td {
    height: auto;
    min-height: 56px;
    padding: 12px 10px;
    font-size: 13px;
    line-height: 19px;
  }

  section.devices_product_lineup [data-slugkey="product_etc.line_up"]
    table
    tbody
    th.devices_product_lineup__category,
  section.devices_product_lineup [data-slugkey="product_etc.line_up"]
    table
    tbody
    th.devices_product_lineup__label {
    display: table-cell;
    background: #f5f7fa;
  }
}
`;

/** Figma 6788:8458 — Metasol MS lineup (hardcoded) */
function MetasolMsLineupTable() {
  const img = (name: string) =>
    `/pub/img/devices-systems/lineup/lineup_metasol_ms_${name}.png`;

  return (
    <DevicesProductLineupGrid modifier="type1" layout="metasol">
      <div data-slug="product-data" data-slugkey="product_etc.line_up">
        <style
          dangerouslySetInnerHTML={{ __html: PRODUCT_ETC_LINE_UP_STYLE }}
        />
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

/** Figma 6843:65056 — H100 Plus Ratings + Options (hardcoded) */
function H100PlusLineupTable() {
  return (
    <div className="devices_product_lineup__grids devices_product_lineup__grids--h100-plus">
      <h3 className="devices_product_lineup__sub-tit">Ratings</h3>
      <DevicesProductLineupGrid modifier="type2">
        <div className="devices_product_lineup__table devices_product_lineup__table--h100-plus devices_product_lineup__table--h100-plus-ratings">
          <table>
              <colgroup>
                <col />
                <col />
                <col />
                <col />
              </colgroup>
              <thead>
                <tr>
                  <th scope="col">Supply Voltages</th>
                  <th scope="col">3 x 200-240VAC</th>
                  <th scope="col">3 x 380-480VAC</th>
                  <th scope="col">3 x 525-600VAC</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <th scope="row" rowSpan={2}>
                    Power Range
                  </th>
                  <td>1-125HP</td>
                  <td>1-1000HP</td>
                  <td>7.5-400HP</td>
                </tr>
                <tr>
                  <td>0.75-90kW</td>
                  <td>0.75-750kW</td>
                  <td>5.5-300kW</td>
                </tr>
              </tbody>
            </table>
          </div>
        </DevicesProductLineupGrid>

        <h3 className="devices_product_lineup__sub-tit">Options</h3>
        <DevicesProductLineupGrid modifier="type2">
          <div className="devices_product_lineup__table devices_product_lineup__table--h100-plus devices_product_lineup__table--h100-plus-options">
            <table>
              <colgroup>
                <col />
                <col />
                <col />
              </colgroup>
              <tbody>
                <tr>
                  <th scope="rowgroup" rowSpan={7}>
                    Communication
                  </th>
                  <th scope="row" rowSpan={2}>
                    Ethernet
                  </th>
                  <td>EtherNet IP/ Modbus TCP (2-Port)</td>
                </tr>
                <tr>
                  <td>RAPIEnet+</td>
                </tr>
                <tr>
                  <th scope="row" rowSpan={2}>
                    FieldBus
                  </th>
                  <td>Modbus RTU (Built-in)</td>
                </tr>
                <tr>
                  <td>LS INV 485 (Built-in)</td>
                </tr>
                <tr>
                  <th scope="row" rowSpan={3}>
                    BAS (Building Automation)
                  </th>
                  <td>BACnet/MSTP (Built-in)</td>
                </tr>
                <tr>
                  <td>Lonworks (Built-in)</td>
                </tr>
                <tr>
                  <td>MetaSys N2 (Built-in)</td>
                </tr>
                <tr data-other="">
                  <th scope="row" colSpan={2}>
                    Other
                  </th>
                  <td>
                    Extension I/O, Remote cable (2/3m), Flange, Conduit,
                    Disconnect switch
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
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

import LineupHvAllTables from "../../components/product/LineupHvAllTables";
import "@/assets/css/devices-systems.css";
import "@/assets/css/devices-product-detail.css";

/**
 * Lineup HV preview — breadcrumb + product_etc.line_up tables only
 * from docs/product-etc-line-up-tables-hv.txt
 */
export default function LineupHvPage() {
  return (
    <main className="devices-page devices-page--product" id="Page_devices_lineup_hv">
      <LineupHvAllTables />
    </main>
  );
}

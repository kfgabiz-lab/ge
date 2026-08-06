import LineupDcAllTables from "../../components/product/LineupDcAllTables";
import "@/assets/css/devices-systems.css";
import "@/assets/css/devices-product-detail.css";

/**
 * Lineup DC preview — breadcrumb + product_etc.line_up tables only
 * from docs/product-etc-line-up-tables-dc.txt
 */
export default function LineupDcPage() {
  return (
    <main className="devices-page devices-page--product" id="Page_devices_lineup_dc">
      <LineupDcAllTables />
    </main>
  );
}

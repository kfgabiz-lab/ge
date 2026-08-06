import LineupLvAllTables from "../../components/product/LineupLvAllTables";
import "@/assets/css/devices-systems.css";
import "@/assets/css/devices-product-detail.css";

/**
 * Lineup LV preview — breadcrumb + product_etc.line_up tables only
 * from docs/product-etc-line-up-tables.txt
 */
export default function LineupLvPage() {
  return (
    <main className="devices-page devices-page--product" id="Page_devices_lineup_lv">
      <LineupLvAllTables />
    </main>
  );
}

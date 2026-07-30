import LineupMvAllTables from "../../components/product/LineupMvAllTables";
import "@/assets/css/devices-systems.css";
import "@/assets/css/devices-product-detail.css";

/**
 * Lineup MV preview — breadcrumb + product_etc.line_up tables only
 * from docs/product-etc-line-up-tables-mv.txt
 */
export default function LineupMvPage() {
  return (
    <main className="devices-page devices-page--product" id="Page_devices_lineup_mv">
      <LineupMvAllTables />
    </main>
  );
}

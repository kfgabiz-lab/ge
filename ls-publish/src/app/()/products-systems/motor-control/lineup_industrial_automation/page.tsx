import LineupIaAllTables from "../../components/product/LineupIaAllTables";
import "@/assets/css/devices-systems.css";
import "@/assets/css/devices-product-detail.css";

/**
 * Lineup Industrial Automation preview — breadcrumb + product_etc.line_up tables only
 * from docs/product-etc-line-up-tables-ia.txt
 */
export default function LineupIndustrialAutomationPage() {
  return (
    <main
      className="devices-page devices-page--product"
      id="Page_devices_lineup_industrial_automation"
    >
      <LineupIaAllTables />
    </main>
  );
}

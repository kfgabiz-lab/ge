import WhereToBuyContents from "./components/WhereToBuyContents";
import WhereToBuySearch from "./components/WhereToBuySearch";
import WhereToBuyTitle from "./components/WhereToBuyTitle";
import "@/assets/css/support.css";

export default function WhereToBuyPage() {
  return (
    <main
      className="support-page support-page--where-to-buy"
      id="Page_support_where_to_buy"
    >
      <WhereToBuyTitle />
      <WhereToBuySearch />
      <WhereToBuyContents />
    </main>
  );
}

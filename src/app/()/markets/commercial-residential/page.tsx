import MarketsHero from "../components/MarketsHero";
import MarketsIntro from "../components/MarketsIntro";
import MarketsExplore from "../components/MarketsExplore";
import MarketsReferences from "../components/MarketsReferences";
import MarketsBenefits from "../components/MarketsBenefits";
import MarketsWhy from "../components/MarketsWhy";
import MarketsProducts from "../components/MarketsProducts";
import HighlightNewsSection from "@/components/content/HighlightNewsSection";
import { marketsHighlightNewsItems } from "../data/marketsHighlights";
import MarketsFaq from "../components/MarketsFaq";
import CommonBanner01 from "@/components/banners/CommonBanner01";
import "@/assets/css/markets.css";

export default function MarketsCommercialResidentialPage() {
  return (
    <main className="markets-page" id="Page_markets">
      <MarketsHero />
      <MarketsIntro />
      <MarketsExplore />
      <MarketsReferences />
      <MarketsBenefits />
      <MarketsWhy />
      <MarketsProducts />
      <CommonBanner01 />
      <HighlightNewsSection
        variant="markets"
        title="Highlights"
        items={marketsHighlightNewsItems}
        sectionId="markets-highlights"
      />
      <MarketsFaq />
    </main>
  );
}

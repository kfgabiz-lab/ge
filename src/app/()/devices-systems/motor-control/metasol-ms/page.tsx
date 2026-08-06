import HighlightNewsSection from "@/components/content/HighlightNewsSection";
import CommonBanner04 from "@/components/banners/CommonBanner04";
import DevicesHelp from "../../components/DevicesHelp";
import DevicesMarkets from "../../components/DevicesMarkets";
import CommonBanner02 from "@/components/banners/CommonBanner02";
import CommonBanner03 from "@/components/banners/CommonBanner03";
import DevicesProductDownloads from "../../components/product/DevicesProductDownloads";
import DevicesProductHero from "../../components/product/DevicesProductHero";
import DevicesProductKeyFeatures from "../../components/product/DevicesProductKeyFeatures";
import DevicesProductLineup from "../../components/product/DevicesProductLineup";
import DevicesProductNavScope from "../../components/product/DevicesProductNavScope";
import DevicesProductOtherProducts from "../../components/product/DevicesProductOtherProducts";
import DevicesProductVideo from "../../components/product/DevicesProductVideo";
import { motorControlHighlights } from "../../data/motorControlContent";
import { metasolMsDetail } from "../../data/productDetailContent";
import "@/assets/css/devices-systems.css";
import "@/assets/css/devices-product-detail.css";

export default function MetasolMsProductPage() {
  return (
    <main className="devices-page devices-page--product" id="Page_devices_metasol_ms">
      <DevicesProductHero product={metasolMsDetail} />
      <DevicesProductNavScope>
        <DevicesProductKeyFeatures items={metasolMsDetail.keyFeatures} />
        <CommonBanner02
          linkHref={metasolMsDetail.configuratorHref}
          linkExternal={metasolMsDetail.configuratorExternal}
          backgroundSrc={metasolMsDetail.configuratorBannerBg}
        />
        <DevicesProductLineup items={metasolMsDetail.lineup} />
        <DevicesProductDownloads items={metasolMsDetail.downloads} />
        <CommonBanner03 youtubeVideoId={metasolMsDetail.youtubeVideoId} />
        <DevicesProductVideo youtubeVideoId={metasolMsDetail.youtubeVideoId} />
        <DevicesProductOtherProducts items={metasolMsDetail.otherProducts} />
        <div id="product-markets">
          <DevicesMarkets />
        </div>
        <DevicesHelp variant="overlay" sectionId="product-help" />
      </DevicesProductNavScope>
      <CommonBanner04 />
      <HighlightNewsSection
        variant="markets"
        title="Highlights"
        items={motorControlHighlights}
        sectionId="devices-highlights"
      />
    </main>
  );
}

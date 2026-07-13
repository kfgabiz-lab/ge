import HighlightNewsSection from "@/components/content/HighlightNewsSection";
import CommonBanner04 from "@/components/banners/CommonBanner04";
import CommonFaq from "@/components/faq/CommonFaq";
import DevicesHelp from "../../components/DevicesHelp";
import DevicesMarkets from "../../components/DevicesMarkets";
import CommonBanner02 from "@/components/banners/CommonBanner02";
import CommonBanner03 from "@/components/banners/CommonBanner03";
import DevicesProductDownloads from "../../components/product/DevicesProductDownloads";
import DevicesProductHero from "../../components/product/DevicesProductHero";
import DevicesProductFeaturesSection from "@/components/content/DevicesProductFeaturesSection";
import DevicesProductLineup from "../../components/product/DevicesProductLineup";
import DevicesProductNavScope from "../../components/product/DevicesProductNavScope";
import DevicesProductOtherProducts from "../../components/product/DevicesProductOtherProducts";
import DevicesProductVideo from "../../components/product/DevicesProductVideo";
import { motorControlHighlights } from "../../data/motorControlContent";
import {
  productTemplateDetail,
  productTemplateFaqItems,
} from "../../data/productDetailContent";
import "@/assets/css/devices-systems.css";
import "@/assets/css/devices-product-detail.css";

/** Product detail template — copy of `/motor-control/h100_plus` */
export default function ProductTemplatePage() {
  return (
    <main
      className="devices-page devices-page--product"
      id="Page_devices_product_template"
    >
      <DevicesProductHero product={productTemplateDetail} />
      <DevicesProductNavScope>
        <DevicesProductFeaturesSection
          title="Key Features"
          items={productTemplateDetail.keyFeatures}
        />
        <CommonBanner02
          variant="expert"
          linkHref={productTemplateDetail.expertBannerHref}
          linkExternal={productTemplateDetail.expertBannerExternal}
          contactEmail={productTemplateDetail.expertContactEmail}
          backgroundSrc={productTemplateDetail.configuratorBannerBg}
        />
        <DevicesProductLineup
          table="h100-plus"
          configuratorHref={productTemplateDetail.configuratorHref}
          configuratorExternal={productTemplateDetail.configuratorExternal}
        />
        <DevicesProductDownloads items={productTemplateDetail.downloads} />
        <CommonBanner03 />
        <DevicesProductVideo youtubeVideoId={productTemplateDetail.youtubeVideoId} />
        <DevicesProductOtherProducts items={productTemplateDetail.otherProducts} />
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
      <CommonFaq
        sectionId="product-faq"
        defaultOpenIndex={-1}
        description={
          <>
            Find quick answers to common questions about installation, troubleshooting, and
            maintenance.
            <br />
            Our expert engineering team has curated these responses to help you optimize product
            performance.
          </>
        }
        items={productTemplateFaqItems}
      />
    </main>
  );
}

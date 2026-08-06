import HighlightNewsSection from "@/components/content/HighlightNewsSection";
import CommonBanner04 from "@/components/banners/CommonBanner04";
import DevicesHelp from "../../components/DevicesHelp";
import DevicesMarkets from "../../components/DevicesMarkets";
import CommonBanner03 from "@/components/banners/CommonBanner03";
import DevicesHvdcHero from "../../components/product/DevicesHvdcHero";
import DevicesHvdcOverview from "../../components/product/DevicesHvdcOverview";
import DevicesProductApplications from "../../components/product/DevicesProductApplications";
import DevicesProductBenefits from "../../components/product/DevicesProductBenefits";
import DevicesProductDownloads from "../../components/product/DevicesProductDownloads";
import DevicesProductNavScope from "../../components/product/DevicesProductNavScope";
import DevicesProductOtherProducts from "../../components/product/DevicesProductOtherProducts";
import DevicesProductWhy from "../../components/product/DevicesProductWhy";
import { motorControlHighlights } from "../../data/motorControlContent";
import {
  hvdcApplicationsSection,
  hvdcBenefitsSection,
  hvdcDownloads,
  hvdcNavItems,
  hvdcOtherProducts,
  hvdcWhySection,
  hvdcYoutubeVideoId,
} from "../../data/hvdcContent";
import "@/assets/css/devices-systems.css";
import "@/assets/css/devices-product-detail.css";

export default function HvdcProductPage() {
  return (
    <main
      className="devices-page devices-page--product devices-page--hvdc"
      id="Page_devices_hvdc"
    >
      <DevicesHvdcHero />
      <DevicesProductNavScope navItems={hvdcNavItems}>
        <DevicesHvdcOverview />
        <DevicesProductBenefits
          title={hvdcBenefitsSection.title}
          subtitle={hvdcBenefitsSection.subtitle}
          items={hvdcBenefitsSection.items}
        />
        <DevicesProductApplications
          title={hvdcApplicationsSection.title}
          description={hvdcApplicationsSection.description}
          items={hvdcApplicationsSection.items}
        />
        <DevicesProductWhy
          title={hvdcWhySection.title}
          blocks={hvdcWhySection.blocks}
        />
        <DevicesProductDownloads items={hvdcDownloads} />
        <CommonBanner03 youtubeVideoId={hvdcYoutubeVideoId} />
        <DevicesProductOtherProducts items={hvdcOtherProducts} />
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

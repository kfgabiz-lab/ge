import Link from "next/link";
import { articleDetailClass } from "@/app/()/company/articleDetailClass";
import CompanyArticleDetail from "@/app/()/company/components/CompanyArticleDetail";
import {
  blogDetailBullets,
  blogDetailHero,
  blogDetailPager,
  blogDetailParagraphs,
  blogDetailTailParagraphs,
} from "@/app/()/company/data/blogDetailContent";
import {
  eventsDetailBullets,
  eventsDetailHero,
  eventsDetailMeta,
  eventsDetailPager,
} from "@/app/()/company/data/eventsDetailContent";
import {
  pressDetailBullets,
  pressDetailHero,
  pressDetailPager,
  pressDetailParagraphs,
  pressDetailYoutube,
} from "@/app/()/company/data/pressDetailContent";
import DevicesProductVideoPlayer from "@/components/video/DevicesProductVideoPlayer";
import { pressFeatured } from "@/app/()/company/data/pressListContent";
import CompanyPressEmpty from "@/app/()/company/components/CompanyPressEmpty";
import CompanyPressFeatured from "@/app/()/company/components/CompanyPressFeatured";
import CompanyEventsCalendar from "@/app/()/company/components/CompanyEventsCalendar";
import CompanyEventsFeatured from "@/app/()/company/components/CompanyEventsFeatured";
import CompanyEventsPastSection from "@/app/()/company/components/CompanyEventsPastSection";
import {
  eventsCalendarMonths,
  eventsFeaturedItems,
  eventsPastItems,
} from "@/app/()/company/data/eventsListContent";
import CompanyPressListSection from "@/app/()/company/components/CompanyPressListSection";
import CompanyPressTitle from "@/app/()/company/components/CompanyPressTitle";
import CommonBanner01 from "@/components/banners/CommonBanner01";
import CommonBanner02 from "@/components/banners/CommonBanner02";
import CommonBanner03Link from "@/components/banners/CommonBanner03Link";
import CommonBanner04 from "@/components/banners/CommonBanner04";
import HighlightNewsSection from "@/components/content/HighlightNewsSection";
import CommonFaq from "@/components/faq/CommonFaq";
import SectionGuideBlock from "@/components/guide/SectionGuideBlock";
import { mainHighlightNewsItems } from "@/data/highlightNews";
import IconCards from "@/app/main/components/IconCards";
import MainCards from "@/app/main/components/MainCards";
import MainInfo from "@/app/main/components/MainInfo";
import MainProducts from "@/app/main/components/MainProducts";
import MainVisual from "@/app/main/components/MainVisual";
import WhatWeDoSwiper from "@/app/main/components/WhatWeDoSwiper";
import DevicesCategoryList from "@/app/()/devices-systems/components/DevicesCategoryList";
import DevicesHelp from "@/app/()/devices-systems/components/DevicesHelp";
import DevicesHero from "@/app/()/devices-systems/components/DevicesHero";
import DevicesMarkets from "@/app/()/devices-systems/components/DevicesMarkets";
import DevicesHvdcHero from "@/app/()/devices-systems/components/product/DevicesHvdcHero";
import DevicesHvdcOverview from "@/app/()/devices-systems/components/product/DevicesHvdcOverview";
import DevicesProductApplications from "@/app/()/devices-systems/components/product/DevicesProductApplications";
import DevicesProductBenefits from "@/app/()/devices-systems/components/product/DevicesProductBenefits";
import DevicesProductDownloads from "@/app/()/devices-systems/components/product/DevicesProductDownloads";
import DevicesProductHero from "@/app/()/devices-systems/components/product/DevicesProductHero";
import DevicesProductKeyFeatures from "@/app/()/devices-systems/components/product/DevicesProductKeyFeatures";
import DevicesProductLineup from "@/app/()/devices-systems/components/product/DevicesProductLineup";
import DevicesProductOtherProducts from "@/app/()/devices-systems/components/product/DevicesProductOtherProducts";
import DevicesProductVideo from "@/app/()/devices-systems/components/product/DevicesProductVideo";
import DevicesProductWhy from "@/app/()/devices-systems/components/product/DevicesProductWhy";
import {
  hvdcApplicationsSection,
  hvdcBenefitsSection,
  hvdcWhySection,
} from "@/app/()/devices-systems/data/hvdcContent";
import {
  lvAutomationIntro,
  lvAutomationProducts,
} from "@/app/()/devices-systems/data/lvAutomationContent";
import { metasolMsDetail } from "@/app/()/devices-systems/data/productDetailContent";
import MarketsBenefits from "@/app/()/markets/components/MarketsBenefits";
import MarketsExplore from "@/app/()/markets/components/MarketsExplore";
import MarketsHero from "@/app/()/markets/components/MarketsHero";
import MarketsIntro from "@/app/()/markets/components/MarketsIntro";
import MarketsProducts from "@/app/()/markets/components/MarketsProducts";
import MarketsReferences from "@/app/()/markets/components/MarketsReferences";
import MarketsSolutions from "@/app/()/markets/components/MarketsSolutions";
import MarketsStats from "@/app/()/markets/components/MarketsStats";
import MarketsWhy from "@/app/()/markets/components/MarketsWhy";
import {
  dataCenterBenefits,
  dataCenterHero,
  dataCenterIntro,
  dataCenterProducts,
  dataCenterStats,
  dataCenterWhyDescription,
  dataCenterWhyItems,
} from "@/app/()/markets/data/marketsDataCenterContent";
import { faqItems } from "@/app/()/markets/data/marketsContent";
import ConnectPortalDetail from "@/app/()/support/connect-portal/components/ConnectPortalDetail";
import ConnectPortalFeatures from "@/app/()/support/connect-portal/components/ConnectPortalFeatures";
import ConnectPortalTitle from "@/app/()/support/connect-portal/components/ConnectPortalTitle";
import ConnectPortalVideo from "@/app/()/support/connect-portal/components/ConnectPortalVideo";
import DownloadCenterSearch from "@/app/()/support/download-center/components/DownloadCenterSearch";
import TechHubSearch from "@/app/()/support/tech-hub/components/TechHubSearch";
import TechHubTitle from "@/app/()/support/tech-hub/components/TechHubTitle";
import ContactUsBanner from "@/app/()/support/contact-us/components/ContactUsBanner";
import ContactUsForm from "@/app/()/support/contact-us/components/ContactUsForm";
import ContactUsTermsModalPreview from "@/app/()/support/contact-us/components/ContactUsTermsModalPreview";
import ContactUsTitle from "@/app/()/support/contact-us/components/ContactUsTitle";
import TechHubContents from "@/app/()/support/tech-hub/components/TechHubContents";
import TechHubView from "@/app/()/support/tech-hub/components/TechHubView";
import WhereToBuyContents from "@/app/()/support/where-to-buy/components/WhereToBuyContents";
import WhereToBuySearch from "@/app/()/support/where-to-buy/components/WhereToBuySearch";
import WhereToBuyTitle from "@/app/()/support/where-to-buy/components/WhereToBuyTitle";
import { connectPortalPage } from "@/data/support/connectPortalContent";
import { getSectionGuideEntry } from "@/data/sectionGuide";

function block(id: string) {
  const entry = getSectionGuideEntry(id);
  if (!entry) {
    throw new Error(`Unknown section guide entry: ${id}`);
  }
  return entry;
}

export function MainSectionPreviews() {
  return (
    <>
      <SectionGuideBlock entry={block("main_visual")}>
        <MainVisual />
      </SectionGuideBlock>
      <SectionGuideBlock entry={block("main_info")}>
        <MainInfo />
      </SectionGuideBlock>
      <SectionGuideBlock entry={block("what_we_do__inner")}>
        <WhatWeDoSwiper />
      </SectionGuideBlock>
      <SectionGuideBlock entry={block("main_cards")}>
        <MainCards />
      </SectionGuideBlock>
      <SectionGuideBlock entry={block("main_products")}>
        <MainProducts />
      </SectionGuideBlock>
      <SectionGuideBlock entry={block("icon_cards")}>
        <IconCards />
      </SectionGuideBlock>
    </>
  );
}

export function MarketsSectionPreviews() {
  return (
    <>
      <SectionGuideBlock entry={block("markets_hero")}>
        <MarketsHero
          subtitle={dataCenterHero.subtitle}
          title={dataCenterHero.title}
          heroImage={dataCenterHero.heroImage}
        />
      </SectionGuideBlock>
      <SectionGuideBlock entry={block("markets_stats")}>
        <MarketsStats items={dataCenterStats} />
      </SectionGuideBlock>
      <SectionGuideBlock entry={block("markets_intro")}>
        <MarketsIntro
          titleLines={dataCenterIntro.titleLines}
          text={dataCenterIntro.text}
        />
      </SectionGuideBlock>
      <SectionGuideBlock entry={block("markets_explore")}>
        <MarketsExplore />
      </SectionGuideBlock>
      <SectionGuideBlock entry={block("markets_references")}>
        <MarketsReferences />
      </SectionGuideBlock>
      <SectionGuideBlock entry={block("markets_benefits")}>
        <MarketsBenefits items={dataCenterBenefits} />
      </SectionGuideBlock>
      <SectionGuideBlock entry={block("markets_solutions")}>
        <MarketsSolutions />
      </SectionGuideBlock>
      <SectionGuideBlock entry={block("markets_why")}>
        <MarketsWhy
          items={dataCenterWhyItems}
          description={dataCenterWhyDescription}
        />
      </SectionGuideBlock>
      <SectionGuideBlock entry={block("markets_products")}>
        <MarketsProducts items={dataCenterProducts} />
      </SectionGuideBlock>
    </>
  );
}

export function DevicesSectionPreviews() {
  return (
    <>
      <SectionGuideBlock entry={block("devices_hero")}>
        <DevicesHero withProducts />
      </SectionGuideBlock>
      <SectionGuideBlock entry={block("devices_category")}>
        <DevicesCategoryList
          layout="stacked"
          intro={lvAutomationIntro}
          products={lvAutomationProducts}
        />
      </SectionGuideBlock>
      <SectionGuideBlock entry={block("devices_markets")}>
        <DevicesMarkets />
      </SectionGuideBlock>
      <SectionGuideBlock entry={block("devices_help")}>
        <DevicesHelp variant="overlay" sectionId="guide-devices-help" />
      </SectionGuideBlock>
    </>
  );
}

export function ProductSectionPreviews() {
  return (
    <>
      <SectionGuideBlock entry={block("devices_product_hero")}>
        <DevicesProductHero product={metasolMsDetail} />
      </SectionGuideBlock>
      <SectionGuideBlock entry={block("devices_hvdc_hero")}>
        <DevicesHvdcHero />
      </SectionGuideBlock>
      <SectionGuideBlock entry={block("devices_hvdc_overview")}>
        <DevicesHvdcOverview />
      </SectionGuideBlock>
      <SectionGuideBlock entry={block("devices_product_features")}>
        <DevicesProductKeyFeatures items={metasolMsDetail.keyFeatures} />
      </SectionGuideBlock>
      <SectionGuideBlock entry={block("devices_product_lineup")}>
        <DevicesProductLineup items={metasolMsDetail.lineup} />
      </SectionGuideBlock>
      <SectionGuideBlock entry={block("devices_product_downloads")}>
        <DevicesProductDownloads items={metasolMsDetail.downloads} />
      </SectionGuideBlock>
      <SectionGuideBlock entry={block("devices_product_video")}>
        <DevicesProductVideo youtubeVideoId={metasolMsDetail.youtubeVideoId} />
      </SectionGuideBlock>
      <SectionGuideBlock entry={block("devices_product_other")}>
        <DevicesProductOtherProducts items={metasolMsDetail.otherProducts} />
      </SectionGuideBlock>
      <SectionGuideBlock entry={block("devices_product_benefits")}>
        <DevicesProductBenefits
          title={hvdcBenefitsSection.title}
          subtitle={hvdcBenefitsSection.subtitle}
          items={hvdcBenefitsSection.items}
        />
      </SectionGuideBlock>
      <SectionGuideBlock entry={block("devices_product_applications")}>
        <DevicesProductApplications
          title={hvdcApplicationsSection.title}
          description={hvdcApplicationsSection.description}
          items={hvdcApplicationsSection.items}
        />
      </SectionGuideBlock>
      <SectionGuideBlock entry={block("devices_product_why")}>
        <DevicesProductWhy
          title={hvdcWhySection.title}
          blocks={hvdcWhySection.blocks}
        />
      </SectionGuideBlock>
    </>
  );
}

export function CommonSectionPreviews() {
  return (
    <>
      <SectionGuideBlock entry={block("common_banner_01")}>
        <CommonBanner01 />
      </SectionGuideBlock>
      <SectionGuideBlock entry={block("common_banner_02")}>
        <CommonBanner02
          linkHref={metasolMsDetail.configuratorHref}
          backgroundSrc={metasolMsDetail.configuratorBannerBg}
        />
      </SectionGuideBlock>
      <SectionGuideBlock entry={block("common_banner_03")}>
        <CommonBanner03Link
          items={[
            {
              title: "Contact Us",
              description:
                "Connect with our experts to find the right solution for your business.",
            },
            {
              title: "Where to buy",
              description:
                "Find authorized retailers and partners to purchase our products.",
            },
          ]}
        />
      </SectionGuideBlock>
      <SectionGuideBlock entry={block("common_banner_04")}>
        <CommonBanner04 />
      </SectionGuideBlock>
      <SectionGuideBlock entry={block("common_faq")}>
        <CommonFaq items={faqItems.slice(0, 3)} defaultOpenIndex={0} />
      </SectionGuideBlock>
      <SectionGuideBlock entry={block("highlight_news")}>
        <HighlightNewsSection
          variant="main"
          title="Catch up on the latest news"
          items={mainHighlightNewsItems}
          sectionId="guide-highlight-main"
        />
      </SectionGuideBlock>
    </>
  );
}

const guideBlogFeatured = {
  category: "Power Distribution & Infrastructure",
  title: "Control Panel Troubleshooting Tips Every Industrial Team Should Know",
  description:
    "Power interruptions drain an estimated $150 billion annually from the U.S. economy, and many of these costly losses start with a fault that lasts less than a second.",
  date: "Jan 23, 2026",
  image: "/img/company/blog/hero_01.png",
  tags: ["#MCCB", "#Switches", "#Panel Control"],
};

const guidePressFeatured = {
  title: "LS ELECTRIC to shake up the industry in the era of a Supercycle",
  description:
    "Stated at the annual general meeting of shareholders held on the 26th at LS Tower in Anyang.",
  date: "Apr 20, 2026",
  image: "/img/company/press/hero.png",
};

export function CompanyBlogSectionPreviews() {
  return (
    <>
      <SectionGuideBlock entry={block("company_blog_title")}>
        <section className="company-blog-title">
          <div className="inner">
            <h1 className="company-blog-title__heading">Blog</h1>
            <p className="company-blog-title__desc">
              Your Knowledge Hub for Electrical Innovation
            </p>
          </div>
        </section>
      </SectionGuideBlock>
      <SectionGuideBlock entry={block("company_blog_top")}>
        <section className="company-blog-top">
          <img
            src="/img/company/blog/hero_bg_blog.png"
            alt=""
            className="company-blog-top__bg"
          />
          <div className="inner">
            <div className="company-blog-featured__card">
              <div className="company-blog-featured__image">
                <img src={guideBlogFeatured.image} alt={guideBlogFeatured.title} />
              </div>
              <div className="company-blog-featured__content">
                <p className="company-blog-featured__category">{guideBlogFeatured.category}</p>
                <h2 className="company-blog-featured__title">{guideBlogFeatured.title}</h2>
                <p className="company-blog-featured__desc">{guideBlogFeatured.description}</p>
                <p className="company-blog-featured__date">{guideBlogFeatured.date}</p>
                <div className="company-blog-featured__tags">
                  {guideBlogFeatured.tags.map((tag) => (
                    <a key={tag} href="/company/blog/detail" className="company-blog-featured__tag">
                      {tag}
                    </a>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>
      </SectionGuideBlock>
      <SectionGuideBlock entry={block("company_blog_list")}>
        <section className="company-blog-list">
          <div className="inner">
            <ul className="company-blog-list__items">
              <li className="company-blog-list__item">
                <div className="company-blog-list__content-wrap">
                  <div className="company-blog-list__link">
                    <div className="company-blog-list__image">
                      <img src="/img/company/blog/list_01.jpg" alt="" />
                    </div>
                    <div className="company-blog-list__content">
                      <p className="company-blog__category">{guideBlogFeatured.category}</p>
                      <h3 className="company-blog-list__title">{guideBlogFeatured.title}</h3>
                      <p className="company-blog-list__desc">{guideBlogFeatured.description}</p>
                      <p className="company-blog__date">{guideBlogFeatured.date}</p>
                    </div>
                  </div>
                </div>
              </li>
            </ul>
          </div>
        </section>
      </SectionGuideBlock>
    </>
  );
}

export function CompanyArticleDetailSectionPreviews() {
  return (
    <SectionGuideBlock entry={block("company_article_detail")}>
      <div className="section-guide__article-detail-stack">
        <CompanyArticleDetail
          embedded
          variant="blog"
          pageId="guide_company_blog_detail"
          category="Power Distribution & Infrastructure"
          title="Control Panel Troubleshooting Tips Every Industrial Team Should Know"
          date="Dec 9, 2025"
          heroImage={blogDetailHero}
          pagerAriaLabel="Blog post navigation"
          prev={blogDetailPager.prev}
          next={blogDetailPager.next}
          listHref="/company/blog"
        >
          <div className={articleDetailClass("body")}>
            <p>{blogDetailParagraphs[0]}</p>
            <ul className={articleDetailClass("list")}>
              {blogDetailBullets.slice(0, 2).map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
        </CompanyArticleDetail>
        <CompanyArticleDetail
          embedded
          variant="press"
          pageId="guide_company_press_detail"
          title="LS ELECTRIC Showcases Capabilities in Energy Highway Business"
          date="Dec 9, 2025"
          heroImage={pressDetailHero}
          afterHero={
            <DevicesProductVideoPlayer
              youtubeVideoId={pressDetailYoutube.videoId}
              title={pressDetailYoutube.title}
              poster={pressDetailYoutube.poster}
            />
          }
          pagerAriaLabel="Press post navigation"
          prev={pressDetailPager.prev}
          next={pressDetailPager.next}
          listHref="/company/press"
        >
          <div className={articleDetailClass("body")}>
            <ul className={articleDetailClass("list")}>
              {pressDetailBullets.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
            <p>{pressDetailParagraphs[0]}</p>
          </div>
        </CompanyArticleDetail>
        <CompanyArticleDetail
          embedded
          variant="events"
          pageId="guide_company_events_detail"
          title="ELECS KOREA 2026"
          eventsMeta={eventsDetailMeta}
          heroImage={eventsDetailHero}
          pagerAriaLabel="Events post navigation"
          prev={eventsDetailPager.prev}
          next={eventsDetailPager.next}
          listHref="/company/events"
        >
          <div className={articleDetailClass("body")}>
            <ul className={articleDetailClass("list")}>
              {eventsDetailBullets.slice(0, 2).map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
        </CompanyArticleDetail>
      </div>
    </SectionGuideBlock>
  );
}

export function CompanyEventsSectionPreviews() {
  return (
    <>
      <SectionGuideBlock entry={block("company_events_title")}>
        <CompanyPressTitle
          heading="Events"
          description="All Planned Exhibitions and Webinars"
        />
      </SectionGuideBlock>
      <SectionGuideBlock entry={block("company_events_featured")}>
        <CompanyEventsFeatured items={eventsFeaturedItems} />
      </SectionGuideBlock>
      <SectionGuideBlock entry={block("company_events_calendar")}>
        <CompanyEventsCalendar months={eventsCalendarMonths} />
      </SectionGuideBlock>
      <SectionGuideBlock entry={block("company_events_past")}>
        <CompanyEventsPastSection items={eventsPastItems.slice(0, 3)} totalPages={1} />
      </SectionGuideBlock>
    </>
  );
}

export function CompanyPressSectionPreviews() {
  return (
    <>
      <SectionGuideBlock entry={block("company_press_title")}>
        <CompanyPressTitle />
      </SectionGuideBlock>
      <SectionGuideBlock entry={block("company_press_featured")}>
        <CompanyPressFeatured
          title={pressFeatured.title}
          description={pressFeatured.description}
          date={pressFeatured.date}
          image={pressFeatured.image}
          href={pressFeatured.href}
        />
      </SectionGuideBlock>
      <SectionGuideBlock entry={block("company_press_list")}>
        <CompanyPressListSection
          items={[
            {
              id: "guide-press-01",
              title: pressFeatured.title,
              date: pressFeatured.date,
              image: "/img/company/press/list_01.png",
            },
          ]}
          totalPages={1}
        />
      </SectionGuideBlock>
      <SectionGuideBlock entry={block("company_press_empty")}>
        <section className="company-press-list company-press-list--no-data">
          <div className="inner">
            <CompanyPressEmpty />
            <div className="company-press-list__divider" aria-hidden="true" />
          </div>
        </section>
      </SectionGuideBlock>
    </>
  );
}

export function SupportConnectSectionPreviews() {
  return (
    <>
      <SectionGuideBlock entry={block("support_connect_title")}>
        <ConnectPortalTitle />
      </SectionGuideBlock>
      <SectionGuideBlock entry={block("support_connect_video")}>
        <ConnectPortalVideo />
      </SectionGuideBlock>
      <SectionGuideBlock entry={block("support_connect_features")}>
        <ConnectPortalFeatures />
      </SectionGuideBlock>
      <SectionGuideBlock entry={block("support_connect_detail")}>
        {connectPortalPage.detailSections.map((section) => (
          <ConnectPortalDetail
            key={section.id}
            title={"title" in section ? section.title : undefined}
            titleLines={"titleLines" in section ? section.titleLines : undefined}
            description={section.description}
            bullets={section.bullets}
            image={section.image}
            imageAlt={section.imageAlt}
            reverse={section.reverse}
          />
        ))}
      </SectionGuideBlock>
    </>
  );
}

export function SupportDownloadSectionPreviews() {
  return (
    <SectionGuideBlock entry={block("support_download_search")}>
      <DownloadCenterSearch />
    </SectionGuideBlock>
  );
}

export function SupportTechHubSectionPreviews() {
  return (
    <>
      <SectionGuideBlock entry={block("support_tech_hub_title")}>
        <TechHubTitle />
      </SectionGuideBlock>
      <SectionGuideBlock entry={block("support_tech_hub_search")}>
        <TechHubSearch />
      </SectionGuideBlock>
      <SectionGuideBlock entry={block("support_tech_hub_contents")}>
        <TechHubContents />
      </SectionGuideBlock>
    </>
  );
}

export function SupportContactUsSectionPreviews() {
  return (
    <>
      <SectionGuideBlock entry={block("support_contact_title")}>
        <ContactUsTitle />
      </SectionGuideBlock>
      <SectionGuideBlock entry={block("support_contact_banner")}>
        <ContactUsBanner />
      </SectionGuideBlock>
      <SectionGuideBlock entry={block("support_contact_form")}>
        <ContactUsForm />
      </SectionGuideBlock>
      <SectionGuideBlock entry={block("support_contact_terms_modal")}>
        <ContactUsTermsModalPreview />
      </SectionGuideBlock>
    </>
  );
}

export function SupportWhereToBuySectionPreviews() {
  return (
    <>
      <SectionGuideBlock entry={block("support_where_to_buy_title")}>
        <WhereToBuyTitle />
      </SectionGuideBlock>
      <SectionGuideBlock entry={block("support_where_to_buy_search")}>
        <WhereToBuySearch />
      </SectionGuideBlock>
      <SectionGuideBlock entry={block("support_where_to_buy_contents")}>
        <WhereToBuyContents />
      </SectionGuideBlock>
    </>
  );
}

export function SupportTechHubViewSectionPreviews() {
  return (
    <SectionGuideBlock entry={block("support_tech_hub_view")}>
      <TechHubView />
    </SectionGuideBlock>
  );
}


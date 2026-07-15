import CommonBanner02 from "@/components/banners/CommonBanner02";
import {
  contactUsBanner,
  contactUsPage,
} from "@/data/support/contactUsContent";

export default function ContactUsBanner() {
  return (
    <CommonBanner02
      sectionId="support-contact-banner"
      title={contactUsBanner.title}
      description={[...contactUsBanner.description]}
      linkHref={contactUsBanner.ctaHref}
      linkLabel={contactUsBanner.ctaLabel}
      linkExternal
      linkWrapPanel={false}
      backgroundSrc={contactUsPage.bannerImage}
      decorEllipseSrcs={[
        "/img/support/contact-us/banner_ellipse_1.png",
        "/img/support/contact-us/banner_ellipse_2.png",
      ]}
    />
  );
}

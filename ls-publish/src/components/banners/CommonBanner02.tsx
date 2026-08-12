import Link from "next/link";
import type { ReactNode } from "react";
import CommonBanner02CopyLink from "./CommonBanner02CopyLink";

export type CommonBanner02Variant = "default" | "expert";
/* 260812 start */
/** CTA icon — Figma 9120:126428 uses arrow (14px) instead of link */
export type CommonBanner02LinkIcon = "link" | "arrow";
/* 260812 end */

type CommonBanner02Props = {
  variant?: CommonBanner02Variant;
  title?: string;
  description?: string[];
  linkHref?: string;
  linkLabel?: string;
  linkExternal?: boolean;
  contactEmail?: string;
  /** When false, only the CTA links — the panel stays a static block */
  linkWrapPanel?: boolean;
  /** Panel background — default is shared banner art; product pages may override */
  backgroundSrc?: string;
  backgroundSrcMo?: string;
  sectionId?: string;
  /* 260812 start */
  /** default: link icon · arrow: Icon/14px/Arrow (product expert CTA) */
  linkIcon?: CommonBanner02LinkIcon;
  /* 260812 end */
};

const DEFAULT_BACKGROUND_SRC = "/pub/img/devices/product/banner_configurator_bg.png";
const DEFAULT_BACKGROUND_SRC_MO =
  "/pub/img/devices/product/banner_configurator_bg_mo.png";

const DEFAULT_TITLE = "Consult with an LS ELECTRIC Expert";
const DEFAULT_EXPERT_TITLE = "Connect with Our Product Expert";
const DEFAULT_DESCRIPTION = [
  "Have a general question not related to quotes or technical service?",
  "Leave us a message and our team will get back to you.",
];
const DEFAULT_EXPERT_DESCRIPTION = [
  "Reach out to our dedicated specialist for technical inquiries and product support.",
];
const DEFAULT_LINK_LABEL = "Go to Configurator";
const DEFAULT_EXPERT_LINK_LABEL = "Send an Inquiry";
const DEFAULT_EXPERT_EMAIL = "automation_support.us@lselectricamerica.com";

function isExternalHref(href: string) {
  return href.startsWith("http://") || href.startsWith("https://");
}

/* 260812 start */
function isMailtoHref(href: string) {
  return href.startsWith("mailto:");
}
/* 260812 end */

function BannerLink({
  href,
  linkExternal,
  className,
  children,
}: {
  href: string;
  linkExternal?: boolean;
  className: string;
  children: ReactNode;
}) {
  /* 260812 start */
  if (isMailtoHref(href)) {
    return (
      <a href={href} className={className}>
        {children}
      </a>
    );
  }
  /* 260812 end */

  if (linkExternal || isExternalHref(href)) {
    return (
      <a
        href={href}
        className={className}
        target="_blank"
        rel="noopener noreferrer"
      >
        {children}
      </a>
    );
  }

  return (
    <Link href={href} className={className}>
      {children}
    </Link>
  );
}

function CommonBanner02Link({
  href,
  linkExternal,
  linkLabel,
  /* 260812 start */
  linkIcon,
  /* 260812 end */
}: {
  href?: string;
  linkExternal?: boolean;
  linkLabel: string;
  /* 260812 start */
  linkIcon: CommonBanner02LinkIcon;
  /* 260812 end */
}) {
  /* 260812 start */
  const iconClass =
    linkIcon === "arrow" ? "icon_arrow-14" : "icon_link-14";
  /* 260812 end */
  const content = (
    <>
      {linkLabel}
      <span className="btn-text-30__icon">
        {/* 260812 start */}
        <span className={iconClass} aria-hidden="true" />
        {/* 260812 end */}
      </span>
    </>
  );

  if (!href) {
    return <span className="btn-text-30 common_banner_02__link">{content}</span>;
  }

  return (
    <BannerLink
      href={href}
      linkExternal={linkExternal}
      className="btn-text-30 common_banner_02__link"
    >
      {content}
    </BannerLink>
  );
}

function CommonBanner02Panel({
  variant,
  title,
  description,
  linkHref,
  linkLabel,
  linkExternal,
  contactEmail,
  backgroundSrc,
  backgroundSrcMo,
  /* 260812 start */
  linkIcon,
  /* 260812 end */
}: {
  variant: CommonBanner02Variant;
  title: string;
  description: string[];
  linkHref?: string;
  linkLabel: string;
  linkExternal?: boolean;
  contactEmail?: string;
  backgroundSrc: string;
  backgroundSrcMo: string;
  /* 260812 start */
  linkIcon: CommonBanner02LinkIcon;
  /* 260812 end */
}) {
  return (
    <div className="common_banner_02__body">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        loading="lazy"
        decoding="async"
        className="common_banner_02__bg common_banner_02__bg--pc"
        src={backgroundSrc}
        alt=""
        aria-hidden
      />
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        loading="lazy"
        decoding="async"
        className="common_banner_02__bg common_banner_02__bg--mo"
        src={backgroundSrcMo}
        alt=""
        aria-hidden
      />
      {variant === "expert" ? (
        <>
          <div className="common_banner_02__content">
            <div className="common_banner_02__text">
              <h2 className="banner_tit">{title}</h2>
              <div className="txt common_banner_02__desc">
                {description.map((line) => (
                  <p key={line}>{line}</p>
                ))}
              </div>
            </div>
            {/* 260812 start */}
            {/* Figma 9120:126428 — arrow 타입은 contact(email+Copy) 없음 */}
            {contactEmail && linkIcon !== "arrow" ? (
              <div className="common_banner_02__contact">
                <a
                  href={`mailto:${contactEmail}`}
                  className="common_banner_02__email"
                >
                  {contactEmail}
                </a>
                <CommonBanner02CopyLink value={contactEmail} label="Copy Email" />
              </div>
            ) : null}
            {/* 260812 end */}
          </div>
          {/* 260812 start */}
          {/* contact 있는 타입만 CTA mailto · arrow(contact 없음)는 linkHref */}
          <CommonBanner02Link
            href={
              contactEmail && linkIcon !== "arrow"
                ? `mailto:${contactEmail}`
                : linkHref
            }
            linkExternal={linkExternal}
            linkLabel={linkLabel}
            linkIcon={linkIcon}
          />
          {/* 260812 end */}
        </>
      ) : (
        <>
          <div className="common_banner_02__text">
            <h2 className="banner_tit">{title}</h2>
            <div className="txt common_banner_02__desc">
              {description.map((line) => (
                <p key={line}>{line}</p>
              ))}
            </div>
          </div>
          {/* 260812 start */}
          <CommonBanner02Link
            href={linkHref}
            linkExternal={linkExternal}
            linkLabel={linkLabel}
            linkIcon={linkIcon}
          />
          {/* 260812 end */}
        </>
      )}
    </div>
  );
}

export default function CommonBanner02({
  variant = "default",
  title,
  description,
  linkHref,
  linkLabel,
  linkExternal,
  contactEmail,
  linkWrapPanel = true,
  backgroundSrc = DEFAULT_BACKGROUND_SRC,
  backgroundSrcMo = DEFAULT_BACKGROUND_SRC_MO,
  sectionId,
  /* 260812 start */
  linkIcon = "link",
  /* 260812 end */
}: CommonBanner02Props) {
  const resolvedTitle =
    title ?? (variant === "expert" ? DEFAULT_EXPERT_TITLE : DEFAULT_TITLE);
  const resolvedDescription =
    description ??
    (variant === "expert" ? DEFAULT_EXPERT_DESCRIPTION : DEFAULT_DESCRIPTION);
  const resolvedLinkLabel =
    linkLabel ??
    (variant === "expert" ? DEFAULT_EXPERT_LINK_LABEL : DEFAULT_LINK_LABEL);
  const resolvedContactEmail =
    variant === "expert" ? (contactEmail ?? DEFAULT_EXPERT_EMAIL) : contactEmail;

  /* 260812 start */
  const panel = (
    <CommonBanner02Panel
      variant={variant}
      title={resolvedTitle}
      description={resolvedDescription}
      linkHref={variant === "expert" || !linkWrapPanel ? linkHref : undefined}
      linkLabel={resolvedLinkLabel}
      linkExternal={linkExternal}
      contactEmail={resolvedContactEmail}
      backgroundSrc={backgroundSrc}
      backgroundSrcMo={backgroundSrcMo}
      linkIcon={linkIcon}
    />
  );
  /* 260812 end */

  const wrapPanelWithLink = Boolean(
    variant === "default" && linkHref && linkWrapPanel,
  );

  /* 260812 start */
  const sectionClassName = [
    "common_banner_02",
    variant === "expert" ? "common_banner_02--expert" : null,
    linkIcon === "arrow" ? "common_banner_02--arrow" : null,
  ]
    .filter(Boolean)
    .join(" ");
  /* 260812 end */

  return (
    <section className={sectionClassName} id={sectionId}>
      <div className="inner">
        {wrapPanelWithLink ? (
          <BannerLink
            href={linkHref!}
            linkExternal={linkExternal}
            className="common_banner_02__panel"
          >
            {panel}
          </BannerLink>
        ) : (
          <div className="common_banner_02__panel">{panel}</div>
        )}
      </div>
    </section>
  );
}

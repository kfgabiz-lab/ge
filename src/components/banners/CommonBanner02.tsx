import Link from "next/link";
import type { ReactNode } from "react";

type CommonBanner02Props = {
  title?: string;
  description?: string[];
  linkHref?: string;
  linkLabel?: string;
  linkExternal?: boolean;
  /** When false, only the CTA links — the panel stays a static block */
  linkWrapPanel?: boolean;
  /** Panel background — default is shared banner art; product pages may override */
  backgroundSrc?: string;
  decorEllipseSrcs?: readonly [string, string];
  sectionId?: string;
};

const DEFAULT_BACKGROUND_SRC = "/img/devices/product/banner_configurator_bg.png";
const DEFAULT_TITLE = "Consult with an LS ELECTRIC Expert";
const DEFAULT_DESCRIPTION = [
  "Have a general question not related to quotes or technical service?",
  "Leave us a message and our team will get back to you.",
];
const DEFAULT_LINK_LABEL = "Go to Configurator";

function isExternalHref(href: string) {
  return href.startsWith("http://") || href.startsWith("https://");
}

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
}: {
  href?: string;
  linkExternal?: boolean;
  linkLabel: string;
}) {
  const content = (
    <>
      {linkLabel}
      <span className="btn-text-30__icon">
        <span className="icon_link-14" aria-hidden="true" />
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
  title,
  description,
  linkHref,
  linkLabel,
  linkExternal,
  backgroundSrc,
  decorEllipseSrcs,
}: {
  title: string;
  description: string[];
  linkHref?: string;
  linkLabel: string;
  linkExternal?: boolean;
  backgroundSrc: string;
  decorEllipseSrcs?: readonly [string, string];
}) {
  return (
    <div className="common_banner_02__body">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        loading="lazy"
        decoding="async"
        className="common_banner_02__bg"
        src={backgroundSrc}
        alt=""
        aria-hidden
      />
      {decorEllipseSrcs ? (
        <div className="common_banner_02__decor" aria-hidden>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            className="common_banner_02__ellipse common_banner_02__ellipse--1"
            src={decorEllipseSrcs[0]}
            alt=""
          />
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            className="common_banner_02__ellipse common_banner_02__ellipse--2"
            src={decorEllipseSrcs[1]}
            alt=""
          />
        </div>
      ) : null}
      <div className="common_banner_02__text">
        <h2 className="banner_tit">{title}</h2>
        <div className="txt common_banner_02__desc">
          {description.map((line) => (
            <p key={line}>{line}</p>
          ))}
        </div>
      </div>
      <CommonBanner02Link
        href={linkHref}
        linkExternal={linkExternal}
        linkLabel={linkLabel}
      />
    </div>
  );
}

export default function CommonBanner02({
  title = DEFAULT_TITLE,
  description = DEFAULT_DESCRIPTION,
  linkHref,
  linkLabel = DEFAULT_LINK_LABEL,
  linkExternal,
  linkWrapPanel = true,
  backgroundSrc = DEFAULT_BACKGROUND_SRC,
  decorEllipseSrcs,
  sectionId,
}: CommonBanner02Props) {
  const panel = (
    <CommonBanner02Panel
      title={title}
      description={description}
      linkHref={linkWrapPanel ? undefined : linkHref}
      linkLabel={linkLabel}
      linkExternal={linkExternal}
      backgroundSrc={backgroundSrc}
      decorEllipseSrcs={decorEllipseSrcs}
    />
  );

  const wrapPanelWithLink = Boolean(linkHref && linkWrapPanel);

  return (
    <section className="common_banner_02" id={sectionId}>
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

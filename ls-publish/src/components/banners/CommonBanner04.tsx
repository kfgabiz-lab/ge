import Link from "next/link";
import type { ReactNode } from "react";

type CommonBanner04Props = {
  title?: string;
  description?: string;
  linkHref?: string;
  linkLabel?: string;
  linkExternal?: boolean;
  backgroundSrc?: string;
};

const DEFAULT_BACKGROUND_SRC = "/img/banner/bg_banner_03.png";
const DEFAULT_TITLE = "Consult with an LS ELECTRIC Expert";
const DEFAULT_DESCRIPTION =
  "Have a general question not related to quotes or technical service? Leave us a message and our team will get back to you.";
const DEFAULT_LINK_LABEL = "Send a Message";

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

export default function CommonBanner04({
  title = DEFAULT_TITLE,
  description = DEFAULT_DESCRIPTION,
  linkHref = "",
  linkLabel = DEFAULT_LINK_LABEL,
  linkExternal,
  backgroundSrc = DEFAULT_BACKGROUND_SRC,
}: CommonBanner04Props) {
  const cta = (
    <span className="btn-base btn-lv01 btn-lv01--line-solid">{linkLabel}</span>
  );

  return (
    <section className="common_banner_04">
      <div className="common_banner_04__body">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          loading="lazy"
          decoding="async"
          className="common_banner_04__bg"
          src={backgroundSrc}
          alt=""
          aria-hidden
        />
        <div className="common_banner_04__dim" aria-hidden="true" />
        <div className="inner common_banner_04__inner">
          <h2 className="common_banner_04__tit">{title}</h2>
          <p className="common_banner_04__desc">{description}</p>
          {linkHref ? (
            <BannerLink
              href={linkHref}
              linkExternal={linkExternal}
              className="common_banner_04__link"
            >
              {cta}
            </BannerLink>
          ) : (
            cta
          )}
        </div>
      </div>
    </section>
  );
}

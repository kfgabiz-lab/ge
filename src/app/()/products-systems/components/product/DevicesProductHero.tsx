import Link from "next/link";
import type { ProductDetail } from "../../data/productDetailContent";
import ProductSectionScrollLink from "./ProductSectionScrollLink";
/* 260810 start */
import ProductAwardBadge from "@/components/product/ProductAwardBadge";
/* 260810 end */

type DevicesProductHeroProps = {
  product: ProductDetail;
};

export default function DevicesProductHero({ product }: DevicesProductHeroProps) {
  /* 260810 start */
  const showAward = Boolean(product.heroAward);
  /* 260810 end */

  return (
    <section className="devices_product_hero" id="product-top">
      <div className="inner devices_product_hero__inner">
        <div
          className={
            showAward
              ? "devices_product_hero__visual devices_product_hero__visual--award"
              : "devices_product_hero__visual"
          }
        >
          {/* 260810 start */}
          <div
            className={
              showAward
                ? "devices_product_hero__img-wrap type2"
                : "devices_product_hero__img-wrap"
            }
          >
            {showAward ? <ProductAwardBadge /> : null}
            <img
              loading="eager"
              decoding="async"
              src={product.image}
              alt={product.series}
              className="devices_product_hero__img"
            />
          </div>
          {product.heroAwardCaption ? (
            <p className="devices_product_hero__award-caption">
              {product.heroAwardCaption}
            </p>
          ) : null}
          {/* 260810 end */}
        </div>
        <div className="devices_product_hero__content">
          {/* <div className="devices_product_hero__meta">
            <span className="devices_product_hero__category">{product.category}</span>
          </div> */}
          <div className="devices_product_hero__head">
            <h1 className="devices_product_hero__series">{product.series}</h1>
            {product.subtitle ? (
              <p className="devices_product_hero__subtitle">{product.subtitle}</p>
            ) : null}
          </div>
          <p className="devices_product_hero__desc">{product.description}</p>
          <hr className="devices_product_hero__line" />
          <dl className="devices_product_hero__specs">
            {product.specs.map((spec) => (
              <div key={spec.label} className="devices_product_hero__spec-row">
                <dt>{spec.label}</dt>
                <dd>{spec.value}</dd>
              </div>
            ))}
          </dl>
          <div className="devices_product_hero__btns">
            <Link
              href={product.expertBannerHref ?? "/support/contact-us"}
              prefetch={false}
              className="btn-base btn-lv01 btn-lv01--solid"
            >
              Contact Us
            </Link>
            <ProductSectionScrollLink
              sectionId="product-downloads"
              className="btn-base btn-lv01 btn-lv01--line"
            >
              Scroll to Downloads
              <span className="icon_download" aria-hidden="true" />
            </ProductSectionScrollLink>
          </div>
        </div>
      </div>
    </section>
  );
}

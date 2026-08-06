import Link from "next/link";
import type { ProductDetail } from "../../data/productDetailContent";
import ProductSectionAnchor from "./ProductSectionAnchor";

type DevicesProductHeroProps = {
  product: ProductDetail;
};

export default function DevicesProductHero({ product }: DevicesProductHeroProps) {
  return (
    <section className="devices_product_hero" id="product-top">
      <div className="inner devices_product_hero__inner">
        <div className="devices_product_hero__visual">
          <img
            loading="eager"
            decoding="async"
            src={product.image}
            alt={product.series}
            className="devices_product_hero__img"
          />
        </div>
        <div className="devices_product_hero__content">
          <div className="devices_product_hero__meta">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              loading="eager"
              decoding="async"
              src="/img/devices/product/brand_beyondx.png"
              alt="Beyond X"
              className="devices_product_hero__brand"
              width={121}
              height={24}
            />
            <span className="devices_product_hero__category">{product.category}</span>
          </div>
          <h1 className="devices_product_hero__series">{product.series}</h1>
          <p className="devices_product_hero__subtitle">{product.subtitle}</p>
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
            <Link href="" className="btn-base btn-lv01 btn-lv01--solid">
              Contact Us
            </Link>
            <ProductSectionAnchor
              sectionId="product-downloads"
              className="btn-base btn-lv01 btn-lv01--line"
            >
              Scroll to Downloads
              <span className="icon_download" aria-hidden="true" />
            </ProductSectionAnchor>
          </div>
        </div>
      </div>
    </section>
  );
}

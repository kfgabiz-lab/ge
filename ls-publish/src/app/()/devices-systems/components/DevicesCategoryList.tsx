import Link from "next/link";
import type { DevicesCategoryProduct } from "../data/vfdContent";

type DevicesCategoryIntro = {
  parentLabel: string;
  parentHref?: string;
  title: string;
  description: string;
};

type DevicesCategoryListProps = {
  intro: DevicesCategoryIntro;
  products: DevicesCategoryProduct[];
  /** split: intro left + list right (VFD) · stacked: intro top + 2-col grid (LV Automation) */
  layout?: "split" | "stacked";
};

function CategoryProductCard({
  item,
  loading = "lazy",
}: {
  item: DevicesCategoryProduct;
  loading?: "eager" | "lazy";
}) {
  return (
    <article className="devices_category__item">
      <div className="devices_category__item-img">
        <img loading={loading} decoding="async" src={item.image} alt={item.title} />
      </div>
      <div className="devices_category__item-body">
        <div className="devices_category__item-text">
          <h2 className="devices_category__item-tit">{item.title}</h2>
          <p className="devices_category__item-desc">{item.description}</p>
        </div>
        <Link href={item.href} className="btn-base btn-lv03 btn-lv03--solid">
          View Detail
        </Link>
      </div>
    </article>
  );
}

function CategoryProductCardStacked({
  item,
  loading = "lazy",
}: {
  item: DevicesCategoryProduct;
  loading?: "eager" | "lazy";
}) {
  return (
    <Link href={item.href} className="devices_category__item">
      <div className="devices_category__item-img">
        <img loading={loading} decoding="async" src={item.image} alt="" />
      </div>
      <div className="devices_category__item-body">
        <div className="devices_category__item-text">
          <h2 className="devices_category__item-tit">{item.title}</h2>
          <p className="devices_category__item-desc">{item.description}</p>
        </div>
        <span className="btn-base btn-lv03 btn-lv03--solid">View Detail</span>
      </div>
    </Link>
  );
}

export default function DevicesCategoryList({
  intro,
  products,
  layout = "split",
}: DevicesCategoryListProps) {
  if (layout === "stacked") {
    return (
      <section className="devices_category devices_category--stacked">
        <div className="inner devices_category__header">
          {intro.parentHref ? (
            <Link href={intro.parentHref} className="devices_category__parent">
              {intro.parentLabel}
            </Link>
          ) : (
            <p className="devices_category__parent">{intro.parentLabel}</p>
          )}
          <h1 className="devices_category__tit">{intro.title}</h1>
          <p className="devices_category__desc">{intro.description}</p>
        </div>
        <div className="devices_category__grid-wrap">
          <div className="inner devices_category__grid">
            {products.map((item, index) => (
              <CategoryProductCardStacked
                key={item.id}
                item={item}
                loading={index < 2 ? "eager" : "lazy"}
              />
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="devices_category">
      <div className="devices_category__layout">
        <div className="devices_category__intro">
          <div className="devices_category__intro-bg" aria-hidden="true" />
          <div className="inner devices_category__intro-inner">
            {intro.parentHref ? (
              <Link href={intro.parentHref} className="devices_category__parent">
                {intro.parentLabel}
              </Link>
            ) : (
              <p className="devices_category__parent">{intro.parentLabel}</p>
            )}
            <h1 className="devices_category__tit">{intro.title}</h1>
            <p className="devices_category__desc">{intro.description}</p>
          </div>
        </div>
        <div className="devices_category__list">
          <div className="devices_category__list-inner">
            {products.map((item, index) => (
              <CategoryProductCard
                key={item.id}
                item={item}
                loading={index === 0 ? "eager" : "lazy"}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

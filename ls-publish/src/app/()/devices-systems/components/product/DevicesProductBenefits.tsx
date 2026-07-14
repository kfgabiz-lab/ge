import type { HvdcBenefit } from "../../data/hvdcContent";

type DevicesProductBenefitsProps = {
  title: string;
  subtitle: string;
  items: HvdcBenefit[];
};

export default function DevicesProductBenefits({
  title,
  subtitle,
  items,
}: DevicesProductBenefitsProps) {
  return (
    <section className="devices_product_benefits" id="product-benefits">
      <div className="inner">
        <div className="devices_product_benefits__head">
          <h2 className="section_tit">{title}</h2>
          <p className="section_desc">{subtitle}</p>
        </div>
        <div className="devices_product_benefits__grid">
          {items.map((item) => (
            <article
              key={item.id}
              className={`devices_product_benefits__card devices_product_benefits__card--${item.icon}`}
            >
              <span
                className="devices_product_benefits__icon"
                aria-hidden="true"
              />
              <h3 className="devices_product_benefits__tit">{item.title}</h3>
              <ul className="devices_product_benefits__list">
                {item.bullets.map((bullet) => (
                  <li key={bullet}>{bullet}</li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

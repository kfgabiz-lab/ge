import type { ProductKeyFeature } from "../../data/productDetailContent";

type DevicesProductKeyFeaturesProps = {
  items: ProductKeyFeature[];
};

export default function DevicesProductKeyFeatures({
  items,
}: DevicesProductKeyFeaturesProps) {
  return (
    <section className="devices_product_features" id="product-key-feature">
      <div className="inner">
        <h2 className="section_tit">Key Feature</h2>
        <div className="devices_product_features__grid">
          {items.map((item) => (
            <article key={item.id} className="devices_product_features__card">
              <span className="devices_product_features__icon" aria-hidden="true" />
              <h3 className="devices_product_features__tit">{item.title}</h3>
              <p className="devices_product_features__desc">{item.description}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

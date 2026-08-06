import type { HvdcWhyBlock } from "../../data/hvdcContent";

type DevicesProductWhyProps = {
  title: string;
  blocks: HvdcWhyBlock[];
};

export default function DevicesProductWhy({ title, blocks }: DevicesProductWhyProps) {
  return (
    <section className="devices_product_why" id="product-why">
      <div className="inner">
        <h2 className="section_tit">{title}</h2>
        <div className="devices_product_why__blocks">
          {blocks.map((block) => (
            <div key={block.id} className="devices_product_why__block">
              <div className="devices_product_why__block-head">
                <h3 className="devices_product_why__block-tit">{block.title}</h3>
                {block.lead ? (
                  <p className="devices_product_why__block-lead">{block.lead}</p>
                ) : null}
              </div>
              <div className="devices_product_why__cards">
                {block.cards.map((card) => (
                  <article key={card.title} className="devices_product_why__card">
                    <div className="devices_product_why__card-visual">
                      <img loading="lazy" decoding="async" src={card.image} alt="" />
                    </div>
                    <div className="devices_product_why__card-body">
                      <h4 className="devices_product_why__card-tit">{card.title}</h4>
                      <p className="devices_product_why__card-desc">{card.description}</p>
                    </div>
                  </article>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

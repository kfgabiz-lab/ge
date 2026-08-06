import Link from "next/link";
import { references } from "../data/marketsContent";

export default function MarketsReferences() {
  return (
    <section className="markets_references">
      <div className="inner">
        <div className="markets_references__head">
          <h2 className="section_tit">References</h2>
          <p className="section_desc">
            Global excellence in technical infrastructure implementation.
          </p>
        </div>
        <div className="markets_references__list">
          {references.map((item) => (
            <button key={item.id} className="item">
              <div className="img_area">
                <img loading="lazy" decoding="async" src={item.image} alt={item.title} />
              </div>
              <div className="txt_area">
                <h3 className="tit">{item.title}</h3>
                <p className="txt">{item.description}</p>
                <p className="location">
                  {item.location}
                  <span className="location_sep" aria-hidden="true">
                    |
                  </span>
                  {item.country}
                </p>
              </div>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}

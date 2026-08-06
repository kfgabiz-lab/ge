import { hvdcOverview } from "../../data/hvdcContent";

export default function DevicesHvdcOverview() {
  const titleLines = hvdcOverview.title.split("\n");

  return (
    <section className="devices_hvdc_overview" id="product-overview">
      <div className="inner">
        <div
          className="devices_hvdc_overview__visual"
          style={{ backgroundImage: `url(${hvdcOverview.image})` }}
          role="img"
          aria-label={hvdcOverview.imageAlt}
        />
        <div className="devices_hvdc_overview__body">
          <h2 className="devices_hvdc_overview__title">
            {titleLines.map((line, index) => (
              <span key={line}>
                {line}
                {index < titleLines.length - 1 ? <br /> : null}
              </span>
            ))}
          </h2>
          <p className="devices_hvdc_overview__desc">{hvdcOverview.description}</p>
        </div>
      </div>
    </section>
  );
}

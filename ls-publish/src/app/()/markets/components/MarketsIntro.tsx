type MarketsIntroProps = {
  titleLines?: string[];
  text?: string;
};

const DEFAULT_TITLE_LINES = [
  "Energy-Efficient &",
  "Intelligent Building Infrastructure",
];
export default function MarketsIntro({
  titleLines = DEFAULT_TITLE_LINES,
  text,
}: MarketsIntroProps) {
  return (
    <section className="markets_intro">
      <div className="inner">
        <h2 className="markets_intro__tit">
        Powering the
        <br />
        Next Generation of AI Data Centers
        </h2>
        <p className="markets_intro__txt">
          {text ?? (
            <>
              LS ELECTRIC delivers integrated building power solutions—from
              low-voltage distribution and protection devices to BEMS, smart
              electrical rooms, and solar-PV/ESS integration. These solutions
              enhance{" "}
              <strong>
                power reliability, energy efficiency, and safety
              </strong>{" "}
              while enabling data-driven optimization and supporting sustainable,
              ESG-ready Commercial &amp; Buildings environments.
            </>
          )}
        </p>
      </div>
    </section>
  );
}

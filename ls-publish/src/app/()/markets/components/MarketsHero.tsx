import Link from "next/link";

type MarketsHeroProps = {
  subtitle?: string;
  title?: string;
  heroImage?: string;
};

const DEFAULT_SUBTITLE = "Smart & Sustainable Building Infrastructure";
const DEFAULT_TITLE = "Commercial & Residential";

export default function MarketsHero({
  subtitle = DEFAULT_SUBTITLE,
  title = DEFAULT_TITLE,
  heroImage,
}: MarketsHeroProps) {
  return (
    <section className="markets_hero">
      <div className="markets_hero__content">
        <p className="markets_hero__sub">{subtitle}</p>
        <h1 className="markets_hero__tit">{title}</h1>
        <div className="markets_hero__btns">
          <Link href="" className="btn-base btn-lv01 btn-lv01--solid">
            Contact Us
          </Link>
          <Link href="" className="btn-base btn-lv01 btn-lv01--line">
            Get the Whitepaper
            <span className="icon_download" aria-hidden="true" />
          </Link>
        </div>
      </div>
      <div
        className="hero_img"
        style={
          heroImage ? { backgroundImage: `url("${heroImage}")` } : undefined
        }
        aria-hidden="true"
      />
    </section>
  );
}

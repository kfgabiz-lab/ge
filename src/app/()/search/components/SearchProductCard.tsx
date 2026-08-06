import Link from "next/link";
import type { SearchProductItem } from "@/data/search/searchAllContent";

type SearchProductCardProps = {
  item: SearchProductItem;
};

/** Figma 6430:106958 (All) · 6430:108246 / 6571:104661 (Products) — product card */
export default function SearchProductCard({ item }: SearchProductCardProps) {
  return (
    <Link href={item.href} prefetch={false} className="search_all__product">
      <div className="search_all__product-img">
        <img src={item.image} alt="" loading="lazy" decoding="async" />
      </div>
      <div className="search_all__product-body">
        <p className="search_all__product-path">
          <span className="search_all__product-path-label">{item.category}</span>
          <span className="search_all__product-path-icon" aria-hidden />
          <span className="search_all__product-path-text">{item.highlight}</span>
        </p>
        <div className="search_all__product-text">
          <h3 className="search_all__product-tit">
            {item.title.split("\n").map((line, lineIndex) => (
              <span key={`${item.id}-tit-${lineIndex}`}>
                {lineIndex > 0 ? <br /> : null}
                {line}
              </span>
            ))}
          </h3>
          <p className="search_all__product-desc">{item.description}</p>
        </div>
      </div>
    </Link>
  );
}

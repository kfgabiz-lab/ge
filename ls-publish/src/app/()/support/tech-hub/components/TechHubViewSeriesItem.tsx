import Link from "next/link";
import type { TechHubSeriesItem } from "@/data/support/techHubContent";

type TechHubViewSeriesItemProps = {
  item: TechHubSeriesItem;
};

export default function TechHubViewSeriesItem({
  item,
}: TechHubViewSeriesItemProps) {
  /* 260812 start */
  /* series-meta: title(9145:162721) | chapter(9145:162793) 만 분기 */
  const titleLines = Array.isArray(item.title) ? item.title : [item.title];
  const itemClass = item.isActive
    ? "support_tech_hub_view__series-item support_tech_hub_view__series-item--active"
    : "support_tech_hub_view__series-item";
  const metaClass = `support_tech_hub_view__series-meta support_tech_hub_view__series-meta--${item.meta}`;

  return (
    <li className="support_tech_hub_view__series-row">
      <Link href={item.href} className={itemClass}>
        <span className="support_tech_hub_view__series-thumb" aria-hidden>
          <img src={item.poster} alt="" loading="lazy" decoding="async" />
        </span>
        <span className={metaClass}>
          {item.meta === "chapter" ? (
            <span className="support_tech_hub_view__chapter">{item.chapter}</span>
          ) : (
            <span className="support_tech_hub_view__series-tit">
              {titleLines.map((line) => (
                <span
                  key={line}
                  className="support_tech_hub_view__series-tit-line"
                >
                  {line}
                </span>
              ))}
            </span>
          )}
        </span>
      </Link>
    </li>
  );
  /* 260812 end */
}

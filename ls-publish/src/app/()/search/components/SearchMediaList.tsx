import { Fragment } from "react";
import type { SearchMediaItem } from "@/data/search/searchAllContent";
import SearchMediaListItem from "./SearchMediaListItem";
import { searchAllListClasses } from "./searchAllListClasses";

type SearchMediaListProps = {
  items: SearchMediaItem[];
  listClassName?: string;
  itemClassName?: string;
  variant?: "compact" | "card";
};

/** Figma 6430:106510 (card · All) · 6430:112128 (card · Media tab) — Media list */
export default function SearchMediaList({
  items,
  listClassName = "search_all__media",
  itemClassName = "search_all__media-item",
  variant = "compact",
}: SearchMediaListProps) {
  return (
    <ul className={listClassName}>
      {items.map((item, index) => (
        <Fragment key={item.id}>
          <li className={searchAllListClasses.item}>
            <SearchMediaListItem
              item={item}
              className={itemClassName}
              variant={variant}
            />
          </li>
          {index < items.length - 1 ? (
            <li className={searchAllListClasses.divider} aria-hidden>
              <span className={searchAllListClasses.line} />
            </li>
          ) : null}
        </Fragment>
      ))}
    </ul>
  );
}

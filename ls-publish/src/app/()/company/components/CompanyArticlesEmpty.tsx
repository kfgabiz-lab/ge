import Link from "next/link";
import { emptyStateIconSrc } from "@/data/commonAssets";

type CompanyArticlesEmptyProps = {
  viewAllHref?: string;
};

export default function CompanyArticlesEmpty({
  viewAllHref = "/company/articles",
}: CompanyArticlesEmptyProps) {
  return (
    <div className="company-articles-list__empty">
      <div className="company-articles-list__empty-icon" aria-hidden="true">
        <img src={emptyStateIconSrc} alt="" />
      </div>
      <div className="company-articles-list__empty-text">
        <p className="company-articles-list__empty-title">There are no results</p>
        <p className="company-articles-list__empty-desc">
          Check if all the words are spelled correctly
        </p>
      </div>
      <Link
        href={viewAllHref}
        className="btn-base btn-lv01 btn-lv01--solid company-articles-list__empty-btn"
      >
        View All
      </Link>
    </div>
  );
}

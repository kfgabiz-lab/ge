"use client";

import PageNumbering from "@/components/pagination/PageNumbering";
import CompanyArticlesEmpty from "@/app/()/company/components/CompanyArticlesEmpty";
import CompanyArticlesListGrid from "@/app/()/company/components/CompanyArticlesListGrid";
import CompanyArticlesListToolbar from "@/app/()/company/components/CompanyArticlesListToolbar";
import type { ArticlesListItem } from "@/app/()/company/data/articlesListContent";

type CompanyArticlesListSectionProps = {
  items?: ArticlesListItem[];
  empty?: boolean;
  detailHref?: string;
  viewAllHref?: string;
  currentPage?: number;
  totalPages?: number;
};

export default function CompanyArticlesListSection({
  items = [],
  empty = false,
  detailHref = "/company/articles/detail",
  viewAllHref = "/company/articles",
  currentPage = 1,
  totalPages = 5,
}: CompanyArticlesListSectionProps) {
  const sectionClass = empty
    ? "company-articles-list company-articles-list--no-data"
    : "company-articles-list";

  return (
    <section className={sectionClass}>
      <div className="inner">
        <CompanyArticlesListToolbar />

        <div className="company-articles-list__body">
          {empty ? (
            <CompanyArticlesEmpty viewAllHref={viewAllHref} />
          ) : (
            <>
              <CompanyArticlesListGrid items={items} detailHref={detailHref} />
              <PageNumbering
                className="company-articles-list__pagination"
                currentPage={currentPage}
                totalPages={totalPages}
                ariaLabel="Articles pagination"
              />
            </>
          )}
        </div>

        {empty ? (
          <div className="company-articles-list__divider" aria-hidden="true" />
        ) : null}
      </div>
    </section>
  );
}

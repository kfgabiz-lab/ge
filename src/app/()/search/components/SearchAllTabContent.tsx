"use client";

import Link from "next/link";
import { useState } from "react";
import SearchDocumentsCard from "./SearchDocumentsCard";
import SearchProductCard from "./SearchProductCard";
import SearchDocumentsPanel from "./SearchDocumentsPanel";
import SearchMediaList from "./SearchMediaList";
import SearchMediaPanel from "./SearchMediaPanel";
import SearchPageList from "./SearchPageList";
import SearchPagesPanel from "./SearchPagesPanel";
import SearchProductsPanel from "./SearchProductsPanel";
import {
  /* 260812 start */
  searchAllAiSummaryHtml,
  searchAllAiSummaryShortHtml,
  /* 260812 end */
  searchAllDocuments,
  searchAllMedia,
  searchAllPages,
  searchAllProducts,
  searchAllTabs,
  searchSectionExploreLinks,
  type SearchTabId,
} from "@/data/search/searchAllContent";
/* 260812 start */
import SearchAllAi from "./SearchAllAi";
import { useSearchAllAiLoading } from "./SearchAllAiLoadingProvider";
/* 260812 end */

function SearchSectionHead({
  title,
  count,
  exploreHref,
}: {
  title: string;
  count: number;
  exploreHref: string;
}) {
  return (
    <div className="search_all__section-head">
      <div className="search_all__section-title-wrap">
        <h2 className="search_all__section-tit">{title}</h2>
        <span className="search_all__section-count">{count}</span>
      </div>
      <Link href={exploreHref} prefetch={false} className="btn-text-30 search_all__explore">
        Explore
        <span className="btn-text-30__icon" aria-hidden="true">
          <span className="icon_arrow-18" aria-hidden="true" />
        </span>
      </Link>
    </div>
  );
}

type SearchAllTabContentProps = {
  initialTab?: SearchTabId;
};

export default function SearchAllTabContent({
  initialTab = "all",
}: SearchAllTabContentProps) {
  const [activeTab, setActiveTab] = useState<SearchTabId>(initialTab);
  /* 260812 start */
  const { isAiLoading } = useSearchAllAiLoading();
  /* 260812 end */
  const isAllTab = activeTab === "all";

  return (
    <section className="search_all" id="search-all">
      <div className="inner">
        <div className="search_all__tabs" role="tablist" aria-label="Search results">
          {searchAllTabs.map((tab) => {
            const isActive = activeTab === tab.id;
            const countLabel = tab.id === "all" ? `${tab.count}+` : String(tab.count);
            return (
              <button
                key={tab.id}
                type="button"
                role="tab"
                aria-selected={isActive}
                className={isActive ? "search_all__tab is-active" : "search_all__tab"}
                onClick={() => setActiveTab(tab.id)}
              >
                {tab.label} ({countLabel})
              </button>
            );
          })}
        </div>

        {activeTab === "products" ? <SearchProductsPanel /> : null}
        {activeTab === "documents" ? <SearchDocumentsPanel /> : null}
        {activeTab === "media" ? <SearchMediaPanel /> : null}
        {activeTab === "pages" ? <SearchPagesPanel /> : null}

        {/* 260812 start */}
        {isAllTab ? (
          <>
            <SearchAllAi
              html={searchAllAiSummaryHtml}
              loading={isAiLoading}
            />
            <SearchAllAi html={searchAllAiSummaryShortHtml} />
            <SearchAllAi loading />
          </>
        ) : null}
        {/* 260812 end */}

        {isAllTab ? (
          <div className="search_all__section">
            <SearchSectionHead
              title="Product"
              count={60}
              exploreHref={searchSectionExploreLinks.products}
            />
            <div className="search_all__products">
              {searchAllProducts.map((item) => (
                <SearchProductCard key={item.id} item={item} />
              ))}
            </div>
          </div>
        ) : null}

        {isAllTab ? (
          <div className="search_all__section search_all__section--documents devices_product_downloads">
            <SearchSectionHead
              title="Documents"
              count={20}
              exploreHref={searchSectionExploreLinks.documents}
            />
            <div className="search_all__documents-grid">
              {searchAllDocuments.map((item) => (
                <SearchDocumentsCard key={item.id} item={item} />
              ))}
            </div>
          </div>
        ) : null}

        {isAllTab ? (
          <div className="search_all__section">
            <SearchSectionHead
              title="Media"
              count={10}
              exploreHref={searchSectionExploreLinks.media}
            />
            <SearchMediaList items={searchAllMedia} variant="card" />
          </div>
        ) : null}

        {isAllTab ? (
          <div className="search_all__section">
            <SearchSectionHead
              title="Pages"
              count={16}
              exploreHref={searchSectionExploreLinks.pages}
            />
            <SearchPageList
              items={searchAllPages}
              listClassName="search_all__pages"
              itemClassName="search_all__page-item"
              variant="pages"
            />
          </div>
        ) : null}
      </div>
    </section>
  );
}

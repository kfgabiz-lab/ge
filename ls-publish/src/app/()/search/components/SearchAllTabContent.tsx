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
  searchAllAiSummary,
  searchAllDocuments,
  searchAllMedia,
  searchAllPage,
  searchAllPages,
  searchAllProducts,
  searchAllTabs,
  searchSectionExploreLinks,
  type SearchTabId,
} from "@/data/search/searchAllContent";

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
  const [aiExpanded, setAiExpanded] = useState(false);
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

        {isAllTab ? (
          <div className={aiExpanded ? "search_all__ai is-expanded" : "search_all__ai"}>
            <div className="search_all__ai-content">
              <div className="search_all__ai-head">
                <img
                  className="search_all__ai-badge"
                  src="/pub/img/search/search_all_ai_badge.svg"
                  alt=""
                  width={50}
                  height={50}
                  decoding="async"
                  aria-hidden
                />
                <h2 className="search_all__ai-tit">{searchAllPage.aiTitle}</h2>
                <p className="search_all__ai-note">{searchAllPage.aiDisclaimer}</p>
              </div>
              <div className="search_all__ai-body">
                <ul className="search_all__ai-list">
                  {searchAllAiSummary.map((line, index) => (
                    <li key={`ai-${index}`}>
                      <span className="search_all__ai-bullet" aria-hidden />
                      <span className="search_all__ai-list-text">{line}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            {!aiExpanded ? <div className="search_all__ai-fade" aria-hidden /> : null}
            <div className="search_all__ai-more">
              <span className="search_all__ai-more-line" aria-hidden />
              <button
                type="button"
                className="search_all__ai-more-btn"
                aria-expanded={aiExpanded}
                onClick={() => setAiExpanded((prev) => !prev)}
              >
                Read more
                <span className="search_all__ai-more-icon" aria-hidden />
              </button>
            </div>
          </div>
        ) : null}

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

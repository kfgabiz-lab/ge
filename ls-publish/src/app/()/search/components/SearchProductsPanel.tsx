"use client";

import { useMemo, useState } from "react";
import SupportFilterModal from "@/app/()/support/components/SupportFilterModal";
import PageNumbering from "@/components/pagination/PageNumbering";
import SearchProductCard from "./SearchProductCard";
import SearchProductsActiveFilters from "./SearchProductsActiveFilters";
import SearchProductsFilterPanel from "./SearchProductsFilterPanel";
import { SearchProductsFilterProvider } from "./SearchProductsFilterProvider";
import {
  getSearchProductPageItems,
  searchProductsPage,
} from "@/data/search/searchProductsContent";
import { searchAllListClasses } from "./searchAllListClasses";

function SearchProductsPanelContent() {
  const [currentPage, setCurrentPage] = useState(1);
  const [filterOpen, setFilterOpen] = useState(false);
  const { totalResults, pageSize } = searchProductsPage;
  const totalPages = Math.max(1, Math.ceil(totalResults / pageSize));

  const pageItems = useMemo(
    () => getSearchProductPageItems(currentPage, pageSize),
    [currentPage, pageSize],
  );

  return (
    <section
      className="search_products devices_product_downloads"
      id="search-products"
    >
      <div className="inner">
        <div className="search_products__body devices_product_downloads__body">
          <SearchProductsFilterPanel
            variant="sidebar"
            sidebarClassName="search_products__filter devices_product_downloads__filter-stack--pc"
          />

          <div className="search_products__main">
            <div className="search_products__panel">
              <div className="search_products__mo-filter-wrap">
                <button
                  type="button"
                  className="search_products__mo-filter"
                  onClick={() => setFilterOpen(true)}
                >
                  <span className="search_products__mo-filter-label">Filter by</span>
                  <span className="search_products__mo-filter-icon" aria-hidden>
                    <img
                      src="/pub/ico/ico_filter_14.svg"
                      alt=""
                      width={14}
                      height={14}
                    />
                  </span>
                </button>
              </div>

              <SearchProductsActiveFilters />

              <div className="search_products__results">
                <p className="search_products__count">
                  Total <strong>{totalResults.toLocaleString()}</strong>
                </p>

                <ul className="search_products__list">
                  {pageItems.map((item, index) => (
                    <li
                      key={`${item.id}-${currentPage}-${index}`}
                      className={searchAllListClasses.item}
                    >
                      <SearchProductCard item={item} />
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <PageNumbering
              className="search_products__pagination"
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
              ariaLabel="Search products pagination"
            />
          </div>
        </div>
      </div>

      <SupportFilterModal
        open={filterOpen}
        onClose={() => setFilterOpen(false)}
        applyLabel="Apply"
      >
        <SearchProductsFilterPanel variant="modal" />
      </SupportFilterModal>
    </section>
  );
}

export default function SearchProductsPanel() {
  return (
    <SearchProductsFilterProvider>
      <SearchProductsPanelContent />
    </SearchProductsFilterProvider>
  );
}

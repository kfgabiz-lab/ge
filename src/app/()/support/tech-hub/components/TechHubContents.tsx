"use client";

import { Checkbox } from "@mui/material";
import type { ReactNode } from "react";
import { useMemo, useState } from "react";
import {
  GuideCheckboxIcon,
  guideCheckboxIconsDownloads,
} from "@/components/form/GuideFieldIcons";
import PageNumbering from "@/components/pagination/PageNumbering";
import DevicesProductDownloadsCheckLabel from "@/app/()/devices-systems/components/product/DevicesProductDownloadsCheckLabel";
import TechHubEmpty from "./TechHubEmpty";
import TechHubVideoCard from "./TechHubVideoCard";
import {
  techHubCertifications,
  techHubPage,
  techHubProductCategories,
  techHubVideos,
  type DownloadCategoryOption,
  type DownloadFilterOption,
} from "@/data/support/techHubContent";

function FilterCheckRow({
  id,
  label,
  count,
  defaultChecked,
  wrapLi = true,
}: DownloadFilterOption & { id: string; wrapLi?: boolean }) {
  const row = (
    <label className="devices_product_downloads__check-row" htmlFor={id}>
      <Checkbox
        className="guide_checkbox devices_product_downloads__check"
        defaultChecked={defaultChecked}
        disableRipple
        icon={<GuideCheckboxIcon {...guideCheckboxIconsDownloads} />}
        checkedIcon={
          <GuideCheckboxIcon checked {...guideCheckboxIconsDownloads} />
        }
        slotProps={{ input: { id, name: id } }}
      />
      <DevicesProductDownloadsCheckLabel label={label} count={count} />
    </label>
  );

  return wrapLi ? <li>{row}</li> : row;
}

function CategoryFilterRow({ option }: { option: DownloadCategoryOption }) {
  const [expanded, setExpanded] = useState(
    Boolean(option.nested?.length && option.defaultExpanded),
  );

  return (
    <li>
      <div className="devices_product_downloads__category-row">
        <FilterCheckRow
          id={`th-category-${option.id}`}
          label={option.label}
          count={option.count}
          defaultChecked={option.defaultChecked}
          wrapLi={false}
        />
        {option.hasArrow ? (
          <button
            type="button"
            className={`devices_product_downloads__filter-arrow devices_product_downloads__filter-arrow--14${
              expanded ? " is-open" : ""
            }`}
            aria-expanded={expanded}
            aria-label={`${option.label} subcategories`}
            onClick={() => setExpanded((open) => !open)}
          />
        ) : null}
      </div>
      {option.nested?.length && expanded ? (
        <ul className="devices_product_downloads__filter-list devices_product_downloads__filter-list--nested">
          {option.nested.map((nested) => (
            <FilterCheckRow
              key={nested.id}
              id={`th-category-${nested.id}`}
              label={nested.label}
              count={nested.count}
              defaultChecked={nested.defaultChecked}
            />
          ))}
        </ul>
      ) : null}
    </li>
  );
}

function FilterSection({
  title,
  children,
  variant,
}: {
  title: string;
  children: ReactNode;
  variant?: "certification";
}) {
  return (
    <div
      className={`devices_product_downloads__filter-section${
        variant === "certification"
          ? " devices_product_downloads__filter-section--certification"
          : ""
      }`}
    >
      <div className="devices_product_downloads__filter-head">
        <div className="devices_product_downloads__filter-head-row">
          <span className="devices_product_downloads__filter-tit">{title}</span>
          <button type="button" className="devices_product_downloads__refresh">
            <span className="devices_product_downloads__refresh-icon" aria-hidden />
            <span className="ir">Reset filters</span>
          </button>
        </div>
        <hr className="devices_product_downloads__filter-head-divider" />
      </div>
      <div className="devices_product_downloads__filter-panel">
        <ul className="devices_product_downloads__filter-list">{children}</ul>
      </div>
    </div>
  );
}

type TechHubContentsProps = {
  empty?: boolean;
};

export default function TechHubContents({ empty = false }: TechHubContentsProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const { totalResults, pageSize } = techHubPage;
  const resultCount = empty ? 0 : totalResults;

  const totalPages = Math.max(1, Math.ceil(totalResults / pageSize));

  const pageItems = useMemo(() => {
    if (empty) return [];

    const start = (currentPage - 1) * pageSize;
    const pool: typeof techHubVideos = [];

    while (pool.length < start + pageSize) {
      pool.push(...techHubVideos);
    }

    return pool.slice(start, start + pageSize);
  }, [currentPage, empty, pageSize]);

  return (
    <section
      className={`support_tech_hub_contents devices_product_downloads devices_product_downloads--tech-hub${
        empty ? " support_tech_hub_contents--no-data" : ""
      }`}
      id="support-tech-hub-contents"
    >
      <div className="inner">
        <div className="devices_product_downloads__body">
          <div className="devices_product_downloads__filter-stack">
            <aside className="devices_product_downloads__filter">
              <FilterSection title="Product Category">
                {techHubProductCategories.map((option) => (
                  <CategoryFilterRow key={option.id} option={option} />
                ))}
              </FilterSection>

              <FilterSection title="Certification" variant="certification">
                {techHubCertifications.map((option) => (
                  <FilterCheckRow
                    key={option.id}
                    id={`th-cert-${option.id}`}
                    label={option.label}
                    count={option.count}
                    defaultChecked={option.defaultChecked}
                  />
                ))}
              </FilterSection>
            </aside>
          </div>

          <div className="devices_product_downloads__main">
            <p className="devices_product_downloads__count support_tech_hub_contents__count">
              Total <strong>{resultCount.toLocaleString()}</strong>
            </p>

            {empty ? (
              <TechHubEmpty />
            ) : (
              <>
                <div className="support_tech_hub_grid">
                  {pageItems.map((item, index) => (
                    <TechHubVideoCard
                      key={`${item.id}-${currentPage}-${index}`}
                      item={item}
                    />
                  ))}
                </div>

                <PageNumbering
                  className="support_tech_hub_contents__pagination"
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={setCurrentPage}
                  ariaLabel="Tech Hub pagination"
                />
              </>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

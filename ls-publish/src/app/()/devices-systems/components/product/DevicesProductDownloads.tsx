"use client";

import {
  Checkbox,
  FormControl,
  InputAdornment,
  MenuItem,
  TextField,
} from "@mui/material";
import { useMemo, useState } from "react";
import {
  GuideCheckboxIcon,
  GuideSelectIcon,
  guideCheckboxIconsDownloads,
} from "@/components/form/GuideFieldIcons";
import GuideSelect from "@/components/form/GuideSelect";
import PageNumbering from "@/components/pagination/PageNumbering";
import DevicesProductDownloadsCheckLabel from "./DevicesProductDownloadsCheckLabel";
import DevicesProductDownloadDescriptionModal from "./DevicesProductDownloadDescriptionModal";
import type { ProductDownloadItem } from "../../data/productDetailContent";

const DOWNLOADS_PAGE_SIZE = 5;
const DOWNLOADS_TOTAL_RESULTS = 2658;

type DevicesProductDownloadsProps = {
  items: ProductDownloadItem[];
};

const filterOptions = [
  { id: "catalogs", label: "Catalogs", count: 100, defaultChecked: true },
  { id: "manuals", label: "Manuals", count: 100, defaultChecked: true },
  { id: "drawings", label: "Drawings", count: 100, defaultChecked: true },
  { id: "certificates", label: "Certificates", count: 100, defaultChecked: true },
  { id: "software", label: "Software", count: 100, defaultChecked: true },
  { id: "tech", label: "Tech Data", count: 100, defaultChecked: true },
  { id: "firmware", label: "OS/Firmware", count: 0, defaultChecked: false },
];

export default function DevicesProductDownloads({
  items,
}: DevicesProductDownloadsProps) {
  const [filterOpen, setFilterOpen] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [descriptionItem, setDescriptionItem] = useState<ProductDownloadItem | null>(
    null,
  );

  const totalPages = Math.max(
    1,
    Math.ceil(DOWNLOADS_TOTAL_RESULTS / DOWNLOADS_PAGE_SIZE),
  );

  const pageItems = useMemo(() => {
    if (items.length === 0) return [];

    const start = (currentPage - 1) * DOWNLOADS_PAGE_SIZE;
    const pool: ProductDownloadItem[] = [];

    while (pool.length < start + DOWNLOADS_PAGE_SIZE) {
      pool.push(...items);
    }

    return pool.slice(start, start + DOWNLOADS_PAGE_SIZE);
  }, [currentPage, items]);

  const showingStart = (currentPage - 1) * DOWNLOADS_PAGE_SIZE + 1;
  const showingEnd = Math.min(currentPage * DOWNLOADS_PAGE_SIZE, DOWNLOADS_TOTAL_RESULTS);

  return (
    <>
    <section className="devices_product_downloads" id="product-downloads">
      <div className="inner">
        <div className="devices_product_downloads__head">
          <h2 className="section_tit">Downloads</h2>
          <p className="section_desc">
            Access all the technical assets you need in one place. Download
            high-resolution CAD drawings, detailed installation manuals, and the
            latest product catalogs to streamline your engineering workflow.
          </p>
        </div>
        <div className="devices_product_downloads__body">
          <aside className="devices_product_downloads__filter">
            <div className="devices_product_downloads__filter-head">
              <span className="devices_product_downloads__filter-tit">Filter by</span>
              <button type="button" className="devices_product_downloads__refresh">
                <span
                  className="devices_product_downloads__refresh-icon"
                  aria-hidden="true"
                />
                
              </button>
            </div>
            <div className="devices_product_downloads__filter-panel">
              <button
                type="button"
                className={`devices_product_downloads__filter-label${
                  filterOpen ? " is-open" : ""
                }`}
                onClick={() => setFilterOpen((open) => !open)}
                aria-expanded={filterOpen}
              >
                Document type
                <span className="devices_product_downloads__filter-arrow" aria-hidden />
              </button>
              {filterOpen ? (
                <ul className="devices_product_downloads__filter-list">
                  {filterOptions.map((option) => {
                    const inputId = `downloads-filter-${option.id}`;

                    return (
                      <li key={option.id}>
                        <label
                          className="devices_product_downloads__check-row"
                          htmlFor={inputId}
                        >
                          <Checkbox
                            className="guide_checkbox devices_product_downloads__check"
                            defaultChecked={option.defaultChecked}
                            disableRipple
                            icon={
                              <GuideCheckboxIcon {...guideCheckboxIconsDownloads} />
                            }
                            checkedIcon={
                              <GuideCheckboxIcon
                                checked
                                {...guideCheckboxIconsDownloads}
                              />
                            }
                            slotProps={{
                              input: { id: inputId, name: option.id },
                            }}
                          />
                          <DevicesProductDownloadsCheckLabel
                            label={option.label}
                            count={option.count}
                          />
                        </label>
                      </li>
                    );
                  })}
                </ul>
              ) : null}
            </div>
          </aside>
          <div className="devices_product_downloads__main">
            <div className="devices_product_downloads__toolbar">
              <p className="devices_product_downloads__count">
                Showing {showingStart}-{showingEnd} of{" "}
                <strong>{DOWNLOADS_TOTAL_RESULTS.toLocaleString()}</strong> results
              </p>
              <div className="devices_product_downloads__search-row">
                <FormControl className="guide_field guide_field--w200">
                  <GuideSelect
                    defaultValue="Sort by"
                    displayEmpty
                    IconComponent={GuideSelectIcon}
                    inputProps={{ "aria-label": "Sort by" }}
                    renderValue={(value) => {
                      const text = value ? String(value) : "Sort by";
                      return (
                        <span className="guide_field__select-value" title={text}>
                          {text}
                        </span>
                      );
                    }}
                  >
                    <MenuItem value="">Sort by</MenuItem>
                    <MenuItem value="Newest">Newest</MenuItem>
                    <MenuItem value="Oldest">Oldest</MenuItem>
                  </GuideSelect>
                </FormControl>
                <TextField
                  className="guide_field guide_field--search"
                  placeholder="key word"
                  aria-label="key word downloads"
                  slotProps={{
                    input: {
                      endAdornment: (
                        <InputAdornment
                          position="end"
                          className="guide_field__search-adorn"
                        >
                          <button
                            type="button"
                            className="guide_field__search-icon-button"
                            aria-label="Search"
                          >
                            <img
                              loading="lazy"
                              decoding="async"
                              src="/ico/ico_search_24.svg"
                              alt=""
                              width={18}
                              height={18}
                            />
                          </button>
                        </InputAdornment>
                      ),
                    },
                  }}
                />
              </div>
            </div>
            <div className="devices_product_downloads__list">
              {pageItems.map((item, index) => (
                <article
                  key={`${item.id}-${currentPage}-${index}`}
                  className="devices_product_downloads__item"
                >
                  <header className="devices_product_downloads__item-head">
                    <div className="devices_product_downloads__item-head-meta">
                      <span className="devices_product_downloads__type">
                        {item.type}
                      </span>
                      <time className="devices_product_downloads__date">
                        {item.date}
                      </time>
                    </div>
                    <h3 className="devices_product_downloads__item-tit">
                      {item.title}
                    </h3>
                  </header>
                  <div className="devices_product_downloads__item-body">
                    <div className="devices_product_downloads__item-version">
                      <FormControl
                        className="guide_field guide_field--h38 guide_field--w120 devices_product_downloads__version-select"
                      >
                        <GuideSelect
                          defaultValue={item.version}
                          displayEmpty
                          IconComponent={GuideSelectIcon}
                          inputProps={{
                            "aria-label": `Version for ${item.title}`,
                          }}
                          renderValue={(value) => {
                            const text = value ? String(value) : item.version;
                            return (
                              <span
                                className="guide_field__select-value"
                                title={text}
                              >
                                {text}
                              </span>
                            );
                          }}
                        >
                          {(item.versions ?? [item.version]).map((version) => (
                            <MenuItem key={version} value={version}>
                              {version}
                            </MenuItem>
                          ))}
                        </GuideSelect>
                      </FormControl>
                    </div>
                    <div className="devices_product_downloads__files-panel">
                      {item.description ? (
                        <button
                          type="button"
                          className="devices_product_downloads__view-desc"
                          onClick={() => setDescriptionItem(item)}
                        >
                          View Description
                        </button>
                      ) : null}
                      <ul className="devices_product_downloads__files">
                        {item.files.map((file) => (
                          <li key={file.name} className="devices_product_downloads__file">
                            <div className="devices_product_downloads__file-main">
                              <span
                                className="devices_product_downloads__pdf"
                                aria-hidden="true"
                              >
                                <img loading="lazy" decoding="async"
                                  src="/ico/ico_pdf_18.svg"
                                  alt=""
                                  width={18}
                                  height={18}
                                />
                              </span>
                              <span className="devices_product_downloads__file-name">
                                {file.name}
                                {file.size ? ` (${file.size})` : ""}
                              </span>
                            </div>
                            <div className="devices_product_downloads__file-actions">
                          <button
                            type="button"
                            className="devices_product_downloads__file-btn devices_product_downloads__file-btn--copy"
                          >
                            Copy Link
                            <span
                              className="devices_product_downloads__file-btn-icon"
                              aria-hidden="true"
                            />
                          </button>
                          <button
                            type="button"
                            className="devices_product_downloads__file-btn devices_product_downloads__file-btn--download"
                          >
                            Download
                            <span
                              className="devices_product_downloads__file-btn-icon"
                              aria-hidden="true"
                            />
                          </button>
                            </div>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </article>
              ))}
            </div>
            <PageNumbering
              className="devices_product_downloads__pagination"
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
              ariaLabel="Downloads pagination"
            />
          </div>
        </div>
      </div>
    </section>
    {descriptionItem?.description ? (
      <DevicesProductDownloadDescriptionModal
        open
        title={descriptionItem.title}
        version={descriptionItem.version}
        description={descriptionItem.description}
        onClose={() => setDescriptionItem(null)}
      />
    ) : null}
    </>
  );
}

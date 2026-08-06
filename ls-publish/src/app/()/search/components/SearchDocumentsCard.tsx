"use client";

import { FormControl, MenuItem } from "@mui/material";
import { GuideSelectIcon } from "@/components/form/GuideFieldIcons";
import GuideSelect from "@/components/form/GuideSelect";
import type { ProductDownloadItem } from "@/app/()/products-systems/data/productDetailContent";
import DevicesProductDownloadsCopyLink from "@/app/()/products-systems/components/product/DevicesProductDownloadsCopyLink";
import {
  renderInlineTextHighlight,
  renderTitleTextHighlight,
} from "./renderSearchTextHighlight";

function renderFileHighlight(text: string, highlight?: string) {
  if (!highlight) {
    return text;
  }

  return renderInlineTextHighlight(
    text,
    highlight,
    "devices_product_downloads__file-name-mark",
  );
}

export default function SearchDocumentsCard({
  item,
  className,
}: {
  item: ProductDownloadItem;
  className?: string;
}) {
  const rootClass = className
    ? `devices_product_downloads__item search_all__document ${className}`.trim()
    : "devices_product_downloads__item search_all__document";

  return (
    <article className={rootClass}>
      <header className="devices_product_downloads__item-head devices_product_downloads__item-head--center">
        <div className="devices_product_downloads__item-head-main">
          <div className="devices_product_downloads__item-head-meta">
            <span className="devices_product_downloads__type">{item.type}</span>
            {item.date ? (
              <time className="devices_product_downloads__date" dateTime={item.date}>
                {item.date}
              </time>
            ) : null}
          </div>
          <div className="devices_product_downloads__item-head-title-row">
            <h3 className="devices_product_downloads__item-tit">
              {renderTitleTextHighlight(
                item.title,
                item.highlight,
                "devices_product_downloads__item-tit-mark",
              )}
            </h3>
            {item.versions && item.versions.length > 0 ? (
              <div className="devices_product_downloads__item-version">
                <FormControl className="guide_field guide_field--h38 guide_field--w120 devices_product_downloads__version-select">
                  <GuideSelect
                    defaultValue={item.version}
                    IconComponent={GuideSelectIcon}
                    inputProps={{ "aria-label": `Version for ${item.title}` }}
                    onOpen={(event) => event.preventDefault()}
                    renderValue={(value) => (
                      <span className="guide_field__select-value" title={String(value)}>
                        {String(value)}
                      </span>
                    )}
                  >
                    {item.versions.map((version) => (
                      <MenuItem key={version} value={version}>
                        {version}
                      </MenuItem>
                    ))}
                  </GuideSelect>
                </FormControl>
              </div>
            ) : null}
          </div>
        </div>
      </header>
      <div className="devices_product_downloads__item-body">
        <div className="devices_product_downloads__files-panel">
          <ul className="devices_product_downloads__files">
            {item.files.map((file) => (
              <li key={file.name} className="devices_product_downloads__file">
                <div className="devices_product_downloads__file-main">
                  <span className="devices_product_downloads__pdf" aria-hidden>
                    <img
                      src="/pub/ico/ico_pdf_18.svg"
                      alt=""
                      width={18}
                      height={18}
                      loading="lazy"
                      decoding="async"
                    />
                  </span>
                  <span className="devices_product_downloads__file-name">
                    {renderFileHighlight(file.name, item.highlight)}
                    {file.size ? ` (${file.size})` : ""}
                  </span>
                </div>
                <div className="devices_product_downloads__file-actions">
                  <DevicesProductDownloadsCopyLink
                    className="devices_product_downloads__file-btn--line"
                    url={file.url}
                  />
                  <button
                    type="button"
                    className="devices_product_downloads__file-btn devices_product_downloads__file-btn--download"
                  >
                    Download
                    <span className="devices_product_downloads__file-btn-icon" aria-hidden />
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </article>
  );
}

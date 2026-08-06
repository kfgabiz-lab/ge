#!/usr/bin/env python3
"""Consolidate duplicated /search tab CSS in search.css."""

from __future__ import annotations

from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
CSS_PATH = ROOT / "src" / "assets" / "css" / "search.css"

FILTER_TABS = ("products", "documents", "media", "pages")
FILTER_TAB_SECTIONS = ",\n".join(
    f"  section.search_{tab}.devices_product_downloads" for tab in FILTER_TABS
)
CATEGORY_TAB_SECTIONS = ",\n".join(
    f"  section.search_{tab}.devices_product_downloads"
    for tab in ("products", "documents")
)


def comma_tab_selectors(suffix: str) -> str:
    return ",\n".join(
        f"  section.search_{tab} .search_{tab}{suffix}" for tab in FILTER_TABS
    )


def build_shared_mobile_block() -> str:
    mo_wrap = comma_tab_selectors("__mo-filter-wrap")
    mo_btn = comma_tab_selectors("__mo-filter")
    mo_label = comma_tab_selectors("__mo-filter-label")
    mo_icon = comma_tab_selectors("__mo-filter-icon")
    pagination = comma_tab_selectors("__pagination")
    filter_pc = ",\n".join(
        f"  section.search_{tab} .search_{tab}__filter.devices_product_downloads__filter-stack--pc"
        for tab in FILTER_TABS
    )
    main = comma_tab_selectors("__main")
    nested_sections = ",\n".join(
        f"  section.search_all section.search_{tab}.devices_product_downloads"
        for tab in FILTER_TABS
    )
    nested_inner = ",\n".join(
        f"  section.search_all section.search_{tab} .inner" for tab in FILTER_TABS
    )
    count_divider = ",\n".join(
        f"  section.search_{tab} .search_{tab}__count"
        for tab in ("documents", "media", "pages")
    )
    count_strong_divider = ",\n".join(
        f"  section.search_{tab} .search_{tab}__count strong"
        for tab in ("documents", "media", "pages")
    )
    results = ",\n".join(
        f"  section.search_{tab} .search_{tab}__results"
        for tab in ("documents", "media", "pages")
    )
    list_block = ",\n".join(
        f"  section.search_{tab} .search_{tab}__list-block"
        for tab in ("media", "pages")
    )

    modal_shell = f"""
{FILTER_TAB_SECTIONS} {{
  /* shell rules injected below */
}}"""

    return f"""
  /* — Search filter tabs — shared mobile (products · documents · media · pages) */
{nested_sections} {{
    padding: 0;
    background: transparent;
  }}

{nested_inner} {{
    padding-left: 0;
    padding-right: 0;
  }}

{FILTER_TAB_SECTIONS} {{
    padding: 0 0 80px;
    background: #fff;
  }}

{FILTER_TAB_SECTIONS} .devices_product_downloads__body {{
    display: flex;
    flex-direction: column;
    gap: 0;
    grid-template-columns: 1fr;
  }}

{filter_pc} {{
    display: none;
  }}

{main} {{
    display: flex;
    flex-direction: column;
    gap: 30px;
    width: 100%;
    min-width: 0;
  }}

{list_block} {{
    display: flex;
    flex-direction: column;
    gap: 30px;
    width: 100%;
    min-width: 0;
  }}

{mo_wrap} {{
    display: block;
    width: 100%;
  }}

{mo_btn} {{
    display: flex;
    align-items: center;
    justify-content: space-between;
    box-sizing: border-box;
    width: 100%;
    height: 50px;
    min-height: 50px;
    margin: 0;
    padding: 0 20px;
    font: inherit;
    font-size: 15px;
    line-height: 23px;
    color: #222;
    background: #fff;
    border: 1px solid #ddd;
    border-radius: 4px;
    appearance: none;
    cursor: pointer;
  }}

{mo_label} {{
    min-width: 0;
    text-align: left;
  }}

{mo_icon} {{
    display: flex;
    flex-shrink: 0;
    align-items: center;
    justify-content: center;
    width: 14px;
    height: 14px;
  }}

{mo_icon} img {{
    display: block;
    width: 14px;
    height: 14px;
  }}

{results} {{
    display: flex;
    flex-direction: column;
    gap: 24px;
    width: 100%;
    min-width: 0;
  }}

{count_divider} {{
    margin: 0;
    padding-bottom: 14px;
    border-bottom: 1px solid #ddd;
    font-size: 14px;
    line-height: 22px;
    color: #666;
  }}

{count_strong_divider} {{
    font-weight: 500;
    color: #222;
  }}

{pagination} {{
    margin-top: 0;
  }}

{pagination}.page-numbering {{
    width: 100%;
  }}

{pagination} .page-numbering__inner {{
    gap: 2.5px;
    justify-content: center;
  }}

{pagination} .page-numbering__control {{
    width: 30px;
    height: 30px;
    border-radius: 4px;
  }}

{pagination} .page-numbering__page {{
    width: 38px;
    height: 38px;
    font-size: 15px;
    font-weight: 400;
    line-height: 23px;
    color: #666;
    border-radius: 4px;
  }}

{pagination} .page-numbering__page.is-active {{
    border-radius: 20px;
    background: #0f1f45;
    color: #fff;
    font-weight: 600;
  }}

{FILTER_TAB_SECTIONS} .support_download_filter-modal {{
    display: block !important;
    position: fixed;
    inset: 0;
    z-index: 1200;
  }}

{FILTER_TAB_SECTIONS} .support_download_filter-modal__overlay {{
    display: none;
  }}

{FILTER_TAB_SECTIONS} .support_download_filter-modal__sheet {{
    position: relative;
    display: flex;
    flex-direction: column;
    width: 100%;
    height: 100%;
    background: #fff;
  }}

{FILTER_TAB_SECTIONS} .support_download_filter-modal__head {{
    display: flex;
    flex-shrink: 0;
    align-items: center;
    justify-content: space-between;
    height: 60px;
    padding: 0 20px;
    border-bottom: 1px solid rgb(34 34 34 / 10%);
  }}

{FILTER_TAB_SECTIONS} .support_download_filter-modal__tit {{
    margin: 0;
    font-size: 24px;
    font-weight: 600;
    line-height: 30px;
    letter-spacing: -0.24px;
    color: #222;
  }}

{FILTER_TAB_SECTIONS} .support_download_filter-modal__close {{
    display: flex;
    align-items: center;
    justify-content: center;
    width: 24px;
    height: 24px;
    padding: 0;
    border: none;
    background: transparent;
    cursor: pointer;
  }}

{FILTER_TAB_SECTIONS} .support_download_filter-modal__body {{
    flex: 1;
    overflow-y: auto;
    padding: 40px 20px;
  }}

{FILTER_TAB_SECTIONS} .support_download_filter-modal__panel {{
    display: flex;
    flex-direction: column;
    gap: 40px;
  }}

{FILTER_TAB_SECTIONS}
    .support_download_filter-modal__panel
    .devices_product_downloads__filter-section {{
    display: flex;
    flex-direction: column;
    gap: 18px;
    width: 100%;
    min-width: 0;
  }}

{FILTER_TAB_SECTIONS}
    .support_download_filter-modal__panel
    .devices_product_downloads__filter-tit {{
    font-size: 20px;
    font-weight: 600;
    line-height: 30px;
    color: #222;
  }}

{FILTER_TAB_SECTIONS}
    .support_download_filter-modal__panel
    .devices_product_downloads__filter-list {{
    display: flex;
    flex-direction: column;
    gap: 18px;
    margin: 0;
    padding: 0;
    list-style: none;
  }}

{FILTER_TAB_SECTIONS}
    .support_download_filter-modal__panel
    .devices_product_downloads__check-row {{
    display: flex;
    align-items: flex-start;
    gap: 10px;
    width: 100%;
    cursor: pointer;
  }}

{FILTER_TAB_SECTIONS}
    .support_download_filter-modal__panel
    .devices_product_downloads__check-label {{
    display: inline;
    min-width: 0;
    max-width: none;
    padding: 0;
    border: none;
    background: none;
    font: inherit;
    font-size: 15px;
    font-weight: 400;
    line-height: 23px;
    color: #222;
    text-align: left;
    cursor: pointer;
    text-wrap: balance;
  }}

{FILTER_TAB_SECTIONS}
    .support_download_filter-modal__panel
    .devices_product_downloads__check-label-count {{
    flex-shrink: 0;
    color: #666;
    margin-left: 4px;
  }}

{FILTER_TAB_SECTIONS}
    .support_download_filter-modal__panel
    .devices_product_downloads__check {{
    display: flex;
    align-items: center;
    align-self: flex-start;
    flex-shrink: 0;
    height: 24px;
    padding: 1px 0 0;
  }}

{FILTER_TAB_SECTIONS}
    .support_download_filter-modal__panel
    .guide_checkbox.MuiCheckbox-root {{
    padding: 0;
    color: transparent;
    border-radius: 4px;
  }}

{FILTER_TAB_SECTIONS}
    .support_download_filter-modal__panel
    .guide_checkbox.MuiCheckbox-root.Mui-checked,
{FILTER_TAB_SECTIONS}
    .support_download_filter-modal__panel
    .guide_checkbox.MuiCheckbox-root:hover,
{FILTER_TAB_SECTIONS}
    .support_download_filter-modal__panel
    .guide_checkbox.MuiCheckbox-root.Mui-focusVisible {{
    color: transparent;
    background-color: transparent;
  }}

{FILTER_TAB_SECTIONS}
    .support_download_filter-modal__panel
    .guide_checkbox.MuiCheckbox-root
    .MuiSvgIcon-root {{
    display: none;
  }}

{FILTER_TAB_SECTIONS}
    .support_download_filter-modal__panel
    .guide_checkbox__icon {{
    display: block;
    width: 22px;
    height: 22px;
    flex-shrink: 0;
    object-fit: contain;
  }}

{CATEGORY_TAB_SECTIONS}
    .support_download_filter-modal__panel
    .devices_product_downloads__category-row {{
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 8px;
    width: 100%;
  }}

{CATEGORY_TAB_SECTIONS}
    .support_download_filter-modal__panel
    .devices_product_downloads__filter-arrow--14 {{
    flex-shrink: 0;
    width: 22px;
    height: 22px;
    padding: 0;
    border: none;
    background: url("/pub/ico/ico_down_16.svg") 6px 8px / 10px no-repeat;
    cursor: pointer;
    transform: rotate(0deg);
    transition: transform 0.25s ease;
  }}

{CATEGORY_TAB_SECTIONS}
    .support_download_filter-modal__panel
    .devices_product_downloads__filter-arrow--14.is-open {{
    transform: rotate(180deg);
    transform-origin: center;
  }}

{CATEGORY_TAB_SECTIONS}
    .support_download_filter-modal__panel
    .devices_product_downloads__filter-list--nested {{
    margin-top: 16px;
    padding-left: 32px;
  }}

{CATEGORY_TAB_SECTIONS}
    .support_download_filter-modal__panel
    .devices_product_downloads__category-row
    .devices_product_downloads__check-row {{
    flex: 1;
    min-width: 0;
  }}

{FILTER_TAB_SECTIONS} .support_download_filter-modal__foot {{
    flex-shrink: 0;
    height: 60px;
    background: #0f1f45;
  }}

{FILTER_TAB_SECTIONS} .support_download_filter-modal__apply {{
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: 100%;
    padding: 0;
    font: inherit;
    font-size: 18px;
    font-weight: 500;
    line-height: 28px;
    color: #fff;
    background: transparent;
    border: none;
    cursor: pointer;
  }}

"""


def remove_block(text: str, start_marker: str, end_marker: str) -> str:
    start = text.find(start_marker)
    if start == -1:
        raise ValueError(f"Start marker not found: {start_marker!r}")
    end = text.find(end_marker, start + len(start_marker))
    if end == -1:
        raise ValueError(f"End marker not found after {start_marker!r}: {end_marker!r}")
    return text[:start] + text[end:]


def main() -> None:
    text = CSS_PATH.read_text(encoding="utf-8")

    # Desktop: remove duplicate products active-filters block (covered by grouped block later)
    duplicate_start = "  section.search_products .search_products__active-filters {\n    display: flex;\n    align-items: center;\n    gap: 12px;\n    margin-bottom: 28px;\n  }\n\n  section.search_products .search_products__active-filters-chips"
    duplicate_end = "  section.search_products .search_products__active-filters-clear-icon img {\n    display: block;\n    width: 12px;\n    height: 12px;\n  }\n\n"
    if duplicate_start in text:
        start = text.find(duplicate_start)
        end = text.find(duplicate_end, start) + len(duplicate_end)
        # Only remove if this is the standalone block before grouped section (not the grouped one)
        grouped = "  section.search_documents .search_documents__active-filters,\n  section.search_products .search_products__active-filters"
        if text.find(grouped) > end:
            text = text[:start] + text[end:]

    # Desktop: group mo-filter-wrap hide rules
    old_hide = """  section.search_products .search_products__mo-filter-wrap {
    display: none;
  }

  section.search_documents .search_documents__mo-filter-wrap {
    display: none;
  }

  section.search_media .search_media__mo-filter-wrap {
    display: none;
  }

  section.search_pages .search_pages__mo-filter-wrap {
    display: none;
  }"""
    new_hide = f"""  {comma_tab_selectors("__mo-filter-wrap")} {{
    display: none;
  }}"""
    text = text.replace(old_hide, new_hide)

    # Insert shared mobile block before products tab section
    anchor = "  /* Figma 6571:104644 — Products tab mobile */"
    if "/* — Search filter tabs — shared mobile" not in text:
        text = text.replace(anchor, build_shared_mobile_block() + "\n" + anchor)

    # Remove duplicated blocks from each tab (order matters — products first)
    removals = [
        (
            "  /* Figma 6571:104644 — Products tab mobile */",
            "  section.search_products .search_products__panel {",
        ),
        (
            "  section.search_products .search_products__mo-filter-wrap {",
            "  /* Figma 6571:104982 — active filters mobile */",
        ),
        (
            "  section.search_products .search_products__pagination {",
            "  section.search_products.devices_product_downloads .support_download_filter-modal {",
        ),
        (
            "  section.search_products.devices_product_downloads .support_download_filter-modal {",
            "  section.search_documents.devices_product_downloads .devices_product_downloads__body,",
        ),
        (
            "  section.search_documents.devices_product_downloads .devices_product_downloads__body,\n  section.search_media.devices_product_downloads .devices_product_downloads__body,\n  section.search_pages.devices_product_downloads .devices_product_downloads__body {\n    grid-template-columns: 1fr;\n    gap: 32px;\n  }\n\n",
            "",
        ),
        (
            "  /* Figma 6571:104997 — Documents tab mobile */",
            "  /* Figma 6571:104998 — filter + active filters */",
        ),
        (
            "  section.search_documents .search_documents__mo-filter-wrap {",
            "  section.search_documents .search_documents__active-filters {",
        ),
        (
            "  section.search_documents .search_documents__results {",
            "  section.search_documents .search_documents__count {",
        ),
        (
            "  section.search_documents .search_documents__count {",
            "  section.search_documents .search_documents__pagination {",
        ),
        (
            "  section.search_documents .search_documents__pagination {",
            "  section.search_documents.devices_product_downloads .support_download_filter-modal {",
        ),
        (
            "  section.search_documents.devices_product_downloads .support_download_filter-modal {",
            "  section.search_documents .search_documents__card .devices_product_downloads__item-head,",
        ),
        (
            "  /* Figma 6571:105462 — Media tab mobile */",
            "  section.search_media .search_media__list-block {",
        ),
        (
            "  section.search_media .search_media__mo-filter-wrap {",
            "  section.search_media .search_media__results {",
        ),
        (
            "  section.search_media .search_media__results {",
            "  section.search_media .search_media__count {",
        ),
        (
            "  section.search_media .search_media__count {",
            "  section.search_media .search_all__media {",
        ),
        (
            "  section.search_media .search_media__pagination {",
            "  section.search_media.devices_product_downloads .support_download_filter-modal {",
        ),
        (
            "  section.search_media.devices_product_downloads .support_download_filter-modal {",
            "  /* Figma 6571:105599 — Pages tab mobile */",
        ),
        (
            "  /* Figma 6571:105599 — Pages tab mobile */",
            "  section.search_pages .search_pages__list-block {",
        ),
        (
            "  section.search_pages .search_pages__mo-filter-wrap {",
            "  section.search_pages .search_pages__results {",
        ),
        (
            "  section.search_pages .search_pages__results {",
            "  section.search_pages .search_pages__count {",
        ),
        (
            "  section.search_pages .search_pages__count {",
            "  section.search_pages .search_all__pages > .search_page__divider:first-child {",
        ),
        (
            "  section.search_pages .search_pages__pagination {",
            "  section.search_pages.devices_product_downloads .support_download_filter-modal {",
        ),
        (
            "  section.search_pages.devices_product_downloads .support_download_filter-modal {",
            "\n}\n",
        ),
    ]

    for start_marker, end_marker in removals:
        if start_marker not in text:
            print(f"SKIP (start missing): {start_marker[:60]}...")
            continue
        if end_marker and end_marker not in text[text.find(start_marker) :]:
            print(f"SKIP (end missing): {end_marker[:60]}...")
            continue
        before = len(text)
        text = remove_block(text, start_marker, end_marker)
        print(f"Removed {before - len(text)} chars: {start_marker[:50]}...")

    # Clean up duplicate blank lines (max 2 consecutive)
    while "\n\n\n\n" in text:
        text = text.replace("\n\n\n\n", "\n\n\n")

    CSS_PATH.write_text(text, encoding="utf-8")
    print(f"Updated {CSS_PATH} ({len(text.splitlines())} lines)")


if __name__ == "__main__":
    main()

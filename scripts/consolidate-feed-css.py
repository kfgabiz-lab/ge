#!/usr/bin/env python3
"""Remove CSS duplicated in company-feed.css from company.css."""

from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
CSS = ROOT / "src/assets/css/company.css"

MARKERS_REMOVE = [
    # Blog desktop toolbar through select icon (before __items)
    (
        "  section.company-blog-list .company-blog-list__toolbar {",
        "  section.company-blog-list .company-blog-list__items {",
    ),
    # Blog desktop no-data block
    (
        "  /* Blog no-data — Figma 5378:147108 (Press 3525:39164 패턴) */",
        "}\n\n@media (max-width: 780px) {\n  section.company-blog-title,",
    ),
    # Blog mobile no-data generic + scoped (before closing blog mobile media)
    (
        "  section.company-blog-list.company-blog-list--no-data .company-blog-list__body {",
        "}\n\nsection.company-blog-list .guide_field .MuiOutlinedInput-root {",
    ),
    # Entire Press desktop block
    (
        "/* === Company Press (Figma 3525:39068) === */\n@media (min-width: 781px) {",
        "}\n/* === Company Articles (Figma 5584:53170) === */",
    ),
    # Entire Articles desktop block
    (
        "/* === Company Articles (Figma 5584:53170) === */\n@media (min-width: 781px) {",
        "}\n\n@media (max-width: 780px) {\n  section.company-press-title,",
    ),
    # Press mobile generic block (through divider before scoped press)
    (
        "@media (max-width: 780px) {\n  section.company-press-title,\n  section.company-press-featured,\n  section.company-press-list {",
        "  /* Press list — Figma 5353:122725 */",
    ),
    # Press mobile scoped through no-data
    (
        "  /* Press list — Figma 5353:122725 */",
        "}\n@media (max-width: 780px) {\n  section.company-articles-title,",
    ),
    # Articles mobile generic + scoped
    (
        "@media (max-width: 780px) {\n  section.company-articles-title,\n  section.company-articles-featured,\n  section.company-articles-list {",
        "}\n\nsection.company-press-list .guide_field .MuiOutlinedInput-root {",
    ),
    # Global press list utilities (through hover)
    (
        "section.company-press-list .guide_field .MuiOutlinedInput-root {",
        "section.company-blog-list .company-blog-list__content:hover .company-blog-list__title {",
    ),
    # Global articles list utilities (through hover)
    (
        "section.company-articles-list .guide_field .MuiOutlinedInput-root {",
        "/* === Company Events (Figma 3525:39276) === */",
    ),
    # Blog global guide_field dupes (keep blog-specific MuiSelect-outlined rules after)
    (
        "section.company-blog-list .guide_field .MuiOutlinedInput-root {\n  overflow: hidden;\n}\n\nsection.company-blog-list .guide_field .MuiSelect-select {\n  overflow: hidden;\n  white-space: nowrap;\n  text-overflow: ellipsis;\n  min-width: 0;\n}\n\nsection.company-blog-list .company-blog-list__toolbar .guide_field .MuiSelect-select {\n  display: flex;\n  align-items: center;\n  justify-content: flex-start;\n  width: 100%;\n  max-width: 100%;\n  overflow: hidden;\n  white-space: nowrap;\n  text-overflow: ellipsis;\n}",
        "section.company-blog-list .company-blog-list__toolbar .guide_field .MuiSelect-select.MuiSelect-outlined {",
    ),
    (
        "section.company-blog-list .company-blog-list__toolbar .guide_field__select-value {\n  display: block;\n  width: 100%;\n  overflow: hidden;\n  white-space: nowrap;\n  text-overflow: ellipsis;\n}\n\nsection.company-blog-list .company-blog-list__toolbar .guide_field .MuiSelect-nativeInput {",
        "section.company-blog-list .company-blog-list__toolbar .guide_field .MuiSelect-nativeInput {",
    ),
    (
        "section.company-blog-list .guide_field--search .guide_field__search-icon-button {\n  display: inline-flex;\n  align-items: center;\n  justify-content: center;\n  width: 18px;\n  height: 18px;\n  padding: 0;\n  margin: 0;\n  border: 0;\n  background: transparent;\n  cursor: pointer;\n}\n\nsection.company-blog-list .guide_field--search .guide_field__search-icon-button img {\n  display: block;\n  width: 18px;\n  height: 18px;\n}\n\n/* === Company Article Detail",
        "/* === Company Article Detail",
    ),
]


def remove_between(text: str, start: str, end: str) -> str:
    si = text.find(start)
    if si == -1:
        print(f"WARN: start not found: {start[:60]!r}...")
        return text
    ei = text.find(end, si)
    if ei == -1:
        print(f"WARN: end not found after start: {end[:60]!r}...")
        return text
    return text[:si] + text[ei:]


def main() -> None:
    content = CSS.read_text(encoding="utf-8")

    if '@import "./company-feed.css"' not in content:
        content = '@import "./company-feed.css";\n\n' + content

    for start, end in MARKERS_REMOVE:
        before = content
        content = remove_between(content, start, end)
        if content != before:
            print(f"Removed block: {start[:50]!r}...")
        else:
            print(f"SKIP (unchanged): {start[:50]!r}...")

    # Fix blog desktop no-data removal - may leave orphan rules; handle blog no-data inside desktop block
    # If blog no-data block still exists inside first @media min-width
    blog_no_data = "  /* Blog no-data — Figma 5378:147108"
    if blog_no_data in content:
        content = remove_between(
            content,
            blog_no_data,
            "  section.company-blog-list .company-blog-list__divider {",
        )
        # remove divider rule too up to closing brace
        idx = content.find("  section.company-blog-list .company-blog-list__divider {")
        if idx != -1:
            end_idx = content.find("\n}", idx) + 2
            content = content[:idx] + content[end_idx:]

    CSS.write_text(content, encoding="utf-8")
    print(f"Wrote {CSS} ({len(content.splitlines())} lines)")


if __name__ == "__main__":
    main()

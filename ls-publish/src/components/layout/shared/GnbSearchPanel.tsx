"use client";

import { InputAdornment, TextField } from "@mui/material";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { gnbSearchContent, type GnbSearchTag } from "@/data/gnb/gnbSearchContent";
import { buildSearchAllHref } from "@/data/search/searchAllContent";

type GnbSearchPanelProps = {
  isOpen: boolean;
  onNavigate?: () => void;
};

function PopularTags({
  tags,
  className,
  isOpen,
  onNavigate,
}: {
  tags: readonly GnbSearchTag[];
  className: string;
  isOpen: boolean;
  onNavigate?: () => void;
}) {
  return (
    <ul className={className}>
      {tags.map((tag) => (
        <li key={tag.label}>
          <Link
            href={tag.href}
            className="gnb_search__tag"
            prefetch={false}
            tabIndex={isOpen ? undefined : -1}
            onClick={() => onNavigate?.()}
          >
            {tag.label}
          </Link>
        </li>
      ))}
    </ul>
  );
}

/** Figma 7334:131967 (PC) · 7334:131884 (MO) — #gnb-search-panel (body portal) */
export default function GnbSearchPanel({
  isOpen,
  onNavigate,
}: GnbSearchPanelProps) {
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const [query, setQuery] = useState("");
  const [canPortal, setCanPortal] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const hasQuery = query.length > 0;
  const { popularTagsMobile } = gnbSearchContent;

  useEffect(() => {
    setCanPortal(true);
  }, []);

  useEffect(() => {
    const media = window.matchMedia("(max-width: 780px)");
    const update = () => setIsMobile(media.matches);
    update();
    media.addEventListener("change", update);
    return () => media.removeEventListener("change", update);
  }, []);

  useEffect(() => {
    if (!isOpen) return;
    inputRef.current?.focus({ preventScroll: true });
  }, [isOpen]);

  useEffect(() => {
    if (isOpen) return;
    setQuery("");
  }, [isOpen]);

  if (!canPortal) {
    return null;
  }

  const placeholder = isMobile
    ? gnbSearchContent.searchPlaceholderMobile
    : gnbSearchContent.searchPlaceholder;

  return createPortal(
    <>
      {isOpen ? (
        <button
          type="button"
          className="gnb_search_dim"
          aria-label="검색 닫기"
          tabIndex={-1}
          onClick={() => onNavigate?.()}
        />
      ) : null}
      <div
        id="gnb-search-panel"
        className={isOpen ? "gnb_search is-open" : "gnb_search"}
        aria-hidden={!isOpen}
      >
        <div className="gnb_search__inner">
        <form
          className="gnb_search__form"
          role="search"
          onSubmit={(event) => {
            event.preventDefault();
            router.push(buildSearchAllHref(query));
            onNavigate?.();
          }}
        >
          <TextField
            inputRef={inputRef}
            className={`guide_field guide_field--search gnb_search__field${
              hasQuery ? " gnb_search__field--filled" : ""
            }`}
            placeholder={placeholder}
            aria-label={gnbSearchContent.searchPlaceholder}
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            slotProps={{
              input: {
                startAdornment: (
                  <InputAdornment
                    position="start"
                    className="gnb_search__mark"
                    disableTypography
                  >
                    <img
                      src="/pub/ico/ico_gnb_search_ai_32.svg"
                      alt=""
                      width={32}
                      height={36}
                      className="gnb_search__mark-icon"
                      aria-hidden
                    />
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment
                    position="end"
                    className="guide_field__search-adorn gnb_search__adorn"
                  >
                    {hasQuery ? (
                      <button
                        type="button"
                        className="gnb_search__clear"
                        aria-label="Clear search"
                        onClick={() => setQuery("")}
                      >
                        <span className="gnb_search__clear-icon" aria-hidden>
                          <img
                            src="/pub/ico/ico_clear_12_black.svg"
                            alt=""
                            width={12}
                            height={12}
                            className="gnb_search__clear-icon-pc"
                          />
                          <img
                            src="/pub/ico/ico_gnb_search_clear_24.svg"
                            alt=""
                            width={24}
                            height={24}
                            className="gnb_search__clear-icon-mo"
                          />
                        </span>
                      </button>
                    ) : null}
                    <button
                      type="submit"
                      className="guide_field__search-icon-button"
                      aria-label="Search"
                    >
                      <img
                        src="/pub/ico/ico_search_24.svg"
                        alt=""
                        className="gnb_search__search-icon gnb_search__search-icon--pc"
                        width={26}
                        height={26}
                      />
                      <img
                        src="/pub/ico/ico_search_24.svg"
                        alt=""
                        className="gnb_search__search-icon gnb_search__search-icon--mo"
                        width={20}
                        height={20}
                      />
                    </button>
                  </InputAdornment>
                ),
              },
            }}
          />
        </form>

          <div className="gnb_search__popular">
          <span className="gnb_search__popular-label gnb_search__popular-label--pc">
            {gnbSearchContent.popularSearchLabel}
          </span>
          <span className="gnb_search__popular-label gnb_search__popular-label--mo">
            {gnbSearchContent.popularSearchLabel}
          </span>

          <PopularTags
            tags={gnbSearchContent.popularTags}
            className="gnb_search__tags gnb_search__tags--pc"
            isOpen={isOpen}
            onNavigate={onNavigate}
          />
          <PopularTags
            tags={[...popularTagsMobile.row1, ...popularTagsMobile.row2]}
            className="gnb_search__tags gnb_search__tags--mo"
            isOpen={isOpen}
            onNavigate={onNavigate}
          />
          </div>
        </div>
      </div>
    </>,
    document.body,
  );
}

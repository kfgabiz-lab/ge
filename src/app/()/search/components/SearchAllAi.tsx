"use client";

/* 260812 start */
import { useLayoutEffect, useRef, useState } from "react";
import {
  searchAllAiSummaryHtml,
  searchAllPage,
} from "@/data/search/searchAllContent";

const AI_SKELETON_LINE_COUNT = 9;
/** CSS collapsed 높이와 동일 */
const COLLAPSED_HEIGHT = 460;

type SearchAllAiProps = {
  html?: string;
  loading?: boolean;
  defaultExpanded?: boolean;
};

function SearchAllAiSkeleton({ label = "Loading AI summary" }: { label?: string }) {
  return (
    <div
      className="search_all__ai search_all__ai--skeleton"
      aria-busy="true"
      aria-label={label}
    >
      <div className="search_all__ai-content">
        <div className="search_all__ai-head">
          <span
            className="search_all__ai-skel search_all__ai-skel--badge"
            aria-hidden
          />
          <span
            className="search_all__ai-skel search_all__ai-skel--tit"
            aria-hidden
          />
          <span
            className="search_all__ai-skel search_all__ai-skel--note"
            aria-hidden
          />
        </div>
        <div className="search_all__ai-body">
          <ul className="search_all__ai-list">
            {Array.from({ length: AI_SKELETON_LINE_COUNT }, (_, index) => (
              <li key={index}>
                <span className="search_all__ai-skel-line" aria-hidden>
                  <span className="search_all__ai-skel search_all__ai-skel--bullet" />
                  <span className="search_all__ai-skel search_all__ai-skel--bar" />
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

/**
 * AI 답변에 이미지가 섞여 렌더링 시점에 높이가 변동될 수 있으므로,
 * 내부 콘텐츠에 ResizeObserver를 붙여 scrollHeight를 실시간 체크한다.
 * 인지(측정) 중에는 스켈레톤을 표시한다.
 */
export default function SearchAllAi({
  html = searchAllAiSummaryHtml,
  loading = false,
  defaultExpanded = false,
}: SearchAllAiProps) {
  const hostRef = useRef<HTMLDivElement>(null);
  const rootRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const innerRef = useRef<HTMLDivElement>(null);
  const expandedRef = useRef(defaultExpanded);
  const [aiExpanded, setAiExpanded] = useState(defaultExpanded);
  const [aiNeedsMore, setAiNeedsMore] = useState(false);
  const [aiChecked, setAiChecked] = useState(false);

  expandedRef.current = aiExpanded;

  useLayoutEffect(() => {
    if (loading) {
      setAiNeedsMore(false);
      setAiExpanded(false);
      setAiChecked(false);
      expandedRef.current = false;
      return;
    }

    const root = rootRef.current;
    const content = contentRef.current;
    const inner = innerRef.current;
    const host = hostRef.current;
    if (!root || !content || !inner || !host) {
      return;
    }

    setAiChecked(false);

    const checkScrollHeight = () => {
      if (expandedRef.current) {
        return;
      }

      const head = content.querySelector<HTMLElement>(".search_all__ai-head");
      const styles = getComputedStyle(root);
      const padY =
        parseFloat(styles.paddingTop) + parseFloat(styles.paddingBottom);
      const borderY =
        parseFloat(styles.borderTopWidth) + parseFloat(styles.borderBottomWidth);
      const headH = head?.offsetHeight ?? 0;
      const headMb = head
        ? parseFloat(getComputedStyle(head).marginBottom) || 0
        : 0;

      const natural = headH + headMb + inner.scrollHeight + padY + borderY;
      const needsMore = natural > COLLAPSED_HEIGHT;
      setAiNeedsMore((prev) => (prev === needsMore ? prev : needsMore));
      setAiChecked(true);
    };

    checkScrollHeight();

    const observer = new ResizeObserver(checkScrollHeight);
    observer.observe(inner);

    const images = inner.querySelectorAll("img");
    const onImgLoad = () => checkScrollHeight();
    images.forEach((img) => {
      if (!img.complete) {
        img.addEventListener("load", onImgLoad);
        img.addEventListener("error", onImgLoad);
      }
    });

    window.addEventListener("resize", checkScrollHeight);

    return () => {
      observer.disconnect();
      images.forEach((img) => {
        img.removeEventListener("load", onImgLoad);
        img.removeEventListener("error", onImgLoad);
      });
      window.removeEventListener("resize", checkScrollHeight);
    };
  }, [loading, html]);

  if (loading) {
    return <SearchAllAiSkeleton />;
  }

  const showSkeleton = !aiChecked;
  const isCollapsed = aiChecked && !aiExpanded && aiNeedsMore;

  return (
    <div ref={hostRef} className="search_all__ai-host">
      {showSkeleton ? (
        <SearchAllAiSkeleton label="Analyzing AI summary" />
      ) : null}
      <div
        ref={rootRef}
        className={[
          "search_all__ai",
          showSkeleton ? "search_all__ai--measuring" : null,
          aiExpanded ? "is-expanded" : null,
          isCollapsed ? "is-clamped" : null,
        ]
          .filter(Boolean)
          .join(" ")}
        aria-hidden={showSkeleton}
      >
        <div ref={contentRef} className="search_all__ai-content">
          <div className="search_all__ai-head">
            <img
              className="search_all__ai-badge"
              src="/pub/img/search/search_all_ai_badge.png"
              alt=""
              width={58}
              height={58}
              decoding="async"
              aria-hidden
            />
            <h2 className="search_all__ai-tit">{searchAllPage.aiTitle}</h2>
            <p className="search_all__ai-note">{searchAllPage.aiDisclaimer}</p>
          </div>
          <div className="search_all__ai-body">
            <ul className="search_all__ai-list">
              <li>
                <div
                  ref={innerRef}
                  className="search_all__ai-list-text"
                  dangerouslySetInnerHTML={{ __html: html }}
                />
              </li>
            </ul>
          </div>
        </div>
        {isCollapsed ? (
          <div className="search_all__ai-fade" aria-hidden />
        ) : null}
        {aiChecked && aiNeedsMore ? (
          <div className="search_all__ai-more">
            <span className="search_all__ai-more-line" aria-hidden />
            <button
              type="button"
              className="search_all__ai-more-btn"
              aria-expanded={aiExpanded}
              onClick={() => setAiExpanded((prev) => !prev)}
            >
              {aiExpanded ? "Read less" : "Read more"}
              <span className="search_all__ai-more-icon" aria-hidden />
            </button>
          </div>
        ) : null}
      </div>
    </div>
  );
}
/* 260812 end */

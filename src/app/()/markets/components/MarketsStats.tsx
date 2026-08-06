"use client";

import { useEffect, useRef, useState } from "react";
import type { MarketStatItem } from "../data/marketsDataCenterContent";

type MarketsStatsProps = {
  items: MarketStatItem[];
};

const COUNT_DURATION = 1600;

function easeOutCubic(progress: number) {
  return 1 - (1 - progress) ** 3;
}

function parseNumericStatValue(value: string) {
  const useComma = value.includes(",");
  const normalized = value.replace(/,/g, "");

  if (!/^\d+(\.\d+)?$/.test(normalized)) {
    return null;
  }

  const target = Number(normalized);
  if (!Number.isFinite(target)) {
    return null;
  }

  return { target, useComma };
}

function formatStatNumber(value: number, useComma: boolean) {
  return useComma ? value.toLocaleString("en-US") : String(value);
}

function useCountUp(target: number, isActive: boolean, delay = 0) {
  const [value, setValue] = useState(0);

  useEffect(() => {
    if (!isActive) {
      setValue(0);
      return;
    }

    let frameId = 0;
    let startTime: number | null = null;

    const delayTimeout = window.setTimeout(() => {
      const animate = (timestamp: number) => {
        if (startTime === null) {
          startTime = timestamp;
        }

        const elapsed = timestamp - startTime;
        const progress = Math.min(elapsed / COUNT_DURATION, 1);
        setValue(Math.round(easeOutCubic(progress) * target));

        if (progress < 1) {
          frameId = requestAnimationFrame(animate);
        }
      };

      frameId = requestAnimationFrame(animate);
    }, delay);

    return () => {
      window.clearTimeout(delayTimeout);
      cancelAnimationFrame(frameId);
    };
  }, [delay, isActive, target]);

  return value;
}

type MarketsStatValueProps = {
  item: MarketStatItem;
  isActive: boolean;
  delay: number;
};

function MarketsStatValue({ item, isActive, delay }: MarketsStatValueProps) {
  const parsed = parseNumericStatValue(item.value);
  const count = useCountUp(parsed?.target ?? 0, isActive && parsed !== null, delay);
  const displayValue = parsed
    ? formatStatNumber(count, parsed.useComma)
    : item.value;

  return (
    <p className="markets_stats__value">
      {displayValue}
      {item.valueUnit ? (
        <span className="markets_stats__value-unit">{item.valueUnit}</span>
      ) : null}
      {item.valueSuffix ? (
        <span className="markets_stats__value-suffix">{item.valueSuffix}</span>
      ) : null}
    </p>
  );
}

export default function MarketsStats({ items }: MarketsStatsProps) {
  const panelRef = useRef<HTMLDivElement | null>(null);
  const [isInView, setIsInView] = useState(false);

  useEffect(() => {
    const panel = panelRef.current;
    if (!panel) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        setIsInView(true);
        observer.disconnect();
      },
      { threshold: 0.25 },
    );

    observer.observe(panel);

    return () => observer.disconnect();
  }, []);

  return (
    <section className="markets_stats">
      <div className="inner">
        <div ref={panelRef} className="markets_stats__panel">
          <div className="markets_stats__grid">
            {items.map((item, index) => (
              <article key={item.id} className="markets_stats__col">
                <p className="markets_stats__label">{item.label}</p>
                <div className="markets_stats__headline">
                  <MarketsStatValue
                    item={item}
                    isActive={isInView}
                    delay={index * 120}
                  />
                  <p className="markets_stats__sublabel">{item.sublabel}</p>
                </div>
                <p className="markets_stats__desc">{item.description}</p>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

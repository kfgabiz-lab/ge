"use client";

import { useCallback, useEffect, useId, useRef, useState } from "react";
import Link from "next/link";
import type { ReactNode } from "react";
import {
  getYoutubeEmbedSrc,
  getYoutubePosterSrc,
  isYoutubeEmbedOrigin,
  parseYoutubeMessage,
  postYoutubeCommand,
  setupYoutubeIframe,
  YOUTUBE_PLAYER_ENDED,
} from "@/lib/youtubeEmbed";
import { useYoutubeInViewPlayback } from "@/lib/useYoutubeInViewPlayback";

type CommonBanner03Props = {
  titleTop?: string;
  title?: string;
  description?: string[];
  linkHref?: string;
  linkLabel?: string;
  linkExternal?: boolean;
  youtubeVideoId?: string;
  videoPoster?: string;
};

function isExternalHref(href: string) {
  return href.startsWith("http://") || href.startsWith("https://");
}

function BannerLink({
  href,
  linkExternal,
  className,
  children,
}: {
  href: string;
  linkExternal?: boolean;
  className: string;
  children: ReactNode;
}) {
  if (linkExternal || isExternalHref(href)) {
    return (
      <a
        href={href}
        className={className}
        target="_blank"
        rel="noopener noreferrer"
      >
        {children}
      </a>
    );
  }

  return (
    <Link href={href} className={className}>
      {children}
    </Link>
  );
}

const DEFAULT_DESCRIPTION = [
  "Need help with installation, configuration, troubleshooting, or maintenance?",
  "Watch step-by-step video guides for the MCCB series in our Tech Hub.",
];

export default function CommonBanner03({
  titleTop = "Tech Hub Video Guide",
  title = "MCCB Video Tutorials",
  description = DEFAULT_DESCRIPTION,
  linkHref = "#product-video",
  linkLabel = "Explore Tech Hub",
  linkExternal,
  youtubeVideoId,
  videoPoster,
}: CommonBanner03Props) {
  const iframeId = useId().replace(/:/g, "");
  const sectionRef = useRef<HTMLElement | null>(null);
  const iframeRef = useRef<HTMLIFrameElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isIframeMounted, setIsIframeMounted] = useState(false);

  const enterView = useCallback(() => {
    setIsIframeMounted(true);
    setIsPlaying(true);
  }, []);

  const leaveView = useCallback(() => {
    setIsPlaying(false);
  }, []);

  const { markUserPaused, markUserPlaying, resetUserPause } =
    useYoutubeInViewPlayback(
      sectionRef,
      iframeRef,
      { onEnterView: enterView, onLeaveView: leaveView },
      { enabled: Boolean(youtubeVideoId) },
    );

  const posterSrc =
    videoPoster ??
    (youtubeVideoId ? getYoutubePosterSrc(youtubeVideoId) : "/img/devices/product/banner_hub_video.jpg");

  const playIframe = useCallback(() => {
    const iframe = iframeRef.current;
    if (!iframe) return;
    setupYoutubeIframe(iframe);
    postYoutubeCommand(iframe, "playVideo");
  }, []);

  const handleIframeLoad = useCallback(
    (iframe: HTMLIFrameElement) => {
      setupYoutubeIframe(iframe);
      if (isPlaying) playIframe();
    },
    [isPlaying, playIframe],
  );

  useEffect(() => {
    if (!isPlaying || !isIframeMounted) return;
    playIframe();
  }, [isPlaying, isIframeMounted, playIframe]);

  useEffect(() => {
    const onMessage = (event: MessageEvent) => {
      if (!isYoutubeEmbedOrigin(event.origin)) return;
      const data = parseYoutubeMessage(event.data);
      if (data?.event === "onStateChange" && data.info === YOUTUBE_PLAYER_ENDED) {
        setIsPlaying(false);
        resetUserPause();
      }
    };
    window.addEventListener("message", onMessage);
    return () => window.removeEventListener("message", onMessage);
  }, [resetUserPause]);

  const handleToggle = () => {
    if (!youtubeVideoId) return;
    if (!isPlaying) {
      markUserPlaying();
      setIsIframeMounted(true);
      setIsPlaying(true);
    } else {
      markUserPaused();
      postYoutubeCommand(iframeRef.current, "pauseVideo");
      setIsPlaying(false);
    }
  };

  return (
    <section className="common_banner_03" ref={sectionRef}>
      <div className="inner common_banner_03__panel">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img loading="lazy" decoding="async"
          src="/img/devices/product/banner_hub_bg.png"
          alt=""
          aria-hidden
          className="common_banner_03__bg"
        />

        <div
          className={
            isPlaying
              ? "common_banner_03__video is-playing"
              : "common_banner_03__video"
          }
          aria-hidden
        >
          {youtubeVideoId && isIframeMounted ? (
            <div className="common_banner_03__embed">
              <iframe
                ref={iframeRef}
                id={iframeId}
                className="common_banner_03__iframe"
                src={getYoutubeEmbedSrc(youtubeVideoId)}
                title={title}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                referrerPolicy="strict-origin-when-cross-origin"
                tabIndex={-1}
                onLoad={(e) => handleIframeLoad(e.currentTarget)}
              />
            </div>
          ) : null}

          <div
            className={
              isPlaying
                ? "common_banner_03__poster"
                : "common_banner_03__poster is-visible"
            }
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img loading="lazy" decoding="async"
              src={posterSrc}
              alt=""
              className="common_banner_03__video-img"
            />
            <div className="common_banner_03__dim" />
          </div>

          {youtubeVideoId && (
            <button
              type="button"
              className="common_banner_03__toggle"
              aria-label={isPlaying ? "Pause video" : "Play video"}
              onClick={handleToggle}
            >
              <span
                className={
                  isPlaying
                    ? "common_banner_03__icon common_banner_03__icon--pause"
                    : "common_banner_03__icon common_banner_03__icon--play"
                }
                aria-hidden
              />
            </button>
          )}
        </div>

        {linkHref ? (
          <BannerLink
            href={linkHref}
            linkExternal={linkExternal}
            className="common_banner_03__body"
          >
            <div className="common_banner_03__text">
              <p className="common_banner_03__kicker">{titleTop}</p>
              <h2 className="common_banner_03__tit">{title}</h2>
              <div className="common_banner_03__desc">
                {description.map((line) => (
                  <p key={line}>{line}</p>
                ))}
              </div>
            </div>

            <span className="btn-text-30 common_banner_03__link">
              {linkLabel}
              <span className="btn-text-30__icon">
                <span className="icon_arrow-18" aria-hidden="true" />
              </span>
            </span>
          </BannerLink>
        ) : (
          <div className="common_banner_03__body">
            <div className="common_banner_03__text">
              <p className="common_banner_03__kicker">{titleTop}</p>
              <h2 className="common_banner_03__tit">{title}</h2>
              <div className="common_banner_03__desc">
                {description.map((line) => (
                  <p key={line}>{line}</p>
                ))}
              </div>
            </div>

            <span className="btn-text-30 common_banner_03__link">
              {linkLabel}
              <span className="btn-text-30__icon">
                <span className="icon_arrow-18" aria-hidden="true" />
              </span>
            </span>
          </div>
        )}
      </div>
    </section>
  );
}

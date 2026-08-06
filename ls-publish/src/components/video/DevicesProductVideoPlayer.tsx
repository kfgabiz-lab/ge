"use client";

import { useCallback, useEffect, useId, useRef, useState } from "react";
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

export type DevicesProductVideoPlayerProps = {
  youtubeVideoId: string;
  title?: string;
  poster?: string;
  /** true: 뷰포트 진입 시 자동 재생 (제품 상세 Video 섹션) */
  autoplayInView?: boolean;
};

export default function DevicesProductVideoPlayer({
  youtubeVideoId,
  title = "Product video",
  poster,
  autoplayInView = false,
}: DevicesProductVideoPlayerProps) {
  const iframeId = useId().replace(/:/g, "");
  const rootRef = useRef<HTMLDivElement | null>(null);
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

  const { markUserPaused, markUserPlaying, resetUserPause } = useYoutubeInViewPlayback(
    rootRef,
    iframeRef,
    {
      onEnterView: enterView,
      onLeaveView: leaveView,
    },
    { enabled: autoplayInView },
  );

  const posterSrc = poster ?? getYoutubePosterSrc(youtubeVideoId);

  const playIframe = useCallback(() => {
    const iframe = iframeRef.current;
    if (!iframe) return;
    setupYoutubeIframe(iframe);
    postYoutubeCommand(iframe, "playVideo");
    window.setTimeout(() => postYoutubeCommand(iframe, "playVideo"), 400);
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
    if (!isPlaying) {
      if (autoplayInView) markUserPlaying();
      setIsIframeMounted(true);
      setIsPlaying(true);
      return;
    }

    if (autoplayInView) markUserPaused();
    postYoutubeCommand(iframeRef.current, "pauseVideo");
    setIsPlaying(false);
  };

  return (
    <div
      ref={rootRef}
      className={
        isPlaying
          ? "devices_product_video__player is-playing"
          : "devices_product_video__player"
      }
    >
      {isIframeMounted ? (
        <div className="devices_product_video__embed">
          <iframe
            ref={iframeRef}
            id={iframeId}
            className="devices_product_video__iframe"
            src={getYoutubeEmbedSrc(youtubeVideoId, { autoplay: isPlaying })}
            title={title}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            referrerPolicy="strict-origin-when-cross-origin"
            tabIndex={-1}
            onLoad={(event) => handleIframeLoad(event.currentTarget)}
          />
        </div>
      ) : null}

      <div
        className={
          isPlaying
            ? "devices_product_video__poster"
            : "devices_product_video__poster is-visible"
        }
        aria-hidden={isPlaying}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          loading="lazy"
          decoding="async"
          className="devices_product_video__poster-img"
          src={posterSrc}
          alt=""
          onError={(event) => {
            const fallback = getYoutubePosterSrc(youtubeVideoId);
            if (event.currentTarget.src !== fallback) {
              event.currentTarget.src = fallback;
            }
          }}
        />
        <div className="devices_product_video__dim" />
      </div>

      <button
        type="button"
        className="devices_product_video__toggle"
        aria-label={isPlaying ? "Pause video" : "Play video"}
        onClick={handleToggle}
      >
        <span
          className={
            isPlaying
              ? "devices_product_video__icon devices_product_video__icon--pause"
              : "devices_product_video__icon devices_product_video__icon--play"
          }
          aria-hidden
        />
      </button>
    </div>
  );
}

'use client';

import Image from 'next/image';
import { useCallback, useEffect, useRef, useState, type KeyboardEvent, type TouchEvent } from 'react';
import { ChevronLeft, ChevronRight, Play } from 'lucide-react';
import type { GalleryMedia, VideoSource } from '@/lib/shopify/types';

const SWIPE_THRESHOLD = 40;

// 720p on phones, 1080p on larger screens (sources are sorted smallest first).
function pickSource(sources: VideoSource[]) {
  const wide = typeof window !== 'undefined' && window.innerWidth * (window.devicePixelRatio || 1) > 1400;
  const target = wide ? 1080 : 720;
  return sources.find(s => s.height >= target) ?? sources[sources.length - 1];
}

function GalleryVideo({ media, active }: { media: Extract<GalleryMedia, { kind: 'video' }>; active: boolean }) {
  const ref = useRef<HTMLVideoElement>(null);
  const [src, setSrc] = useState<string | null>(null);

  useEffect(() => { setSrc(pickSource(media.sources).url); }, [media.sources]);

  // Play (muted, like Etsy) only while this slide is showing.
  // Browsers may refuse to start a video that's still fading in, so retry once
  // the slide transition has finished.
  useEffect(() => {
    const video = ref.current;
    if (!video) return;
    if (!active) { video.pause(); return; }
    video.muted = true;
    const tryPlay = () => { if (video.paused) video.play().catch(() => { /* autoplay blocked: controls remain */ }); };
    tryPlay();
    const retry = window.setTimeout(tryPlay, 450);
    return () => window.clearTimeout(retry);
  }, [active, src]);

  return (
    <video
      ref={ref}
      className="gallery-video"
      src={src ?? undefined}
      poster={media.poster?.url}
      muted
      loop
      playsInline
      controls
      preload="metadata"
      aria-label={media.alt}
    />
  );
}

export function ProductGallery({ media, title }: { media: GalleryMedia[]; title: string }) {
  const [index, setIndex] = useState(0);
  const touchStart = useRef<number | null>(null);
  const thumbsRef = useRef<HTMLDivElement>(null);
  const count = media.length;

  const go = useCallback((next: number) => setIndex(((next % count) + count) % count), [count]);
  const prev = useCallback(() => go(index - 1), [go, index]);
  const next = useCallback(() => go(index + 1), [go, index]);

  // Keep the active thumbnail in view as the shopper pages through.
  useEffect(() => {
    const thumb = thumbsRef.current?.children[index] as HTMLElement | undefined;
    thumb?.scrollIntoView({ block: 'nearest', inline: 'nearest', behavior: 'smooth' });
  }, [index]);

  if (count === 0) return <div className="gallery"><div className="gallery-stage" /></div>;

  const onKeyDown = (event: KeyboardEvent) => {
    if (event.key === 'ArrowLeft') { event.preventDefault(); prev(); }
    if (event.key === 'ArrowRight') { event.preventDefault(); next(); }
  };
  const onTouchStart = (event: TouchEvent) => { touchStart.current = event.touches[0].clientX; };
  const onTouchEnd = (event: TouchEvent) => {
    if (touchStart.current === null) return;
    const delta = event.changedTouches[0].clientX - touchStart.current;
    touchStart.current = null;
    if (Math.abs(delta) > SWIPE_THRESHOLD) (delta > 0 ? prev : next)();
  };

  return (
    <div className="gallery" role="region" aria-roledescription="carousel" aria-label={`${title} photos and video`}>
      {count > 1 && (
        <div className="gallery-thumbs" ref={thumbsRef} role="tablist" aria-label="Choose a photo">
          {media.map((item, i) => {
            const thumb = item.kind === 'image' ? item.image : item.poster;
            return (
              <button
                key={i}
                type="button"
                role="tab"
                aria-selected={i === index}
                aria-label={`${item.kind === 'video' ? 'Video' : 'Photo'} ${i + 1} of ${count}`}
                className={`gallery-thumb ${i === index ? 'is-active' : ''}`}
                onClick={() => setIndex(i)}
              >
                {thumb && <Image src={thumb.url} alt="" fill sizes="80px" />}
                {item.kind === 'video' && <span className="gallery-thumb-play" aria-hidden="true"><Play size={16} fill="currentColor" /></span>}
              </button>
            );
          })}
        </div>
      )}

      <div className="gallery-stage" tabIndex={0} onKeyDown={onKeyDown} onTouchStart={onTouchStart} onTouchEnd={onTouchEnd}>
        {media.map((item, i) => (
          <div key={i} className={`gallery-slide ${i === index ? 'is-active' : ''}`} aria-hidden={i !== index} role="group" aria-roledescription="slide" aria-label={`${i + 1} of ${count}`}>
            {item.kind === 'image'
              ? <Image src={item.image.url} alt={item.alt} fill priority={i === 0} loading={i === 0 ? undefined : Math.abs(i - index) <= 1 ? 'eager' : 'lazy'} sizes="(max-width: 900px) 100vw, 50vw" />
              : <GalleryVideo media={item} active={i === index} />}
          </div>
        ))}

        {count > 1 && (
          <>
            <button type="button" className="gallery-arrow gallery-arrow-prev" onClick={prev} aria-label="Previous photo"><ChevronLeft size={26} strokeWidth={2.2} /></button>
            <button type="button" className="gallery-arrow gallery-arrow-next" onClick={next} aria-label="Next photo"><ChevronRight size={26} strokeWidth={2.2} /></button>
            <span className="gallery-counter" aria-live="polite">{index + 1} / {count}</span>
          </>
        )}
      </div>
    </div>
  );
}

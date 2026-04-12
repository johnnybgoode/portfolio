'use client';

import { useRouter } from 'next/navigation';
import { useCallback, useEffect } from 'react';
import {
  lightboxAlbum,
  lightboxBackdrop,
  lightboxClose,
  lightboxImg,
  lightboxInner,
  lightboxMeta,
  lightboxNext,
  lightboxPrev,
  lightboxTitle,
} from '~styles/components/photos.css';
import type { Photo } from '../../types/photos';

type LightboxProps = {
  photos: Photo[];
  currentIndex: number;
  albumName: string;
  subAlbumName: string;
  basePath: string; // e.g. /photos/street/new-york
};

export function Lightbox({
  photos,
  currentIndex,
  albumName,
  subAlbumName,
  basePath,
}: LightboxProps) {
  const router = useRouter();
  const photo = photos[currentIndex];

  const close = useCallback(() => {
    router.replace(basePath, { scroll: false });
  }, [router, basePath]);

  const go = useCallback(
    (delta: number) => {
      const next = (currentIndex + delta + photos.length) % photos.length;
      router.replace(`${basePath}?photo=${next}`, { scroll: false });
    },
    [router, basePath, currentIndex, photos.length],
  );

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') close();
      if (e.key === 'ArrowLeft') go(-1);
      if (e.key === 'ArrowRight') go(1);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [close, go]);

  if (!photo) return null;

  return (
    <div
      aria-label="Photo viewer"
      aria-modal="true"
      className={lightboxBackdrop}
      onClick={close}
      role="dialog"
    >
      <div className={lightboxInner} onClick={e => e.stopPropagation()}>
        <button
          aria-label="Close"
          className={lightboxClose}
          onClick={close}
          type="button"
        >
          ✕
        </button>
        <button
          aria-label="Previous photo"
          className={lightboxPrev}
          onClick={() => go(-1)}
          type="button"
        >
          ‹
        </button>
        <img
          alt={photo.title ?? photo.filename}
          className={lightboxImg}
          src={photo.url}
        />
        <div className={lightboxMeta}>
          {photo.title && <div className={lightboxTitle}>{photo.title}</div>}
          <div className={lightboxAlbum}>
            {albumName} · {subAlbumName}
          </div>
        </div>
        <button
          aria-label="Next photo"
          className={lightboxNext}
          onClick={() => go(1)}
          type="button"
        >
          ›
        </button>
      </div>
    </div>
  );
}

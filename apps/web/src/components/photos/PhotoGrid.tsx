'use client';

import {
  photoGrid,
  photoHint,
  photoHintIcon,
  photoImg,
  photoItem,
  photoRow,
} from '~styles/components/photos.css';
import type { Photo } from '../../types/photos';
import { GalleryBreadcrumb } from './GalleryBreadcrumb';

const ROW_HEIGHT = 220;
const GAP = 8; // matches vars.space['300'] = 8px

type Row = Photo[];

function buildRows(photos: Photo[], containerWidth = 1000): Row[] {
  const rows: Row[] = [];
  let current: Photo[] = [];
  let aspectSum = 0;

  for (const photo of photos) {
    const aspect =
      photo.width > 0 && photo.height > 0 ? photo.width / photo.height : 1.5;
    current.push(photo);
    aspectSum += aspect;

    const gaps = (current.length - 1) * GAP;
    const rowHeight = (containerWidth - gaps) / aspectSum;

    if (rowHeight <= ROW_HEIGHT) {
      rows.push(current);
      current = [];
      aspectSum = 0;
    }
  }

  if (current.length > 0) rows.push(current);
  return rows;
}

type PhotoGridProps = {
  albumName: string;
  albumSlug: string;
  subAlbumName: string;
  subAlbumSlug: string;
  photos: Photo[];
  onPhotoClick: (index: number) => void;
};

export function PhotoGrid({
  albumName,
  albumSlug,
  subAlbumName,
  subAlbumSlug: _subAlbumSlug,
  photos,
  onPhotoClick,
}: PhotoGridProps) {
  const rows = buildRows(photos);
  let globalIndex = 0;

  return (
    <>
      <GalleryBreadcrumb
        crumbs={[
          { label: 'Photos', href: '/photos' },
          { label: albumName, href: `/photos/${albumSlug}` },
        ]}
        current={subAlbumName}
      />
      <div className={photoGrid}>
        {rows.map((row, rowIdx) => {
          const rowStart = globalIndex;
          globalIndex += row.length;
          return (
            <div className={photoRow} key={rowIdx}>
              {row.map((photo, i) => {
                const aspect =
                  photo.width > 0 && photo.height > 0
                    ? photo.width / photo.height
                    : 1.5;
                const idx = rowStart + i;
                return (
                  <button
                    aria-label={`Open photo ${photo.title ?? photo.filename}`}
                    className={photoItem}
                    key={photo.filename}
                    onClick={() => onPhotoClick(idx)}
                    style={{ flex: aspect }}
                    type="button"
                  >
                    <img
                      alt={photo.title ?? photo.filename}
                      className={photoImg}
                      src={photo.url}
                    />
                    <div className={photoHint}>
                      <div className={photoHintIcon}>+</div>
                    </div>
                  </button>
                );
              })}
            </div>
          );
        })}
      </div>
    </>
  );
}

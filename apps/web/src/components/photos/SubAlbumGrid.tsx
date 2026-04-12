import Link from 'next/link';
import {
  subAlbumCount,
  subAlbumCover,
  subAlbumGrid,
  subAlbumItem,
  subAlbumName,
  subAlbumOverlay,
} from '~styles/components/photos.css';
import type { SubAlbum } from '../../types/photos';
import { GalleryBreadcrumb } from './GalleryBreadcrumb';

type SubAlbumGridProps = {
  albumName: string;
  albumSlug: string;
  subAlbums: SubAlbum[];
};

export function SubAlbumGrid({
  albumName,
  albumSlug,
  subAlbums,
}: SubAlbumGridProps) {
  return (
    <>
      <GalleryBreadcrumb
        crumbs={[{ label: 'Photos', href: '/photos' }]}
        current={albumName}
      />
      <div className={subAlbumGrid}>
        {subAlbums.map(sub => (
          <Link
            className={subAlbumItem}
            href={`/photos/${albumSlug}/${sub.slug}`}
            key={sub.slug}
          >
            <img alt={sub.name} className={subAlbumCover} src={sub.coverUrl} />
            <div className={subAlbumOverlay}>
              <div className={subAlbumName}>{sub.name}</div>
              <div className={subAlbumCount}>{sub.photoCount} photos</div>
            </div>
          </Link>
        ))}
      </div>
    </>
  );
}

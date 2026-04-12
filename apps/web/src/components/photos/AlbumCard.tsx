import Link from 'next/link';
import {
  albumCard,
  albumCount,
  albumCover,
  albumName,
  albumOverlay,
} from '~styles/components/photos.css';
import type { Album } from '../../types/photos';

type AlbumCardProps = {
  album: Album;
};

export function AlbumCard({ album }: AlbumCardProps) {
  return (
    <Link className={albumCard} href={`/photos/${album.slug}`}>
      <img alt={album.name} className={albumCover} src={album.coverUrl} />
      <div className={albumOverlay}>
        <div className={albumName}>{album.name}</div>
        <div className={albumCount}>
          {album.subAlbums.length}{' '}
          {album.subAlbums.length === 1 ? 'gallery' : 'galleries'} ·{' '}
          {album.photoCount} photos
        </div>
      </div>
    </Link>
  );
}

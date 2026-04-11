import { albumGrid } from '~styles/components/photos.css';
import type { Album } from '../../types/photos';
import { AlbumCard } from './AlbumCard';

type AlbumGridProps = {
  albums: Album[];
};

export function AlbumGrid({ albums }: AlbumGridProps) {
  return (
    <div className={albumGrid}>
      {albums.map(album => (
        <AlbumCard album={album} key={album.slug} />
      ))}
    </div>
  );
}

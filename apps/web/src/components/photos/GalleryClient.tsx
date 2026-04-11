'use client';

import { useSuspenseQuery } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { pageContainer } from '~styles/components/photos.css';
import { getManifest } from '../../data/photos';
import { AlbumGrid } from './AlbumGrid';
import { Lightbox } from './Lightbox';
import { PhotoGrid } from './PhotoGrid';
import { SubAlbumGrid } from './SubAlbumGrid';

type GalleryClientProps = {
  albumSlug: string | null;
  subAlbumSlug: string | null;
  photoIndex: number | null;
};

export function GalleryClient({
  albumSlug,
  subAlbumSlug,
  photoIndex,
}: GalleryClientProps) {
  const router = useRouter();
  const { data: manifest } = useSuspenseQuery({
    queryKey: ['photos-manifest'],
    queryFn: getManifest,
    staleTime: Infinity,
  });

  const album = albumSlug
    ? (manifest.albums.find(a => a.slug === albumSlug) ?? null)
    : null;

  const subAlbum =
    album && subAlbumSlug
      ? (album.subAlbums.find(s => s.slug === subAlbumSlug) ?? null)
      : null;

  const basePath = subAlbum ? `/photos/${albumSlug}/${subAlbumSlug}` : null;

  return (
    <div className={pageContainer}>
      {!albumSlug && <AlbumGrid albums={manifest.albums} />}
      {album && !subAlbum && (
        <SubAlbumGrid
          albumName={album.name}
          albumSlug={album.slug}
          subAlbums={album.subAlbums}
        />
      )}
      {album && subAlbum && basePath && (
        <>
          <PhotoGrid
            albumName={album.name}
            albumSlug={album.slug}
            onPhotoClick={idx => {
              router.replace(`${basePath}?photo=${idx}`, { scroll: false });
            }}
            photos={subAlbum.photos}
            subAlbumName={subAlbum.name}
            subAlbumSlug={subAlbum.slug}
          />
          {photoIndex !== null && (
            <Lightbox
              albumName={album.name}
              basePath={basePath}
              currentIndex={photoIndex}
              photos={subAlbum.photos}
              subAlbumName={subAlbum.name}
            />
          )}
        </>
      )}
    </div>
  );
}

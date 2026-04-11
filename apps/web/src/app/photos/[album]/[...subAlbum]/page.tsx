import { Suspense } from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import { GalleryClient } from '../../../../components/photos/GalleryClient';
import { ErrorMessage } from '../../../../components/ui/ErrorMessage';
import { Loading } from '../../../../components/ui/Loading';

export const dynamic = 'force-dynamic';

type SubAlbumPageProps = {
  params: Promise<{ album: string; subAlbum: string[] }>;
  searchParams: Promise<{ photo?: string }>;
};

export default async function SubAlbumPage({
  params,
  searchParams,
}: SubAlbumPageProps) {
  const { album, subAlbum } = await params;
  const { photo } = await searchParams;
  const photoIndex = photo !== undefined ? Number(photo) : null;
  return (
    <ErrorBoundary fallback={<ErrorMessage />}>
      <Suspense fallback={<Loading />}>
        <GalleryClient
          albumSlug={album}
          photoIndex={photoIndex}
          subAlbumSlug={subAlbum.join('/')}
        />
      </Suspense>
    </ErrorBoundary>
  );
}

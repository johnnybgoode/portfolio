import { Suspense } from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import { GalleryClient } from '../../../components/photos/GalleryClient';
import { ErrorMessage } from '../../../components/ui/ErrorMessage';
import { Loading } from '../../../components/ui/Loading';

export const dynamic = 'force-dynamic';

type AlbumPageProps = {
  params: Promise<{ album: string }>;
};

export default async function AlbumPage({ params }: AlbumPageProps) {
  const { album } = await params;
  return (
    <ErrorBoundary fallback={<ErrorMessage />}>
      <Suspense fallback={<Loading />}>
        <GalleryClient
          albumSlug={album}
          photoIndex={null}
          subAlbumSlug={null}
        />
      </Suspense>
    </ErrorBoundary>
  );
}

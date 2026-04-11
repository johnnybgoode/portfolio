import { Suspense } from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import { GalleryClient } from '../../components/photos/GalleryClient';
import { ErrorMessage } from '../../components/ui/ErrorMessage';
import { Loading } from '../../components/ui/Loading';

export const dynamic = 'force-dynamic';

export default function PhotosPage() {
  return (
    <ErrorBoundary fallback={<ErrorMessage />}>
      <Suspense fallback={<Loading />}>
        <GalleryClient albumSlug={null} photoIndex={null} subAlbumSlug={null} />
      </Suspense>
    </ErrorBoundary>
  );
}

import { screen } from '@testing-library/react';
import { Suspense } from 'react';
import { describe, it, vi } from 'vitest';
import { GalleryClient } from '~components/photos/GalleryClient';

vi.mock('next/navigation', () => ({
  useRouter: () => ({
    replace: vi.fn(),
    push: vi.fn(),
    back: vi.fn(),
    forward: vi.fn(),
    refresh: vi.fn(),
    prefetch: vi.fn(),
  }),
  useSearchParams: () => new URLSearchParams(),
  usePathname: () => '/',
}));
import { makeManifest } from '~test/mocks/fixtures/photos';
import { makeManifestHandler } from '~test/mocks/handlers';
import { server } from '~test/mocks/server';
import { render } from '~test/utils/render';

describe('GalleryClient', () => {
  it('renders album names on the root view', async () => {
    server.use(makeManifestHandler(makeManifest()));
    render(
      <Suspense fallback={null}>
        <GalleryClient albumSlug={null} photoIndex={null} subAlbumSlug={null} />
      </Suspense>,
    );
    await screen.findByText('Street');
    await screen.findByText('Landscape');
  });

  it('renders sub-album names when an album is selected', async () => {
    server.use(makeManifestHandler(makeManifest()));
    render(
      <Suspense fallback={null}>
        <GalleryClient
          albumSlug="street"
          photoIndex={null}
          subAlbumSlug={null}
        />
      </Suspense>,
    );
    await screen.findByText('New York');
  });

  it('renders photos when a sub-album is selected', async () => {
    server.use(makeManifestHandler(makeManifest()));
    render(
      <Suspense fallback={null}>
        <GalleryClient
          albumSlug="street"
          photoIndex={null}
          subAlbumSlug="new-york"
        />
      </Suspense>,
    );
    // PhotoGrid renders buttons with aria-label for each photo
    await screen.findByLabelText(/open photo a\.jpg/i);
    await screen.findByLabelText(/open photo b\.jpg/i);
  });

  it('shows the lightbox when photoIndex is set', async () => {
    server.use(makeManifestHandler(makeManifest()));
    render(
      <Suspense fallback={null}>
        <GalleryClient
          albumSlug="street"
          photoIndex={0}
          subAlbumSlug="new-york"
        />
      </Suspense>,
    );
    await screen.findByRole('dialog', { name: /photo viewer/i });
  });

  it('shows breadcrumb trail on sub-album view', async () => {
    server.use(makeManifestHandler(makeManifest()));
    render(
      <Suspense fallback={null}>
        <GalleryClient
          albumSlug="street"
          photoIndex={null}
          subAlbumSlug="new-york"
        />
      </Suspense>,
    );
    await screen.findByText('Photos');
    await screen.findByText('Street');
    await screen.findByText('New York');
  });
});

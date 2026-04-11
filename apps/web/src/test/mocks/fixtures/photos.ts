import type { Album, Manifest, Photo, SubAlbum } from '../../../types/photos';

export const makePhoto = (overrides: Partial<Photo> = {}): Photo => ({
  filename: 'test.jpg',
  url: 'https://example.r2.dev/street/new-york/test.jpg',
  width: 1600,
  height: 1067,
  ...overrides,
});

export const makeSubAlbum = (overrides: Partial<SubAlbum> = {}): SubAlbum => ({
  name: 'New York',
  slug: 'new-york',
  coverUrl: 'https://example.r2.dev/street/new-york/cover.jpg',
  photoCount: 2,
  photos: [
    makePhoto({
      filename: 'a.jpg',
      url: 'https://example.r2.dev/street/new-york/a.jpg',
    }),
    makePhoto({
      filename: 'b.jpg',
      url: 'https://example.r2.dev/street/new-york/b.jpg',
    }),
  ],
  ...overrides,
});

export const makeAlbum = (overrides: Partial<Album> = {}): Album => ({
  name: 'Street',
  slug: 'street',
  coverUrl: 'https://example.r2.dev/street/new-york/cover.jpg',
  photoCount: 2,
  subAlbums: [makeSubAlbum()],
  ...overrides,
});

export const makeManifest = (overrides: Partial<Manifest> = {}): Manifest => ({
  generated: '2026-04-11T00:00:00.000Z',
  albums: [
    makeAlbum(),
    makeAlbum({
      name: 'Landscape',
      slug: 'landscape',
      coverUrl: 'https://example.r2.dev/landscape/cover.jpg',
      subAlbums: [makeSubAlbum({ name: 'Mountains', slug: 'mountains' })],
    }),
  ],
  ...overrides,
});

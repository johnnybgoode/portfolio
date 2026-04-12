# Photo Gallery — Design Spec
**Date:** 2026-04-11  
**Status:** Approved

---

## Overview

Two independent deliverables:

1. **Scripts** — a one-time SmugMug download script and a reusable R2 upload script
2. **Portfolio gallery** — a `/photos` section in the Next.js app that reads a manifest from Cloudflare R2 and renders a three-level photo browsing experience

The download and upload scripts are decoupled. Going forward, new photos can be uploaded directly from a local machine using the upload script without touching SmugMug.

---

## Part 1: Scripts

### `scripts/smugmug-download.js`

**Purpose:** One-time migration. Download all original-resolution photos from SmugMug and save them locally.

**Runtime:** Plain Node.js (no build step). Credentials read from `~/.env`.

**Auth:** SmugMug API v2 with OAuth 1.0a. The API key and secret (`SMUGMUG_API_KEY`, `SMUGMUG_API_SEC`) in `~/.env` are the OAuth consumer key and consumer secret. Public albums are accessible with just these credentials using HMAC-SHA1 request signing — no user access token required.

**Algorithm:**
1. Fetch the authenticated user's node tree: `GET /api/v2/user/johnentwistle` → walk `!nodes` to discover all folders and albums
2. For each album, fetch `GET /api/v2/album/{albumKey}!images` to list images
3. For each image, fetch the `ArchivedUri` field (original full-resolution download URL)
4. Download the file via HTTP and write to disk at:
   ```
   /Users/jack/.sandbox/portfolio/photos/{AlbumName}/{SubAlbumName}/{filename}.jpg
   ```
   Folder names are slugified from the SmugMug album names.
5. Write a `metadata.json` alongside the downloaded files capturing the album tree, image titles, and dimensions (sourced from SmugMug API response fields `OriginalWidth`, `OriginalHeight`).
6. Skip files that already exist on disk (idempotent — safe to re-run after interruption).

**Dependencies:** `oauth-1.0a`, `node-fetch` (or Node 18+ native fetch), `dotenv`

---

### `scripts/r2-upload.js`

**Purpose:** Reusable. Upload a local folder of photos to Cloudflare R2 and generate/update the manifest that the portfolio gallery reads.

**Runtime:** Plain Node.js. Credentials read from `~/.env` (R2 vars to be added: `R2_ACCOUNT_ID`, `R2_ACCESS_KEY_ID`, `R2_SECRET_ACCESS_KEY`, `R2_BUCKET_NAME`, `R2_PUBLIC_URL`).

**Algorithm:**
1. Accept an optional `--dir` argument (defaults to `/Users/jack/.sandbox/portfolio/photos/`)
2. Walk the directory tree and collect all image files. Treat the top two folder levels as `{album}/{subAlbum}`.
3. For each image, check if the R2 object already exists (via `HeadObject`). Skip if present — makes re-runs safe.
4. Upload new images to R2 at key `photos/{album}/{subAlbum}/{filename}`. Images are served via R2's public URL.
5. After all uploads, regenerate `manifest.json` from the full R2 listing (`ListObjectsV2`) merged with dimension data from the local `metadata.json`. Upload `manifest.json` to R2 at key `manifest.json`.
6. Print a summary: N uploaded, N skipped, manifest updated.

**Manifest shape:**
```typescript
type Manifest = {
  generated: string;       // ISO 8601 timestamp
  albums: Album[];
};
type Album = {
  name: string;            // Display name (e.g. "Street")
  slug: string;            // URL slug (e.g. "street")
  coverUrl: string;        // R2 URL of the first image in first sub-album
  photoCount: number;      // Total across all sub-albums
  subAlbums: SubAlbum[];
};
type SubAlbum = {
  name: string;            // Display name (e.g. "New York")
  slug: string;            // URL slug (e.g. "new-york")
  coverUrl: string;        // R2 URL of the first image
  photoCount: number;
  photos: Photo[];
};
type Photo = {
  filename: string;
  url: string;             // R2 public CDN URL
  width: number;           // Original width in pixels (needed for justified layout)
  height: number;          // Original height in pixels
  title?: string;          // From SmugMug metadata if available
};
```

**Dependencies:** `@aws-sdk/client-s3`, `dotenv`

---

## Part 2: Portfolio Gallery

### Routes

Three new Next.js App Router pages under `apps/web/src/app/photos/`:

| Route | File | Description |
|---|---|---|
| `/photos` | `app/photos/page.tsx` | Top-level album grid (Street, Landscape, …) |
| `/photos/[album]` | `app/photos/[album]/page.tsx` | Masonry grid of sub-albums |
| `/photos/[album]/[subAlbum]` | `app/photos/[album]/[subAlbum]/page.tsx` | Justified photo grid + lightbox |

All three are thin server components that pass slug params down to a single client component tree (`GalleryClient`) that holds the manifest and handles routing state.

### API Route

`app/api/photos/manifest/route.ts`

- `GET` — fetches `manifest.json` from R2 via its public URL, returns it as JSON
- No auth required (manifest is public)
- Thin wrapper following the existing pattern in `app/api/`

### Data Fetching

A single `data/photos.ts` file exports:

```typescript
export async function getManifest(): Promise<Manifest>
// Fetches /api/photos/manifest
```

In `GalleryClient`, the manifest is loaded once with `useSuspenseQuery`:

```typescript
const { data: manifest } = useSuspenseQuery({
  queryKey: ['photos-manifest'],
  queryFn: getManifest,
  staleTime: Infinity,  // manifest only changes when r2-upload.js is re-run
});
```

From the manifest, the current album/sub-album is derived from the URL params passed in as props — no additional fetches needed. All photo data is in the manifest.

### Components

All new components live in `apps/web/src/components/photos/`.

**`GalleryClient.tsx`** — top-level client component. Receives URL params, reads manifest, renders the correct view.

**`AlbumGrid.tsx`** — 2-column grid of `AlbumCard` tiles with cover photo, name overlay, and photo count. Centered, `max-width: 920px`.

**`AlbumCard.tsx`** — cover image fills a `4/3` aspect-ratio container. Name and count rendered as an overlay gradient on hover (always visible on mobile).

**`SubAlbumGrid.tsx`** — 2-column CSS masonry (`column-count: 2`, `column-gap: 10px`). Each `SubAlbumCard` shows a cover image at its natural aspect ratio. Album name overlays on hover only.

**`PhotoGrid.tsx`** — justified row layout. Groups photos into rows such that each row fills the container width at a consistent row height (~220px). Row composition is computed client-side from the `width`/`height` values in the manifest using a greedy algorithm (target row height × sum of aspect ratios = container width). Each photo is a `flex` item with `flex: aspectRatio`.

**`Lightbox.tsx`** — fullscreen overlay triggered by clicking a photo. Controlled via URL search param `?photo={index}` so direct links work. Renders the full-size image (max 90vw/90vh), album breadcrumb caption, and prev/next arrows. Closes on backdrop click or `Esc` key.

**`GalleryBreadcrumb.tsx`** — shared breadcrumb using existing nav patterns (`Photos › Street › New York`).

### Styling

All styles in `apps/web/src/styles/components/photos.css.ts` using vanilla-extract.

Key token usage:
- **Background:** `colorVars.background` (adapts to dark/light theme automatically)
- **Body text / breadcrumbs:** `colorVars.body` at reduced opacity for secondary labels
- **Hover accent:** `colorVars.primary` (`foam` in dark, `cyan` in light)
- **Overlay gradients:** `rgba(0,0,0,0.65)` → `transparent` (not theme-sensitive — overlays sit on images)
- **Font families:** `vars.typography.font.heading` (Montserrat) for album names/labels; `vars.typography.font.body` (Nunito Sans) for counts/captions
- **Gaps:** `vars.space['350']` (12px) between album cards; `vars.space['300']` (8px) between photo grid items
- **Page padding:** `vars.space['600']` (32px) horizontal, matching existing pages
- **Container max-widths:** albums 920px, sub-albums 860px, photo grid 1000px — all `margin: 0 auto`

Breakpoints follow existing pattern: responsive array `[mobile, tablet, print]`. Sub-album grid collapses to 1 column on mobile.

### Navigation

Add "Photos" link to the existing site nav component (wherever `Work` and `Resume` links currently live).

### Testing

New test file `src/test/components/photos/Gallery.test.tsx`:
- Mock `/api/photos/manifest` via MSW using a fixture manifest (2 albums, 2 sub-albums each, 4 photos each)
- Test: album grid renders correct album names
- Test: clicking an album card navigates to sub-album view
- Test: photo grid renders correct number of photos
- Test: lightbox opens on photo click, closes on Esc
- Fixture factory `makeManifest(overrides?)` added to `src/test/mocks/fixtures/`

---

## Out of Scope

- Pagination (load all photos for a sub-album at once — justified layout requires all aspect ratios upfront)
- Photo upload from the portfolio UI (upload is script-only)
- SmugMug webhooks or automated sync
- Image optimization/resizing (R2 serves originals; browser handles display scaling)
- Comments, likes, or any social features

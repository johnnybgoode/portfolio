# Photo Gallery Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a SmugMug-to-R2 photo migration script, a reusable R2 upload script, and a `/photos` gallery section in the Next.js portfolio app.

**Architecture:** The two scripts are standalone Node.js ES modules at the repo root. The gallery reads a `manifest.json` uploaded to Cloudflare R2 via a thin `/api/photos/manifest` Next.js route, cached client-side by TanStack Query with `staleTime: Infinity`. Navigation uses Next.js App Router pages at `/photos`, `/photos/[album]`, `/photos/[album]/[subAlbum]` with a lightbox controlled by a `?photo=N` search param.

**Tech Stack:** Node.js 20+, `oauth-1.0a`, `@aws-sdk/client-s3`, `dotenv` (scripts); Next.js 15 App Router, TanStack Query v5, vanilla-extract, MSW (gallery).

---

## File Map

### Scripts (new)
- `scripts/smugmug-download.js` — walks SmugMug album tree, downloads originals to local disk
- `scripts/r2-upload.js` — uploads local photo folder to R2, generates + uploads `manifest.json`
- `scripts/package.json` — script-local deps (oauth-1.0a, @aws-sdk/client-s3, dotenv)

### Gallery (new)
- `apps/web/src/types/photos.ts` — `Manifest`, `Album`, `SubAlbum`, `Photo` types
- `apps/web/src/app/api/photos/manifest/route.ts` — GET: fetches manifest.json from R2 public URL
- `apps/web/src/data/photos.ts` — `getManifest()` fetch function
- `apps/web/src/styles/components/photos.css.ts` — all gallery styles
- `apps/web/src/components/photos/GalleryBreadcrumb.tsx` — breadcrumb nav
- `apps/web/src/components/photos/AlbumCard.tsx` — single album tile with cover + overlay
- `apps/web/src/components/photos/AlbumGrid.tsx` — 2-col grid of AlbumCards
- `apps/web/src/components/photos/SubAlbumGrid.tsx` — 2-col CSS masonry of sub-album covers
- `apps/web/src/components/photos/PhotoGrid.tsx` — justified row layout + photo click handler
- `apps/web/src/components/photos/Lightbox.tsx` — fullscreen overlay, search-param controlled
- `apps/web/src/components/photos/GalleryClient.tsx` — top-level client component, loads manifest
- `apps/web/src/app/photos/page.tsx` — album list page (server component)
- `apps/web/src/app/photos/[album]/page.tsx` — sub-album grid page (server component)
- `apps/web/src/app/photos/[album]/[subAlbum]/page.tsx` — photo grid page (server component)

### Gallery (modified)
- `apps/web/src/app/layout.tsx` — add Photos nav link

### Tests (new)
- `apps/web/src/test/mocks/fixtures/photos.ts` — `makeManifest()` fixture factory
- `apps/web/src/test/mocks/handlers.ts` — add `makeManifestHandler()`
- `apps/web/src/test/components/photos/Gallery.test.tsx` — gallery behaviour tests

---

## Part A: Scripts

### Task A1: Bootstrap scripts directory

**Files:**
- Create: `scripts/package.json`

- [ ] **Step 1: Create scripts/package.json**

```json
{
  "name": "portfolio-scripts",
  "version": "1.0.0",
  "type": "module",
  "private": true,
  "dependencies": {
    "@aws-sdk/client-s3": "^3.0.0",
    "dotenv": "^16.0.0",
    "oauth-1.0a": "^2.2.6"
  }
}
```

- [ ] **Step 2: Install dependencies**

```bash
cd scripts && npm install
```

Expected: `node_modules/` created, `package-lock.json` written.

- [ ] **Step 3: Add SMUGMUG_USER to ~/.env**

Open `~/.env` and add one line:
```
SMUGMUG_USER=johnentwistle
```

(This is the SmugMug account username — the subdomain of `john-entwistle.com` on SmugMug, which is `johnentwistle`.)

- [ ] **Step 4: Commit**

```bash
git add scripts/package.json scripts/package-lock.json
git commit -m "chore: add scripts directory with dependencies"
```

---

### Task A2: SmugMug download script

**Files:**
- Create: `scripts/smugmug-download.js`

The script walks the SmugMug node tree (folders → albums → images), downloads each original via `ArchivedUri`, and saves to `~/.sandbox/portfolio/photos/{album}/{subAlbum}/{filename}`. It writes a `metadata.json` with dimensions and titles.

SmugMug API base: `https://api.smugmug.com/api/v2`  
Auth: OAuth 1.0a consumer-only (no user token — sufficient for public albums).  
All requests append `?_accept=application/json`.

- [ ] **Step 1: Write scripts/smugmug-download.js**

```javascript
import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import * as dotenv from 'dotenv';
import OAuth from 'oauth-1.0a';

// Load credentials from ~/.env
dotenv.config({ path: path.join(process.env.HOME, '.env') });

const {
  SMUGMUG_API_KEY,
  SMUGMUG_API_SEC,
  SMUGMUG_USER,
} = process.env;

if (!SMUGMUG_API_KEY || !SMUGMUG_API_SEC || !SMUGMUG_USER) {
  console.error('Missing SMUGMUG_API_KEY, SMUGMUG_API_SEC, or SMUGMUG_USER in ~/.env');
  process.exit(1);
}

const OUTPUT_DIR = path.join(process.env.HOME, '.sandbox/portfolio/photos');
const BASE_URL = 'https://api.smugmug.com';

const oauth = new OAuth({
  consumer: { key: SMUGMUG_API_KEY, secret: SMUGMUG_API_SEC },
  signature_method: 'HMAC-SHA1',
  hash_function(base_string, key) {
    return crypto.createHmac('sha1', key).update(base_string).digest('base64');
  },
});

async function apiGet(uri) {
  const url = uri.startsWith('http') ? uri : `${BASE_URL}${uri}`;
  const fullUrl = `${url}${url.includes('?') ? '&' : '?'}_accept=application%2Fjson`;
  const authHeader = oauth.toHeader(oauth.authorize({ url: fullUrl, method: 'GET' }));
  const res = await fetch(fullUrl, { headers: { ...authHeader, Accept: 'application/json' } });
  if (!res.ok) throw new Error(`SmugMug API error ${res.status} for ${fullUrl}`);
  return res.json();
}

function slugify(name) {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
}

async function getAlbumsFromNode(nodeUri, depth = 0) {
  const data = await apiGet(`${nodeUri}!children?count=100`);
  const nodes = data.Response?.Node ?? [];
  const albums = [];

  for (const node of nodes) {
    if (node.Type === 'Album') {
      albums.push({ name: node.Name, uri: node.Uris.Album.Uri, depth });
    } else if (node.Type === 'Folder') {
      const children = await getAlbumsFromNode(node.Uri, depth + 1);
      albums.push(...children);
    }
  }
  return albums;
}

async function getImagesForAlbum(albumUri) {
  const images = [];
  let start = 1;
  while (true) {
    const data = await apiGet(`${albumUri}!images?count=100&start=${start}`);
    const batch = data.Response?.AlbumImage ?? [];
    images.push(...batch);
    if (batch.length < 100) break;
    start += 100;
  }
  return images;
}

async function downloadFile(url, destPath) {
  if (fs.existsSync(destPath)) return false; // skip existing
  const res = await fetch(url, { redirect: 'follow' });
  if (!res.ok) throw new Error(`Download failed ${res.status} for ${url}`);
  const buffer = Buffer.from(await res.arrayBuffer());
  fs.mkdirSync(path.dirname(destPath), { recursive: true });
  fs.writeFileSync(destPath, buffer);
  return true;
}

async function main() {
  console.log(`Fetching album tree for user: ${SMUGMUG_USER}`);
  const userData = await apiGet(`/api/v2/user/${SMUGMUG_USER}`);
  const rootNodeUri = userData.Response.User.Uris.Node.Uri;

  const rootChildren = await apiGet(`${rootNodeUri}!children?count=100`);
  const topLevelNodes = rootChildren.Response?.Node ?? [];

  const metadata = { albums: [] };
  let totalDownloaded = 0;
  let totalSkipped = 0;

  for (const topNode of topLevelNodes) {
    if (topNode.Type !== 'Folder' && topNode.Type !== 'Album') continue;
    const albumSlug = slugify(topNode.Name);
    const albumMeta = { name: topNode.Name, slug: albumSlug, subAlbums: [] };

    let subNodes = [];
    if (topNode.Type === 'Folder') {
      const subData = await apiGet(`${topNode.Uri}!children?count=100`);
      subNodes = subData.Response?.Node ?? [];
    } else {
      subNodes = [topNode];
    }

    for (const subNode of subNodes) {
      if (subNode.Type !== 'Album') continue;
      const subSlug = slugify(subNode.Name);
      const subMeta = { name: subNode.Name, slug: subSlug, photos: [] };

      console.log(`  Fetching album: ${topNode.Name}/${subNode.Name}`);
      const images = await getImagesForAlbum(subNode.Uris.Album.Uri);

      for (const img of images) {
        const filename = img.FileName;
        const destPath = path.join(OUTPUT_DIR, albumSlug, subSlug, filename);
        const downloaded = await downloadFile(img.ArchivedUri, destPath);
        if (downloaded) {
          totalDownloaded++;
          process.stdout.write('.');
        } else {
          totalSkipped++;
        }
        subMeta.photos.push({
          filename,
          width: img.OriginalWidth,
          height: img.OriginalHeight,
          title: img.Title || null,
        });
      }

      albumMeta.subAlbums.push(subMeta);
    }
    metadata.albums.push(albumMeta);
  }

  const metadataPath = path.join(OUTPUT_DIR, 'metadata.json');
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
  fs.writeFileSync(metadataPath, JSON.stringify(metadata, null, 2));

  console.log(`\nDone. Downloaded: ${totalDownloaded}, Skipped: ${totalSkipped}`);
  console.log(`Metadata written to ${metadataPath}`);
}

main().catch(err => { console.error(err); process.exit(1); });
```

- [ ] **Step 2: Verify script syntax**

```bash
cd scripts && node --input-type=module < /dev/null && node -e "import('./smugmug-download.js').catch(e => { if (e.message.includes('Missing')) process.exit(0); throw e; })"
```

Expected: exits 0 (missing env vars message is expected at this point since we're not running for real).

- [ ] **Step 3: Commit**

```bash
git add scripts/smugmug-download.js
git commit -m "feat(scripts): add SmugMug download script"
```

---

### Task A3: R2 upload script

**Files:**
- Create: `scripts/r2-upload.js`

Reads from a local photos folder, uploads new files to R2 (skips existing via HeadObject), then regenerates `manifest.json` from the full bucket listing merged with local `metadata.json` for dimensions/titles. Uploads `manifest.json` to R2.

R2 bucket key format: `{albumSlug}/{subAlbumSlug}/{filename}`  
Manifest key: `manifest.json`  
Public image URL: `${R2_PUBLIC_URL}/{key}`

- [ ] **Step 1: Write scripts/r2-upload.js**

```javascript
import fs from 'node:fs';
import path from 'node:path';
import {
  HeadObjectCommand,
  ListObjectsV2Command,
  PutObjectCommand,
  S3Client,
} from '@aws-sdk/client-s3';
import * as dotenv from 'dotenv';

dotenv.config({ path: path.join(process.env.HOME, '.env') });

const {
  R2_ACCOUNT_ID,
  R2_ACCESS_KEY_ID,
  R2_SECRET_ACCESS_KEY,
  R2_BUCKET_NAME,
  R2_PUBLIC_URL,
} = process.env;

if (!R2_ACCOUNT_ID || !R2_ACCESS_KEY_ID || !R2_SECRET_ACCESS_KEY || !R2_BUCKET_NAME || !R2_PUBLIC_URL) {
  console.error('Missing R2 credentials in ~/.env. Required: R2_ACCOUNT_ID, R2_ACCESS_KEY_ID, R2_SECRET_ACCESS_KEY, R2_BUCKET_NAME, R2_PUBLIC_URL');
  process.exit(1);
}

const photosDir = process.argv[2] ?? path.join(process.env.HOME, '.sandbox/portfolio/photos');

const s3 = new S3Client({
  region: 'auto',
  endpoint: `https://${R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
  credentials: { accessKeyId: R2_ACCESS_KEY_ID, secretAccessKey: R2_SECRET_ACCESS_KEY },
});

async function objectExists(key) {
  try {
    await s3.send(new HeadObjectCommand({ Bucket: R2_BUCKET_NAME, Key: key }));
    return true;
  } catch {
    return false;
  }
}

async function uploadFile(localPath, key, contentType = 'image/jpeg') {
  const body = fs.readFileSync(localPath);
  await s3.send(new PutObjectCommand({
    Bucket: R2_BUCKET_NAME,
    Key: key,
    Body: body,
    ContentType: contentType,
  }));
}

function getContentType(filename) {
  const ext = path.extname(filename).toLowerCase();
  const map = { '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.png': 'image/png', '.gif': 'image/gif', '.webp': 'image/webp' };
  return map[ext] ?? 'application/octet-stream';
}

function slugify(name) {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
}

function loadMetadata(photosDir) {
  const metaPath = path.join(photosDir, 'metadata.json');
  if (!fs.existsSync(metaPath)) return null;
  return JSON.parse(fs.readFileSync(metaPath, 'utf8'));
}

async function buildManifest(photosDir, metadata) {
  // List all objects in bucket
  const allKeys = [];
  let continuationToken;
  do {
    const res = await s3.send(new ListObjectsV2Command({
      Bucket: R2_BUCKET_NAME,
      ContinuationToken: continuationToken,
    }));
    allKeys.push(...(res.Contents ?? []).map(o => o.Key));
    continuationToken = res.IsTruncated ? res.NextContinuationToken : undefined;
  } while (continuationToken);

  // Group keys by album/subAlbum
  const tree = {};
  for (const key of allKeys) {
    if (key === 'manifest.json') continue;
    const parts = key.split('/');
    if (parts.length !== 3) continue;
    const [album, subAlbum, filename] = parts;
    tree[album] ??= {};
    tree[album][subAlbum] ??= [];
    tree[album][subAlbum].push(filename);
  }

  // Build manifest, enriching with metadata if available
  const metaIndex = {};
  if (metadata) {
    for (const album of metadata.albums) {
      for (const sub of album.subAlbums) {
        for (const photo of sub.photos) {
          metaIndex[`${album.slug}/${sub.slug}/${photo.filename}`] = photo;
        }
      }
    }
  }

  // Determine display names from metadata or slugs
  const albumNames = {};
  const subAlbumNames = {};
  if (metadata) {
    for (const album of metadata.albums) {
      albumNames[album.slug] = album.name;
      for (const sub of album.subAlbums) {
        subAlbumNames[`${album.slug}/${sub.slug}`] = sub.name;
      }
    }
  }

  const albums = Object.entries(tree).map(([albumSlug, subAlbums]) => {
    const subAlbumList = Object.entries(subAlbums).map(([subSlug, filenames]) => {
      const photos = filenames.map(filename => {
        const key = `${albumSlug}/${subSlug}/${filename}`;
        const meta = metaIndex[key];
        return {
          filename,
          url: `${R2_PUBLIC_URL}/${key}`,
          width: meta?.width ?? 0,
          height: meta?.height ?? 0,
          ...(meta?.title ? { title: meta.title } : {}),
        };
      });
      return {
        name: subAlbumNames[`${albumSlug}/${subSlug}`] ?? subSlug,
        slug: subSlug,
        coverUrl: photos[0]?.url ?? '',
        photoCount: photos.length,
        photos,
      };
    });

    const allPhotos = subAlbumList.flatMap(s => s.photos);
    return {
      name: albumNames[albumSlug] ?? albumSlug,
      slug: albumSlug,
      coverUrl: allPhotos[0]?.url ?? '',
      photoCount: allPhotos.length,
      subAlbums: subAlbumList,
    };
  });

  return { generated: new Date().toISOString(), albums };
}

async function main() {
  if (!fs.existsSync(photosDir)) {
    console.error(`Photos directory not found: ${photosDir}`);
    process.exit(1);
  }

  const metadata = loadMetadata(photosDir);
  let uploaded = 0;
  let skipped = 0;

  // Walk album/subAlbum/file structure
  for (const albumDir of fs.readdirSync(photosDir)) {
    const albumPath = path.join(photosDir, albumDir);
    if (!fs.statSync(albumPath).isDirectory()) continue;
    const albumSlug = slugify(albumDir);

    for (const subDir of fs.readdirSync(albumPath)) {
      const subPath = path.join(albumPath, subDir);
      if (!fs.statSync(subPath).isDirectory()) continue;
      const subSlug = slugify(subDir);

      for (const filename of fs.readdirSync(subPath)) {
        if (filename.startsWith('.')) continue;
        const filePath = path.join(subPath, filename);
        if (!fs.statSync(filePath).isFile()) continue;

        const key = `${albumSlug}/${subSlug}/${filename}`;
        if (await objectExists(key)) {
          skipped++;
          continue;
        }

        await uploadFile(filePath, key, getContentType(filename));
        uploaded++;
        process.stdout.write('.');
      }
    }
  }

  console.log(`\nUploaded: ${uploaded}, Skipped: ${skipped}`);
  console.log('Generating manifest...');
  const manifest = await buildManifest(photosDir, metadata);

  await s3.send(new PutObjectCommand({
    Bucket: R2_BUCKET_NAME,
    Key: 'manifest.json',
    Body: JSON.stringify(manifest, null, 2),
    ContentType: 'application/json',
  }));

  console.log(`Manifest uploaded. ${manifest.albums.length} albums, ${manifest.albums.reduce((n, a) => n + a.photoCount, 0)} photos total.`);
}

main().catch(err => { console.error(err); process.exit(1); });
```

- [ ] **Step 2: Smoke-test against R2 (list only — no upload yet)**

```bash
cd scripts && node -e "
import { S3Client, ListObjectsV2Command } from '@aws-sdk/client-s3';
import dotenv from 'dotenv';
import path from 'path';
dotenv.config({ path: path.join(process.env.HOME, '.env') });
const s3 = new S3Client({ region: 'auto', endpoint: \`https://\${process.env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com\`, credentials: { accessKeyId: process.env.R2_ACCESS_KEY_ID, secretAccessKey: process.env.R2_SECRET_ACCESS_KEY } });
s3.send(new ListObjectsV2Command({ Bucket: process.env.R2_BUCKET_NAME, MaxKeys: 1 })).then(r => console.log('R2 OK, objects:', r.KeyCount)).catch(e => { console.error('FAIL:', e.message); process.exit(1); });
" --input-type=module
```

Expected: `R2 OK, objects: 0`

- [ ] **Step 3: Commit**

```bash
git add scripts/r2-upload.js
git commit -m "feat(scripts): add R2 upload script with manifest generation"
```

---

## Part B: Portfolio Gallery

### Task B1: Type definitions

**Files:**
- Create: `apps/web/src/types/photos.ts`

- [ ] **Step 1: Write the types file**

```typescript
export type Photo = {
  filename: string;
  url: string;
  width: number;
  height: number;
  title?: string;
};

export type SubAlbum = {
  name: string;
  slug: string;
  coverUrl: string;
  photoCount: number;
  photos: Photo[];
};

export type Album = {
  name: string;
  slug: string;
  coverUrl: string;
  photoCount: number;
  subAlbums: SubAlbum[];
};

export type Manifest = {
  generated: string;
  albums: Album[];
};
```

- [ ] **Step 2: Commit**

```bash
git add apps/web/src/types/photos.ts
git commit -m "feat(photos): add Manifest type definitions"
```

---

### Task B2: API route + data fetching function

**Files:**
- Create: `apps/web/src/app/api/photos/manifest/route.ts`
- Create: `apps/web/src/data/photos.ts`

The API route fetches `manifest.json` from the R2 public URL (server-side, reads `R2_PUBLIC_URL` env var). The data function calls the API route from the client.

- [ ] **Step 1: Add R2_PUBLIC_URL to apps/web/.env.local**

Create `apps/web/.env.local` if it doesn't exist and add:
```
R2_PUBLIC_URL=https://pub-f187a1a8f5844f3988c3568005a3d7ed.r2.dev
```

Verify `.env.local` is in `.gitignore`:
```bash
grep -q '\.env\.local' apps/web/.gitignore || echo '.env.local' >> apps/web/.gitignore
```

- [ ] **Step 2: Write the API route**

```typescript
// apps/web/src/app/api/photos/manifest/route.ts
import type { Manifest } from '../../../../types/photos';
import { NextResponse } from 'next/server';

export async function GET() {
  const publicUrl = process.env.R2_PUBLIC_URL;
  if (!publicUrl) {
    return NextResponse.json({ error: 'R2_PUBLIC_URL not configured.' }, { status: 500 });
  }

  try {
    const res = await fetch(`${publicUrl}/manifest.json`, { next: { revalidate: 0 } });
    if (!res.ok) {
      return NextResponse.json({ error: 'Failed to fetch manifest.' }, { status: 502 });
    }
    const manifest: Manifest = await res.json();
    return NextResponse.json(manifest);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to fetch manifest.' }, { status: 500 });
  }
}
```

- [ ] **Step 3: Write the data fetching function**

```typescript
// apps/web/src/data/photos.ts
import type { Manifest } from '../types/photos';

export const getManifest = async (): Promise<Manifest> => {
  const response = await fetch('/api/photos/manifest');
  if (!response.ok) {
    throw new Error('Failed to fetch photo manifest');
  }
  return response.json();
};
```

- [ ] **Step 4: Commit**

```bash
git add apps/web/src/app/api/photos/manifest/route.ts apps/web/src/data/photos.ts apps/web/.env.local apps/web/.gitignore
git commit -m "feat(photos): add manifest API route and data fetching function"
```

---

### Task B3: Gallery styles

**Files:**
- Create: `apps/web/src/styles/components/photos.css.ts`

- [ ] **Step 1: Write all gallery styles**

```typescript
// apps/web/src/styles/components/photos.css.ts
import { globalStyle, style } from '@vanilla-extract/css';
import { colorVars, vars } from '../theme.css';

// ── Shared ────────────────────────────────────────────────────────────────────

export const pageContainer = style({
  maxWidth: '100%',
  paddingInline: vars.space['600'],
  paddingBlock: vars.space['600'],
});

export const pageTitle = style({
  fontFamily: vars.typography.font.heading,
  fontSize: vars.typography.size['50'],
  fontWeight: vars.typography.weight['500'],
  letterSpacing: '0.14em',
  textTransform: 'uppercase',
  color: colorVars.body,
  opacity: 0.4,
  marginBottom: vars.space['600'],
  textAlign: 'center',
});

export const breadcrumb = style({
  display: 'flex',
  alignItems: 'center',
  gap: vars.space['300'],
  marginBottom: vars.space['600'],
  fontFamily: vars.typography.font.heading,
  fontSize: vars.typography.size['50'],
  letterSpacing: '0.08em',
  textTransform: 'uppercase',
});

export const breadcrumbLink = style({
  color: colorVars.body,
  opacity: 0.35,
  cursor: 'pointer',
  textDecoration: 'none',
  transition: 'opacity 0.15s',
  selectors: {
    '&:hover': { opacity: 0.65 },
  },
});

export const breadcrumbSep = style({
  color: colorVars.body,
  opacity: 0.2,
});

export const breadcrumbCurrent = style({
  color: colorVars.body,
  opacity: 0.75,
});

// ── Album Grid ────────────────────────────────────────────────────────────────

export const albumGrid = style({
  display: 'grid',
  gridTemplateColumns: 'repeat(2, 1fr)',
  gap: vars.space['350'],
  maxWidth: '920px',
  marginInline: 'auto',
});

export const albumCard = style({
  position: 'relative',
  aspectRatio: '4 / 3',
  overflow: 'hidden',
  cursor: 'pointer',
  borderRadius: '2px',
  display: 'block',
  textDecoration: 'none',
});

export const albumCover = style({
  width: '100%',
  height: '100%',
  objectFit: 'cover',
  transition: 'transform 0.4s ease',
  selectors: {
    [`${albumCard}:hover &`]: { transform: 'scale(1.04)' },
  },
});

export const albumOverlay = style({
  position: 'absolute',
  inset: 0,
  background: 'linear-gradient(to top, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.1) 50%, transparent 100%)',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'flex-end',
  padding: vars.space['500'],
});

export const albumName = style({
  fontFamily: vars.typography.font.heading,
  fontSize: vars.typography.size['200'],
  fontWeight: vars.typography.weight['500'],
  letterSpacing: '0.06em',
  textTransform: 'uppercase',
  color: '#fff',
});

export const albumCount = style({
  fontFamily: vars.typography.font.body,
  fontSize: vars.typography.size['50'],
  color: 'rgba(255,255,255,0.55)',
  marginTop: vars.space['100'],
  letterSpacing: '0.04em',
});

// ── Sub-Album Grid (masonry) ──────────────────────────────────────────────────

export const subAlbumGrid = style({
  columns: 2,
  columnGap: vars.space['350'],
  maxWidth: '860px',
  marginInline: 'auto',
});

export const subAlbumItem = style({
  breakInside: 'avoid',
  marginBottom: vars.space['350'],
  position: 'relative',
  overflow: 'hidden',
  cursor: 'pointer',
  borderRadius: '2px',
  display: 'block',
  textDecoration: 'none',
});

export const subAlbumCover = style({
  display: 'block',
  width: '100%',
  height: 'auto',
  transition: 'transform 0.35s ease',
  selectors: {
    [`${subAlbumItem}:hover &`]: { transform: 'scale(1.03)' },
  },
});

export const subAlbumOverlay = style({
  position: 'absolute',
  inset: 0,
  background: 'linear-gradient(to top, rgba(0,0,0,0.65) 0%, transparent 55%)',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'flex-end',
  padding: vars.space['400'],
  opacity: 0,
  transition: 'opacity 0.2s',
  selectors: {
    [`${subAlbumItem}:hover &`]: { opacity: 1 },
  },
});

export const subAlbumName = style({
  fontFamily: vars.typography.font.heading,
  fontSize: vars.typography.size['50'],
  fontWeight: vars.typography.weight['500'],
  letterSpacing: '0.06em',
  textTransform: 'uppercase',
  color: '#fff',
});

export const subAlbumCount = style({
  fontFamily: vars.typography.font.body,
  fontSize: '0.75rem',
  color: 'rgba(255,255,255,0.5)',
  marginTop: vars.space['100'],
});

// ── Photo Grid (justified rows) ───────────────────────────────────────────────

export const photoGrid = style({
  display: 'flex',
  flexDirection: 'column',
  gap: vars.space['300'],
  maxWidth: '1000px',
  marginInline: 'auto',
});

export const photoRow = style({
  display: 'flex',
  gap: vars.space['300'],
  height: '220px',
});

export const photoItem = style({
  position: 'relative',
  overflow: 'hidden',
  cursor: 'zoom-in',
  borderRadius: '1px',
  flexShrink: 0,
});

export const photoImg = style({
  width: '100%',
  height: '100%',
  objectFit: 'cover',
  display: 'block',
  transition: 'filter 0.25s',
  selectors: {
    [`${photoItem}:hover &`]: { filter: 'brightness(1.08)' },
  },
});

export const photoHint = style({
  position: 'absolute',
  inset: 0,
  background: 'rgba(0,0,0,0.25)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  opacity: 0,
  transition: 'opacity 0.2s',
  selectors: {
    [`${photoItem}:hover &`]: { opacity: 1 },
  },
});

export const photoHintIcon = style({
  width: '36px',
  height: '36px',
  border: '1.5px solid rgba(255,255,255,0.7)',
  borderRadius: '50%',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  color: '#fff',
  fontSize: '18px',
  lineHeight: 1,
});

// ── Lightbox ──────────────────────────────────────────────────────────────────

export const lightboxBackdrop = style({
  position: 'fixed',
  inset: 0,
  background: 'rgba(0,0,0,0.95)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  zIndex: 1000,
});

export const lightboxInner = style({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: vars.space['400'],
  padding: `${vars.space['800']} 80px`,
  width: '100%',
  maxWidth: '1000px',
  position: 'relative',
});

export const lightboxImg = style({
  maxWidth: '100%',
  maxHeight: '82vh',
  objectFit: 'contain',
  borderRadius: '2px',
  display: 'block',
});

export const lightboxMeta = style({
  textAlign: 'center',
});

export const lightboxTitle = style({
  fontFamily: vars.typography.font.body,
  fontSize: vars.typography.size['100'],
  color: colorVars.body,
  opacity: 0.65,
  letterSpacing: '0.04em',
});

export const lightboxAlbum = style({
  fontFamily: vars.typography.font.heading,
  fontSize: vars.typography.size['50'],
  color: colorVars.body,
  opacity: 0.3,
  marginTop: vars.space['100'],
  letterSpacing: '0.07em',
  textTransform: 'uppercase',
});

const navButton = style({
  position: 'absolute',
  top: '50%',
  transform: 'translateY(-50%)',
  width: '44px',
  height: '44px',
  border: '1px solid rgba(255,255,255,0.15)',
  borderRadius: '50%',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  cursor: 'pointer',
  color: 'rgba(255,255,255,0.6)',
  fontSize: '22px',
  background: 'rgba(255,255,255,0.04)',
  transition: 'background 0.15s, border-color 0.15s',
  selectors: {
    '&:hover': {
      background: 'rgba(255,255,255,0.1)',
      borderColor: 'rgba(255,255,255,0.3)',
    },
  },
});

export const lightboxPrev = style([navButton, { left: '20px' }]);
export const lightboxNext = style([navButton, { right: '20px' }]);

export const lightboxClose = style([
  navButton,
  { position: 'absolute', top: '16px', right: '20px', transform: 'none' },
]);
```

- [ ] **Step 2: Commit**

```bash
git add apps/web/src/styles/components/photos.css.ts
git commit -m "feat(photos): add gallery vanilla-extract styles"
```

---

### Task B4: GalleryBreadcrumb component

**Files:**
- Create: `apps/web/src/components/photos/GalleryBreadcrumb.tsx`

- [ ] **Step 1: Write the component**

```typescript
// apps/web/src/components/photos/GalleryBreadcrumb.tsx
import Link from 'next/link';
import {
  breadcrumb,
  breadcrumbCurrent,
  breadcrumbLink,
  breadcrumbSep,
} from '~styles/components/photos.css';

type Crumb = { label: string; href: string };

type GalleryBreadcrumbProps = {
  crumbs: Crumb[];
  current: string;
};

export function GalleryBreadcrumb({ crumbs, current }: GalleryBreadcrumbProps) {
  return (
    <nav className={breadcrumb}>
      {crumbs.map((crumb) => (
        <>
          <Link key={crumb.href} href={crumb.href} className={breadcrumbLink}>
            {crumb.label}
          </Link>
          <span className={breadcrumbSep}>›</span>
        </>
      ))}
      <span className={breadcrumbCurrent}>{current}</span>
    </nav>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add apps/web/src/components/photos/GalleryBreadcrumb.tsx
git commit -m "feat(photos): add GalleryBreadcrumb component"
```

---

### Task B5: AlbumGrid + AlbumCard

**Files:**
- Create: `apps/web/src/components/photos/AlbumCard.tsx`
- Create: `apps/web/src/components/photos/AlbumGrid.tsx`

- [ ] **Step 1: Write AlbumCard**

```typescript
// apps/web/src/components/photos/AlbumCard.tsx
import Link from 'next/link';
import type { Album } from '../../types/photos';
import {
  albumCard,
  albumCount,
  albumCover,
  albumName,
  albumOverlay,
} from '~styles/components/photos.css';

type AlbumCardProps = {
  album: Album;
};

export function AlbumCard({ album }: AlbumCardProps) {
  return (
    <Link href={`/photos/${album.slug}`} className={albumCard}>
      <img
        src={album.coverUrl}
        alt={album.name}
        className={albumCover}
      />
      <div className={albumOverlay}>
        <div className={albumName}>{album.name}</div>
        <div className={albumCount}>
          {album.subAlbums.length} {album.subAlbums.length === 1 ? 'gallery' : 'galleries'} · {album.photoCount} photos
        </div>
      </div>
    </Link>
  );
}
```

- [ ] **Step 2: Write AlbumGrid**

```typescript
// apps/web/src/components/photos/AlbumGrid.tsx
import type { Album } from '../../types/photos';
import { albumGrid, pageTitle } from '~styles/components/photos.css';
import { AlbumCard } from './AlbumCard';

type AlbumGridProps = {
  albums: Album[];
};

export function AlbumGrid({ albums }: AlbumGridProps) {
  return (
    <>
      <p className={pageTitle}>Photos</p>
      <div className={albumGrid}>
        {albums.map((album) => (
          <AlbumCard key={album.slug} album={album} />
        ))}
      </div>
    </>
  );
}
```

- [ ] **Step 3: Commit**

```bash
git add apps/web/src/components/photos/AlbumCard.tsx apps/web/src/components/photos/AlbumGrid.tsx
git commit -m "feat(photos): add AlbumCard and AlbumGrid components"
```

---

### Task B6: SubAlbumGrid

**Files:**
- Create: `apps/web/src/components/photos/SubAlbumGrid.tsx`

Each sub-album card shows a cover image at its natural aspect ratio (CSS masonry handles the layout). The `src` attribute uses the `coverUrl` from the manifest — the `height` CSS is `auto` so the image determines the card's height.

- [ ] **Step 1: Write SubAlbumGrid**

```typescript
// apps/web/src/components/photos/SubAlbumGrid.tsx
import Link from 'next/link';
import type { SubAlbum } from '../../types/photos';
import {
  subAlbumCount,
  subAlbumCover,
  subAlbumGrid,
  subAlbumItem,
  subAlbumName,
  subAlbumOverlay,
} from '~styles/components/photos.css';
import { GalleryBreadcrumb } from './GalleryBreadcrumb';

type SubAlbumGridProps = {
  albumName: string;
  albumSlug: string;
  subAlbums: SubAlbum[];
};

export function SubAlbumGrid({ albumName, albumSlug, subAlbums }: SubAlbumGridProps) {
  return (
    <>
      <GalleryBreadcrumb
        crumbs={[{ label: 'Photos', href: '/photos' }]}
        current={albumName}
      />
      <div className={subAlbumGrid}>
        {subAlbums.map((sub) => (
          <Link
            key={sub.slug}
            href={`/photos/${albumSlug}/${sub.slug}`}
            className={subAlbumItem}
          >
            <img
              src={sub.coverUrl}
              alt={sub.name}
              className={subAlbumCover}
            />
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
```

- [ ] **Step 2: Commit**

```bash
git add apps/web/src/components/photos/SubAlbumGrid.tsx
git commit -m "feat(photos): add SubAlbumGrid masonry component"
```

---

### Task B7: PhotoGrid

**Files:**
- Create: `apps/web/src/components/photos/PhotoGrid.tsx`

The justified layout groups photos into rows. The `flex` shorthand on each photo item uses its aspect ratio, so each row fills the container at a consistent height. The algorithm targets `ROW_HEIGHT = 220px` and fills a row when adding the next photo would make it shorter than that.

- [ ] **Step 1: Write PhotoGrid**

```typescript
// apps/web/src/components/photos/PhotoGrid.tsx
'use client';

import type { Photo } from '../../types/photos';
import {
  photoGrid,
  photoHint,
  photoHintIcon,
  photoImg,
  photoItem,
  photoRow,
} from '~styles/components/photos.css';
import { GalleryBreadcrumb } from './GalleryBreadcrumb';

const ROW_HEIGHT = 220;
const GAP = 8; // matches vars.space['300'] = 8px

type Row = Photo[];

function buildRows(photos: Photo[], containerWidth = 1000): Row[] {
  const rows: Row[] = [];
  let current: Photo[] = [];
  let aspectSum = 0;

  for (const photo of photos) {
    const aspect = photo.width > 0 && photo.height > 0
      ? photo.width / photo.height
      : 1.5;
    current.push(photo);
    aspectSum += aspect;

    const gaps = (current.length - 1) * GAP;
    const rowHeight = (containerWidth - gaps) / aspectSum;

    if (rowHeight <= ROW_HEIGHT) {
      rows.push(current);
      current = [];
      aspectSum = 0;
    }
  }

  if (current.length > 0) rows.push(current);
  return rows;
}

type PhotoGridProps = {
  albumName: string;
  albumSlug: string;
  subAlbumName: string;
  subAlbumSlug: string;
  photos: Photo[];
  onPhotoClick: (index: number) => void;
};

export function PhotoGrid({
  albumName,
  albumSlug,
  subAlbumName,
  subAlbumSlug,
  photos,
  onPhotoClick,
}: PhotoGridProps) {
  const rows = buildRows(photos);
  let globalIndex = 0;

  return (
    <>
      <GalleryBreadcrumb
        crumbs={[
          { label: 'Photos', href: '/photos' },
          { label: albumName, href: `/photos/${albumSlug}` },
        ]}
        current={subAlbumName}
      />
      <div className={photoGrid}>
        {rows.map((row, rowIdx) => {
          const rowStart = globalIndex;
          globalIndex += row.length;
          return (
            <div key={rowIdx} className={photoRow}>
              {row.map((photo, i) => {
                const aspect =
                  photo.width > 0 && photo.height > 0
                    ? photo.width / photo.height
                    : 1.5;
                const idx = rowStart + i;
                return (
                  <button
                    key={photo.filename}
                    type="button"
                    className={photoItem}
                    style={{ flex: aspect }}
                    onClick={() => onPhotoClick(idx)}
                    aria-label={`Open photo ${photo.title ?? photo.filename}`}
                  >
                    <img
                      src={photo.url}
                      alt={photo.title ?? photo.filename}
                      className={photoImg}
                    />
                    <div className={photoHint}>
                      <div className={photoHintIcon}>+</div>
                    </div>
                  </button>
                );
              })}
            </div>
          );
        })}
      </div>
    </>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add apps/web/src/components/photos/PhotoGrid.tsx
git commit -m "feat(photos): add PhotoGrid with justified row layout"
```

---

### Task B8: Lightbox

**Files:**
- Create: `apps/web/src/components/photos/Lightbox.tsx`

Controlled via `?photo=N` URL search param. Uses `useSearchParams` to read the index and `useRouter` to update it. Closes on backdrop click or Escape key.

- [ ] **Step 1: Write Lightbox**

```typescript
// apps/web/src/components/photos/Lightbox.tsx
'use client';

import { useRouter } from 'next/navigation';
import { useCallback, useEffect } from 'react';
import type { Photo } from '../../types/photos';
import {
  lightboxAlbum,
  lightboxBackdrop,
  lightboxClose,
  lightboxImg,
  lightboxInner,
  lightboxMeta,
  lightboxNext,
  lightboxPrev,
  lightboxTitle,
} from '~styles/components/photos.css';

type LightboxProps = {
  photos: Photo[];
  currentIndex: number;
  albumName: string;
  subAlbumName: string;
  basePath: string; // e.g. /photos/street/new-york
};

export function Lightbox({
  photos,
  currentIndex,
  albumName,
  subAlbumName,
  basePath,
}: LightboxProps) {
  const router = useRouter();
  const photo = photos[currentIndex];

  const close = useCallback(() => {
    router.replace(basePath, { scroll: false });
  }, [router, basePath]);

  const go = useCallback(
    (delta: number) => {
      const next = (currentIndex + delta + photos.length) % photos.length;
      router.replace(`${basePath}?photo=${next}`, { scroll: false });
    },
    [router, basePath, currentIndex, photos.length],
  );

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') close();
      if (e.key === 'ArrowLeft') go(-1);
      if (e.key === 'ArrowRight') go(1);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [close, go]);

  if (!photo) return null;

  return (
    <div
      className={lightboxBackdrop}
      onClick={close}
      role="dialog"
      aria-modal="true"
      aria-label="Photo viewer"
    >
      <div className={lightboxInner} onClick={(e) => e.stopPropagation()}>
        <button
          type="button"
          className={lightboxClose}
          onClick={close}
          aria-label="Close"
        >
          ✕
        </button>
        <button
          type="button"
          className={lightboxPrev}
          onClick={() => go(-1)}
          aria-label="Previous photo"
        >
          ‹
        </button>
        <img
          src={photo.url}
          alt={photo.title ?? photo.filename}
          className={lightboxImg}
        />
        <div className={lightboxMeta}>
          {photo.title && <div className={lightboxTitle}>{photo.title}</div>}
          <div className={lightboxAlbum}>
            {albumName} · {subAlbumName}
          </div>
        </div>
        <button
          type="button"
          className={lightboxNext}
          onClick={() => go(1)}
          aria-label="Next photo"
        >
          ›
        </button>
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add apps/web/src/components/photos/Lightbox.tsx
git commit -m "feat(photos): add Lightbox component with keyboard navigation"
```

---

### Task B9: GalleryClient

**Files:**
- Create: `apps/web/src/components/photos/GalleryClient.tsx`

Top-level client component. Loads the manifest once with `useSuspenseQuery` (`staleTime: Infinity`), then renders the correct view based on props derived from URL params. Also renders the `Lightbox` when `photoIndex` is not null.

- [ ] **Step 1: Write GalleryClient**

```typescript
// apps/web/src/components/photos/GalleryClient.tsx
'use client';

import { useSuspenseQuery } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { getManifest } from '../../data/photos';
import { pageContainer } from '~styles/components/photos.css';
import { AlbumGrid } from './AlbumGrid';
import { Lightbox } from './Lightbox';
import { PhotoGrid } from './PhotoGrid';
import { SubAlbumGrid } from './SubAlbumGrid';

type GalleryClientProps = {
  albumSlug: string | null;
  subAlbumSlug: string | null;
  photoIndex: number | null;
};

export function GalleryClient({ albumSlug, subAlbumSlug, photoIndex }: GalleryClientProps) {
  const router = useRouter();
  const { data: manifest } = useSuspenseQuery({
    queryKey: ['photos-manifest'],
    queryFn: getManifest,
    staleTime: Infinity,
  });

  const album = albumSlug
    ? manifest.albums.find((a) => a.slug === albumSlug) ?? null
    : null;

  const subAlbum =
    album && subAlbumSlug
      ? album.subAlbums.find((s) => s.slug === subAlbumSlug) ?? null
      : null;

  const basePath = subAlbum
    ? `/photos/${albumSlug}/${subAlbumSlug}`
    : null;

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
            subAlbumName={subAlbum.name}
            subAlbumSlug={subAlbum.slug}
            photos={subAlbum.photos}
            onPhotoClick={(idx) => {
              router.replace(`${basePath}?photo=${idx}`, { scroll: false });
            }}
          />
          {photoIndex !== null && (
            <Lightbox
              photos={subAlbum.photos}
              currentIndex={photoIndex}
              albumName={album.name}
              subAlbumName={subAlbum.name}
              basePath={basePath}
            />
          )}
        </>
      )}
    </div>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add apps/web/src/components/photos/GalleryClient.tsx
git commit -m "feat(photos): add GalleryClient top-level component"
```

---

### Task B10: Page routes

**Files:**
- Create: `apps/web/src/app/photos/page.tsx`
- Create: `apps/web/src/app/photos/[album]/page.tsx`
- Create: `apps/web/src/app/photos/[album]/[subAlbum]/page.tsx`

Each page is a server component that reads URL params and passes them to `GalleryClient` wrapped in `Suspense` + `ErrorBoundary`.

- [ ] **Step 1: Write photos/page.tsx**

```typescript
// apps/web/src/app/photos/page.tsx
import { ErrorBoundary } from 'react-error-boundary';
import { Suspense } from 'react';
import { GalleryClient } from '../../components/photos/GalleryClient';
import { ErrorMessage } from '../../components/ui/ErrorMessage';
import { Loading } from '../../components/ui/Loading';

export const dynamic = 'force-dynamic';

export default function PhotosPage() {
  return (
    <ErrorBoundary fallback={<ErrorMessage />}>
      <Suspense fallback={<Loading />}>
        <GalleryClient albumSlug={null} subAlbumSlug={null} photoIndex={null} />
      </Suspense>
    </ErrorBoundary>
  );
}
```

- [ ] **Step 2: Write photos/[album]/page.tsx**

```typescript
// apps/web/src/app/photos/[album]/page.tsx
import { ErrorBoundary } from 'react-error-boundary';
import { Suspense } from 'react';
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
        <GalleryClient albumSlug={album} subAlbumSlug={null} photoIndex={null} />
      </Suspense>
    </ErrorBoundary>
  );
}
```

- [ ] **Step 3: Write photos/[album]/[subAlbum]/page.tsx**

```typescript
// apps/web/src/app/photos/[album]/[subAlbum]/page.tsx
import { ErrorBoundary } from 'react-error-boundary';
import { Suspense } from 'react';
import { GalleryClient } from '../../../../components/photos/GalleryClient';
import { ErrorMessage } from '../../../../components/ui/ErrorMessage';
import { Loading } from '../../../../components/ui/Loading';

export const dynamic = 'force-dynamic';

type SubAlbumPageProps = {
  params: Promise<{ album: string; subAlbum: string }>;
  searchParams: Promise<{ photo?: string }>;
};

export default async function SubAlbumPage({ params, searchParams }: SubAlbumPageProps) {
  const { album, subAlbum } = await params;
  const { photo } = await searchParams;
  const photoIndex = photo !== undefined ? Number(photo) : null;
  return (
    <ErrorBoundary fallback={<ErrorMessage />}>
      <Suspense fallback={<Loading />}>
        <GalleryClient
          albumSlug={album}
          subAlbumSlug={subAlbum}
          photoIndex={photoIndex}
        />
      </Suspense>
    </ErrorBoundary>
  );
}
```

- [ ] **Step 4: Commit**

```bash
git add apps/web/src/app/photos/
git commit -m "feat(photos): add /photos page routes"
```

---

### Task B11: Nav link

**Files:**
- Modify: `apps/web/src/app/layout.tsx`

The current layout has no visible nav. Add a minimal nav with links to the existing pages and the new Photos page.

- [ ] **Step 1: Read the current layout to find the right insertion point**

Open `apps/web/src/app/layout.tsx`. The `<body>` currently renders:
```tsx
<body>
  <QueryProvider>
    <ThemeContextProvider>
      <ThemeWrapper>
        {children}
        <ThemeToggle />
      </ThemeWrapper>
    </ThemeContextProvider>
  </QueryProvider>
</body>
```

- [ ] **Step 2: Create nav styles**

Add to `apps/web/src/styles/app.css.ts` (or create a new file `apps/web/src/styles/components/Nav.css.ts`):

```typescript
// apps/web/src/styles/components/Nav.css.ts
import { style } from '@vanilla-extract/css';
import { colorVars, vars } from '../theme.css';

export const nav = style({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  paddingInline: vars.space['600'],
  paddingBlock: vars.space['500'],
  borderBottom: `1px solid ${colorVars.body}1a`,
});

export const navLogo = style({
  fontFamily: vars.typography.font.heading,
  fontSize: vars.typography.size['50'],
  fontWeight: vars.typography.weight['500'],
  letterSpacing: '0.12em',
  textTransform: 'uppercase',
  color: colorVars.body,
  textDecoration: 'none',
  opacity: 0.9,
});

export const navLinks = style({
  display: 'flex',
  gap: vars.space['600'],
  listStyle: 'none',
});

export const navLink = style({
  fontFamily: vars.typography.font.heading,
  fontSize: vars.typography.size['50'],
  letterSpacing: '0.08em',
  textTransform: 'uppercase',
  color: colorVars.body,
  opacity: 0.45,
  textDecoration: 'none',
  transition: 'opacity 0.15s',
  selectors: {
    '&:hover': { opacity: 0.9 },
  },
});
```

- [ ] **Step 3: Add Nav component**

Create `apps/web/src/components/Nav.tsx`:

```typescript
// apps/web/src/components/Nav.tsx
import Link from 'next/link';
import { nav, navLink, navLinks, navLogo } from '../styles/components/Nav.css';

export function Nav() {
  return (
    <nav className={nav}>
      <Link href="/" className={navLogo}>Jack</Link>
      <ul className={navLinks}>
        <li><Link href="/resume" className={navLink}>Resume</Link></li>
        <li><Link href="/photos" className={navLink}>Photos</Link></li>
      </ul>
    </nav>
  );
}
```

- [ ] **Step 4: Add Nav to layout.tsx**

In `apps/web/src/app/layout.tsx`, add the import and render `<Nav />` inside `<ThemeWrapper>` before `{children}`:

```typescript
import { Nav } from '../components/Nav';
// ...
<ThemeWrapper>
  <Nav />
  {children}
  <ThemeToggle />
</ThemeWrapper>
```

- [ ] **Step 5: Commit**

```bash
git add apps/web/src/components/Nav.tsx apps/web/src/styles/components/Nav.css.ts apps/web/src/app/layout.tsx
git commit -m "feat(photos): add Nav component with Photos link"
```

---

### Task B12: Tests

**Files:**
- Create: `apps/web/src/test/mocks/fixtures/photos.ts`
- Modify: `apps/web/src/test/mocks/handlers.ts`
- Create: `apps/web/src/test/components/photos/Gallery.test.tsx`

- [ ] **Step 1: Write the manifest fixture factory**

```typescript
// apps/web/src/test/mocks/fixtures/photos.ts
import type { Album, Manifest, Photo, SubAlbum } from '../../../../types/photos';

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
    makePhoto({ filename: 'a.jpg', url: 'https://example.r2.dev/street/new-york/a.jpg' }),
    makePhoto({ filename: 'b.jpg', url: 'https://example.r2.dev/street/new-york/b.jpg' }),
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
      subAlbums: [
        makeSubAlbum({ name: 'Mountains', slug: 'mountains' }),
      ],
    }),
  ],
  ...overrides,
});
```

- [ ] **Step 2: Add makeManifestHandler to handlers.ts**

In `apps/web/src/test/mocks/handlers.ts`, add at the end:

```typescript
import type { Manifest } from '../../types/photos';

export const makeManifestHandler = (manifest: Manifest) =>
  http.get('/api/photos/manifest', () => HttpResponse.json(manifest));
```

Also add to the default `handlers` array:
```typescript
http.get('/api/photos/manifest', () => HttpResponse.json({ generated: '', albums: [] })),
```

- [ ] **Step 3: Write failing tests**

```typescript
// apps/web/src/test/components/photos/Gallery.test.tsx
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Suspense } from 'react';
import { GalleryClient } from '~components/photos/GalleryClient';
import { makeManifest, makeSubAlbum } from '~test/mocks/fixtures/photos';
import { makeManifestHandler } from '~test/mocks/handlers';
import { server } from '~test/mocks/server';
import { render } from '~test/utils/render';

describe('GalleryClient', () => {
  it('renders album names on the root view', async () => {
    server.use(makeManifestHandler(makeManifest()));
    render(
      <Suspense fallback={null}>
        <GalleryClient albumSlug={null} subAlbumSlug={null} photoIndex={null} />
      </Suspense>,
    );
    await screen.findByText('Street');
    await screen.findByText('Landscape');
  });

  it('renders sub-album names when an album is selected', async () => {
    server.use(makeManifestHandler(makeManifest()));
    render(
      <Suspense fallback={null}>
        <GalleryClient albumSlug="street" subAlbumSlug={null} photoIndex={null} />
      </Suspense>,
    );
    await screen.findByText('New York');
  });

  it('renders photos when a sub-album is selected', async () => {
    server.use(makeManifestHandler(makeManifest()));
    render(
      <Suspense fallback={null}>
        <GalleryClient albumSlug="street" subAlbumSlug="new-york" photoIndex={null} />
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
        <GalleryClient albumSlug="street" subAlbumSlug="new-york" photoIndex={0} />
      </Suspense>,
    );
    await screen.findByRole('dialog', { name: /photo viewer/i });
  });

  it('shows breadcrumb trail on sub-album view', async () => {
    server.use(makeManifestHandler(makeManifest()));
    render(
      <Suspense fallback={null}>
        <GalleryClient albumSlug="street" subAlbumSlug="new-york" photoIndex={null} />
      </Suspense>,
    );
    await screen.findByText('Photos');
    await screen.findByText('Street');
    await screen.findByText('New York');
  });
});
```

- [ ] **Step 4: Run tests — expect failure**

```bash
pnpm test
```

Expected: tests fail because `GalleryClient` and fixtures don't exist yet. (If you're executing tasks in order, they already exist — run to confirm they pass.)

- [ ] **Step 5: Run tests — expect pass**

```bash
pnpm test
```

Expected: all 5 Gallery tests pass.

- [ ] **Step 6: Commit**

```bash
git add apps/web/src/test/mocks/fixtures/photos.ts apps/web/src/test/mocks/handlers.ts apps/web/src/test/components/photos/Gallery.test.tsx
git commit -m "feat(photos): add gallery tests and fixtures"
```

---

### Task B13: Type-check and lint

- [ ] **Step 1: Run TypeScript type check**

```bash
pnpm check-types
```

Expected: 0 errors. Fix any type errors before proceeding.

- [ ] **Step 2: Run linter**

```bash
pnpm lint
```

Expected: 0 errors. Run `pnpm fml` to auto-fix formatting issues.

- [ ] **Step 3: Run full test suite**

```bash
pnpm test
```

Expected: all tests pass.

- [ ] **Step 4: Final commit**

```bash
git add -A
git commit -m "feat(photos): complete photo gallery implementation"
```

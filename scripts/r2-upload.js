import fs from 'node:fs';
import path from 'node:path';
import {
  HeadObjectCommand,
  ListObjectsV2Command,
  PutObjectCommand,
  S3Client,
} from '@aws-sdk/client-s3';
import * as dotenv from 'dotenv';
// { path: path.join(process.env.HOME, '.env') }
dotenv.config();

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
  } catch (err) {
    if (err.$metadata?.httpStatusCode === 404 || err.name === 'NotFound') return false;
    throw err; // rethrow auth errors, network errors, etc.
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

  // Build metadata index keyed by R2 key (full path including filename)
  // New format: metadata.albums is a flat array of { path: string[], name, photos }
  const metaIndex = {};
  const nameIndex = {}; // "slug1/slug2/..." -> display name
  if (metadata) {
    for (const album of metadata.albums) {
      const albumKeyPrefix = album.path.join('/');
      nameIndex[albumKeyPrefix] = album.name;
      for (const photo of album.photos) {
        metaIndex[`${albumKeyPrefix}/${photo.filename}`] = photo;
      }
    }
  }

  // Group keys: top segment = album, remaining segments minus filename = subAlbum
  // e.g. "landscape/utah/photo.jpg"         → album=landscape, sub=utah
  //      "galleries/2020/album/photo.jpg"   → album=galleries, sub=2020/album
  const tree = {};
  for (const key of allKeys) {
    if (key === 'manifest.json') continue;
    const parts = key.split('/');
    if (parts.length < 3) continue; // need at least album/subAlbum/file
    const [albumSlug, ...rest] = parts;
    const filename = rest.pop();
    const subSlug = rest.join('/'); // may be multi-segment for deep folders
    tree[albumSlug] ??= {};
    tree[albumSlug][subSlug] ??= [];
    tree[albumSlug][subSlug].push({ filename, key });
  }

  const albums = Object.entries(tree).map(([albumSlug, subAlbums]) => {
    const subAlbumList = Object.entries(subAlbums).map(([subSlug, files]) => {
      const subKeyPrefix = `${albumSlug}/${subSlug}`;
      const photos = files.map(({ filename, key }) => {
        const meta = metaIndex[key];
        return {
          filename,
          url: `${R2_PUBLIC_URL}/${key}`,
          width: meta?.width ?? 0,
          height: meta?.height ?? 0,
          ...(meta?.title ? { title: meta.title } : {}),
        };
      });
      // Display name: from metadata, or humanise the last path segment
      const displayName = nameIndex[subKeyPrefix]
        ?? subSlug.split('/').pop().replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
      return {
        name: displayName,
        slug: subSlug,
        coverUrl: photos[0]?.url ?? '',
        photoCount: photos.length,
        photos,
      };
    });

    const allPhotos = subAlbumList.flatMap(s => s.photos);
    const displayName = nameIndex[albumSlug]
      ?? albumSlug.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
    return {
      name: displayName,
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

  // Recursively walk the photos directory. Any file at depth >= 2 (album/sub/.../file)
  // gets uploaded; its R2 key is the relative path from photosDir.
  async function walkAndUpload(dir, relParts) {
    for (const entry of fs.readdirSync(dir)) {
      if (entry.startsWith('.')) continue;
      const fullPath = path.join(dir, entry);
      const stat = fs.statSync(fullPath);
      if (stat.isDirectory()) {
        await walkAndUpload(fullPath, [...relParts, slugify(entry)]);
      } else if (stat.isFile() && relParts.length >= 2) {
        const key = [...relParts, entry].join('/');
        if (await objectExists(key)) {
          skipped++;
        } else {
          await uploadFile(fullPath, key, getContentType(entry));
          uploaded++;
          process.stdout.write('.');
        }
      }
    }
  }

  await walkAndUpload(photosDir, []);

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

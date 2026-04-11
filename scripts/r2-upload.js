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

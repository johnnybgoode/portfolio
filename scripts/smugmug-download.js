import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import * as dotenv from 'dotenv';
import OAuth from 'oauth-1.0a';

// Load credentials from ~/.env
dotenv.config({ path: path.join(process.env.HOME, '.env') });

const {
  SMUGMUG_API_KEY,
  SMUGMUG_API_SEC,
  SMUGMUG_ACCESS_TOKEN,
  SMUGMUG_ACCESS_TOKEN_SECRET,
  SMUGMUG_USER,
} = process.env;

if (!SMUGMUG_API_KEY || !SMUGMUG_API_SEC || !SMUGMUG_USER) {
  console.error('Missing SMUGMUG_API_KEY, SMUGMUG_API_SEC, or SMUGMUG_USER in ~/.env');
  process.exit(1);
}
if (!SMUGMUG_ACCESS_TOKEN || !SMUGMUG_ACCESS_TOKEN_SECRET) {
  console.error('Missing SMUGMUG_ACCESS_TOKEN or SMUGMUG_ACCESS_TOKEN_SECRET in ~/.env');
  console.error('Run: node scripts/smugmug-auth.js');
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

const accessToken = { key: SMUGMUG_ACCESS_TOKEN, secret: SMUGMUG_ACCESS_TOKEN_SECRET };

// Authenticated API requests (needed for original image access)
async function apiGet(uri) {
  const url = uri.startsWith('http') ? uri : `${BASE_URL}${uri}`;
  const fullUrl = `${url}${url.includes('?') ? '&' : '?'}_accept=application%2Fjson`;
  const authHeader = oauth.toHeader(oauth.authorize({ url: fullUrl, method: 'GET' }, accessToken));
  const res = await fetch(fullUrl, { headers: { ...authHeader, Accept: 'application/json' } });
  if (!res.ok) throw new Error(`SmugMug API error ${res.status} for ${fullUrl}`);
  return res.json();
}

function slugify(name) {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
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
      const albumUri = subNode.Uris?.Album?.Uri;
      if (!albumUri) {
        console.warn(`  Skipping ${subNode.Name} — no Album URI`);
        continue;
      }
      const images = await getImagesForAlbum(albumUri);

      for (const img of images) {
        const filename = img.FileName;
        const destPath = path.join(OUTPUT_DIR, albumSlug, subSlug, filename);
        // ArchivedUri is the original download URL (requires auth). Fall back to
        // LargestImage if somehow absent.
        const downloadUrl = img.ArchivedUri
          ?? (await apiGet(img.Uris.LargestImage.Uri)).Response.LargestImage.Url;
        const downloaded = await downloadFile(downloadUrl, destPath);
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

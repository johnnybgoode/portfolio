/**
 * One-time SmugMug OAuth setup.
 * Run this once: node scripts/smugmug-auth.js
 * It will print an authorization URL, prompt for the verifier code,
 * then save SMUGMUG_ACCESS_TOKEN and SMUGMUG_ACCESS_TOKEN_SECRET to ~/.env.
 */

import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import * as readline from 'node:readline/promises';
import * as dotenv from 'dotenv';
import OAuth from 'oauth-1.0a';

const ENV_PATH = path.join(process.env.HOME, '.env');
dotenv.config({ path: ENV_PATH });

const { SMUGMUG_API_KEY, SMUGMUG_API_SEC } = process.env;
if (!SMUGMUG_API_KEY || !SMUGMUG_API_SEC) {
  console.error('Missing SMUGMUG_API_KEY or SMUGMUG_API_SEC in ~/.env');
  process.exit(1);
}

const oauth = new OAuth({
  consumer: { key: SMUGMUG_API_KEY, secret: SMUGMUG_API_SEC },
  signature_method: 'HMAC-SHA1',
  hash_function(base_string, key) {
    return crypto.createHmac('sha1', key).update(base_string).digest('base64');
  },
});

async function oauthPost(url, token = null) {
  const requestData = { url, method: 'POST' };
  const authData = token
    ? oauth.authorize(requestData, token)
    : oauth.authorize(requestData);
  const authHeader = oauth.toHeader(authData);

  const res = await fetch(url, {
    method: 'POST',
    headers: { ...authHeader, 'Content-Type': 'application/x-www-form-urlencoded' },
  });
  const text = await res.text();
  if (!res.ok) throw new Error(`OAuth request failed ${res.status}: ${text}`);
  return Object.fromEntries(new URLSearchParams(text));
}

function appendEnvVar(key, value) {
  const current = fs.readFileSync(ENV_PATH, 'utf8');
  const updated = current.includes(`${key}=`)
    ? current.replace(new RegExp(`^${key}=.*$`, 'm'), `${key}=${value}`)
    : `${current.trimEnd()}\n${key}=${value}\n`;
  fs.writeFileSync(ENV_PATH, updated);
}

const rl = readline.createInterface({ input: process.stdin, output: process.stdout });

try {
  // Step 1: get request token
  console.log('Requesting OAuth token...');
  const requestToken = await oauthPost(
    'https://api.smugmug.com/services/oauth/1.0a/getRequestToken',
  );

  // Step 2: user authorizes
  const authUrl = `https://api.smugmug.com/services/oauth/1.0a/authorize?oauth_token=${requestToken.oauth_token}&Access=Full&Permissions=Read`;
  console.log('\nOpen this URL in your browser and click "Allow":\n');
  console.log(' ', authUrl);
  console.log();

  const verifier = await rl.question('Paste the 6-digit verifier code here: ');

  // Step 3: exchange for access token
  const accessToken = await oauthPost(
    'https://api.smugmug.com/services/oauth/1.0a/getAccessToken',
    { key: requestToken.oauth_token, secret: requestToken.oauth_token_secret, verifier: verifier.trim() },
  );

  appendEnvVar('SMUGMUG_ACCESS_TOKEN', accessToken.oauth_token);
  appendEnvVar('SMUGMUG_ACCESS_TOKEN_SECRET', accessToken.oauth_token_secret);

  console.log('\nAccess token saved to ~/.env. You can now run:');
  console.log('  node scripts/smugmug-download.js');
} finally {
  rl.close();
}

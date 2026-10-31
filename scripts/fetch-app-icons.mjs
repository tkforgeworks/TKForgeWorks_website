// Fetches each app's icon from its own repository before the build
// (npm "prebuild"). The icons are all-rights-reserved brand art owned by the
// app repos, so this repo never commits a copy (see .gitignore).
//
// An icon already on disk is kept, so offline local builds still work; set
// APP_ICONS_REFRESH=1 to download it again. CI and Cloudflare Pages start
// from a clean checkout and always fetch. A failed download stops the build
// rather than deploying a page without its icon.

import { mkdir, writeFile, access } from "node:fs/promises";
import path from "node:path";

const APPS = [
  {
    slug: "cheesy-scribe",
    // The app's main branch is its released state.
    source:
      "https://raw.githubusercontent.com/tkforgeworks/cheesy-scribe/main/assets/brand/launcher/icon-legacy.png",
    destination: "public/apps/cheesy-scribe/icon.png",
  },
];

const ATTEMPTS = 3;
const refresh = Boolean(process.env.APP_ICONS_REFRESH);

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

async function exists(file) {
  try {
    await access(file);
    return true;
  } catch {
    return false;
  }
}

async function download(url) {
  let lastError;
  for (let attempt = 1; attempt <= ATTEMPTS; attempt++) {
    try {
      const response = await fetch(url);
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      return Buffer.from(await response.arrayBuffer());
    } catch (error) {
      lastError = error;
      if (attempt < ATTEMPTS) await sleep(1000 * attempt);
    }
  }
  throw lastError;
}

for (const app of APPS) {
  if (!refresh && (await exists(app.destination))) {
    console.log(
      `app icons: ${app.slug} already at ${app.destination}, skipped (set APP_ICONS_REFRESH=1 to fetch again)`
    );
    continue;
  }
  try {
    const bytes = await download(app.source);
    await mkdir(path.dirname(app.destination), { recursive: true });
    await writeFile(app.destination, bytes);
    console.log(
      `app icons: ${app.slug} fetched to ${app.destination} (${bytes.length} bytes)`
    );
  } catch (error) {
    console.error(
      `app icons: could not fetch ${app.source} after ${ATTEMPTS} attempts (${error.message})`
    );
    process.exit(1);
  }
}

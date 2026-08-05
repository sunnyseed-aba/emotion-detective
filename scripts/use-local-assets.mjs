#!/usr/bin/env node
/**
 * use-local-assets.mjs
 *
 * 目的：讓專案脫離 Manus 的 /manus-storage/ CDN，改用倉庫內自帶的 assets/ 圖片。
 *
 * 用法：
 *   node scripts/use-local-assets.mjs          # 執行搬移與改寫
 *   node scripts/use-local-assets.mjs --dry    # 只列出將要做的事，不寫檔
 *   node scripts/use-local-assets.mjs --dry-run  # 同上（別名）
 *
 * 做的事：
 *   1. 把 assets/images/**  複製到 client/public/game-assets/**
 *   2. 把 client/src 內所有 "/manus-storage/xxx" 改寫為 "/game-assets/<類別>/xxx"
 *
 * 注意：Manus WebDev 平台本身建議把大型靜態檔放在專案外並用 CDN URL；
 * 若你在 Manus 平台上繼續開發，可以不執行此腳本。
 * 若你要移到 Vercel / Netlify / 自架 Node，請務必執行一次。
 */
import { readdir, readFile, writeFile, mkdir, copyFile } from "node:fs/promises";
import { existsSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const DRY = process.argv.includes("--dry") || process.argv.includes("--dry-run") || process.argv.includes("-n");

const ASSET_SRC = path.join(ROOT, "assets", "images");
const ASSET_DEST = path.join(ROOT, "client", "public", "game-assets");
const CODE_DIR = path.join(ROOT, "client", "src");

/** 回傳 assets/images 下所有檔案的 { 檔名 -> 相對子路徑 } 對照 */
async function buildAssetIndex() {
  const index = new Map();
  for (const group of await readdir(ASSET_SRC)) {
    const dir = path.join(ASSET_SRC, group);
    for (const file of await readdir(dir)) {
      index.set(file, `${group}/${file}`);
    }
  }
  return index;
}

async function walk(dir, out = []) {
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const p = path.join(dir, entry.name);
    if (entry.isDirectory()) await walk(p, out);
    else if (/\.(ts|tsx|css|html)$/.test(entry.name)) out.push(p);
  }
  return out;
}

const index = await buildAssetIndex();
console.log(`找到 ${index.size} 個本地圖片資產`);

// 1. 複製到 public
if (!DRY) {
  for (const [file, rel] of index) {
    const dest = path.join(ASSET_DEST, rel);
    await mkdir(path.dirname(dest), { recursive: true });
    await copyFile(path.join(ASSET_SRC, rel), dest);
  }
  console.log(`已複製到 ${path.relative(ROOT, ASSET_DEST)}`);
}

// 2. 改寫程式碼中的 URL
let touched = 0;
let missing = new Set();
for (const file of await walk(CODE_DIR)) {
  const src = await readFile(file, "utf8");
  const next = src.replace(/\/manus-storage\/([A-Za-z0-9_.-]+)/g, (whole, name) => {
    const rel = index.get(name);
    if (!rel) {
      if (name !== "...") missing.add(name);
      return whole;
    }
    return `/game-assets/${rel}`;
  });
  if (next !== src) {
    touched++;
    if (!DRY) await writeFile(file, next);
    console.log(`改寫 ${path.relative(ROOT, file)}`);
  }
}

console.log(`\n完成：${touched} 個檔案${DRY ? "（dry run，未實際寫入）" : "已更新"}`);
if (missing.size) {
  console.warn("以下 URL 在 assets/ 找不到對應檔案，請手動處理：");
  for (const m of missing) console.warn("  -", m);
  process.exitCode = 1;
}
if (!existsSync(path.join(ROOT, "assets"))) {
  console.error("找不到 assets/ 目錄");
  process.exitCode = 1;
}

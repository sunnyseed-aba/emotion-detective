/**
 * 將場景資料中的 v3 資產 URL 換成「已去背 + 已壓縮」的最終版本。
 * 用舊 hash 無關的方式比對：只看檔名主體（例如 v3-char-yu-sch01）。
 */
import { readFileSync, writeFileSync } from "node:fs";

const MAP = {
  "v3-char-granny-com02": "/manus-storage/v3-char-granny-com02_web_87b65396.png",
  "v3-char-hao-com01": "/manus-storage/v3-char-hao-com01_web_9738b857.png",
  "v3-char-hao-sch02": "/manus-storage/v3-char-hao-sch02_web_ff9a0277.png",
  "v3-char-lin-sch03": "/manus-storage/v3-char-lin-sch03_web_5d1938ef.png",
  "v3-char-mei-hom02": "/manus-storage/v3-char-mei-hom02_web_c19d5e7d.png",
  "v3-char-mei-sch02": "/manus-storage/v3-char-mei-sch02_web_fe246636.png",
  "v3-char-mom-hom02": "/manus-storage/v3-char-mom-hom02_web_3dbb5364.png",
  "v3-char-rou-sch01": "/manus-storage/v3-char-rou-sch01_web_013b14ef.png",
  "v3-char-yu-com02": "/manus-storage/v3-char-yu-com02_web_9876c521.png",
  "v3-char-yu-hom01": "/manus-storage/v3-char-yu-hom01_web_938598cb.png",
  "v3-char-yu-sch01": "/manus-storage/v3-char-yu-sch01_web_5b21709e.png",
  "v3-scene-com01": "/manus-storage/v3-scene-com01_web_8524e067.jpg",
  "v3-scene-com02": "/manus-storage/v3-scene-com02_web_fa70b156.jpg",
  "v3-scene-hom01": "/manus-storage/v3-scene-hom01_web_818da1b6.jpg",
  "v3-scene-hom02": "/manus-storage/v3-scene-hom02_web_c52d8a7b.jpg",
  "v3-scene-sch01": "/manus-storage/v3-scene-sch01_web_c6501dae.jpg",
  "v3-scene-sch02": "/manus-storage/v3-scene-sch02_web_b5aae1d8.jpg",
  "v3-scene-sch03": "/manus-storage/v3-scene-sch03_web_dfb5a256.jpg",
};

const files = [
  "client/src/game/scenes/school.ts",
  "client/src/game/scenes/home.ts",
  "client/src/game/scenes/community.ts",
];

let total = 0;
for (const f of files) {
  let src = readFileSync(f, "utf8");
  for (const [base, url] of Object.entries(MAP)) {
    const re = new RegExp(`/manus-storage/${base}[A-Za-z0-9_]*\\.(png|jpg)`, "g");
    src = src.replace(re, () => {
      total += 1;
      return url;
    });
  }
  writeFileSync(f, src);
  console.log("updated", f);
}
console.log("replacements:", total);

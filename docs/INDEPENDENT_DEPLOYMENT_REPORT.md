# 獨立部署與測試基線報告

> 日期：2026-08-05  
> 分支：`chore/independent-deployment-baseline`  
> 原始移交基線：`main` / commit `39d9016`  
> 範圍：僅處理 Manus 執行依賴、本地資產、環境固定、測試與獨立部署；未修改遊戲內容、角色、圖片、定位、視覺或五階段流程。

## 1. 修改摘要

- 將非 Git 的 Downloads 移交原件複製到獨立 Git 工作區，排除 `node_modules`、`dist` 與 runtime logs。
- 在 `main` 建立原始移交基線 commit，再建立本工作分支，Downloads 原件未被覆寫。
- 使用既有 `scripts/use-local-assets.mjs`，把 19 張現行圖片納入 `client/public/game-assets/`，並把應用 URL 改成 `/game-assets/...`。
- 移除 Vite 中的 Manus runtime、storage proxy、debug log collector、Manus allowed hosts 與 JSX location plugin。
- 移除 production HTML 中的 Manus analytics placeholder script。
- 移除未再使用的 Manus debug collector 靜態檔與 `ManusDialog` 樣板元件。
- 固定 Node/pnpm 說明，新增 `.env.example` 與 README 標準驗證命令。
- 新增 Vitest test script、3 個測試檔、16 個最小核心測試。
- 對 engine 只抽出可測試的純狀態函式，Hook 與 UI 仍使用原本流程；未重寫架構或改變階段順序。
- 強化評分對重複、非計分、NaN attempts 與空輸入的安全處理；合法遊戲結果的分數規則不變。

## 2. 移除或隔離的 Manus 依賴

已從一般開發與 production build 路徑移除：

- `vite-plugin-manus-runtime`
- `@builder.io/vite-plugin-jsx-loc`
- `vitePluginManusRuntime()`
- Manus browser log collector plugin
- `POST /__manus__/logs`
- `client/public/__manus__/debug-collector.js`
- `.manus-logs` 寫入邏輯
- `/manus-storage` proxy
- `BUILT_IN_FORGE_API_URL`／`BUILT_IN_FORGE_API_KEY` 讀取
- Manus domain `allowedHosts`
- `%VITE_ANALYTICS_ENDPOINT%`
- `%VITE_ANALYTICS_WEBSITE_ID%`
- Manus analytics script
- 未使用的 Manus login dialog 樣板

既有歷史文件、Prompt、資產來源說明與歷史維護腳本仍保留；它們不會進入一般 production runtime。`scripts/swap_v3_assets.mjs` 是歷史資產工具，仍含舊 URL 範例，但沒有被 package scripts、Vite 或應用匯入。

驗證 production output 與執行來源時，以下字串皆無命中：

```text
/manus-storage/
%VITE_ANALYTICS_ENDPOINT%
%VITE_ANALYTICS_WEBSITE_ID%
__manus__
vite-plugin-manus-runtime
```

## 3. 圖片本地載入方式

實際執行：

```bash
node scripts/use-local-assets.mjs
```

腳本結果：

- 找到 19 張 `assets/images/` 正式資產。
- 完整複製到 `client/public/game-assets/{brand,characters,scenes}/`。
- 改寫 `client/src/game/assets.ts` 與三個 scene data files。
- 應用目前全部使用 root-relative `/game-assets/...` URL。
- build 後 `dist/public/game-assets/` 有 19 張圖片。
- production server 逐張 HTTP 驗證：19 成功、0 失敗。
- `assets/source/originals/` 的 34 張原始素材完整保留。
- 沒有修改圖片二進位內容、人物、熱點或 placement 座標。

腳本現在屬於資產更新／重新同步工具；repository 已包含同步結果，日常 build 不需先執行。

## 4. 固定的 Node 與 pnpm 版本

| 項目 | 基線 |
| --- | --- |
| Node.js 支援範圍 | >= 20 |
| `.nvmrc` | 22.13.0 |
| `packageManager` | pnpm 10.4.1（含 integrity hash） |
| 鎖檔 | `pnpm-lock.yaml`，frozen install 通過 |
| 本次驗證 Node | 24.14.0（Codex bundled runtime） |
| 本次實際 pnpm | 10.4.1 |

本任務沒有升級到 pnpm 11。系統外層 pnpm 11 仍會顯示「package.json pnpm field 設定位置變更」警告，因此所有實際安裝與 scripts 驗證均明確使用 pnpm 10.4.1。一般接手環境依 `packageManager` 使用 pnpm 10.4.1 即可。

新增 `.env.example`。應用不需要密鑰、analytics 或 Manus variables；`VITE_APP_TITLE` 僅為選用公開設定。

## 5. 新增測試

### `engine.test.ts`

- 初始階段為 observe。
- 未揭露所有 essential clues 時不可前進。
- 正確階段順序。
- 錯誤／正確選項的 feedback、ruledOut 與 attempts。
- ABC 錯誤欄位不落位、attempts 增加。
- 以現有 `school-01` 完成 observe → name → mind → abc → strategy → debrief 整合流程。
- 完整結果含 5 個計分階段，可供 completed-case persistence 使用。

### `scoring.test.ts`

- 1–5 個首次答對對應百分比與 1–3 星。
- 92／76 星等邊界。
- 全部重試、空輸入安全最低分。
- NaN attempts、重複階段與 debrief 紀錄安全忽略。

### `progress.test.ts`

- 版本化 key：`emotion-detective-progress-v1`。
- 空資料 fallback。
- 正常 stage／emotion／completed case 寫入與讀取。
- 損壞 JSON fallback。
- 清除進度。
- localStorage get/set 拋錯時不讓遊戲崩潰。

測試使用 Vitest node environment 與最小 in-memory localStorage fake，沒有引入瀏覽器 E2E framework。

## 6. 測試結果

```text
Test Files  3 passed (3)
Tests       16 passed (16)
Duration    248ms
```

TypeScript `pnpm check`：零錯誤。

## 7. Build 結果

`pnpm build` 成功：

```text
Vite 7.1.9
1,639 modules transformed
dist/public/index.html                  0.82 kB (gzip 0.50 kB)
dist/public/assets/index-*.css        118.97 kB (gzip 19.03 kB)
dist/public/assets/index-*.js         379.57 kB (gzip 120.65 kB)
dist/index.js                           788 B
```

結果：

- 沒有 Manus analytics placeholder 警告。
- 原本受 Manus runtime 注入影響的 367.84 kB HTML 降為 0.82 kB。
- build output 不依賴 `/manus-storage/`。
- 19 張圖片均存在於 build output。
- Express production bundle 成功。

## 8. Production server 驗證

以 `PORT=4180 pnpm start` 啟動成功。

| Route | HTTP | 結果 |
| --- | ---: | --- |
| `/` | 200 | 通過 |
| `/scenes` | 200 | direct refresh / SPA fallback 通過 |
| `/scenes/school` | 200 | direct refresh / SPA fallback 通過 |
| `/play/school/school-01` | 200 | 實際有效案件 route 通過 |
| `/play/school/sch01` | 200 | server fallback 通過，但前端無此案件 ID |
| 19 個 `/game-assets/...` | 200 | 19/19 通過 |

注意：需求文字中的 `/play/school/sch01` 不是現有案件 ID。現有資料使用 `school-01`；`sch01` 雖不會 server 404，但進入應用後會顯示找不到案件。本任務禁止修改案件內容／ID，因此沒有加入 alias 或更名。

## 9. 修改過的檔案清單

設定與文件：

- `.env.example`（新增）
- `README.md`
- `docs/ENV_GUIDE.md`
- `docs/INDEPENDENT_DEPLOYMENT_REPORT.md`（新增）
- `package.json`
- `pnpm-lock.yaml`
- `vite.config.ts`

移除的 Manus runtime 檔案：

- `client/public/__manus__/debug-collector.js`
- `client/src/components/ManusDialog.tsx`

本地資產與 URL：

- `client/public/game-assets/`（19 張新增部署副本）
- `client/src/game/assets.ts`
- `client/src/game/scenes/school.ts`
- `client/src/game/scenes/home.ts`
- `client/src/game/scenes/community.ts`

測試與最小可測試性調整：

- `client/src/game/engine.ts`
- `client/src/game/scoring.ts`
- `client/src/game/progress.ts`
- `client/src/game/engine.test.ts`（新增）
- `client/src/game/scoring.test.ts`（新增）
- `client/src/game/progress.test.ts`（新增）

## 10. 尚未解決的問題

- 沒有真實瀏覽器 E2E；目前 integration test 驗證 domain flow，HTTP 驗證資產與 SPA fallback。
- 未在目標平板／低階裝置驗證實際圖片呈現、熱點視覺與效能。
- Google Fonts 仍為第三方 CDN；完全離線部署需再做字型本地化。
- 一般 UI library 仍有多個未使用依賴；本任務避免擴大清理。
- pnpm 10 在較新的外層 pnpm wrapper 會出現設定位置警告；不影響本次 frozen install、test 或 build。若未來升 pnpm 11，需另開任務遷移 patchedDependencies/overrides 並驗證 Wouter patch。
- `@tailwindcss/oxide`／esbuild install scripts 在受管環境被忽略，但實際 check/test/build 成功。不同 CI 的 pnpm build-script policy 需確認。
- `/play/school/sch01` 與實際 `school-01` 的文件／驗收路徑差異需由產品或規格決定是否需要相容 alias。
- localStorage 仍無 schema migration、多兒童 profile、同步或備份；不屬本任務。
- 沒有 CI workflow 與特定 hosting 設定檔；選定部署平台後再加入最小設定較合理。

## 11. 可部署平台

目前 `dist/public/` 可部署至：

- Cloudflare Pages
- Netlify
- Vercel static deployment
- GitHub Pages（需配合 base path／SPA fallback 策略）
- AWS S3 + CloudFront
- Firebase Hosting
- nginx／Caddy 等靜態伺服器
- 任意可設定「未知路徑回傳 index.html」的平台

部署條件：

- upload `dist/public/`
- 設定 SPA fallback
- 不需要環境密鑰
- 不需要資料庫或 API server

## 12. Static hosting 或 Express

本專案適合純 static hosting，而且這是目前建議方案。

理由：

- 全部遊戲內容在前端 TypeScript bundle。
- 進度在瀏覽器 localStorage。
- 圖片已隨 build 輸出。
- 沒有業務 API、登入或資料庫。
- Manus storage/debug/analytics runtime 已移除。

Express 不是必要產品架構，只是一個方便的 production static server 與 SPA fallback。若目標平台能原生提供 fallback，直接部署 `dist/public/` 即可；若要自架單一 Node process、容器或平台無法設定 fallback，才保留 `dist/index.js` 與 `pnpm start`。

## 結論

本分支已建立可重現安裝、可自動測試、無 Manus production runtime、圖片完全本地化、可使用 static hosting 或內建 Express 的獨立部署基線。未增加任何產品功能，也未變更現有遊戲內容、視覺、人物、素材或五階段流程。

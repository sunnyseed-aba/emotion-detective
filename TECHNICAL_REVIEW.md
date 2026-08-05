# 情緒偵探社：專案技術盤點報告

> 盤點日期：2026-08-05（Asia/Taipei）  
> 受檢專案：`/Users/paichiahui/Downloads/emotion-detective-game/`  
> 盤點原則：未修改任何原始程式碼或架構；僅安裝 `node_modules`、產生 `dist/`，並建立本報告。  
> 本報告以實際程式碼、建置結果與執行驗證為準；專案既有文件僅作交叉參考。

## 0. 執行摘要

本專案是可安裝、可編譯、可建置、可啟動的 React 單頁應用原型。核心五階段教學流程、3 個場景、7 件案件、評分與瀏覽器進度保存均已實作，不只是靜態畫面稿。

技術結論如下：

- TypeScript 型別檢查通過，零錯誤。
- Vite production build 成功，Express 靜態伺服器 bundle 成功。
- production server 實際啟動成功；首頁、場景、案件、遊玩、404 與 JS bundle 均回應 HTTP 200。
- 沒有應用執行所必需的資料庫、後端 API、私有套件或密鑰。
- 圖片目前主要依賴 Manus storage proxy；若離開 Manus 開發環境，必須先執行既有的圖片在地化腳本或提供相同 proxy。
- 缺乏單元測試、整合測試、E2E、CI 與真實目標使用者驗證，不能視為 MVP、Beta 或可正式發布產品。
- 最合理的現況分類是 **Prototype（功能型原型）**，已超過單純 PoC，但尚未完成產品驗證與發布工程。

## 1. 專案驗證

### 1.1 驗證環境

| 項目 | 實際環境／結果 |
| --- | --- |
| 作業系統 | macOS（Apple Silicon） |
| Node.js | 系統 shell 無 `node`；改用 Codex bundled Node v24.14.0 |
| 專案指定 Node | README 建議 >=20；既有驗收文件使用 22.13.0 |
| 套件管理器 | 專案指定 pnpm 10.4.1；系統預設為 pnpm 11.9.0 |
| 安裝方式 | `pnpm@10.4.1 install --frozen-lockfile` |
| 安裝結果 | 成功，619 packages，約 552 MB `node_modules` |
| 型別檢查 | 成功，零錯誤 |
| production build | 成功，1,639 modules transformed |
| production server | 成功，測試埠 4179 |

### 1.2 安裝結果與環境問題

第一次直接執行 `pnpm install --frozen-lockfile` 失敗，原因並非專案程式錯誤，而是本機工具鏈差異：

1. shell 中沒有可直接呼叫的 `node`。
2. 系統 pnpm 11.9.0 對 2026-08-04 才發布的 `@babylonjs/core@9.19.1` 套用 minimum-release-age 供應鏈政策，因此拒絕鎖檔。
3. pnpm 11 警告 `package.json` 中的 `pnpm.patchedDependencies`／`pnpm.overrides` 已改由其他設定位置讀取，與專案使用的 pnpm 10 設定格式不完全相容。

改用 `package.json` 指定的 pnpm 10.4.1 後，frozen lockfile 安裝成功，包含 `wouter@3.7.1` patch。這表示專案本身可重現安裝，但應明確固定 Node/pnpm 工具鏈；不建議目前直接升級 pnpm 11。

安裝過程另出現 `Ignored build scripts: @tailwindcss/oxide, esbuild` 警告，但本次實際型別檢查與 build 都成功，未造成阻斷。

### 1.3 型別與建置

實際執行等同以下 scripts 的本地 binary：

```bash
tsc --noEmit
vite build
esbuild server/index.ts --platform=node --packages=external --bundle --format=esm --outdir=dist
```

結果：

- TypeScript：通過，無診斷錯誤。
- Vite：成功，耗時約 1.29 秒。
- Server bundle：成功，`dist/index.js` 約 788 B。
- 前端主要輸出：CSS 約 120.58 kB（gzip 19.28 kB）、JS 約 391.75 kB（gzip 122.01 kB）。
- `index.html` 約 367.84 kB（gzip 105.70 kB），異常偏大，應確認 Manus runtime/plugin 是否注入大量內容。

建置有以下非阻斷警告：

- `%VITE_ANALYTICS_ENDPOINT%` 未定義。
- `%VITE_ANALYTICS_WEBSITE_ID%` 未定義。
- 未設定時，HTML 中仍保留 `%VITE_ANALYTICS_ENDPOINT%/umami` script，且該 script 無法由 Vite bundle。

因此「不需環境變數即可玩遊戲」基本成立，但「完全乾淨地 production build」不成立。離開 Manus 部署前應移除或條件式加入 analytics script。

### 1.4 啟動與 HTTP 驗證

以 `NODE_ENV=production PORT=4179 node dist/index.js` 啟動成功，結果如下：

| 路徑 | HTTP | Content-Type | 結果 |
| --- | ---: | --- | --- |
| `/` | 200 | `text/html` | 通過 |
| `/scenes` | 200 | `text/html` | SPA fallback 通過 |
| `/scenes/school` | 200 | `text/html` | SPA fallback 通過 |
| `/play/school/sch01` | 200 | `text/html` | SPA fallback 通過 |
| `/404` | 200 | `text/html` | 應用內 404；HTTP 狀態仍為 200 |
| 主要 JS bundle | 200 | `application/javascript` | 通過 |

本次未使用瀏覽器逐一完成七個案件，因此「每個互動分支、視覺位置與 localStorage 寫入」主要依程式碼審查及既有人工驗收文件判定，不等同完整 E2E 驗證。

### 1.5 缺少的檔案、設定或依賴

沒有發現會阻止型別檢查、建置或 server 啟動的缺檔／缺依賴。以下則是部署或產品化前需要補齊／確認的項目：

- 建議提供可被一般工具直接使用的 Node 版本固定方式，並在 CI 驗證（文件宣稱有 `.nvmrc`，接手時亦應確認實檔隨交付存在）。
- 需固定 pnpm 10.4.1，或先完成 pnpm 11 設定遷移與 patch 重驗。
- 缺正式 `.env.example`；目前以 `docs/ENV_GUIDE.md` 代替，對執行非阻斷。
- 缺 analytics 未設定時的安全 fallback／條件式載入。
- 缺 CI 設定、測試設定與部署平台設定檔。
- 若不使用 Manus storage proxy，需執行既有 `scripts/use-local-assets.mjs` 並重新 build；否則圖片在非 Manus dev 環境可能無法顯示。
- Google Fonts 為外部 CDN；離線或受限網路環境需本地化字型。

## 2. 技術架構分析

### 2.1 技術棧

| 類別 | 技術 |
| --- | --- |
| 語言 | TypeScript 5.6、TSX、CSS |
| UI | React 19.2（function components + Hooks） |
| 開發／建置 | Vite 7.1、esbuild |
| CSS | Tailwind CSS 4、CSS custom properties、OKLCH tokens |
| Router | Wouter 3.7.1（附 pnpm patch） |
| UI primitives | shadcn/ui 風格元件、Radix UI、Lucide icons |
| 通知 | Sonner |
| Production serving | Express 4 靜態檔案伺服器 + SPA fallback |
| 資料驗證 | TypeScript 型別；未使用 runtime schema validation |
| 測試 | package 有 Vitest，但目前無測試檔、無 test script |

`package.json` 含大量 Manus/shadcn 樣板依賴。`@babylonjs/core`、axios、framer-motion、zod、streamdown 等未被應用程式引用；recharts、react-hook-form、embla-carousel、next-themes 只被未必實際使用的通用 UI 元件引用。這會增加安裝體積與供應鏈面積。

### 2.2 資料夾架構

```text
emotion-detective-game/
├── client/
│   ├── index.html
│   ├── public/__manus__/       Manus debug/runtime 檔案
│   └── src/
│       ├── pages/              Home、Scenes、SceneCases、Play、NotFound
│       ├── components/game/    遊戲專用呈現元件
│       ├── components/ui/      53 個通用 UI 元件（多數為樣板庫）
│       ├── game/               引擎、型別、計分、進度、內容與場景資料
│       │   └── scenes/         school、home、community
│       ├── contexts/           ThemeContext
│       ├── hooks/              通用 hooks
│       ├── App.tsx             Router 與 app providers
│       └── index.css           tokens、全域樣式、動畫、可及性規則
├── server/index.ts             production 靜態 server
├── shared/                     Manus 樣板常數
├── assets/                     19 個實際交付圖片及原始素材／腳本
├── scripts/                    資產切換與在地化腳本
├── patches/                    wouter patch
├── docs/                       設計、架構、TODO、交接與歷史文件
├── vite.config.ts
├── tsconfig.json
├── package.json
└── pnpm-lock.yaml
```

### 2.3 Component 架構

- `App`：ErrorBoundary、ThemeProvider、TooltipProvider、Toaster、Router。
- Page layer：
  - `Home`：入口與 `ProgressSummary`。
  - `Scenes`：3 個場景選擇。
  - `SceneCases`：指定場景的案件列表及完成狀態。
  - `Play`：取得 scene/case、建立 `useCaseEngine`，依 stage 組合遊戲元件。
  - `NotFound`：路由 fallback。
- Game component layer：`CaseStage`、`StageHeader`、`ChoiceButton`、`AbcBoard`、`FeedbackNote`、`HitBanner`、`ScoreCard`、`ProgressSummary`。
- Domain layer：`engine.ts` 不認識個別案件；案件內容由 `scenes/*.ts` 的 `Case` 資料驅動。

這個分層方向清楚，核心引擎、內容與呈現大致解耦。唯一已知破口是各案件的 `strategyChoices` 重複手寫，沒有引用 `strategies.ts` 共用資料。

### 2.4 Router

Wouter 路由集中在 `client/src/App.tsx`：

| Route | Page |
| --- | --- |
| `/` | Home |
| `/scenes` | Scenes |
| `/scenes/:sceneId` | SceneCases |
| `/play/:sceneId/:caseId` | Play |
| `/404`、其他 | NotFound |

遊戲六階段不是 route，而是 `Play` 內部 state。重新整理會回到案件起點；無法 deep-link 至特定階段。production Express 已正確提供 SPA fallback，但 404 route 回傳 HTTP 200，若有 SEO／監控需求需另處理。

### 2.5 State Management

沒有 Redux/Zustand 等全域 store，分為：

1. `useCaseEngine`：stage、attempts、revealed clues、ABC placement、feedback、ruled-out choices、results。
2. 元件局部 `useState`：選取卡片、動畫、展開狀態等純 UI state。
3. `progress.ts`：跨 session 資料，封裝 localStorage。
4. `ThemeContext`：主題狀態與 `localStorage["theme"]`。

此規模使用 local state 合理。`progress.ts` 作為 persistence adapter 是良好擴充點，但目前資料格式雖帶 `v1` key，沒有 schema validation、migration、multi-user 或衝突處理。

### 2.6 API

應用沒有業務後端 API、資料庫 API 或執行期 AI 呼叫。

開發期 Vite plugins 額外提供：

- `POST /__manus__/logs`：收集 browser console、network、session events 到 `.manus-logs`。
- `/manus-storage/:key`：以 `BUILT_IN_FORGE_API_URL`／`KEY` 取得 signed URL，再 307 redirect。

因此文件所稱「沒有 API」只適用於遊戲業務邏輯；開發環境仍具有 Manus 平台專用 proxy/debug endpoints。正式 build 的 Express server 沒有這兩個 endpoint。

### 2.7 資料儲存

- 遊戲內容：TypeScript 靜態資料，打包進 JS。
- 進度：`localStorage["emotion-detective-progress-v1"]`。
- 主題：`localStorage["theme"]`。
- 圖片：程式目前透過 `/manus-storage/...`；repo 另含本地對應資產。
- 無資料庫、無登入、無雲端同步。

`ProgressRecord` 保存 completedCases、各案件 stageAttempts、emotionStats、stageStats、lastPlayedAt。寫入失敗會被靜默忽略，遊戲仍可進行，但 UI 不會告知進度未保存。

### 2.8 Build 與 Deploy

- 開發：`pnpm dev` → Vite dev server，預設 port 3000。
- 型別：`pnpm check`。
- 建置：Vite 輸出 `dist/public/`，esbuild 輸出 `dist/index.js`。
- 啟動：`NODE_ENV=production node dist/index.js`，以 Express serve static + SPA fallback。
- 也可只部署 `dist/public/` 到 static hosting，但必須設定 fallback 到 `index.html`。
- 非 Manus 部署前需處理圖片在地化、analytics script、Google Fonts 與 Manus runtime/debug 殘留。

## 3. 功能盤點

### 3.1 已完成功能

- 首頁、品牌入口與進度摘要。
- 學校／家庭／社區 3 個場景選擇。
- 每場景案件清單與完成狀態。
- 7 件資料驅動案件。
- 完整線性流程：observe → name → mind → abc → strategy → debrief。
- 必要線索完成條件、選項正誤回饋、錯誤選項排除。
- ABC 先選卡、再選欄位的觸控友善互動。
- 嘗試次數、分數、星等與鼓勵語。
- localStorage 完成案件、階段與情緒統計。
- 清除進度重新開始。
- 大命中區、減少動態偏好、非懲罰式答錯回饋等低刺激規則。
- NotFound、ErrorBoundary、Tooltip 與 toast 基礎設施。

### 3.2 部分完成功能

- 治療師／家長觀察：已記錄 emotionStats/stageStats，首頁也呈現部分摘要，但沒有角色模式、個案管理或完整 dashboard。
- 圖片本地化：本地檔與既有腳本已提供，但程式目前仍指向 Manus storage 路徑。
- 情緒詞庫：8 種已定義，但只有 5 種作為 7 件案件的目標；開心、驕傲、驚訝僅能作為干擾選項。
- 策略庫：已有共用 `strategies.ts`，案件尚未引用。
- `GameMode`：型別有 child/therapist/parent/teacher，介面只有 child。
- production server：可用，但仍含 Manus analytics/runtime 痕跡，未有正式部署設定或 CI。

### 3.3 尚未完成功能

- 治療師／督導專用 dashboard 與個案追蹤。
- 帳號、多人／多兒童 profile、跨裝置同步。
- 正向情緒目標案件。
- 觀察階段「已看／尚缺」線索進度指示。
- 結案階段逐階段表現回顧。
- 真人照片素材模式。
- 音效／語音朗讀與相關設定。
- 動態難度與內容編輯器。
- localStorage schema migration、export/import、備份。
- 自動化測試、CI、監控、錯誤追蹤與正式發布流程。

### 3.4 Placeholder、Demo、Mock Data

- `server/`、`shared/`、`client/src/const.ts`、部分 Manus 元件與設定源自平台樣板；不全是實際產品需求。
- `client/src/components/ui/` 有 53 個通用元件，多數未被產品畫面使用。
- `Map.tsx` 與 Google Maps types 屬樣板能力，未見遊戲路徑使用。
- 所有案件／角色／選項是 hard-coded TypeScript 內容。對 prototype 而言可視為正式 seed content；對可營運產品而言仍是 demo/static content，沒有 CMS 或臨床審核工作流。
- 遠端圖片透過 Manus storage proxy，屬開發平台耦合，而非獨立產品資產服務。
- `spriteReal`／`backdropReal` 是預留欄位，沒有實際素材。

### 3.5 已知限制

- 進度只存在單一瀏覽器，清 cache、換裝置或無痕模式會遺失。
- 沒有多使用者隔離，無法區分不同孩子。
- localStorage 寫入失敗靜默處理，使用者不知道未保存。
- 關卡中途重新整理會回到起點。
- 熱點與人物位置是手工百分比座標；更換圖片必須重校。
- Google Fonts 與 Manus storage 造成網路／平台依賴。
- 題庫規模小，且情緒目標偏負向。
- 沒有任何自動回歸保護，也沒有 ASD 兒童正式可用性／成效驗證證據。

## 4. 程式品質分析

### 4.1 設計良好之處

- domain model 清楚，`Case`、`Emotion`、`StageResult` 等型別是可靠的 single source of truth。
- 引擎資料驅動；新增案件主要修改內容檔，不需改狀態機。
- `progress.ts` 隔離 persistence，沒有讓頁面散落直接 localStorage 操作。
- Router 與 page responsibilities 簡潔，沒有過度架構化。
- seeded shuffle 可重現，避免 render 時選項順序不穩。
- TypeScript strict 通過，基本靜態品質佳。
- 可及性與臨床約束有落實到命中區、reduced motion、答錯回饋與無計時。
- 文件量完整，設計決策、資產製作、架構與 TODO 均有交接資料。

### 4.2 需要改善之處

- 零測試是最大工程風險。核心 scoring、stage transition、progress serialization 最適合先補 unit tests；全流程需 E2E。
- `advanceStage` 同時更新 React state 與 localStorage side effect，且在 state updater 內做外部寫入；React Strict/Concurrent 行為下應避免 updater side effect，未來可改成 reducer + effect 或明確 command layer。
- localStorage JSON 只有 TypeScript cast，缺 runtime validation；資料損壞時雖 fallback，但部分結構錯誤可能在 UI 才爆出。
- 沒有儲存格式 migration；改型別可能使既有進度失效。
- strategy 文案重複，容易產生內容不一致。
- platform-specific plugins、debug collector、analytics、storage proxy 與應用設定混在主 Vite config，增加部署不確定性。
- 樣板依賴與 UI 檔過多，增加供應鏈、安裝時間與維護噪音。
- build HTML 異常偏大；應分析 Manus runtime 注入內容。
- 404 頁 HTTP status 仍為 200；靜態 SPA 常見但需理解監控／SEO 影響。

### 4.3 建議保留

- `client/src/game/types.ts` 的資料模型。
- `engine.ts` 的資料驅動階段設計（重構副作用即可，毋須推翻）。
- `scoring.ts`、`pronoun.ts`、`emotions.ts` 等純 domain utilities。
- `progress.ts` 的 adapter 邊界。
- `components/game/` 的產品專用元件。
- 集中式 Router 與 page 結構。
- `index.css` 的 design tokens、低刺激與 reduced-motion 規範。
- 現有場景／案件資料，可作後續內容審核與測試基線。
- docs 中的臨床／互動設計決策。

### 4.4 建議重構

優先是小範圍、可測試的重構，不建議重寫：

1. 把 engine 的 pure transition／score calculation 與 React/localStorage side effects 分離。
2. `strategyChoices` 改用 strategy ID 引用共用庫。
3. 為 progress schema 加 runtime validator、version migration、storage failure result。
4. 清理未使用 UI 元件與依賴，再依實際需要加入。
5. 將 Manus-only Vite plugins 與一般 production config 分開或條件式啟用。
6. 對 routes 做 lazy loading（是否值得取決於 bundle audit）。

### 4.5 重複程式碼

- 各案件 strategyChoices 及 feedback 重複，是已確認的 domain duplication。
- `Scenes` 與 `SceneCases` 都自行在 effect 中載入完成狀態，未來可抽成小 hook，但目前重複量不大。
- 大量 shadcn UI 元件是樣板複製，不是產品邏輯重複，但形成維護庫存。
- 場景資料中選項結構重複屬資料驅動內容的合理重複；應以內容 authoring/validation 工具改善，而非抽象到難以編輯。

### 4.6 技術債、效能與維護風險

| 風險 | 程度 | 說明 |
| --- | --- | --- |
| 無自動化測試 | 高 | 核心流程、評分、儲存與內容修改無回歸保護 |
| 未做目標族群驗證 | 高 | 教學與 UX 成效尚屬假設，不能以技術完成代替產品有效性 |
| Manus 平台耦合 | 高 | 圖片 proxy、analytics、runtime/debug plugin 影響獨立部署 |
| 兒童資料治理未定 | 高 | 一旦加入同步／帳號，需先決定同意、保存、刪除與權限策略 |
| progress 無 migration | 中高 | 未來 schema 變更可能造成既有資料遺失或 UI 例外 |
| 手工資產座標 | 中 | 更換素材成本高且容易產生多裝置視覺偏移 |
| 未使用依賴 | 中 | 552 MB 安裝體積、供應鏈與升級成本不必要地擴大 |
| 單一前端 chunk／大 HTML | 中 | 目前 391.75 kB JS、367.84 kB HTML；在低階平板與弱網應實測 |
| localStorage 單裝置 | 中 | 可接受於原型，不適合正式治療追蹤產品 |
| Google Fonts CDN | 低至中 | 離線／校園網路可能載入失敗，亦涉及第三方請求 |

## 5. 專案現況評估

### 判定：Prototype（功能型原型）

不是單純 PoC，因為它已有完整且可操作的端到端主流程、可重用引擎、7 件內容、進度與 production build；技術可行性已被實作證明。

但尚不能稱為 MVP，理由是：

- 尚未有真實目標使用者與臨床可用性驗證。
- 關鍵引導功能仍缺：線索進度、階段回顧、治療師視圖。
- 無自動化測試、CI、正式部署驗證與監控。
- 資產仍耦合 Manus，production build 有 analytics 警告。
- 沒有多兒童／跨裝置資料能力，正式應用所需的資料治理也未決定。
- 內容僅 7 件且目標情緒偏負向，尚不足以證明最小可行產品的教學價值與持續使用價值。

因此最精確的描述是：**已完成核心互動概念的高完成度 Prototype，具備演進成 MVP 的良好程式基礎。**

## 6. 下一步建議

### 6.1 優先改善事項

1. 先進行臨床／目標使用者可用性測試，驗證五階段流程、用語、刺激量、命中區與提示是否適合 6–12 歲不同能力兒童。
2. 補測試基線：engine、scoring、progress unit tests；每個 stage 至少一條 E2E happy path 與錯答重試路徑。
3. 完成脫離 Manus 的可重現部署：圖片在地化、移除 analytics/debug/runtime 殘留、固定 Node/pnpm、建立 CI。
4. 補線索進度與結案階段回顧，因資料已存在、產品價值高、改動面相對小。
5. 依臨床回饋新增正向情緒案件，而不是只按目前 TODO 擴充數量。
6. 再決定治療師 dashboard；先定義要回答的臨床問題，避免只把現有統計全部畫成圖。

### 6.2 建議開發順序

```text
驗證教學流程與產品假設
→ 建立測試／CI 安全網
→ 清除 Manus 部署耦合並完成獨立 staging
→ 修補線索進度與階段回顧
→ 補正向情緒內容並做內容審核
→ 定義治療師／家長工作流
→ 決定是否需要帳號、後端與跨裝置同步
→ 才進入 MVP 封版與 Beta 測試
```

### 6.3 需要產品負責人決定的問題

- 第一版的主要使用者是孩子自主使用，還是治療師／家長陪同？
- MVP 成功指標是完成率、提示次數、情緒命名正確率、心智推理表現，還是實際生活類化？
- 年齡 6–12 與 ASD／發展遲緩跨度很大，是否需要能力分級、閱讀輔助或不同語言難度？
- 目前 7 件案件是否經臨床專業者審稿？誰負責內容批准與版本治理？
- 是否必須離線使用？若是，圖片與字型皆需本地化，並考慮 PWA。
- 是否需要音效／朗讀？若需要，預設狀態、音量、語速與感官敏感規範為何？
- 是否真的需要帳號／跨裝置？若需要，誰是帳號主體、監護人如何同意、資料保存多久？
- 治療師 dashboard 最優先需要支援哪三個決策，而不是要顯示哪些圖表？
- 真人照片方案是否符合預算、授權、肖像權與目標兒童感官需求？

### 6.4 需要技術確認的問題

- 正式目標平台：一般網站、校內網路、平板 kiosk、PWA，或 Manus 平台？
- 目標裝置與最低瀏覽器／螢幕／效能規格為何？
- 是否要求離線、資料匯出、備份、跨裝置與多兒童 profile？
- 若加入後端，資料所在地、加密、權限、稽核、刪除與法規需求為何？
- 是否保留 Express，或改成純 static hosting？
- 是否允許第三方 Google Fonts／analytics request？
- pnpm 是否固定 10.4.1，或安排 pnpm 11 migration？
- Wouter patch 的實際必要原因、覆蓋行為與升級退出條件需建立測試紀錄。
- Manus runtime 導致的 HTML 體積需用 bundle/report 工具確認。
- 19 個圖片在各 viewport 的座標、載入速度、格式與畫質是否達到目標平板要求？

## 7. 最終結論

本專案的核心程式基礎比一般畫面型 demo 更完整：架構方向合理、domain 與 UI 大致分離、型別檢查與 build 均通過，現有程式多數值得保留。現階段主要風險不是「跑不起來」，而是「尚未證明對目標兒童有效」、缺少自動化品質保障，以及仍有 Manus 平台耦合。

建議不要立即重寫架構。先建立測試與獨立部署基線，再用真實使用者驗證決定產品方向；之後針對 engine side effects、progress schema、strategy duplication 與樣板依賴做小步重構，成本與風險最低。

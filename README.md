# 情緒偵探社（Emotion Detective Agency）

> 一款為 6–12 歲自閉症光譜與發展遲緩兒童設計的**心智理論（Theory of Mind）互動學習遊戲**。孩子扮演「情緒偵探」，透過五階段推理流程，學習從情境線索推論他人的情緒與想法。

本文件是專案的技術入口。若你是接手本專案的工程師，建議閱讀順序為：`README.md`（本檔）→ `docs/PROJECT_BRIEF.md`（為什麼做、教學理念）→ `docs/ARCHITECTURE.md`（程式怎麼組成）→ `docs/GAME_DESIGN.md`（內容怎麼設計）→ `docs/DECISIONS.md`（歷史決策與踩過的坑）→ `docs/TODO.md`（接下來做什麼）。

移交完整性的驗收結果、資源盤點數字與已知的非阻斷性事項，記錄於 `docs/HANDOFF_CHECKLIST.md`。

---

## 一、專案介紹

情緒偵探社是一個純前端的單頁應用程式（SPA），不需要後端伺服器、不需要資料庫、不需要註冊登入。所有遊戲內容以 TypeScript 資料檔的形式內建於程式碼中，孩子的學習進度儲存在瀏覽器的 `localStorage`。

目前版本包含 **3 個場景、7 件案件**，涵蓋傷心、生氣、害怕、尷尬、孤單五種情緒的推理練習。每一件案件都是一個完整的五階段關卡。

### 專案目的

自閉症光譜兒童在「心智理論」上普遍存在困難，也就是難以理解**別人腦中所想的事情，可能和自己所知道的不一樣**。傳統的情緒教學卡片往往只做到「認得表情」這一層，無法訓練「從情境推論心理狀態」的能力。

本專案的核心設計，是把應用行為分析（ABA）常用的 **ABC 行為分析框架**（Antecedent 前因、Behavior 行為、Consequence 後果）與心智理論的階層能力，包裝成孩子可以理解的「辦案」流程。孩子不是在做選擇題，而是在收集線索、建立假設、驗證推論。

### 設計約束（重要）

這個專案的視覺與互動風格是**臨床需求驅動**的，不是美術偏好。接手時請務必維持以下原則，詳細理由見 `docs/DECISIONS.md`：

| 原則 | 具體做法 |
| --- | --- |
| 低刺激（low-stimulation） | 低飽和色票、無霓虹、無發光、無漸層轟炸、無音效 |
| 答錯不懲罰 | 答錯**不使用紅色**、不震動、不出現叉叉，改為卡片輕輕退回原位並給提示 |
| 無時間壓力 | 全程沒有計時器、沒有倒數 |
| 大命中區 | 所有可點擊元素最小 44px，選項為整塊卡片而非小圓鈕 |
| 寫實而非卡通 | 人物採半擬真畫風、正常頭身比、依 FACS 真實臉部肌肉繪製表情 |
| 尊重動態偏好 | `prefers-reduced-motion` 下全域關閉非必要動畫 |

---

## 二、功能介紹

### 已實作的功能

**首頁（`/`）** 顯示品牌標誌、遊戲說明，以及「偵探手冊」進度側欄。側欄讀取 `localStorage`，呈現已破案數量、平均得分與各情緒類別的練習狀況。

**場景選擇（`/scenes`）** 以三張場景封面圖呈現學校、家庭、社區，每個場景附一句情境定調文案。

**案件清單（`/scenes/:sceneId`）** 列出該場景下的所有案件，每筆包含案件縮圖、標題、目標情緒標籤與破案狀態。

**關卡遊玩（`/play/:sceneId/:caseId`）** 這是遊戲主體，包含固定的六個畫面階段：

| 階段 | 內部代號 | 孩子要做的事 |
| --- | --- | --- |
| 觀察線索 | `observe` | 在場景圖上點擊編號熱點（1、2、3），逐一觀察關鍵物件與人物細節 |
| 命名情緒 | `name` | 從情緒詞選項中選出當事人的感受 |
| 讀心推理 | `mind` | 選出當事人「心裡相信的那件事」——這是心智理論的核心階段 |
| 前因後果 | `abc` | 把事件卡片拖放歸位到 A（前因）／B（行為）／C（後果）三欄橫式表格 |
| 想辦法 | `strategy` | 從情緒調節、換個想法、實際行動三類策略中選擇合適的做法 |
| 結案報告 | `debrief` | 顯示評分（百分比與星等）、鼓勵語、以及本案的教學重點回顧 |

**進度與評分** 每階段首次答對得滿分，重試會扣分但不會歸零。結案時計算總分與星等，搭配鼓勵語庫給出正向回饋。進度與分數寫入 `localStorage`。

### 明確尚未實作的功能

- 治療師／督導儀表板（`docs/TODO.md` 列為第一優先）
- 帳號系統與跨裝置同步（目前僅 localStorage）
- 音效與語音朗讀
- 驕傲、驚訝兩種情緒的案件（情緒詞庫已定義，但無對應案件）
- 擬真照片版視覺（資料模型已預留 `spriteReal` / `backdropReal` 欄位）

---

## 三、技術架構

### 使用框架與核心套件

| 類別 | 技術 | 版本 | 說明 |
| --- | --- | --- | --- |
| UI 框架 | React | 19 | 函式元件 + Hooks，無 class component |
| 語言 | TypeScript | 5.x | `strict` 模式開啟 |
| 建置工具 | Vite | 7.1.9 | dev server 與生產建置 |
| 樣式 | Tailwind CSS | 4 | 設計 token 定義於 `client/src/index.css` 的 `@theme` |
| 元件庫 | shadcn/ui + Radix UI | — | 位於 `client/src/components/ui/`，未全部使用 |
| 路由 | Wouter | 3.7.1 | 輕量 client-side router（含一個 patch，見下方注意事項） |
| 圖示 | lucide-react | — | 線性圖示 |
| 動畫 | 原生 CSS | — | keyframes 與 transition，**未使用** Framer Motion |
| Toast | sonner | — | 提示訊息 |
| 狀態管理 | React `useState` / `useReducer` + 自訂 Hook | — | **無** Redux／Zustand／Context 全域 store |

完整依賴清單請直接看 `package.json`。所有依賴皆為 npm 公開套件，無私有 registry。

### 字型

透過 Google Fonts CDN 載入於 `client/index.html`，未內嵌字型檔（避免授權與體積問題）：

| 字型 | 用途 |
| --- | --- |
| Zen Maru Gothic | 標題與品牌（圓潤、親和） |
| Noto Sans TC | 正文繁體中文 |
| Courier Prime | 案件編號、檔案標籤（打字機感，強化「偵探檔案」意象） |

若目標部署環境無法連外，需自行下載字型檔改為本地載入（三者皆為 OFL 授權，可合法散布）。

### 專案不含的東西

這點對接手者很重要，可以省下搜尋時間：

- **沒有後端**。`server/` 與 `shared/` 目錄僅為 Manus WebDev 模板的相容性佔位檔，內容是 placeholder 型別，可安全忽略或刪除。
- **沒有資料庫**。無 SQLite／Supabase／Firebase／Prisma／schema migration。資料模型即 TypeScript 型別，定義在 `client/src/game/types.ts`。
- **沒有對外 API 呼叫**。應用執行期間不發出任何網路請求（除 Google Fonts CDN 與圖片 CDN）。
- **沒有執行期 AI**。專案**曾在開發期**使用 AI 生成圖片，但這些是離線的資產製作流程，成品是靜態圖檔。執行期完全不呼叫 LLM。所有開發期使用的 Prompt 已完整整理於 `docs/AI_PROMPTS.md`。
- **沒有音效檔**。這是刻意的低刺激設計決策。
- **沒有環境變數需求**。所有變數皆為選用（僅 Manus 平台的分析與品牌設定），本地開發完全不需設定即可跑起來。完整清單與說明見 `docs/ENV_GUIDE.md`。

---

## 四、安裝方式

### 環境需求

| 項目 | 版本 |
| --- | --- |
| Node.js | >= 20（開發環境實測為 22.13.0） |
| 套件管理器 | pnpm（專案附 `pnpm-lock.yaml`；亦可用 npm，但鎖檔會失效） |

### 安裝步驟

```bash
# 1. 安裝 pnpm（若尚未安裝）
npm install -g pnpm

# 2. 安裝依賴
pnpm install
```

> **環境變數**：本專案不需要任何環境變數即可執行。若仍想建立 `.env`，內容範例與完整變數清單見 `docs/ENV_GUIDE.md`。
> （原專案在 Manus 平台開發，平台保護 `.env` 系列檔案不可寫入，因此範本以文件形式提供。）

> **注意：`patches/wouter@3.7.1.patch`**
> 專案透過 pnpm 的 `patchedDependencies` 對 wouter 打了一個補丁。使用 `pnpm install` 會自動套用；若改用 npm 或 yarn，需自行以 `patch-package` 等工具套用該補丁，否則路由行為可能異常。

---

## 五、啟動方式

```bash
pnpm dev
```

預設在 `http://localhost:3000` 啟動 Vite dev server，支援 HMR。埠號與 host 設定見 `vite.config.ts`。

### 型別檢查

```bash
npx tsc --noEmit
```

目前狀態為零錯誤。修改後請維持這個狀態。

---

## 六、Build 方法

```bash
pnpm build
```

輸出為純靜態檔案。實際輸出目錄請以 `vite.config.ts` 的 `build.outDir` 為準（模板預設為 `dist/`）。建置產物不含任何伺服器端程式碼，可直接由任何靜態主機服務。

本地預覽建置結果：

```bash
pnpm preview
```

---

## 七、Deploy 方法

### 重要前置步驟：圖片資產在地化

目前程式碼中的圖片路徑格式為 `/manus-storage/<檔名>`，這是 Manus WebDev 平台的 CDN 路徑。**若要部署到 Manus 平台以外的任何環境（Vercel、Netlify、Cloudflare Pages、自架 nginx 等），必須先執行一次在地化腳本**：

```bash
# 先預覽會做哪些變更
node scripts/use-local-assets.mjs --dry

# 實際執行
node scripts/use-local-assets.mjs
```

這個腳本會：

1. 把 `assets/images/**` 複製到 `client/public/game-assets/**`
2. 把 `client/src` 內所有 `/manus-storage/xxx` 字串改寫為 `/game-assets/<類別>/xxx`

執行後圖片即隨專案一起部署，不再依賴外部 CDN。**這是移交後第一件該做的事**，否則換環境後畫面會全部破圖。

### 部署到靜態主機

```bash
node scripts/use-local-assets.mjs   # 一次性
pnpm build
# 將建置輸出目錄上傳至靜態主機
```

因為是 SPA + client-side routing，主機端需設定 **SPA fallback**（所有未命中的路徑回傳 `index.html`），否則直接訪問 `/play/school/school-01` 會 404。

| 平台 | 設定方式 |
| --- | --- |
| Vercel | 自動偵測，或加 `vercel.json` 的 rewrites |
| Netlify | `_redirects` 加入 `/* /index.html 200` |
| Cloudflare Pages | 自動處理 SPA |
| nginx | `try_files $uri $uri/ /index.html;` |

### 部署到 Manus WebDev 平台

若繼續在原平台開發，**不需**執行在地化腳本（CDN 路徑本就有效），在管理介面建立 checkpoint 後點選 Publish 即可。

---

## 八、專案結構速覽

```
emotion-detective-game/
├── README.md                   ← 本檔
├── docs/                       ← 所有移交文件
│   ├── PROJECT_BRIEF.md        教學理念、目標使用者、能力架構、Roadmap
│   ├── ARCHITECTURE.md         資料夾／元件／狀態／資料流／路由
│   ├── GAME_DESIGN.md          角色、案件、題型、回饋、難度、計分
│   ├── AI_PROMPTS.md           所有開發期使用的圖片生成 Prompt
│   ├── DECISIONS.md            設計決策紀錄、放棄的方案、踩過的坑
│   ├── ENV_GUIDE.md            環境變數說明（取代 .env.example）
│   ├── HANDOFF_CHECKLIST.md    移交驗收結果與資源盤點
│   ├── TODO.md                 未完成功能、已知 bug、優先順序
│   ├── CHANGELOG.md            開發歷程紀錄
│   └── history/                開發期 22 份原始工作筆記（含索引）
├── assets/                     ← 所有原始資源（見 ASSET_MANIFEST.md）
│   ├── images/{scenes,characters,brand}/
│   ├── icons/                  未使用但保留
│   ├── audio/ animations/ videos/   空目錄，說明見 manifest
│   ├── source/originals/       生成原圖
│   ├── source/scripts/         去背 Python 腳本
│   └── ASSET_MANIFEST.md       每張圖的來源與用途對照
├── client/
│   ├── index.html              字型載入、meta
│   └── src/
│       ├── game/               ★ 遊戲邏輯與內容（核心）
│       ├── components/game/    ★ 遊戲專用 UI 元件
│       ├── components/ui/      shadcn/ui 元件庫
│       ├── pages/              頁面元件
│       ├── index.css           設計 token、字型、動畫、低刺激規則
│       └── App.tsx             路由定義
├── scripts/
│   ├── use-local-assets.mjs    ★ 圖片在地化（部署前必跑）
│   └── swap_v3_assets.mjs      歷史用途的資產替換腳本
├── server/ shared/             模板佔位檔，可忽略
├── package.json  pnpm-lock.yaml  .nvmrc
├── vite.config.ts  tsconfig.json  components.json
└── patches/wouter@3.7.1.patch   pnpm 自動套用
```

加 ★ 的是接手後最常改動的目錄。

---

## 九、常見接手情境

| 我想… | 去哪裡改 |
| --- | --- |
| 新增一件案件 | 在 `client/src/game/scenes/` 對應場景檔的 `cases` 陣列新增一筆，引擎與 UI 不需改。教學見 `docs/GAME_DESIGN.md` 第九節，型別定義見 `client/src/game/types.ts` |
| 新增一個場景（如醫院） | 新建 `scenes/hospital.ts`，在 `scenes/index.ts` 匯入並加入 `SCENES` 陣列 |
| 調整關卡流程 | `client/src/game/engine.ts`（五階段狀態機） |
| 調整計分或鼓勵語 | `client/src/game/scoring.ts` |
| 換配色或字型 | `client/src/index.css` 的 `@theme` 區塊 |
| 調整人物在場景中的位置 | 案件資料的 `placement`（`x`、`y`、`scale`、`flip`），規則見 `docs/ARCHITECTURE.md` |
| 新增情緒詞 | `client/src/game/emotions.ts` |
| 新增策略選項 | `client/src/game/strategies.ts` |

---

## 十、授權與資產來源

所有圖片資產皆由 AI 影像生成模型於本專案開發期產出，生成 Prompt 完整保存於 `docs/AI_PROMPTS.md`，去背與後處理腳本保存於 `assets/source/scripts/`，**不含任何第三方版權素材**。字型透過 Google Fonts 載入，三者皆為 SIL Open Font License。

程式碼授權未指定，請依接手方組織政策決定。

---

*文件作者：Manus AI ｜ 最後更新：2026-08-05*

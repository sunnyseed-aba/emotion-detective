# 系統架構（ARCHITECTURE）

> 本文件說明程式如何組成、狀態如何流動、關卡如何驅動。閱讀本文件前建議先看 `../README.md` 的技術架構章節。資料型別以 `client/src/game/types.ts` 為單一真實來源，逐欄位說明與「新增一件案件」教學見 `GAME_DESIGN.md` 第九節。

---

## 一、架構總覽

情緒偵探社是一個**純客戶端的資料驅動應用**。整個系統可以用一句話描述：

> 一個通用的五階段關卡引擎（`engine.ts`），讀取宣告式的案件資料（`scenes/*.ts`），驅動一組無狀態的展示元件（`components/game/`），並把結果寫入抽象化的進度層（`progress.ts`）。

這個架構的關鍵性質是**內容與邏輯完全分離**。引擎不知道任何案件的具體內容，案件資料不含任何邏輯。因此新增內容不需要改程式，這是專案最重要的架構決策。

```
┌─────────────────────────────────────────────────────────┐
│  頁面層 pages/                                           │
│  Home · Scenes · SceneCases · Play                      │
└────────────────────────┬────────────────────────────────┘
                         │ 呼叫
┌────────────────────────▼────────────────────────────────┐
│  邏輯層 game/                                            │
│  engine.ts   五階段狀態機（useCaseEngine Hook）          │
│  scoring.ts  計分與鼓勵語                                │
│  pronoun.ts  代名詞解析                                  │
│  progress.ts 進度持久化（介面已抽象）                     │
└──────┬──────────────────────────────┬───────────────────┘
       │ 讀取                          │ 渲染
┌──────▼──────────────────┐  ┌────────▼───────────────────┐
│  內容層 game/scenes/     │  │  展示層 components/game/    │
│  school.ts home.ts       │  │  CaseStage  AbcBoard        │
│  community.ts index.ts   │  │  ChoiceButton FeedbackNote  │
│  emotions.ts             │  │  StageHeader  HitBanner     │
│  strategies.ts           │  │  ScoreCard  ProgressSummary │
│  types.ts assets.ts      │  └─────────────────────────────┘
└─────────────────────────┘
```

---

## 二、專案資料夾架構

```
emotion-detective-game/
│
├── client/                          前端主體（Vite root）
│   ├── index.html                   Google Fonts 載入、meta、favicon
│   ├── public/                      僅放小型設定檔
│   │   ├── favicon.ico
│   │   └── __manus__/               Manus 平台注入的除錯收集器，可忽略
│   └── src/
│       ├── main.tsx                 React 入口，掛載 App
│       ├── App.tsx                  路由定義 + ThemeProvider + ErrorBoundary
│       ├── index.css                ★ 設計 token、字型、動畫 keyframes、低刺激規則
│       │
│       ├── game/                    ★★ 遊戲邏輯與內容（本專案核心）
│       │   ├── types.ts             所有資料型別定義（單一真實來源）
│       │   ├── engine.ts            五階段狀態機 useCaseEngine
│       │   ├── scoring.ts           計分、星等、鼓勵語庫
│       │   ├── pronoun.ts           他／她代名詞解析
│       │   ├── progress.ts          localStorage 進度層（介面抽象）
│       │   ├── emotions.ts          8 種情緒詞庫與語意化色彩
│       │   ├── strategies.ts        策略庫（regulate / reframe / act）
│       │   ├── assets.ts            品牌資產常數（LOGO_URL）
│       │   └── scenes/              案件內容資料
│       │       ├── index.ts         場景註冊表 SCENES / getScene / getCase / ALL_CASES
│       │       ├── school.ts        學校場景 3 件案件
│       │       ├── home.ts          家庭場景 2 件案件
│       │       └── community.ts     社區場景 2 件案件
│       │
│       ├── components/
│       │   ├── game/                ★ 遊戲專用元件
│       │   │   ├── CaseStage.tsx        舞台：背景 + 角色定位 + 熱點
│       │   │   ├── AbcBoard.tsx         ABC 橫式表格（點選歸位）
│       │   │   ├── ChoiceButton.tsx     選項卡片（含答對／退回效果）
│       │   │   ├── FeedbackNote.tsx     便條紙式提示
│       │   │   ├── StageHeader.tsx      五階段進度列
│       │   │   ├── HitBanner.tsx        答對命中橫幅
│       │   │   ├── ScoreCard.tsx        結案評分卡
│       │   │   └── ProgressSummary.tsx  偵探手冊進度側欄
│       │   ├── ui/                  shadcn/ui 元件庫（未全部使用）
│       │   ├── ErrorBoundary.tsx    模板提供
│       │   ├── ManusDialog.tsx      模板提供
│       │   └── Map.tsx              模板提供，本專案未使用
│       │
│       ├── pages/
│       │   ├── Home.tsx             首頁
│       │   ├── Scenes.tsx           場景選擇
│       │   ├── SceneCases.tsx       案件清單
│       │   ├── Play.tsx             ★ 關卡主頁（六階段全在此）
│       │   └── NotFound.tsx         404
│       │
│       ├── contexts/ThemeContext.tsx    主題（模板提供）
│       ├── hooks/                       模板提供的通用 Hook
│       └── lib/utils.ts                 cn() 等工具
│
├── docs/                            ★ 本次移交文件（含 history/ 開發期原始筆記）
├── assets/                          ★ 所有原始資源（見 ASSET_MANIFEST.md）
├── scripts/
│   ├── use-local-assets.mjs         圖片在地化（部署前必跑）
│   └── swap_v3_assets.mjs           歷史資產替換腳本
├── server/ shared/                  模板佔位檔，本專案未使用
├── patches/wouter@3.7.1.patch       pnpm 自動套用
└── package.json  vite.config.ts  tsconfig.json  components.json  .nvmrc
```

---

## 三、Router

使用 **Wouter** 做 client-side routing，路由定義集中在 `client/src/App.tsx`。

| 路徑 | 元件 | 說明 |
| --- | --- | --- |
| `/` | `Home` | 首頁 + 偵探手冊進度側欄 |
| `/scenes` | `Scenes` | 三個場景的選擇頁 |
| `/scenes/:sceneId` | `SceneCases` | 指定場景的案件清單 |
| `/play/:sceneId/:caseId` | `Play` | 關卡遊玩，六階段皆在此路由內切換 |
| 其他 | `NotFound` | 404 |

### 兩個關於路由的重要事實

**結案報告不是獨立路由。** 它是 `Play` 頁面內 `stage === "debrief"` 的一個階段。這是刻意的設計：階段推進不改變 URL，因此重新整理頁面會回到關卡開頭，避免孩子誤觸瀏覽器返回鍵造成半途狀態的混亂。代價是無法直接分享某個階段的連結，目前判斷不需要。

**部署需要 SPA fallback。** 因為 `/play/school/school-01` 在伺服器上不存在對應檔案，靜態主機必須設定所有未命中路徑回傳 `index.html`。設定方式見 `../README.md` 的 Deploy 章節。

---

## 四、State 管理方式

本專案**沒有全域狀態管理套件**。沒有 Redux、沒有 Zustand、沒有跨頁面的 Context store。這是根據專案規模做的判斷：狀態的生命週期天然地被關卡邊界切開，不需要全域 store。

狀態分成三個層次：

### 第一層：關卡內狀態（存在於 `useCaseEngine`）

這是最主要的狀態。`engine.ts` 匯出一個自訂 Hook `useCaseEngine`，它持有單一件案件從開始到結案的全部狀態：目前階段、各階段的作答紀錄、嘗試次數、已解鎖的線索、ABC 卡片的歸位狀況、累積得分。

這個 Hook 的生命週期與 `Play` 元件相同。離開關卡即銷毀，因此不需要清理邏輯，也不會有跨關卡的狀態污染。

### 第二層：元件內的 UI 狀態（各元件的 `useState`）

純粹的展示狀態，不影響遊戲邏輯，例如：`Play` 內的 `openedProps`（已展開哪些熱點）、`AbcBoard` 內目前選取的卡片、`ChoiceButton` 的 `nudgeKey`（觸發退回動畫的計數器）、`HitBanner` 的顯示狀態。

這些狀態刻意不上提到引擎，避免引擎與視覺實作耦合。

### 第三層：跨 session 的持久狀態（`progress.ts` + localStorage）

孩子的長期進度。**所有讀寫都必須經過 `progress.ts` 匯出的函式**，元件與頁面不直接呼叫 `localStorage`。

這個抽象是刻意保留的擴充點：未來要換成後端 API 或 IndexedDB，只需替換 `progress.ts` 的實作，上層完全不需修改。若接手時繞過這一層直接寫 `localStorage`，會破壞這個擴充性。

---

## 五、關卡流程與引擎

### 階段機

`engine.ts` 實作一個線性推進的狀態機。階段代號固定為六個：

```
observe → name → mind → abc → strategy → debrief
```

推進規則是**只進不退**：每個階段有明確的完成條件，滿足後才前進，且不提供回到上一階段的操作。這個約束對應教學設計上的累積性（見 `PROJECT_BRIEF.md` 的能力架構），也避免孩子在階段間來回跳躍而失去推理的連續感。

| 階段 | 完成條件 |
| --- | --- |
| `observe` | 所有必查線索皆已點開 |
| `name` | 選中正確的情緒選項 |
| `mind` | 選中正確的信念選項 |
| `abc` | 所有事件卡片皆正確歸位到 A／B／C |
| `strategy` | 選中合適的策略選項 |
| `debrief` | 終態，寫入進度 |

### 答錯的處理

答錯**不推進階段、不重置狀態、不限制次數**。引擎做三件事：增加該階段的 `attempts` 計數、回傳該選項對應的提示文字、遞增一個 `nudgeKey`（供 UI 觸發「輕輕退回」動畫）。

`attempts` 計數同時是計分的依據，也是未來治療師儀表板的核心資料——它記錄了孩子在哪一層卡住。

### ABC 階段的特殊處理

ABC 階段的欄位中介資料由引擎匯出的 `ABC_SLOT_META` 提供（A／B／C 三欄的標題與說明文字）。互動模型是**先選卡片、再選欄位**，而非 HTML5 拖放。

選擇這個互動模型的理由是可及性：拖放對精細動作能力較弱的孩子門檻較高，且在觸控裝置上容易誤觸。點兩下的模型命中區大、可取消、可反覆調整。

---

## 六、資料流

### 進入關卡的資料流

```
URL /play/school/school-01
      │
      ▼
Play.tsx 取出 params
      │
      ▼
getCase(sceneId, caseId)  ← scenes/index.ts
      │
      ▼ 傳入 Case 物件
useCaseEngine(caseData)   ← engine.ts
      │
      ▼ 回傳 { stage, ...狀態, ...操作函式 }
Play.tsx 依 stage 渲染對應階段
      │
      ▼ 傳入 props（純資料）
CaseStage / ChoiceButton / AbcBoard / ...
```

展示元件全部是**受控的無狀態元件**（除純 UI 狀態外），不直接讀取案件資料檔，也不呼叫引擎。所有資料由 `Play` 以 props 傳入。這讓元件容易單獨測試與重用。

### 作答的資料流

```
使用者點擊選項
      │
      ▼
ChoiceButton onClick
      │
      ▼
Play 呼叫引擎的操作函式（如 answerEmotion(optionId)）
      │
      ├─ 正確 → 引擎推進 stage、加分 → 重新渲染下一階段
      │           Play 顯示 HitBanner + 鼓勵語
      │
      └─ 錯誤 → 引擎 attempts++、回傳 hint、nudgeKey++
                  Play 顯示 FeedbackNote，ChoiceButton 播放退回動畫
```

### 結案的資料流

```
最後階段完成
      │
      ▼
引擎進入 debrief，計算最終成績
      │
      ▼
scoring.ts 依 attempts 計算百分比、星等、選鼓勵語
      │
      ▼
progress.ts 寫入 localStorage
      │
      ▼
ScoreCard 呈現；下次進首頁時 ProgressSummary 讀取並顯示
```

---

## 七、API Flow

**本專案執行期不呼叫任何 API。**

這一點值得明確寫下來，避免接手者花時間尋找不存在的 API 層。應用執行期間唯一的外部網路請求是：

| 請求 | 用途 | 是否可移除 |
| --- | --- | --- |
| Google Fonts CDN | 載入三款字型 | 可，改為本地字型檔即可 |
| 圖片 CDN（`/manus-storage/`） | 載入場景與角色圖 | 可，執行 `scripts/use-local-assets.mjs` 改為本地 |

執行以上兩項在地化後，本應用可**完全離線運作**，這對治療室網路不穩的使用情境是有價值的性質。

### 開發期曾使用的 AI

專案在開發期使用 AI 影像生成模型製作視覺資產，但這是**離線的一次性資產製作流程**，成品是靜態圖檔，不在應用執行期發生。所有 Prompt 與後處理腳本已完整保存於 `AI_PROMPTS.md` 與 `assets/source/scripts/`。

### 若未來要加後端

目前的架構已為此預留單一接點：**替換 `progress.ts` 的實作**。它的函式介面（讀取進度、寫入案件成績、查詢統計）是刻意抽象的，改為呼叫 REST 或 tRPC 端點不影響任何其他檔案。

若在 Manus WebDev 平台上開發，可用 `webdev_add_feature` 升級為 `web-db-user` 全端專案以取得後端、資料庫與使用者系統。

---

## 八、Component 架構

### 頁面元件

| 元件 | 職責 | 主要依賴 |
| --- | --- | --- |
| `Home` | 品牌、說明、進度側欄 | `ProgressSummary`、`assets.ts` |
| `Scenes` | 三場景選擇 | `scenes/index.ts` 的 `SCENES` |
| `SceneCases` | 案件清單與縮圖 | `getScene`、`progress.ts` |
| `Play` | ★ 六階段編排與所有階段的 UI 組裝 | `useCaseEngine`、全部 game 元件 |

`Play.tsx` 是專案中最大的元件，因為六個階段的畫面都在其中依 `stage` 分支渲染。這個設計讓階段轉換的邏輯集中在一處易於追蹤，代價是檔案較長。若要重構，建議拆成六個 stage 子元件，但**不要**把引擎狀態拆散到各子元件。

### 遊戲元件

| 元件 | 職責 | 關鍵 props |
| --- | --- | --- |
| `CaseStage` | 渲染背景圖 + 角色定位 + 可點熱點 | `backdrop`、`characters`、`props`、`openedProps`、`onPropClick` |
| `AbcBoard` | ABC 橫式表格，先選卡再選欄 | 卡片清單、各欄已放入的卡片、歸位／取回 callback |
| `ChoiceButton` | 選項卡片，含答對強化與答錯退回 | `label`、`state`、`nudgeKey`、`onClick` |
| `FeedbackNote` | 便條紙式提示 | 提示文字 |
| `StageHeader` | 五階段進度列 | 目前階段 |
| `HitBanner` | 答對時的蓋章式命中橫幅 | 顯示狀態、鼓勵語 |
| `ScoreCard` | 結案評分（百分比、星等） | 分數資料 |
| `ProgressSummary` | 偵探手冊進度側欄 | 無（自行讀 `progress.ts`） |

### CaseStage 的定位系統（重要）

這是視覺上最容易踩坑的地方，接手時請務必理解。

角色在舞台上的位置由案件資料的 `placement` 決定，包含四個欄位：

| 欄位 | 意義 |
| --- | --- |
| `x` | 水平位置，舞台寬度的百分比 |
| `y` | **角色腳底那條地面線**在舞台高度中的百分比（bottom 對齊） |
| `scale` | 相對縮放倍率 |
| `flip` | 是否水平翻轉 |

`y` 的語意是「腳踩的地面線」，不是圖片頂端或中心。這個定義是為了解決早期「角色飄在半空中」的問題——必須讓角色的腳與背景圖中的地面線對齊。調整角色位置時，請先看背景圖中地面的高度，再設定 `y`。

`scale` 有一個已知的陷阱：因為舞台以圖片高度百分比計算尺寸，而各張角色圖內「人物佔畫布的比例」不一致（有的滿版、有的留白），相同的 `scale` 不代表相同的身高。這導致早期出現「小人國」問題（兩個角色身高比例失真）。

目前的解法是：**同一畫面需要兩個角色時，改用單張雙人同框圖**，由生成階段保證比例正確，程式端只放一個 character。`Character.focusName` / `focusGender` 用來指定代名詞主體是哪一位。詳見 `DECISIONS.md`。

### 熱點（props）

案件資料的 `props` 陣列定義可點擊的線索熱點，每筆有 `x`、`y`（百分比座標）、標籤與說明文字。UI 上呈現為編號圓形標記（1、2、3），點過後變綠色打勾。

熱點座標需要與背景圖中物件的實際位置手動對齊，**換背景圖時必須重新校對座標**。這是目前流程中最耗時的人工步驟，`TODO.md` 有記錄改善方向。

---

## 九、樣式架構

所有設計 token 定義在 `client/src/index.css`，使用 Tailwind CSS 4 的 `@theme` 語法（注意：Tailwind 4 的 `@theme inline` 需使用 OKLCH 色彩格式）。

### 自訂工具類別

| 類別 | 用途 |
| --- | --- |
| `.file-card` | 偵探檔案卡片外觀（牛皮紙質感） |
| `.hit-area` | 保證最小 44px 命中區 |
| `.nudge-back` | 答錯時卡片輕輕退回的動畫 |
| `.stage-enter` | 階段進入的淡入位移 |
| `.stamp-in` | 印章蓋下效果 |
| `.hit-glow` | 答對時的柔和光暈強化 |

### 動畫原則

動畫全部使用原生 CSS（transition 與 keyframes），未引入動畫函式庫。時長維持在 300ms 以內，使用 ease-out 系列曲線，避免 ease-in。

`index.css` 底部有一條全域的 `prefers-reduced-motion` 規則，在使用者系統設定為減少動態時關閉所有非必要動畫。修改樣式時請確保新增的動畫也被這條規則涵蓋。

---

## 十、修改指引

### 安全的修改（不影響架構）

新增或修改案件資料、調整文案、調整色票與字型、調整計分權重與鼓勵語、新增情緒詞或策略項目。這些都是資料層的變更，不會破壞架構。

### 需要謹慎的修改

改動 `engine.ts` 的階段順序或完成條件，會影響所有案件；改動 `CaseStage` 的定位計算方式，會使**所有案件的 `placement` 座標全部需要重新校對**；改動 `progress.ts` 的儲存格式，會使既有使用者的進度資料失效（目前無版本遷移機制，見 `TODO.md`）。

### 不建議的修改

繞過 `progress.ts` 直接操作 `localStorage`（破壞持久層抽象）、在展示元件內直接匯入案件資料（破壞資料流方向）、為了視覺效果加入閃爍動畫或音效（違反低刺激臨床約束）、把答錯回饋改成紅色或震動（違反不懲罰原則）。

---

*文件作者：Manus AI ｜ 最後更新：2026-08-05*

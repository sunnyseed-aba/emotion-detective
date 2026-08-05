# 移交事實表（撰寫文件用內部筆記）

## 技術棧（來自 package.json）
- React 19.2.1 + TypeScript 5.6.3 + Vite 7.1.7
- Tailwind CSS 4.1.14（`@tailwindcss/vite`）、tw-animate-css
- 路由：wouter 3.3.5（有 patch: `patches/wouter@3.7.1.patch`）
- UI：shadcn/ui（Radix primitives 全套）、lucide-react 0.453、sonner 2.0.7
- 其他已安裝但專案未實際使用：framer-motion、recharts、react-hook-form、zod、axios、express、embla-carousel
- 套件管理：pnpm 10.4.1（packageManager 欄位）；本機 node v22.13.0、pnpm 10.4.1
- scripts: dev=`vite --host`, build=`vite build && esbuild server/index.ts ... --outdir=dist`, start=`NODE_ENV=production node dist/index.js`, preview=`vite preview --host`, check=`tsc --noEmit`, format=`prettier --write .`

## 檔案行數（專案自有程式碼，總計 3656 行）
pages: Home 94 / NotFound 49 / Play 482 / SceneCases 115 / Scenes 94
components/game: AbcBoard 165 / CaseStage 143 / ChoiceButton 83 / FeedbackNote 35 / HitBanner 40 / ProgressSummary 130 / ScoreCard 72 / StageHeader 44
game: assets 5 / emotions 74 / engine 193 / progress 86 / pronoun 26 / scoring 85 / strategies 74 / types 215
game/scenes: community 285 / home 285 / index 23 / school 427
index.css 332

## 路由（App.tsx，wouter Switch）
`/` Home、`/scenes` Scenes、`/scenes/:sceneId` SceneCases、`/play/:sceneId/:caseId` Play、`/404` + fallback NotFound
ThemeProvider defaultTheme="light"，未開 switchable。外層 ErrorBoundary + TooltipProvider + Toaster。

## 情緒（EmotionId，8 種）
joy 開心 / sadness 傷心 / anger 生氣 / fear 害怕 / embarrassment 尷尬 / pride 驕傲 / surprise 驚訝 / loneliness 寂寞
每種情緒帶：label、plain（兒童語言定義）、bodyCues[]（身體線索）、color、tint。
色彩：joy #B8860B、sadness #3C5A8C、anger #A63D28、fear #5E7C63、embarrassment #9E6B70、pride #B06B2C

## 7 件案子（實際使用情緒 6 種：sadness×2, anger×2, fear, embarrassment, loneliness）
| fileNo | id | 標題 | 目標情緒 |
|---|---|---|---|
| SCH-01 | school-01 | 沒有舉手的那隻手 | sadness |
| SCH-02 | school-02 | 沒被叫到的名字 | anger |
| SCH-03 | school-03 | 還沒發生的失誤 | fear |
| HOM-01 | home-01 | 被收走的積木 | sadness |
| HOM-02 | home-02 | 被關掉的平板 | anger |
| COM-01 | community-01 | 滑倒之後 | embarrassment |
| COM-02 | community-02 | 長椅上的一個人 | loneliness |
（joy / pride / surprise 只作為干擾選項存在，尚無以其為目標情緒的案件）

## 五階段（STAGE_META，實為 6 個含結案）
observe 觀察線索/情緒辨識 → name 命名情緒/情緒命名 → mind 讀心推理/心智理論 → abc 前因後果/ABC 分析 → strategy 想辦法/因應策略 → debrief 結案報告/統整回顧

## 引擎 API（useCaseEngine）
回傳 state, shuffledAbc, observeComplete, abcComplete, revealClue, advanceStage, submitChoice, placeAbcCard, clearFeedback, resetCase
EngineState: stage, stageIndex, attempts, revealedClues[], results[], abcPlacement{}, lastFeedback, ruledOut[]
ABC_SLOTS = antecedent(A 前因) / behavior(B 行為) / consequence(C 後果)，各有 code/label/hint
`seededShuffle` 以 caseId 為種子做穩定亂序（避免 render 跳動）
觀察階段必須翻開所有 `essential: true` 線索才能推進

## 評分（scoring.ts）
SCORED_STAGES = observe/name/mind/abc/strategy（debrief 不計分）
percent = min(100, 60 + round(firstTry/5 * 40))；底線 60 分
stars: >=92 → 3 星「首席偵探」；>=76 → 2 星「資深偵探」；否則 1 星「見習偵探」
三組鼓勵語 PRAISE_HIGH/MID/LOW，各 3 句；以 caseId 為 seed 穩定挑選
stageHitLine(stage, seed) 給每階段即時肯定短句

## 進度（progress.ts）
localStorage key = `emotion-detective-progress-v1`
ProgressRecord: completedCases[], stageAttempts{caseId→{stage→次數}}, emotionStats{emotion→{hit,miss}}, stageStats{stage→{hit,miss}}, lastPlayedAt
API: loadProgress / recordStageResult / recordCaseComplete / resetProgress / firstTryAccuracy
寫入失敗（隱私模式）靜默處理，不影響遊戲

## 代名詞（pronoun.ts）
focusCharacter(case) → role==="focus" 的角色，缺漏退回 characters[0]
pronounOf(case) → gender==="female" ? "她" : "他"
fillPronoun(template, case) → 替換 `{他}`、`{名}`
v4 新增 focusName / focusGender 覆寫欄位，供雙人同框圖指定代名詞主體

## MindState（心智理論資料化，ToM 核心）
fact（客觀事實）/ belief（NPC 相信的事，可與 fact 不同 → 錯誤信念）/ desire（NPC 想要的）/ knowledge（NPC 知道或不知道什麼）

## 其他型別
Clue: id, kind(face|body|context), label, note, essential
Choice: id, label, correct, feedback（答錯也有解釋為什麼不是）
AbcCard: id, text, slot
StageProp: id, label, note, x, y(0–100%), clueId?
Case: id, fileNo, title, brief, backdrop?, props?, characters[], targetEmotion, mind, clues[], emotionOptions[], mindChoices[], abcCards[], strategyChoices[], debrief
GameScene: id, name, tagline, backdrop, backdropReal?（預留擬真照片版）, cases[]
GameMode: child | therapist | parent | teacher（目前只用 child）
Character.placement: x, y（腳底地面線百分比）, scale, layer, sit?

## 策略庫（strategies.ts）
StrategyCategory: regulate（先讓身體穩下來）/ reframe（換個想法看看）/ act（做一件事）
設計順序：先調節身體 → 再處理想法 → 最後採取行動

## 視覺定位規則（CaseStage.tsx）
placement.y = 角色腳底地面線在舞台高度的百分比；角色圖以 bottom 對齊該線 → 不浮空
sit: true 時 y 對齊椅面（圖檔已含垂下小腿）
背景加 `oklch(0.95 0.02 84 / 0.22)` 紙色遮罩降對比，人物不加濾鏡（人臉須為畫面最高對比）
舞台固定 aspect-[16/9]

## 設計 token（index.css）
--ink oklch(0.32 0.045 62) / --ink-soft oklch(0.46 0.032 62) / --paper oklch(0.945 0.016 84) / --paper-deep oklch(0.895 0.024 82) / --card-stock oklch(0.975 0.01 86) / --radius 0.75rem
--ease-out cubic-bezier(0.23,1,0.32,1) / --ease-in-out cubic-bezier(0.77,0,0.175,1)
keyframes: nudge-back 420ms（答錯時卡片推回）/ stage-enter 260ms / stamp-in 220ms / stampIn / hit-pulse 620ms

## 字型（client/index.html，Google Fonts CDN）
Zen Maru Gothic (500,700)｜Noto Sans TC (400,500,700)｜Courier Prime (400,700)
無自帶字型檔案 → 無授權夾帶問題（皆為 OFL，可自行下載自架）
另 index.html 底部有 Manus 平台分析 script（`%VITE_ANALYTICS_ENDPOINT%/umami`），移出平台後應移除

## 設計方向（ideas.md）
三方向：A 紙劇場偵探社(0.07) / B 情緒天氣站(0.04) / C 黏土小鎮(0.03)
選定 A，但後續依使用者要求改為「半擬真低刺激」，A 的紙質隱喻僅保留於 UI 骨架（牛皮紙底、卡片、印章），人物與場景改為半擬真數位繪畫

## 資產（19 個程式引用，已在地化至 assets/）
scenes 10（3 場景封面 + 7 案件背景）、characters 8、brand 1
雙人同框圖 v4-pair-hom02 / v4-pair-com02 解決比例落差
assets/audio、animations、videos 為空（無音效、動畫全 CSS、無影片）
assets/icons 3 個未被程式引用（早期紙劇場風格產物）
assets/source/originals 未壓縮原圖 + 未採用的 v3 單人立繪
assets/source/scripts: cutout.py / cutout2.py / cutout_v4.py / dechroma.py

## 已有歷史文件（將整併或移入 docs/history/）
ideas.md, VISUAL_SPEC.md, ARCHITECTURE.md(舊版), IMPLEMENTATION_STATE.md, VISUAL_DIAGNOSIS.md,
ASSET_MAP_V3.md, ASSET_MAP_V3_FINAL.md, ASSET_MAP_V4.md, ASSET_MAP_V4_FINAL.md, ASSET_STATE_FINAL.md,
V3_DIAGNOSIS.md, V3_FINAL_CHECK.md, V3_HOTSPOT_RESULT.md, V3_PLACEMENT_AUDIT.md,
V4_DIAGNOSIS.md, V4_EDIT_PLAN.md, V4_GEN_REVIEW.md, V4_VERIFY.md, HANDOFF_INVENTORY.md

## AI 使用情況（重要）
**執行期完全不呼叫任何 AI／API**。所有 AI 使用都發生在「開發期」：
1. Manus 內建影像生成模型 → 產生所有場景與角色圖
2. 無 LLM 執行期呼叫、無後端、無資料庫、無環境變數需求（.env 可為空）
3. `server/index.ts` 僅為 Manus 樣板佔位，static 專案不使用
VITE_* 等注入變數皆為 Manus 平台自帶（分析、OAuth 佔位），移出平台後不需要

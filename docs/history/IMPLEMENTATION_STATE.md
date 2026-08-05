# 實作狀態備忘（防止上下文壓縮遺失）

## 已確認決策

- 對象：6–12 歲 ASD／發展遲緩兒童；使用者為督導
- 視覺：**樣本 B 半擬真 · 低刺激**（v1 紙劇場素材已作廢）
- 擬真版（樣本 C）暫不做，但 `spriteReal` / `backdropReal` 欄位已預留
- 心智理論為核心教學支柱，五階段流程固定
- 第一階段只做 `child` mode 遊戲本體＋localStorage 進度
  第二階段做督導儀表板，第三階段做多角色系統

## 已完成檔案

```
client/src/game/
  types.ts        ✅ 型別（含 CharacterPlacement 定位系統）
  emotions.ts     ✅ 8 種情緒詞庫（染料色語意化）
  strategies.ts   ✅ 策略庫（regulate / reframe / act）
  progress.ts     ✅ 進度層（localStorage，介面已抽象）
  engine.ts       ✅ 五階段狀態機 useCaseEngine（含 ABC_SLOT_META）
  assets.ts       ✅ LOGO_URL 常數
  scenes/
    school.ts     ✅ 3 案件（SCH-01 傷心 / SCH-02 生氣 / SCH-03 害怕）
    home.ts       ✅ 2 案件（HOM-01 傷心 / HOM-02 生氣）
    community.ts  ✅ 2 案件（COM-01 尷尬 / COM-02 孤單）
    index.ts      ✅ 場景註冊表

client/src/components/game/
  CaseStage.tsx        ✅ 舞台（背景＋角色定位）
  ChoiceButton.tsx     ✅ 選項（nudgeKey 觸發輕輕退回）
  FeedbackNote.tsx     ✅ 回饋便條紙
  StageHeader.tsx      ✅ 五階段進度列
  ProgressSummary.tsx  ✅ 偵探手冊進度側欄

client/src/pages/
  Home.tsx        ✅ 首頁
  Scenes.tsx      ✅ 場景選擇
  SceneCases.tsx  ✅ 案件清單

client/src/index.css   ✅ 墨褐＋牛皮紙色票、字體、.file-card / .hit-area /
                          .nudge-back / .stage-enter / .stamp-in、
                          prefers-reduced-motion 全域關閉動態
client/index.html      ✅ Zen Maru Gothic / Noto Sans TC / Courier Prime
ideas.md               ✅ 已補 Style Decisions 段（半擬真覆寫紙劇場）
```

## 待完成

- `pages/Play.tsx` 五階段關卡頁（observe / name / mind / abc / strategy / debrief）
- `App.tsx` 路由：`/`、`/scenes`、`/scenes/:sceneId`、`/play/:sceneId/:caseId`
- 視覺驗證與 checkpoint

結案報告不另設路由，直接是 Play 頁的 `debrief` 階段。

## 資源 URL

見 `VISUAL_SPEC.md` 第 52–83 行「資源清單（v2）」。

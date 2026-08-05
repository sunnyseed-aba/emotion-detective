# 情緒偵探社 — 技術架構

## 設計原則：內容與引擎分離

核心可擴充性來自一條規則：**遊戲引擎不認識任何具體情境**。所有場景、角色、案件、選項都是資料；引擎只負責跑流程。新增一個場景（如醫院、職場）不需要改動任何引擎程式碼，只需新增一個 `Scene` 資料物件。

```
client/src/game/
  types.ts        ← 全部資料型別定義（單一真相來源）
  emotions.ts     ← 情緒詞庫（8 種核心情緒 + 顏色 + 身體線索）
  strategies.ts   ← 因應策略庫（跨場景共用）
  scenes/
    home.ts       ← 家庭場景案件包
    community.ts  ← 社區場景案件包
    school.ts     ← 學校場景案件包
    index.ts      ← 場景註冊表（新場景只在此註冊）
  engine.ts       ← 關卡流程狀態機（不含任何情境內容）
  progress.ts     ← 進度存取層（現為 localStorage，預留可換 API）
```

## 五階段關卡流程（Case Flow）

每個「案件」（Case）固定跑完五個階段，對應教學目標：

| 階段 | 代號 | 教學目標 | 玩家操作 |
|---|---|---|---|
| 1 觀察線索 | `observe` | 情緒辨識 | 點選畫面中的表情／肢體／情境線索 |
| 2 命名情緒 | `name` | 情緒命名 | 從情緒卡中選出正確情緒詞 |
| 3 讀心推理 | `mind` | 心智理論 | 推斷 NPC 的「信念／想法」，理解信念可能不等於事實 |
| 4 前因後果 | `abc` | ABC 分析 | 將前因（A）、行為（B）、後果（C）三張卡依序歸檔 |
| 5 想辦法 | `strategy` | 因應策略 | 選擇能改變 NPC 信念或情緒的策略，並看到結果回饋 |

狀態機以 `CaseStage` 推進，每階段回報 `StageResult { correct, attempts }`，供進度層彙整。

## 心智理論的資料化

每個 NPC 帶一組心理狀態，這是 ToM 教學的核心：

```ts
mind: {
  fact: string      // 客觀事實（玩家／旁觀者知道的）
  belief: string    // NPC 相信的事（可能與 fact 不同 → 錯誤信念）
  desire: string    // NPC 想要的
  knowledge: string // NPC 實際知道／不知道什麼
}
```

階段 3 的選項刻意包含「事實正確但信念錯誤」的干擾項，訓練孩子區分「他知道的」與「我知道的」。

## 進度層（為第二／三階段預留）

`progress.ts` 只暴露 4 個函式：`loadProgress`、`recordStageResult`、`recordCaseComplete`、`resetProgress`。目前實作為 `localStorage`，未來升級為後端資料庫時，只需替換此檔案內部實作，UI 與引擎完全不需改動。

進度資料結構已預留分析所需維度：依情緒分類的正確率、依階段分類的正確率、嘗試次數、完成時間戳，可直接支撐未來的督導儀表板。

## 使用者角色（為第三階段預留）

`GameMode` 型別已定義 `child | therapist | parent | teacher`，目前只用 `child` 走遊戲流程，但關卡設定（提示強度、是否顯示教學註解）已依 mode 參數化，未來開啟其他 mode 不需重構。

/**
 * 情緒偵探社 — 資料型別（單一真相來源）
 * 設計風格：紙劇場偵探社。所有情境內容皆為資料，引擎不認識具體案件。
 * 新增場景／角色只需新增資料物件，不需改動引擎。
 */

export type EmotionId =
  | "joy"
  | "sadness"
  | "anger"
  | "fear"
  | "embarrassment"
  | "pride"
  | "surprise"
  | "loneliness";

export interface Emotion {
  id: EmotionId;
  label: string;
  /** 給孩子的白話定義 */
  plain: string;
  /** 身體與表情線索，用於階段一教學提示 */
  bodyCues: string[];
  /** 染料色（HEX），只用於情緒相關元件 */
  color: string;
  /** 卡片底色（更淺，用於卡片背景） */
  tint: string;
}

/** 舞台上的角色定位 */
export interface CharacterPlacement {
  /** 舞台橫向位置，0–100 (%) */
  x: number;
  /**
   * 角色腳底（或臀部落座點）在舞台上的縱向位置，0–100 (%)。
   * 這個值必須對齊背景圖裡「該角色實際踩到的那條地面線」，否則會出現浮空。
   * 坐姿角色請對齊椅面高度，並把 sit 設為 true。
   */
  y: number;
  /** 相對尺寸，越靠後越小 */
  scale: number;
  /** 深度層：1 背景 / 2 中景 / 3 前景 */
  layer: 1 | 2 | 3;
  /** 是否水平翻轉（讓兩人可以面對面） */
  flip?: boolean;
  /** 坐姿角色：y 對齊的是椅面而非地面 */
  sit?: boolean;
}

/** 角色在案件中的教學定位 */
export type CharacterRole = "focus" | "related" | "bystander";

export interface Character {
  id: string;
  name: string;
  /** 生理性別，僅用於決定敘述用的代名詞（他／她） */
  gender: "male" | "female";
  /** 半擬真人物圖 URL（透明背景） */
  sprite: string;
  /** 預留：未來擬真照片版本（樣本 C），補圖即可切換 */
  spriteReal?: string;
  role: CharacterRole;
  placement: CharacterPlacement;
  /**
   * 這張圖是否為「多人同框」的合成圖。
   * 合成圖能保證人物之間的比例與朝向正確（不會出現小人國或背對背），
   * 代價是不能個別移動，因此只用在互動關係明確的雙人案件。
   */
  isPair?: boolean;
}

/** 心智理論核心：NPC 的心理狀態 */
export interface MindState {
  /** 客觀事實（旁觀者知道的） */
  fact: string;
  /** 當事人相信的事（可能與 fact 不同 → 錯誤信念） */
  belief: string;
  /** 當事人想要的 */
  desire: string;
  /** 當事人實際知道／不知道什麼 */
  knowledge: string;
}

/** 階段一：可點選的線索 */
export interface Clue {
  id: string;
  /** 線索類別：表情 / 肢體 / 情境 */
  kind: "face" | "body" | "context";
  label: string;
  /** 點選後顯示的偵探筆記 */
  note: string;
  /** 是否為本案必要線索 */
  essential: boolean;
}

/** 通用選項（用於命名、讀心、策略階段） */
export interface Choice {
  id: string;
  label: string;
  correct: boolean;
  /** 選後回饋，答錯時解釋為什麼不是 */
  feedback: string;
}

/** 階段四：ABC 因果鏈的單張卡 */
export interface AbcCard {
  id: string;
  text: string;
  /** 正確歸屬的槽位 */
  slot: "antecedent" | "behavior" | "consequence";
}

/**
 * 舞台上的可點物件熱點。
 * 目的：讓場景不只是「地點＋人」，關鍵物件要看得見、點得到，
 * 觀察階段的線索因此有畫面依據，而不是只靠文字說明。
 */
export interface StageProp {
  id: string;
  /** 物件名稱，例如「折起來的考卷」 */
  label: string;
  /** 點選後的一句說明 */
  note: string;
  /** 熱點中心位置，0–100 (%) */
  x: number;
  y: number;
  /** 對應的線索 id；點物件會同時揭露該線索 */
  clueId?: string;
}

export interface Case {
  id: string;
  /** 檔案編號，如 SCH-01 */
  fileNo: string;
  title: string;
  /** 案件開場敘述 */
  brief: string;
  /** 本案專屬背景圖（含關鍵物件）。未設定時退回場景通用背景。 */
  backdrop?: string;
  /** 完整敘事場景已包含人物，呈現時不再疊加角色 cutout。 */
  compositeScene?: boolean;
  /** 舞台上可點的關鍵物件 */
  props?: StageProp[];
  characters: Character[];
  /** 當事人的目標情緒 */
  targetEmotion: EmotionId;
  mind: MindState;
  clues: Clue[];
  /** 階段二：情緒命名選項（EmotionId 清單，含干擾項） */
  emotionOptions: EmotionId[];
  /** 階段三：讀心推理選項 */
  mindChoices: Choice[];
  /** 階段四：ABC 卡（會被打亂） */
  abcCards: AbcCard[];
  /** 階段五：因應策略選項 */
  strategyChoices: Choice[];
  /** 破案後的教學總結 */
  debrief: string;
}

export interface GameScene {
  id: string;
  name: string;
  /** 一句話定位 */
  tagline: string;
  /** 舞台背景圖 URL */
  backdrop: string;
  /** 預留：未來擬真照片版本背景 */
  backdropReal?: string;
  cases: Case[];
}

/** 關卡五階段 */
export type CaseStage = "observe" | "name" | "mind" | "abc" | "strategy" | "debrief";

export const STAGE_ORDER: CaseStage[] = [
  "observe",
  "name",
  "mind",
  "abc",
  "strategy",
  "debrief",
];

export const STAGE_META: Record<
  CaseStage,
  { step: number; label: string; goal: string }
> = {
  observe: { step: 1, label: "觀察線索", goal: "情緒辨識" },
  name: { step: 2, label: "命名情緒", goal: "情緒命名" },
  mind: { step: 3, label: "讀心推理", goal: "心智理論" },
  abc: { step: 4, label: "前因後果", goal: "ABC 分析" },
  strategy: { step: 5, label: "想辦法", goal: "因應策略" },
  debrief: { step: 6, label: "結案報告", goal: "統整回顧" },
};

/** 使用者模式（第三階段將啟用其餘角色） */
export type GameMode = "child" | "therapist" | "parent" | "teacher";

/** 單階段結果 */
export interface StageResult {
  stage: CaseStage;
  correct: boolean;
  attempts: number;
}

/** 進度紀錄（已預留分析所需維度） */
export interface ProgressRecord {
  completedCases: string[];
  /** caseId → 各階段嘗試次數 */
  stageAttempts: Record<string, Partial<Record<CaseStage, number>>>;
  /** 依情緒統計：命名階段的正確／錯誤次數 */
  emotionStats: Partial<Record<EmotionId, { hit: number; miss: number }>>;
  /** 依階段統計 */
  stageStats: Partial<Record<CaseStage, { hit: number; miss: number }>>;
  lastPlayedAt: string | null;
}

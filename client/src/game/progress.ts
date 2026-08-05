/**
 * 進度存取層。目前以 localStorage 實作；未來升級為後端資料庫時，
 * 只需替換本檔內部實作，UI 與引擎完全不需改動（見 ARCHITECTURE.md）。
 */
import type { CaseStage, EmotionId, ProgressRecord } from "./types";

export const PROGRESS_STORAGE_KEY = "emotion-detective-progress-v1";

const EMPTY: ProgressRecord = {
  completedCases: [],
  stageAttempts: {},
  emotionStats: {},
  stageStats: {},
  lastPlayedAt: null,
};

export function loadProgress(): ProgressRecord {
  try {
    const raw = localStorage.getItem(PROGRESS_STORAGE_KEY);
    if (!raw) return { ...EMPTY };
    return { ...EMPTY, ...(JSON.parse(raw) as ProgressRecord) };
  } catch {
    return { ...EMPTY };
  }
}

function save(p: ProgressRecord) {
  try {
    localStorage.setItem(PROGRESS_STORAGE_KEY, JSON.stringify(p));
  } catch {
    /* 隱私模式或空間不足時靜默失敗，不影響遊戲進行 */
  }
}

export function recordStageResult(
  caseId: string,
  stage: CaseStage,
  correct: boolean,
  emotion?: EmotionId,
): ProgressRecord {
  const p = loadProgress();

  const perCase = { ...(p.stageAttempts[caseId] ?? {}) };
  perCase[stage] = (perCase[stage] ?? 0) + 1;
  p.stageAttempts = { ...p.stageAttempts, [caseId]: perCase };

  const s = p.stageStats[stage] ?? { hit: 0, miss: 0 };
  p.stageStats = {
    ...p.stageStats,
    [stage]: correct ? { ...s, hit: s.hit + 1 } : { ...s, miss: s.miss + 1 },
  };

  if (stage === "name" && emotion) {
    const e = p.emotionStats[emotion] ?? { hit: 0, miss: 0 };
    p.emotionStats = {
      ...p.emotionStats,
      [emotion]: correct ? { ...e, hit: e.hit + 1 } : { ...e, miss: e.miss + 1 },
    };
  }

  p.lastPlayedAt = new Date().toISOString();
  save(p);
  return p;
}

export function recordCaseComplete(caseId: string): ProgressRecord {
  const p = loadProgress();
  if (!p.completedCases.includes(caseId)) {
    p.completedCases = [...p.completedCases, caseId];
  }
  p.lastPlayedAt = new Date().toISOString();
  save(p);
  return p;
}

export function resetProgress(): ProgressRecord {
  save({ ...EMPTY });
  return { ...EMPTY };
}

/** 首次嘗試即答對的比率，供未來督導儀表板使用 */
export function firstTryAccuracy(p: ProgressRecord, stage: CaseStage): number | null {
  const s = p.stageStats[stage];
  if (!s || s.hit + s.miss === 0) return null;
  return Math.round((s.hit / (s.hit + s.miss)) * 100);
}

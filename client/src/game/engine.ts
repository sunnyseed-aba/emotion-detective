/**
 * 五階段關卡引擎。
 *
 * 設計原則（見 ARCHITECTURE.md）：引擎不認識任何具體案件，只負責推進
 * `observe → name → mind → abc → strategy → debrief`，並記錄每階段的
 * 嘗試次數。所有情境內容都由 `Case` 資料驅動，新增場景不需改動本檔。
 *
 * 低刺激規範：答錯不阻擋、不倒數、不扣分，只記錄嘗試次數並顯示回饋。
 */
import { useCallback, useMemo, useState } from "react";
import type { AbcCard, Case, CaseStage, StageResult } from "./types";
import { STAGE_ORDER } from "./types";
import { recordCaseComplete, recordStageResult } from "./progress";

export type AbcSlot = AbcCard["slot"];

export const ABC_SLOTS: AbcSlot[] = ["antecedent", "behavior", "consequence"];

export const ABC_SLOT_META: Record<
  AbcSlot,
  { code: string; label: string; hint: string }
> = {
  antecedent: { code: "A", label: "前因", hint: "在這之前發生了什麼事？" },
  behavior: { code: "B", label: "行為", hint: "他做了什麼？" },
  consequence: { code: "C", label: "後果", hint: "結果變成怎樣？" },
};

/** 以案件 id 為種子的穩定亂序，避免每次 render 順序都跳動 */
function seededShuffle<T>(items: T[], seed: string): T[] {
  let h = 0;
  for (let i = 0; i < seed.length; i++) h = (h * 31 + seed.charCodeAt(i)) % 233280;
  const out = [...items];
  for (let i = out.length - 1; i > 0; i--) {
    h = (h * 9301 + 49297) % 233280;
    const j = Math.floor((h / 233280) * (i + 1));
    [out[i], out[j]] = [out[j], out[i]];
  }
  return out;
}

export interface EngineState {
  stage: CaseStage;
  stageIndex: number;
  /** 本階段已嘗試次數（含答錯） */
  attempts: number;
  /** 已翻開的線索 id */
  revealedClues: string[];
  /** 各階段結果 */
  results: StageResult[];
  /** ABC 階段：卡片 id → 已放入的槽位 */
  abcPlacement: Record<string, AbcSlot | null>;
  /** 最近一次選擇的回饋 */
  lastFeedback: { correct: boolean; text: string } | null;
  /** 已選過但答錯的選項 id（用於淡化顯示） */
  ruledOut: string[];
}

export function useCaseEngine(activeCase: Case) {
  const shuffledAbc = useMemo(
    () => seededShuffle(activeCase.abcCards, activeCase.id),
    [activeCase],
  );

  const [state, setState] = useState<EngineState>(() => ({
    stage: "observe",
    stageIndex: 0,
    attempts: 0,
    revealedClues: [],
    results: [],
    abcPlacement: {},
    lastFeedback: null,
    ruledOut: [],
  }));

  /** 必要線索是否都已翻開 → 才能離開觀察階段 */
  const essentialClueIds = useMemo(
    () => activeCase.clues.filter((c) => c.essential).map((c) => c.id),
    [activeCase],
  );

  const observeComplete = essentialClueIds.every((id) =>
    state.revealedClues.includes(id),
  );

  const abcComplete = useMemo(
    () =>
      shuffledAbc.every((card) => state.abcPlacement[card.id] === card.slot),
    [shuffledAbc, state.abcPlacement],
  );

  const revealClue = useCallback((clueId: string) => {
    setState((s) =>
      s.revealedClues.includes(clueId)
        ? s
        : { ...s, revealedClues: [...s.revealedClues, clueId] },
    );
  }, []);

  /** 前進到下一階段，並把本階段結果寫入進度層 */
  const advanceStage = useCallback(
    (correctOnFirstTry: boolean) => {
      setState((s) => {
        const nextIndex = Math.min(s.stageIndex + 1, STAGE_ORDER.length - 1);
        const result: StageResult = {
          stage: s.stage,
          correct: correctOnFirstTry,
          attempts: Math.max(s.attempts, 1),
        };
        recordStageResult(
          activeCase.id,
          s.stage,
          correctOnFirstTry,
          s.stage === "name" ? activeCase.targetEmotion : undefined,
        );
        const nextStage = STAGE_ORDER[nextIndex];
        if (nextStage === "debrief") recordCaseComplete(activeCase.id);
        return {
          ...s,
          stage: nextStage,
          stageIndex: nextIndex,
          attempts: 0,
          lastFeedback: null,
          ruledOut: [],
          results: [...s.results, result],
        };
      });
    },
    [activeCase],
  );

  /** 單選題作答（命名／讀心／策略共用） */
  const submitChoice = useCallback(
    (choiceId: string, correct: boolean, feedback: string) => {
      setState((s) => ({
        ...s,
        attempts: s.attempts + 1,
        lastFeedback: { correct, text: feedback },
        ruledOut: correct ? s.ruledOut : [...s.ruledOut, choiceId],
      }));
      return correct;
    },
    [],
  );

  /** ABC 卡放入槽位；放錯時回傳 false，UI 讓卡片輕輕退回 */
  const placeAbcCard = useCallback(
    (cardId: string, slot: AbcSlot) => {
      const card = activeCase.abcCards.find((c) => c.id === cardId);
      if (!card) return false;
      const ok = card.slot === slot;
      setState((s) => ({
        ...s,
        attempts: s.attempts + 1,
        abcPlacement: ok ? { ...s.abcPlacement, [cardId]: slot } : s.abcPlacement,
        lastFeedback: ok
          ? null
          : { correct: false, text: "這張卡再看一次。它是事情的開頭、中間，還是結果？" },
      }));
      return ok;
    },
    [activeCase],
  );

  const clearFeedback = useCallback(() => {
    setState((s) => (s.lastFeedback ? { ...s, lastFeedback: null } : s));
  }, []);

  const resetCase = useCallback(() => {
    setState({
      stage: "observe",
      stageIndex: 0,
      attempts: 0,
      revealedClues: [],
      results: [],
      abcPlacement: {},
      lastFeedback: null,
      ruledOut: [],
    });
  }, []);

  return {
    state,
    shuffledAbc,
    observeComplete,
    abcComplete,
    revealClue,
    advanceStage,
    submitChoice,
    placeAbcCard,
    clearFeedback,
    resetCase,
  };
}

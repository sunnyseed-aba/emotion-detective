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

export function createEngineState(): EngineState {
  return {
    stage: "observe",
    stageIndex: 0,
    attempts: 0,
    revealedClues: [],
    results: [],
    abcPlacement: {},
    lastFeedback: null,
    ruledOut: [],
  };
}

export function revealClueState(state: EngineState, clueId: string): EngineState {
  return state.revealedClues.includes(clueId)
    ? state
    : { ...state, revealedClues: [...state.revealedClues, clueId] };
}

export function submitChoiceState(
  state: EngineState,
  choiceId: string,
  correct: boolean,
  feedback: string,
): EngineState {
  return {
    ...state,
    attempts: state.attempts + 1,
    lastFeedback: { correct, text: feedback },
    ruledOut: correct ? state.ruledOut : [...state.ruledOut, choiceId],
  };
}

export function placeAbcCardState(
  state: EngineState,
  activeCase: Case,
  cardId: string,
  slot: AbcSlot,
): { state: EngineState; correct: boolean } {
  const card = activeCase.abcCards.find((item) => item.id === cardId);
  if (!card) return { state, correct: false };
  const correct = card.slot === slot;
  return {
    correct,
    state: {
      ...state,
      attempts: state.attempts + 1,
      abcPlacement: correct
        ? { ...state.abcPlacement, [cardId]: slot }
        : state.abcPlacement,
      lastFeedback: correct
        ? null
        : { correct: false, text: "這張卡再看一次。它是事情的開頭、中間，還是結果？" },
    },
  };
}

export function canAdvanceState(state: EngineState, activeCase: Case): boolean {
  if (state.stage === "observe") {
    return activeCase.clues
      .filter((clue) => clue.essential)
      .every((clue) => state.revealedClues.includes(clue.id));
  }
  if (state.stage === "abc") {
    return activeCase.abcCards.every(
      (card) => state.abcPlacement[card.id] === card.slot,
    );
  }
  if (state.stage === "debrief") return false;
  return state.lastFeedback?.correct === true;
}

export function advanceEngineState(
  state: EngineState,
  activeCase: Case,
  correctOnFirstTry: boolean,
): EngineState {
  if (!canAdvanceState(state, activeCase)) return state;
  const nextIndex = Math.min(state.stageIndex + 1, STAGE_ORDER.length - 1);
  const result: StageResult = {
    stage: state.stage,
    correct: correctOnFirstTry,
    attempts: Math.max(state.attempts, 1),
  };
  return {
    ...state,
    stage: STAGE_ORDER[nextIndex],
    stageIndex: nextIndex,
    attempts: 0,
    lastFeedback: null,
    ruledOut: [],
    results: [...state.results, result],
  };
}

export function useCaseEngine(activeCase: Case) {
  const shuffledAbc = useMemo(
    () => seededShuffle(activeCase.abcCards, activeCase.id),
    [activeCase],
  );

  const [state, setState] = useState<EngineState>(createEngineState);

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
    setState((s) => revealClueState(s, clueId));
  }, []);

  /** 前進到下一階段，並把本階段結果寫入進度層 */
  const advanceStage = useCallback(
    (correctOnFirstTry: boolean) => {
      setState((s) => {
        const next = advanceEngineState(s, activeCase, correctOnFirstTry);
        if (next === s) return s;
        recordStageResult(
          activeCase.id,
          s.stage,
          correctOnFirstTry,
          s.stage === "name" ? activeCase.targetEmotion : undefined,
        );
        if (next.stage === "debrief") recordCaseComplete(activeCase.id);
        return next;
      });
    },
    [activeCase],
  );

  /** 單選題作答（命名／讀心／策略共用） */
  const submitChoice = useCallback(
    (choiceId: string, correct: boolean, feedback: string) => {
      setState((s) => submitChoiceState(s, choiceId, correct, feedback));
      return correct;
    },
    [],
  );

  /** ABC 卡放入槽位；放錯時回傳 false，UI 讓卡片輕輕退回 */
  const placeAbcCard = useCallback(
    (cardId: string, slot: AbcSlot) => {
      const card = activeCase.abcCards.find((item) => item.id === cardId);
      if (!card) return false;
      const correct = card.slot === slot;
      setState((s) => placeAbcCardState(s, activeCase, cardId, slot).state);
      return correct;
    },
    [activeCase],
  );

  const clearFeedback = useCallback(() => {
    setState((s) => (s.lastFeedback ? { ...s, lastFeedback: null } : s));
  }, []);

  const resetCase = useCallback(() => {
    setState(createEngineState());
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

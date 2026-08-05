import { describe, expect, it } from "vitest";
import { getCase } from "./scenes";
import {
  advanceEngineState,
  canAdvanceState,
  createEngineState,
  placeAbcCardState,
  revealClueState,
  submitChoiceState,
} from "./engine";

const activeCase = getCase("school", "school-01")!;

describe("game engine", () => {
  it("starts at observe and cannot advance before essential clues are revealed", () => {
    const initial = createEngineState();
    expect(initial.stage).toBe("observe");
    expect(canAdvanceState(initial, activeCase)).toBe(false);
    expect(advanceEngineState(initial, activeCase, true)).toBe(initial);
  });

  it("updates incorrect and correct choices including attempts", () => {
    let state = { ...createEngineState(), stage: "name" as const, stageIndex: 1 };
    state = submitChoiceState(state, "anger", false, "try again");
    expect(state.attempts).toBe(1);
    expect(state.ruledOut).toEqual(["anger"]);
    expect(state.lastFeedback?.correct).toBe(false);

    state = submitChoiceState(state, "sadness", true, "correct");
    expect(state.attempts).toBe(2);
    expect(state.ruledOut).toEqual(["anger"]);
    expect(canAdvanceState(state, activeCase)).toBe(true);

    const next = advanceEngineState(state, activeCase, false);
    expect(next.stage).toBe("mind");
    expect(next.results.at(-1)).toEqual({ stage: "name", correct: false, attempts: 2 });
  });

  it("only accepts ABC cards in their correct slots", () => {
    const state = { ...createEngineState(), stage: "abc" as const, stageIndex: 3 };
    const card = activeCase.abcCards[0];
    const wrongSlot = card.slot === "antecedent" ? "behavior" : "antecedent";
    const wrong = placeAbcCardState(state, activeCase, card.id, wrongSlot);
    expect(wrong.correct).toBe(false);
    expect(wrong.state.attempts).toBe(1);
    expect(wrong.state.abcPlacement[card.id]).toBeUndefined();
  });
});

describe("one complete school case", () => {
  it("follows observe → name → mind → abc → strategy → debrief", () => {
    let state = createEngineState();
    for (const clue of activeCase.clues.filter((item) => item.essential)) {
      state = revealClueState(state, clue.id);
    }
    state = advanceEngineState(state, activeCase, true);
    expect(state.stage).toBe("name");

    for (const expected of ["mind", "abc"] as const) {
      state = submitChoiceState(state, "correct", true, "correct");
      state = advanceEngineState(state, activeCase, true);
      expect(state.stage).toBe(expected);
    }

    for (const card of activeCase.abcCards) {
      state = placeAbcCardState(state, activeCase, card.id, card.slot).state;
    }
    state = advanceEngineState(state, activeCase, state.attempts <= 3);
    expect(state.stage).toBe("strategy");

    state = submitChoiceState(state, "correct", true, "correct");
    state = advanceEngineState(state, activeCase, true);
    expect(state.stage).toBe("debrief");
    expect(state.results.map((result) => result.stage)).toEqual([
      "observe",
      "name",
      "mind",
      "abc",
      "strategy",
    ]);
    expect(state.results).toHaveLength(5);
  });
});

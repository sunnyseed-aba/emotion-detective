import { describe, expect, it } from "vitest";
import { scoreCase } from "./scoring";
import type { StageResult } from "./types";

const stages = ["observe", "name", "mind", "abc", "strategy"] as const;
const results = (attempts: number[]): StageResult[] =>
  stages.map((stage, index) => ({
    stage,
    attempts: attempts[index],
    correct: attempts[index] === 1,
  }));

describe("scoreCase", () => {
  it.each([
    [[1, 1, 1, 1, 1], 100, 3],
    [[1, 1, 1, 2, 2], 84, 2],
    [[2, 2, 2, 2, 2], 60, 1],
    [[1, 1, 1, 1, 2], 92, 3],
    [[1, 1, 2, 2, 2], 76, 2],
  ])("maps attempts %j to %i percent and %i stars", (attempts, percent, stars) => {
    const score = scoreCase(results(attempts), "school-01");
    expect(score.percent).toBe(percent);
    expect(score.stars).toBe(stars);
  });

  it("safely ignores invalid, duplicate and non-scored records", () => {
    const score = scoreCase(
      [
        { stage: "name", attempts: Number.NaN, correct: true },
        { stage: "name", attempts: 1, correct: true },
        { stage: "debrief", attempts: 1, correct: true },
      ],
      "invalid",
    );
    expect(score).toMatchObject({ percent: 60, stars: 1, firstTryCount: 0, totalStages: 5 });
  });

  it("returns a safe minimum for empty input", () => {
    expect(scoreCase([], "empty")).toMatchObject({ percent: 60, stars: 1 });
  });
});

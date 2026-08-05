import { beforeEach, describe, expect, it, vi } from "vitest";
import {
  loadProgress,
  PROGRESS_STORAGE_KEY,
  recordCaseComplete,
  recordStageResult,
  resetProgress,
} from "./progress";

class MemoryStorage {
  private values = new Map<string, string>();
  getItem(key: string) {
    return this.values.get(key) ?? null;
  }
  setItem(key: string, value: string) {
    this.values.set(key, value);
  }
}

describe("progress storage", () => {
  beforeEach(() => {
    vi.stubGlobal("localStorage", new MemoryStorage());
  });

  it("uses the versioned key and falls back for empty data", () => {
    expect(PROGRESS_STORAGE_KEY).toBe("emotion-detective-progress-v1");
    expect(loadProgress()).toMatchObject({ completedCases: [], lastPlayedAt: null });
  });

  it("writes and reads stage and completed-case progress", () => {
    recordStageResult("school-01", "name", true, "sadness");
    recordCaseComplete("school-01");
    expect(loadProgress()).toMatchObject({
      completedCases: ["school-01"],
      stageAttempts: { "school-01": { name: 1 } },
      emotionStats: { sadness: { hit: 1, miss: 0 } },
    });
  });

  it("falls back when stored JSON is damaged", () => {
    localStorage.setItem(PROGRESS_STORAGE_KEY, "{broken");
    expect(loadProgress()).toMatchObject({ completedCases: [], stageStats: {} });
  });

  it("clears progress", () => {
    recordCaseComplete("school-01");
    resetProgress();
    expect(loadProgress()).toMatchObject({ completedCases: [], lastPlayedAt: null });
  });

  it("does not crash when localStorage is unavailable", () => {
    vi.stubGlobal("localStorage", {
      getItem: () => {
        throw new Error("blocked");
      },
      setItem: () => {
        throw new Error("blocked");
      },
    });
    expect(() => recordCaseComplete("school-01")).not.toThrow();
    expect(() => resetProgress()).not.toThrow();
    expect(loadProgress().completedCases).toEqual([]);
  });
});

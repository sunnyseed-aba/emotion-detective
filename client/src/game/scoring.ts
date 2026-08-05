/**
 * 案件評分與鼓勵語。
 *
 * 評分哲學（低刺激原則）：分數只用來「肯定進展」，不用來「懲罰錯誤」。
 * 因此最低分是 60 分而非 0 分——把每個階段完成本身當成得分基礎，
 * 首次即答對再加分。任何分數區間都給正向語句，沒有負面評語。
 */
import type { CaseStage, StageResult } from "./types";

/** 有計分的階段（結案報告不計分） */
const SCORED_STAGES: CaseStage[] = ["observe", "name", "mind", "abc", "strategy"];

export interface CaseScore {
  /** 0–100 */
  percent: number;
  /** 1–3 顆星 */
  stars: 1 | 2 | 3;
  /** 徽章名稱 */
  rank: string;
  /** 鼓勵語（依區間） */
  praise: string;
  /** 首次即答對的階段數 */
  firstTryCount: number;
  /** 計分階段總數 */
  totalStages: number;
}

const PRAISE_HIGH = [
  "一次就看穿了。你不只看見他做了什麼，還看見他為什麼這樣做。",
  "推理乾淨俐落。最難的部分——分清「事實」和「他相信的事」——你抓得很準。",
  "這件案子辦得漂亮。你留住了耐心，才留住了線索。",
];

const PRAISE_MID = [
  "有幾個地方繞了一下，但你都自己走回正路了，這比一次答對更值得記下來。",
  "你願意改變想法，這是偵探最重要的能力。案子破得踏實。",
  "中途換過方向，最後仍然結案。這正是真正的辦案過程。",
];

const PRAISE_LOW = [
  "這件案子不容易，你沒有放棄，一路走到結案。這件事本身就很了不起。",
  "試了很多次才對，但你把每個錯的可能都親手排除掉了，理解會留得更久。",
  "慢慢來也是一種辦案方式。你完整地走完了五個步驟。",
];

function pick(list: string[], seed: string): string {
  let h = 0;
  for (let i = 0; i < seed.length; i++) h = (h * 31 + seed.charCodeAt(i)) % 9973;
  return list[h % list.length];
}

export function scoreCase(results: StageResult[], caseId: string): CaseScore {
  const scored = results.filter((r) => SCORED_STAGES.includes(r.stage));
  const total = SCORED_STAGES.length;
  const firstTry = scored.filter((r) => r.correct).length;

  // 60 分底線（完成即得），首次答對的階段各加 8 分
  const percent = Math.min(100, 60 + Math.round((firstTry / total) * 40));

  const stars: 1 | 2 | 3 = percent >= 92 ? 3 : percent >= 76 ? 2 : 1;
  const rank = stars === 3 ? "首席偵探" : stars === 2 ? "資深偵探" : "見習偵探";
  const praise =
    stars === 3
      ? pick(PRAISE_HIGH, caseId)
      : stars === 2
        ? pick(PRAISE_MID, caseId)
        : pick(PRAISE_LOW, caseId);

  return { percent, stars, rank, praise, firstTryCount: firstTry, totalStages: total };
}

/** 單階段答對時的即時肯定語（短句，不打斷節奏） */
const STAGE_HIT: Record<CaseStage, string[]> = {
  observe: ["線索收齊了。", "觀察得很仔細。"],
  name: ["情緒命名正確。", "你認出來了。"],
  mind: ["讀心成功。", "你看進他心裡了。"],
  abc: ["因果鏈接起來了。", "順序完全正確。"],
  strategy: ["這個辦法真的幫得上他。", "策略選得好。"],
  debrief: ["結案。"],
};

export function stageHitLine(stage: CaseStage, seed: string): string {
  return pick(STAGE_HIT[stage], seed + stage);
}


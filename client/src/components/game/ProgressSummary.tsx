/**
 * 進度摘要側欄。第一階段只呈現孩子看得懂的資訊（破了幾件案子、
 * 哪些情緒認得比較穩），不呈現分數排名，避免比較壓力。
 * 進度數據來自 progress.ts，未來督導儀表板會直接複用同一份資料。
 */
import { useEffect, useState } from "react";
import { RotateCcw } from "lucide-react";
import { ALL_CASES } from "@/game/scenes";
import { EMOTIONS } from "@/game/emotions";
import { loadProgress, resetProgress } from "@/game/progress";
import { STAGE_META } from "@/game/types";
import type { ProgressRecord } from "@/game/types";

export function ProgressSummary() {
  const [progress, setProgress] = useState<ProgressRecord | null>(null);

  useEffect(() => {
    setProgress(loadProgress());
  }, []);

  if (!progress) return null;

  const total = ALL_CASES.length;
  const done = progress.completedCases.length;
  const pct = total ? Math.round((done / total) * 100) : 0;

  const emotionRows = Object.entries(progress.emotionStats)
    .map(([id, s]) => ({
      id: id as keyof typeof EMOTIONS,
      hit: s?.hit ?? 0,
      miss: s?.miss ?? 0,
    }))
    .filter((r) => r.hit + r.miss > 0)
    .sort((a, b) => b.hit + b.miss - (a.hit + a.miss))
    .slice(0, 5);

  const stageRows = (["mind", "abc", "strategy"] as const)
    .map((stage) => ({ stage, s: progress.stageStats[stage] }))
    .filter((r) => r.s && r.s.hit + r.s.miss > 0);

  return (
    <div className="file-card rounded-2xl px-6 py-6" style={{ transform: "rotate(0.4deg)" }}>
      <p className="font-file text-[0.8125rem] uppercase tracking-widest text-muted-foreground">
        偵探手冊
      </p>

      <p className="mt-4 text-[1.0625rem]">
        已破案{" "}
        <span className="font-file text-[1.5rem]" style={{ color: "var(--ink)" }}>
          {done}
        </span>{" "}
        / {total} 件
      </p>

      <div
        className="mt-3 h-2.5 w-full overflow-hidden rounded-full"
        style={{ background: "oklch(0.89 0.025 82)" }}
        role="progressbar"
        aria-valuenow={pct}
        aria-valuemin={0}
        aria-valuemax={100}
      >
        <div
          className="h-full rounded-full transition-[width] duration-[400ms] ease-[var(--ease-out)]"
          style={{ width: `${pct}%`, background: "var(--ink)" }}
        />
      </div>

      {emotionRows.length > 0 ? (
        <div className="mt-7">
          <p className="font-file text-[0.8125rem] uppercase tracking-widest text-muted-foreground">
            情緒命名紀錄
          </p>
          <ul className="mt-3 space-y-2.5">
            {emotionRows.map((r) => {
              const e = EMOTIONS[r.id];
              const rate = Math.round((r.hit / (r.hit + r.miss)) * 100);
              return (
                <li key={r.id} className="flex items-center gap-3">
                  <span
                    className="h-3.5 w-3.5 shrink-0 rounded-full"
                    style={{ background: e.color }}
                    aria-hidden
                  />
                  <span className="text-[1rem]">{e.label}</span>
                  <span className="font-file ml-auto text-[0.9375rem] text-muted-foreground">
                    一次答對 {rate}%
                  </span>
                </li>
              );
            })}
          </ul>
        </div>
      ) : null}

      {stageRows.length > 0 ? (
        <div className="mt-7">
          <p className="font-file text-[0.8125rem] uppercase tracking-widest text-muted-foreground">
            各步驟表現
          </p>
          <ul className="mt-3 space-y-2.5">
            {stageRows.map(({ stage, s }) => (
              <li key={stage} className="flex items-center gap-3">
                <span className="text-[1rem]">{STAGE_META[stage].label}</span>
                <span className="font-file ml-auto text-[0.9375rem] text-muted-foreground">
                  一次答對 {Math.round((s!.hit / (s!.hit + s!.miss)) * 100)}%
                </span>
              </li>
            ))}
          </ul>
        </div>
      ) : null}

      {done > 0 || emotionRows.length > 0 ? (
        <button
          type="button"
          onClick={() => setProgress(resetProgress())}
          className="hit-area mt-7 inline-flex items-center gap-2 rounded-lg border border-border px-4 py-2.5 text-[0.9375rem] text-muted-foreground transition-colors hover:text-foreground"
        >
          <RotateCcw className="h-4 w-4" aria-hidden />
          清除進度重新開始
        </button>
      ) : (
        <p className="mt-7 text-[1rem] leading-relaxed text-muted-foreground">
          還沒有紀錄。破了第一件案子之後，這裡會出現你認得的情緒。
        </p>
      )}
    </div>
  );
}

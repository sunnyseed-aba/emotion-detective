/**
 * 結案評分卡。低刺激原則：分數只肯定進展，最低 60 分，任何區間都給正向語句。
 */
import { Sprout, Star } from "lucide-react";
import type { CaseScore } from "@/game/scoring";

export function ScoreCard({ score }: { score: CaseScore }) {
  return (
    <div
      className="mt-6 rounded-xl border-2 px-5 py-5"
      style={{ borderColor: "oklch(0.6 0.1 148)", background: "oklch(0.96 0.028 148)" }}
    >
      <div className="flex items-start gap-3">
        <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-white/70 text-[var(--brand-seed)]">
          <Sprout className="h-6 w-6" aria-hidden />
        </span>
        <div>
          <p className="text-[1.25rem] font-medium">五個推理步驟都完成了</p>
          <p className="mt-1 text-[1rem] leading-relaxed text-muted-foreground">{score.praise}</p>
        </div>
      </div>

      <details className="mt-4 rounded-lg border border-border/80 bg-white/55 px-4 py-3">
        <summary className="cursor-pointer text-[0.9375rem] font-medium text-muted-foreground">
          查看這次的偵探紀錄
        </summary>
        <div className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-3">
        {/* 星等 */}
        <div className="flex items-center gap-1.5" aria-label={`${score.stars} 顆星`}>
          {[1, 2, 3].map((i) => (
            <Star
              key={i}
              className="h-8 w-8 transition-transform"
              style={{
                color: i <= score.stars ? "oklch(0.68 0.14 72)" : "oklch(0.86 0.02 84)",
                fill: i <= score.stars ? "oklch(0.78 0.15 78)" : "transparent",
                animation:
                  i <= score.stars
                    ? `stampIn 380ms var(--ease-out) ${i * 140}ms both`
                    : undefined,
              }}
              aria-hidden
            />
          ))}
        </div>

        {/* 分數 */}
        <div className="ml-auto text-right">
          <p
            className="font-file text-[2rem] leading-none"
            style={{ color: "oklch(0.4 0.09 148)" }}
          >
            {score.percent}
            <span className="text-[1.125rem]"> 分</span>
          </p>
          <p className="font-file mt-1 text-[0.8125rem] tracking-widest text-muted-foreground">
            {score.rank}
          </p>
        </div>
        </div>

      {/* 進度條 */}
      <div
        className="mt-4 h-2.5 w-full overflow-hidden rounded-full"
        style={{ background: "oklch(0.9 0.02 148)" }}
      >
        <div
          className="h-full rounded-full"
          style={{
            width: `${score.percent}%`,
            background: "oklch(0.58 0.11 148)",
            transition: "width 900ms var(--ease-out) 260ms",
          }}
        />
      </div>

      <p className="font-file mt-2.5 text-[0.9375rem] text-muted-foreground">
        五個步驟中，有 {score.firstTryCount} 個是第一次就答對的。
      </p>
      </details>
    </div>
  );
}

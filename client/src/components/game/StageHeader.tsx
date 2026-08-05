/**
 * 關卡進度列。以卷宗標籤形式呈現五個階段，不使用倒數計時或分數壓力。
 */
import { cn } from "@/lib/utils";
import { STAGE_META, STAGE_ORDER, type CaseStage } from "@/game/types";
import { StageIcon } from "./StageIcon";

interface Props {
  current: CaseStage;
}

export function StageHeader({ current }: Props) {
  const currentIndex = STAGE_ORDER.indexOf(current);

  return (
    <ol className="flex flex-wrap items-center gap-x-2 gap-y-2">
      {STAGE_ORDER.filter((s) => s !== "debrief").map((stage, i) => {
        const meta = STAGE_META[stage];
        const done = i < currentIndex;
        const active = stage === current;
        return (
          <li
            key={stage}
            className={cn(
              "flex min-h-12 items-center gap-2 rounded-xl border px-3 py-2 transition-colors duration-200",
              active ? "border-transparent" : "border-border",
            )}
            style={
              active
                ? { background: "var(--ink)", color: "oklch(0.965 0.012 86)" }
                : done
                  ? { background: "oklch(0.9 0.028 82)" }
                  : { background: "transparent", opacity: 0.6 }
            }
            aria-current={active ? "step" : undefined}
          >
            <StageIcon stage={stage} className="h-4 w-4" />
            <span className="text-[0.9375rem] font-medium">{meta.label}</span>
          </li>
        );
      })}
    </ol>
  );
}

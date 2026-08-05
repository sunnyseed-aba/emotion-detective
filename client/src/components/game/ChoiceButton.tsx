/**
 * 作答選項按鈕。低刺激規範：命中區 ≥ 52px、答錯不用紅色與震動，
 * 改為卡片輕輕退回原位並淡化，保留再試一次的尊嚴。
 */
import { useEffect, useState } from "react";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

interface Props {
  label: string;
  icon?: ReactNode;
  onSelect: () => void;
  /** 已被判定為不是答案 → 淡化但仍可讀 */
  ruledOut?: boolean;
  /** 已答對 */
  solved?: boolean;
  disabled?: boolean;
  /** 觸發一次「輕輕退回」動畫的訊號 */
  nudgeKey?: number;
}

export function ChoiceButton({
  label,
  icon,
  onSelect,
  ruledOut,
  solved,
  disabled,
  nudgeKey,
}: Props) {
  const [nudging, setNudging] = useState(false);

  useEffect(() => {
    if (!nudgeKey) return;
    setNudging(true);
    const t = setTimeout(() => setNudging(false), 440);
    return () => clearTimeout(t);
  }, [nudgeKey]);

  return (
    <button
      type="button"
      onClick={onSelect}
      disabled={disabled}
      aria-pressed={solved}
      className={cn(
        "file-card hit-area flex w-full items-center gap-3 rounded-xl px-5 py-4 text-left",
        "text-[1.0625rem] leading-relaxed transition-[transform,box-shadow,opacity]",
        "duration-[160ms] ease-[var(--ease-out)]",
        "hover:-translate-y-[2px] active:scale-[0.985]",
        "focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
        ruledOut && "opacity-55",
        solved && "border-2 hit-pulse",
        disabled && "cursor-default hover:translate-y-0",
        nudging && "nudge-back",
      )}
      style={
        solved
          ? {
              borderColor: "oklch(0.58 0.11 148)",
              background: "oklch(0.955 0.035 148)",
            }
          : undefined
      }
    >
      <span
        className={cn(
          "mt-[2px] flex h-7 w-7 shrink-0 items-center justify-center rounded-full border",
          solved ? "border-transparent" : "border-border bg-background",
        )}
        style={solved ? { background: "oklch(0.55 0.11 148)" } : undefined}
        aria-hidden
      >
        {solved ? (
          <Check
            className="h-4.5 w-4.5"
            style={{ color: "oklch(0.98 0.01 148)" }}
            strokeWidth={3}
          />
        ) : null}
      </span>
      {icon}
      <span className={cn(solved && "font-medium")}>{label}</span>
    </button>
  );
}

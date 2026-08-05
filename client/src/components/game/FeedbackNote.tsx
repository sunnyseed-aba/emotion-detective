/**
 * 回饋便條紙。刻意略帶旋轉角度，避免規整對齊（見 ideas.md 佈局段）。
 * 答錯時使用中性的紙色而非紅色警示。
 */
import { Lightbulb, Stamp } from "lucide-react";
import { cn } from "@/lib/utils";

interface Props {
  correct: boolean;
  text: string;
  className?: string;
}

export function FeedbackNote({ correct, text, className }: Props) {
  return (
    <div
      className={cn(
        "stage-enter file-card flex gap-3 rounded-xl px-5 py-4 text-[1rem] leading-relaxed",
        className,
      )}
      style={{
        background: correct ? "oklch(0.955 0.03 128)" : "oklch(0.945 0.022 84)",
        borderColor: correct ? "oklch(0.7 0.06 130)" : "var(--border)",
        transform: "rotate(-0.5deg)",
      }}
      role="status"
      aria-live="polite"
    >
      <span className="mt-[3px] shrink-0" style={{ color: "var(--ink)" }} aria-hidden>
        {correct ? <Stamp className="h-5 w-5" /> : <Lightbulb className="h-5 w-5" />}
      </span>
      <p className="text-foreground">{text}</p>
    </div>
  );
}

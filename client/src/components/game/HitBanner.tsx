/**
 * 答對強化回饋橫幅。
 * 設計意圖：答對需要「明顯」的視覺確認，但不能刺眼。
 * 做法是綠意色塊 + 打勾蓋章動效 + 短句肯定語，一次給足三種訊號。
 */
import { Check } from "lucide-react";

export function HitBanner({ line, detail }: { line: string; detail?: string }) {
  return (
    <div
      className="stamp-in mt-5 flex items-start gap-3.5 rounded-xl border-2 px-4 py-4"
      style={{
        borderColor: "oklch(0.6 0.1 148)",
        background: "oklch(0.955 0.035 148)",
      }}
      role="status"
    >
      <span
        className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-full"
        style={{ background: "oklch(0.55 0.11 148)" }}
        aria-hidden
      >
        <Check className="h-5 w-5" style={{ color: "oklch(0.98 0.01 148)" }} strokeWidth={3} />
      </span>
      <span>
        <span
          className="block text-[1.125rem] font-medium"
          style={{ color: "oklch(0.4 0.09 148)" }}
        >
          {line}
        </span>
        {detail ? (
          <span className="mt-1.5 block text-[1.0625rem] leading-[1.75] text-foreground">
            {detail}
          </span>
        ) : null}
      </span>
    </div>
  );
}

/**
 * ABC 因果鏈 — 橫式表格版。
 * 互動：先點上方待歸位卡片（橫向排列），再點下方 A／B／C 欄位，卡片會移入該欄。
 * 低刺激：放錯不用紅色、不震動，只讓卡片輕輕退回原位並給文字提示。
 */
import { useState } from "react";
import { Check } from "lucide-react";
import { ABC_SLOTS, ABC_SLOT_META } from "@/game/engine";
import type { AbcSlot } from "@/game/engine";
import type { AbcCard } from "@/game/types";
import { cn } from "@/lib/utils";

interface Props {
  cards: AbcCard[];
  placement: Record<string, AbcSlot | null>;
  onPlace: (cardId: string, slot: AbcSlot) => boolean;
  /** 代名詞（他／她），用於欄位提示語 */
  pronoun: string;
}

export function AbcBoard({ cards, placement, onPlace, pronoun }: Props) {
  const [picked, setPicked] = useState<string | null>(null);
  const [wobble, setWobble] = useState(0);
  const [justPlaced, setJustPlaced] = useState<AbcSlot | null>(null);

  const pending = cards.filter((c) => !placement[c.id]);

  function handleSlot(slot: AbcSlot) {
    if (!picked) return;
    const ok = onPlace(picked, slot);
    if (ok) {
      setPicked(null);
      setJustPlaced(slot);
      window.setTimeout(() => setJustPlaced(null), 700);
    } else {
      setWobble(Date.now());
    }
  }

  return (
    <div className="mt-5">
      {/* 上方：待歸位卡片，橫向排列 */}
      <p className="font-file text-[0.8125rem] tracking-widest text-muted-foreground">
        線索卡（{pending.length} 張待歸位）
      </p>
      <div className="mt-2.5 grid gap-2.5 sm:grid-cols-3">
        {pending.length === 0 ? (
          <p className="col-span-full rounded-xl border border-dashed border-border px-4 py-5 text-center text-[1rem] text-muted-foreground">
            三張卡都歸位了。
          </p>
        ) : (
          pending.map((card) => {
            const active = picked === card.id;
            return (
              <button
                key={card.id + (active && wobble ? wobble : "")}
                type="button"
                onClick={() => setPicked((p) => (p === card.id ? null : card.id))}
                aria-pressed={active}
                className={cn(
                  "file-card hit-area rounded-xl px-3.5 py-3.5 text-left text-[1rem] leading-[1.65]",
                  "transition-[transform,box-shadow,border-color] duration-[150ms] ease-[var(--ease-out)]",
                  active
                    ? "-translate-y-[5px] border-2 shadow-lg"
                    : "hover:-translate-y-[2px] active:scale-[0.985]",
                  active && wobble ? "nudge-back" : "",
                )}
                style={active ? { borderColor: "var(--ink)" } : undefined}
              >
                {card.text}
              </button>
            );
          })
        )}
      </div>

      {/* 提示語：明確說明兩步操作 */}
      <p className="mt-4 text-[0.9375rem] text-muted-foreground">
        {picked
          ? "已選好一張卡。現在點下方它該去的欄位。"
          : "先點上面一張卡，再點下面的欄位。"}
      </p>

      {/* 下方：A／B／C 三欄橫向表格 */}
      <div className="mt-3 grid gap-2.5 sm:grid-cols-3">
        {ABC_SLOTS.map((slot, i) => {
          const placed = cards.find((c) => placement[c.id] === slot);
          const meta = ABC_SLOT_META[slot];
          const isTarget = !placed && !!picked;
          return (
            <button
              key={slot}
              type="button"
              onClick={() => handleSlot(slot)}
              disabled={!!placed || !picked}
              className={cn(
                "hit-area relative flex min-h-[168px] flex-col rounded-xl border-2 px-3.5 py-3.5 text-left",
                "transition-[background-color,border-color,transform] duration-200 ease-[var(--ease-out)]",
                placed ? "border-solid" : "border-dashed",
                isTarget && "cursor-pointer hover:-translate-y-[3px]",
                justPlaced === slot && "stamp-in",
              )}
              style={{
                borderColor: placed
                  ? "var(--ink)"
                  : isTarget
                    ? "oklch(0.55 0.09 148)"
                    : "var(--border)",
                background: placed
                  ? "var(--card-stock)"
                  : isTarget
                    ? "oklch(0.95 0.03 148)"
                    : "transparent",
              }}
            >
              {/* 欄頭 */}
              <span className="flex items-center gap-2">
                <span
                  className="font-file flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-[1rem]"
                  style={{
                    background: placed ? "var(--ink)" : "oklch(0.9 0.028 82)",
                    color: placed ? "oklch(0.965 0.012 86)" : "var(--ink)",
                  }}
                  aria-hidden
                >
                  {meta.code}
                </span>
                <span className="text-[1.0625rem] font-medium">{meta.label}</span>
                {placed ? (
                  <Check
                    className="ml-auto h-5 w-5"
                    style={{ color: "oklch(0.5 0.1 148)" }}
                    aria-hidden
                  />
                ) : null}
              </span>

              {/* 欄內容 */}
              <span className="mt-2.5 block text-[1rem] leading-[1.7]">
                {placed ? (
                  placed.text
                ) : (
                  <span className="text-muted-foreground">
                    {meta.hint.replaceAll("他", pronoun)}
                  </span>
                )}
              </span>

              {/* 流向箭頭（僅前兩欄，桌機顯示） */}
              {i < 2 ? (
                <span
                  className="absolute top-1/2 -right-[13px] hidden -translate-y-1/2 text-[1.25rem] sm:block"
                  style={{ color: "oklch(0.75 0.03 80)" }}
                  aria-hidden
                >
                  ›
                </span>
              ) : null}
            </button>
          );
        })}
      </div>
    </div>
  );
}

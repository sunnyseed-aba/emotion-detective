/**
 * 案件舞台 — 顯示本案背景、落地定位的角色，與可點的關鍵物件熱點。
 *
 * 定位規則（重要）：
 * placement.y 代表「角色腳底那條地面線」在舞台高度的百分比位置。
 * 角色圖以 bottom 對齊該線，所以只要 y 標對，人物就不會浮空。
 * 坐姿角色（sit: true）的 y 對齊椅面，圖檔本身已包含垂下的小腿。
 *
 * 視覺規範：背景低對比、人物是畫面中對比最高的元素，
 * 因此背景加一層極輕的紙色遮罩降對比，人物不加任何濾鏡。
 */
import { useState } from "react";
import { cn } from "@/lib/utils";
import type { Case, GameScene } from "@/game/types";

interface Props {
  scene: GameScene;
  activeCase: Case;
  /** 物件熱點是否可點（僅觀察階段開放） */
  propsInteractive?: boolean;
  /** 點選物件時同步揭露線索 */
  onPropClick?: (clueId?: string) => void;
  /** 已被點過的物件 id */
  openedProps?: string[];
  className?: string;
}

export function CaseStage({
  scene,
  activeCase,
  propsInteractive,
  onPropClick,
  openedProps = [],
  className,
}: Props) {
  const [hovered, setHovered] = useState<string | null>(null);
  const backdrop = activeCase.backdrop ?? scene.backdrop;
  const propList = activeCase.props ?? [];

  return (
    <div
      className={cn(
        "relative w-full overflow-hidden rounded-xl border border-border",
        "aspect-[16/9] bg-secondary",
        className,
      )}
    >
      <img
        src={backdrop}
        alt={`${activeCase.title}場景`}
        className="absolute inset-0 h-full w-full object-cover"
      />
      {/* 降低背景對比，讓人物臉部成為視覺焦點 */}
      <div
        className="absolute inset-0"
        style={{ background: "oklch(0.95 0.02 84 / 0.22)" }}
      />

      {activeCase.characters.map((ch) => (
        <img
          key={ch.id}
          src={ch.sprite}
          alt={ch.name}
          className="absolute select-none"
          style={{
            left: `${ch.placement.x}%`,
            bottom: `${100 - ch.placement.y}%`,
            height: `${64 * ch.placement.scale}%`,
            transform: `translateX(-50%)${ch.placement.flip ? " scaleX(-1)" : ""}`,
            zIndex: ch.placement.layer,
            /* 接地陰影：緊貼腳底的窄投影，讓人物看起來踩在地面上 */
            filter: ch.placement.sit
              ? "drop-shadow(0 4px 8px oklch(0.32 0.045 62 / 0.16))"
              : "drop-shadow(0 3px 4px oklch(0.32 0.045 62 / 0.28)) drop-shadow(0 10px 16px oklch(0.32 0.045 62 / 0.14))",
          }}
          draggable={false}
        />
      ))}

      {/* 關鍵物件熱點 */}
      {propList.map((p, i) => {
        const opened = openedProps.includes(p.id);
        const show = hovered === p.id;
        return (
          <button
            key={p.id}
            type="button"
            disabled={!propsInteractive}
            onClick={() => onPropClick?.(p.clueId)}
            onMouseEnter={() => setHovered(p.id)}
            onMouseLeave={() => setHovered(null)}
            onFocus={() => setHovered(p.id)}
            onBlur={() => setHovered(null)}
            aria-label={`${p.label}：${p.note}`}
            className={cn(
              "absolute z-20 -translate-x-1/2 -translate-y-1/2 rounded-full",
              "transition-[transform,opacity] duration-200 ease-[var(--ease-out)]",
              propsInteractive
                ? "cursor-pointer hover:scale-110"
                : "pointer-events-none opacity-0",
            )}
            style={{ left: `${p.x}%`, top: `${p.y}%` }}
          >
            {/* 標記圈：編號環，低刺激不閃爍，但足以辨識 */}
            <span
              className="font-file flex h-10 w-10 items-center justify-center rounded-full border-2 text-[0.875rem] font-bold tabular-nums"
              style={{
                borderColor: opened
                  ? "oklch(0.55 0.1 148 / 0.95)"
                  : "oklch(0.99 0.005 86 / 0.95)",
                background: opened
                  ? "oklch(0.9 0.05 148 / 0.85)"
                  : "oklch(0.32 0.045 62 / 0.62)",
                color: opened
                  ? "oklch(0.34 0.06 150)"
                  : "oklch(0.99 0.005 86)",
                boxShadow: "0 2px 6px oklch(0.28 0.04 62 / 0.35)",
                backdropFilter: "blur(1.5px)",
              }}
            >
              {opened ? "✓" : i + 1}
            </span>
            {/* 名稱氣泡 */}
            <span
              className={cn(
                "font-file pointer-events-none absolute left-1/2 -translate-x-1/2 whitespace-nowrap rounded-md px-2.5 py-1.5 text-[0.8125rem]",
                "transition-opacity duration-150",
                show ? "opacity-100" : "opacity-0",
              )}
              style={{
                bottom: "calc(100% + 6px)",
                background: "oklch(0.32 0.045 62 / 0.92)",
                color: "oklch(0.97 0.012 86)",
              }}
            >
              {p.label}
            </span>
          </button>
        );
      })}
    </div>
  );
}

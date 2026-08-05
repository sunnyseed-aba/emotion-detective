/**
 * 案件清單 — 顯示單一場景下的所有案子。
 * 不鎖關卡（低壓力原則），已破案的案子蓋上「已破案」章。
 */
import { Link, useParams } from "wouter";
import { ArrowLeft, ArrowRight, Stamp } from "lucide-react";
import { useEffect, useState } from "react";
import { getScene } from "@/game/scenes";
import { loadProgress } from "@/game/progress";
import { EMOTIONS } from "@/game/emotions";

export default function SceneCases() {
  const { sceneId } = useParams<{ sceneId: string }>();
  const scene = getScene(sceneId);
  const [completed, setCompleted] = useState<string[]>([]);

  useEffect(() => {
    setCompleted(loadProgress().completedCases);
  }, []);

  if (!scene) {
    return (
      <div className="mx-auto max-w-2xl px-5 py-20">
        <p className="text-[1.125rem]">找不到這個場景。</p>
        <Link href="/scenes" className="mt-4 inline-block underline">
          回場景選擇
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <div className="mx-auto max-w-4xl px-5 py-10 lg:py-14">
        <Link
          href="/scenes"
          className="hit-area inline-flex items-center gap-2 rounded-lg px-3 py-2 text-[1rem] text-muted-foreground transition-colors hover:text-foreground"
        >
          <ArrowLeft className="h-5 w-5" aria-hidden />
          換個場景
        </Link>

        <div className="mt-8 flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="font-file text-[0.8125rem] uppercase tracking-widest text-muted-foreground">
              {scene.id}
            </p>
            <h1 className="text-[2rem] lg:text-[2.5rem]" style={{ color: "var(--ink)" }}>
              {scene.name}的案子
            </h1>
          </div>
          <p className="text-[1rem] text-muted-foreground">{scene.tagline}</p>
        </div>

        <ul className="mt-10 space-y-5">
          {scene.cases.map((c, i) => {
            const done = completed.includes(c.id);
            const emotion = EMOTIONS[c.targetEmotion];
            return (
              <li key={c.id}>
                <Link
                  href={`/play/${scene.id}/${c.id}`}
                  className="file-card group relative flex items-start gap-5 rounded-2xl px-6 py-6 transition-transform duration-[200ms] ease-[var(--ease-out)] hover:-translate-y-[3px]"
                  style={{ transform: `rotate(${i % 2 ? 0.25 : -0.25}deg)` }}
                >
                  {/* 情緒染料色書籤：只在破案後顯示，避免提前洩漏答案 */}
                  <span
                    className="mt-1 h-12 w-2 shrink-0 rounded-full"
                    style={{
                      background: done ? emotion.color : "oklch(0.86 0.02 80)",
                    }}
                    aria-hidden
                  />
                  {/* 案件縮圖：讓清單也看得到現場，而不是只有文字 */}
                  <span className="hidden h-24 w-36 shrink-0 overflow-hidden rounded-xl border border-border sm:block">
                    <img
                      src={c.backdrop ?? scene.backdrop}
                      alt={`${c.title}現場`}
                      className="h-full w-full object-cover transition-transform duration-[400ms] ease-[var(--ease-out)] group-hover:scale-[1.04]"
                    />
                  </span>
                  <div className="flex-1">
                    <p className="font-file text-[0.8125rem] tracking-widest text-muted-foreground">
                      {c.fileNo}
                    </p>
                    <h2 className="mt-1 text-[1.375rem]" style={{ color: "var(--ink)" }}>
                      {c.title}
                    </h2>
                    <p className="mt-2 line-clamp-2 text-[1.0625rem] leading-relaxed text-foreground">
                      {c.brief}
                    </p>
                    <p className="font-file mt-3 flex items-center gap-2 text-[0.9375rem] text-muted-foreground">
                      {done ? `已破案 · ${emotion.label}` : "尚未偵辦"}
                      <ArrowRight
                        className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1"
                        aria-hidden
                      />
                    </p>
                  </div>
                  {done ? (
                    <Stamp
                      className="absolute right-6 top-6 h-8 w-8 opacity-70"
                      style={{ color: "var(--ink)", transform: "rotate(-8deg)" }}
                      aria-hidden
                    />
                  ) : null}
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}

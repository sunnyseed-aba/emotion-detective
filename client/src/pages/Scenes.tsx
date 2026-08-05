/**
 * 場景選擇 — 三個場景以卷宗卡呈現，非對稱錯落排列。
 * 場景資料全部來自 SCENES 註冊表，新增場景無需修改本頁。
 */
import { Link } from "wouter";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { useEffect, useState } from "react";
import { SCENES } from "@/game/scenes";
import { loadProgress } from "@/game/progress";
import { LOGO_URL } from "@/game/assets";

export default function Scenes() {
  const [completed, setCompleted] = useState<string[]>([]);

  useEffect(() => {
    setCompleted(loadProgress().completedCases);
  }, []);

  return (
    <div className="min-h-screen">
      <div className="mx-auto max-w-5xl px-5 py-10 lg:py-14">
        <div className="flex items-center justify-between gap-4">
          <Link
            href="/"
            className="hit-area inline-flex items-center gap-2 rounded-lg px-3 py-2 text-[1rem] text-muted-foreground transition-colors hover:text-foreground"
          >
            <ArrowLeft className="h-5 w-5" aria-hidden />
            回事務所
          </Link>
          <img src={LOGO_URL} alt="" className="h-10 w-10" aria-hidden />
        </div>

        <h1 className="mt-8 text-[2rem] lg:text-[2.5rem]" style={{ color: "var(--ink)" }}>
          今天要去哪裡辦案？
        </h1>
        <p className="mt-3 max-w-xl text-[1.0625rem] leading-[1.8] text-muted-foreground">
          每個地方都有不同的人、不同的規則，也就有不同的誤會。
        </p>

        <div className="mt-10 space-y-6">
          {SCENES.map((scene, i) => {
            const done = scene.cases.filter((c) => completed.includes(c.id)).length;
            return (
              <Link
                key={scene.id}
                href={`/scenes/${scene.id}`}
                className="file-card group block overflow-hidden rounded-2xl transition-transform duration-[200ms] ease-[var(--ease-out)] hover:-translate-y-[3px]"
                style={{
                  marginLeft: i % 2 === 1 ? "0" : undefined,
                  marginRight: i % 2 === 1 ? "auto" : undefined,
                  maxWidth: i % 2 === 1 ? "94%" : "100%",
                  transform: `rotate(${i % 2 === 1 ? 0.3 : -0.3}deg)`,
                }}
              >
                <div className="flex flex-col sm:flex-row">
                  <div className="relative h-44 shrink-0 overflow-hidden sm:h-auto sm:w-64">
                    <img
                      src={scene.backdrop}
                      alt=""
                      className="h-full w-full object-cover"
                      aria-hidden
                    />
                    <div
                      className="absolute inset-0"
                      style={{ background: "oklch(0.95 0.02 84 / 0.2)" }}
                    />
                  </div>
                  <div className="flex flex-1 flex-col justify-center gap-2 px-6 py-6">
                    <p className="font-file text-[0.8125rem] uppercase tracking-widest text-muted-foreground">
                      Scene {String(i + 1).padStart(2, "0")}
                    </p>
                    <h2 className="text-[1.625rem]" style={{ color: "var(--ink)" }}>
                      {scene.name}
                    </h2>
                    <p className="text-[1.0625rem] leading-relaxed text-foreground">
                      {scene.tagline}
                    </p>
                    <p className="font-file mt-1 flex items-center gap-2 text-[0.9375rem] text-muted-foreground">
                      {scene.cases.length} 件案子 · 已破 {done} 件
                      <ArrowRight
                        className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1"
                        aria-hidden
                      />
                    </p>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}

/**
 * 首頁 — 情緒偵探社入口。
 * 風格：檔案桌面佈局（非居中網格），牛皮紙底 + 檔案墨褐骨架色。
 * 語氣：資深偵探對小助手說話，邀請觀察、不下評斷。
 */
import { Link } from "wouter";
import { ArrowRight, Search } from "lucide-react";
import { SCENES } from "@/game/scenes";
import { STAGE_META, STAGE_ORDER } from "@/game/types";
import { LOGO_URL } from "@/game/assets";
import { ProgressSummary } from "@/components/game/ProgressSummary";

export default function Home() {
  const caseCount = SCENES.reduce((n, s) => n + s.cases.length, 0);

  return (
    <div className="min-h-screen">
      <div className="mx-auto grid max-w-6xl gap-10 px-5 py-12 lg:grid-cols-[1fr_20rem] lg:gap-14 lg:py-20">
        {/* 主卷宗封面 */}
        <div>
          <div className="flex items-center gap-4">
            <img src={LOGO_URL} alt="" className="h-16 w-16" aria-hidden />
            <div>
              <p className="font-file text-[0.8125rem] uppercase tracking-widest text-muted-foreground">
                Case File · 情緒偵探社
              </p>
              <h1
                className="text-[2.5rem] leading-tight lg:text-[3.25rem]"
                style={{ color: "var(--ink)" }}
              >
                情緒偵探社
              </h1>
            </div>
          </div>

          <p className="mt-8 max-w-xl text-[1.1875rem] leading-[1.85] text-foreground">
            先別急著結案。臉上在說一件事，心裡可能在說另一件。
            我們一起收集線索，把「他／她為什麼這樣想」找出來。
          </p>

          <div className="mt-9 flex flex-wrap items-center gap-4">
            <Link
              href="/scenes"
              className="hit-area inline-flex items-center gap-2 rounded-xl px-7 py-4 text-[1.125rem] font-medium transition-transform duration-[160ms] ease-[var(--ease-out)] active:scale-[0.97]"
              style={{ background: "var(--ink)", color: "oklch(0.965 0.012 86)" }}
            >
              <Search className="h-5 w-5" aria-hidden />
              開始辦案
              <ArrowRight className="h-5 w-5" aria-hidden />
            </Link>
            <p className="font-file text-[0.9375rem] text-muted-foreground">
              目前共 {SCENES.length} 個場景 · {caseCount} 件案子
            </p>
          </div>

          {/* 五個階段說明：橫向卷宗標籤 */}
          <div className="mt-14">
            <h2 className="font-file text-[0.875rem] uppercase tracking-widest text-muted-foreground">
              每件案子的五個步驟
            </h2>
            <ol className="mt-5 space-y-3">
              {STAGE_ORDER.filter((s) => s !== "debrief").map((stage) => {
                const meta = STAGE_META[stage];
                return (
                  <li
                    key={stage}
                    className="file-card flex items-center gap-4 rounded-xl px-5 py-4"
                    style={{ transform: `rotate(${(meta.step % 2 ? -0.35 : 0.35).toFixed(2)}deg)` }}
                  >
                    <span
                      className="font-file flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-[0.9375rem]"
                      style={{ background: "oklch(0.9 0.028 82)", color: "var(--ink)" }}
                    >
                      {meta.step}
                    </span>
                    <span className="text-[1.0625rem] font-medium">{meta.label}</span>
                    <span className="ml-auto font-file text-[0.875rem] text-muted-foreground">
                      {meta.goal}
                    </span>
                  </li>
                );
              })}
            </ol>
          </div>
        </div>

        {/* 側欄：進度摘要 */}
        <aside className="lg:pt-6">
          <ProgressSummary />
        </aside>
      </div>
    </div>
  );
}

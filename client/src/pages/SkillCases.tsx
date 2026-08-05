import { useState } from "react";
import { ArrowLeft, ArrowRight, Sprout } from "lucide-react";
import { Link } from "wouter";
import { SunnySeedsSignature } from "@/components/brand/SunnySeedsSignature";
import { ALL_CASES } from "@/game/scenes";
import { SEL_SKILLS, type SelSkillId } from "@/game/sel";

export default function SkillCases() {
  const available = (Object.keys(SEL_SKILLS) as SelSkillId[]).filter((skill) =>
    ALL_CASES.some(({ case: activeCase }) => activeCase.selSkills.includes(skill)),
  );
  const upcoming = (Object.keys(SEL_SKILLS) as SelSkillId[]).filter(
    (skill) => !available.includes(skill),
  );
  const [selected, setSelected] = useState<SelSkillId>(available[0]);
  const matches = ALL_CASES.filter(({ case: activeCase }) => activeCase.selSkills.includes(selected));

  return (
    <div className="sunny-page min-h-screen">
      <div className="mx-auto max-w-5xl px-5 py-10 lg:py-14">
        <div className="flex items-center justify-between gap-4">
          <Link href="/scenes" className="hit-area inline-flex items-center gap-2 rounded-lg px-3 py-2 text-muted-foreground">
            <ArrowLeft className="h-5 w-5" aria-hidden />
            回場景選擇
          </Link>
          <SunnySeedsSignature />
        </div>

        <h1 className="mt-8 text-[2rem] lg:text-[2.5rem]" style={{ color: "var(--ink)" }}>想練習哪一種能力？</h1>
        <p className="mt-3 text-[1.0625rem] leading-relaxed text-muted-foreground">
          可依孩子目前的學習目標選案，不需要按照場景或難度順序。
        </p>

        <div className="mt-7 flex flex-wrap gap-3" role="tablist" aria-label="學習目標">
          {available.map((skill) => (
            <button
              key={skill}
              type="button"
              role="tab"
              aria-selected={selected === skill}
              onClick={() => setSelected(skill)}
              className={selected === skill ? "sel-filter is-selected" : "sel-filter"}
            >
              {SEL_SKILLS[skill].label}
            </button>
          ))}
        </div>

        <div className="mt-8 rounded-2xl border border-border bg-white/45 p-5">
          <p className="font-medium text-[var(--ink)]">{SEL_SKILLS[selected].label}</p>
          <p className="mt-1 text-muted-foreground">{SEL_SKILLS[selected].short}</p>
        </div>

        <ul className="mt-6 grid gap-5 sm:grid-cols-2">
          {matches.map(({ sceneId, sceneName, backdrop, case: activeCase }) => (
            <li key={activeCase.id}>
              <Link href={`/play/${sceneId}/${activeCase.id}`} className="file-card group block h-full overflow-hidden rounded-2xl">
                <img src={backdrop} alt={`${activeCase.title}現場`} className="h-40 w-full object-cover" />
                <div className="p-5">
                  <p className="font-file text-[0.8125rem] text-muted-foreground">{sceneName} · {activeCase.fileNo}</p>
                  <h2 className="mt-1 text-[1.25rem] text-[var(--ink)]">{activeCase.title}</h2>
                  <p className="mt-3 flex items-center gap-2 text-[0.9375rem] font-medium text-[var(--brand-seed)]">
                    開始這件案子 <ArrowRight className="h-4 w-4" aria-hidden />
                  </p>
                </div>
              </Link>
            </li>
          ))}
        </ul>

        <section className="mt-12 border-t border-border pt-7">
          <div className="flex items-center gap-2 text-[var(--ink)]">
            <Sprout className="h-5 w-5" aria-hidden />
            <h2 className="text-[1.25rem]">下一批實務類別</h2>
          </div>
          <div className="mt-4 flex flex-wrap gap-2">
            {upcoming.map((skill) => <span key={skill} className="sel-skill-chip is-upcoming">{SEL_SKILLS[skill].label} · 待新增案件</span>)}
          </div>
        </section>
      </div>
    </div>
  );
}

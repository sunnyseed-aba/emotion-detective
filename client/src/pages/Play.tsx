/**
 * 關卡頁 — 五階段 + 結案報告。
 * 風格：檔案桌面佈局（左舞台／右卷宗），墨褐骨架色，牛皮紙底。
 * 低刺激：答錯不用紅色與震動、無倒數、無音效、命中區 ≥ 52px。
 * 代名詞一律透過 pronoun.ts 產生，避免對女性角色誤用「他」。
 * 本頁完全由 Case 資料驅動，不含任何案件專屬邏輯。
 */
import { useEffect, useMemo, useRef, useState } from "react";
import { Link, useParams } from "wouter";
import { ArrowLeft, ArrowRight, Eye, RotateCcw, Stamp } from "lucide-react";
import { getCase, getScene } from "@/game/scenes";
import { EMOTIONS } from "@/game/emotions";
import { STAGE_META } from "@/game/types";
import type { Choice, Clue, EmotionId } from "@/game/types";
import { useCaseEngine } from "@/game/engine";
import { pronounOf } from "@/game/pronoun";
import { scoreCase, stageHitLine } from "@/game/scoring";
import { CaseStage } from "@/components/game/CaseStage";
import { AbcBoard } from "@/components/game/AbcBoard";
import { ChoiceButton } from "@/components/game/ChoiceButton";
import { FeedbackNote } from "@/components/game/FeedbackNote";
import { HitBanner } from "@/components/game/HitBanner";
import { ScoreCard } from "@/components/game/ScoreCard";
import { StageHeader } from "@/components/game/StageHeader";
import { cn } from "@/lib/utils";

const CLUE_KIND_LABEL: Record<Clue["kind"], string> = {
  face: "表情",
  body: "肢體",
  context: "情境",
};

export default function Play() {
  const { sceneId, caseId } = useParams<{ sceneId: string; caseId: string }>();
  const scene = getScene(sceneId);
  const activeCase = getCase(sceneId, caseId);

  if (!scene || !activeCase) {
    return (
      <div className="mx-auto max-w-2xl px-5 py-20">
        <p className="text-[1.125rem]">找不到這件案子。</p>
        <Link href="/scenes" className="mt-4 inline-block underline">
          回場景選擇
        </Link>
      </div>
    );
  }

  return <CaseRunner key={activeCase.id} scene={scene} activeCase={activeCase} />;
}

function CaseRunner({
  scene,
  activeCase,
}: {
  scene: NonNullable<ReturnType<typeof getScene>>;
  activeCase: NonNullable<ReturnType<typeof getCase>>;
}) {
  const engine = useCaseEngine(activeCase);
  const { state } = engine;
  const [nudge, setNudge] = useState<{ id: string; key: number } | null>(null);
  const [solvedChoice, setSolvedChoice] = useState<string | null>(null);
  const [openedProps, setOpenedProps] = useState<string[]>([]);
  const panelRef = useRef<HTMLDivElement>(null);

  const pronoun = pronounOf(activeCase);
  const emotion = EMOTIONS[activeCase.targetEmotion];

  useEffect(() => {
    setSolvedChoice(null);
    panelRef.current?.scrollTo({ top: 0, behavior: "smooth" });
  }, [state.stage]);

  const score = useMemo(
    () => scoreCase(state.results, activeCase.id),
    [state.results, activeCase.id],
  );

  function handleChoice(choice: Choice) {
    if (solvedChoice) return;
    const ok = engine.submitChoice(choice.id, choice.correct, choice.feedback);
    if (ok) setSolvedChoice(choice.id);
    else setNudge({ id: choice.id, key: Date.now() });
  }

  function handleEmotionChoice(id: EmotionId) {
    if (solvedChoice) return;
    const correct = id === activeCase.targetEmotion;
    const e = EMOTIONS[id];
    const feedback = correct
      ? `${e.label}：${e.plain}`
      : `再看一次線索。${e.label}的身體訊號通常是：${e.bodyCues.join("、")}。這次看到的不太一樣。`;
    const ok = engine.submitChoice(id, correct, feedback);
    if (ok) setSolvedChoice(id);
    else setNudge({ id, key: Date.now() });
  }

  /** 點畫面上的物件熱點：標記為已看，並同步揭露對應線索 */
  function handlePropClick(clueId?: string) {
    const hit = activeCase.props?.find((p) => p.clueId === clueId);
    if (hit) {
      setOpenedProps((prev) => (prev.includes(hit.id) ? prev : [...prev, hit.id]));
    }
    if (clueId) engine.revealClue(clueId);
  }

  const isDebrief = state.stage === "debrief";
  const isChoiceStage =
    state.stage === "name" || state.stage === "mind" || state.stage === "strategy";

  return (
    <div className="min-h-screen">
      <header className="border-b border-border" style={{ background: "oklch(0.925 0.022 84)" }}>
        <div className="mx-auto flex max-w-7xl flex-wrap items-center gap-x-5 gap-y-3 px-5 py-4">
          <Link
            href={`/scenes/${scene.id}`}
            className="hit-area inline-flex items-center gap-2 rounded-lg px-3 py-2 text-[0.9375rem] text-muted-foreground transition-colors hover:text-foreground"
          >
            <ArrowLeft className="h-5 w-5" aria-hidden />
            案件清單
          </Link>
          <div className="min-w-0">
            <p className="font-file text-[0.8125rem] tracking-widest text-muted-foreground">
              {activeCase.fileNo} · {scene.name}
            </p>
            <h1 className="truncate text-[1.375rem]" style={{ color: "var(--ink)" }}>
              {activeCase.title}
            </h1>
          </div>
          <div className="ml-auto">
            <StageHeader current={state.stage} />
          </div>
        </div>
      </header>

      <div className="mx-auto grid max-w-7xl gap-8 px-5 py-8 lg:grid-cols-[1.05fr_1fr] lg:gap-10">
        {/* 左：舞台 */}
        <div className="lg:sticky lg:top-8 lg:self-start">
          <CaseStage
            scene={scene}
            activeCase={activeCase}
            propsInteractive={state.stage === "observe"}
            openedProps={openedProps}
            onPropClick={handlePropClick}
          />
          {state.stage === "observe" && activeCase.props?.length ? (
            <p className="font-file mt-3 text-[0.9375rem] text-muted-foreground">
              畫面上有 {activeCase.props.length} 個圈起來的地方，點一下可以就近觀察。
            </p>
          ) : null}

          <p className="mt-5 text-[1.0625rem] leading-[1.85] text-foreground">
            {activeCase.brief}
          </p>

          {state.stage === "observe" ? (
            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              {activeCase.clues.map((clue) => {
                const opened = state.revealedClues.includes(clue.id);
                return (
                  <button
                    key={clue.id}
                    type="button"
                    onClick={() => engine.revealClue(clue.id)}
                    className={cn(
                      "file-card hit-area rounded-xl px-4 py-4 text-left transition-transform duration-[160ms] ease-[var(--ease-out)]",
                      "hover:-translate-y-[2px] active:scale-[0.985]",
                      opened && "cursor-default hover:translate-y-0",
                    )}
                    style={opened ? { background: "oklch(0.955 0.022 86)" } : undefined}
                  >
                    <span className="font-file flex items-center gap-2 text-[0.8125rem] tracking-widest text-muted-foreground">
                      <Eye className="h-4 w-4" aria-hidden />
                      {CLUE_KIND_LABEL[clue.kind]}
                      {clue.essential ? " · 必查" : ""}
                    </span>
                    <span className="mt-1.5 block text-[1.0625rem] font-medium">
                      {clue.label}
                    </span>
                    {opened ? (
                      <span className="stage-enter mt-2 block text-[1rem] leading-relaxed text-muted-foreground">
                        {clue.note}
                      </span>
                    ) : (
                      <span className="mt-2 block text-[0.9375rem] text-muted-foreground">
                        點一下看偵探筆記
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          ) : null}
        </div>

        {/* 右：卷宗任務面板 */}
        <div ref={panelRef} className="space-y-6">
          {!isDebrief ? (
            <div className="file-card stage-enter rounded-2xl px-6 py-6" key={state.stage}>
              <p className="font-file text-[0.8125rem] uppercase tracking-widest text-muted-foreground">
                Step {STAGE_META[state.stage].step} · {STAGE_META[state.stage].goal}
              </p>
              <h2 className="mt-2 text-[1.625rem]" style={{ color: "var(--ink)" }}>
                {STAGE_META[state.stage].label}
              </h2>

              {/* 階段一：觀察 */}
              {state.stage === "observe" ? (
                <>
                  <p className="mt-4 text-[1.0625rem] leading-[1.8]">
                    先別急著結案。把左邊標了「必查」的線索都看過一次，我們再往下走。
                  </p>
                  <p className="font-file mt-4 text-[0.9375rem] text-muted-foreground">
                    必查線索{" "}
                    {
                      activeCase.clues.filter(
                        (c) => c.essential && state.revealedClues.includes(c.id),
                      ).length
                    }
                    {" / "}
                    {activeCase.clues.filter((c) => c.essential).length}
                  </p>
                  {engine.observeComplete ? (
                    <HitBanner
                      line={stageHitLine("observe", activeCase.id)}
                      detail="必查線索都看過了，可以進入下一步。"
                    />
                  ) : null}
                  <NextButton
                    disabled={!engine.observeComplete}
                    label={engine.observeComplete ? "繼續" : "還有線索沒看"}
                    onClick={() => engine.advanceStage(true)}
                  />
                </>
              ) : null}

              {/* 階段二：命名情緒 */}
              {state.stage === "name" ? (
                <>
                  <p className="mt-4 text-[1.0625rem] leading-[1.8]">
                    {pronoun}現在的感覺，最接近哪一個？
                  </p>
                  <div className="mt-5 space-y-3">
                    {activeCase.emotionOptions.map((id) => (
                      <ChoiceButton
                        key={id}
                        label={EMOTIONS[id].label}
                        onSelect={() => handleEmotionChoice(id)}
                        ruledOut={state.ruledOut.includes(id)}
                        solved={solvedChoice === id}
                        disabled={!!solvedChoice}
                        nudgeKey={nudge?.id === id ? nudge.key : undefined}
                      />
                    ))}
                  </div>
                </>
              ) : null}

              {/* 階段三：讀心推理 */}
              {state.stage === "mind" ? (
                <>
                  <div className="mt-4 space-y-3">
                    <FactRow label="我們知道的事實" text={activeCase.mind.fact} />
                    <p className="text-[1.0625rem] leading-[1.8]">
                      但{pronoun}心裡想的可能不一樣。{pronoun}相信的是哪一件事？
                    </p>
                  </div>
                  <div className="mt-5 space-y-3">
                    {activeCase.mindChoices.map((c) => (
                      <ChoiceButton
                        key={c.id}
                        label={c.label}
                        onSelect={() => handleChoice(c)}
                        ruledOut={state.ruledOut.includes(c.id)}
                        solved={solvedChoice === c.id}
                        disabled={!!solvedChoice}
                        nudgeKey={nudge?.id === c.id ? nudge.key : undefined}
                      />
                    ))}
                  </div>
                </>
              ) : null}

              {/* 階段四：ABC 橫式表格 */}
              {state.stage === "abc" ? (
                <>
                  <p className="mt-4 text-[1.0625rem] leading-[1.8]">
                    把事情的開頭、中間和結果從左到右排好。
                  </p>
                  <AbcBoard
                    cards={engine.shuffledAbc}
                    placement={state.abcPlacement}
                    onPlace={engine.placeAbcCard}
                    pronoun={pronoun}
                  />
                  {engine.abcComplete ? (
                    <HitBanner
                      line={stageHitLine("abc", activeCase.id)}
                      detail={`從左到右讀一次：因為前面發生了那件事，${pronoun}才做了這件事，最後變成了這個結果。`}
                    />
                  ) : null}
                  <NextButton
                    disabled={!engine.abcComplete}
                    label={engine.abcComplete ? "繼續" : "還有卡片沒歸位"}
                    onClick={() => engine.advanceStage(state.attempts <= 3)}
                  />
                </>
              ) : null}

              {/* 階段五：想辦法 */}
              {state.stage === "strategy" ? (
                <>
                  <p className="mt-4 text-[1.0625rem] leading-[1.8]">
                    我們知道{pronoun}怎麼想了。接下來哪一個做法，真的能幫上{pronoun}？
                  </p>
                  <div className="mt-5 space-y-3">
                    {activeCase.strategyChoices.map((c) => (
                      <ChoiceButton
                        key={c.id}
                        label={c.label}
                        onSelect={() => handleChoice(c)}
                        ruledOut={state.ruledOut.includes(c.id)}
                        solved={solvedChoice === c.id}
                        disabled={!!solvedChoice}
                        nudgeKey={nudge?.id === c.id ? nudge.key : undefined}
                      />
                    ))}
                  </div>
                </>
              ) : null}

              {/* 回饋：答對走強化橫幅，答錯走便條紙 */}
              {isChoiceStage && state.lastFeedback ? (
                state.lastFeedback.correct ? (
                  <HitBanner
                    line={stageHitLine(state.stage, activeCase.id)}
                    detail={state.lastFeedback.text}
                  />
                ) : (
                  <FeedbackNote
                    correct={false}
                    text={state.lastFeedback.text}
                    className="mt-5"
                  />
                )
              ) : null}

              {!isChoiceStage && state.lastFeedback && !state.lastFeedback.correct ? (
                <FeedbackNote
                  correct={false}
                  text={state.lastFeedback.text}
                  className="mt-5"
                />
              ) : null}

              {solvedChoice && isChoiceStage ? (
                <NextButton
                  label={state.stage === "strategy" ? "結案" : "繼續"}
                  onClick={() => engine.advanceStage(state.attempts === 1)}
                />
              ) : null}
            </div>
          ) : (
            /* 結案報告 */
            <div className="file-card stage-enter rounded-2xl px-6 py-7">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="font-file text-[0.8125rem] uppercase tracking-widest text-muted-foreground">
                    {activeCase.fileNo} · Closed
                  </p>
                  <h2 className="mt-2 text-[1.75rem]" style={{ color: "var(--ink)" }}>
                    結案報告
                  </h2>
                </div>
                <span
                  className="stamp-in font-file inline-flex items-center gap-2 rounded-lg border-2 px-3 py-2 text-[0.9375rem]"
                  style={{ borderColor: "var(--ink)", color: "var(--ink)" }}
                >
                  <Stamp className="h-4 w-4" aria-hidden />
                  已破案
                </span>
              </div>

              <ScoreCard score={score} />

              <div
                className="mt-6 rounded-xl px-5 py-4"
                style={{ background: emotion.tint }}
              >
                <p
                  className="font-file text-[0.8125rem] tracking-widest"
                  style={{ color: emotion.color }}
                >
                  本案情緒
                </p>
                <p className="mt-1 text-[1.375rem]" style={{ color: emotion.color }}>
                  {emotion.label}
                </p>
                <p className="mt-2 text-[1.0625rem] leading-relaxed text-foreground">
                  {emotion.plain}
                </p>
              </div>

              <div className="mt-6 space-y-3">
                <FactRow label="事實是" text={activeCase.mind.fact} />
                <FactRow label={`${pronoun}相信的是`} text={activeCase.mind.belief} />
                <FactRow label={`${pronoun}想要的是`} text={activeCase.mind.desire} />
                <FactRow label={`${pronoun}不知道的是`} text={activeCase.mind.knowledge} />
              </div>

              <p className="mt-6 text-[1.0625rem] leading-[1.85]">{activeCase.debrief}</p>

              <div className="mt-7 flex flex-wrap gap-3">
                <Link
                  href={`/scenes/${scene.id}`}
                  className="hit-area inline-flex items-center gap-2 rounded-xl px-6 py-3.5 text-[1.0625rem] font-medium transition-transform duration-[160ms] ease-[var(--ease-out)] active:scale-[0.97]"
                  style={{ background: "var(--ink)", color: "oklch(0.965 0.012 86)" }}
                >
                  下一件案子
                  <ArrowRight className="h-5 w-5" aria-hidden />
                </Link>
                <button
                  type="button"
                  onClick={engine.resetCase}
                  className="hit-area inline-flex items-center gap-2 rounded-xl border border-border px-5 py-3.5 text-[1rem] text-muted-foreground transition-colors hover:text-foreground"
                >
                  <RotateCcw className="h-4 w-4" aria-hidden />
                  再辦一次這件
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function FactRow({ label, text }: { label: string; text: string }) {
  return (
    <div
      className="rounded-xl border-l-4 px-4 py-3"
      style={{ borderColor: "oklch(0.85 0.03 80)", background: "oklch(0.94 0.018 84)" }}
    >
      <p className="font-file text-[0.8125rem] tracking-widest text-muted-foreground">
        {label}
      </p>
      <p className="mt-1 text-[1.0625rem] leading-[1.8]">{text}</p>
    </div>
  );
}

function NextButton({
  label,
  onClick,
  disabled,
}: {
  label: string;
  onClick: () => void;
  disabled?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={cn(
        "hit-area mt-6 inline-flex items-center gap-2 rounded-xl px-6 py-3.5 text-[1.0625rem] font-medium",
        "transition-transform duration-[160ms] ease-[var(--ease-out)] active:scale-[0.97]",
        disabled && "cursor-default",
      )}
      style={
        disabled
          ? { background: "oklch(0.9 0.02 82)", color: "var(--muted-foreground)" }
          : { background: "var(--ink)", color: "oklch(0.965 0.012 86)" }
      }
    >
      {label}
      {!disabled ? <ArrowRight className="h-5 w-5" aria-hidden /> : null}
    </button>
  );
}

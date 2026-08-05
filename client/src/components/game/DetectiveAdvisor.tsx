import { Lightbulb, Sprout } from "lucide-react";
import type { Case, CaseStage } from "@/game/types";
import { EMOTIONS } from "@/game/emotions";

const FIVE_STAGES: CaseStage[] = ["observe", "name", "mind", "abc", "strategy"];

export const STAGE_REINFORCEMENT: Record<CaseStage, string> = {
  observe: "你先看線索再下判斷，這是很好的偵探方法。",
  name: "你把表情、身體和發生的事放在一起判斷了。",
  mind: "你分清楚了事實和當事人心裡相信的事。",
  abc: "你把前因、行為和結果接起來了。",
  strategy: "你選了能幫上忙、也不傷害別人的方法。",
  debrief: "你完成了整件案子的推理。",
};

function stageHints(stage: CaseStage, activeCase: Case, pronoun: string): string[] {
  const essential = activeCase.clues.filter((clue) => clue.essential);
  const correctStrategy = activeCase.strategyChoices.find((choice) => choice.correct)?.label;
  const correctAbc = (["antecedent", "behavior", "consequence"] as const)
    .map((slot) => activeCase.abcCards.find((card) => card.slot === slot)?.text)
    .filter(Boolean)
    .join(" → ");

  switch (stage) {
    case "observe":
      return [
        "先找表情、身體和周圍發生了什麼，不急著猜答案。",
        `可以先看「${essential.slice(0, 2).map((clue) => clue.label).join("」和「")}」。`,
        `把標示必查的線索逐一打開：${essential.map((clue) => clue.label).join("、")}。`,
      ];
    case "name":
      return [
        "先看臉和身體，再想想剛才發生了什麼。",
        `注意這些身體訊號：${activeCase.clues.filter((clue) => clue.kind !== "context").map((clue) => clue.label).join("、")}。`,
        `把線索和選項比較看看；最接近的是「${EMOTIONS[activeCase.targetEmotion].label}」。`,
      ];
    case "mind":
      return [
        "把『我們知道的』和『當事人知道的』分開來想。",
        `${pronoun}不知道的是：${activeCase.mind.knowledge}`,
        `${pronoun}心裡相信的是：${activeCase.mind.belief}`,
      ];
    case "abc":
      return [
        "先找最早發生的事，再找當事人的行為和後來的結果。",
        "A 是前因，B 是行為，C 是結果。",
        `一起順一次：${correctAbc}。`,
      ];
    case "strategy":
      return [
        "找一個能讓事情變好、又不傷害自己或別人的方法。",
        `想想哪個方法能讓${pronoun}先穩下來，或把事情說清楚。`,
        `可以試試看這個做法：「${correctStrategy}」。`,
      ];
    default:
      return [];
  }
}

export function GrowthTrail({ completed }: { completed: number }) {
  return (
    <div className="sunny-growth-trail" aria-label={`已收集 ${completed} 顆線索種子，共 5 顆`}>
      <span className="font-file text-[0.875rem] font-medium text-[var(--ink)]">線索種子</span>
      <div className="flex gap-1.5" aria-hidden>
        {FIVE_STAGES.map((stage, index) => (
          <span key={stage} className={index < completed ? "is-grown" : undefined}>
            <Sprout className="h-3.5 w-3.5" />
          </span>
        ))}
      </div>
      <span className="font-file text-[0.875rem] font-medium text-[var(--ink)]">{completed}/5</span>
    </div>
  );
}

export function DetectiveAdvisor({
  stage,
  activeCase,
  pronoun,
  level,
  onRequestHint,
}: {
  stage: CaseStage;
  activeCase: Case;
  pronoun: string;
  level: number;
  onRequestHint: () => void;
}) {
  const hints = stageHints(stage, activeCase, pronoun);
  if (!hints.length) return null;

  return (
    <aside id="detective-advisor" className="sunny-advisor mt-5" aria-label="偵探小專家提示">
      <div className="flex items-start gap-3">
        <img
          src="/brand/detective-advisor.png"
          alt="微笑揮手、拿著放大鏡的晴天偵探小專家"
          className="sunny-advisor__character"
        />
        <div className="min-w-0 flex-1">
          <p className="sunny-advisor__title font-file text-[0.875rem] tracking-wider">
            晴天偵探小專家 · 需要幫忙嗎？
          </p>
          {level > 0 ? (
            <p className="mt-1.5 text-[0.9875rem] leading-relaxed">{hints[level - 1]}</p>
          ) : (
            <p className="mt-1 text-[0.9375rem] text-muted-foreground">
              卡住時再叫我，不會自動跳出來。
            </p>
          )}
          {level < hints.length ? (
            <button type="button" onClick={onRequestHint} className="sunny-advisor__button">
              <Lightbulb className="h-4 w-4" aria-hidden />
              {level === 0 ? "叫小專家幫忙" : level === 1 ? "再清楚一點" : "一起推理"}
            </button>
          ) : (
            <p className="font-file mt-2 text-[0.75rem] text-muted-foreground">提示 3/3</p>
          )}
        </div>
      </div>
    </aside>
  );
}

export function DetectiveNotebookCard({ activeCase, pronoun }: { activeCase: Case; pronoun: string }) {
  return (
    <section className="sunny-notebook mt-6">
      <div className="flex items-center gap-2">
        <Sprout className="h-5 w-5" aria-hidden />
        <p className="font-file text-[0.8125rem] tracking-widest">晴天種子 · 偵探筆記</p>
      </div>
      <p className="mt-3 text-[1.0625rem] font-medium">新發現</p>
      <p className="mt-1.5 leading-relaxed">
        事實和一個人心裡相信的事，可能不一樣。這次你發現{pronoun}相信「{activeCase.mind.belief}」。
      </p>
      <p className="font-file mt-3 text-[0.8125rem] text-muted-foreground">✓ 已收進這件案子的偵探筆記</p>
    </section>
  );
}

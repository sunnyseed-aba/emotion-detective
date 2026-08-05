/**
 * 跨場景共用的因應策略庫。分類依循「先調節身體、再處理想法、最後採取行動」。
 * 案件的 strategyChoices 可引用這裡的文案，保持用語一致。
 */

export type StrategyCategory = "regulate" | "reframe" | "act";

export interface StrategyTemplate {
  id: string;
  category: StrategyCategory;
  label: string;
  /** 為什麼有用 */
  why: string;
}

export const STRATEGY_CATEGORY_META: Record<
  StrategyCategory,
  { label: string; hint: string }
> = {
  regulate: { label: "先讓身體穩下來", hint: "情緒太大時，先處理身體" },
  reframe: { label: "換個想法看看", hint: "改變信念，情緒就會改變" },
  act: { label: "做一件事", hint: "用行動改變處境或修補關係" },
};

export const STRATEGIES: StrategyTemplate[] = [
  {
    id: "breathe",
    category: "regulate",
    label: "慢慢深呼吸五次",
    why: "呼吸變慢，身體的警報就會降下來，才有辦法想事情。",
  },
  {
    id: "quiet-corner",
    category: "regulate",
    label: "去安靜的角落待一下",
    why: "減少刺激，讓自己有時間恢復。",
  },
  {
    id: "check-facts",
    category: "reframe",
    label: "先問清楚，不要先猜",
    why: "我以為的事情不一定是真的，問清楚可以修正誤會。",
  },
  {
    id: "other-reason",
    category: "reframe",
    label: "想想還有什麼別的原因",
    why: "同一件事可能有好幾個解釋，不一定是針對我。",
  },
  {
    id: "tell-feeling",
    category: "act",
    label: "用說的告訴對方我的感覺",
    why: "對方不會讀心術，說出來他才知道。",
  },
  {
    id: "ask-help",
    category: "act",
    label: "找信任的大人幫忙",
    why: "有些事情自己處理不來，求助是聰明的選擇。",
  },
  {
    id: "repair",
    category: "act",
    label: "道歉並提出補救辦法",
    why: "承認影響並提出方案，關係才修得回來。",
  },
  {
    id: "take-turns",
    category: "act",
    label: "提議輪流或一起玩",
    why: "把「搶」變成「排」，兩個人的需求都能被照顧。",
  },
];

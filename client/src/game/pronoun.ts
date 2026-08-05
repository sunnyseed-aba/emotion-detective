/**
 * 代名詞工具。所有 UI 敘述句都必須經過本檔，避免對女性角色誤用「他」。
 * 未來若要支援其他語言或性別中立稱法，只需改動本檔。
 */
import type { Case, Character } from "./types";

/** 取得案件的當事人（focus 角色，缺漏時退回第一位） */
export function focusCharacter(activeCase: Case): Character {
  return activeCase.characters.find((c) => c.role === "focus") ?? activeCase.characters[0];
}

/** 當事人的第三人稱代名詞 */
export function pronounOf(activeCase: Case): string {
  return focusCharacter(activeCase).gender === "female" ? "她" : "他";
}

/**
 * 把敘述模板中的 `{他}` 替換成正確代名詞，`{名}` 替換成角色名字。
 * 這樣案件資料與 UI 文案都能寫成中性模板。
 */
export function fillPronoun(template: string, activeCase: Case): string {
  const c = focusCharacter(activeCase);
  return template
    .replaceAll("{他}", c.gender === "female" ? "她" : "他")
    .replaceAll("{名}", c.name);
}

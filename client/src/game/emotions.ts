/**
 * 情緒詞庫。染料色語意化：每種情緒固定一色，只用於情緒相關元件，
 * 讓孩子建立穩定的「顏色 ↔ 情緒」連結。低飽和，避免感官過載。
 */
import type { Emotion, EmotionId } from "./types";

export const EMOTIONS: Record<EmotionId, Emotion> = {
  joy: {
    id: "joy",
    label: "開心",
    plain: "事情如我所願，身體輕輕的、想笑出來。",
    bodyCues: ["嘴角往上", "眼睛彎彎的", "動作變大、想分享"],
    color: "#B8860B",
    tint: "#F3E4B8",
  },
  sadness: {
    id: "sadness",
    label: "傷心",
    plain: "失去了重要的東西或期待落空，身體沉沉的。",
    bodyCues: ["嘴角往下", "眉毛下垮", "肩膀垂下、想低頭"],
    color: "#3C5A8C",
    tint: "#D3DCEC",
  },
  anger: {
    id: "anger",
    label: "生氣",
    plain: "覺得被擋住或被不公平對待，身體熱起來、繃緊。",
    bodyCues: ["眉毛皺起斜下", "嘴巴繃成一條線", "拳頭握緊、身體前傾"],
    color: "#A63D28",
    tint: "#EFD2CA",
  },
  fear: {
    id: "fear",
    label: "害怕",
    plain: "覺得有危險或不確定會發生什麼，身體想躲起來。",
    bodyCues: ["眼睛睜很大", "嘴巴微微張開", "身體後退、僵住"],
    color: "#5E7C63",
    tint: "#D7E2D6",
  },
  embarrassment: {
    id: "embarrassment",
    label: "尷尬",
    plain: "覺得被看到不想被看到的樣子，臉會熱熱的。",
    bodyCues: ["臉頰發紅", "眼睛看旁邊不敢對上", "抓頭、縮肩膀"],
    color: "#9E6B70",
    tint: "#EEDCDE",
  },
  pride: {
    id: "pride",
    label: "驕傲",
    plain: "自己努力做到了一件事，想抬頭讓別人知道。",
    bodyCues: ["下巴微抬", "嘴角含著笑", "胸口挺起來"],
    color: "#B06B2C",
    tint: "#F1DCC4",
  },
  surprise: {
    id: "surprise",
    label: "驚訝",
    plain: "發生了完全沒想到的事，腦袋一下空白。",
    bodyCues: ["眉毛抬很高", "嘴巴變成小圓形", "身體突然停住"],
    color: "#3F7D7A",
    tint: "#CFE2E1",
  },
  loneliness: {
    id: "loneliness",
    label: "孤單",
    plain: "身邊沒有人可以一起，覺得自己被留在外面。",
    bodyCues: ["眼睛往下看", "一個人待在邊邊", "動作變少、很安靜"],
    color: "#5A6478",
    tint: "#D9DDE5",
  },
};

export const EMOTION_LIST = Object.values(EMOTIONS);

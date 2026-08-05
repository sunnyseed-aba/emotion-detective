export const SEL_SKILLS = {
  emotionAwareness: { label: "情緒與身體訊號", short: "認出感受與身體線索" },
  perspectiveTaking: { label: "觀點取替", short: "分辨別人知道、相信與想要的事" },
  regulation: { label: "調節與等待", short: "面對挫折、焦慮與衝動" },
  flexibility: { label: "彈性與變動", short: "接受改變、結束活動與不同做法" },
  joiningIn: { label: "加入、輪流與協商", short: "進入團體並共同遵守規則" },
  communication: { label: "表達需求與拒絕", short: "清楚說出需要、界線與求助" },
  repair: { label: "衝突修復", short: "誤會或衝突後重新連結" },
  safety: { label: "安全、界線與求助", short: "辨識風險並尋找可信任成人" },
} as const;

export type SelSkillId = keyof typeof SEL_SKILLS;

# v3 資產對照表（已保留的 URL，直接使用）

## 場景背景（每案一張，含關鍵物件、中前景留空地）
| 案件 | URL |
| --- | --- |
| SCH-01 教室發考卷 | `/manus-storage/v3-scene-sch01_4cc00f71.jpg` |
| SCH-02 操場分隊 | `/manus-storage/v3-scene-sch02_1e4d3a49.jpg` |
| SCH-03 教室門口走廊 | `/manus-storage/v3-scene-sch03_2ef06423.jpg` |
| HOM-01 客廳空地毯 | `/manus-storage/v3-scene-hom01_c59a2147.jpg` |
| HOM-02 客廳畫桌 | `/manus-storage/v3-scene-hom02_ac5c3515.jpg` |
| COM-01 公園步道 | `/manus-storage/v3-scene-com01_484b4a61.jpg` |
| COM-02 公園長椅 | `/manus-storage/v3-scene-com02_4fceeea9.jpg` |

## 人物動作圖（透明背景）
| 角色／案件 | 動作 | URL |
| --- | --- | --- |
| 小宇 SCH-01 | 坐姿低頭、手壓考卷 | `/manus-storage/v3-char-yu-sch01_5a05c2e1.png` |
| 小美 SCH-02 | 站立握拳、身體側轉 | `/manus-storage/v3-char-mei-sch02_036d68b3.png` |
| 小豪 SCH-02 | 拿名單、轉頭喊人 | `/manus-storage/v3-char-hao-sch02_fb38376e.png` |
| 小琳 SCH-03 | 捏衣角、重心後仰 | `/manus-storage/v3-char-lin-sch03_4ff5006b.png` |
| 小宇 HOM-01 | 蹲下摸空地毯 | `/manus-storage/v3-char-yu-hom01_fa76f97f.png` |
| 小美 HOM-02 | 前傾伸手要平板 | `/manus-storage/v3-char-mei-hom02_23b1d372.png` |
| 媽媽 HOM-02 | 抱平板、指時鐘 | `/manus-storage/v3-char-mom-hom02_5da76521.png` |
| 小豪 COM-01 | 跌倒單膝撐地 | `/manus-storage/v3-char-hao-com01_01e6ed93.png` |
| 阿嬤 COM-02 | 坐姿雙手放膝 | `/manus-storage/v3-char-granny-com02_c59db033.png` |
| 小宇 COM-02 | 停步側頭注意 | `/manus-storage/v3-char-yu-com02_0b4f9c35.png` |
| 小柔（備用，驚訝） | 雙手貼胸前驚喜 | `/manus-storage/v3-char-rou-sch01_c931b60d.png` |

## 定位規則
`placement.y` = 角色腳底那條地面線在舞台高度的百分比（bottom 對齊）。
坐姿角色設 `sit: true`，y 對齊椅面高度。
新背景圖的地面線約在 y=82–88%，因此站立角色一律用 84–88，
不再沿用舊的 72–76（那是造成浮空的原因）。

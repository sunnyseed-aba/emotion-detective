# 補充事實表（GAME_DESIGN / AI_PROMPTS / TODO / CHANGELOG 用）

## 角色清冊（程式中實際存在）
| 名字 | 性別 | 出現案件 | role |
|---|---|---|---|
| 小宇 | male | SCH-01, HOM-01, COM-02(合成圖內) | focus |
| 小美 | female | SCH-02, HOM-02(合成圖內) | focus |
| 小豪 | male | SCH-02(related), COM-01(focus) | 兩者皆有 |
| 小琳 | female | SCH-03 | focus |
| 媽媽 | female | HOM-02(合成圖內) | 合成 |
| 阿嬤 | female | COM-02(合成圖內) | 合成 |

HOM-02 characters 只有一筆：name「小美與媽媽」、gender female、role focus
COM-02 characters 只有一筆：name「阿嬤與小宇」、gender female、role focus

## 案件簡述（brief 原文）
- SCH-01 沒有舉手的那隻手：數學考卷發下來了。小宇看了一眼分數，把考卷折起來壓在桌下。接下來整堂課老師問問題，他都沒有舉手，即使他知道答案。
- SCH-02 沒被叫到的名字：下課時同學分隊打球，兩隊都念完了名字，小美站在旁邊沒被叫到。她的眉毛皺起來，用力把球踢向牆壁。
- SCH-03 還沒發生的失誤：下週有班級表演，小琳被分到獨唱一段。練習時間到了，她卻站在教室門口不肯進去，眼睛睜得很大，手指一直捏著衣角。
- HOM-01 被收走的積木：小宇花了一整個下午蓋好一座積木塔。晚餐前他回到客廳，積木不見了，桌上只剩空空的地毯。他站在原地不動。
- HOM-02 被關掉的平板：小美正在畫一張快完成的圖，媽媽走過來把平板收走了。小美的眉毛皺起、雙手握成拳頭，身體往前傾。
- COM-01 滑倒之後：在公園的步道上，小豪跑步時滑了一下跌坐在地。旁邊有幾個人轉頭看過來。他馬上站起來，低著頭往旁邊走，臉頰紅紅的。
- COM-02 長椅上的一個人：公園長椅上有位阿嬤一個人坐了很久。她的視線一直往下，手放在膝上沒有動，經過的人都沒有停下來。只有小宇猶豫了很久，才端了一杯水走過去。

## MindState 四欄（每案皆有 fact / belief / desire / knowledge）
核心設計：belief 與 fact **必定不一致** → 這就是錯誤信念，是 ToM 的教學靶心。
- SCH-01 fact：三分之二同學也考差、老師打算重教｜belief：我不夠聰明，永遠學不會
- SCH-02 fact：小豪以為小美要練直笛才沒排她｜belief：他們故意跳過我
- SCH-03 fact：老師說可以兩人一起唱或先唱給老師聽（小琳請假沒聽到）｜belief：我一定會唱錯被笑
- HOM-01 fact：媽媽小心收進箱子還拍了照｜belief：積木被拆掉丟掉，沒人在乎
- HOM-02 fact：已超過約定時間半小時，媽媽以為她只是隨手滑手機｜belief：媽媽故意打斷我
- COM-01 fact：轉頭的人是確認他有沒有受傷，三十秒後就忘了｜belief：所有人都在看我出醜且會一直記得
- COM-02 fact：阿嬤很想聊天但怕打擾別人｜belief：大家都很忙，沒人想聽我說話

## 題型結構（以 SCH-01 為例，每案結構相同）
- clues：4 筆（kind = face / body / context；3 筆 essential:true、1 筆選配）
- emotionOptions：4 個情緒 id（1 正解 + 3 干擾）
- mindChoices：3 選項（1 正解 + 2 誘答，誘答皆附「為什麼不是」的解釋）
- abcCards：3 張（各對應 antecedent / behavior / consequence）
- strategyChoices：3 選項（1 正解 + 2 常見無效因應）
- debrief：一段統整文字，把該情緒的認知重點講白

線索總數：school 12 / home 8 / community 8（每案 4 筆）

## 策略庫（strategies.ts，8 條，3 分類）
regulate 先讓身體穩下來：breathe 慢慢深呼吸五次｜quiet-corner 去安靜的角落待一下
reframe 換個想法看看：check-facts 先問清楚不要先猜｜other-reason 想想還有什麼別的原因
act 做一件事：tell-feeling 用說的告訴對方我的感覺｜ask-help 找信任的大人幫忙｜repair 道歉並提出補救辦法｜take-turns 提議輪流或一起玩

注意：STRATEGIES 是共用文案庫，但目前各案的 strategyChoices 是**各自手寫**，未程式化引用此庫（未來可統一）。

## 情緒詞庫（8 種，含 plain 定義與 bodyCues）
joy 開心 #B8860B｜sadness 傷心 #3C5A8C｜anger 生氣 #A63D28｜fear 害怕 #5E7C63
embarrassment 尷尬 #9E6B70｜pride 驕傲 #B06B2C｜surprise 驚訝 #3F7D7A｜loneliness 孤單 #5A6478
每種情緒有 3 條 bodyCues（身體線索），用於命名階段的教學提示。

## 鼓勵語庫（scoring.ts）
PRAISE_HIGH 3 句 / PRAISE_MID 3 句 / PRAISE_LOW 3 句
STAGE_HIT_LINES：observe 2 句 / name 2 句 / mind 2 句 / abc 2 句 / strategy 2 句 / debrief 1 句
階級：3 星首席偵探 / 2 星資深偵探 / 1 星見習偵探

## 影像生成 Prompt 規範（VISUAL_SPEC.md 已載明）
人物：寫實人體比例與臉部解剖、眼睛正常大小、嚴禁卡通動漫Q版、依 FACS 真實肌肉動作繪製表情
（不畫淚滴／青筋／汗滴符號）、soft digital painting、全身、雙腳可見。
場景：物件比例透視材質寫實、刻意去雜訊（僅留敘事必要物件）、低對比柔和散射光、淺景深、
中央下方留白供角色定位、人物須為畫面最高對比元素。
FACS 對照表 8 種情緒皆有列（見 VISUAL_SPEC.md）。

## v4 修正紀錄（V4_VERIFY.md / V4_DIAGNOSIS.md）
問題根因：每張 sprite 圖檔內人物身高佔比不同，而 CaseStage 用 `height: 64 * scale (%)`
直接套圖檔高度 → 實際身高不成比例（COM-02 阿嬤過大、小宇過小，俗稱小人國）。
解法：HOM-02 與 COM-02 改為「單一雙人同框圖」，從構圖階段就鎖定比例。
其他修正：小美頭髮透明破洞（去背容差過大刪到黑髮）→ 改保守去背；
COM-01 換含旁觀者的新背景＋小豪改低頭走開姿態。

## 去背腳本演進（assets/source/scripts/）
cutout.py → 首版 flood-fill 去背
cutout2.py → 綠幕修補與殘留光暈清除
dechroma.py → 綠幕去色（v2 素材用）
cutout_v4.py → 保守策略：只移除外部連通白色區域，保留頭髮與淺色衣服

## 尚未完成（TODO 用）
1. joy / pride / surprise 三種情緒尚無以其為目標的案件（僅作干擾選項）
2. therapist / parent / teacher 三種 GameMode 已定義型別但無實作介面
3. spriteReal / backdropReal 欄位已預留但無擬真照片素材
4. 無音效（audio 資料夾為空），動畫全為 CSS
5. 觀察階段線索無「已看幾個」的勾選視覺（使用者曾提出）
6. 結案報告未含「哪一步最快答對」的回顧（使用者曾提出）
7. assets/icons 3 個早期紙劇場風 icon 未被引用
8. 已安裝但未使用的套件：framer-motion / recharts / react-hook-form / zod / axios / express / embla-carousel
9. 各案 strategyChoices 未引用 STRATEGIES 共用庫
10. index.html 底部有 Manus 平台分析 script，移出平台需移除

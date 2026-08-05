/**
 * 家庭場景案件包。視覺：半擬真 · 低刺激（見 VISUAL_SPEC.md）。
 * 語氣：卷宗式，邀請觀察、不下評斷。
 * 教學重點：手足／親子情境中的錯誤信念與需求衝突。
 */
import type { GameScene } from "../types";

export const homeScene: GameScene = {
  id: "home",
  name: "家庭",
  tagline: "最親近的人，也最容易被誤會。",
  backdrop: "/game-assets/scenes/v2-scene-home_504687b5.jpg",
  cases: [
    {
      id: "home-01",
      fileNo: "HOM-01",
      title: "被收走的積木",
      brief:
        "小宇花了一整個下午蓋好一座積木塔。晚餐前他回到客廳，積木不見了，桌上只剩空空的地毯。他站在原地不動。",
      backdrop: "/game-assets/scenes/v5-scene-home-01.jpg",
      compositeScene: true,
      props: [
        {
          id: "p1",
          label: "地毯上的壓痕",
          note: "原本放積木的地方空了，只留下一圈淺淺的壓痕。",
          x: 65,
          y: 72,
          clueId: "c3",
        },
        {
          id: "p2",
          label: "擺好的碗筷",
          note: "碗筷已經擺好，看起來剛剛有人在整理這個空間。",
          x: 79,
          y: 25,
          clueId: "c4",
        },
        {
          id: "p3",
          label: "小宇垂下的肩膀",
          note: "兩邊肩膀垂下來，頭低著，整個人像變小了一點。",
          x: 33,
          y: 42,
          clueId: "c2",
        },
      ],
      characters: [
        {
          id: "yu",
          name: "小宇",
          gender: "male",
          sprite: "/game-assets/characters/v3-char-yu-hom01_web_938598cb.png",
          role: "focus",
          placement: { x: 38, y: 88, scale: 0.82, layer: 3 },
        },
      ],
      targetEmotion: "sadness",
      mind: {
        fact: "媽媽因為要擺晚餐，把積木小心收進箱子裡，還特別拍了照片想給小宇看。",
        belief: "小宇相信「我的積木塔被拆掉丟掉了，沒有人在乎我做的東西」。",
        desire: "他想要自己的作品被看見、被保留。",
        knowledge: "他不知道積木被完整收進箱子，也沒看到那張照片。",
      },
      clues: [
        {
          id: "c1",
          kind: "face",
          label: "小宇的嘴角",
          note: "嘴角明顯往下垂，不是生氣的繃緊，是往下鬆掉的那種。",
          essential: true,
        },
        {
          id: "c2",
          kind: "body",
          label: "小宇的肩膀",
          note: "兩邊肩膀垂下來，頭微微低著，整個人像變小了一點。",
          essential: true,
        },
        {
          id: "c3",
          kind: "context",
          label: "空空的地毯",
          note: "地毯上原本放積木的地方空了，只留下一點壓痕。",
          essential: true,
        },
        {
          id: "c4",
          kind: "context",
          label: "餐桌上的碗筷",
          note: "碗筷已經擺好了，看起來剛剛有人在整理這個空間。",
          essential: false,
        },
      ],
      emotionOptions: ["sadness", "anger", "surprise", "pride"],
      mindChoices: [
        {
          id: "m1",
          label: "他相信積木被拆掉丟掉了，沒人在乎他做的東西。",
          correct: true,
          feedback:
            "沒錯。他看到的只有「空地毯」，所以心裡下的結論是「被丟掉了」。這個結論不是事實，但它真實地讓他難過。",
        },
        {
          id: "m2",
          label: "他知道積木被收進箱子了，只是不想吃飯。",
          correct: false,
          feedback:
            "這是「我們知道的事」，不是「他知道的事」。他沒看到收積木的過程，也沒看到照片。",
        },
        {
          id: "m3",
          label: "他相信媽媽是故意要處罰他。",
          correct: false,
          feedback:
            "有可能，但線索裡沒有任何被責罵或衝突的痕跡。偵探只寫線索支持的推論。",
        },
      ],
      abcCards: [
        { id: "a1", text: "小宇回到客廳，發現積木塔不在原本的位置上。", slot: "antecedent" },
        { id: "b1", text: "他站在空地毯前不說話，肩膀垂下、低著頭。", slot: "behavior" },
        { id: "c1", text: "媽媽以為他不想吃飯，催他快來，兩個人都更悶了。", slot: "consequence" },
      ],
      strategyChoices: [
        {
          id: "s1",
          label: "先問清楚：「我的積木被放到哪裡了？」",
          correct: true,
          feedback:
            "這一步同時做了兩件事：修正他的錯誤信念，也讓媽媽知道那座塔對他很重要。",
        },
        {
          id: "s2",
          label: "什麼都不說，回房間把門關起來。",
          correct: false,
          feedback:
            "難過的時候想躲起來很正常，但誤會不會自己解開，媽媽也還是不知道發生什麼事。",
        },
        {
          id: "s3",
          label: "大聲說「你們都不在乎我」然後把碗推開。",
          correct: false,
          feedback:
            "這會把一個誤會變成一場衝突。他的感覺是真的，但這個做法讓別人更難聽懂他。",
        },
      ],
      debrief:
        "小宇的難過來自一個錯誤的信念：「積木被丟了」。事實上積木被完整收好了。這一課的重點是——別人心裡想的，可能和真正發生的事不一樣；先問清楚，常常比先反應更有用。",
    },
    {
      id: "home-02",
      fileNo: "HOM-02",
      title: "被關掉的平板",
      brief:
        "小美正在畫一張快完成的圖，媽媽走過來把平板收走了。小美的眉毛皺起、雙手握成拳頭，身體往前傾。",
      backdrop: "/game-assets/scenes/v5-scene-home-02.jpg",
      compositeScene: true,
      props: [
        {
          id: "p1",
          label: "媽媽手上的平板",
          note: "平板已經在媽媽手上，畫面停在一張沒畫完的圖。",
          x: 56,
          y: 40,
          clueId: "c3",
        },
        {
          id: "p2",
          label: "牆上的時鐘",
          note: "時鐘顯示已經超過約定的使用時間半小時了。",
          x: 35,
          y: 13,
          clueId: "c4",
        },
        {
          id: "p3",
          label: "小美伸出去的手",
          note: "身體往前傾，手往前伸，像要把東西拿回來。",
          x: 25,
          y: 58,
          clueId: "c2",
        },
      ],
      characters: [
        {
          id: "mei",
          name: "小美與媽媽",
          gender: "female",
          sprite: "/game-assets/characters/v4-pair-hom02_web_41d1d252.png",
          role: "focus",
          placement: { x: 50, y: 92, scale: 1.02, layer: 3 },
          isPair: true,
        },
      ],
      targetEmotion: "anger",
      mind: {
        fact: "媽媽看到已經超過約定時間半小時，以為小美只是在隨手滑手機，並不知道那張圖快畫完了。",
        belief: "小美相信「媽媽根本不在乎我在做什麼，她就是故意要打斷我」。",
        desire: "她想把那張圖畫完，也想要自己正在做的事被當成重要的事。",
        knowledge: "她不知道時間已經超過約定，也不知道媽媽以為她只是在滑手機。",
      },
      clues: [
        {
          id: "c1",
          kind: "face",
          label: "小美的眉毛",
          note: "眉毛皺起來往中間斜下，眼睛瞇得比平常小。",
          essential: true,
        },
        {
          id: "c2",
          kind: "body",
          label: "小美的雙手",
          note: "兩手握成拳頭貼在身側，身體往前傾，像準備要衝過去。",
          essential: true,
        },
        {
          id: "c3",
          kind: "context",
          label: "媽媽手上的平板",
          note: "平板已經在媽媽手上，螢幕還亮著，畫面停在一張沒畫完的圖。",
          essential: true,
        },
        {
          id: "c4",
          kind: "context",
          label: "牆上的時鐘",
          note: "時鐘顯示已經超過約定的使用時間半小時了。",
          essential: false,
        },
      ],
      emotionOptions: ["anger", "sadness", "fear", "embarrassment"],
      mindChoices: [
        {
          id: "m1",
          label: "她相信媽媽明知道她在畫圖，還故意打斷她。",
          correct: true,
          feedback:
            "對。她的生氣不只來自「平板被收走」，更來自那句心裡的話：「她是故意的。」對意圖的判斷會放大情緒。",
        },
        {
          id: "m2",
          label: "她相信媽媽不知道她的圖快畫完了。",
          correct: false,
          feedback:
            "如果她真的這樣想，第一反應會是解釋「我快畫完了」，而不是握拳。握拳通常伴隨「被針對」的想法。",
        },
        {
          id: "m3",
          label: "她相信平板壞掉了。",
          correct: false,
          feedback: "線索指向的是人與人之間的衝突，不是設備問題。",
        },
      ],
      abcCards: [
        { id: "a1", text: "媽媽沒有先提醒，直接走過來把平板收走。", slot: "antecedent" },
        { id: "b1", text: "小美握緊拳頭、身體前傾，大聲說「還給我」。", slot: "behavior" },
        { id: "c1", text: "媽媽覺得被吼了，把平板收進抽屜一整天，圖也沒畫完。", slot: "consequence" },
      ],
      strategyChoices: [
        {
          id: "s1",
          label: "先深呼吸，再說：「我這張圖再兩分鐘就畫完了，可以嗎？」",
          correct: true,
          feedback:
            "先讓身體降溫，再說出對方不知道的資訊。媽媽原本以為她只是在滑手機，這句話直接修正了誤會。",
        },
        {
          id: "s2",
          label: "直接把平板搶回來。",
          correct: false,
          feedback:
            "短期可能拿回來，但通常換來更大的衝突，最後可能一整天都不能用。",
        },
        {
          id: "s3",
          label: "忍下來不說，自己回房間生氣。",
          correct: false,
          feedback:
            "生氣沒有被說出來，媽媽不會知道那張圖對她的意義，下次還會再發生。",
        },
      ],
      debrief:
        "生氣常常是「界線被跨過」的訊號，這是有用的訊息。這一課練的是：先讓身體穩下來，再確認對方是不是真的「故意」——很多時候對方只是不知道。",
    },
  ],
};

/**
 * 學校場景案件包。視覺：半擬真 · 低刺激（見 VISUAL_SPEC.md）。
 * 教學重點：同儕情境中的自我評價信念、社交排除的誤讀、表演焦慮的預期性信念。
 */
import type { GameScene } from "../types";

export const schoolScene: GameScene = {
  id: "school",
  name: "學校",
  tagline: "很多誤會，是從沒說出口的猜測開始的。",
  backdrop: "/game-assets/scenes/v2-scene-school_07403420.jpg",
  cases: [
    {
      id: "school-01",
      fileNo: "SCH-01",
      title: "沒有舉手的那隻手",
      brief:
        "數學考卷發下來了。小宇看了一眼分數，把考卷折起來壓在桌下。接下來整堂課老師問問題，他都沒有舉手，即使他知道答案。",
      backdrop: "/game-assets/scenes/v5-scene-school-01.jpg",
      compositeScene: true,
      props: [
        {
          id: "p1",
          label: "折起來的考卷",
          note: "分數那一面朝下，被壓在手臂底下。",
          x: 68,
          y: 76,
          clueId: "c2",
        },
        {
          id: "p2",
          label: "黑板上的算式",
          note: "老師正在問的那一題，他其實會算。",
          x: 30,
          y: 18,
          clueId: "c3",
        },
        {
          id: "p3",
          label: "隔壁桌的考卷",
          note: "也被翻過去蓋著，分數那面朝下。",
          x: 42,
          y: 48,
          clueId: "c4",
        },
      ],
      characters: [
        {
          id: "yu",
          name: "小宇",
          gender: "male",
          sprite: "/game-assets/characters/v3-char-yu-sch01_web_5b21709e.png",
          role: "focus",
          placement: { x: 44, y: 79, scale: 0.94, layer: 2, sit: true },
        },
      ],
      targetEmotion: "sadness",
      mind: {
        fact: "這次考卷有一整面是新教的單元，全班有三分之二的人分數都下降了，老師本來打算下週重教一次。",
        belief: "小宇相信「我就是不夠聰明，我永遠學不會數學」。",
        desire: "他想要自己是個「做得到的人」，也想要不要在同學面前出錯。",
        knowledge: "他不知道大部分同學也考差了，也不知道老師打算重教。",
      },
      clues: [
        {
          id: "c1",
          kind: "face",
          label: "小宇的眼睛",
          note: "上眼瞼垂下來，視線一直朝著桌面，沒有往老師的方向看。",
          essential: true,
        },
        {
          id: "c2",
          kind: "body",
          label: "小宇壓著考卷的手",
          note: "考卷被折起來壓在手臂下面，像是不想讓任何人看到。",
          essential: true,
        },
        {
          id: "c3",
          kind: "context",
          label: "一直沒舉起來的手",
          note: "老師問了三題他都知道答案，但手始終放在桌下。",
          essential: true,
        },
        {
          id: "c4",
          kind: "context",
          label: "旁邊同學的考卷",
          note: "隔壁桌的考卷也被翻過去蓋著，分數那一面朝下。",
          essential: false,
        },
      ],
      emotionOptions: ["sadness", "anger", "pride", "surprise"],
      mindChoices: [
        {
          id: "m1",
          label: "他相信「我不夠聰明，永遠學不會」，所以不敢再試。",
          correct: true,
          feedback:
            "沒錯。他把「這次考差」變成了「我就是這種人」。這種對自己的結論，比分數本身更讓人動不了。",
        },
        {
          id: "m2",
          label: "他知道很多同學也考差了，只是今天不想說話。",
          correct: false,
          feedback:
            "這是「我們知道的事」。他把考卷藏起來，正好說明他以為只有自己這樣。",
        },
        {
          id: "m3",
          label: "他相信老師故意出很難的題目來刁難他。",
          correct: false,
          feedback:
            "如果他這樣想，情緒會偏向生氣、會抱怨。但他的動作是把自己收起來，指向的是對自己的評價。",
        },
      ],
      abcCards: [
        { id: "a1", text: "數學考卷發下來，分數比他預期的低很多。", slot: "antecedent" },
        { id: "b1", text: "他把考卷折起來藏住，整堂課都不舉手。", slot: "behavior" },
        { id: "c1", text: "老師以為他今天沒跟上，也就沒有問他，他更確定自己不行。", slot: "consequence" },
      ],
      strategyChoices: [
        {
          id: "s1",
          label: "把「我學不會」換成「我這個單元還沒學會」，然後去問老師哪裡錯了。",
          correct: true,
          feedback:
            "關鍵是把「我這個人」縮小成「這一個單元」。範圍變小了，事情就變得可以動手處理。",
        },
        {
          id: "s2",
          label: "以後數學課都坐最後一排，不要被叫到。",
          correct: false,
          feedback:
            "躲起來當下比較不痛，但也讓他失去了所有可以修正的機會，下一次會更難。",
        },
        {
          id: "s3",
          label: "告訴自己「反正數學不重要」。",
          correct: false,
          feedback:
            "這是把在乎的事說成不在乎，難過並不會真的消失，只是被蓋住。",
        },
      ],
      debrief:
        "傷心常常來自一個對自己的結論。這一課的重點是：把「我永遠不行」改成「我還沒學會這一個」——同樣一件事，但後面那句話留了一條路可以走。",
    },
    {
      id: "school-02",
      fileNo: "SCH-02",
      title: "沒被叫到的名字",
      brief:
        "下課時同學分隊打球，兩隊都念完了名字，小美站在旁邊沒被叫到。她的眉毛皺起來，用力把球踢向牆壁。",
      backdrop: "/game-assets/scenes/v5-scene-school-02.jpg",
      compositeScene: true,
      props: [
        {
          id: "p1",
          label: "撞牆彈回的球",
          note: "力氣比玩球時大很多，球彈回來她也沒去追。",
          x: 91,
          y: 55,
          clueId: "c2",
        },
        {
          id: "p2",
          label: "已經站好的兩隊",
          note: "兩邊人數剛好，沒有留空位。",
          x: 65,
          y: 41,
          clueId: "c3",
        },
        {
          id: "p3",
          label: "小豪手上的名單",
          note: "名單上小美的名字旁邊，被畫了一個小記號。",
          x: 59,
          y: 43,
          clueId: "c4",
        },
      ],
      characters: [
        {
          id: "mei",
          name: "小美",
          gender: "female",
          sprite: "/game-assets/characters/v4-char-mei-sch02_web_5a1ed9c8.png",
          role: "focus",
          placement: { x: 38, y: 88, scale: 1, layer: 3 },
        },
        {
          id: "hao",
          name: "小豪",
          gender: "male",
          sprite: "/game-assets/characters/v3-char-hao-sch02_web_ff9a0277.png",
          role: "related",
          placement: { x: 72, y: 82, scale: 0.86, layer: 2, flip: true },
        },
      ],
      targetEmotion: "anger",
      mind: {
        fact: "分隊的小豪以為小美今天要留下來練直笛，因為她昨天才說過這件事，所以刻意沒有排她。",
        belief: "小美相信「他們就是不想跟我一隊，故意跳過我」。",
        desire: "她想要被算進去，想要成為隊伍的一員。",
        knowledge: "她不知道小豪記得她昨天說要練直笛，也不知道那是體貼而不是排擠。",
      },
      clues: [
        {
          id: "c1",
          kind: "face",
          label: "小美的眉毛與嘴唇",
          note: "眉毛下壓靠近，上下唇緊緊壓成一條線，下巴往前推。",
          essential: true,
        },
        {
          id: "c2",
          kind: "body",
          label: "踢向牆壁的那一腳",
          note: "力氣比玩球時大很多，球彈回來她也沒去追。",
          essential: true,
        },
        {
          id: "c3",
          kind: "context",
          label: "兩隊已經站好的位置",
          note: "兩邊人數剛好，沒有留空位，也沒有人往她的方向看。",
          essential: true,
        },
        {
          id: "c4",
          kind: "context",
          label: "小豪的表情",
          note: "小豪視線往旁邊下方閃了一下，肩膀微微內縮。",
          essential: false,
        },
      ],
      emotionOptions: ["anger", "loneliness", "fear", "surprise"],
      mindChoices: [
        {
          id: "m1",
          label: "她相信同學是故意跳過她，因為不想跟她一隊。",
          correct: true,
          feedback:
            "對。「沒被叫到」是事實，「他們是故意的」是她加上去的解釋。生氣的大小，往往取決於這個解釋。",
        },
        {
          id: "m2",
          label: "她相信小豪是因為記得她要練直笛才沒排她。",
          correct: false,
          feedback:
            "這是事實，但不是她此刻相信的事。如果她這樣想，就不會把球踢向牆壁了。",
        },
        {
          id: "m3",
          label: "她相信自己球技太差，配不上任何一隊。",
          correct: false,
          feedback:
            "如果是這樣，情緒會偏向傷心或退縮。但她的動作是向外用力，指向「被針對」的想法。",
        },
      ],
      abcCards: [
        { id: "a1", text: "兩隊念完名字，小美的名字沒有被念到。", slot: "antecedent" },
        { id: "b1", text: "她皺起眉頭，用力把球踢向牆壁，不再看同學。", slot: "behavior" },
        { id: "c1", text: "同學覺得她在鬧脾氣，更不敢過去邀她，她更確定自己被排擠。", slot: "consequence" },
      ],
      strategyChoices: [
        {
          id: "s1",
          label: "先做五次深呼吸，再走過去問：「這局還可以加我嗎？」",
          correct: true,
          feedback:
            "先降溫，再用一句可以被回答的問句取代猜測。這一問同時給了對方解釋的機會。",
        },
        {
          id: "s2",
          label: "走回教室，以後都不參加打球。",
          correct: false,
          feedback:
            "誤會沒有被解開，而且下一次分隊時同學會更不確定要不要叫她。",
        },
        {
          id: "s3",
          label: "大聲說「你們很過分」然後把球踢走。",
          correct: false,
          feedback:
            "她的委屈是真的，但這個做法會讓對方先防衛起來，反而沒人聽見她真正想說的「我也想加入」。",
        },
      ],
      debrief:
        "「被跳過」很容易讓人立刻想到「他們不喜歡我」。這一課練的是：先把猜測改成問句。很多時候對方的理由，和我們猜的完全不一樣。",
    },
    {
      id: "school-03",
      fileNo: "SCH-03",
      title: "還沒發生的失誤",
      brief:
        "下週有班級表演，小琳被分到獨唱一段。練習時間到了，她卻站在教室門口不肯進去，眼睛睜得很大，手指一直捏著衣角。",
      backdrop: "/game-assets/scenes/v5-scene-school-03.jpg",
      compositeScene: true,
      props: [
        {
          id: "p1",
          label: "半開的教室門",
          note: "裡面已經開始練習了，她聽得到聲音。",
          x: 51,
          y: 52,
          clueId: "c3",
        },
        {
          id: "p2",
          label: "牆上的節目單",
          note: "她的名字旁邊寫著「獨唱」兩個字。",
          x: 82,
          y: 42,
          clueId: "c4",
        },
        {
          id: "p3",
          label: "沒有跨過的門檻",
          note: "腳尖停在門檻前面，重心卻是往後的。",
          x: 60,
          y: 84,
          clueId: "c2",
        },
      ],
      characters: [
        {
          id: "lin",
          name: "小琳",
          gender: "female",
          sprite: "/game-assets/characters/v3-char-lin-sch03_web_5d1938ef.png",
          role: "focus",
          placement: { x: 44, y: 87, scale: 1, layer: 3 },
        },
      ],
      targetEmotion: "fear",
      mind: {
        fact: "老師已經說過表演可以兩個人一起唱，也可以先唱給老師一個人聽。小琳那天請假，沒有聽到這段。",
        belief: "小琳相信「我一定會唱錯，然後全班都會笑我」。",
        desire: "她想要順利完成，也想要不要被看到自己失敗的樣子。",
        knowledge: "她不知道可以兩個人一起唱，也不知道可以先私下唱給老師聽。",
      },
      clues: [
        {
          id: "c1",
          kind: "face",
          label: "小琳的眼睛",
          note: "上眼瞼大幅上抬，露出比平常多的眼白，眉毛整體上揚並靠近。",
          essential: true,
        },
        {
          id: "c2",
          kind: "body",
          label: "捏著衣角的手指",
          note: "手指反覆捏著衣角，身體重心往後，腳沒有跨過門檻。",
          essential: true,
        },
        {
          id: "c3",
          kind: "context",
          label: "教室裡的練習",
          note: "裡面已經開始練習了，她聽得到聲音，但沒有走進去。",
          essential: true,
        },
        {
          id: "c4",
          kind: "context",
          label: "牆上的表演節目單",
          note: "節目單上她的名字旁邊寫著「獨唱」兩個字。",
          essential: false,
        },
      ],
      emotionOptions: ["fear", "embarrassment", "sadness", "anger"],
      mindChoices: [
        {
          id: "m1",
          label: "她相信自己一定會唱錯，而且全班都會笑她。",
          correct: true,
          feedback:
            "對。害怕的特別之處是：它針對的是「還沒發生的事」。她害怕的不是現在，是她想像出來的那個畫面。",
        },
        {
          id: "m2",
          label: "她知道可以兩個人一起唱，只是想自己一個人唱。",
          correct: false,
          feedback:
            "她那天請假沒聽到這件事。這正是關鍵——她少了一個資訊，所以只看得到最壞的版本。",
        },
        {
          id: "m3",
          label: "她相信老師不喜歡她，才給她這麼難的任務。",
          correct: false,
          feedback:
            "這會導向生氣或委屈。但睜大的眼睛和往後的重心，是身體在準備逃走，指向的是害怕。",
        },
      ],
      abcCards: [
        { id: "a1", text: "她被分到要在班級表演中獨唱一段。", slot: "antecedent" },
        { id: "b1", text: "練習時間到了，她站在門口不進去，捏著衣角。", slot: "behavior" },
        { id: "c1", text: "她少練了一次，對自己更沒把握，下一次更不想進去。", slot: "consequence" },
      ],
      strategyChoices: [
        {
          id: "s1",
          label: "先深呼吸讓身體穩下來，再去問老師：「我可以先唱給你一個人聽嗎？」",
          correct: true,
          feedback:
            "先處理身體的警報，再把任務切成小一步。她原本不知道這個選項存在，一問就出現了。",
        },
        {
          id: "s2",
          label: "跟老師說身體不舒服，請假不參加表演。",
          correct: false,
          feedback:
            "逃開會讓當下馬上輕鬆，但「我做不到」的想法會被加強，下次面對類似的事會更害怕。",
        },
        {
          id: "s3",
          label: "在心裡一直告訴自己「不要緊張、不要緊張」。",
          correct: false,
          feedback:
            "叫自己不要緊張，通常會更注意到緊張。比較有用的是換一個做得到的小步驟。",
        },
      ],
      debrief:
        "害怕針對的常常是「還沒發生的事」。這一課練兩件事：先讓身體穩下來，再把大任務切成一個小到願意試的步驟。",
    },
  ],
};

/**
 * 社區場景案件包。視覺：半擬真 · 低刺激（見 VISUAL_SPEC.md）。
 * 教學重點：陌生情境中的社交尷尬、旁觀者視角、以及「別人怎麼看我」的過度推論。
 */
import type { GameScene } from "../types";

export const communityScene: GameScene = {
  id: "community",
  name: "社區",
  tagline: "在陌生的地方，我們特別容易猜錯別人的心。",
  backdrop: "/manus-storage/v2-scene-community_51f524a6.jpg",
  cases: [
    {
      id: "community-01",
      fileNo: "COM-01",
      title: "滑倒之後",
      brief:
        "在公園的步道上，小豪跑步時滑了一下跌坐在地。旁邊有幾個人轉頭看過來。他馬上站起來，低著頭往旁邊走，臉頰紅紅的。",
      backdrop: "/manus-storage/v4-scene-com01_68a2bad0.jpg",
      props: [
        {
          id: "p1",
          label: "步道上的水漬",
          note: "地面有一小片水漬，剛剛才被灑水器噴到。",
          x: 30,
          y: 82,
          clueId: "c4",
        },
        {
          id: "p2",
          label: "滾到旁邊的籃球",
          note: "球滾遠了他也沒有先去撿，先看的是旁邊。",
          x: 78,
          y: 72,
          clueId: "c3",
        },
        {
          id: "p3",
          label: "轉頭看過來的人",
          note: "有兩個人轉過頭來看，其中一個往前走了兩步。",
          x: 20,
          y: 46,
          clueId: "c3",
        },
      ],
      characters: [
        {
          id: "hao",
          name: "小豪",
          gender: "male",
          sprite: "/manus-storage/v4-char-hao-com01_web_6330a160.png",
          role: "focus",
          placement: { x: 46, y: 93, scale: 0.88, layer: 3 },
        },
      ],
      targetEmotion: "embarrassment",
      mind: {
        fact: "轉頭看的人是想確認他有沒有受傷，其中一位還往前走了兩步準備扶他。三十秒後大家就繼續做自己的事了。",
        belief: "小豪相信「所有人都在看我出醜，他們會一直記得這件事」。",
        desire: "他想要趕快讓這件事消失，想要不要被記住這個樣子。",
        knowledge: "他不知道那些人是在確認他有沒有受傷，也不知道他們很快就會忘記。",
      },
      clues: [
        {
          id: "c1",
          kind: "face",
          label: "小豪的視線與臉頰",
          note: "視線往旁邊下方避開，不與人對上；兩頰明顯泛紅。",
          essential: true,
        },
        {
          id: "c2",
          kind: "body",
          label: "小豪的肩膀",
          note: "肩膀往內縮，走路速度變快，像想趕快離開這個位置。",
          essential: true,
        },
        {
          id: "c3",
          kind: "context",
          label: "滾到旁邊的籃球",
          note: "球滾遠了他也沒有先去撿，先看的是旁邊。",
          essential: true,
        },
        {
          id: "c4",
          kind: "context",
          label: "步道上的水漬",
          note: "地面有一小片水漬，剛剛才被灑水器噴到。",
          essential: false,
        },
      ],
      emotionOptions: ["embarrassment", "anger", "fear", "pride"],
      mindChoices: [
        {
          id: "m1",
          label: "他相信所有人都在看他出醜，而且會一直記得。",
          correct: true,
          feedback:
            "對。尷尬的核心是「我以為別人腦中裝滿了我」。實際上別人腦中大多裝著自己的事。",
        },
        {
          id: "m2",
          label: "他知道大家只是關心他有沒有受傷。",
          correct: false,
          feedback:
            "這是事實，但不是他相信的事。如果他這樣想，會回一句「我沒事」而不是低頭快走。",
        },
        {
          id: "m3",
          label: "他相信是有人故意把水灑在地上害他跌倒。",
          correct: false,
          feedback:
            "這會導向生氣。但泛紅的臉頰和迴避的視線，指向的是尷尬。",
        },
      ],
      abcCards: [
        { id: "a1", text: "他在步道上滑了一下跌坐在地，旁邊的人轉頭看過來。", slot: "antecedent" },
        { id: "b1", text: "他立刻站起來低著頭快步走開，沒有回應任何人。", slot: "behavior" },
        { id: "c1", text: "想扶他的人停住了，他自己則整個下午都在想這件事。", slot: "consequence" },
      ],
      strategyChoices: [
        {
          id: "s1",
          label: "拍拍身上的灰，說一句「我沒事，謝謝」，然後繼續跑。",
          correct: true,
          feedback:
            "把事情收在原地。回應一句話，事件就結束了；不回應，它反而會在自己腦中一直重播。",
        },
        {
          id: "s2",
          label: "馬上跑回家，以後不要再去那個公園。",
          correct: false,
          feedback:
            "尷尬會過去，但避開整個地方會讓「那裡很危險」的想法留下來。",
        },
        {
          id: "s3",
          label: "大聲說「這裡地板有問題」，把注意力推給別人。",
          correct: false,
          feedback:
            "這樣做通常會把小事變大，反而讓更多人注意到剛剛發生了什麼。",
        },
      ],
      debrief:
        "尷尬會讓人覺得「全世界都在看我」，但別人的注意力其實很短。這一課練的是：回應一句話，把事情收在原地，不要帶回家重播。",
    },
    {
      id: "community-02",
      fileNo: "COM-02",
      title: "長椅上的一個人",
      brief:
        "公園長椅上有位阿嬤一個人坐了很久。她的視線一直往下，手放在膝上沒有動，經過的人都沒有停下來。只有小宇猶豫了很久，才端了一杯水走過去。",
      backdrop: "/manus-storage/v3-scene-com02_web_fa70b156.jpg",
      props: [
        {
          id: "p1",
          label: "長椅上的空位",
          note: "長椅還有很多空位，但沒有人坐下來。",
          x: 62,
          y: 62,
          clueId: "c3",
        },
        {
          id: "p2",
          label: "阿嬤放在膝上的手",
          note: "手放在膝上幾乎沒有動，身體微微朝內收。",
          x: 45,
          y: 66,
          clueId: "c2",
        },
        {
          id: "p3",
          label: "小宇遞出去的水",
          note: "他猶豫了很久才走過去，手還停在半空中不敢太靠近。",
          x: 68,
          y: 88,
          clueId: "c4",
        },
      ],
      characters: [
        {
          id: "grandma",
          name: "阿嬤與小宇",
          gender: "female",
          sprite: "/manus-storage/v4-pair-com02_web_82ffbf6d.png",
          role: "focus",
          placement: { x: 52, y: 94, scale: 1.06, layer: 3 },
          isPair: true,
        },
      ],
      targetEmotion: "loneliness",
      mind: {
        fact: "阿嬤每天都來這張長椅，她其實很想跟人聊天，但覺得自己開口會打擾別人。",
        belief: "阿嬤相信「大家都很忙，沒有人會想聽我說話」。",
        desire: "她想要有人陪她說幾句話，想要覺得自己還被需要。",
        knowledge: "她不知道旁邊的小宇其實注意到她好幾次了，只是不知道該不該過去。",
      },
      clues: [
        {
          id: "c1",
          kind: "face",
          label: "阿嬤的視線",
          note: "視線一直朝下，沒有看向經過的人，表情很平、沒什麼起伏。",
          essential: true,
        },
        {
          id: "c2",
          kind: "body",
          label: "阿嬤的姿勢",
          note: "身體微微朝內收，手放在膝上幾乎沒有動，動作很少。",
          essential: true,
        },
        {
          id: "c3",
          kind: "context",
          label: "長椅旁邊的空位",
          note: "長椅還有很多空位，但沒有人坐下來。",
          essential: true,
        },
        {
          id: "c4",
          kind: "context",
          label: "小宇遞出去的水",
          note: "小宇看了阿嬤好幾次才走過去，手還停在半空中，不敢靠得太近。",
          essential: false,
        },
      ],
      emotionOptions: ["loneliness", "sadness", "fear", "surprise"],
      mindChoices: [
        {
          id: "m1",
          label: "她相信大家都很忙，沒有人會想聽她說話。",
          correct: true,
          feedback:
            "對。她並不是不想聊，而是相信「開口會打擾別人」。這個信念讓她一直不開口，孤單就留下來了。",
        },
        {
          id: "m2",
          label: "她不想跟任何人說話，只想安靜坐著。",
          correct: false,
          feedback:
            "有些人真的只想安靜，這也要尊重。但線索是「一直朝下的視線」和「很少的動作」，比較接近想要卻不敢。",
        },
        {
          id: "m3",
          label: "她在等一個約好的人，對方遲到了。",
          correct: false,
          feedback:
            "如果在等人，她會不時看時間或張望入口。線索裡沒有這些動作。",
        },
      ],
      abcCards: [
        { id: "a1", text: "阿嬤一個人坐在長椅上，經過的人都沒有停下來。", slot: "antecedent" },
        { id: "b1", text: "她低頭安靜坐著，沒有主動跟任何人說話。", slot: "behavior" },
        { id: "c1", text: "看起來像不想被打擾，於是更沒有人過去，她更確定沒人想聽她說話。", slot: "consequence" },
      ],
      strategyChoices: [
        {
          id: "s1",
          label: "走過去坐在旁邊，先問一句：「阿嬤，我可以坐這裡嗎？」",
          correct: true,
          feedback:
            "一句簡單的問句就打破了那個循環。而且先問過再坐，也把選擇權留給了對方。",
        },
        {
          id: "s2",
          label: "在遠遠的地方對她揮揮手就好。",
          correct: false,
          feedback:
            "有一點好，但太短。孤單需要的是有人真的停下來待一會兒，不只是打招呼。",
        },
        {
          id: "s3",
          label: "不要打擾她，直接走過去。",
          correct: false,
          feedback:
            "體貼是好的，但這正是她預期會發生的事——每個人都覺得不要打擾，於是沒有人來。",
        },
      ],
      debrief:
        "孤單有時候是被一個循環維持住的：他以為沒人想聽，所以不開口；別人以為他不想聊，所以不過去。這一課練的是：主動問一句話，就足以打破循環。",
    },
  ],
};

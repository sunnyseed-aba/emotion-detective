# 移交盤點結果（暫存筆記）

## 程式碼（client/src，排除 components/ui 樣板）
App.tsx, main.tsx, index.css, const.ts, lib/utils.ts
components/: ErrorBoundary.tsx, ManusDialog.tsx, Map.tsx（樣板未使用）
components/game/: AbcBoard.tsx, CaseStage.tsx, ChoiceButton.tsx, FeedbackNote.tsx, HitBanner.tsx, ProgressSummary.tsx, ScoreCard.tsx, StageHeader.tsx
contexts/: ThemeContext.tsx
game/: assets.ts, emotions.ts, engine.ts, progress.ts, pronoun.ts, scoring.ts, strategies.ts, types.ts
game/scenes/: index.ts, school.ts, home.ts, community.ts
hooks/: useComposition.ts, useMobile.tsx, usePersistFn.ts
pages/: Home.tsx, Scenes.tsx, SceneCases.tsx, Play.tsx, NotFound.tsx
scripts/: swap_v3_assets.mjs

## 程式碼實際引用的 19 個遠端資產（/manus-storage/）
v2-logo_dff63d66.png
v2-scene-community_51f524a6.jpg
v2-scene-home_504687b5.jpg
v2-scene-school_07403420.jpg
v3-char-hao-sch02_web_ff9a0277.png
v3-char-lin-sch03_web_5d1938ef.png
v3-char-yu-hom01_web_938598cb.png
v3-char-yu-sch01_web_5b21709e.png
v3-scene-com02_web_fa70b156.jpg
v3-scene-hom01_web_818da1b6.jpg
v3-scene-hom02_web_c52d8a7b.jpg
v3-scene-sch01_web_c6501dae.jpg
v3-scene-sch02_web_b5aae1d8.jpg
v3-scene-sch03_web_dfb5a256.jpg
v4-char-hao-com01_web_6330a160.png
v4-char-mei-sch02_web_5a1ed9c8.png
v4-pair-com02_web_82ffbf6d.png
v4-pair-hom02_web_41d1d252.png
v4-scene-com01_68a2bad0.jpg

## 現存專案內散落的過程文件（待整併／歸檔到 docs/history/）
ideas.md, VISUAL_SPEC.md, IMPLEMENTATION_STATE.md,
ASSET_MAP_V3.md, ASSET_MAP_V3_FINAL.md, ASSET_MAP_V4.md, ASSET_MAP_V4_FINAL.md, ASSET_STATE_FINAL.md,
VISUAL_DIAGNOSIS.md, V3_DIAGNOSIS.md, V3_FINAL_CHECK.md, V3_HOTSPOT_RESULT.md, V3_PLACEMENT_AUDIT.md,
V4_DIAGNOSIS.md, V4_EDIT_PLAN.md, V4_GEN_REVIEW.md, V4_VERIFY.md, todo.md

## sandbox 圖片工作區：/home/ubuntu/webdev-static-assets/
含 v1(npc-*/scene-*/prop-*/logo-*)、v2-*、v3-*、v4-* 原始檔與 _cut/_web 衍生檔，
以及去背腳本 cutout.py / cutout2.py / cutout_v4.py / dechroma.py。

## package.json 重點
name emotion-detective-game, type module, pnpm@10.4.1
scripts: dev(vite --host) / build(vite build + esbuild server) / start / preview / check(tsc --noEmit) / format
關鍵依賴：react 19, wouter 3.3.5(patched 3.7.1), tailwindcss 4.1.14, framer-motion, lucide-react, sonner, radix-ui 系列
devDeps：vite 7, typescript 5.6.3, @tailwindcss/vite, vite-plugin-manus-runtime

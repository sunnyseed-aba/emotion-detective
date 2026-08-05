# 第四輪程式修改計畫（未完成則依此續作）

## 待改檔案：client/src/game/scenes/{school,home,community}.ts

### 1. school.ts — school-02 小美
`sprite` 由 `v3-char-mei-sch02_fix_6aadd83d.png`
改為 `/manus-storage/v4-char-mei-sch02_web_5a1ed9c8.png`
placement 維持 `{ x: 38, y: 88, scale: 1, layer: 3 }`（新圖 352×1100 較窄，可用 scale 0.92）

### 2. home.ts — home-02 改為雙人單一 sprite
刪除 `mei` 與 `mom` 兩筆，改為一筆：
```
{ id: "pair", name: "小美與媽媽", gender: "female",
  sprite: "/manus-storage/v4-pair-hom02_web_41d1d252.png",
  role: "focus", placement: { x: 52, y: 90, scale: 1.02, layer: 3 } }
```
（注意：`Character.role` 型別可能限定值，`gender` 影響代名詞，
  但 Play.tsx 的代名詞是抓 role==="focus" 的角色 → 需保留 gender: "female" 給小美用）

### 3. community.ts — com-01
- backdrop 改為 `/manus-storage/v4-scene-com01_68a2bad0.jpg`
- 小豪 sprite 改為 `/manus-storage/v4-char-hao-com01_web_6330a160.png`
- placement 改為 `{ x: 40, y: 90, scale: 0.86, layer: 3 }`
- 熱點座標需重對（新背景）

### 4. community.ts — com-02 改為雙人單一 sprite
刪除 `grandma` 與 `yu`，改為一筆：
```
{ id: "pair", name: "阿嬤與小宇", gender: "female",
  sprite: "/manus-storage/v4-pair-com02_web_82ffbf6d.png",
  role: "focus", placement: { x: 50, y: 92, scale: 1.05, layer: 3 } }
```
背景若已有長椅，需確認不重疊（可考慮把人物置中偏右，或背景長椅在左側）

## 資產 URL 對照見 ASSET_MAP_V4_FINAL.md

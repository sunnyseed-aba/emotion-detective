# assets/source/originals/ — AI 生成原始圖檔

## 這個目錄是什麼

所有 AI 影像生成模型直接產出的**未去背、未壓縮**原圖。命名前綴代表素材世代：

| 前綴 | 世代 | 說明 |
| --- | --- | --- |
| `v2-` | 第二代 | 首版半擬真素材（站姿、無明顯動作） |
| `v3-` | 第三代 | 「有動作姿態 ＋ 案情物件」大改版 |
| `v4-` | 第四代 | 針對頭髮透明、比例失真、雙人構圖等四項缺陷重生的素材 |

對應的去背成品在 `../../images/`，逐張對照表見 `../../ASSET_MANIFEST.md`，
生成 Prompt 見 `../../../docs/AI_PROMPTS.md`，去背腳本見 `../scripts/`。

---

## 重要：部分原圖僅存在於交付 ZIP

Manus WebDev 平台限制專案目錄內不得有超過 1MB 的媒體檔案（會造成部署逾時），
因此下列 **16 個超過 1MB 的原圖**已從線上專案目錄移出，**只存在於移交 ZIP 內**：

```
assets/icons/emotion-icons-sheet.png
assets/icons/prop-thought-bubble.png
assets/source/originals/v3-char-granny-com02.png
assets/source/originals/v3-char-hao-sch02.png
assets/source/originals/v3-char-lin-sch03.png
assets/source/originals/v3-char-mei-hom02.png
assets/source/originals/v3-char-mei-sch02.png
assets/source/originals/v3-char-mom-hom02.png
assets/source/originals/v3-char-rou-sch01.png
assets/source/originals/v3-char-yu-com02.png
assets/source/originals/v3-char-yu-hom01.png
assets/source/originals/v3-char-yu-sch01.png
assets/source/originals/v4-char-hao-com01.png
assets/source/originals/v4-char-mei-sch02.png
assets/source/originals/v4-pair-com02.png
assets/source/originals/v4-pair-hom02.png
```

如果你是從 **移交 ZIP** 解壓專案，這些檔案都在，無需處理。
如果你是從 Manus 平台匯出／clone 專案，這些原圖不在其中，請改用 ZIP 取得。

**這不影響遊戲執行。** 程式實際引用的是 `../../images/` 內已去背壓縮的 19 張成品，
原圖僅在需要重新去背、重新裁切或調整素材時才會用到。

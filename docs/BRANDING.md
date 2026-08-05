# Sunny Seeds Branding Layer

本文件說明「情緒偵探社」的 Sunny Seeds 品牌層。品牌層只管理識別資訊與 theme token，不改變案件內容、教學流程、遊戲引擎或目前視覺設計。

## 品牌架構

```text
client/src/brand/
├── brand.ts       品牌物件與 App Metadata
├── constants.ts   名稱、組織、版本、聯絡資訊與 Logo 路徑
└── theme.ts       品牌色 token 與 CSS variables 注入

client/public/brand/
├── logo.svg
├── logo-dark.svg
├── logo-light.svg
├── favicon.ico
└── apple-touch-icon.png
```

`BRAND` 是元件讀取品牌資訊的單一入口。`main.tsx` 在 React 啟動前套用 metadata 與 theme variables。

## 品牌資訊

集中於 `client/src/brand/constants.ts`：

- `APP_NAME`
- `APP_NAME_EN`
- `ORGANIZATION`
- `APP_VERSION`
- `VERSION_LABEL`
- `AUTHOR`
- `COPYRIGHT`
- `WEBSITE`
- `EMAIL`
- `LOGO_PATHS`

`WEBSITE` 與 `EMAIL` 目前保留為空字串，待 Sunny Seeds 提供正式資料後填入。元件不應自行寫死這些值。

## Logo 放置位置

Vite 的 public root 是 `client/public/`，因此瀏覽器 URL 與檔案位置如下：

| 用途 | 檔案 | URL |
| --- | --- | --- |
| 一般 Logo | `client/public/brand/logo.svg` | `/brand/logo.svg` |
| 深色背景 Logo | `client/public/brand/logo-dark.svg` | `/brand/logo-dark.svg` |
| 淺色背景 Logo | `client/public/brand/logo-light.svg` | `/brand/logo-light.svg` |
| Favicon | `client/public/brand/favicon.ico` | `/brand/favicon.ico` |
| Apple Touch Icon | `client/public/brand/apple-touch-icon.png` | `/brand/apple-touch-icon.png` |

目前檔案都是 placeholder。SVG 只有替換提示，沒有正式品牌設計；favicon 與 Apple Touch Icon 暫時沿用現有產品圖示作為技術 placeholder。

## 如何更換 Logo

1. 以正式檔案直接覆蓋 `client/public/brand/` 中的同名檔案。
2. 保留檔名與格式，即不需修改程式。
3. 建議 `logo.svg` 使用透明背景並包含合理的 `viewBox`。
4. `favicon.ico` 建議包含 16×16、32×32、48×48。
5. `apple-touch-icon.png` 建議為 180×180 PNG。
6. 執行 `pnpm build`，確認五個檔案都出現在 `dist/public/brand/`。

## Theme Tokens

`client/src/brand/theme.ts` 提供：

- `primary`
- `secondary`
- `accent`
- `success`
- `warning`
- `error`
- `background`
- `surface`

啟動時會轉成：

```text
--brand-primary
--brand-secondary
--brand-accent
--brand-success
--brand-warning
--brand-error
--brand-background
--brand-surface
```

目前值完全映射既有低刺激配色，因此建立品牌層不會改變畫面。`index.css` 的既有語意 token（例如 `--primary`、`--background`）再引用品牌 token，讓遊戲元件不需知道品牌色來源。

## 如何修改品牌色

1. 取得 Sunny Seeds 核准色票及對比規範。
2. 只修改 `client/src/brand/theme.ts` 的 `BRAND_THEME`。
3. 同步更新 `client/src/index.css` 中 `:root` 的 fallback 值，避免 JavaScript 尚未啟動時出現色彩閃爍。
4. 檢查 WCAG 對比、低刺激原則與答錯不用紅色的既有臨床限制。
5. 執行 `pnpm check`、`pnpm test`、`pnpm build` 並做首頁與遊戲流程視覺檢查。

## 如何修改 App 名稱

修改 `client/src/brand/constants.ts` 的 `APP_NAME` 與 `APP_NAME_EN`。首頁、Footer 與 runtime document metadata 會一起更新。

`client/index.html` 中的 `<title>` 與 description 是 JavaScript 載入前的 fallback。正式更名時也應同步修改 fallback，確保搜尋引擎與載入失敗情境仍顯示正確名稱。

## App Metadata

`client/src/brand/brand.ts` 集中管理 title、description 與 application name。`applyBrandMetadata()` 由 `main.tsx` 呼叫。目前 favicon links 在 `client/index.html`，路徑由 `LOGO_PATHS` 對應並保持固定。

## 首頁與 Footer

首頁低調呈現：

- Sunny Seeds ABA Learning Center
- 情緒偵探社
- Prototype Version
- Powered by Sunny Seeds

全站 Footer 呈現：

- © Sunny Seeds ABA Learning Center
- Emotion Detective Prototype
- Version x.x.x

這些文字都來自品牌層，不應在其他元件重複定義。

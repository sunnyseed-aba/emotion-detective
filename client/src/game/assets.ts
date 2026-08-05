/**
 * 靜態資源常數。所有圖檔皆以 `manus-upload-file --webdev` 上傳後的
 * `/manus-storage/...` 路徑引用（完整對照表見 assets/ASSET_MANIFEST.md）。
 *
 * 部署到 Manus 平台以外的環境前，需先執行 `node scripts/use-local-assets.mjs`
 * 把這些 CDN 路徑改寫為隨專案打包的本地 `/game-assets/...` 路徑。
 */
export const LOGO_URL = "/manus-storage/v2-logo_dff63d66.png";

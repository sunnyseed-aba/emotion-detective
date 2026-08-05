# 移交驗收清單（HANDOFF CHECKLIST）

> 本文件記錄移交前實際執行的驗證動作與結果，供接手者確認交付完整性。
> 驗證環境：Ubuntu 24.04、Node 22.13.0、pnpm 10.4.1。驗證日期：2026-08-05。

---

## 一、驗收項目與結果

驗證方式是把交付 ZIP 解壓到一個全新的空目錄（`/tmp/accept/`），完全不沿用開發環境的 `node_modules` 或快取，模擬接手者第一次拿到專案的狀況。

| 項目 | 結果 | 驗證方式與說明 |
| --- | --- | --- |
| 專案可以安裝 | 通過 | 乾淨目錄執行 `pnpm install` 成功，無錯誤。`patches/wouter@3.7.1.patch` 由 pnpm 自動套用 |
| 專案可以執行 | 通過 | `pnpm dev` 啟動 Vite dev server 於 3000 埠，回應 HTTP 200 且標題正確 |
| 專案可以建置 | 通過 | `pnpm build` 成功，輸出至 `dist/`（約 7.1MB）。有 chunk size 警告，屬效能建議非錯誤 |
| 型別檢查零錯誤 | 通過 | `npx tsc --noEmit` 無任何輸出 |
| 沒有遺漏依賴 | 通過 | `package.json` + `pnpm-lock.yaml` + `patches/` 齊備，全部為 npm 公開套件，無私有 registry |
| 沒有遺漏圖片 | 通過 | 程式碼中 19 個圖片 URL，逐一比對皆有對應本地檔案於 `assets/images/`，且以 Pillow 開啟驗證無損壞 |
| 沒有遺漏 Prompt | 通過 | 全部開發期影像生成 Prompt 保存於 `AI_PROMPTS.md`，含 v2／v3／v4 三個素材世代 |
| 沒有遺漏 API | 不適用（已說明） | 專案執行期不呼叫任何 API。詳見 `ARCHITECTURE.md` 第七節 |
| 沒有遺漏設定 | 通過 | `ENV_GUIDE.md`（環境變數）、`.nvmrc`（Node 版本）、`vite.config.ts`、`tsconfig.json`、`components.json` 齊備 |
| 沒有遺漏資料 | 通過 | 遊戲內容即 TypeScript 資料檔（`client/src/game/scenes/`），無外部資料庫。資產對照見 `assets/ASSET_MANIFEST.md` |
| 圖片在地化可運作 | 通過 | 在乾淨環境執行 `node scripts/use-local-assets.mjs`，成功改寫 4 個檔案共 19 個 URL，建置後 `dist/public/game-assets/` 確認含 19 個圖檔 |

---

## 二、資源盤點數字

| 類別 | 數量 | 位置 |
| --- | --- | --- |
| 程式實際引用的圖片 | 19（場景 10、人物 8、品牌 1） | `assets/images/` |
| AI 生成原始圖檔 | 34 | `assets/source/originals/` |
| 去背後處理腳本 | 4 | `assets/source/scripts/` |
| 未採用但保留的 Icon | 3 | `assets/icons/` |
| 音效／動畫／影片 | 0 | 空目錄，原因見 `ASSET_MANIFEST.md` |
| 遊戲邏輯與內容模組 | 12 | `client/src/game/` |
| 遊戲專用 UI 元件 | 8 | `client/src/components/game/` |
| 交付文件 | 9 | `README.md` + `docs/` 內 8 份 |
| 開發期原始工作筆記 | 22 | `docs/history/`（附索引 README） |

---

## 三、已知的非阻斷性事項

以下事項不影響專案運作，但接手者應該知道：

**`pnpm install` 會出現一則警告**，內容是 `package.json` 的 `pnpm` 欄位（`patchedDependencies`、`overrides`）在新版 pnpm 已改讀其他位置。目前 patch 仍能正確套用，但若未來升級 pnpm 版本，建議依警告提示把設定移至 `pnpm-workspace.yaml`。

**`pnpm build` 會出現 chunk size 警告**，因為所有頁面打包在單一 chunk。對本專案（單機使用、資產已在地化）影響有限，若在意首屏載入可依警告建議做 `manualChunks` 或路由層級的動態 import。

**部分原始大圖僅存在於交付 ZIP**。Manus 平台限制專案目錄內不得有超過 1MB 的媒體檔，因此 16 個超過 1MB 的原圖已移出線上專案目錄，只在 ZIP 內。清單與說明見 `assets/source/originals/README.md`。這不影響遊戲執行。

**尚未做過的驗證**：本專案沒有自動化測試（無 unit test、無 E2E），也沒有在實際目標使用者（ASD 兒童）身上做過可用性測試。七件案件的完整流程是以人工點測驗證的，但沒有回歸測試保護。這是 `TODO.md` 中的一項待補。

---

## 四、接手後的建議順序

1. **先跑起來**：`pnpm install` → `pnpm dev`，把七件案件各玩一遍，建立對遊戲的直覺理解
2. **執行圖片在地化**：`node scripts/use-local-assets.mjs`，脫離 Manus CDN 依賴
3. **讀文件**：`PROJECT_BRIEF.md`（為什麼）→ `ARCHITECTURE.md`（怎麼組成）→ `GAME_DESIGN.md`（內容規格）→ `DECISIONS.md`（踩過的坑）
4. **要新增素材前**，務必先讀 `docs/history/` 內的 V3／V4 診斷筆記，可避免重複踩 AI 生成素材的失敗模式
5. **決定下一步**：`TODO.md` 已按 P0–P3 排好優先順序，P0 是治療師儀表板

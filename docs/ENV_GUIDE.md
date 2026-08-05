# ENV_GUIDE.md — 環境變數說明

> 本檔案取代慣例上的 `.env.example`。原專案在 Manus 平台開發，`.env` 系列檔案由平台保護不可寫入，
> 因此把內容整理於此。接手後請依下方區塊自行建立 `.env`。
>
> 撰寫者：Manus AI｜最後更新：2026-08-05

---

## 最重要的一句話

**本專案在執行期不需要任何環境變數即可完整運作。**

這是一個純前端（static）的 React 應用程式，沒有後端、沒有資料庫、不呼叫任何 AI 或外部 API，
所有遊戲內容都是原始碼中的靜態資料，所有圖片都是靜態資產。

因此接手後可以直接執行 `pnpm install && pnpm dev`，完全不需要建立 `.env`。

---

## 若你仍想建立 .env

請在專案根目錄建立 `.env`，內容如下（全部留空亦可正常執行）：

```dotenv
# 網站標題（未設定時由 client/index.html 的預設值決定）
VITE_APP_TITLE=情緒偵探社

# 平台瀏覽數分析端點與網站識別碼（移出 Manus 平台後不需要，留空即可）
VITE_ANALYTICS_ENDPOINT=
VITE_ANALYTICS_WEBSITE_ID=
```

---

## 原 Manus 平台注入的變數清單

以下變數在原開發環境中由平台自動注入。本專案的程式碼實際上只用到 `VITE_APP_TITLE`
（以及 `client/index.html` 中的分析 script 會讀取兩個 analytics 變數）。其餘皆為平台樣板遺留，
移出平台後全部不需要。

| 變數 | 原用途 | 本專案是否使用 |
| --- | --- | --- |
| `VITE_APP_TITLE` | 網站標題 | 使用（可選） |
| `VITE_ANALYTICS_ENDPOINT` | 平台瀏覽數分析端點 | 僅平台分析 script 使用 |
| `VITE_ANALYTICS_WEBSITE_ID` | 平台網站識別碼 | 僅平台分析 script 使用 |
| `VITE_APP_LOGO` | 平台顯示用 logo | 未使用 |
| `VITE_APP_ID` | 平台應用識別碼 | 未使用 |
| `BUILT_IN_FORGE_API_KEY` | 平台內建 LLM 金鑰 | 未使用（本專案不呼叫 LLM） |
| `BUILT_IN_FORGE_API_URL` | 平台內建 LLM 端點 | 未使用 |
| `VITE_FRONTEND_FORGE_API_KEY` | 前端 LLM 金鑰 | 未使用 |
| `VITE_FRONTEND_FORGE_API_URL` | 前端 LLM 端點 | 未使用 |
| `JWT_SECRET` | 平台驗證用 | 未使用（無使用者系統） |
| `OAUTH_SERVER_URL` | 平台 OAuth | 未使用 |
| `VITE_OAUTH_PORTAL_URL` | 平台 OAuth | 未使用 |
| `OWNER_NAME` | 平台擁有者名稱 | 未使用 |
| `OWNER_OPEN_ID` | 平台擁有者識別碼 | 未使用 |

---

## 安全提醒

Vite 只會把前綴為 `VITE_` 的變數暴露給前端程式碼。未來若擴充功能需要金鑰，
**切勿把任何密鑰放在 `VITE_` 前綴的變數中**，因為它們會被打包進前端 bundle，等同公開。
需要保密的金鑰必須經由後端代理，而本專案目前沒有後端。

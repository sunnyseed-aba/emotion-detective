# 資產清單（ASSET_MANIFEST）

本檔案記錄專案所有視覺資產的來源、用途與對照關係。所有圖片皆由 Manus 內建影像生成模型產出（生成 Prompt 見 `docs/AI_PROMPTS.md`），去背與尺寸處理由 `assets/source/scripts/` 內的 Python 腳本完成，無第三方版權素材。

## 目錄結構

| 路徑 | 內容 |
| --- | --- |
| `assets/images/scenes/` | 程式實際引用的場景背景圖（web 最佳化版） |
| `assets/images/characters/` | 程式實際引用的角色去背圖（web 最佳化版） |
| `assets/images/brand/` | 品牌 Logo |
| `assets/icons/` | 情緒圖示總表、結案印章、想法泡泡（目前未在程式中引用，保留供後續使用） |
| `assets/source/originals/` | 生成後未壓縮的原始圖與部分中間版本（已統一縮至長邊 1600px 以控制倉庫體積） |
| `assets/source/scripts/` | 去背與去色溢的 Python 處理腳本 |
| `assets/audio/` | 空。專案目前**沒有音效**（低刺激設計刻意不加音效，見 `docs/DECISIONS.md`） |
| `assets/animations/` | 空。所有動畫皆以 CSS keyframes 實作於 `client/src/index.css`，無 Lottie/GIF 檔 |
| `assets/videos/` | 空。專案無影片資產 |

## 程式實際引用的 19 個資產

程式碼中以 `/manus-storage/<檔名>` 形式引用（Manus WebDev CDN）。下表列出遠端檔名、本地對應檔案與用途。執行 `node scripts/use-local-assets.mjs` 可一鍵改為引用本地檔。

### 場景背景（scenes）

| 遠端檔名 | 本地路徑 | 用途 |
| --- | --- | --- |
| `v2-scene-school_07403420.jpg` | `images/scenes/` | 場景選擇頁「學校」封面 |
| `v2-scene-home_504687b5.jpg` | `images/scenes/` | 場景選擇頁「家裡」封面 |
| `v2-scene-community_51f524a6.jpg` | `images/scenes/` | 場景選擇頁「社區」封面 |
| `v3-scene-sch01_web_c6501dae.jpg` | `images/scenes/` | SCH-01「沒有舉手的那隻手」教室發考卷 |
| `v3-scene-sch02_web_b5aae1d8.jpg` | `images/scenes/` | SCH-02「沒被叫到的名字」操場分隊 |
| `v3-scene-sch03_web_dfb5a256.jpg` | `images/scenes/` | SCH-03「還沒發生的失誤」教室門口走廊 |
| `v3-scene-hom01_web_818da1b6.jpg` | `images/scenes/` | HOM-01「被收走的積木」客廳地毯 |
| `v3-scene-hom02_web_c52d8a7b.jpg` | `images/scenes/` | HOM-02「被關掉的平板」客廳沙發 |
| `v4-scene-com01_68a2bad0.jpg` | `images/scenes/` | COM-01「滑倒之後」公園步道（含旁觀者） |
| `v3-scene-com02_web_fa70b156.jpg` | `images/scenes/` | COM-02「長椅上的一個人」公園長椅 |

### 角色立繪（characters）

| 遠端檔名 | 本地路徑 | 角色與案件 |
| --- | --- | --- |
| `v3-char-yu-sch01_web_5b21709e.png` | `images/characters/` | 小宇（SCH-01，坐姿低頭、手壓折起的考卷） |
| `v4-char-mei-sch02_web_5a1ed9c8.png` | `images/characters/` | 小美（SCH-02，站立握拳身體側轉；v4 修復頭髮透明問題） |
| `v3-char-hao-sch02_web_ff9a0277.png` | `images/characters/` | 小豪（SCH-02，拿名單轉頭喊人） |
| `v3-char-lin-sch03_web_5d1938ef.png` | `images/characters/` | 小琳（SCH-03，捏衣角、重心後仰不敢前進） |
| `v3-char-yu-hom01_web_938598cb.png` | `images/characters/` | 小宇（HOM-01，蹲在積木旁） |
| `v4-pair-hom02_web_41d1d252.png` | `images/characters/` | 小美＋媽媽（HOM-02，雙人同框合成圖） |
| `v4-char-hao-com01_web_6330a160.png` | `images/characters/` | 小豪（COM-01，低頭走開） |
| `v4-pair-com02_web_82ffbf6d.png` | `images/characters/` | 阿嬤＋小宇（COM-02，雙人同框合成圖） |

> **雙人同框圖的設計原因**：早期版本讓兩個獨立立繪各自縮放，導致比例落差過大（俗稱「小人國」問題）。v4 改為在同一張圖內畫出兩人，從根本保證身高比例正確。程式端以 `Character.focusName` / `focusGender` 指定代名詞主體。詳見 `docs/DECISIONS.md`。

### 品牌（brand）

| 遠端檔名 | 本地路徑 | 用途 |
| --- | --- | --- |
| `v2-logo_dff63d66.png` | `images/brand/` | 情緒偵探社標誌（放大鏡＋心形），首頁與 favicon |

## 未使用但保留的資產

`assets/icons/` 內三個檔案（`emotion-icons-sheet.png`、`prop-solved-stamp.png`、`prop-thought-bubble.png`）為早期「紙劇場」風格時期產出，後續改為 CSS 繪製的印章與泡泡，故未在程式中引用。保留供未來想改回圖片式視覺時參考。

`assets/source/originals/` 內含數個目前未被 v4 採用的 v3 立繪（`v3-char-granny-com02`、`v3-char-mei-hom02`、`v3-char-mom-hom02`、`v3-char-rou-sch01`、`v3-char-yu-com02`、`v3-char-mei-sch02`），它們是 v4 雙人合成圖取代前的單人版本。若未來要恢復單人立繪＋獨立擺位的做法，可從這些檔案重新處理。

## 去背處理腳本

| 腳本 | 用途 |
| --- | --- |
| `cutout.py` | v3 首輪去背：從四角泛洪填充移除白／淺色背景 |
| `cutout2.py` | v3 修補輪：綠幕去除與殘留光暈清理 |
| `cutout_v4.py` | v4 保守去背：加大顏色容忍度判斷但保留深色頭髮與淺色衣物，解決 v3 頭髮被誤刪成透明的問題 |
| `dechroma.py` | 去除邊緣綠色／彩色溢色 |

執行環境需求：Python 3.11 與 Pillow（`pip install pillow`）。

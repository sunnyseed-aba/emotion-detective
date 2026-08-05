# 第四輪重生資產（reserved URLs）

| 檔案 | Reserved URL | 用途 |
| --- | --- | --- |
| v4-char-mei-sch02.png | `/manus-storage/v4-char-mei-sch02_f41559fb.png` | school-02 小美（頭髮不透明、握拳） |
| v4-pair-hom02.png | `/manus-storage/v4-pair-hom02_f96dfb46.png` | home-02 小美＋媽媽（同構圖、面對面、正確比例） |
| v4-char-hao-com01.png | `/manus-storage/v4-char-hao-com01_b11ff304.png` | community-01 小豪（低頭走開） |
| v4-pair-com02.png | `/manus-storage/v4-pair-com02_75e537e7.png` | community-02 阿嬤＋小宇（同構圖、正確比例） |
| v4-scene-com01.jpg | `/manus-storage/v4-scene-com01_68a2bad0.jpg` | community-01 場景（含 2 位轉頭看的人） |

## 整合計畫
1. home-02 與 community-02 改為**單一雙人 sprite**：`characters` 陣列只留一筆，
   sprite 指向 pair 圖，`placement` 用較大的 scale 置中。
2. school-02 小美換成 v4 sprite。
3. community-01 場景換成 v4 backdrop，小豪換成低頭走開 sprite。
4. 需重新校對這四案的熱點座標（背景與人物都改了）。
5. 這些 URL 由 generate_image 直接產出、無需再上傳；但仍需下載回本地做去背（白底 → 透明）。

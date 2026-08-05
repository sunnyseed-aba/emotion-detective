# 第四輪最終資產 URL（已去背、已上傳）

| 用途 | URL | 尺寸 |
| --- | --- | --- |
| school-02 小美 | `/manus-storage/v4-char-mei-sch02_web_5a1ed9c8.png` | 352×1100 |
| community-01 小豪（低頭走開） | `/manus-storage/v4-char-hao-com01_web_6330a160.png` | 498×1100 |
| home-02 小美＋媽媽（雙人） | `/manus-storage/v4-pair-hom02_web_41d1d252.png` | 719×1000 |
| community-02 阿嬤＋小宇（雙人含長椅） | `/manus-storage/v4-pair-com02_web_82ffbf6d.png` | 1040×1000 |
| community-01 場景（含旁觀者） | `/manus-storage/v4-scene-com01_68a2bad0.jpg` | 2752×1536 |

## 去背驗證
保守 flood-fill（只移除與畫框邊界相連的白色）通過驗證：
頭髮實心、白鞋與淺色衣物保留、無破洞。

## 整合注意
- home-02 與 community-02 改為單一雙人 sprite，`characters` 只留一筆。
- community-02 的雙人圖已含長椅，背景若也有長椅需錯位擺放或改用空景區域。

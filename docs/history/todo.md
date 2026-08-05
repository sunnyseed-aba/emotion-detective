# 專案移交（Handoff）任務清單

> 前一輪「視覺修復（第四輪）」已全部完成並建立 checkpoint e297cd70。

## 一、盤點
- [ ] 列出 client/src 下所有專案自有原始碼（排除 shadcn/ui 樣板）
- [ ] 盤點 sandbox 內所有原始圖檔、去背腳本、生成紀錄
- [ ] 蒐集歷史設計決策紀錄（ideas.md、VISUAL_SPEC.md、各版診斷文件）

## 二、資產在地化
- [ ] 下載所有 /manus-storage/ 圖片到本地 assets/images/
- [ ] 建立 assets/ 目錄結構（images/audio/icons/animations/videos）
- [ ] 建立 assets/ASSET_MANIFEST.md 對照表（遠端 URL ↔ 本地檔名 ↔ 用途）
- [ ] 提供切換為本地資產的說明或腳本

## 三、文件
- [ ] README.md
- [ ] PROJECT_BRIEF.md
- [ ] ARCHITECTURE.md
- [ ] GAME_DESIGN.md
- [ ] TODO.md
- [ ] CHANGELOG.md
- [ ] AI_PROMPTS.md
- [ ] DECISIONS.md（設計決策與演進，含已放棄構想）
- [ ] DATA_MODEL.md（TypeScript 型別即資料模型）
- [ ] HANDOFF.md（交接索引，給接手 AI 的入口）

## 四、環境
- [ ] .env.example
- [ ] .nvmrc / engines 註明 Node 版本
- [ ] 確認 package.json scripts 完整（dev/build/preview/check）

## 五、驗證
- [ ] pnpm install 可完成
- [ ] pnpm dev 可啟動
- [ ] pnpm build 可成功
- [ ] tsc --noEmit 無錯誤
- [ ] 清點無遺漏圖片（所有 sprite/backdrop URL 都有對應本地檔）

## 六、交付
- [ ] 打包 ZIP
- [ ] 交付訊息附上 ZIP 與 checkpoint

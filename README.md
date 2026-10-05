# 該怎麼攻擊 Puma？

> 請輸入攻擊角度，我們幫你檢查會不會打到自己。

結合公開貼文、政策資料與 OpenAI，用大字結論、原文佐證和動漫吐槽回應質疑。認真題看證據，搞笑題開戰鬥型態。

**專案已於 2026-10-05 下線，網站不再提供服務。** 此 repo 保留 Hack Day 程式碼、資料、設計及活動紀錄。

[下線與清理紀錄](docs/DECOMMISSION.md) · [交付與驗證紀錄](docs/DELIVERY.md) · [一分鐘 Demo 腳本](docs/DEMO_CASES.md)

![網站首頁](docs/screenshots/home-live.jpg)

## Demo

首頁直接點三個範例，依序展示：

1. **針具與減害**：拆開清潔針具、替代治療與提供毒品，呈現台北市服務及 WHO 資料。主卡用白話重點，展開保留逐字原文。
2. **爆炸頭**：原創動漫旁白與戰鬥型態插畫，明示玩梗，不冒充本人動機。
3. **營養午餐**：說明目前免費保底、自費加菜方案；歷史發言不足的限制保持可見。

其他輸入會檢索公開資料，再由 OpenAI 整理；必要時使用搜尋備援。資料不足會明說，合理質疑也可以成立。三個已整理案例與已儲存回答都有標籤，沒有把它們假裝成每次即時生成。

## 技術

- Next.js 15 / React 19 / TypeScript，Node.js 22。
- Firebase App Hosting（台灣 asia-east1），Firestore 共享快取、限流、請求去重與交易式額度預留。
- OpenAI Responses API，結構化輸出、來源 ID 驗證，金鑰僅由後端 Secret Manager 讀取。
- Imagegen 生成透明插圖，畫面是可操作的 HTML/CSS，支援手機。

## 本機開發

```sh
npm ci
cp .env.example .env.local
npm run dev
```

首頁可直接預覽。要使用 API，需配置**自己的** OpenAI key、Firebase 專案及 Application Default Credentials；`.env.local` 不進 Git。Firestore 的 `config/service` 需包含分析／搜尋開關、首次試用日期、預算及簽名 session secret；具體控制與部署紀錄見 [DELIVERY.md](docs/DELIVERY.md)、[ENVIRONMENT.md](docs/ENVIRONMENT.md) 與 `src/server/store.ts`。只有設定環境變數不能繞過共享費用控制。

```sh
npm run build
node src/server/backend.test.cjs
```

16 項後端測試使用記憶體 Firestore 替身，不需要雲端權限或付費 API。正式 build、桌面／手機 UI 與真實模型／搜尋路徑已驗證。

## 檔案

| 路徑 | 用途 |
|---|---|
| `src/app/` | 首頁、樣式、分析／健康 API |
| `src/components/` | 回答卡片、原文與來源展開、插圖 |
| `src/server/` | 檢索、生成、資料驗證、Firestore 控制 |
| `src/contracts/` | 共用 TypeScript / Zod 契約 |
| `data/` | 案例、來源與公開索引快照 |
| `scripts/import-posts.ts` | 可重跑的資料匯入 |
| `public/illustrations/` | 實際部署的透明 PNG |
| `design/proposals/` | 視覺提案與提示紀錄 |
| `docs/` | 研究、工程、Demo、交付與實際畫面 |

## 資料與立場

民間支持者作品，立場公開，證據決定結論。貼文索引來自 [2026 市長官方來源觀測站](https://mayor2026.observe.tw/taipei/shen-poyang/)，另有本人官網、政府與 WHO 資料。731 筆去重跨平台紀錄不等於所有歷史 Facebook 貼文，保存版本也不等於全部已逐筆核對。

網頁只顯示相關摘錄；此 repo 保留已公開的索引快照供重現，貼文權利仍屬原作者。本站整理與原創旁白都與逐字原文分開標示。

首日使用者授權 API 預算 US$50，應用採保守額度控制，**不是供應商帳單硬上限保證**。新付費分析限2026-10-04台北日期，隔日不自動續開；既有案例／有效快取仍可讀。詳細限制見交付紀錄。

## 活動紀錄

DevDay Exchange Community Hack Day: Taipei，2026-10-04。賽前規劃文件與預先建立的雲端環境、活動中實作的程式提交，均保留真實紀錄，沒有重寫日期或重置 Git 歷史。

新隊友讀 [START_HERE.md](START_HERE.md)；工程代理讀 [AGENTS.md](AGENTS.md)。賽前與開工規劃入口保留於 [PROJECT_PLANNING_INDEX.md](docs/PROJECT_PLANNING_INDEX.md)。

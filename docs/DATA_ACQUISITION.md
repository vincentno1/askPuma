# 明天的資料取得與檢索方案

研究日期：2026-10-03，Asia/Taipei。今天只做公開來源的唯讀查閱與統計，**尚未把資料匯入專案、建立資料 JSON、執行爬蟲或呼叫付費 API**。明天活動開始且使用者啟動實作後，由 D 執行，A 整合。

## 結論：優先使用現成公開資料，再補關鍵證據

找到直接相關的開源專案：[2026 市長官方來源觀測站](https://mayor2026.observe.tw/about/)／[GitHub](https://github.com/skyhong2002/mayor2026)。它收集候選人的 Facebook、Instagram、Threads、YouTube、X 與網站內容，提供不用 API key 的靜態 JSON 和 RSS。

**這是已收集的歷史，不是兩人全部發文。** 今天實際讀取兩份完整候選人 JSON 後，得到以下快照；明天重新取得時筆數可能改變。

| 人物 | 跨平台紀錄 | Facebook 紀錄 | Facebook 發文日期範圍 | 原始 JSON 大小約 |
|---|---:|---:|---|---:|
| 沈伯洋／Puma | 731 | 223 | 2026-06-07～2026-10-02 | 1.14 MB |
| 蔣萬安 | 127 | 68 | 2026-06-20～2026-10-02 | 0.29 MB |

合計 858 筆跨平台紀錄，約 1.43 MB。Puma 全平台日期最早是 2025-01-15；蔣萬安全平台最早是 2024-07-17。這些較早日期來自其他平台，不能宣稱 Facebook 也覆蓋那些年份。部分紀錄可能沒有發文日期；空日期保留空值。

### 要讀哪些端點

- [Puma 已收集貼文](https://mayor2026.observe.tw/api/posts/shen-poyang.json)
- [蔣萬安已收集貼文](https://mayor2026.observe.tw/api/posts/chiang-wanan.json)
- [候選人 metadata](https://mayor2026.observe.tw/api/candidates.json)
- [來源帳號 metadata](https://mayor2026.observe.tw/api/sources.json)
- [收集狀態](https://mayor2026.observe.tw/api/status.json)
- [API／Feed 說明](https://mayor2026.observe.tw/feeds/)

`/feeds/{candidate}.json` 只提供最近 50 筆；明天匯入要用 `/api/posts/{candidate}.json`。不用先 clone 整個爬蟲 pipeline。若後續需要原始歷史儲存，GitHub 的 `data` branch 有 JSONL，`gh-pages` 是網站快照；第一版兩個 HTTP JSON 已足夠。

### 必須保留的資料限制與署名

- 程式碼採 MIT；貼文、圖片、影音內容的權利仍屬原作者。不能把整份貼文資料宣稱為 MIT 授權。
- 來源區標示「貼文索引：2026 市長官方來源觀測站」，連回專案；每張證據卡另連人物原始貼文。
- upstream 的 `classification`、`topics`、`topicScores`、`agendaRelevance` 等 AI 分類只可協助檢索，不能當成查核結論。
- 某些貼文可能已刪除，觀測站仍保留之前收集的文字。原文無法開啟時，要標示是保存版本，不能假裝原文目前仍可讀。
- 只展示與問題相關的必要短摘錄及前後文，避免公開重製全部貼文。第一版不下載媒體、留言或按讚名單。
- 候選人帳號須由 `sources.json` 核對，不只猜粉專名稱。今天 metadata 代表連結為 Puma 的 `facebook.com/puma.taipei/` 與蔣萬安的 `facebook.com/chiangwanan/`；不保證只各有這一個來源。

## D 的最短執行流程

先交可用的四份核心證據，再交較大的檢索索引。匯入可以與原文查核並行，但不能延後 13:25 的核心交付。

| 時段 | 工作與交付 |
|---|---|
| 13:00–13:05 | 重讀本文件及 SOURCES；測兩個 JSON 端點、記錄取得時間、筆數與版本。超過五分鐘受阻就回退，不等待服務恢復 |
| 13:05–13:20 | 建立 SOURCES 的 S01–S04，核對短摘錄及日期；另匯入並正規化現成貼文索引 |
| 13:20–13:25 | 交四份核心 SourceRecord、案例、資料覆蓋說明；索引成功時同批交給 A／C |
| 13:25–13:35 | 抽查兩人的匯入紀錄、重複與日期；核對會出現在 Demo 的每條引文。額外取得本次爭議原始影音／發文，有則補、無則保留新聞轉述標示 |
| 13:35 後 | 轉 QA：檢查檢索出的文章、人物、日期、上下文及引用是否支持結論 |

**2014 原文與 2026-10-03 的最新爭議不在上述 Facebook 日期範圍內。** 針具主案例仍需想想論壇原文、中央社報導、市府資料與 WHO 指南，詳見 [SOURCES.md](SOURCES.md)。不能因為匯入 858 筆就認為這個案例已完成。

## 正規化與查核狀態

upstream 頂層目前有 `candidate`、`count`、`posts`、`version`，貼文有 `id`、`candidateId`、`sourceId`、`platform`、`postedAt`、`text`、`url` 等欄位。schema 可能改動，匯入時要檢查，失敗回退核心資料。

| upstream 欄位 | 本專案處理 |
|---|---|
| id | 保留為 upstreamId；專案 id 加來源前綴，避免與 S01 等衝突 |
| candidateId／sourceId／platform | 保留於內部 ArchivePost；識別作者和平台 |
| text | 保留原始文字，不讓模型重寫成「原話」；查詢時才擷取必要段落 |
| url | 保留為原始來源 URL；檢查網址格式與作者，原文無法開啟則說明 |
| postedAt | 保留原始 timestamp；顯示以 Asia/Taipei 轉換。缺值則 publishedAt=null、datePrecision=unknown |
| retrievedAt | 我們實際取得資料的時間；不冒充 upstream 當初爬取時間或發文時間 |
| classification／topics／keywords 等 | 僅用作排序提示，不能當成證據或 verdict |

內部 `ArchivePost` 與對外 `SourceRecord` 是不同責任：大量紀錄先作檢索候選，不把所有內容都渲染成證據卡。去重先以原始 URL／平台 id，跨平台相同文字可合併檢索展示，但保留各原始連結與日期，不能刪掉可能不同的上下文。

依 [CONTRACTS.md](CONTRACTS.md)：

- 批次匯入預設 `reviewStatus=imported_unchecked`，來源取得方式 `origin=mayor2026_archive`。
- `checked` 只給逐筆核對過的文字、日期與網址。抽查成功不代表整批變成 checked。
- `search_only` 是只有搜尋摘要；不是批次匯入完整文字的同義詞。
- 原始頁面無法取得而只能核對保存版本時，保留 imported_unchecked、archiveUrl 和限制說明；可提供線索，不能顯示成已核對的現行人物原話。
- 展示未核對紀錄時標示「公開資料庫收錄，尚未逐筆核對」。模型不得把該紀錄當作唯一依據下確定結論；重要主張須補原文或其他來源。

## C 的檢索接法：先簡單，避免新服務

1. 小型、已核對的核心證據走既有 curated 路徑。
2. 額外貼文索引只在後端載入，不塞進前端 bundle，也不把 858 筆全文送進每次模型 context。
3. 第一版用繁簡詞彙變體、關鍵詞與中文字元 bigram 做候選檢索，按相關性取少量紀錄，例如 5–8 筆，再選短段落。
4. 作者、日期和來源類型要一併送入模型。回傳來源與真實取得的紀錄對應，不讓模型自行編 URL。
5. 已核對證據不足則走有上限的網頁搜尋；只有未核對索引時，結論保留限制。
6. 不在 90 分鐘內建立 embedding pipeline、向量資料庫、每天排程同步或每次訪客請求都跑 Facebook scraper。

這些是實作設計，並非檢索品質已通過測試。A／C 依自然問法、否定語句與未知議題驗收調整，不承諾只靠簡單關鍵詞就能涵蓋所有問題。

## 只有缺必要資料時才使用 Apify

[Apify 官方 Facebook Posts Scraper](https://apify.com/apify/facebook-posts-scraper) 支援 URL、數量與日期篩選；[輸入 schema](https://apify.com/apify/facebook-posts-scraper/input-schema) 對頁面／profile 的描述與產品頁不完全一致，不能預先保證所有 Puma 帳號都能成功。

必要時明天先各測 5–10 筆，確認作者、文字、日期與原始 URL，再決定是否追加 50–100 筆。只針對缺漏區間；不先爬全歷史、不抓留言、不等多小時工作。五分鐘仍卡住就回到現成索引＋人工核心來源＋有限搜尋。

[官方 pricing tab](https://apify.com/apify/facebook-posts-scraper/pricing) 在研究當下列出 Free plan 每 1,000 筆 US$5；日期篩選另加每 1,000 筆 US$2，啟動費 US$0.001。實際採用前以當時帳號／actor 顯示計費為準；網站「from $2」不等於免費方案單價。Apify 費用獨立於 US$50 OpenAI API 預算，今天未啟動付費工作。

## 其他公開資料是否值得明天接

| 資料／工具 | 是否適合第一版 |
|---|---|
| [kiang/elections 的 Facebook 名單](https://github.com/kiang/elections/blob/master/Console/Command/data/facebook_candidates.csv) | 是帳號名單，不是發文全文庫；現成觀測站已更貼近需求 |
| [立法院開放資料](https://data.ly.gov.tw/gniKK/developer.action) | 可補議案／質詢等官方紀錄；不是 Facebook corpus，特定題目需要才接 |
| [Cofacts API](https://api.cofacts.tw/) | 內容是查核訊息而非候選人全部原文；API 文件要求資料協議及 app-id／app-secret 申請，不當成明天即插即用依賴 |
| Meta Content Library | 有資格與申請條件；不列為 90 分鐘必需項 |

## 最小退路與交付

觀測站無法取得時：四份核心來源仍可完成 Demo，未知題目用有限搜尋／資料不足。Apify 失敗也不阻塞部署。

D 交付必須有：資料版本、實際取得時間、各平台筆數與日期覆蓋、核心來源的逐筆查核狀態、署名、缺漏清單、Demo 引文與限制。不要寫「已抓到所有歷史 Facebook」，也不要把資料使用說成自己開發了上游爬蟲。

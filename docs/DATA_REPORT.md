# 資料交付與核對紀錄

2026-10-04，Asia/Taipei，D 資料分工。這是活動中實作紀錄，以下 JSON 與程式已建立；不沿用賽前文件的「尚未匯入」狀態。

## 快照與覆蓋

`data/import-metadata.json` 是版本與時間的權威紀錄。資料版本 `archive-v1-0650cf95bae9`；上游 version=1，root.posts 原始 732 筆，依重複 id／原頁 URL 去重後 731 筆。來源帳號由同次取得的 `/api/sources.json` 中沈伯洋 accounts 白名單核對；不依 AI 分類判定來源或真偽。

| 平台 | 正規化筆數 |
|---|---:|
| Threads | 187 |
| Instagram | 136 |
| Facebook | 222 |
| YouTube | 123 |
| 本人網站 | 62 |
| X | 1 |

`data/snapshots/shen-poyang.json` 與 `upstream-sources.json` 保留取得的原始位元組。SHA-256、實際取得時間、日期覆蓋、缺日期筆數與重複統計均記於 metadata。上游有一筆空日期，正規化為 null，不猜日期。原始 timestamp 與平台保留；展示換算台灣時間。相同文字而原頁不同的跨平台紀錄保留各連結與日期，正文 hash 只統計重複，不抹去平台語境。

貼文索引署名：[2026 市長官方來源觀測站](https://mayor2026.observe.tw/about/)；[原始公開 JSON](https://mayor2026.observe.tw/api/posts/shen-poyang.json)。不包含所有歷年發文，不宣稱全部 Facebook 已查核。貼文權利仍屬原作者；沒有下載圖片、影片、留言或名單。完整保存文字只供後端檢索，公開卡片僅展示必要短摘錄。

## 核對與案例

六份核心來源均符合 SourceSchema。S01、S03、S04、L02 已直接核對頁面文字／日期／URL，標 checked；checked 不是其全部主張都為真。兩份社群原頁无法讀取，維持 imported_unchecked，並保留原始網址、公開索引保存頁、實際平台與時間。

針具標題由台北市清潔針具交換資料與 WHO 減害摘要支持；2014 文章的供毒字樣沒有刪除。首屏限制「針具交換與提供毒品需分開判斷」。未確認不增加吸毒的具體成效，不把清潔針具說成杜絕毒品，也不推出市長不知道政策或故意說謊。

午餐標題限定「目前方案」，官網能支持免費基本保障與自費品質選項並存。首屏限制「目前方案可確認；早期完整發言尚待核對。」原問題保留「髮夾彎」，沒有把歷史質疑無聲改寫或宣稱從未改變。官網完整原標題包含「始終一致」，此為來源本身標題，案例並未採納該歷史判定。

爆炸頭為 playful，verdict=null、claims=[]、heroCitation=null、headlineSourceIds=[]、sourceRefs=[]。文案為本站原創；動漫台詞未核對、留髮原因未知，限制保留。

三題順序與 canonicalQuery 完全對齊 DEMO_QUERIES。無廣泛關鍵字別名；只有三份完整問題命中已整理案例。三份人工作品均 modelVersion=null、promptVersion=curated-editorial-v1，不假稱由 API 生成。

## 重跑與驗證

Node 22.18+，安裝 A 管理的專案依賴後執行：

```sh
node --experimental-strip-types scripts/import-posts.ts
```

預設讀取已保存快照，同一 hash 保留原 retrievedAt，結果可重現。重新取得上游需明確執行 `node --experimental-strip-types scripts/import-posts.ts --refresh`；更新資料版本後，核心案例需重新核對並由 A／D 同步其 dataVersion，不自動提高查核狀態。

已通過：import 腳本、TypeScript typecheck、731 筆 SourceSchema、6 筆核心 SourceSchema、3 筆 PreparedCaseSchema、唯一 ID、來源／excerpt references、精確 demo 順序、社群短摘錄為保存全文連續子字串、平台與原始日期一致、玩梗模式的零事實主張。重跑快照前後輸出 hash 一致。整合 UI／公開 API QA 由 A 接入後進行。

# askPuma 交付紀錄

2026-10-04，Asia/Taipei。正式網址：[該怎麼攻擊 Puma？](https://askpuma--askpuma-prod.asia-east1.hosted.app)。

## 目前完成

- Next.js 15.5.27 / React 19 / Node 22，Firebase App Hosting 台灣 asia-east1；沿用 askpuma-prod、BotsUP 共用帳單。
- 首頁、大字事實回答、動漫玩梗回答、來源／上下文展開、自由輸入、錯誤保留輸入、手機版。
- 三個 Demo 按鈕：針具與減害 → 爆炸頭 → 營養午餐。使用真正整理案例，標示「已整理案例」，不冒充每次即時生成。
- 三份 imagegen 真正透明 PNG 圖層已部署，清單見 ASSETS.md。
- 公開索引匯入 731 筆去重跨平台貼文、753 個連續原文摘錄；另有人工核對的政府、WHO、本人官網政策來源。資料版 archive-v3-0650cf95bae9。
- 真實 OpenAI Responses API gpt-6-astra；後端依議題檢索，結構化答案只能引用已提供 source ID。搜尋摘要及未逐筆核對貼文不能單獨支撐確定結論。
- Firestore 共享快取、簽名匿名 session、限流、請求去重、交易式額度預留；key 放 Secret Manager runtime，未進 Git／瀏覽器。

## 驗證

- `node src/server/backend.test.cjs`：16 項通過，含原文引用、否定詞快取、泛詞檢索、住宅政策、額度／併發／到期阻擋、未核對證據降級。
- 正式站 health 200；三題由實際 UI 操作，來源展開可用。
- 自由住宅題已真實呼叫模型並引用 POL01 官網政策；重問命中 saved 快取。無資料的火星題顯示證據不足。正式站零索引題另外確認 web 搜尋＋整理共2次模型呼叫、searchUsed=true，結果保留不足判定。
- `npm run build`：最終候選通過，含 TypeScript、頁面生成與 route build。正式站自由題「Puma 的青年住宅政策是什麼？」回覆 HTTP 200 / generated / v3，引用 POL01，並誠實保留具體辦法不足的限制。
- production 依賴 audit 上次結果 0 vulnerabilities。
- 桌面與390px手機實際畫面已保存於 screenshots/；手機 scrollWidth=innerWidth=390。模型說明中的來源代碼已改為來源名稱／中文狀態，不改動原文引用。

## 費用與已知範圍

使用者授權首日 API US$50；應用目前最多 40 次新付費分析，以每次 US$1 保守記帳、總預算門檻 US$45、同時最多4筆，每個 session 每10分鐘最多3次。這是保守的應用帳務，**不是 OpenAI 實際帳單或供應商硬上限保證**；供應商 hard cap 未設定／驗證。搜尋每題最多1次，連同整理最多2次模型呼叫，總超時45秒。

付費新分析限定 budgetDate=2026-10-04（Asia/Taipei），隔日不會自動續預算；既有案例／有效快取仍可讀。要續開必須明確修改日期與開關。API 額度与 Codex／Firebase 費用分開。

資料不是所有 Facebook 完整歷史，也沒有蔣萬安全文庫。保存貼文未全部逐筆核對；午餐當前方案與歷史一致性分開。網站公開支持者立場，同時允許合理質疑／證據不足，不保證所有攻擊都有反駁。搜尋支援有條件備援，不能保證每題取得新來源。

## 真人下一步

直接開正式網址錄影；58秒三題腳本見 DEMO_CASES.md，錄影工具見 RECORDING.md。作品提交14:30、YouTube提交15:00。尚未代為提交比賽或錄製／上傳影片。

## 本機重現與部署

`npm install` → `npm run dev`。key 可用本機已忽略的 .env.local；雲端用 Secret Manager。部署只由整合 session：

```sh
firebase deploy --only apphosting:askpuma --project=askpuma-prod --account=vincent@botsup.cc
```

新增題卡先核對 data/cases.json、data/sources.json 契約，不把未核對來源升成 checked；資料改版需同步 import metadata 和案例 dataVersion。

## 最終部署

2026-10-04 14:23:03（Asia/Taipei），直接讀取 App Hosting rollout `build-2026-10-04-005`，確認 `state=SUCCEEDED`。實際部署來源 commit `5aa5b00`（包含前端中文說明修正 `f65eb13`），Cloud Build `ae0620c9-20be-4273-aa6d-0e9b6eb4ef42` SUCCESS。

部署 CLI 曾過早回報前一輪完成，並有一次上一輪進行中造成409；沒有把 CLI exit code 當成最終驗證。以雲端 rollout 成功及正式頁面實際載入為準。公開 health HTTP 200。

最終畫面核對：公開站已載入新 page chunk，住宅快取回答已把 POL01／imported_unchecked 轉成中文名稱；原文摘錄不變。Cloud Run 最新 ready revision 與100% traffic 均為 build-2026-10-04-005。首頁實際截圖：screenshots/home-live.jpg；爆炸頭：screenshots/afro-live.jpg；手機午餐：screenshots/lunch-mobile-live.jpg。正式瀏覽器已留在首頁，測試 viewport override 已恢復。

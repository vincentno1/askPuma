# 新隊友先看：askPuma

2026-10-04，Asia/Taipei。Vincent＋兩位夥伴；網站已公開上線，先讀 [交付紀錄](docs/DELIVERY.md)；下方保留原始分工與準備紀錄。

## 一句話

**該怎麼攻擊 Puma？**

> 請輸入攻擊角度，我們幫你檢查會不會打到自己。

支持 Puma 的民間半諷刺網站：大字短結論、本人原文、來源佐證、一句旁白；認真題查資料，爆炸頭等題用動漫梗。**名字負責挑釁，互動負責搞笑，原始資料負責讓人服氣。** 沒資料要承認，合理質疑也可以成立，不每題都強行說他對。

## 最新決定，其他文件不同以這裡與工程方案為準

- Demo 順序：**發針頭給吸毒者 → 爆炸頭 → 營養午餐**。
- 視覺：01 首頁＋02 原貼文結果 v2＋03 動漫結果 v2；舊 02／03 已停用。
- 三題先做經核對、公開可用的已整理案例，標明已整理；其他輸入用真實檢索與 OpenAI 生成。
- 新鮮資料入口是 [公開候選人貼文索引](https://mayor2026.observe.tw/taipei/shen-poyang/)，732 筆跨平台，Facebook 223 筆，沒有全部歷年 Facebook。
- **網站由 Vincent／Codex 做，兩位夥伴補有趣題目、原來源與 QA。** 不要求夥伴寫前端。

## 各自看什麼

| 人 | 工作 | 必讀 |
|---|---|---|
| Vincent／Codex | 骨架、UI、後端、資料匯入、整合、正式部署 | [工程方案](docs/IMPLEMENTATION_PLAN.md)、[契約 v2](docs/CONTRACTS.md)、[任務書](docs/SESSIONS.md)、[環境](docs/ENVIRONMENT.md)、AGENTS.md |
| 夥伴 1 | 搞笑題、動漫聯想、短句與旁白；也試玩梗誤判 | [三題與題卡格式](docs/DEMO_CASES.md)、[搞笑模式](docs/HUMOR_MODE.md)、[視覺](design/proposals/README-v2.md) |
| 夥伴 2 | 查原文與日期、補上下文、手機／熱點QA、錄影提交協助 | [三題](docs/DEMO_CASES.md)、[來源](docs/SOURCES.md)、[驗收](docs/ACCEPTANCE.md)、[影片](docs/RECORDING.md) |

一個新題目先交：題目、想吐槽的點、原來源 URL＋日期、短原句、前後文、大字候選、旁白、不能推論什麼、是否核對。搞笑純創作也要標，不冒稱本人說法。負責人核對後再進正式案例，夥伴不必處理 schema 或 key。

## 開工前準備紀錄（歷史狀態）

Firebase project askpuma-prod、App Hosting backend askpuma、Firestore 已建立在 asia-east1，掛 BotsUP 共用帳單；Secret 容器與 IAM 已準備。使用者已備妥 OpenAI key，但 runtime 放置與模型權限尚未核對。預分配 App Hosting URL 不是網站已上線。

本機有完整規劃、來源連結、視覺 PNG、部署設定。**沒有網站程式、下載完成的貼文 JSON、已生成的正式答案、應用 build／rollout**；本輪只查資料與更新文件。拿到 zip 不代表取得雲端帳號權限。開工沿用已有專案，不重建。

## 時間與品質

本輪 13:41 核對距作品截止約49分鐘；實際开工按 [壓縮排程](docs/IMPLEMENTATION_PLAN.md) 調整。現在要早部署，14:00 凍結大功能，14:10 最後候選，14:25 開始提交，14:30 截止；14:30–14:50 錄 55–58 秒影片、上傳並提交，15:00 截止。

針具／供毒／替代治療要分開；市府有服務不能證明市長無知或說謊。午餐目前方案不能單獨證明歷史從未改變。保存版原文未核對時直接顯示狀態。錄影的三題是正常已整理案例，不演出假即時生成。

API 首日 US$50，應用停新請求門檻建議 US$45＋預留成本；Codex 用量與 Firebase 費用另計。完整最新文件入口是 [README](README.md)。

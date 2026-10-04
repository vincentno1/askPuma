# askPuma：該怎麼攻擊 Puma？

> 請輸入攻擊角度，我們幫你檢查會不會打到自己。
>
> 名字負責挑釁，互動負責搞笑，原始資料負責讓人服氣。

**新加入的真人隊友先讀 [兩分鐘導讀](START_HERE.md)**：產品想法、目前進度、三人建議分工與今天截止時間。

**最新方向：** [01 首頁已認可](design/proposals/README.md)，[新版 02 原貼文回答／03 動漫玩梗提案已生成](design/proposals/README-v2.md)。回答頁要 [大字、簡潔、原貼文為主，細節按開](docs/RESULT_DESIGN.md)，另支援 [動漫玩梗題](docs/HUMOR_MODE.md)。[攻防研究](docs/ATTACK_RESEARCH.md) 已整理官網 19 篇回應、7 項延伸議題與本人貼文候選。實作已完成，正式網址與驗證見 [交付紀錄](docs/DELIVERY.md)。

這是 DevDay Exchange Community Hack Day: Taipei 的作品。**已公開上線：[該怎麼攻擊 Puma？](https://askpuma--askpuma-prod.asia-east1.hosted.app)**。賽前規劃／雲端環境與活動中程式提交保留真實時間；目前完成狀態以 [交付紀錄](docs/DELIVERY.md) 為準。

- 規劃日期：2026-10-03，Asia/Taipei。
- 預定實作開始：**2026-10-04 13:00，Asia/Taipei**。
- 作品提交：14:30；一分鐘 YouTube 影片提交截止：15:00。
- 使用者已指定：**Firebase App Hosting**；首日 **OpenAI API US$50** 預算。
- 開發方式：一個整合 session，加前端、後端、資料三個平行 sessions。
- 真人隊伍：Vincent＋兩位新夥伴；建議分工見 START_HERE.md，A／B／C／D 是技術角色。
- 立場：民間支持 Puma 的詼諧政治網站；證據決定每個結論。

**最新工程方案已完成：** [完整實作方案](docs/IMPLEMENTATION_PLAN.md)、[三題 Demo／題卡／58 秒腳本](docs/DEMO_CASES.md)、[契約 v2](docs/CONTRACTS.md)。OpenAI Secret 與正式 runtime 已接通，貼文資料已匯入；三題 Demo 和自由輸入均可使用。

## 新 session 的最短接手路徑

1. 讀根目錄 [AGENTS.md](AGENTS.md)，確認時間與角色限制；A／C 同時讀 [已建立環境](docs/ENVIRONMENT.md)，不要重建專案。
2. 先讀 [最新工程方案](docs/IMPLEMENTATION_PLAN.md) 與 [三題 Demo](docs/DEMO_CASES.md)，掌握目前目標、壓縮時程與刪減順序；PLAN 保留早期完整企劃。
3. 讀 [共用契約](docs/CONTRACTS.md)，前後端及資料都以這份為準。
4. 依 [session 任務書](docs/SESSIONS.md) 選定 A／B／C／D；沒有分配角色就先向主 session 確認，避免重複實作。
5. A／C 加讀 [服務架構](docs/ARCHITECTURE.md)；C／D 加讀 [資料取得方案](docs/DATA_ACQUISITION.md)，D 同時讀 [研究來源](docs/SOURCES.md)。
6. 錄影者先讀 [一分鐘影片準備](docs/RECORDING.md)，正式錄影前用普通網頁測試錄影與匯出。
7. 提交前照 [驗收與 Demo](docs/ACCEPTANCE.md) 檢查。

## 今天交付的網站

公開、免登入、手機可用。使用者輸入質疑 → 拆解主張 → 顯示相關原話與證據 → 給有來源的解釋和一句吐槽。

- 已有資料的議題：比對經核對的來源，走快速路徑。
- 新議題：限次搜尋公開資料；證據不足時明說不足。
- 議題布局保持通用；Demo 固定針具 → 爆炸頭 → 營養午餐，三題按證據限定結論，其他輸入走檢索／生成。
- 輕鬆題：醒目標示玩梗模式，以動漫原創旁白回答；不把笑點當成本人動機或事實證據。
- 必須包含：真實 OpenAI API、可核對的來源、共享快取、限流、用量控制、公開網址。
- 分享先做「複製結果＋來源」；分享頁是有餘裕才做的功能。

**自由輸入不等於保證所有議題都有答案，也不等於已收錄兩人全部 Facebook 發文。**

## 文件責任

| 文件 | 用途 | 開始實作後的主要維護者 |
|---|---|---|
| [AGENTS.md](AGENTS.md) | 所有代理必讀的工作規則 | A |
| [START_HERE.md](START_HERE.md) | 新真人隊友兩分鐘導讀、三人建議分工 | Vincent |
| [IMPLEMENTATION_PLAN.md](docs/IMPLEMENTATION_PLAN.md) | 最新工程施工、元件、資料／AI／控制、壓縮排程 | A、B、C、D |
| [DEMO_CASES.md](docs/DEMO_CASES.md) | 使用者指定三題、內容範圍、來源核對、夥伴題卡、58秒腳本 | D、Vincent |
| [PLAN.md](docs/PLAN.md) | 範圍、時程、決策、退路、準備事項 | A |
| [ARCHITECTURE.md](docs/ARCHITECTURE.md) | 服務流程、Firebase、用量與部署 | A、C |
| [ENVIRONMENT.md](docs/ENVIRONMENT.md) | 已建立的 project／backend／IAM／Firestore 與部署交接 | A |
| [CONTRACTS.md](docs/CONTRACTS.md) | API、來源與結果資料格式 | A；其他角色提出修改 |
| [SESSIONS.md](docs/SESSIONS.md) | 可直接使用的分工與任務提示 | A |
| [SOURCES.md](docs/SOURCES.md) | 原始來源與已知／未確認事項 | D |
| [ATTACK_RESEARCH.md](docs/ATTACK_RESEARCH.md) | 多議題攻防入口、外部紀錄、PO 文候選與查核缺口 | D |
| [RESULT_DESIGN.md](docs/RESULT_DESIGN.md) | 大字簡潔回答、補充展開與原貼文卡規格 | A、B、C |
| [HUMOR_MODE.md](docs/HUMOR_MODE.md) | 動漫搞笑題、原創文案與事實／玩梗分流 | A、B、C、D |
| [DATA_ACQUISITION.md](docs/DATA_ACQUISITION.md) | 現成候選人資料庫、匯入、檢索、爬蟲退路 | D、C |
| [RECORDING.md](docs/RECORDING.md) | 鏡頭＋操作錄影工具、放大、腳本與交片流程 | 使用者、D |
| [ACCEPTANCE.md](docs/ACCEPTANCE.md) | 驗收案例、影片與提交證明 | D、A |

## 主 session 啟動指令

以下指令**在活動實作開始後**使用：

> 現在已經 2026-10-04 13:00（Asia/Taipei），開始依 askPuma 文件實作。先讀 AGENTS.md、docs/IMPLEMENTATION_PLAN.md、docs/DEMO_CASES.md、docs/CONTRACTS.md、docs/ENVIRONMENT.md 和 docs/SESSIONS.md。你是 A：整合與部署。建立新的 Git 專案與共同骨架，啟動前端 B、後端 C、資料 D 三個平行工作。沿用已建立的 Firebase 專案 askpuma-prod／App Hosting backend askpuma，使用 Firestore、OpenAI API，首日 API 預算 US$50。以 docs/IMPLEMENTATION_PLAN.md 的當下壓縮排程立即交第一批，14:10 產生最終部署候選，14:30 提交。賽前已準備規劃文件與雲端環境，請如實保留實作紀錄。

若是人工開多個 Codex sessions，先由 A 建好共用骨架並提交，再讓其餘 sessions 從同一個 commit 的獨立 worktree 開始。以上為開工時使用的歷史指令；網站目前已完成實作。

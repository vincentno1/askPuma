# 工程 session 任務書 v2

2026-10-04 最新。開工仍依 AGENTS 的使用者啟動指令；本輪只寫規劃，沒有啟動任何實作 session。先讀 IMPLEMENTATION_PLAN、DEMO_CASES、CONTRACTS v2；舊 13:00 排程與午餐／交通／交流優先順序已取代。

## 分工與基準

使用者指定：我們／Codex 實作網站，真人夥伴補有趣題目、來源與 QA。A／B／C／D 是技術角色，分工不代表已存在的 thread。使用者明確啟動平行工作後才分派代理；人工多 sessions 同樣先建基準再分 worktree。

A 沿用 askpuma-prod／askpuma／asia-east1，讀 ENVIRONMENT，不重建。A 建 Git，誠實記錄賽前文件，選已修補支持版本、lockfile、共同型別與只供開發的 fixtures；第一批基準 commit 5 分鐘內交，其他角色從同一基準獨立 worktree。

| 角色 | 可改範圍 | 優先交付 |
|---|---|---|
| A | package／lockfile、框架／部署、src/contracts、layout、整合文件 | 骨架、共同格式、早部署、密鑰權限、整合与正式URL |
| B | page、globals.css、components、public/illustrations | 01首頁＋02／03-v2結果，一套真DOM三题，手機版 |
| C | app/api、server | 真API、檢索、case matching、共享控制、快取、失敗處理 |
| D | scripts/import-posts.ts、data、來源／驗收文件 | JSON匯入、三題逐筆來源／案例核對，之後QA |

A 統一依賴、共同格式與部署；每個檔案只有一個擁有者，按小批 commit 整合，不等待全部完。角色在自己責任範圍做必要檢查，A 跑整合 build。

## 可貼給 A 的任務

> 你是 askPuma 的整合／部署 A。先讀 AGENTS、IMPLEMENTATION_PLAN、DEMO_CASES、CONTRACTS v2、ENVIRONMENT、本文件。沿用已有 Firebase，不重建。收到實作啟動後建立 Git 和 Next.js／TypeScript 共同骨架、Zod／TS 契約與開發 fixtures、支持且已修補的版本與 lockfile；交共同 commit 后协调獨立 worktree。只你改依賴、型別与正式部署。確認使用者準備的 key 已安全放 Secret Manager runtime，不要求貼值；確認 Node ADC／Firestore IAM／實際模型存取。早做本地來源 App Hosting 部署，不等 UI 全完。14:00 凍結大功能、14:10 最後候選、14:25 開始提交、14:30 截止。整合 build、三题來源与手機UI、至少一题自由真API、限流／預算／失敗／無痕站点必須核對；不發布 fake fixture。成本上限按已驗證配置記錄，不宣稱未設或绝對零超額。

## 可貼給 B 的任務

> 你是 askPuma 的 UI B。先讀 AGENTS、IMPLEMENTATION_PLAN 的視覺章、CONTRACTS v2、DEMO_CASES、design/proposals/README-v2；使用 A 給的基準 worktree。忠於 01首頁、02原貼文-v2、03動漫-v2：暖白橘藍、巨大粗中文字、黑框偏移影、原創偵探／爆炸頭貓、台北市景。正文和按鈕必須真DOM，不能整張PNG當操作介面。首頁三個範例依針具→爆炸頭→午餐送 canonicalQuery；同一API供自由輸入。先交完整靜態UI，含事實／玩梗／混合／不足／錯誤。heroCitation 直接取來源 excerpt，標平台、日期、狀態，headline引用可點；criticalLimitations不藏，其他分析折疊。已整理／已儲存標示真實，玩梗非本人說法可見，認真答案按鈕送不同事實問題。插畫生成／改圖用 imagegen，兩種独立透明資產足夠，禁止Python改圖。手機390px不溢出、來源可按、鍵盤可用；P0交完才補CSS短动效与reduced-motion。別改契約、API、依賴或部署。

## 可貼給 C 的任務

> 你是 askPuma 的後端 C。先讀 AGENTS、IMPLEMENTATION_PLAN、CONTRACTS v2、ARCHITECTURE、DEMO_CASES。使用 A 的基準與runtime。完成 Node POST /api/audit／health。先精確匹配 ready 案例與完整別名，按契約標curated；無命中才查版本快取／取得Firestore共享锁与成本預留／檢索少量原段落／實際OpenAI。正常本地一次Responses structured output；外部不足且搜尋已驗收可一轮搜尋＋一次整理，最多兩次請求，不另加分類潤稿迴圈。官方SDK參數與模型權限必須核對，處理incomplete／refusal／provider／timeout。模型只能選來源與excerpt IDs、產短結論／旁白／分析，原話与URLs由server補；驗證引用與模式，純playful不得冒充事實判定。完整問題cache不抹否定／年份，不按午餐關鍵字硬套案例。共享session／IP／全站限流、並發、lease、快取、預算與開關必做；外部API不能在transaction內。失敗計費不明不要直接退款預留。控制失效停新分析。14:00搜尋未驗收就關閉，新題保留檢索＋真生成或資料不足；不得假來源。只改自己的api／server檔案。

## 可貼給 D 的任務

> 你是 askPuma 的資料／QA D。先讀 AGENTS、IMPLEMENTATION_PLAN資料章、CONTRACTS v2、DEMO_CASES、DATA_ACQUISITION、SOURCES。取得 mayor2026 的 shen-poyang 全量JSON，按posts欄位驗證、去重、保留version／日期與原URL；匯入預設 imported_unchecked，不把AI分類當查核。小量原段落供C檢索，不建向量庫／全歷史爬蟲／全蔣萬安資料。優先交針具、爆炸頭、午餐三題sourceRefs／excerpt IDs／限定結論。針具最新Threads原頁如無法讀就保留保存版標籤，用政府／WHO支持限定政策；供毒另判。午餐目前free baseline＋paid add-on與歷史一致性分開；缺早期完整話不能宣布從未髮夾彎。動漫是原創旁白非動機。和真人夥伴用DEMO_CASES文字題卡收新題，经核對後才ready。先交可用核心小批commit，後轉QA：核對原句日期、有效質疑、未知題、模式誤判、390px、熱點正式站、實際答案與来源是否支持。正式影片用DEMO_CASES58秒順序，保留已整理標示與限定条件，協助14:30／15:00提交。

## 回報与整合

每批交：角色、commit SHA、變更檔案、具體完成行為、已跑驗證、未完成／限制、整合需求（只有環境變數名，不含值）。阻塞 >5 分鐘報最小替代方案並继续獨立工作。B／C／D 不推正式部署；A 合併后核對，14:00後只修阻塞与必要視覺／引文。

第一次讀只需这些文件，不因大量舊研究延誤共同骨架；詳細來源疑問再開 ATTACK_RESEARCH。實際开始晚于13:41就縮減加分項，不能把已過的13:25第一部署節點當未来安排。

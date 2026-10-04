# Puma 攻防議題研究與原貼文候選

研究日期：2026-10-04，Asia/Taipei。用途是擴充議題與決定回答頁資訊層級；本輪沒有建立應用資料 JSON、網站程式或呼叫付費 API。

## 最新產品決策

使用者認可 01 首頁。02／03 舊提案過度圍繞針具案例，保留作歷史探索，**不照那個案例的三欄來源分類實作**。回答頁要支援各種議題：簡潔、大字、Puma 本人原貼文為主，細節按開才看。新的回答頁規格見 [RESULT_DESIGN.md](RESULT_DESIGN.md)。研究完成後，已依使用者要求另生成 [v2 原貼文與玩梗提案](../design/proposals/README-v2.md)。

## 這輪找到什麼，還沒證明什麼

- [Puma 官網闢謠專區](https://puma.taipei/fact-checks) 目前有 NO.01–19，共 **19 篇回應條目**。其中有重複議題、假冒詐騙與網站開發者澄清，不能稱為 19 個獨立謠言，更不能當成流行度排名。
- 已補搜尋 2024–2026 的報導、政府原始新聞稿與大學紀錄；下表收的是能找到公開來源的攻防線索，並非所有網路留言的普查。
- 官網是當事方的第一手回應：可以證明「競辦如何回應」，**不能單獨證明回應的全部內容屬實**。表中的攻擊問法是研究者概括，除標明原句外，不當作某人逐字引言。
- 有些 Facebook／Instagram 原頁受登入、擷取限制；本輪沒有繞過限制。保存文字、新聞轉述與可讀原頁必須分開標示。找到原始網址不等於逐筆查核完成。

## 官網 19 篇回應：完整入口表

以下日期是回應頁「發布日期」，不是攻擊首次出現日期；各頁可能後續更新。P0 表示優先補齊資料，仍需查核才能公開展示強結論。

| 編號／發布日 | 攻擊或質疑的概括 | 當事方回應與原始入口 | 尚缺的關鍵材料／優先度 |
|---|---|---|---|
| 19／10-02 | 午餐先說自費、又說免費，立場反覆？ | [回應](https://puma.taipei/fact-checks/fact-check-19)：免費基礎與選擇性自費加價可並存；分別解釋 9/17、10/2 說法 | 9/17 完整影音、10/2 原貼文；費用與公平問題仍可討論。P0 |
| 18／09-01 | APEC 赴中是不是打臉「所有交流都是統戰」？ | [回應](https://puma.taipei/fact-checks/fact-check-18)：引用包含「對中國來說」的完整主詞 | 原始受訪片段與批評片段；不能直接改寫成他沒談交流風險。P0 |
| 17 | 發文稱讚 Puma 可以領錢？ | [回應](https://puma.taipei/fact-checks/fact-check-17)：針對冒名給付訊息澄清 | 核對原訊息、官方公告日期；屬假冒／詐騙線索，非核心政策攻防。P2 |
| 16／07-11 | 法院認證個人帳戶有 4,800 萬？ | [回應](https://puma.taipei/fact-checks/fact-check-16)：競辦說判決談的是公眾人物可受評論，並表示上訴 | 判決案號、全文、後續裁判狀態；目前不能做法院結論。P2 |
| 15／07-04 | 配合媒體散播黃國昌相關假消息？ | [回應](https://puma.taipei/fact-checks/fact-check-15)：針對《鏡報》香港行程／金流報導爭議，說受訪時要求查證 | 原受訪、報導、判決及黃國昌原貼文。**這篇不是 2024 中國電視台駐台導播事件**。P2 |
| 14／07-01 | 連萬芳已是醫學中心都不知道？ | [回應](https://puma.taipei/fact-checks/fact-check-14)：主張改善資源落差 | 原受訪完整句；醫院既有身分有外部資料，但不能反推他当時知道什麼。P1 |
| 13 | 網站由某工程師製作，暗示有關聯？ | [回應](https://puma.taipei/fact-checks/fact-check-13)：澄清製作關係 | 原指控與開發團隊公開說明；避免不必要轉載私人身分。P2 |
| 12／06-16 | 內湖交通只有住工合一一招，人口要變 500 萬？ | [回應](https://puma.taipei/fact-checks/fact-check-12)：短中長期多項解法；[原訪談入口](https://www.youtube.com/watch?v=7oUt-kVMj0c) | 核對完整影音時間碼；住房減通勤確實是方案之一，不能因用詞爭議把方案刪掉。P0 |
| 11／06-16 | 兩岸交流一律統戰，拒絕正常交流？ | [回應](https://puma.taipei/fact-checks/fact-check-11)：解釋中國方的策略與交流風險 | 原始主詞、條件、問題；與 06／18 同題不同時間保留分開。P1 |
| 10／06-12 | 反對交流卻最想去北京，是雙標？ | [回應](https://puma.taipei/fact-checks/fact-check-10)：對等城市層級與無限城論壇；[6/6 訪問入口](https://www.facebook.com/watch/?v=1420219310165441) | 原問答：主動願望或回答「中國哪個城市」差別很大。P1 |
| 09／06-25 | 天際線計畫會開新步道、破壞山林？ | [回應](https://puma.taipei/fact-checks/fact-check-9)：說提議整合路線、指引與交通 | 已找到市府原稿，仍缺最初原發言／路線方案，兩方說法要並列。P1 |
| 08／08-15 | 說小貓熊是統戰、裝監控設備？ | [回應](https://puma.taipei/fact-checks/fact-check-8)：競辦否認，支持無政治前提的保育合作；指向 6/7 中天節目 | 須看完整節目辨別批評、戲謔與字面指控，不能把諷刺自行升格為事實指控。P2 |
| 07／08-15 | 全盤否定大縱走、說公務員三年沒做事？ | [回應](https://puma.taipei/fact-checks/fact-check-7)：區分交通網建議與否定基層工作 | 最初發言、節目全文；市府原稿有不同解讀，不能只引用一方。P1 |
| 06／06-03 | 說過所有交流都是統戰？ | [回應](https://puma.taipei/fact-checks/fact-check-6)：競辦否認無條件的概括 | 與 11／18 同題，要以各事件原話／日期核對，不憑標題斷言從未說過。P1 |
| 05／06-02 | 家族在中國賺大錢、豪宅豪車，反中雙標？ | [回應](https://puma.taipei/fact-checks/fact-check-5)：說公司設厄瓜多、跨國貿易，否認豪宅等指控 | 公司與財產公開紀錄；不查家人住址。貿易有中國商品與在中國經營是不同主張。P2 |
| 04／06-02 | 美國豪宅、遊戲課金，財務說法不實？ | [回應](https://puma.taipei/fact-checks/fact-check-4)：否認目前美國房產，解釋休閒支出 | 原直播與同時期財產申報；不可由否認現持有推成「從未買過」。P2 |
| 03／06-02 | 存款 18 萬卻為選舉貸款，是裝窮？ | [回應](https://puma.taipei/fact-checks/18)：現金餘額與股票資產、選舉周轉分開 | 原發言、申報／公開財務資料；個別餘額不能代表總資產。URL 不是 fact-check-3。P2 |
| 02／05-20 | 收 USAID 等美國資金，干預政治？ | [回應](https://puma.taipei/fact-checks/fact-check-2)：民主實驗室否認 USAID 補助、理事長不支薪，承認其他基金會研究補助 | 各法人年報與補助紀錄；不能說「從沒收任何外國補助」，也不能把法人款項等同個人所得。P2 |
| 01／05-20 | 現在還有美國房產，隱匿申報？ | [回應](https://puma.taipei/fact-checks/fact-check-1)：承認留學買房、稱 2017 已出售，其他地址不是持有 | 交易與申報日期，居住地址不是所有權證據。未核對交易前只能呈現他的回應。P2 |

## 外部交叉資料與延伸 7 題

### X01：乾淨針具與提供毒品

既有研究保留，來源與限制見 [SOURCES.md](SOURCES.md)。[2014 想想文章](https://www.thinkingtaiwan.net/content/3055) 是本人文章，非 Facebook；[10/3 中央社報導](https://www.cna.com.tw/news/aloc/202610030078.aspx) 提供本次攻防背景。[北市清潔針具資料](https://data.taipei/dataset/detail?id=5e53353a-4799-4b02-8922-cf81bb6fbf95) 可佐證既有服務，不能替「供毒」等其他論點全部背書。P1：材料比較齊，但一分鐘解釋需要拆概念。

### X02：學歷造假／不是賓州大學

[2025/3/2 中央社](https://www.cna.com.tw/news/aipl/202503020117.aspx) 記錄學校名稱與 LinkedIn 的爭議。找到更強的外部材料：

- [UC Irvine 官方校友頁](https://grads.soceco.uci.edu/alumni/shen-pao-yang)：姓名、2017、犯罪學／法律與社會博士。
- [加州大學 eScholarship 的 2017 博士論文 PDF](https://escholarship.org/content/qt6x04x0x7/qt6x04x0x7.pdf)：PDF 第 12 頁（正文 xi）作者履歷列 2006–2007 University of Pennsylvania 法學碩士。這是學校典藏的作者履歷，**不是賓州大學直接開出的學位驗證**。
- [北大歷任所長頁](https://crm.ntpu.edu.tw/index.php?id=8238&lang=cht&option=module&task=pageinfo) 實際「學歷」欄填的是任期，不能拿這頁當碩博士學歷證明。

P1：適合展示外部紀錄查核；要先找到 Puma 本人的舊貼文。沒有貼文就標「學校紀錄」，不能假造一張 Facebook 卡。

### X03：用成人片偏好推測政治立場

[2024/6/30 中央社](https://www.cna.com.tw/news/aipl/202406300072.aspx) 記錄他的研究說明與回應。要拆開「他是否談過偏好與政治立場的关联」、「是否主張政府監控」、「引用研究是否成立」。他確實談過該關聯，不能寫成從未說過；解釋資料濫用風險，也不自動證明研究方法有效。P2：補完整影片、原始研究後才做強結論。

### X04：第五縱隊／把中國配偶都當敵人

[2024/8/12 中央社](https://www.cna.com.tw/news/aipl/202408120239.aspx) 記錄他區分統戰名單與第五縱隊，並非把被接觸者都判定有罪。仍需原貼文和最初批評。P1：適合補上下文，但對外不按婚姻／族群分類訪客或定向說服。

### X05：立委赴中管制侵犯遷徙自由

[2024/4/23 中央社對法案的報導](https://www.cna.com.tw/news/aipl/202404230264.aspx) 與[國民黨團批評](https://www.cna.com.tw/news/aipl/202404230343.aspx) 顯示是真實法案與制度爭論。需立法院議案原文、適用對象與版本。P1 作為「這題可以質疑」測試；不同意政策不是假訊息，網站也不預判憲法結論。

### X06：跌倒後安排 MRI，是否濫用醫療

[2024/5/18 中央社](https://www.cna.com.tw/news/ahel/202405180127.aspx) 有醫師說明嚴重神經症狀下使用 MRI 的情況。一般醫療說明不能代替這個人的診斷或證明全部就醫流程正當；不蒐集私人病歷。P2，不列一分鐘主案例。

### X07：淹水批評失實、是否懂市政

[2026/6/27 中央社](https://www.cna.com.tw/news/aloc/202606270092.aspx) 記錄兩方攻防。需要逐條核對降雨、淹水區、排水工程與權責；下方 7/9 貼文是後續治理想法，不可充當 6/27 當時的全部證明。P1，補政府開放資料後再上。

### 已找到的關鍵交叉來源

| 議題 | 外部／對方原始材料 | 現階段能支持什麼 |
|---|---|---|
| 午餐 | [10/2 中央社](https://www.cna.com.tw/news/aloc/202610020077.aspx)、[9/20 中央社](https://www.cna.com.tw/news/aloc/202609200089.aspx) | 有免費基礎與自費彈性的論述；蔣提出家長負擔、公平考量，不能把這些考量直接寫成造謠 |
| 交通 | [6/17 中央社](https://www.cna.com.tw/news/aloc/202606170086.aspx)、[完整訪談入口](https://www.youtube.com/watch?v=7oUt-kVMj0c) | 可以進一步核對是否只一招；競辦否認與新聞標題不代替觀看整段影片 |
| 天際線／公務員 | [大地處 6/7 原始新聞稿](https://www.geo.gov.taipei/News_Content.aspx?n=23285747C0511EC4&s=29500AE6149E55D3&sms=72544237BBE4C5F6)、[公視報導](https://news.pts.org.tw/article/811873) | 市府確實公開批評方案、提出既有成果；Puma 有不同回應，屬待比對語境，不能只顯示單方否認 |
| 萬芳 | [北醫官方機構簡介](https://hub.tmu.edu.tw/zh/organisations/taipei-municipal-wanfang-hospital-2/) | 醫院已有醫學中心身分；不能由此證明 Puma 當時的原句或認知 |
| 舊房產等指控 | [2025/3/10 中央社](https://www.cna.com.tw/news/aipl/202503100097.aspx)、[民視追述原貼文](https://www.ftvnews.com.tw/news/detail/2025310W0098) | 可追到 3/9 本人臉書澄清入口；本輪沒核對不動產交易、綠卡或財產申報 |

## 真正的 PO 文：第一批候選，交給 D 查核

唯讀重新取得[觀測站 Puma 索引](https://mayor2026.observe.tw/api/posts/shen-poyang.json)：732 筆，schema version 1；Facebook 223、Instagram 136、Threads 187、YouTube 123、Website 62、X 1。這是 10/4 本輪快照，取代「目前仍是 731」的說法；10/3 的 731 筆歷史統計仍保留。

下面索引貼文的時間轉成 Asia/Taipei。**保存內容已讀，社群原頁尚未逐筆核對，預設 imported_unchecked**。本輪没有下載資料到專案。不要讓相同關鍵詞的無關貼文成為「打臉」證據。

| 候選 | 日期／平台 | 原始網址 | 為什麼有用／限制 |
|---|---|---|---|
| P01 教育政策／午餐 | 2026-10-02 11:43，Instagram | [原貼文](https://www.instagram.com/p/Dd-i8hVEjO_/) | 保存文字包含自費加菜彈性；適合午餐案。原頁本輪擷取失敗，先由 D 對照本人頁面。不能單靠這段證明 9/17 前後一致 |
| P02 無限城論壇／國際交流 | 2026-08-31 22:49，Facebook | [原貼文](https://www.facebook.com/puma.taipei/posts/pfbid0LMdoGjFUEN2M3pfd9UZk6EHPEoiuks6prhmJneXkkrNgzYigzKKCEeK6duin2drul) | 支持跨城市交流主張；不是 6 月「所有交流」原發言，不能代替那段語境 |
| P03 HEART 市政政策 | 2026-08-11 11:16，Facebook | [原貼文](https://www.facebook.com/puma.taipei/posts/pfbid0LAhjgM9PZrdNoZLCDFgQKK85XDGVDEXHikYVQhETyzXYSCKTZokj12CuHnRiaci1l) | 可用於問「有沒有政策」並檢索住房、交通、防災；有政策不等於證明能執行。文中自述數字仍須外部核對 |
| P04 運動驛站 | 2026-08-15 00:13，Facebook 個人帳號 | [原貼文](https://www.facebook.com/pumashen/posts/pfbid038GvzgnzvUeWnUbmdZe4vNjeD8P54zoTx9QX8ryRwc1tVWEKXvGNpgqkUfhvst9JBl) | 可回答政策目的與使用場景；數字出處待查。未在本輪找到明確原始攻擊，先作政策問答候選 |
| P05 防災與排水 | 2026-07-09 21:33，Facebook | [原貼文](https://www.facebook.com/puma.taipei/posts/pfbid021a1q72aogruMPJpNZLF71QmRkwBAEZwh91qdrm5KmvuC2sMGfZzgCG6M4pk4h8NCl) | 談風險圖滾動更新、排水瓶頸；不是自動證明全部水利指控正確 |
| P06 舊指控綜合澄清 | 報導指向 2025-03-09；發文時間待核對，Facebook 個人帳號 | [原貼文](https://www.facebook.com/pumashen/posts/10171196828115654) | 從民視原文的 Facebook 嵌入連結追出；本輪原頁讀取受限，新聞轉述不能冒充已核對貼文。可能補房產、學歷等舊題 |

選原文的次序：直接回應該主張的本人貼文 → 爭議之前的相關本人貼文 → 本人原受訪影片 → 競辦回應 → 外部資料。這是尋找入口的次序；證據強弱仍看資料本身，學校官方紀錄可比當事人否認更有力。

以「事件前後」而不是「舊貼文一定更真」判斷。只有確認發文早於攻擊事件，才使用「他早就說過」；事後回應顯示「他後來這樣回應」。平台文案不等於影片逐字稿。

## 開工後 D 的最短交付

1. 匯入公開索引、保留作者／原 URL／原 timestamp；批次一律未核對。先補 P01、P02，再追交通原訪談／本人回應。不可爬全歷史阻塞整合。
2. 製作 **午餐、交通、交流** 三種不同論證形式的資料包，至少有一段可核對本人原文、上下文、事件日期、批評來源、結論可支持範圍。哪題五分鐘補不齊就降級為資料不足或改案例。
3. 學歷題作外部文件型備案；針具案例仍保留，但不再決定所有結果頁布局。第一個正式 live 案例由 A 按哪題材料先通過查核選擇。
4. 不把前述 19 篇回應當成已驗收的 19 題。真正上線支援範圍以逐題交付清單為準。

這份文件是研究與設計依據，尚不是可直接發布的「每題已證偽」資料庫。

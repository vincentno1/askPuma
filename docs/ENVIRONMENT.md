# Firebase／App Hosting 已建立環境

2026-10-04（Asia/Taipei），依使用者「先建立 Firebase 環境，帳單掛 BotsUP 共用」的明確授權執行。**這是活動開始前完成的環境準備，應如實保留紀錄；不是網站已實作或部署成功。** 網站程式、資料匯入、Git 與 OpenAI 呼叫仍等待使用者開工指令。

## 固定識別：直接使用，不另建專案

| 項目 | 已確認的值 |
|---|---|
| GCP／Firebase project ID | `askpuma-prod` |
| Project number | `639898024447` |
| Display name | `askPuma` |
| 所屬組織 | BotsUP `botsup.cc`，`651285749203` |
| 建立／管理帳號 | `vincent@botsup.cc` |
| 帳單名稱 | `BostUP共用帳戶`（Google 系統裡的實際拼法） |
| Billing account | `015457-BEE04A-F86688` |
| Billing 狀態 | `billingEnabled=true`，已綁定共用帳單 |
| App Hosting backend ID | `askpuma` |
| App Hosting region | `asia-east1`（台灣） |
| Backend resource | `projects/askpuma-prod/locations/asia-east1/backends/askpuma` |
| Firebase web app ID | `1:639898024447:web:4635f32e5c0296fd030fca` |
| Backend runtime service account | `firebase-app-hosting-compute@askpuma-prod.iam.gserviceaccount.com` |
| Firestore | `(default)`、Standard edition、Firestore Native、`asia-east1` |
| Secret Manager | `OPENAI_API_KEY` 已建立；**尚無任何版本／金鑰值** |

[Firebase Console](https://console.firebase.google.com/project/askpuma-prod/overview)／[App Hosting](https://console.firebase.google.com/project/askpuma-prod/apphosting)／[Firestore](https://console.firebase.google.com/project/askpuma-prod/firestore)／[Secret Manager](https://console.cloud.google.com/security/secret-manager?project=askpuma-prod)。

backend 已分配 `https://askpuma--askpuma-prod.asia-east1.hosted.app`，**尚未建立應用 build 或 rollout，不能把這個網址當成已可用作品**。網站完成並 rollout 成功後再確認公開可用。

## 已完成與驗證

- 建立新的 GCP 專案，掛 BotsUP 共用帳單，並加入 Firebase。
- 啟用 App Hosting、Cloud Build、Artifact Registry、Cloud Run、Secret Manager、IAM、Firestore、Firebase Rules、Developer Connect、Storage 所需 API。
- 用 `firebase init apphosting` 建立 backend 和 Firebase web app，採本機原始碼部署方式；尚未連 GitHub repo，不需要先做 GitHub 授權才能開始部署。
- backend GET／LIST 已確認 `reconciling=false`、地區及 service account 正確。
- Firestore 於 **12:46:43** 建立，backend 於 **12:47:34** 建立，時間來自雲端 UTC 紀錄轉為 Asia/Taipei。
- 部署 `firestore.rules` 成功：瀏覽器端 read/write 全部拒絕；後端 Admin SDK 使用 IAM，不靠公開規則寫入。
- App Hosting 的預設服務帳號已有 `roles/firebaseapphosting.computeRunner` 與 `roles/firebase.sdkAdminServiceAgent` 等 Firebase 初始化角色；已核對 SDK Admin 角色包含 Firestore entity 操作權限。
- `OPENAI_API_KEY` 採 automatic replication；只有本 backend service account 被明確授予該 secret 的 `roles/secretmanager.secretAccessor`。版本列表為空，沒有讀取／寫入任何實際 OpenAI 金鑰。
- 未切換全機 gcloud 的 default project；本次所有雲端操作都明確指定新 project。

## 本地設定已建立

| 檔案 | 用途／狀態 |
|---|---|
| `.firebaserc` | default project 指向 `askpuma-prod` |
| `firebase.json` | 本機 App Hosting backend=`askpuma`、rootDir=`.`；指定 Firestore 規則 |
| `apphosting.yaml` | minInstances=0、maxInstances=2、concurrency=8、cpu=1、memoryMiB=1024；**首次應用 build／rollout 才會生效** |
| `firestore.rules` | deny all client reads/writes；已部署 |
| `.gitignore` | Firebase logs/cache、依賴、`.env*`、`.next` 等不納入 Git |

原始碼部署忽略規則也排除 `.env`、`.env.*` 和 `.next`，避免把本機金鑰或舊 build 打包。沒有建立服務帳號 JSON key，也沒有建立 Next.js 程式或 Git repository。

## A 的下一步

1. 收到開工指令後，沿用此 project、backend、Firestore、web app 和 service account，不重跑 create、不另建同名 Firebase 專案。
2. 建立 Next.js 骨架與 Git，第一筆紀錄誠實記載規劃文件和活動前的環境準備；再分派其他 sessions。
3. 在依賴與 build 相容性確認後，由 A 選 Node runtime／package engines；目前 CLI 為 14.11.1，正式部署前核對所需版本／選項。首次本機來源部署還可能需要初始化上傳 bucket 與相關權限，A 是本專案 owner，可由部署流程完成。
4. 沒有 API key 時，首頁與未啟用分析狀態仍應可部署；不要提前加無版本的 secret 引用讓第一個 build 卡住。
5. 使用者透過 Secret Manager 或受控本機檔案提供真正的 OpenAI key 後，建立 secret version；不要把值貼進聊天、Git、命令列參數或日誌。
6. 金鑰版本可用後，在 `apphosting.yaml` 增加 `OPENAI_API_KEY` 的 secret 引用並限定 `RUNTIME`。尚未呼叫 OpenAI，也尚未驗證模型存取或 US$50 provider 預算設定。
7. C 再建立共享限流／用量／快取等控制資料。Firestore 目前沒有預填應用資料或控制文件；不能把環境完成當成費用控制已完成。
8. A 執行 build／rollout，確認正式 URL、真實 API、Firestore 與來源，再依驗收文件提交。

## 常用命令（由 A 在合適階段執行）

以下均於 askPuma 根目錄執行，部署只交由 A。不要省略 project 或在 botsup-v0 執行。

```sh
firebase apphosting:backends:get askpuma --project=askpuma-prod --account=vincent@botsup.cc
gcloud billing projects describe askpuma-prod --account=vincent@botsup.cc
gcloud firestore databases describe --database='(default)' --project=askpuma-prod --account=vincent@botsup.cc
firebase deploy --only apphosting:askpuma --project=askpuma-prod --account=vincent@botsup.cc
firebase deploy --only firestore:rules --project=askpuma-prod --account=vincent@botsup.cc
```

有真實金鑰版本後，待加入的 YAML 形狀：

```yaml
env:
  - variable: OPENAI_API_KEY
    secret: OPENAI_API_KEY
    availability:
      - RUNTIME
```

這段目前只有文件示例，尚未加入實際部署 YAML。Secret 的值只由 Secret Manager 提供，不是此文件的內容。

## 費用與尚未完成事項

Firebase／Cloud Run／Firestore／Secret Manager 費用掛上述 BotsUP 共用帳單。OpenAI 首日 US$50 是另外的 API 預算；Firebase billing 沒有因此獲得 US$50 硬上限。`maxInstances=2` 也是容量控制，不是所有雲端費用硬上限。

待完成：應用骨架、Git、OpenAI 金鑰版本、模型權限核對、provider／應用費用控制、Firestore 應用資料、本機開發憑證安排、應用 build／rollout、正式 URL 驗收、GitHub 連接（若選用）。不要把 gcloud CLI 已登入當作所有 Node SDK 已有本機 ADC；需要時另用受控 ADC 登入，無須產生服務帳號 key。

官方依據：[本機原始碼部署](https://firebase.google.com/docs/app-hosting/alt-deploy)、[地區與預設服務帳號](https://firebase.google.com/docs/app-hosting/about-app-hosting)、[App Hosting 設定](https://firebase.google.com/docs/app-hosting/configure)。

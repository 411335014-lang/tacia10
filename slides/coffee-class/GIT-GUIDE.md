# Git 使用說明

已在專案根目錄初始化 main 分支，沿用本機既有作者設定。沒有新增遠端或推送任何內容。

```powershell
git status
git log --oneline
# 修改 Wiki 或簡報後：
node scripts/build-slides.js
node scripts/check-slides.js
git add .
git commit -m "描述這次修改"
# 只讀比較：
git diff
git show HEAD
```

若終端找不到 git，可用本機已安裝路徑：

```powershell
& 'C:\Program Files\Git\cmd\git.exe' status
```

## 管理原則
- raw 原始稿保留，修改整合內容請編輯 wiki。
- 調整大綱須先確認，再改 slides/coffee-class/slides.js。
- HTML 為建置結果，Wiki、來源摘要與執行紀錄一同提交。
- .gitignore 排除壓縮交付檔、暫存及環境設定；.gitattributes 統一文字行尾。
- 本機 Git 提供版本歷史；尚未設定遠端，因此不等於異地備份。

## 此環境的交付方式
本專案 .git 在初始化後被環境設為唯讀，原位置只保留基準提交。本輪完整提交另以 coffee-project.bundle 交付；bundle 包含基準與改版兩次提交。
要在一般本機資料夾恢復標準 Git 專案：

```powershell
git clone coffee-project.bundle coffee-project
cd coffee-project
git log --oneline
```

clone 後會有正常的 .git，可使用上述一般 Git 指令。不要把交付 ZIP 當成版本歷史；ZIP 是成果，bundle 才包含提交。

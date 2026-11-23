# 公主的女僕咖啡教室

以 LLM Wiki 作為知識庫，為咖啡初學者與咖啡廳新人製作 18 頁教學 HTML 簡報。

- [開啟作業入口](slides/coffee-class/assignment.html)
- [開啟教學簡報](slides/coffee-class/index.html](https://411335014-lang.github.io/tacia10)](https://411335014-lang.github.io/tacia10/))
- [知識目錄](wiki/index.md)
- [需求摘要](requirements.md)
- [維護規則](AGENTS.md)
- [流程與紀錄](slides/coffee-class/workflow.md)
- [實際檢查](checks/graph-rerun-2026-11-23.md)
- [Git 使用說明](GIT-GUIDE.md)

## 建置與檢查
安裝 Node.js 後，不需安裝任何套件：

```powershell
node scripts/build-slides.js
node scripts/check-slides.js
```

簡報的 index.html 已內嵌樣式與程式，雙擊可離線播放；整個 slides/coffee-class/ 資料夾含 Wiki 與來源的 HTML 快照，可直接複製使用。Markdown 為維護來源，不直接編輯產出的 HTML 快照。
專案尚未設定遠端儲存庫，Git 版本只在本機；獨立 HTML 講義未製作。



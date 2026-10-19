# 本地 Tab 锚点与窄屏 sticky 规范（① + ④）

## 范围
- 本批只做：本地部署 Tab 档位/生图锚点 + 「本档首选」强化 + 窄屏 Tabs 横滑降占高
- 不做：list 旧档压短、日报目录、看点拆行、性价比/开放权重窄屏卡、筛选折叠、暗色、ECharts 懒加载

## ① 本地部署锚点（`#v-local`）

### TOC
- 容器：`.local-toc`（sticky，贴在 Tabs 下方）
- 分组：`本地 LLM` / `生图`
- LLM 芯片 → 各 `h3.sub`：`#local-llm-8gb` … `#local-llm-512gb`、`#local-llm-datacenter`
- 生图芯片 → `#local-img`（`h2.sec`）+ 各 `h3.sub2`：`#local-img-8gb` … `#local-img-48gb`、`#local-img-datacenter`
- 锚点滚动：`scroll-margin-top` + `html{scroll-padding-top}`；点击由脚本 `scrollIntoView`（尊重 margin）

### 本档首选（`tr.top`）
- 左侧橙条：`td:first-child { border-left: 3px solid var(--accent) }`（`--accent:#f59e0b`）
- 行底：浅橙底 `var(--accent-bg)`
- ① 格：保留蓝底 `.rk`；下方橙 pill「首选」（`td.rk::after`）
- 不改表格列结构

## ④ 窄屏 sticky / Tabs（`max-width:760px`）

- Tabs：`flex-wrap:nowrap; overflow-x:auto; -webkit-overflow-scrolling:touch`；轻藏滚动条
- 顶栏：`position:relative`（随页滚走）→ **只留 Tabs 单 sticky**（`top:0`），避免双 sticky 挡内容
- 降占高：顶栏 padding `8px`、Tabs padding `6px 12px`；副标题窄屏隐藏
- CSS 变量：`--tabs-top` / `--tabs-h`；脚本按 topbar/tabs 实测写入（窄屏 `--tabs-top=0`）
- **受保护**：所有 `:hover` 必须包在 `@media (hover:hover)` 内（iOS sticky hover，见 hub 内原注释）

## 验收
1. 桌面打开「本地部署」：TOC 可见；点 8GB/512GB/生图榜/生图8GB 能跳到对应标题且不被顶栏+Tabs 挡住
2. 各档 `tr.top`：左橙条 + 「首选」pill 一眼可辨，列宽不崩
3. 手机（≤760）：Tabs 单行横滑不换行；滚动后顶栏离开、仅 Tabs 吸顶；正文不被双 sticky 挡住
4. `hub.html` 与 `index.html` 保持同步（改 hub 后跑 `./scripts/sync-hub-index.sh`）

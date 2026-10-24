# 自动化执行记忆 — 每日 AI 前沿日报（9:30）

## 2026-10-21 11:26 执行（第 1 次记录）
- 产出：`AI日报-2026-10-21.html` + `digest-2026-10-21.json`（A 11 / B 6 / C 6 / D 6，highlights 3）。
- 主题：引擎与看门人（DeepInfer 开源 / TorchTPU+TorchNeuron / MemT-1.0 / 微软 Guardian Agents）。
- **并发踩坑（重要）**：当天 8:00 已有一次日报任务跑过并推送（commit `9f62852 日报更新 2026-10-21 早八`），本次 push 时 `pull --rebase` 出现
  AI日报/digest 的 add/add 冲突 + index/hub/list 的 UU 冲突。处理方式：`git checkout --theirs` 全取本地版 →
  `git add -A` → `git rebase --continue`，**必须带 `GIT_EDITOR=true`**（否则卡在 vim，命令会被后台化且不报错）。
  rebase 完成后 rows.json 已是远端 11:10 版本，**必须重跑 build_hub.py 再 amend 提交**，否则首页榜单与 rows.json 不同步。
- 经验：`git rebase --continue` 一律加 `GIT_EDITOR=true`；推送前先 `git fetch` 看 origin/main 是否已有当天同名日报，可提前判断要不要走"同日覆盖"路径。
- 验收：线上首页 200、含 2026-10-21 卡片；list.html 200 且新条目在顶；日报页 200；hover:hover=13；digest models 标签全部命中 model-aliases.json。

## 2026-10-22 10:2x 执行（第 2 次记录）
- 产出：`AI日报-2026-10-22.html` + `digest-2026-10-22.json`（合并后 A 14 / B 8 / C 6 / D 6，highlights 4），commit `04bd390`。
- 主题：常在线，可问责（Claude Duet／OpenAI 监控削弱＋沙箱越界暂停训练／Anthropic S-1 与估值 1.5 万亿／GTC 柏林 OpenShell）。
- **并发新情况**：当日 06:00 与 08:00 已各跑过一次（`73058a9`、`74bb2b2`），09:30 是第三次。本次改为**并集合并**：以远端 digest 为基底 + 本地新增 6 条，重生成 HTML，不再简单覆盖。教训已写入当日工作日志。
- 流程仍为：fetch 比对 → commit → pull --rebase → `checkout --theirs` 全取本地 → `GIT_EDITOR=true rebase --continue` → **重跑 build_hub.py（rows.json 已变 10-22 版，changes 15→16）** → preflight → amend → push。
- 验收：首页/list/日报页均 200；HUB.daily[0].d=2026-10-22；preflight 0 warning；hover:hover=13；digest models 标签与别名表一致。
- 待改进：单日多次触发时应先判定「是否已有当日产物」，避免重复劳动；可考虑在任务开头就 `git fetch` 并用 `git show origin/main:digest-<today>.json` 判断。

## 2026-10-23 14:39 执行（第 3 次记录）
- **当天第 3 次触发**（06:00、08:00 已推 `222cb41`、`f0a71e8`）。开头 `git fetch` 即发现，改走**并集合并**：以远端 digest 为基底追加 7 新闻 / 4 论文 / 3 模型 / 5 生态 / 2 看点，最终 A20 / B12 / C9 / D12、highlights 6，commit `db944db`。
- 主题增补：MiniMax M3.1 Flash 放开权重（428B-A23B）；Flint-40B-A2B；腾讯混元×复旦 WorkForge（arXiv 2610.04906）；CNCC 2026；Framer MCP / Mastra MCP Events / Pydantic AI 2.59.0 / headroom。
- **关键教训 1 — 不要重新生成日报 HTML**：当日 HTML 已含 `digest-ui2` 区块（page-toc、note 三行截断、dark mode、移动端压缩）。正确做法是用脚本按 `</div></section>` 切成四段、在段末插卡片、只改 count 数字；重生成会静默丢掉移动端规范化。
- **关键教训 2 — 别名表 `astra` 会命中 Mastra**（框架名）→ 已把 `GPT-6 Astra` 的 pattern 改为 `...|(?<![a-z])astra`。另注意标题里产品名被插字（如「MiniMax 开源 M3.1 Flash」）会导致漏标，标题须保持 `MiniMax M3.1 Flash` 连续。
- **关键教训 3 — 标签校验口径**：不能用「正则全集 == models 数组」判定（历史 digest 只打首个命中，全量扫描 50 处误报）。判据应为：值∈别名表 ∧ 值可被文本命中 ∧ 有命中却全空=漏标。
- **关键教训 4 — 不要 `git add -A`**：`.workbuddy/` 未跟踪，会把内部记忆推到公开仓库；显式 add 那 5 个产物文件。
- 验收：首页 / list / 日报页均 200，日报页计数 20 条、hover:hover 13，origin/main 含 `db944db`。

## 2026-10-24 12:55 执行（第 4 次记录）
- **当天第 2 次触发**（08:00 已推 `9924d93`，11:10 榜单推 `491c2ca`）。开头 `git pull --rebase` 快进到 origin 后走**并集合并**，最终 A17 / B11 / C9 / D12、highlights 9，commit `568c4d5`。
- 主题增量：Anthropic IPO 定价区间约 2.3 万亿美元＋认购 12 倍＋4500 亿云承诺；OpenAI 开源「安全熔断」工具包；欧盟高风险系统自评清单；Gemini 4 Argon-V 下放 Pixel 11／Wear OS；荣耀 Magic9 系统级 Agent Harness；Rubin 2027Q1；AI+ 12 示范城；融资 80 亿美元周报；生态 Traefik MCP／Box Guardrails／GitLab 19.4／FlagOS 2.2。
- **关键教训 — 补更必须先做「跨日期查重」**：首版误收 10-23 已报的 Decisions API GA、DeepSeek 150 亿美元融资、RIDAR 论文、蚂蚁 LingDT（10-23 models 已有），另有 Muse Spark「1.6T」与 10-16 记录 816B/42B 冲突。处理：回滚备份、脚本内加跨日期关键词 grep，命中即弃或改写为「后续进展」；单源冲突项单独成卡标注「待核实」。
- 流程同前：改 digest＋插卡片（不重生成 HTML）→ 更新 list 摘要 → build_hub.py → 显式 add 6 个文件（勿 `git add -A`）→ pull --rebase（本次无冲突）→ push。
- 验收：日报页 17/11/9/12 与 HTML 卡片数一致；首页含「安全熔断／端侧抢入口」；list 顶部「午后补更」；hover:hover 13；origin/main 含 `568c4d5`。Pages 重建约 30–40 秒，首轮 curl 会命中旧缓存，需轮询到新内容再判。


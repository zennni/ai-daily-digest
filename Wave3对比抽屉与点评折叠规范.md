# Wave 3：对比浮钮抽屉 · 点评一行展开 · 本档首选加强

## 范围（设计）
1. 对比条 → 右下浮钮（FAB）+ 底抽屉；默认不占底栏
2. 本地 LLM / 生图表「点评」列默认一行，点「展开」看全文
3. `tr.top` 本档首选视觉再加强（4px 左边条 + 更强行底 + ① 橙环）

**不含（运营）**：首包 / ECharts lazy、暗色模式、Tab 无障碍。

## 验收清单

### ① 对比 FAB + 抽屉
- [ ] 未勾选对比时：无底栏条、无 FAB，`body` 底 padding 正常（约 28px，非旧 120px）
- [ ] 勾选 ≥1 个模型：右下出现蓝底 FAB「对比 N」
- [ ] 点 FAB 打开抽屉（滑入）+ 半透明 scrim；标签与（≥2 时）雷达图在抽屉内
- [ ] 点「收起」/ scrim / Esc 关闭抽屉；FAB 仍在（只要仍有勾选）
- [ ] 勾选清零：FAB 消失、抽屉关闭
- [ ] 仍最多 4 个；雷达图维度与旧版一致（AA/能力/成本/性价比/效率）
- [ ] `:hover` 仅在 `@media (hover:hover)`（FAB / 收起钮）

### ② 点评默认一行
- [ ] `#v-local` 下 LLM 与生图表最后一列均包 `.cm-body.is-clamp`（`-webkit-line-clamp:1`）
- [ ] 旁有「展开」→ 全文 + 「收起」；内容不删、不改字
- [ ] 窄屏扫读不再被点评墙淹没

### ③ 本档首选加强
- [ ] `tr.top` 左边条 **4px** `var(--accent)`；行底 `#ffedd5`（强于 Wave1 `--accent-bg`）
- [ ] `td.rk` 深蓝底 + 橙双环阴影；「首选」pill 仍在
- [ ] 不破坏表格列宽 / 横向滚动

### ④ 回归
- [ ] `hub.html` ≡ `index.html`
- [ ] Wave1 本地 TOC / sticky、Wave2 顶栏锚点 / 两榜卡 / 筛选折叠未回退
- [ ] 未改 `window.HUB` 榜单数据

## 实现备注（给运营）
- 对比逻辑仍用全局 `SELECTED` + `.sel` checkbox；只改壳（`#cmpFab` / `#cmpScrim` / `#cmp`）
- 点评由页面加载时 `initLocalComments` 包一层 DOM，静态表即可；若日后动态重渲本地表需再调一次
- 运营改暗色时：FAB 用 `--primary`，首选用 `--accent` / `#ffedd5`，抽屉背景现写死 `#fff`——暗色请自适配
- 冲突提示：本波动了 `hub.html`/`index.html` 的 **cmp 区 CSS/HTML/JS**、`tr.top`、`#v-local` 点评包装；请勿整文件覆盖。首包/ECharts/暗色请另开区块或 pull 合本 commit 后再叠

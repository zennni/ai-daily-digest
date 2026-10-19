# Wave 2：窄屏卡片 · 筛选折叠 · Hub 顶栏锚点

## 范围
1. 性价比 / 开放权重窄屏卡片（镜像主榜 `#boardCards`）
2. 主榜筛选默认折叠（全视口）
3. Hub 顶栏锚点：主榜 / API / 开源 / 本地 / 生图

不含：对比条抽屉、点评折叠、暗色、ECharts lazy（Wave 3）。日报小目录由运营另推（`1cf298d`，`.page-toc`）。

## 验收清单

### ① 性价比 + 开放权重窄屏卡
- [ ] `max-width: 760px` 时 `#valueTblWrap` / `#openTblWrap` 隐藏，`#valueCards` / `#openCards` 显示
- [ ] 桌面（>760px）仍为宽表，卡片 `display:none`
- [ ] 性价比卡首屏：排名 / 模型名 / 厂商·档位 / AA / 任务成本 / 综合分；展开：原始效率、开放、许可
- [ ] 开放权重卡首屏：排名 / 模型名 / 厂商·开放状态 / AA / 性价比；展开：许可、档位
- [ ] 点模型名走 `goModel`（跳主榜）；Top3 蓝底 `#` 与主榜一致
- [ ] 复用 `.board-cards` / `.bc-*`，不另起破坏主榜的选择器

### ② 主榜筛选默认折叠
- [ ] 默认只见「筛选 ▾」芯片，`#boardFilters` 带 `is-collapsed` 隐藏
- [ ] 点击展开为「收起筛选 ▴」，筛选控件全部可用；重置仍在展开区内
- [ ] `sessionStorage.hub_filters_open` 记忆开合（可选；无 storage 时默认折叠）
- [ ] 折叠态下默认条件仍生效；搜索框 `q` 过滤不受影响

### ③ Hub 顶栏锚点
- [ ] Tabs 下方近顶 `.hub-toc`（非 sticky，避免与本地 TOC 叠层；Tabs 仍为窄屏唯一 sticky）：主榜 / API / 开源 / 本地 / 生图
- [ ] 前四项切对应 `.tab[data-v]`（board / value / open / local）并滚到顶
- [ ] 「生图」切本地 Tab 后平滑滚到 `#local-img`（尊重 Wave1 scroll-margin / sticky）
- [ ] 当前 Tab 高亮对应芯片；生图跳转时高亮橙底「生图」
- [ ] 窄屏 hub-toc 芯片略缩；`:hover` 仅在 `@media (hover:hover)`

### ④ 回归（Wave1）
- [ ] 窄屏顶栏 relative、Tabs 单 sticky、本地 TOC / 本档首选橙标仍在
- [ ] `hub.html` ≡ `index.html`

## 实现备注（给运营）
- 卡片由既有 `renderValue()` / `renderOpen()` 同步填充；切到 value/open Tab 会重跑。无需另接数据源。
- 主榜 `renderBoard` + `#boardCards` 未改交互合同。
- 保护规则：所有 `:hover` 仍包在 `@media (hover:hover)`。

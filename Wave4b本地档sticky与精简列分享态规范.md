# Wave 4b：本地档 sticky · 桌面精简列 · URL 分享态

## 范围（设计）
7. 本地长榜：`h3.sub` / `h3.sub2` sticky 当前档 + `.local-toc` 芯片高亮（IntersectionObserver）
8. 桌面主榜默认精简列（☑ / 排名 / 名+★ / AA / 任务成本$），「展开全列」看其余；≤760 仍走卡片
10. 分享态：`?tab=&q=&cmp=&mode=`（`mode=full|top`；保留既有 hash 锚点与 `?v=` 缓存戳）

不含：HUB/rows 单源、CI、懒挂载、生图卡、暗色手调（运营）。

## 验收
- [ ] `#v-local` 滚动时当前档标题吸在 Tabs+local-toc 下；TOC 对应芯片 `.on`
- [ ] 桌面主榜默认精简；点「展开全列」出厂商/档位/开放/许可/价/性价比/提及；★ 精简态贴模型名
- [ ] ≤760 主榜仍是卡片，不受精简列影响
- [ ] `?tab=board&q=foo&cmp=A,B` 刷新可恢复 Tab / 搜索 / 对比勾选；`#local-llm-16gb` 仍可滚到档
- [ ] 空关注 watchbar 仍 hidden；Wave4 Tabs-only sticky 不回退
- [ ] `hub.html` ≡ `index.html`（`./scripts/sync-hub-index.sh`）
- [ ] `:hover` 仍包在 `@media (hover:hover)`

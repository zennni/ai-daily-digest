# Wave 4：窄屏藏 hub-toc · 关注随顶栏滚走 · hub/index 单源

## 范围
1. ≤760 整藏 `.hub-toc`（生图仍靠本地 Tab 内 `.local-toc`）
2. 有 ★ 时关注条跟顶栏一起滚走，**只留 Tabs sticky**（全视口）
3. `hub.html` 为 canonical；`scripts/sync-hub-index.sh` 拷到 `index.html`

不含：HUB/rows 生成、CI grep（运营）、档内 sticky 标签、桌面精简列、分享深链、暗色手调。

## 验收清单

### ⑤ 窄屏藏 hub-toc
- [ ] `max-width: 760px` 时 `.hub-toc` `display:none`，不占高
- [ ] 桌面（>760）仍显示「跳转」芯片（主榜/API/开源/本地/生图）
- [ ] 窄屏切「本地」后仍见 `.local-toc`；「生图」芯片可滚到 `#local-img`

### ⑥ 关注条 + 顶栏滚走
- [ ] `.topbar` / `.watchbar` 均为 `position:relative`（非 sticky）
- [ ] 无 ★：`.watchbar[hidden]` 不占行（`bfdec3f` 空态不变）
- [ ] 有 ★：关注条可见，上滚后与顶栏一起离开，仅 `.tabs` 吸顶（`top:0`）
- [ ] `--tabs-top` 恒 `0`；`measureSticky` 只更新 `--tabs-h`
- [ ] `.local-toc` 仍贴在 Tabs 下（`top: var(--tabs-h)`）

### ② hub≡index 单源
- [ ] 改完 `hub.html` 后跑 `./scripts/sync-hub-index.sh`
- [ ] `diff hub.html index.html` 无差；两文件同 commit

## 保护规则
- 所有 `:hover` 仍包在 `@media (hover:hover)` 内
- 勿把 watchbar / topbar 重新设为 sticky

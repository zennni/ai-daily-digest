# 架构：HUB / rows 单源生成 + 推前自检

Wave A（运营）：消灭 `window.HUB` ↔ `rows.json` 双轨漂，并在推送前用脚本挡住目录 / title /「最新」不一致。

## 权威数据（改榜只改 JSON）

| 文件 | 写入 HUB 字段 | 说明 |
|------|----------------|------|
| `rows.json` | `models`（短键）、`changes`、`today`、`meta.rows*` | 主榜权威；含完整字段（`note`/`ability` 等仅留在 rows） |
| `aliases.json` | `aliases` | 模型名正则别名 |
| `daily.json` | `daily` | Hub 时间线条目（pts / bf / link） |
| `news.json` | `news` | Hub 资讯流（与单日 `digest.json` 可不完全相同） |
| `digest.json` | （不直接注入） | 最新日报权威；供自检与日报页 |

**不要**手改 `hub.html` / `index.html` 里的 `window.HUB = {...}`。

## 生成

```bash
node scripts/build-hub.mjs           # 只替换 HUB 注入块（保留 CSS/DOM）
node scripts/build-hub.mjs --check   # 深比较：embed ≡ 源 JSON
node scripts/build-hub.mjs --hub-only
```

注入块带标记：`/*HUB_DATA_START*/` … `/*HUB_DATA_END*/`。

设计侧全文件单源：改完 `hub.html` 后跑 `./scripts/sync-hub-index.sh`，再视需要跑一次 `build-hub`（或先 build 再 sync，二者只动各自职责：sync 拷全文件，build 只补 HUB）。

推荐改榜流程：

1. 改 `rows.json`（及必要时 `daily.json` / `news.json` / `aliases.json`）
2. `node scripts/build-hub.mjs`
3. `node scripts/preflight-check.mjs`
4. commit + push

## 推前自检

```bash
node scripts/preflight-check.mjs
# 或
npm run preflight
```

失败即非 0。至少检查：

- 最新 `AI日报-YYYY-MM-DD.html`：`<title>` 含该日；有 `.page-toc`；有 `#sec-highlights|news|papers|models|ecosystem`
- `list.html`「最新」恰好一条，日期与 `digest.json` / 最新日报一致
- `hub.html` / `index.html` 内 `HUB.daily[0].d` 与上者一致；`HUB.models` 非空；`rows.json` 可 parse
- （附加）`HUB.models.length` ≡ `rows.json.models.length`

可选安装 pre-push hook（不强制）：

```bash
./scripts/install-pre-push-hook.sh
```

## 与设计分工

- **运营**：本文件、`build-hub` / `preflight`、源 JSON、HUB 注入
- **设计**：`hub≡index` 同步脚本、窄屏 toc / 关注条等 CSS（勿与 HUB 注入抢同一语义块）

# 日报 page-toc 模板说明

新写 / 生成 `AI日报-YYYY-MM-DD.html` 时，除分区 `id` 外，**必须**在 `</header>` 后插入目录 DOM（仅有 `.page-toc` CSS 不够）。

## 必备片段

```html
<nav class="page-toc" aria-label="本页目录">
  <span class="pt-label">目录</span>
  <a href="#sec-highlights">看点</a>
  <a href="#sec-news">新闻</a>
  <a href="#sec-papers">论文</a>
  <a href="#sec-models">模型</a>
  <a href="#sec-ecosystem">生态</a>
</nav>
```

## 对应分区 id

| 芯片文案 | 元素 id |
|---------|---------|
| 看点 | `#sec-highlights`（通常在 `.highlights`） |
| 新闻 | `#sec-news` |
| 论文 | `#sec-papers` |
| 模型 | `#sec-models` |
| 生态 | `#sec-ecosystem` |

CSS 复用既有 `.page-toc` / `.pt-label`（sticky 顶栏芯片）。分区目标建议带 `scroll-margin-top`，避免被 sticky 目录挡住。

参考：`AI日报-2026-10-19.html`。

## 推送前

发布 / 改 list「最新」/ 改榜后，跑：

```bash
node scripts/preflight-check.mjs
```

详见 `架构-HUB单源与推前自检.md`。

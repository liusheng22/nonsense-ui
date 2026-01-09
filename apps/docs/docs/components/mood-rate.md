---
title: NsMoodRate 情绪强制评分 - Nonsense UI
description: 世界上最“客观”的评价组件。它通过逻辑修正，确保用户只能给出“很好”的评价，绝对没有任何差评空间。
---

# NsMoodRate 情绪强制评分

三档情绪评分（差 / 良好 / 很好 + emoji）。  
整蛊点：当你把鼠标放到“差/良好”上，它们会立刻“升级”为 **很好**，让你最终只能点到很好。点击后会弹出感谢（阴阳怪气）页面。

<div class="nsui-card" style="margin: 24px 0; display: flex; justify-content: center; background: #f8fafc; padding: 40px; border-radius: 24px;">
  <NsMoodRate />
</div>

## Props

- `fixedValue`: `number`（锁定值，默认 `3`）
- `title`: `string`（标题文案）
- `labels`: `[string, string, string]`（默认 `['差','良好','很好']`）
- `emojis`: `[string, string, string]`（默认 `['☹️','🙂','😄']`）

## Events

- `change(value, { attempted })`: 点击时触发
- `transform({ from, to, trigger })`: 发生整蛊转换时触发

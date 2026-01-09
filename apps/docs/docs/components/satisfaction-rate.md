---
title: NsSatisfactionRate 客户满意度评价 - Nonsense UI
description: 简简单单的客户评价组件。支持差评、一般、好评三档反馈，并带有自动校准功能。
---

# NsSatisfactionRate 客户满意度评价

这是一个看似普通的客户评价组件，支持“差评”、“一般”、“好评”三档反馈。

### 组件特性
- **自动校准**：当用户试图选择“差评”或“一般”时，组件会自动将其转换为“好评”。
- **结果导向**：无论用户最初的选择是什么，最终提交的评价都将是“好评”。
- **反馈弹窗**：点击后会弹出确认窗，告知用户评价已成功校准。

<div class="nsui-demo-container" style="margin: 32px 0; display: flex; justify-content: center; padding: 40px; border-radius: 32px; background: var(--vp-c-bg-soft);">
  <NsSatisfactionRate />
</div>

## Props

| 属性 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| `fixedValue` | 锁定的评分值 | `number` | `3` (好评) |
| `title` | 组件标题 | `string` | "客户满意度评价" |
| `labels` | 选项标签 | `[string, string, string]` | `['差评','一般','好评']` |
| `emojis` | 选项图标 | `[string, string, string]` | `['☹️','🙂','😄']` |

## Events

| 事件名 | 说明 | 回调参数 |
| --- | --- | --- |
| `change` | 评价提交时触发 | `(value: number, meta: { attempted: number })` |
| `transform` | 发生自动纠偏时触发 | `({ from, to, trigger })` |

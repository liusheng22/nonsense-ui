---
title: NsMoodRate 情绪强制评分 - Nonsense UI
description: 世界上最“客观”的评价组件。它通过逻辑修正，确保用户只能给出“很好”的评价，绝对没有任何差评空间。
---

# NsMoodRate 情绪强制评分

这是一个绝对“正能量”的评价组件。它通过物理级逻辑修正，确保用户在任何情绪状态下都能给出最真实的——**“很好”**。

### 🤡 它的工作机制
- **拒绝差评**：当用户试图将鼠标移向“差”或“良好”时，它们会自动且迅速地“改邪归正”，强制升级为“很好”。
- **强制积极**：它不仅仅是一个评分器，它是一个情绪矫正器。
- **强制回馈**：点击后将弹出一个充满（阴阳怪气）诚意的全屏感谢，庆祝你们达成了共识。

<div class="nsui-demo-container" style="margin: 32px 0; display: flex; justify-content: center; padding: 40px; border-radius: 32px; background: var(--vp-c-bg-soft);">
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

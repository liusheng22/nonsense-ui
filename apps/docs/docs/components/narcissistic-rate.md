---
title: NsNarcissisticRate 自恋评分 - Nonsense UI
description: 为极度自信者设计的评分组件。它会自动躲避低分评价，并为每一次高分给予华丽的视觉反馈。
---

# NsNarcissisticRate 自恋评分

一个极其“自恋”的评分组件。它坚信自己是完美的，因此不允许任何低于满分的评价。

### 组件特性
- **高自尊 (egoLevel="high")**：当你想点 1-4 星时，星星会不仅在视觉上强行变成 5 星，还会物理性地躲避你的光标。
- **自适应文案**：即便你还没点，它也会通过文案不断诱导（洗脑）你给出正确答案。
- **强制感谢**：无论如何，当你点击后，它都会由衷地感谢你对它的肯定。

<div class="nsui-card" style="margin: 24px 0; display: flex; flex-direction: column; align-items: center; background: #fffbeb; padding: 40px; border-radius: 24px; gap: 24px;">
  <div style="display:flex; gap: 12px; align-items: center;">
    <span style="font-weight: bold; color: #92400e;">自恋等级：</span>
    <button 
      class="nsui" 
      style="border:2px solid #f59e0b; border-radius:12px; padding:8px 16px; background:#fff; cursor:pointer; font-weight: bold; color: #d97706;" 
      @click="ego = ego === 'high' ? 'low' : 'high'"
    >
      {{ ego === 'high' ? '🔥 极高 (物理闪避)' : '💬 普通 (仅洗脑)' }}
    </button>
  </div>

  <NsNarcissisticRate v-model="score" :ego-level="ego" title="您觉得我的文档写得好吗？" />
</div>

## Props

- `fixedScore`: `number`（唯一正确分数，默认 `5`）
- `egoLevel`: `'low' | 'high'`（自恋程度，默认 `high`）
- `title`: `string`（评分标题）

## Events

- `change(value, { attempted })`: 点击后触发
- `ego(level)`: 触发自恋行为时触发


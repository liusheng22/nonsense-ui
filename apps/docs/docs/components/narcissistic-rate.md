# NsNarcissisticRate 自恋评分

一个极度自恋且控制欲极强的评分组件。它不仅拒绝差评，还会主动“碰瓷”你的鼠标，确保你给出的每一次点击都是满分。

### 组件特性
- **主动碰瓷 (Active Interception)**：当你试图点击 1-4 星时，组件会瞬间平移，用第 5 颗星强行接住你的鼠标点击。
- **强制满分 (Forced Perfection)**：无论你如何尝试，最终的点击事件都会落在满分星上。
- **自适应文案**：组件右上角状态栏显示 `DISSENT: BLOCKED`（异议：已屏蔽），时刻提醒用户谁才是老大。
- **强制感谢**：点击后，它会由衷地感谢你（被强迫）的肯定。

<div class="nsui-demo-container" style="margin: 24px 0; display: flex; flex-direction: column; align-items: center; background: #fffbeb; padding: 40px; border-radius: 24px; gap: 24px;">
  <NsNarcissisticRate v-model="score" title="您觉得我的文档写得好吗？" />
</div>

### 基础用法

```vue
<template>
  <NsNarcissisticRate 
    v-model="rate"
    title="给我打个分吧（只要五星）"
  />
</template>

<script setup>
import { ref } from 'vue'
const rate = ref(5)
</script>
```

### API

| 属性 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| `v-model` | 绑定值（只能是 5） | `number` | - |
| `title` | 标题文案 | `string` | "您对我的表现打几分？" |
| `disabled` | 是否禁用 | `boolean` | `false` |

### Events

| 事件名 | 说明 | 回调参数 |
| --- | --- | --- |
| `change` | 评分改变时触发（永远是 5） | `(value: number, meta: { attempted: number })` |

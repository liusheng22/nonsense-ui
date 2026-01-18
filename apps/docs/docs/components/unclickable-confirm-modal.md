---
title: NsUnclickableConfirmModal 点不到关闭弹窗 - Nonsense UI
description: 一个“点不到确认关闭”的弹窗。确认按钮会逃跑，Esc/遮罩才是人类的出路。
---

# NsUnclickableConfirmModal 点不到关闭弹窗

这是一个“点不到确认关闭”的弹窗：你越想点“确认关闭”，它越往反方向逃。

### ✅ 行为说明

- 弹窗结构是正常的（Header / Content / Footer）
- “确认关闭”按钮会在弹窗内部逃跑：越靠近逃得越快
- 关闭方式：按 `Esc` 或点击遮罩（如果开启遮罩）

### 🎮 演示

<div class="demo-box mt-6">
  <button class="ns-demo-trigger" @click="open = true">打开弹窗</button>
  <NsUnclickableConfirmModal v-model:open="open" :dodge-speed="1.1" :safe-distance="26" :detection-radius="70" />
</div>

### 📚 使用方法

```vue
<template>
  <button @click="open = true">打开弹窗</button>
  <NsUnclickableConfirmModal v-model:open="open" :dodge-speed="1.2" :safe-distance="26" :detection-radius="70" />
</template>
```

### 属性 (Props)

| 属性名 | 类型 | 默认值 | 说明 |
| :--- | :--- | :--- | :--- |
| `open` | `boolean` | `-` | 控制弹窗打开/关闭（可用 `v-model:open`）。 |
| `mask` | `boolean` | `true` | 是否显示遮罩层。 |
| `closeOnMask` | `boolean` | `true` | 点击遮罩是否关闭。 |
| `escClosable` | `boolean` | `true` | 是否允许 Esc 关闭。 |
| `dodgeSpeed` | `number` | `1` | 躲避速度倍率，数值越大逃得越快。 |
| `safeDistance` | `number` | `26` | 与鼠标保持的最小距离（像素）。 |
| `detectionRadius` | `number` | `50` | 鼠标进入此范围触发躲避（像素）。 |

<script setup>
import { ref } from "vue";
const open = ref(false);
</script>

<style scoped>
.ns-demo-trigger {
  margin-bottom: 12px;
  padding: 8px 16px;
  border-radius: 999px;
  border: 1px solid var(--vp-c-gutter);
  background: var(--vp-c-bg-soft);
  font-weight: 700;
}
</style>

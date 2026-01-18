---
title: NsUncatchableModal 追不到弹窗 - Nonsense UI
description: 一个“追不到”的弹窗。鼠标越靠近，它越瞬移；Esc/遮罩才是人类的出路。
---

# NsUncatchableModal 追不到弹窗

这是一个“追不到”的弹窗：你越追，它越瞬移；你越想点到，它越不在。

### ✅ 行为说明

- 弹窗结构是正常的（Header / Content / Footer）
- 弹窗会瞬移远离你的鼠标
- 鼠标接近弹窗会触发瞬移
- 关闭方式：按 `Esc` 或点击遮罩（如果开启遮罩）

### 🎮 演示

<div class="flex flex-col gap-4">
  <div class="demo-box mt-6">
    <h4>鼠标接近触发</h4>
    <button class="ns-demo-trigger" @click="openHover = true">打开弹窗</button>
    <NsUncatchableModal v-model:open="openHover" content="提示：别追了……按 Esc 退出。" />
  </div>
</div>

### 📚 使用方法

```vue
<template>
  <button @click="open = true">打开弹窗</button>
  <NsUncatchableModal
    v-model:open="open"
    content="提示：别追了……按 Esc 退出。"
    :show-effect="true"
  />
</template>
```

### 属性 (Props)

| 属性名 | 类型 | 默认值 | 说明 |
| :--- | :--- | :--- | :--- |
| `open` | `boolean` | `-` | 控制弹窗打开/关闭（可用 `v-model:open`）。 |
| `showEffect` | `boolean` | `true` | 是否展示传送特效。 |
| `mask` | `boolean` | `true` | 是否显示遮罩层。 |
| `closeOnMask` | `boolean` | `true` | 点击遮罩是否关闭。 |
| `escClosable` | `boolean` | `true` | 是否允许 Esc 关闭。 |

<script setup>
import { ref } from "vue";

const openHover = ref(false);
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

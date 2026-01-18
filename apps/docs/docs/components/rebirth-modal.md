---
title: NsRebirthModal 重生弹窗 - Nonsense UI
description: 一个“关了还会复活”的弹窗。点确认/✕ 都没用，只能按 Esc 退出。
---

# NsRebirthModal 重生弹窗

“假关闭” + “瞬间复活”。你以为关掉了，其实它还在。

### ✅ 行为说明

- 弹窗结构是正常的（Header / Content / Footer）
- 点击 ✕ / “确认关闭”会触发“假关闭”，随后随机位置复活
- 关闭方式：按 `Esc`

### 🎮 演示

<div class="demo-box mt-6">
  <button class="ns-demo-trigger" @click="open = true">打开弹窗</button>
  <NsRebirthModal v-model:open="open" :rebirth-delay="120" :max-rebirths="Infinity" />
</div>

### 📚 使用方法

```vue
<template>
  <button @click="open = true">打开弹窗</button>
  <NsRebirthModal v-model:open="open" :rebirth-delay="120" :max-rebirths="5" />
</template>

<script setup>
import { ref } from "vue";
const open = ref(false);
</script>
```

### 属性 (Props)

| 属性名 | 类型 | 默认值 | 说明 |
| :--- | :--- | :--- | :--- |
| `open` | `boolean` | `-` | 控制弹窗打开/关闭（可用 `v-model:open`）。 |
| `mask` | `boolean` | `true` | 是否显示遮罩层。 |
| `escClosable` | `boolean` | `true` | 是否允许 Esc 关闭。 |
| `rebirthDelay` | `number` | `100` | 消失到重生的延迟（毫秒）。 |
| `maxRebirths` | `number` | `Infinity` | 最大重生次数，默认无限。 |
| `messageList` | `string[]` | `[...]` | 重生时的随机吐槽文案列表。 |

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

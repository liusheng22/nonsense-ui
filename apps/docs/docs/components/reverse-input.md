---
title: NsReverseInput 逻辑反转输入 - Nonsense UI
description: 一个拒绝顺从的输入框。它会反转你的输入顺序，镜像你的文字显示，甚至拒绝你的光标移动请求。
---

# NsReverseInput 逻辑反转输入

一个挑战人类读写本能的输入框。它通过逻辑反转与物理镜像，让原本简单的文字录入变成一场思维博弈。

### 🎮 交互特性
1.  **字符倒序**：你输入的第一个字会出现在最右边，光标永远在“后面”追赶。
2.  **物理镜像 (Mirror Mode)**：点击开启后，整个输入框将沿 X 轴翻转。此时你不仅要面对倒序的逻辑，还要挑战镜面视觉。
3.  **叛逆光标**：尝试使用左右方向键？它会以闪烁和颤抖来回应你对它的控制企图。
4.  **实时解密**：下方提供了内存中的“真实存储值”，方便你核对刚才到底打进去了什么胡言乱语。

<div class="nsui-card" style="margin: 24px 0; display: flex; flex-direction: column; align-items: center; background: #f1f5f9; padding: 40px; border-radius: 24px; gap: 24px;">
  <NsReverseInput 
    v-model="reverseValue" 
    title="绝密反向传输" 
    subtitle="即使有人在你背后偷看，也无法理解你正在输入的内容。"
    placeholder="输入一些你想反着说的话..."
  />
</div>

## Props

- `modelValue`: `string`（当前输入值）
- `title`: `string`（标题）
- `subtitle`: `string`（副标题）
- `placeholder`: `string`（占位符）
- `initialMirror`: `boolean`（初始是否开启镜像模式，默认 `false`）

## Events

- `update:modelValue`: 输入内容变化时触发
- `glitch`: 触发“叛逆”交互（如按方向键）时触发

<script setup>
import { ref } from 'vue'
const reverseValue = ref('我正在倒着说话')
</script>

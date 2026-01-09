---
title: NsGravityInput 重力崩塌输入框 - Nonsense UI
description: 文字不再受输入框束缚，输入即坠落。利用物理引擎模拟的输入体验，支持通过晃动重新排列字符。
---

# NsGravityInput 重力崩塌输入框

看起来是一个普通的输入框，但输入的文字受到**重力引擎**的严格控制。

### 🎮 交互指南
1.  **文字坍塌**：你输入的每一个字符都会像沙子一样掉落到输入框底部。
2.  **视觉混乱**：随着字符增多，它们会堆积、滚动、互相碰撞，让你完全无法阅读。
3.  **摇匀重排**：
    *   **手动摇晃**：快速在输入框内摇晃你的鼠标，文字会感受到向心力并尝试暂时排成整齐的队列。
    *   **一键摇匀**：点击底部的“一键摇匀”按钮，文字会进入高能重排状态。
4.  **勉强看清**：在“重排模式”下，文字会变为绿色并努力飞回它们原本该在的位置。一旦重排结束，重力将再次统治一切。

<div class="nsui-card" style="margin: 24px 0; display: flex; flex-direction: column; align-items: center; background: #f8fafc; padding: 40px; border-radius: 24px; gap: 24px;">
  <NsGravityInput 
    v-model="text" 
    title="绝密信息输入" 
    subtitle="输入完成后请立即摇匀以核对信息。"
    placeholder="在此输入您的银行卡密码（反正也看不清）..."
  />
  
  <div style="width: 100%; max-width: 460px; font-size: 12px; background: #fff; padding: 16px; border-radius: 16px; border: 1px solid #e2e8f0; color: #64748b;">
    <div style="font-weight: black; text-transform: uppercase; margin-bottom: 8px; letter-spacing: 0.1em;">后台实际接收值：</div>
    <div style="font-family: monospace; word-break: break-all; color: #1e293b;">{{ text || '等待输入...' }}</div>
  </div>
</div>

## Props

- `modelValue`: `string`（绑定值）
- `title`: `string`（标题）
- `subtitle`: `string`（副标题）
- `gravity`: `number`（重力加速度，默认 `1200`）
- `bounciness`: `number`（弹性系数 0-1，默认 `0.4`）
- `fontSize`: `number`（文字大小，默认 `24`）
- `revealDurationMs`: `number`（重排显示时长，默认 `1500`）
- `shakePower`: `number`（摇晃力度，默认 `800`）

## Events

- `shake`: 触发摇晃时
- `reveal`: 进入重排模式时

<script setup>
import { ref } from 'vue'
const text = ref('')
</script>

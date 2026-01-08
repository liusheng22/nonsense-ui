# NsContradictingCheckbox

一个具有自我意识和高度主见的复选框。它不仅仅是反向逻辑，它会主动通过“视觉欺骗”和“文案博弈”来挑战你的决定。

### 🎮 交互指南
1.  **概率反叛**：当你尝试勾选它时，它有极高概率在勾选后的 0.6 秒内，带着一声“哼”自动取消勾选。
2.  **动态洗脑**：
    *   未勾选时，它看起来很正常：`我同意以上所有荒谬的条款`。
    *   勾选瞬间，它的真面目会显现：`其实我并不是真的想同意`。
3.  **系统级纠错**：每次它拒绝你的勾选时，都会弹出一个带有随机借口的气泡（如：“检测到非法同意，已自动拦截”）。
4.  **撤销错误决定**：如果你居然通过了它的概率检测成功勾选，你可以点击底部的按钮来“纠正”这个错误。

<div class="nsui-card" style="margin: 24px 0; display: flex; flex-direction: column; align-items: center; background: #f8fafc; padding: 40px; border-radius: 24px; gap: 24px;">
  <NsContradictingCheckbox 
    v-model="agreement" 
    title="灵魂契约" 
    subtitle="一旦勾选，概不退换（虽然你大概率勾不中）。"
    :stubbornness="0.8"
  />
  
  <div style="width: 100%; max-width: 420px; font-size: 12px; background: #fff; padding: 16px; border-radius: 16px; border: 1px solid #e2e8f0; color: #64748b;">
    <div style="font-weight: black; text-transform: uppercase; margin-bottom: 8px; letter-spacing: 0.1em;">最终决策状态：</div>
    <div style="font-family: monospace; font-size: 14px; font-weight: bold; color: #1e293b;">
      agreement = <span :style="{ color: agreement ? '#10b981' : '#f43f5e' }">{{ agreement }}</span>
    </div>
  </div>
</div>

## Props

- `modelValue`: `boolean`（当前勾选状态）
- `title`: `string`（卡片标题）
- `subtitle`: `string`（卡片副标题）
- `label`: `string`（未勾选时的文案）
- `rebelLabel`: `string`（勾选后的“真面目”文案）
- `stubbornness`: `number`（顽固度 0-1，值越高越难勾选成功，默认 `0.7`）

## Events

- `update:modelValue`: 状态变化时触发
- `rebel`: 当组件拒绝勾选并“反叛”时触发，返回拒绝理由

<script setup>
import { ref } from 'vue'
const agreement = ref(false)
</script>

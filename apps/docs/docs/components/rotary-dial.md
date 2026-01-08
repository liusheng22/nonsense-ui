# NsRotaryDial

一个复古风格的拨盘输入器。

### 🎮 如何使用（新手教程）
1.  **选中数字**：用鼠标按住你想输入的数字圆孔。
2.  **顺时针拨动**：按住不放，沿着圆盘边缘**顺时针**向下拉。
3.  **触碰挡板**：直到你按住的数字圆孔碰到右下角的“黑色金属挡板”。
4.  **松手录入**：看到进度达到 **100%** 后松开鼠标，拨盘会自动回弹，数字录入成功。
5.  **注意**：如果没拨到底就松手，拨盘会直接弹回，输入无效。

### 组件特性
- **物理模拟**：模拟老式电话的旋转拨盘，必须手动旋转到挡板处。
- **强制专注**：旋转到一半松手会触发 `springBack` 效果，前功尽弃。
- **实时反馈**：新增了进度环和百分比显示，让你清晰看到距离成功还有多远。

<div class="nsui-card" style="margin: 24px 0; display: flex; flex-direction: column; align-items: center; background: #f8fafc; padding: 40px; border-radius: 24px; gap: 24px;">
  <div style="display:flex; gap: 12px; align-items: center; flex-wrap: wrap; justify-content: center;">
    <div style="display:flex; gap: 8px; align-items: center;">
      <span style="font-weight: bold; color: #475569;">摩擦力：</span>
      <input 
        style="border:2px solid #cbd5e1; border-radius:12px; padding:8px 12px; width: 80px; font-weight: bold;" 
        v-model.number="friction" 
        type="number" 
        min="0" 
        max="1" 
        step="0.1" 
      />
    </div>
  </div>

  <NsRotaryDial 
    v-model="phoneNumber" 
    :friction="friction" 
    title="Nonsensical 虚拟拨号通话系统" 
    @input="onInput"
    @fail="onFail"
  />

  <div v-if="logs.length > 0" style="width: 100%; max-width: 400px; font-size: 12px; background: #fff; padding: 12px; border-radius: 12px; border: 1px solid #e2e8f0;">
    <div style="font-weight: bold; color: #64748b; margin-bottom: 8px;">操作记录：</div>
    <div v-for="(log, i) in logs" :key="i" :style="{ color: log.type === 'fail' ? '#ef4444' : '#10b981' }">
      {{ log.msg }}
    </div>
  </div>
</div>

## Props

- `modelValue`: `string | number`（当前输入值）
- `title`: `string`（标题文案）
- `friction`: `number`（摩擦力，0-1，数值越大回弹越慢，默认 `0.5`）
- `springBack`: `boolean`（是否开启强力回弹，默认 `true`）

## Events

- `input(digit)`: 成功输入一位数字时触发
- `fail(reason)`: 拨号失败（如未拨到底）时触发

<script setup>
import { ref } from 'vue'
const phoneNumber = ref('')
const friction = ref(0.5)
const logs = ref([])

function onInput(digit) {
  logs.value = [{ type: 'success', msg: `✅ 成功输入数字：${digit}` }, ...logs.value].slice(0, 5)
}

function onFail(reason) {
  logs.value = [{ type: 'fail', msg: `❌ ${reason}` }, ...logs.value].slice(0, 5)
}
</script>


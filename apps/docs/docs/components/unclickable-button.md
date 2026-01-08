# NsUnclickableButton 抓不住的按钮

这是一个患有深度“社交距离综合征”的按钮。它讨厌被点击，更讨厌被靠近。

<div class="nsui-demo-container">
  <div class="nsui-stats-panel">
    <div class="stat-item">
      <span class="label">捕获成功次数</span>
      <span class="value">{{ count }}</span>
    </div>
    <div class="stat-item">
      <span class="label">心理阴影面积</span>
      <div style="height: 40px; display: flex; align-items: center; justify-content: flex-start;">
        <span 
          class="value panic-text" 
          :class="{ 'is-critical': panicArea >= 100 && isBothering }"
          :style="{ 
            color: panicColor, 
            transform: `scale(${1 + panicArea/200})`,
            transformOrigin: 'left center' 
          }"
        >
          {{ panicArea }}%
        </span>
      </div>
    </div>
  </div>

  <div class="nsui-card main-demo">
    <NsUnclickableButton 
      @click="onCaught" 
      @caught="onPanic"
      @panic="onUserBothering"
      :width="600"
      :height="300"
      :panic-radius="150"
    />
  </div>

  <div class="nsui-feedback-log">
    <transition-group name="list">
      <p v-for="log in logs" :key="log.id" class="log-entry">{{ log.text }}</p>
    </transition-group>
  </div>
</div>

<script setup>
import { ref, computed, onMounted } from 'vue'

const count = ref(0)
const panicArea = ref(0)
const isBothering = ref(false)
const logs = ref([{ id: 0, text: '系统：按钮目前情绪稳定...' }])

const panicColor = computed(() => {
  if (panicArea.value <= 30) return '#10b981' // Emerald
  if (panicArea.value <= 60) return '#f59e0b' // Amber
  if (panicArea.value <= 90) return '#f97316' // Orange
  return '#ef4444' // Red
})

const onCaught = () => {
  count.value++
  addLog('系统：天哪！你居然抓住了它！')
}

const onPanic = () => {
  panicArea.value = Math.min(100, panicArea.value + 10)
  addLog(panicArea.value >= 100 ? '按钮：快停下！我要坏掉了！' : '按钮：离我远点！不要碰我！')
}

const onUserBothering = (val) => {
  isBothering.value = val
}

const addLog = (text) => {
  const id = Date.now()
  logs.value.unshift({ id, text })
  if (logs.value.length > 3) logs.value.pop()
}
</script>

<style scoped>
.nsui-demo-container {
  margin: 24px 0;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.nsui-stats-panel {
  display: flex;
  gap: 12px;
}

.stat-item {
  flex: 1;
  background: var(--vp-c-bg-soft);
  border: 1px solid var(--vp-c-gutter);
  padding: 12px 20px;
  border-radius: 16px;
  display: flex;
  flex-direction: column;
}

.stat-item .label {
  font-size: 12px;
  opacity: 0.6;
  font-weight: bold;
}

.stat-item .value {
  font-size: 24px;
  font-weight: 900;
  color: var(--vp-c-brand);
  transition: all 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  display: inline-block;
}

.panic-text.is-critical {
  animation: panic-shake 0.1s infinite;
  text-shadow: 0 0 12px rgba(239, 68, 68, 0.5);
}

@keyframes panic-shake {
  0% { transform: scale(1.5) translate(0, 0); }
  25% { transform: scale(1.52) translate(-1px, 1px); }
  50% { transform: scale(1.5) translate(1px, -1px); }
  75% { transform: scale(1.52) translate(-1px, -1px); }
  100% { transform: scale(1.5) translate(0, 0); }
}

.main-demo {
  padding: 0 !important;
  overflow: hidden;
  border-radius: 24px;
  display: flex;
  justify-content: center;
  align-items: center;
}

.nsui-feedback-log {
  height: 80px;
  overflow: hidden;
  mask-image: linear-gradient(to bottom, white, transparent);
}

.log-entry {
  font-size: 13px;
  margin: 4px 0;
  opacity: 0.8;
  color: var(--vp-c-text-2);
}

.list-enter-active,
.list-leave-active {
  transition: all 0.5s ease;
}
.list-enter-from {
  opacity: 0;
  transform: translateY(-20px);
}
.list-leave-to {
  opacity: 0;
  transform: translateY(20px);
}
</style>

## Props

| 属性 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| `label` | `string` | `立即领取礼包` | 按钮显示的文案 |
| `panicRadius` | `number` | `120` | 感应范围（像素） |
| `speed` | `number` | `0.6` | 逃跑速度 (0-1) |
| `width` | `number` | `320` | 容器宽度 |
| `height` | `number` | `160` | 容器高度 |

## Events

| 事件名 | 说明 |
| --- | --- |
| `@click` | 当按钮被极其罕见地点击时触发 |
| `@caught` | 当按钮触发瞬移逃跑时触发 |

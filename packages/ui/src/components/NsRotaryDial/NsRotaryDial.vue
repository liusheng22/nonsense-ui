<template>
  <div
    class="nsui nsui-card relative inline-flex flex-col gap-6 p-10 min-w-[480px] overflow-hidden select-none"
    :class="{ 'opacity-60 grayscale-[0.5]': disabled }"
  >
    <!-- Header -->
    <div class="flex flex-col gap-2 px-1 text-center">
      <h3 class="text-2xl font-black tracking-tight">
        {{ title }}
      </h3>
      <p class="text-sm opacity-50 font-medium">正在进入非正常通信链路，请拨号</p>
    </div>

    <!-- Input Display -->
    <div class="flex flex-col items-center gap-4">
      <div
        class="w-full min-h-[90px] bg-slate-50 dark:bg-slate-900/50 border-2 border-slate-100 dark:border-slate-800 rounded-[2rem] flex flex-col items-center justify-center p-6 gap-2 overflow-hidden shadow-inner relative"
      >
        <!-- Limit Indicator -->
        <div class="absolute top-3 right-4 text-[9px] font-black opacity-30 uppercase tracking-widest">
          {{ modelValue.toString().length }} / {{ maxDigits }}
        </div>

        <div class="flex items-center justify-center gap-0.5">
          <template v-for="(digit, index) in modelValue.toString().split('')" :key="index">
            <span
              class="text-4xl font-mono font-black animate-in zoom-in duration-300"
              :class="{ 'text-emerald-500': modelValue.toString().length === maxDigits }"
            >
              {{ digit }}
            </span>
            <!-- Ultra Compact Spacers -->
            <div 
              v-if="index === 2 || index === 6" 
              class="w-1.5 h-1 mx-0.5 bg-slate-300 dark:bg-slate-700 rounded-full self-center opacity-40"
            ></div>
          </template>
          
          <span
            v-if="modelValue.toString().length === 0"
            class="opacity-30 font-mono italic text-sm tracking-[0.2em]"
          >
            等待拨号...
          </span>
        </div>
      </div>

      <!-- Quick Actions -->
      <div class="flex items-center gap-8">
        <button
          @click="backspace"
          :disabled="modelValue.toString().length === 0"
          class="group text-[10px] font-black opacity-40 hover:text-amber-500 disabled:opacity-20 transition-all uppercase tracking-[0.2em] flex items-center gap-2"
        >
          <div class="w-6 h-6 rounded-full bg-slate-100 dark:bg-slate-800 group-hover:bg-amber-100 dark:group-hover:bg-amber-900/30 flex items-center justify-center transition-colors">
            <svg viewBox="0 0 24 24" class="w-3 h-3 fill-current"><path d="M22 3H7c-.69 0-1.23.35-1.59.88L0 12l5.41 8.11c.36.53.9.89 1.59.89h15c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H7.07L2.4 12l4.66-7H22v14zm-11.59-2L14 13.41 17.59 17 19 15.59 15.41 12 19 8.41 17.59 7 14 10.59 10.41 7 9 8.41 12.59 12 9 15.59z"/></svg>
          </div>
          退格
        </button>
        <button
          @click="clear"
          :disabled="modelValue.toString().length === 0"
          class="group text-[10px] font-black opacity-40 hover:text-rose-500 disabled:opacity-20 transition-all uppercase tracking-[0.2em] flex items-center gap-2"
        >
          <div class="w-6 h-6 rounded-full bg-slate-100 dark:bg-slate-800 group-hover:bg-rose-100 dark:group-hover:bg-rose-900/30 flex items-center justify-center transition-colors">
            <svg viewBox="0 0 24 24" class="w-3 h-3 fill-current"><path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/></svg>
          </div>
          清空
        </button>
      </div>
    </div>

    <!-- Rotary Dial Container -->
    <div class="relative flex justify-center py-4 mb-4">
      <!-- Progress Ring -->
      <svg class="absolute w-80 h-80 -rotate-90 pointer-events-none" viewBox="0 0 100 100">
        <circle cx="50" cy="50" r="48" fill="none" stroke="currentColor" stroke-width="1" class="text-slate-100 dark:text-slate-800" />
        <circle
          v-if="isDragging && maxRotationForCurrentHole > 0"
          cx="50" cy="50" r="48" fill="none" stroke="currentColor" stroke-width="2" class="text-emerald-400 transition-all duration-75"
          :stroke-dasharray="2 * Math.PI * 48"
          :stroke-dashoffset="2 * Math.PI * 48 * (1 - currentRotation / maxRotationForCurrentHole)"
        />
      </svg>

      <div
        ref="dialRef"
        class="relative w-72 h-72 rounded-full bg-slate-100 dark:bg-slate-800 border-4 border-slate-200 dark:border-slate-700 shadow-lg flex items-center justify-center transition-transform duration-75 touch-none z-10"
        :style="{ transform: `rotate(${currentRotation}deg)`, cursor: isDragging ? 'grabbing' : 'grab' }"
        @pointerdown="onPointerDown"
      >
        <!-- Dial Plate with Holes -->
        <div class="absolute inset-4 rounded-full bg-white dark:bg-slate-900 shadow-inner flex items-center justify-center border border-slate-100 dark:border-slate-800">
          <div class="w-24 h-24 rounded-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex flex-col items-center justify-center shadow-sm p-2 text-center">
             <div v-if="!isDragging && !isRotatingBack" class="text-[10px] font-black opacity-40 leading-tight">
               按住数字<br/>顺时针拨到底
             </div>
             <div v-else-if="isDragging" class="text-xs font-black text-emerald-500">
               {{ maxRotationForCurrentHole > 0 ? Math.round((currentRotation / maxRotationForCurrentHole) * 100) : 0 }}%
             </div>
             <div v-else class="text-[10px] font-black text-amber-400 uppercase">
               Returning...
             </div>
          </div>
        </div>

        <!-- Numbers and Holes -->
        <div v-for="(num, index) in numbers" :key="num" class="absolute w-12 h-12 flex items-center justify-center" :style="getHoleStyle(index)">
          <div
            class="w-10 h-10 rounded-full shadow-inner border transition-all duration-200 flex items-center justify-center font-mono font-black text-lg pointer-events-none"
            :class="[ activeHoleIndex === index ? 'bg-emerald-500 border-emerald-400 text-white scale-110 shadow-lg shadow-emerald-500/40' : 'bg-slate-200 dark:bg-slate-700 border-slate-300 dark:border-slate-600 opacity-80' ]"
          >
            {{ num }}
          </div>
        </div>
      </div>

      <!-- The Stopper -->
      <div class="absolute bottom-12 right-12 w-6 h-10 bg-slate-800 dark:bg-slate-950 rounded-lg shadow-md z-10 border-r-4 border-slate-600 dark:border-slate-800" style="transform: rotate(-30deg)">
        <div class="absolute top-1 left-1 right-1 h-2 bg-slate-700 dark:bg-slate-900 rounded"></div>
      </div>
    </div>

    <!-- Call Action: Refined footer-style button -->
    <div class="mt-auto h-24 flex flex-col items-center justify-center border-t border-slate-50 dark:border-slate-800/50 pt-6">
      <Transition name="ns-fade">
        <div v-if="modelValue.toString().length >= maxDigits" class="w-full">
          <button
            @click="onCall"
            class="group w-full py-4 bg-gradient-to-r from-emerald-500 via-emerald-400 to-teal-500 text-white rounded-[1.5rem] font-black text-lg shadow-[0_12px_24px_-8px_rgba(16,185,129,0.5)] hover:shadow-[0_20px_40px_-12px_rgba(16,185,129,0.6)] hover:-translate-y-1 active:scale-[0.98] transition-all duration-300 flex items-center justify-center gap-4 overflow-hidden relative"
          >
            <div class="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
            <div class="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center group-hover:bg-white/30 transition-colors">
              <svg viewBox="0 0 24 24" class="w-6 h-6 fill-current animate-pulse"><path d="M6.62 10.79c1.44 2.53 3.7 4.59 6.23 6.03l2.2-2.2c.27-.27.67-.36 1.02-.26 1.12.32 2.33.5 3.57.5.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.18 2.45.5 3.57.1.35.01.74-.26 1.02l-2.2 2.2z"/></svg>
            </div>
            <span class="tracking-[0.2em]">立即呼叫 (+86)</span>
          </button>
        </div>
        <div v-else class="flex flex-col items-center gap-2 text-left">
          <div class="flex items-center gap-1.5">
            <div v-for="i in 3" :key="i" class="w-1 h-1 bg-slate-200 dark:bg-slate-700 rounded-full animate-bounce" :style="{ animationDelay: `${i * 0.1}s` }"></div>
          </div>
          <span class="text-[9px] font-black opacity-30 uppercase tracking-[0.5em]">
            正在分配线路通道...
          </span>
        </div>
      </Transition>
    </div>

    <!-- Success Overlay -->
    <Transition name="ns-fade">
      <div v-if="showSuccess" class="absolute inset-0 z-50 flex flex-col items-center justify-center bg-white/95 dark:bg-slate-900/95 backdrop-blur-sm p-8 text-center">
        <div class="text-7xl mb-6 animate-bounce">📞</div>
        <h4 class="text-2xl font-black mb-2">正在建立连接...</h4>
        <p class="opacity-60 mb-8 text-sm text-center">信号较弱，请保持拨号盘旋转状态以<br/>维持微弱的通信链路。</p>
        <button @click="showSuccess = false" class="px-8 py-3 bg-rose-500 text-white rounded-full font-black text-sm hover:bg-rose-600 transition-all shadow-lg shadow-rose-500/20 active:scale-95">
          紧急挂断
        </button>
      </div>
    </Transition>

    <!-- Status Bar (Simplified) -->
    <div class="flex items-center justify-center gap-3 text-[9px] font-black uppercase tracking-tighter opacity-30">
      <span :class="{ 'text-amber-500 opacity-100': isDragging }">Dragging</span>
      <span class="opacity-20">|</span>
      <span :class="{ 'text-emerald-500 opacity-100': isRotatingBack }">Returning</span>
      <span class="opacity-20">|</span>
      <span :class="{ 'text-slate-800 dark:text-white opacity-100': !isDragging && !isRotatingBack }">Ready</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onUnmounted } from "vue";

defineOptions({ name: "NsRotaryDial" });

const props = withDefaults(
  defineProps<{
    modelValue?: string | number;
    disabled?: boolean;
    title?: string;
    friction?: number;
    springBack?: boolean;
    maxDigits?: number;
  }>(),
  {
    modelValue: "",
    disabled: false,
    title: "虚拟拨号系统 v1.0",
    friction: 0.5,
    springBack: true,
    maxDigits: 11
  }
);

const emit = defineEmits<{
  (event: "update:modelValue", value: string): void;
  (event: "input", digit: number): void;
  (event: "fail", reason: string): void;
  (event: "call", value: string): void;
}>();

const dialRef = ref<HTMLElement | null>(null);
const currentRotation = ref(0);
const isDragging = ref(false);
const isRotatingBack = ref(false);
const showSuccess = ref(false);
const numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 0];
const STOPPER_ANGLE = 150; 
const HOLE_ANGLES = [40, 70, 100, 130, 160, 190, 220, 250, 280, 310];

let lastMouseAngle = 0;
let maxRotationForCurrentHole = 0;
let accumulatedRotation = 0;
let activeHoleIndex = -1;

function getHoleStyle(index: number) {
  const baseAngle = HOLE_ANGLES[index];
  return { transform: `rotate(${baseAngle}deg) translateY(-100px) rotate(${-baseAngle}deg)` };
}

function getAngle(x: number, y: number) {
  if (!dialRef.value) return 0;
  const rect = dialRef.value.getBoundingClientRect();
  const centerX = rect.left + rect.width / 2;
  const centerY = rect.top + rect.height / 2;
  const rad = Math.atan2(y - centerY, x - centerX);
  let deg = (rad * 180) / Math.PI + 90;
  return (deg + 360) % 360;
}

function onPointerDown(e: PointerEvent) {
  if (props.disabled || isRotatingBack.value) return;
  const mouseAngle = getAngle(e.clientX, e.clientY);
  const clickedHoleIndex = numbers.findIndex((_, i) => {
    const holeBaseAngle = HOLE_ANGLES[i];
    const currentHolePos = (holeBaseAngle + currentRotation.value) % 360;
    let diff = Math.abs(mouseAngle - currentHolePos);
    if (diff > 180) diff = 360 - diff;
    return diff < 25;
  });
  if (clickedHoleIndex === -1) return;
  activeHoleIndex = clickedHoleIndex;
  isDragging.value = true;
  lastMouseAngle = mouseAngle;
  accumulatedRotation = currentRotation.value;
  const holeBaseAngle = HOLE_ANGLES[activeHoleIndex];
  maxRotationForCurrentHole = (STOPPER_ANGLE - holeBaseAngle + 360) % 360;
  if (maxRotationForCurrentHole < 20) maxRotationForCurrentHole += 360;
  window.addEventListener("pointermove", onPointerMove);
  window.addEventListener("pointerup", onPointerUp);
}

function onPointerMove(e: PointerEvent) {
  if (!isDragging.value) return;
  const mouseAngle = getAngle(e.clientX, e.clientY);
  let delta = mouseAngle - lastMouseAngle;
  if (delta > 180) delta -= 360;
  if (delta < -180) delta += 360;
  accumulatedRotation += delta;
  lastMouseAngle = mouseAngle;
  if (accumulatedRotation < 0) accumulatedRotation = 0;
  if (accumulatedRotation > maxRotationForCurrentHole) {
    accumulatedRotation = maxRotationForCurrentHole;
    if ("vibrate" in navigator) navigator.vibrate(5);
  }
  currentRotation.value = accumulatedRotation;
}

function onPointerUp() {
  if (!isDragging.value) return;
  isDragging.value = false;
  const reachedStopper = Math.abs(currentRotation.value - maxRotationForCurrentHole) < 10;
  window.removeEventListener("pointermove", onPointerMove);
  window.removeEventListener("pointerup", onPointerUp);
  if (reachedStopper && activeHoleIndex !== -1) {
    const digit = numbers[activeHoleIndex];
    if (props.modelValue.toString().length < props.maxDigits) {
      emit("input", digit);
      const newValue = props.modelValue.toString() + digit.toString();
      emit("update:modelValue", newValue);
    } else {
      emit("fail", "容量已满");
    }
  } else if (props.springBack && currentRotation.value > 10) {
    emit("fail", "回弹：未拨到底");
  }
  activeHoleIndex = -1;
  rotateBack();
}

function rotateBack() {
  isRotatingBack.value = true;
  const startRot = currentRotation.value;
  const duration = Math.max(300, startRot * (2 + props.friction * 10)); 
  const startTime = performance.now();
  function animate(currentTime: number) {
    const elapsed = currentTime - startTime;
    const progress = Math.min(elapsed / duration, 1);
    const ease = 1 - Math.pow(1 - progress, 4);
    currentRotation.value = startRot * (1 - ease);
    if (progress < 1) requestAnimationFrame(animate);
    else { currentRotation.value = 0; isRotatingBack.value = false; }
  }
  requestAnimationFrame(animate);
}

function backspace() {
  const current = props.modelValue.toString();
  if (current.length > 0) emit("update:modelValue", current.slice(0, -1));
}

function clear() { emit("update:modelValue", ""); }
function onCall() { emit("call", props.modelValue.toString()); showSuccess.value = true; }

onUnmounted(() => {
  window.removeEventListener("pointermove", onPointerMove);
  window.removeEventListener("pointerup", onPointerUp);
});
</script>

<style scoped>
.ns-fade-enter-active, .ns-fade-leave-active {
  transition: opacity 0.4s ease, transform 0.4s cubic-bezier(0.16, 1, 0.3, 1);
}
.ns-fade-enter-from, .ns-fade-leave-to { opacity: 0; transform: scale(0.95); }
@keyframes zoom-in {
  from { opacity: 0; transform: scale(0.5) translateY(10px); }
  to { opacity: 1; transform: scale(1) translateY(0); }
}
.animate-in { animation: zoom-in 0.3s cubic-bezier(0.34, 1.56, 0.64, 1) forwards; }
</style>

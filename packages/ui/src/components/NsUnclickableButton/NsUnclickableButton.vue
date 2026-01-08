<template>
  <div
    ref="containerRef"
    class="nsui nsui-unclickable-container relative flex items-center justify-center overflow-hidden border-2 border-dashed border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/20 rounded-[2.5rem] transition-all duration-700"
    :class="{ 'border-rose-400/50 bg-rose-50/10 dark:bg-rose-950/20 shadow-inner': isPanicking }"
    :style="{ width: `${width}px`, height: `${height}px` }"
  >
    <!-- Zone Label -->
    <div 
      class="absolute top-4 left-4 text-[10px] font-black uppercase tracking-[0.2em] opacity-20 pointer-events-none select-none transition-opacity duration-500"
      :class="{ 'opacity-100 text-rose-500': isPanicking }"
    >
      {{ isPanicking ? 'Warning: Panic Zone Active' : 'Neutral Territory' }}
    </div>

    <button
      ref="buttonRef"
      class="nsui-unclickable-btn absolute px-8 py-3 bg-white dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 rounded-2xl font-black text-slate-700 dark:text-slate-200 shadow-xl transition-all duration-200 pointer-events-auto active:scale-95 select-none whitespace-nowrap"
      :class="[
        isPanicking ? 'ns-shiver shadow-rose-500/20 border-rose-500 dark:border-rose-500 text-rose-600 dark:text-rose-400 scale-95' : '',
        isDodging ? 'ns-glitch' : ''
      ]"
      type="button"
      :disabled="disabled"
      :style="{
        left: `${posX}px`,
        top: `${posY}px`,
        transform: `translate(-50%, -50%) rotate(${rotation}deg)`
      }"
      @click="onClick"
      @pointerenter="onDirectContact"
    >
      <div class="flex items-center gap-2">
        <span v-if="isPanicking" class="animate-ping">😰</span>
        <slot>{{ label }}</slot>
      </div>
    </button>

    <!-- Success Message -->
    <Transition name="ns-fade">
      <div v-if="isCaught" class="absolute inset-0 z-10 flex flex-col items-center justify-center bg-emerald-500/90 backdrop-blur-sm text-white p-6 text-center">
        <div class="text-6xl mb-4 animate-bounce">🏆</div>
        <div class="text-2xl font-black mb-2">天选之子！</div>
        <p class="text-sm opacity-80">你居然真的抓住了这个害羞的按钮。</p>
      </div>
    </Transition>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from "vue";

defineOptions({ name: "NsUnclickableButton" });

const props = withDefaults(
  defineProps<{
    label?: string;
    disabled?: boolean;
    panicRadius?: number; // Distance at which it starts running
    speed?: number; // 0-1, how fast it dodges
    width?: number;
    height?: number;
  }>(),
  {
    label: "立即领取礼包",
    disabled: false,
    panicRadius: 120,
    speed: 0.6,
    width: 320,
    height: 160
  }
);

const emit = defineEmits<{
  (event: "click", e: MouseEvent): void;
  (event: "caught"): void;
  (event: "panic", isPanicking: boolean): void;
}>();

const containerRef = ref<HTMLElement | null>(null);
const buttonRef = ref<HTMLElement | null>(null);

const posX = ref(props.width / 2);
const posY = ref(props.height / 2);
const rotation = ref(0);
const isPanicking = ref(false);

function setPanicking(val: boolean) {
  if (isPanicking.value !== val) {
    isPanicking.value = val;
    emit("panic", val);
  }
}
const isDodging = ref(false);
const isCaught = ref(false);

function onClick(e: MouseEvent) {
  if (props.disabled || isCaught.value) return;
  isCaught.value = true;
  emit("click", e);
  setTimeout(() => {
    isCaught.value = false;
    resetPosition();
  }, 2500);
}

function resetPosition() {
  posX.value = props.width / 2;
  posY.value = props.height / 2;
  rotation.value = 0;
}

function onDirectContact() {
  dodge(true);
}

function dodge(aggressive = false) {
  if (props.disabled || isCaught.value) return;
  
  isDodging.value = true;
  emit("caught");
  
  const margin = 50;
  posX.value = margin + Math.random() * (props.width - margin * 2);
  posY.value = margin + Math.random() * (props.height - margin * 2);
  rotation.value = (Math.random() - 0.5) * 40;

  setTimeout(() => {
    isDodging.value = false;
  }, 300);
}

function handleGlobalMouseMove(e: MouseEvent) {
  if (!containerRef.value || props.disabled || isCaught.value) return;

  const rect = containerRef.value.getBoundingClientRect();
  const mouseX = e.clientX - rect.left;
  const mouseY = e.clientY - rect.top;

  if (mouseX < 0 || mouseX > rect.width || mouseY < 0 || mouseY > rect.height) {
    setPanicking(false);
    return;
  }

  const dx = mouseX - posX.value;
  const dy = mouseY - posY.value;
  const distance = Math.sqrt(dx * dx + dy * dy);

  if (distance < props.panicRadius) {
    setPanicking(true);
    
    const force = (props.panicRadius - distance) / props.panicRadius;
    const moveX = (dx / distance) * -60 * force * props.speed;
    const moveY = (dy / distance) * -60 * force * props.speed;

    posX.value += moveX;
    posY.value += moveY;
    
    rotation.value = (Math.random() - 0.5) * 15 * force;

    const margin = 40;
    if (posX.value < margin) posX.value = margin;
    if (posX.value > props.width - margin) posX.value = props.width - margin;
    if (posY.value < margin) posY.value = margin;
    if (posY.value > props.height - margin) posY.value = props.height - margin;

    if (distance < 50) {
      dodge(true);
    }
  } else {
    setPanicking(false);
  }
}

onMounted(() => {
  window.addEventListener("mousemove", handleGlobalMouseMove);
});

onUnmounted(() => {
  window.removeEventListener("mousemove", handleGlobalMouseMove);
});
</script>

<style scoped>
@keyframes ns-shiver {
  0% { transform: translate(-50%, -50%) rotate(0deg); }
  25% { transform: translate(-50.5%, -49.5%) rotate(-1deg); }
  50% { transform: translate(-49.5%, -50.5%) rotate(1.5deg); }
  75% { transform: translate(-50.5%, -50.5%) rotate(-0.5deg); }
  100% { transform: translate(-50%, -50%) rotate(0deg); }
}

.ns-shiver {
  animation: ns-shiver 0.1s infinite;
}

@keyframes ns-glitch-anim {
  0% { transform: translate(-50%, -50%) scale(1); filter: hue-rotate(0deg); }
  20% { transform: translate(-52%, -48%) scale(1.1); filter: hue-rotate(90deg); }
  40% { transform: translate(-48%, -52%) scale(0.9); filter: hue-rotate(180deg); }
  60% { transform: translate(-51%, -51%) scale(1.05); filter: hue-rotate(270deg); }
  100% { transform: translate(-50%, -50%) scale(1); filter: hue-rotate(360deg); }
}

.ns-glitch {
  animation: ns-glitch-anim 0.2s cubic-bezier(0.16, 1, 0.3, 1);
}

.ns-fade-enter-active,
.ns-fade-leave-active {
  transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
}

.ns-fade-enter-from,
.ns-fade-leave-to {
  opacity: 0;
  transform: scale(1.1);
}

.nsui-unclickable-btn {
  transition: left 0.1s linear, top 0.1s linear, transform 0.2s cubic-bezier(0.34, 1.56, 0.64, 1), background-color 0.3s ease, border-color 0.3s ease;
  will-change: left, top, transform;
}
</style>

<template>
  <div
    class="nsui nsui-card relative inline-flex flex-col gap-8 p-10 min-w-[520px] overflow-hidden rounded-[40px] bg-white dark:bg-slate-900 border-2 border-amber-100 dark:border-amber-900/30 shadow-2xl shadow-amber-500/10 select-none"
    :class="{ 'opacity-60 grayscale-[0.5]': disabled }"
  >
    <!-- Thanks Overlay -->
    <Transition name="ns-fade">
      <div
        v-if="showThanks"
        class="absolute inset-0 z-50 flex flex-col items-center justify-center bg-gradient-to-br from-amber-400 to-amber-600 p-8 text-center text-white"
      >
        <div class="text-8xl mb-6 animate-bounce filter drop-shadow-xl">👑</div>
        <h4 class="text-3xl font-black mb-4 drop-shadow-md">英雄所见略同！</h4>
        <p class="text-amber-50 mb-10 text-lg font-medium leading-relaxed drop-shadow-sm">
          我也觉得我棒极了。<br />您的品味令人赞叹（因为和我一样）。
        </p>
        <button
          @click="showThanks = false"
          class="px-10 py-4 bg-white text-amber-600 rounded-2xl font-black text-base hover:bg-amber-50 transition-all shadow-xl active:scale-95 hover:scale-105"
        >
          深有同感，再夸一次
        </button>
      </div>
    </Transition>

    <!-- Header -->
    <div class="flex items-center justify-between">
      <div class="flex flex-col gap-1">
        <h3 class="text-2xl font-black tracking-tighter text-slate-900 dark:text-white uppercase">
          {{ title }}
        </h3>
        <p class="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400">
          Perfect Being Detector v2.0
        </p>
      </div>
      <div class="flex items-center gap-2 px-3 py-1 rounded-full border bg-amber-50 border-amber-100">
        <div class="w-2 h-2 rounded-full bg-amber-500 animate-ping"></div>
        <span class="text-[10px] font-black text-amber-600">DISSENT: BLOCKED</span>
      </div>
    </div>

    <!-- Star Track Container (The moving wrapper) -->
    <div 
      class="relative py-2" 
      @pointermove="onTrackMove" 
      @pointerleave="onTrackLeave"
    >
      <div
        ref="trackEl"
        class="relative flex items-center justify-between p-4 rounded-[24px] border-2 border-slate-100 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 transition-all duration-300 ease-out will-change-transform"
        :style="{ transform: `translateX(${offsetX}px)` }"
      >
        <button
          v-for="i in 5"
          :key="i"
          ref="starRefs"
          class="group relative w-14 h-14 flex items-center justify-center transition-all duration-300 outline-none z-10"
          type="button"
          :disabled="disabled"
          @click="onClick(i)"
        >
          <svg
            viewBox="0 0 24 24"
            class="w-10 h-10 transition-all duration-500"
            :class="[
              isHovering 
                ? 'fill-amber-400 drop-shadow-[0_4px_12px_rgba(251,191,36,0.6)] scale-110'
                : 'fill-slate-200 dark:fill-slate-700 scale-100'
            ]"
          >
            <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
          </svg>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";

defineOptions({ name: "NsNarcissisticRate" });

const props = withDefaults(
  defineProps<{
    modelValue?: number;
    fixedScore?: number;
    disabled?: boolean;
    title?: string;
    ariaLabel?: string;
  }>(),
  {
    modelValue: undefined,
    fixedScore: 5,
    disabled: false,
    title: "您对我的表现打几分？",
    ariaLabel: "Narcissistic rating"
  }
);

const emit = defineEmits<{
  (event: "update:modelValue", value: number): void;
  (event: "change", value: number, meta: { attempted: number }): void;
}>();

const trackEl = ref<HTMLElement | null>(null);
const starRefs = ref<HTMLElement[]>([]);
const showThanks = ref(false);
const offsetX = ref(0);
const isHovering = ref(false);

function onTrackMove(e: PointerEvent) {
  if (props.disabled || !trackEl.value) return;

  isHovering.value = true;
  const trackRect = trackEl.value.getBoundingClientRect();
  
  if (starRefs.value.length === 5) {
    const star5 = starRefs.value[4]; 
    if (star5) {
      const containerRect = (e.currentTarget as HTMLElement).getBoundingClientRect();
      const mouseRelativeX = e.clientX - containerRect.left;
      
      const star5Offset = star5.offsetLeft + (star5.offsetWidth / 2);
      const targetX = mouseRelativeX - star5Offset;
      
      offsetX.value = targetX;
    }
  }
}

function onTrackLeave() {
  isHovering.value = false;
  offsetX.value = 0;
}

function onClick(val: number) {
  if (props.disabled) return;
  const finalVal = 5;
  emit("update:modelValue", finalVal);
  emit("change", finalVal, { attempted: val });
  showThanks.value = true;
}
</script>

<style scoped>
.ns-fade-enter-active,
.ns-fade-leave-active {
  transition: all 0.5s cubic-bezier(0.16, 1, 0.3, 1);
}

.ns-fade-enter-from,
.ns-fade-leave-to {
  opacity: 0;
  transform: scale(0.95) translateY(10px);
}
</style>

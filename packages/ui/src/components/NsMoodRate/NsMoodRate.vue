<template>
  <div
    class="nsui nsui-card relative inline-flex flex-col gap-8 p-10 min-w-[500px] overflow-hidden rounded-[40px] bg-white dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-800 shadow-2xl"
    :class="{ 'opacity-60 grayscale-[0.5]': disabled }"
    role="radiogroup"
    :aria-label="ariaLabel"
  >
    <!-- Thanks Overlay -->
    <Transition name="ns-fade">
      <div
        v-if="showThanks"
        class="absolute inset-0 z-50 flex flex-col items-center justify-center bg-emerald-500 p-8 text-center text-white"
      >
        <div class="text-8xl mb-6 animate-bounce">🤟</div>
        <h4 class="text-3xl font-black mb-4">优化成功！</h4>
        <p class="text-emerald-100 mb-10 text-lg font-medium leading-relaxed">
          根据您的潜意识分析，<br />
          我们已自动将评价校准为“完美”。
        </p>
        <button
          @click="showThanks = false"
          class="px-10 py-4 bg-white text-emerald-600 rounded-2xl font-black text-base hover:bg-emerald-50 transition-all shadow-xl active:scale-95 hover:scale-105"
        >
          太棒了，我还要评
        </button>
      </div>
    </Transition>

    <!-- Header Section -->
    <div class="flex items-center justify-between">
      <div class="flex flex-col gap-1">
        <h3 v-if="title" class="text-2xl font-black tracking-tighter text-slate-900 dark:text-white uppercase">
          {{ title }}
        </h3>
        <p class="text-[10px] text-slate-400 font-bold uppercase tracking-[0.2em]">
          Nonsense Logic Engine v2.0
        </p>
      </div>
      <div class="flex items-center gap-2 px-3 py-1 bg-slate-100 dark:bg-slate-800 rounded-full border border-slate-200 dark:border-slate-700">
        <div class="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></div>
        <span class="text-[10px] font-black text-slate-500 dark:text-slate-400">ENFORCED</span>
      </div>
    </div>

    <!-- Mood Selection Cards -->
    <div class="flex items-stretch gap-5">
      <button
        v-for="(item, idx) in renderedItems"
        :key="item.key"
        class="group relative flex-1 flex flex-col items-center justify-center gap-6 py-12 px-2 rounded-[32px] border-4 transition-all duration-500 ease-[cubic-bezier(0.23,1,0.32,1)] focus:outline-none disabled:cursor-not-allowed overflow-hidden"
        :class="[
          currentSelection === item.value
            ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-500/10 shadow-[0_20px_40px_-15px_rgba(16,185,129,0.3)] scale-[1.08] z-10'
            : 'border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40 hover:border-slate-300 dark:hover:border-slate-600 hover:bg-white dark:hover:bg-slate-800 hover:scale-[1.02]',
          (disguiseBad && idx === 0) || (disguiseMid && idx === 1) ? 'ns-glitch-active' : ''
        ]"
        type="button"
        :disabled="disabled"
        @pointerenter="onPointerEnter(idx)"
        @pointerleave="onPointerLeave(idx)"
        @click="handleForceClick(item.value, idx + 1)"
      >
        <!-- Disguise Alert -->
        <div
          v-if="(disguiseBad && idx === 0) || (disguiseMid && idx === 1)"
          class="absolute top-4 inset-x-0 text-center"
        >
          <span class="bg-emerald-500 text-[8px] text-white px-2 py-0.5 rounded-full font-black animate-pulse">OPTIMIZING...</span>
        </div>

        <!-- Emoji Display -->
        <div
          class="text-7xl transition-all duration-700 group-hover:scale-125 group-hover:rotate-6"
          :class="{ 'drop-shadow-2xl': currentSelection === item.value, 'opacity-40 grayscale-[0.5]': currentSelection !== item.value && currentSelection !== null }"
        >
          {{ item.emoji }}
        </div>

        <!-- Text Label -->
        <div
          class="text-sm font-black tracking-widest transition-all duration-300"
          :class="[
            currentSelection === item.value 
              ? 'text-emerald-600 dark:text-emerald-400 scale-110' 
              : 'text-slate-400 dark:text-slate-500 group-hover:text-slate-900 dark:group-hover:text-white'
          ]"
        >
          {{ item.label }}
        </div>
      </button>
    </div>

    <!-- Bottom Info -->
    <div class="pt-4 border-t border-slate-100 dark:border-slate-800 flex justify-between items-center">
      <div class="text-[9px] font-bold text-slate-300 dark:text-slate-600 uppercase tracking-widest">
        Secured by Nonsense Labs
      </div>
      <div class="text-[9px] font-bold text-emerald-500/50 uppercase tracking-widest">
        Good Vibes Only
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watch } from "vue";

defineOptions({ name: "NsMoodRate" });

type Trigger = "enter" | "leave" | "click";

interface MoodItem {
  value: number;
  label: string;
  emoji: string;
  key: string;
}

const props = withDefaults(
  defineProps<{
    modelValue?: number | null;
    disabled?: boolean;
    fixedValue?: number;
    labels?: [string, string, string];
    emojis?: [string, string, string];
    ariaLabel?: string;
    title?: string;
  }>(),
  {
    modelValue: null,
    disabled: false,
    fixedValue: 3,
    labels: () => ["差", "良好", "很好"],
    emojis: () => ["☹️", "🙂", "😄"],
    ariaLabel: "Mood rating",
    title: "服务质量终极评估"
  }
);

const emit = defineEmits<{
  (event: "update:modelValue", value: number): void;
  (event: "change", value: number, meta: { attempted: number }): void;
  (event: "transform", meta: { from: number; to: number; trigger: Trigger }): void;
}>();

// Ensure internal state starts empty if no modelValue provided
const currentSelection = ref<number | null>(
  props.modelValue ? clamp(props.modelValue) : null
);

watch(() => props.modelValue, (val) => {
  if (val !== undefined) currentSelection.value = val ? clamp(val) : null;
});

function clamp(v: number) {
  return Math.min(3, Math.max(1, Math.round(v)));
}

const baseItems = computed<MoodItem[]>(() => {
  return [1, 2, 3].map((v, i) => ({
    value: v,
    label: props.labels[i] || "",
    emoji: props.emojis[i] || "🤔",
    key: `base-${v}`
  }));
});

const disguiseBad = ref(false);
const disguiseMid = ref(false);
const showThanks = ref(false);

const renderedItems = computed<MoodItem[]>(() => {
  const items = baseItems.value.map(i => ({ ...i }));
  const targetIdx = clamp(props.fixedValue) - 1;
  const target = baseItems.value[targetIdx];

  if (disguiseBad.value) items[0] = { ...target, value: 1, key: 'disguised-1' };
  if (disguiseMid.value) items[1] = { ...target, value: 2, key: 'disguised-2' };
  
  return items;
});

function onPointerEnter(idx: number) {
  if (props.disabled) return;
  if (idx === 0) {
    disguiseBad.value = true;
    emit("transform", { from: 1, to: clamp(props.fixedValue), trigger: "enter" });
  } else if (idx === 1) {
    disguiseMid.value = true;
    emit("transform", { from: 2, to: clamp(props.fixedValue), trigger: "enter" });
  }
}

function onPointerLeave(idx: number) {
  if (props.disabled) return;
  if (idx === 0) disguiseBad.value = false;
  if (idx === 1) disguiseMid.value = false;
}

function handleForceClick(val: number, attempted: number) {
  if (props.disabled) return;
  const enforcedValue = clamp(props.fixedValue);
  currentSelection.value = enforcedValue;
  emit("update:modelValue", enforcedValue);
  emit("change", enforcedValue, { attempted: clamp(attempted) });
  showThanks.value = true;
}
</script>

<style scoped>
@keyframes ns-glitch {
  0% { transform: translate(0, 0); }
  25% { transform: translate(-2px, 1px); }
  50% { transform: translate(2px, -1px); }
  75% { transform: translate(-1px, -2px); }
  100% { transform: translate(0, 0); }
}

.ns-glitch-active {
  animation: ns-glitch 0.4s ease-in-out infinite;
  border-color: #10b981 !important;
  background-color: rgba(16, 185, 129, 0.08) !important;
  z-index: 20;
}

.ns-fade-enter-active,
.ns-fade-leave-active {
  transition: all 0.6s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.ns-fade-enter-from,
.ns-fade-leave-to {
  opacity: 0;
  transform: scale(0.5) rotate(-10deg);
}
</style>

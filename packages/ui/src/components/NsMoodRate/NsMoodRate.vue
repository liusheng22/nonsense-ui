<template>
  <div
    class="nsui nsui-card relative inline-flex flex-col gap-6 p-6 min-w-[420px] overflow-hidden"
    :class="{ 'opacity-60 grayscale-[0.5]': disabled }"
    role="radiogroup"
    :aria-label="ariaLabel"
  >
    <!-- Thanks Overlay: Passive aggressive gratitude -->
    <Transition name="ns-fade">
      <div
        v-if="showThanks"
        class="absolute inset-0 z-50 flex flex-col items-center justify-center bg-white/95 dark:bg-slate-900/95 backdrop-blur-sm p-8 text-center"
      >
        <div class="text-6xl mb-4 animate-bounce">💖</div>
        <h4 class="text-2xl font-black mb-2">感谢您的“自愿”好评！</h4>
        <p class="opacity-60 mb-6 text-sm">您的意见对我们非常重要，<br />虽然我们并没有打算采纳。</p>
        <button
          @click="showThanks = false"
          class="px-6 py-2 bg-emerald-500 text-white rounded-full font-bold text-sm hover:bg-emerald-600 transition-colors shadow-lg shadow-emerald-500/20 active:scale-95"
        >
          太棒了，再投一次
        </button>
      </div>
    </Transition>

    <!-- Header: Makes it look like a real feedback survey -->
    <div class="flex flex-col gap-1.5 px-1 text-left">
      <h3 v-if="title" class="text-xl font-bold tracking-tight">
        {{ title }}
      </h3>
      <p class="text-sm opacity-40 font-medium">您的反馈对我们非常重要（或者并不重要）</p>
    </div>

    <!-- Mood Buttons: Polished UI with hidden nonsense -->
    <div class="flex items-center gap-4">
      <button
        v-for="(item, idx) in renderedItems"
        :key="item.key"
        class="group relative flex-1 flex flex-col items-center justify-center gap-4 py-8 px-2 rounded-3xl border-2 transition-all duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-emerald-500/10 disabled:cursor-not-allowed disabled:opacity-40 overflow-hidden"
        :class="[
          selectedValue === item.value
            ? 'border-emerald-500 bg-emerald-500/5 shadow-[0_8px_20px_-8px_rgba(16,185,129,0.3)]'
            : 'border-slate-50 dark:border-slate-800 bg-slate-50/30 dark:bg-slate-900/30 hover:border-slate-200 dark:hover:border-slate-700 hover:bg-white dark:hover:bg-slate-800 hover:scale-[1.02] hover:shadow-sm',
          (disguiseBad && idx === 0) || (disguiseMid && idx === 1) ? 'ns-glitch-active' : ''
        ]"
        type="button"
        :disabled="disabled"
        role="radio"
        :aria-checked="selectedValue === item.value"
        :data-value="item.value"
        @pointerenter="onPointerEnter(idx)"
        @pointerleave="onPointerLeave(idx)"
        @pointerdown="onPointerDown(idx)"
        @click="onClick(item.value, idx + 1)"
      >
        <!-- Nonsense Indicator -->
        <div
          v-if="(disguiseBad && idx === 0) || (disguiseMid && idx === 1)"
          class="absolute top-3 right-3 w-1.5 h-1.5 bg-emerald-500 rounded-full animate-ping"
        ></div>

        <!-- Emoji: Large and expressive -->
        <div
          class="text-5xl transition-all duration-500 group-hover:scale-110 group-active:scale-90"
          aria-hidden="true"
        >
          {{ item.emoji }}
        </div>

        <!-- Label: Clean typography -->
        <div
          class="text-xs font-black tracking-[0.1em] transition-colors duration-300 uppercase"
          :class="labelClass(item.value, selectedValue === item.value)"
        >
          {{ item.label }}
        </div>
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from "vue";

defineOptions({ name: "NsMoodRate" });

type Trigger = "enter" | "leave" | "click";

type MoodItem = {
  value: number;
  label: string;
  emoji: string;
  key: string;
};

const props = withDefaults(
  defineProps<{
    modelValue?: number;
    disabled?: boolean;
    fixedValue?: number;
    labels?: [string, string, string];
    emojis?: [string, string, string];
    ariaLabel?: string;
    title?: string;
  }>(),
  {
    modelValue: undefined,
    disabled: false,
    fixedValue: 3,
    labels: () => ["差", "良好", "很好"],
    emojis: () => ["☹️", "🙂", "😄"],
    ariaLabel: "Mood rating",
    title: "您对本次服务的评价如何？"
  }
);

const emit = defineEmits<{
  (event: "update:modelValue", value: number): void;
  (event: "change", value: number, meta: { attempted: number }): void;
  (event: "transform", meta: { from: number; to: number; trigger: Trigger }): void;
}>();

function clamp(value: number) {
  return Math.min(3, Math.max(1, Math.round(value)));
}

const baseItems = computed<MoodItem[]>(() => {
  const labels = props.labels;
  const emojis = props.emojis;
  return [1, 2, 3].map((value, i) => ({
    value,
    label: labels[i] ?? String(value),
    emoji: emojis[i] ?? "🙂",
    key: `${value}-${labels[i]}`
  }));
});

const fixedValue = computed(() => clamp(props.fixedValue));

const selectedValue = computed(() => {
  const current = props.modelValue;
  if (typeof current === "number" && Number.isFinite(current)) return clamp(current);
  return fixedValue.value;
});

const disguiseBad = ref(false);
const disguiseMid = ref(false);
const showThanks = ref(false);

function disguise(index: number, trigger: Trigger) {
  if (props.disabled) return;
  if (index === 0 && !disguiseBad.value) {
    disguiseBad.value = true;
    emit("transform", { from: 1, to: fixedValue.value, trigger });
  }
  if (index === 1 && !disguiseMid.value) {
    disguiseMid.value = true;
    emit("transform", { from: 2, to: fixedValue.value, trigger });
  }
}

const renderedItems = computed<MoodItem[]>(() => {
  const items = baseItems.value.slice();
  const fixed = baseItems.value[fixedValue.value - 1];
  if (fixed) {
    if (disguiseBad.value) items[0] = { ...fixed, value: 1, key: `disguised-1-${fixed.key}` };
    if (disguiseMid.value) items[1] = { ...fixed, value: 2, key: `disguised-2-${fixed.key}` };
  }
  return items;
});

function labelClass(value: number, isActive: boolean) {
  if (isActive) return "text-emerald-500";
  const v = clamp(value);
  if (v === 1) return "opacity-40 group-hover:text-red-500 group-hover:opacity-100";
  if (v === 2) return "opacity-40 group-hover:text-amber-500 group-hover:opacity-100";
  return "opacity-40 group-hover:text-emerald-500 group-hover:opacity-100";
}

function onPointerEnter(index: number) {
  if (props.disabled) return;
  if (index === 0) disguise(index, "enter");
  if (index === 1) {
    disguise(index, "enter");
  }
}

function onPointerLeave(index: number) {
  if (props.disabled) return;
  if (index === 0) disguiseBad.value = false;
  if (index === 1) {
    disguiseMid.value = false;
  }
}

function onPointerDown(index: number) {
  if (props.disabled) return;
  if (index === 1) {
    disguise(index, "click");
  }
}

function onClick(value: number, attempted: number) {
  if (props.disabled) return;
  const realValue = fixedValue.value;
  emit("update:modelValue", realValue);
  emit("change", realValue, { attempted: clamp(attempted) });
  if (attempted !== fixedValue.value) {
    emit("transform", { from: attempted, to: fixedValue.value, trigger: "click" });
  }
  showThanks.value = true;
}
</script>

<style scoped>
@keyframes ns-glitch {
  0% { transform: translate(0); }
  20% { transform: translate(-2px, 1px); }
  40% { transform: translate(-2px, -1px); }
  60% { transform: translate(2px, 1px); }
  80% { transform: translate(2px, -1px); }
  100% { transform: translate(0); }
}

.ns-glitch-active {
  animation: ns-glitch 0.2s ease-in-out infinite;
  border-color: #10b981 !important;
}

.group {
  backface-visibility: hidden;
  transform: translateZ(0);
}

.ns-fade-enter-active,
.ns-fade-leave-active {
  transition: opacity 0.4s ease, transform 0.4s cubic-bezier(0.16, 1, 0.3, 1);
}

.ns-fade-enter-from,
.ns-fade-leave-to {
  opacity: 0;
  transform: scale(0.95);
}
</style>

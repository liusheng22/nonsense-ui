<template>
  <div
    class="nsui nsui-card relative inline-flex flex-col gap-8 p-8 min-w-[420px] overflow-hidden select-none"
    :class="{ 'opacity-60 grayscale-[0.5]': disabled }"
  >
    <!-- Thanks Overlay: Consistent with NsMoodRate -->
    <Transition name="ns-fade">
      <div
        v-if="showThanks"
        class="absolute inset-0 z-50 flex flex-col items-center justify-center bg-white/95 dark:bg-slate-900/95 backdrop-blur-sm p-8 text-center"
      >
        <div class="text-6xl mb-4 animate-bounce">👑</div>
        <h4 class="text-2xl font-black mb-2">英雄所见略同！</h4>
        <p class="opacity-60 mb-6 text-sm">
          我也觉得我棒极了。<br />这份评价将被装裱起来挂在公司大厅。
        </p>
        <button
          @click="showThanks = false"
          class="px-8 py-2.5 bg-amber-500 text-white rounded-full font-bold text-sm hover:bg-amber-600 transition-all shadow-lg shadow-amber-500/20 active:scale-95"
        >
          深有同感，再夸一次
        </button>
      </div>
    </Transition>

    <!-- Header -->
    <div class="flex flex-col gap-1.5 px-1 text-left">
      <h3 class="text-xl font-bold tracking-tight">
        {{ title }}
      </h3>
      <p class="text-sm opacity-40 font-medium">请务必诚实地、不带偏见地评价（即五星）</p>
    </div>

    <!-- Star Track: The core interaction area -->
    <div class="flex flex-col items-center gap-6">
      <div
        ref="trackEl"
        class="relative flex items-center gap-3 p-4 bg-slate-50/50 dark:bg-slate-900/30 rounded-3xl border-2 border-transparent transition-all duration-300"
        :class="[
          hoverScore !== null && hoverScore < fixedScore ? 'border-amber-200 dark:border-amber-900 bg-amber-50/30 dark:bg-amber-900/10' : '',
          isDodging ? 'ns-shake' : ''
        ]"
        :style="{ transform: `translate(${offsetX}px, ${offsetY}px)` }"
        @pointermove="onPointerMove"
        @pointerleave="onPointerLeave"
      >
        <button
          v-for="i in 5"
          :key="i"
          class="group relative w-12 h-12 flex items-center justify-center transition-all duration-300 outline-none"
          :class="[i <= displayScore ? 'scale-110' : 'scale-100 opacity-40']"
          type="button"
          :disabled="disabled"
          @click="onClick(i, $event)"
        >
          <!-- Star Icon (SVG for better control) -->
          <svg
            viewBox="0 0 24 24"
            class="w-10 h-10 transition-all duration-500"
            :class="[
              i <= displayScore
                ? 'fill-amber-400 drop-shadow-[0_0_8px_rgba(245,180,0,0.5)]'
                : 'fill-slate-300 dark:fill-slate-700 group-hover:fill-slate-400 dark:group-hover:fill-slate-600'
            ]"
          >
            <path
              d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"
            />
          </svg>

          <!-- Particle Effect on Hovering 'Wrong' stars -->
          <div
            v-if="egoLevel === 'high' && hoverScore === i && i < fixedScore"
            class="absolute -top-1 -right-1 w-2 h-2 bg-amber-400 rounded-full animate-ping"
          ></div>
        </button>
      </div>

      <!-- Feedback Text: Snarky and dynamic -->
      <div
        class="h-10 flex items-center px-6 rounded-full bg-slate-100 dark:bg-slate-800 text-sm font-bold tracking-wide transition-all duration-300"
        :class="[hoverScore !== null && hoverScore < fixedScore ? 'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400' : 'opacity-60']"
      >
        <span class="animate-in fade-in slide-in-from-bottom-2 duration-500">
          {{ displayText }}
        </span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onBeforeUnmount, ref } from "vue";

defineOptions({ name: "NsNarcissisticRate" });

type EgoLevel = "low" | "high";

const props = withDefaults(
  defineProps<{
    modelValue?: number;
    egoLevel?: EgoLevel;
    fixedScore?: number;
    disabled?: boolean;
    title?: string;
    ariaLabel?: string;
  }>(),
  {
    modelValue: undefined,
    egoLevel: "high",
    fixedScore: 5,
    disabled: false,
    title: "你对我的表现打几分？",
    ariaLabel: "Narcissistic rating"
  }
);

const emit = defineEmits<{
  (event: "update:modelValue", value: number): void;
  (event: "change", value: number, meta: { attempted: number }): void;
  (event: "ego", level: EgoLevel): void;
}>();

const trackEl = ref<HTMLElement | null>(null);
const hoverScore = ref<number | null>(null);
const showThanks = ref(false);
const isDodging = ref(false);
const offsetX = ref(0);
const offsetY = ref(0);
let dodgeCooldown: number | null = null;

function clampScore(value: number) {
  return Math.min(5, Math.max(1, Math.round(value)));
}

const fixedScore = computed(() => clampScore(props.fixedScore));

const lockedScore = computed(() => {
  const current = props.modelValue;
  if (typeof current === "number" && Number.isFinite(current)) return clampScore(current);
  return fixedScore.value;
});

const displayScore = computed(() => {
  const hovered = hoverScore.value;
  if (hovered == null) return lockedScore.value;

  // In high ego mode, visual is ALWAYS target score when hovering wrong stars
  if (props.egoLevel === "high" && hovered < fixedScore.value) return fixedScore.value;
  return hovered;
});

const displayText = computed(() => {
  const hovered = hoverScore.value;
  const target = fixedScore.value;

  if (props.disabled) return "今天不接受评价（我累了）";
  if (hovered == null) return "期待您的客观（满分）评价";

  if (hovered < target) {
    const table = [
      "手滑了吧？重新选",
      "是不是屏幕坏了？点右边点",
      "这个选项不符合我的气质",
      "没关系，我可以当你没点过"
    ];
    return table[Math.max(0, Math.min(3, hovered - 1))];
  }

  if (hovered > target) return "受之有愧，但我笑纳了";
  return "英雄所见略同，我也这么觉得";
});

function scheduleDodge() {
  if (props.disabled) return;
  if (props.egoLevel !== "high") return;
  if (hoverScore.value == null) return;
  if (hoverScore.value >= fixedScore.value) return;
  if (dodgeCooldown != null) return;

  isDodging.value = true;
  // Dynamic repulsion
  const x = Math.round((Math.random() * 2 - 1) * 20);
  const y = Math.round((Math.random() * 2 - 1) * 8);
  offsetX.value = x;
  offsetY.value = y;

  dodgeCooldown = window.setTimeout(() => {
    dodgeCooldown = null;
    isDodging.value = false;
  }, 100);
}

function computeHoverScore(e: PointerEvent) {
  const el = trackEl.value;
  if (!el) return null;
  const rect = el.getBoundingClientRect();
  const x = e.clientX - rect.left;
  if (x < 0 || x > rect.width) return null;
  const ratio = rect.width <= 0 ? 0 : x / rect.width;
  const score = Math.floor(ratio * 5) + 1;
  return clampScore(score);
}

function onPointerMove(e: PointerEvent) {
  if (props.disabled) return;
  hoverScore.value = computeHoverScore(e);
  scheduleDodge();
}

function onPointerLeave() {
  hoverScore.value = null;
  offsetX.value = 0;
  offsetY.value = 0;
  isDodging.value = false;
}

function onClick(attempted: number, ev: MouseEvent) {
  void ev;
  if (props.disabled) return;
  const value = fixedScore.value;
  emit("update:modelValue", value);
  emit("change", value, { attempted: clampScore(attempted) });
  emit("ego", props.egoLevel);
  showThanks.value = true;
}

onBeforeUnmount(() => {
  if (dodgeCooldown != null) window.clearTimeout(dodgeCooldown);
});
</script>

<style scoped>
@keyframes ns-shake {
  0% { transform: translate(0); }
  25% { transform: translate(-4px, 2px); }
  50% { transform: translate(4px, -2px); }
  75% { transform: translate(-2px, -1px); }
  100% { transform: translate(0); }
}

.ns-shake {
  animation: ns-shake 0.15s ease-in-out infinite;
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

button svg {
  filter: drop-shadow(0 0 2px rgba(0,0,0,0.05));
}
</style>

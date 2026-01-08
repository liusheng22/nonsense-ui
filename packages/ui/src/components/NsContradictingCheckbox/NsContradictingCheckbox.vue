<template>
  <div
    class="nsui nsui-card relative inline-flex flex-col gap-6 p-8 min-w-[420px] overflow-hidden select-none"
    :class="{ 'opacity-60 grayscale-[0.5]': disabled }"
  >
    <!-- Header -->
    <div class="flex flex-col gap-1.5 px-1 text-left">
      <h3 class="text-xl font-bold tracking-tight">
        {{ title }}
      </h3>
      <p class="text-sm font-medium opacity-60">{{ subtitle }}</p>
    </div>

    <!-- Interaction Area -->
    <div class="relative flex items-center gap-4 p-6 bg-slate-50 dark:bg-slate-900/50 border-2 border-slate-100 dark:border-slate-800 rounded-2xl transition-all duration-300 group">
      <div 
        class="relative w-8 h-8 flex items-center justify-center cursor-pointer active:scale-90 transition-transform"
        @click="handleToggle"
      >
        <!-- The "Real" Checkbox Visual -->
        <div 
          class="w-6 h-6 rounded-lg border-2 transition-all duration-200 flex items-center justify-center"
          :class="[
            modelValue 
              ? 'bg-emerald-500 border-emerald-500 shadow-lg shadow-emerald-500/30 scale-110' 
              : 'bg-white dark:bg-slate-800 border-slate-300 dark:border-slate-600'
          ]"
        >
          <svg 
            v-if="modelValue" 
            viewBox="0 0 24 24" 
            class="w-4 h-4 fill-none stroke-white dark:stroke-slate-900 stroke-[4] animate-in zoom-in duration-300"
          >
            <path d="M20 6L9 17l-5-5" />
          </svg>
        </div>

        <!-- Hidden Native Input for A11y (but it's nonsensical anyway) -->
        <input
          type="checkbox"
          class="absolute inset-0 opacity-0 cursor-pointer"
          :checked="modelValue"
          :disabled="disabled"
          @change.prevent
        />
      </div>

      <!-- Dynamic Label -->
      <span 
        class="text-base font-black tracking-tight transition-all duration-300"
        :class="modelValue ? '' : 'opacity-40'"
      >
        {{ currentLabel }}
      </span>

      <!-- Annoyance Bubble -->
      <Transition name="ns-pop">
        <div 
          v-if="showMessage"
          class="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1.5 bg-rose-500 text-white text-[10px] font-black rounded-full shadow-xl shadow-rose-500/20 whitespace-nowrap z-20"
        >
          {{ activeMessage }}
        </div>
      </Transition>
    </div>

    <!-- Logic Engine Status -->
    <div class="flex items-center justify-between mt-2 px-1">
      <div class="flex flex-col gap-1">
        <div class="text-[9px] font-black opacity-30 uppercase tracking-widest">Decision Engine</div>
        <div class="text-xs font-bold opacity-60 flex items-center gap-2">
          <span :class="isRebelling ? 'text-rose-500' : 'opacity-40'">● 意志冲突</span>
          <span class="opacity-20">|</span>
          <span class="text-blue-500">● 顽固度: {{ (stubbornness * 100).toFixed(0) }}%</span>
        </div>
      </div>

      <button
        type="button"
        class="px-4 py-2 rounded-xl bg-slate-900 dark:bg-slate-700 text-white text-[10px] font-black uppercase tracking-wider hover:bg-black dark:hover:bg-slate-600 transition-all active:scale-95 disabled:opacity-30"
        :disabled="!modelValue"
        @click="reset"
      >
        撤销错误决定
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";

defineOptions({ name: "NsContradictingCheckbox" });

const props = withDefaults(
  defineProps<{
    modelValue?: boolean;
    title?: string;
    subtitle?: string;
    label?: string;
    rebelLabel?: string;
    disabled?: boolean;
    stubbornness?: number; // 0-1 probability of immediate rejection
  }>(),
  {
    modelValue: false,
    title: "杠精复选框",
    subtitle: "基于先进的“反悔算法”，它总能在你点头后发现不对劲。",
    label: "我同意以上所有荒谬的条款",
    rebelLabel: "其实我并不是真的想同意",
    disabled: false,
    stubbornness: 0.7
  }
);

const emit = defineEmits<{
  (event: "update:modelValue", value: boolean): void;
  (event: "rebel", message: string): void;
}>();

const isRebelling = ref(false);
const showMessage = ref(false);
const activeMessage = ref("");

const messages = [
  "你确定吗？我觉得你没想好。",
  "刚才的操作由于系统抖动已撤销。",
  "建议再次深思熟虑。",
  "检测到非法同意，已自动拦截。",
  "根据《反悔法》第22条，此操作无效。",
  "别点了，点了也没用。",
  "手滑了吧？我帮你取消了。"
];

const currentLabel = computed(() => {
  return props.modelValue ? props.rebelLabel : props.label;
});

function handleToggle() {
  if (props.disabled) return;

  const targetValue = !props.modelValue;
  
  if (targetValue) {
    // Attempting to CHECK
    emit("update:modelValue", true);

    // Probability-based rejection
    if (Math.random() < props.stubbornness) {
      triggerRebellion();
    }
  } else {
    // Attempting to UNCHECK (usually it loves this)
    emit("update:modelValue", false);
  }
}

function triggerRebellion() {
  isRebelling.value = true;
  activeMessage.value = messages[Math.floor(Math.random() * messages.length)];
  showMessage.value = true;
  
  emit("rebel", activeMessage.value);

  // Short delay before visual "correction"
  setTimeout(() => {
    emit("update:modelValue", false);
    isRebelling.value = false;
  }, 600);

  setTimeout(() => {
    showMessage.value = false;
  }, 2000);
}

function reset() {
  emit("update:modelValue", false);
}
</script>

<style scoped>
.ns-pop-enter-active {
  animation: ns-pop-in 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
}
.ns-pop-leave-active {
  animation: ns-pop-in 0.3s cubic-bezier(0.34, 1.56, 0.64, 1) reverse;
}

@keyframes ns-pop-in {
  0% { transform: translate(-50%, 20px) scale(0.5); opacity: 0; }
  100% { transform: translate(-50%, 0) scale(1); opacity: 1; }
}

/* Animations for icons appearing */
@keyframes zoom-in {
  from { opacity: 0; transform: scale(0.5); }
  to { opacity: 1; transform: scale(1); }
}

.animate-in {
  animation: zoom-in 0.2s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
}
</style>

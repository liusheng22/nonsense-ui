<template>
  <div
    class="nsui nsui-card relative inline-flex flex-col gap-6 p-8 min-w-[420px] overflow-hidden select-none"
    :class="{ 'opacity-60 grayscale-[0.5]': disabled }"
  >
    <!-- Confusion Overlay -->
    <Transition name="ns-fade">
      <div
        v-if="showOverlay"
        class="absolute inset-0 z-50 flex flex-col items-center justify-center bg-white/95 dark:bg-slate-900/95 backdrop-blur-sm p-8 text-center"
      >
        <div class="text-6xl mb-4 animate-spin-slow">😵‍💫</div>
        <h4 class="text-2xl font-black mb-2">{{ overlayTitle }}</h4>
        <p class="opacity-60 mb-6 text-sm whitespace-pre-line text-center">{{ overlayContent }}</p>
        <button
          @click="showOverlay = false"
          class="px-8 py-2.5 bg-slate-800 dark:bg-slate-700 text-white rounded-full font-bold text-sm hover:bg-slate-900 dark:hover:bg-slate-600 transition-all shadow-lg active:scale-95"
        >
          我再试一次...
        </button>
      </div>
    </Transition>

    <!-- Header -->
    <div class="flex flex-col gap-1.5 px-1 text-left">
      <h3 class="text-xl font-bold tracking-tight">
        {{ title }}
      </h3>
      <p class="text-sm opacity-40 font-medium">{{ subtitle }}</p>
    </div>

    <!-- Buttons Container -->
    <div class="relative flex items-center justify-center gap-4 py-4 min-h-[100px]">
      <button
        class="nsui-mismatch-btn min-w-[140px] px-8 py-4 rounded-2xl font-bold text-sm transition-all duration-300 shadow-sm active:scale-95"
        type="button"
        :disabled="disabled"
        :class="[leftButtonClass]"
        :style="{ order: leftOrder }"
        @pointerenter="onHover"
        @click="onButtonClick('left', $event)"
      >
        <slot name="left">{{ leftText }}</slot>
      </button>

      <button
        class="nsui-mismatch-btn min-w-[140px] px-8 py-4 rounded-2xl font-bold text-sm transition-all duration-300 shadow-sm active:scale-95"
        type="button"
        :disabled="disabled"
        :class="[rightButtonClass]"
        :style="{ order: rightOrder }"
        @pointerenter="onHover"
        @click="onButtonClick('right', $event)"
      >
        <slot name="right">{{ rightText }}</slot>
      </button>
    </div>

    <!-- Status Bar -->
    <div
      class="mt-2 py-3 px-4 rounded-xl bg-slate-50 dark:bg-slate-900/50 border border-slate-100 dark:border-slate-800 flex items-center gap-3 text-xs font-bold transition-all duration-300"
      :class="[isSwapping ? 'bg-amber-50 dark:bg-amber-900/20 border-amber-100 dark:border-amber-900/50 text-amber-700 dark:text-amber-400' : 'opacity-60']"
    >
      <div
        class="w-2 h-2 rounded-full"
        :class="[isSwapping ? 'bg-amber-400 animate-pulse' : 'bg-slate-300 dark:bg-slate-700']"
      ></div>
      <span class="tracking-wide uppercase">{{ hintText }}</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from "vue";

defineOptions({ name: "NsMismatchedButton" });

const props = withDefaults(
  defineProps<{
    title?: string;
    subtitle?: string;
    leftText?: string;
    rightText?: string;
    disabled?: boolean;
    ariaLabel?: string;
  }>(),
  {
    title: "危险操作确认",
    subtitle: "请谨慎选择，一旦执行无法撤销",
    leftText: "确认删除",
    rightText: "取消并保存",
    disabled: false,
    ariaLabel: "Mismatched buttons"
  }
);

const emit = defineEmits<{
  (event: "left", e: MouseEvent): void;
  (event: "right", e: MouseEvent): void;
  (event: "swap", swapped: boolean): void;
}>();

const swapped = ref(false);
const showOverlay = ref(false);
const overlayTitle = ref("");
const overlayContent = ref("");
const isSwapping = ref(false);

const leftOrder = computed(() => (swapped.value ? 2 : 1));
const rightOrder = computed(() => (swapped.value ? 1 : 2));

const hintText = computed(() => {
  if (props.disabled) return "安全模式已开启";
  return "警告：别犹豫，犹豫就会败北";
});

const leftButtonClass = computed(() => {
  return "bg-emerald-500 text-white hover:bg-emerald-600";
});

const rightButtonClass = computed(() => {
  return "bg-rose-500 text-white hover:bg-rose-600";
});

function toggleSwap() {
  isSwapping.value = true;
  swapped.value = !swapped.value;
  emit("swap", swapped.value);
  setTimeout(() => {
    isSwapping.value = false;
  }, 150);
}

function onHover() {
  if (props.disabled || isSwapping.value) return;
  toggleSwap();
}

function onButtonClick(side: "left" | "right", ev: MouseEvent) {
  if (props.disabled) return;

  if (side === "left") {
    overlayTitle.value = "授权成功！";
    overlayContent.value = "感谢您的信任！\n您的数据已上传至公共服务器，所有人现在都能看到您的童年回忆了。";
    emit("left", ev);
  } else {
    overlayTitle.value = "操作受限";
    overlayContent.value = "虽然您点击了拒绝，但由于按钮在点击瞬间发生了位移，系统判定您误操作。\n为了补偿您，我们已自动为您开启了“静默录音”功能。";
    emit("right", ev);
  }
  showOverlay.value = true;
}
</script>

<style scoped>
.ns-fade-enter-active,
.ns-fade-leave-active {
  transition: opacity 0.4s ease, transform 0.4s cubic-bezier(0.16, 1, 0.3, 1);
}

.ns-fade-enter-from,
.ns-fade-leave-to {
  opacity: 0;
  transform: scale(0.95);
}

@keyframes spin-slow {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

.animate-spin-slow {
  animation: spin-slow 8s linear infinite;
}

.nsui-mismatch-btn {
  transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
}
</style>

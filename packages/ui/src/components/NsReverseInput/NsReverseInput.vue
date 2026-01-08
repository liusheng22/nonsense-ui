<template>
  <div
    class="nsui nsui-card relative inline-flex flex-col gap-6 p-8 min-w-[420px] overflow-hidden select-none"
    :class="{ 'opacity-60 grayscale-[0.5]': disabled }"
  >
    <!-- Header -->
    <div class="flex flex-col gap-1.5 px-1">
      <h3 class="text-xl font-bold tracking-tight">
        {{ title }}
      </h3>
      <p class="text-sm font-medium opacity-60">{{ subtitle }}</p>
    </div>

    <!-- Input Field Container -->
    <div class="relative group">
      <input
        ref="inputRef"
        class="nsui-reverse-field w-full px-6 py-4 bg-slate-50 dark:bg-slate-900/50 border-2 border-slate-100 dark:border-slate-800 rounded-2xl text-2xl font-mono font-black outline-none transition-all duration-300 focus:border-emerald-400 focus:bg-white dark:focus:bg-slate-900 focus:ring-4 focus:ring-emerald-500/10 selection:bg-emerald-500/20"
        :class="[
          mirror ? 'ns-mirror' : '',
          glitchActive ? 'ns-glitch-text' : ''
        ]"
        type="text"
        :value="displayValue"
        :placeholder="placeholder"
        :disabled="disabled"
        spellcheck="false"
        @input="onInput"
        @keydown="onKeyDown"
      />

      <!-- Mirror Mode Indicator -->
      <div 
        v-if="mirror" 
        class="absolute -top-2 -right-2 w-6 h-6 bg-emerald-500 text-white rounded-full flex items-center justify-center text-[10px] font-black shadow-lg animate-bounce"
        title="镜像模式已开启"
      >
        M
      </div>
    </div>

    <!-- Status & Controls -->
    <div class="flex items-center justify-between mt-2">
      <div class="flex flex-col gap-1">
        <div class="text-[9px] font-black opacity-30 uppercase tracking-widest">Logic Engine</div>
        <div class="text-xs font-bold opacity-60 flex items-center gap-2">
          <span :class="mirror ? 'text-emerald-500' : 'opacity-40'">● 物理镜像</span>
          <span class="opacity-20">|</span>
          <span class="text-blue-500">● 字符反转</span>
        </div>
      </div>

      <div class="flex items-center gap-3">
        <button
          type="button"
          class="px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-wider transition-all active:scale-95"
          :class="mirror ? 'bg-emerald-500/10 text-emerald-500' : 'bg-slate-100 dark:bg-slate-800 text-slate-400'"
          @click="toggleMirror"
        >
          {{ mirror ? '关闭镜像' : '开启镜像' }}
        </button>
        <button
          type="button"
          class="px-4 py-2 rounded-xl bg-slate-900 dark:bg-slate-700 text-white text-[10px] font-black uppercase tracking-wider hover:bg-black dark:hover:bg-slate-600 transition-all active:scale-95"
          @click="clear"
        >
          清空
        </button>
      </div>
    </div>

    <!-- Real Value Preview (For Nonsensical Debugging) -->
    <div class="mt-4 p-4 rounded-xl bg-slate-50 dark:bg-slate-900/50 border border-slate-100 dark:border-slate-800 flex flex-col gap-2 text-left">
      <div class="text-[9px] font-black opacity-40 uppercase tracking-tighter">内存实际存储值 (UTF-8)：</div>
      <div class="text-sm font-mono font-bold break-all select-all opacity-80">
        {{ modelValue || '（等待输入数据...）' }}
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";

defineOptions({ name: "NsReverseInput" });

const props = withDefaults(
  defineProps<{
    modelValue?: string;
    title?: string;
    subtitle?: string;
    placeholder?: string;
    disabled?: boolean;
    initialMirror?: boolean;
  }>(),
  {
    modelValue: "",
    title: "反向输入框",
    subtitle: "打字向前，显示向后。思维在这里会打结。",
    placeholder: "输入您的心里话...",
    disabled: false,
    initialMirror: true
  }
);

const emit = defineEmits<{
  (event: "update:modelValue", value: string): void;
  (event: "glitch"): void;
}>();

const inputRef = ref<HTMLInputElement | null>(null);
const mirror = ref(props.initialMirror);
const glitchActive = ref(false);

function reverseString(value: string) {
  // Handle UTF-8 (emojis etc) correctly
  return [...value].reverse().join("");
}

const displayValue = computed(() => reverseString(props.modelValue ?? ""));

function onInput(e: Event) {
  const el = e.target as HTMLInputElement;
  const rawValue = el.value;
  
  // The magic: Since display is reversed, we reverse the input to get the "real" value
  const realValue = reverseString(rawValue);
  
  emit("update:modelValue", realValue);
  
  // Force cursor to stay in a "logical" but confusing position
  // In a reversed input, as you type, you feel like you are typing at the start
  setTimeout(() => {
    if (inputRef.value) {
      // Keep cursor at the end of the visual string (which is the beginning of the real string)
      const len = rawValue.length;
      inputRef.value.setSelectionRange(len, len);
    }
  }, 0);
}

function onKeyDown(e: KeyboardEvent) {
  if (e.key === "ArrowLeft" || e.key === "ArrowRight") {
    // Rebellious cursor: arrows do nothing or do the opposite
    // For now, let's just make it glitch a bit
    triggerGlitch();
  }
}

function triggerGlitch() {
  glitchActive.value = true;
  emit("glitch");
  setTimeout(() => {
    glitchActive.value = false;
  }, 300);
}

function toggleMirror() {
  mirror.value = !mirror.value;
}

function clear() {
  emit("update:modelValue", "");
}
</script>

<style scoped>
.ns-mirror {
  transform: scaleX(-1);
  /* When mirrored, standard text rendering looks weird, which is perfect */
}

@keyframes ns-glitch-anim {
  0% { transform: translateX(0); }
  20% { transform: translateX(-2px) skewX(2deg); }
  40% { transform: translateX(2px) skewX(-2deg); }
  60% { transform: translateX(-1px); }
  80% { transform: translateX(1px); }
  100% { transform: translateX(0); }
}

.ns-glitch-text {
  animation: ns-glitch-anim 0.2s ease infinite;
  color: #ef4444 !important; /* rose-500 */
}

/* Ensure placeholder is also mirrored if needed */
.ns-mirror::placeholder {
  transform: scaleX(-1);
  text-align: right;
}
</style>

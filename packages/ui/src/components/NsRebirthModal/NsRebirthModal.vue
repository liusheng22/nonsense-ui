<template>
  <Teleport to="body">
    <div v-if="isOpen" class="nsui-rebirth-overlay">
      <div v-if="mask" class="nsui-rebirth-mask"></div>

      <div ref="stageRef" class="nsui-rebirth-stage">
        <transition name="nsui-rebirth">
          <div
            v-if="visible"
            ref="modalRef"
            class="nsui-rebirth-modal"
            :class="isClosing ? 'nsui-rebirth-closing' : ''"
            :style="{ left: `${position.x}px`, top: `${position.y}px` }"
          >
            <div class="nsui-rebirth-header">
              <div>
                <h4 class="text-lg font-black text-slate-800 dark:text-slate-100">{{ title }}</h4>
                <p class="text-sm text-slate-500 dark:text-slate-400 mt-1">{{ subtitle }}</p>
              </div>
              <button type="button" class="nsui-rebirth-close" @click="onFakeClose">
                ✕
              </button>
            </div>

            <div class="nsui-rebirth-content">
              <div class="flex flex-col gap-3">
                <p class="text-sm text-slate-500 dark:text-slate-400">{{ content }}</p>
                <p class="nsui-rebirth-helper">
                  提示：按 <kbd>Esc</kbd> 退出
                </p>
                <p class="nsui-rebirth-message">
                  {{ message }}
                </p>
              </div>
            </div>

            <div class="nsui-rebirth-footer">
              <button type="button" class="nsui-rebirth-btn primary" @click="onFakeClose">
                {{ confirmText }}
              </button>
            </div>
          </div>
        </transition>
      </div>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
import { nextTick, ref, watch } from "vue";
import { defaultWindow, useEventListener, useVModel } from "@vueuse/core";

defineOptions({ name: "NsRebirthModal" });

const props = withDefaults(
  defineProps<{
    open?: boolean;
    mask?: boolean;
    escClosable?: boolean;

    rebirthDelay?: number;
    maxRebirths?: number;
    messageList?: string[];

    title?: string;
    subtitle?: string;
    content?: string;
    confirmText?: string;
  }>(),
  {
    mask: true,
    escClosable: true,

    rebirthDelay: 100,
    maxRebirths: Infinity,
    messageList: () => [
      "关闭已撤回：弹窗自动复活。",
      "系统检测到你在试图逃跑。",
      "你以为你能关掉我？",
      "修复完成：弹窗仍在。"
    ],

    title: "关掉了？",
    subtitle: "你确定吗？",
    content: "点“确认关闭”/✕ 只会复活。",
    confirmText: "确认关闭",
  }
);

const emit = defineEmits<{
  (event: "update:open", value: boolean): void;
  (event: "confirm"): void;
  (event: "rebirth", count: number): void;
}>();

const win = defaultWindow;
const isOpen = useVModel(props, "open", emit, { defaultValue: false });

const stageRef = ref<HTMLElement | null>(null);
const modalRef = ref<HTMLElement | null>(null);
const position = ref({ x: 0, y: 0 });
const visible = ref(false);
const isClosing = ref(false);
const rebirthCount = ref(0);
const message = ref("");
const timer = ref<{ close?: number; rebirth?: number }>({});

function clearTimers() {
  if (!win) return;
  if (timer.value.close) win.clearTimeout(timer.value.close);
  if (timer.value.rebirth) win.clearTimeout(timer.value.rebirth);
  timer.value = {};
}

function pickMessage() {
  const list = props.messageList;
  if (!list?.length) return "弹窗已重生。";
  return list[Math.floor(Math.random() * list.length)];
}

function randomPosition() {
  const stageRect = stageRef.value?.getBoundingClientRect();
  const modalRect = modalRef.value?.getBoundingClientRect();
  if (!stageRect || !modalRect) return;

  const padding = 14;
  const maxX = Math.max(padding, stageRect.width - modalRect.width - padding);
  const maxY = Math.max(padding, stageRect.height - modalRect.height - padding);
  position.value = {
    x: Math.floor(Math.random() * maxX) + padding,
    y: Math.floor(Math.random() * maxY) + padding
  };
}

async function showFresh() {
  visible.value = true;
  await nextTick();
  randomPosition();
}

function closeForReal() {
  clearTimers();
  isClosing.value = false;
  visible.value = false;
  isOpen.value = false;
}

function onFakeClose() {
  emit("confirm");

  if (!win) return;
  clearTimers();
  isClosing.value = true;

  timer.value.close = win.setTimeout(() => {
    visible.value = false;
    timer.value.rebirth = win.setTimeout(async () => {
      // Never truly closes (except via Esc). `maxRebirths` only limits the counter growth.
      if (rebirthCount.value < props.maxRebirths) {
        rebirthCount.value += 1;
        emit("rebirth", rebirthCount.value);
      }
      message.value = pickMessage();
      isClosing.value = false;
      await showFresh();
    }, Math.max(0, props.rebirthDelay));
  }, 200);
}

watch(
  () => isOpen.value,
  async (open) => {
    clearTimers();
    if (!open) {
      visible.value = false;
      isClosing.value = false;
      return;
    }

    rebirthCount.value = 0;
    message.value = pickMessage();
    isClosing.value = false;
    await showFresh();
  },
  { immediate: true }
);

useEventListener(win, "resize", () => {
  if (!isOpen.value || !visible.value) return;
  randomPosition();
});

useEventListener(
  win,
  "keydown",
  (event: KeyboardEvent) => {
    if (!props.escClosable || !isOpen.value) return;
    if (event.key === "Escape") closeForReal();
  },
  { passive: true }
);
</script>

<style scoped>
.nsui-rebirth-overlay {
  position: fixed;
  inset: 0;
  z-index: 60;
}

.nsui-rebirth-mask {
  position: absolute;
  inset: 0;
  background: rgba(15, 23, 42, 0.22);
  backdrop-filter: blur(2px);
}

.nsui-rebirth-stage {
  position: absolute;
  inset: 0;
}

.nsui-rebirth-modal {
  position: absolute;
  width: 380px;
  max-width: 82%;
  min-height: 220px;
  border-radius: 1rem;
  border: 2px solid rgba(226, 232, 240, 1);
  background: #ffffff;
  box-shadow: 0 30px 60px -30px rgba(15, 23, 42, 0.3);
  transform: translateZ(0);
  display: flex;
  flex-direction: column;
}

.dark .nsui-rebirth-modal {
  border-color: rgba(51, 65, 85, 1);
  background: #0f172a;
}

.nsui-rebirth-closing {
  transform: scale(0.92);
  opacity: 0.6;
  filter: blur(1px);
}

.nsui-rebirth-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  padding: 16px 20px 8px;
}

.nsui-rebirth-close {
  width: 32px;
  height: 32px;
  border-radius: 10px;
  border: 2px solid rgba(226, 232, 240, 1);
  background: rgba(248, 250, 252, 0.9);
  color: rgba(71, 85, 105, 0.9);
  font-weight: 900;
}

.dark .nsui-rebirth-close {
  border-color: rgba(51, 65, 85, 1);
  background: rgba(15, 23, 42, 0.85);
  color: rgba(226, 232, 240, 0.8);
}

.nsui-rebirth-content {
  flex: 1;
  padding: 0 20px;
  display: flex;
  align-items: center;
}

.nsui-rebirth-helper {
  font-size: 12px;
  font-weight: 700;
  color: rgba(100, 116, 139, 0.95);
}

.dark .nsui-rebirth-helper {
  color: rgba(148, 163, 184, 0.9);
}

.nsui-rebirth-message {
  font-size: 12px;
  font-weight: 900;
  color: rgba(16, 185, 129, 0.85);
}

.dark .nsui-rebirth-message {
  color: rgba(110, 231, 183, 0.9);
}

.nsui-rebirth-footer {
  display: flex;
  justify-content: flex-end;
  gap: 8px;
  padding: 12px 20px 16px;
  border-top: 1px solid rgba(226, 232, 240, 0.8);
}

.dark .nsui-rebirth-footer {
  border-top-color: rgba(51, 65, 85, 1);
}

.nsui-rebirth-btn {
  padding: 6px 14px;
  border-radius: 10px;
  font-weight: 800;
  border: 2px solid rgba(226, 232, 240, 1);
  background: #ffffff;
  color: rgba(71, 85, 105, 0.9);
}

.nsui-rebirth-btn.primary {
  border-color: rgba(16, 185, 129, 0.35);
  background: rgba(16, 185, 129, 0.1);
  color: rgba(5, 150, 105, 0.95);
}

.dark .nsui-rebirth-btn {
  border-color: rgba(51, 65, 85, 1);
  background: rgba(15, 23, 42, 0.85);
  color: rgba(226, 232, 240, 0.8);
}

.nsui-rebirth-enter-active,
.nsui-rebirth-leave-active {
  transition: all 0.2s ease;
}

.nsui-rebirth-enter-from {
  transform: scale(0.6);
  opacity: 0;
}

.nsui-rebirth-leave-to {
  transform: scale(0.82);
  opacity: 0;
}
</style>

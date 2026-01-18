<template>
  <Teleport to="body">
    <div v-if="isOpen" class="nsui-teleport-overlay">
      <div
        v-if="mask"
        class="nsui-teleport-mask"
        @click="onMaskClick"
      ></div>
      <div
        ref="stageRef"
        class="nsui-teleport-stage"
        @pointermove="onStageMove"
      >
        <div
          ref="modalRef"
          class="nsui-teleport-modal"
          :class="isTeleporting && showEffect ? 'nsui-teleporting' : ''"
          :style="{ left: `${position.x}px`, top: `${position.y}px` }"
          @pointerenter="onHoverTeleport"
        >
          <div class="nsui-teleport-header">
            <div>
              <h4 class="text-lg font-black text-slate-800 dark:text-slate-100">
                {{ title }}
              </h4>
              <p class="text-sm text-slate-500 dark:text-slate-400 mt-1">
                {{ subtitle }}
              </p>
            </div>
            <button
              type="button"
              class="nsui-teleport-close"
              @click="onCancel"
            >
              ✕
            </button>
          </div>
          <div class="nsui-teleport-content">
            <p class="text-sm text-slate-500 dark:text-slate-400">
              {{ content }}
            </p>
          </div>
          <div class="nsui-teleport-footer">
            <button type="button" class="nsui-teleport-btn ghost" @click="onCancel">
              {{ cancelText }}
            </button>
            <button type="button" class="nsui-teleport-btn primary" @click="onConfirm">
              {{ confirmText }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
import { nextTick, onMounted, onUnmounted, ref } from "vue";
import { defaultWindow, useEventListener, useVModel } from "@vueuse/core";

defineOptions({ name: "NsUncatchableModal" });

const props = withDefaults(
  defineProps<{
    open?: boolean;
    showEffect?: boolean;
    mask?: boolean;
    closeOnMask?: boolean;
    escClosable?: boolean;
    title?: string;
    subtitle?: string;
    content?: string;
    confirmText?: string;
    cancelText?: string;
  }>(),
  {
    showEffect: true,
    mask: true,
    closeOnMask: true,
    escClosable: true,
    title: "别追了",
    subtitle: "你越靠近，我就越瞬移。",
    content: "这是一个正常的弹窗结构，只是它拒绝被抓住。",
    confirmText: "确认",
    cancelText: "取消"
  }
);

const emit = defineEmits<{
  (event: "update:open", value: boolean): void;
  (event: "confirm"): void;
  (event: "cancel"): void;
}>();

const stageRef = ref<HTMLElement | null>(null);
const modalRef = ref<HTMLElement | null>(null);
const position = ref({ x: 0, y: 0 });
const isTeleporting = ref(false);
const teleportTimeout = ref<number | null>(null);
const lastPointer = ref<{ x: number; y: number } | null>(null);
const isOpen = useVModel(props, "open", emit, { defaultValue: true });

function randomPosition(avoid?: { x: number; y: number }) {
  const stageRect = stageRef.value?.getBoundingClientRect();
  const modalRect = modalRef.value?.getBoundingClientRect();
  if (!stageRect || !modalRect) return;

  const padding = 12;
  const maxX = Math.max(padding, stageRect.width - modalRect.width - padding);
  const maxY = Math.max(padding, stageRect.height - modalRect.height - padding);
  const avoidRadius = Math.max(140, Math.floor(modalRect.width * 0.6));
  let candidate = { x: padding, y: padding };
  let best = -Infinity;

  for (let i = 0; i < 10; i++) {
    const x = Math.floor(Math.random() * maxX) + padding;
    const y = Math.floor(Math.random() * maxY) + padding;
    if (!avoid) {
      candidate = { x, y };
      break;
    }
    const dx = x + modalRect.width / 2 - avoid.x;
    const dy = y + modalRect.height / 2 - avoid.y;
    const dist = Math.hypot(dx, dy);
    if (dist > avoidRadius) {
      candidate = { x, y };
      break;
    }
    if (dist > best) {
      best = dist;
      candidate = { x, y };
    }
  }

  position.value = candidate;
}

function teleport() {
  if (!stageRef.value || !modalRef.value) return;
  if (!isOpen.value) return;
  if (teleportTimeout.value != null) clearTimeout(teleportTimeout.value);
  isTeleporting.value = true;
  teleportTimeout.value = window.setTimeout(() => {
    randomPosition(lastPointer.value ?? undefined);
    teleportTimeout.value = window.setTimeout(() => {
      isTeleporting.value = false;
    }, 180);
  }, 120);
}

function onHoverTeleport(event?: PointerEvent) {
  if (event) lastPointer.value = getStagePoint(event);
  teleport();
}

function getStagePoint(event: PointerEvent) {
  const rect = stageRef.value?.getBoundingClientRect();
  if (!rect) return { x: 0, y: 0 };
  return { x: event.clientX - rect.left, y: event.clientY - rect.top };
}

function handleResize() {
  randomPosition();
}

onMounted(async () => {
  await nextTick();
  randomPosition();
  window.addEventListener("resize", handleResize);
});

onUnmounted(() => {
  if (teleportTimeout.value != null) clearTimeout(teleportTimeout.value);
  window.removeEventListener("resize", handleResize);
});

function onStageMove(event: PointerEvent) {
  lastPointer.value = getStagePoint(event);
}

function onMaskClick() {
  if (!props.closeOnMask) return;
  isOpen.value = false;
}

function onConfirm() {
  emit("confirm");
  isOpen.value = false;
}

function onCancel() {
  emit("cancel");
  isOpen.value = false;
}

useEventListener(
  defaultWindow,
  "keydown",
  (event: KeyboardEvent) => {
    if (!props.escClosable || !isOpen.value) return;
    if (event.key === "Escape") {
      isOpen.value = false;
    }
  },
  { passive: true }
);
</script>

<style scoped>
.nsui-teleport-overlay {
  position: fixed;
  inset: 0;
  z-index: 60;
}

.nsui-teleport-mask {
  position: absolute;
  inset: 0;
  background: rgba(15, 23, 42, 0.2);
  backdrop-filter: blur(2px);
}

.nsui-teleport-stage {
  position: absolute;
  inset: 0;
}

.nsui-teleport-modal {
  position: absolute;
  width: 360px;
  max-width: 80%;
  height: 200px;
  border-radius: 1rem;
  border: 2px solid rgba(226, 232, 240, 1);
  background: #ffffff;
  box-shadow: 0 30px 60px -30px rgba(15, 23, 42, 0.3);
  transition: transform 0.2s ease, opacity 0.2s ease;
  transform: translateZ(0);
  display: flex;
  flex-direction: column;
}

.dark .nsui-teleport-modal {
  border-color: rgba(51, 65, 85, 1);
  background: #0f172a;
}

.nsui-teleporting {
  transform: scale(0.86);
  opacity: 0.5;
  filter: blur(2px);
}

.nsui-teleport-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  padding: 16px 20px 8px;
}

.nsui-teleport-close {
  width: 32px;
  height: 32px;
  border-radius: 10px;
  border: 2px solid rgba(226, 232, 240, 1);
  background: rgba(248, 250, 252, 0.9);
  color: rgba(71, 85, 105, 0.9);
  font-weight: 900;
}

.dark .nsui-teleport-close {
  border-color: rgba(51, 65, 85, 1);
  background: rgba(15, 23, 42, 0.85);
  color: rgba(226, 232, 240, 0.8);
}

.nsui-teleport-content {
  flex: 1;
  padding: 0 20px;
  display: flex;
  align-items: center;
}

.nsui-teleport-footer {
  display: flex;
  justify-content: flex-end;
  gap: 8px;
  padding: 12px 20px 16px;
  border-top: 1px solid rgba(226, 232, 240, 0.8);
}

.dark .nsui-teleport-footer {
  border-top-color: rgba(51, 65, 85, 1);
}

.nsui-teleport-btn {
  padding: 6px 14px;
  border-radius: 10px;
  font-weight: 800;
  border: 2px solid rgba(226, 232, 240, 1);
  background: #ffffff;
  color: rgba(71, 85, 105, 0.9);
}

.nsui-teleport-btn.primary {
  border-color: rgba(59, 130, 246, 0.35);
  background: rgba(59, 130, 246, 0.08);
  color: rgba(37, 99, 235, 0.9);
}

.dark .nsui-teleport-btn {
  border-color: rgba(51, 65, 85, 1);
  background: rgba(15, 23, 42, 0.85);
  color: rgba(226, 232, 240, 0.8);
}
</style>

<template>
  <Teleport to="body">
    <div v-if="isOpen" class="nsui-dodge-overlay">
      <div v-if="mask" class="nsui-dodge-mask" @click="onMaskClick"></div>

      <div class="nsui-dodge-stage">
        <div ref="modalRef" class="nsui-dodge-modal" @pointermove="onModalPointerMove">
          <div class="nsui-dodge-header">
            <div>
              <h4 class="text-lg font-black text-slate-800 dark:text-slate-100">{{ title }}</h4>
              <p class="text-sm text-slate-500 dark:text-slate-400 mt-1">{{ subtitle }}</p>
            </div>

            <div class="nsui-dodge-close-placeholder" aria-hidden="true"></div>
          </div>

          <div class="nsui-dodge-content">
            <div class="flex flex-col gap-3">
              <p class="text-sm text-slate-500 dark:text-slate-400">{{ content }}</p>
              <p class="nsui-dodge-helper">
                鼠标点不到“确认关闭”？按 <kbd>Esc</kbd> 退出
              </p>
            </div>
          </div>

          <div class="nsui-dodge-footer">
            <div class="nsui-dodge-actions-spacer" aria-hidden="true"></div>
          </div>

          <button
            ref="confirmRef"
            type="button"
            class="nsui-dodge-btn primary nsui-dodge-confirm"
            :class="{ 'is-fleeing': isConfirmFleeing }"
            :style="{ left: `${confirmPos.x}px`, top: `${confirmPos.y}px` }"
            @pointerenter="onConfirmEnter"
            @pointerdown.prevent
            @click="onConfirm"
          >
            {{ confirmText }}
          </button>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
import { nextTick, onUnmounted, ref, watch } from "vue";
import { defaultWindow, useEventListener, useVModel } from "@vueuse/core";

defineOptions({ name: "NsUnclickableConfirmModal" });

const props = withDefaults(
  defineProps<{
    open?: boolean;
    mask?: boolean;
    closeOnMask?: boolean;
    escClosable?: boolean;

    dodgeSpeed?: number;
    safeDistance?: number;
    detectionRadius?: number;

    title?: string;
    subtitle?: string;
    content?: string;
    confirmText?: string;
  }>(),
  {
    mask: true,
    closeOnMask: true,
    escClosable: true,

    dodgeSpeed: 1,
    safeDistance: 26,
    detectionRadius: 70,

    title: "重要通知",
    subtitle: "你确实想关闭这个弹窗吗？",
    content: "你越想点“确认关闭”，它越往反方向逃。",
    confirmText: "确认关闭"
  }
);

const emit = defineEmits<{
  (event: "update:open", value: boolean): void;
  (event: "confirm"): void;
  (event: "cancel"): void;
}>();

const isOpen = useVModel(props, "open", emit, { defaultValue: false });

const modalRef = ref<HTMLElement | null>(null);
const confirmRef = ref<HTMLElement | null>(null);

const confirmPos = ref({ x: 0, y: 0 });

const modalSize = ref({ width: 0, height: 0 });
const confirmSize = ref({ width: 0, height: 0 });

const isConfirmFleeing = ref(false);
const fleeTimeout = ref<{ confirm?: number }>({});

function clamp(value: number, min: number, max: number) {
  return Math.max(min, Math.min(max, value));
}

function bumpConfirmFlee() {
  isConfirmFleeing.value = true;
  if (fleeTimeout.value.confirm) window.clearTimeout(fleeTimeout.value.confirm);
  fleeTimeout.value.confirm = window.setTimeout(() => (isConfirmFleeing.value = false), 180);
}

function pointDistanceToRect(
  pointX: number,
  pointY: number,
  left: number,
  top: number,
  right: number,
  bottom: number
) {
  const closestX = clamp(pointX, left, right);
  const closestY = clamp(pointY, top, bottom);
  return Math.hypot(pointX - closestX, pointY - closestY);
}

async function syncSizes() {
  await nextTick();

  const modalRect = modalRef.value?.getBoundingClientRect();
  const confirmRect = confirmRef.value?.getBoundingClientRect();
  if (!modalRect || !confirmRect) return;

  modalSize.value = { width: modalRect.width, height: modalRect.height };
  confirmSize.value = { width: confirmRect.width, height: confirmRect.height };

  confirmPos.value = {
    x: modalRect.width - confirmRect.width / 2 - 20,
    y: modalRect.height - confirmRect.height / 2 - 18
  };
}

function moveConfirmAway(cursorX: number, cursorY: number) {
  const { width, height } = modalSize.value;
  const { width: bw, height: bh } = confirmSize.value;
  if (!width || !height || !bw || !bh) return;

  const minX = bw / 2 + 16;
  const maxX = width - bw / 2 - 16;
  const minY = bh / 2 + 16;
  const maxY = height - bh / 2 - 16;

  const rectLeft = confirmPos.value.x - bw / 2;
  const rectRight = confirmPos.value.x + bw / 2;
  const rectTop = confirmPos.value.y - bh / 2;
  const rectBottom = confirmPos.value.y + bh / 2;
  const edgeDistance = pointDistanceToRect(cursorX, cursorY, rectLeft, rectTop, rectRight, rectBottom);

  const detectionRadius = Math.max(props.detectionRadius, props.safeDistance + 10);
  if (edgeDistance > detectionRadius) return;

  const dx = confirmPos.value.x - cursorX;
  const dy = confirmPos.value.y - cursorY;
  const dist = Math.hypot(dx, dy) || 0.001;
  const ux = dx / dist;
  const uy = dy / dist;
  const perpX = -uy;
  const perpY = ux;
  const drift = ((Math.random() > 0.5 ? 1 : -1) * Math.max(3, detectionRadius * 0.12));
  const step = Math.max(10, (detectionRadius - edgeDistance + 6) * props.dodgeSpeed);

  let targetX = clamp(confirmPos.value.x + ux * step + perpX * drift, minX, maxX);
  let targetY = clamp(confirmPos.value.y + uy * step + perpY * drift, minY, maxY);

  if (targetX === minX || targetX === maxX) {
    targetY = clamp(confirmPos.value.y + (cursorY < confirmPos.value.y ? 1 : -1) * step, minY, maxY);
  }

  confirmPos.value = { x: targetX, y: targetY };
  bumpConfirmFlee();
}

function getModalPoint(event: PointerEvent) {
  const rect = modalRef.value?.getBoundingClientRect();
  if (!rect) return null;
  return { x: event.clientX - rect.left, y: event.clientY - rect.top };
}

function onModalPointerMove(event: PointerEvent) {
  const pt = getModalPoint(event);
  if (!pt) return;
  moveConfirmAway(pt.x, pt.y);
}

function onConfirmEnter(event: PointerEvent) {
  const pt = getModalPoint(event);
  if (!pt) return;
  moveConfirmAway(pt.x, pt.y);
}

function onConfirm() {
  emit("confirm");
  isOpen.value = false;
}

function onCancel() {
  emit("cancel");
  isOpen.value = false;
}

function onMaskClick() {
  if (!props.closeOnMask) return;
  isOpen.value = false;
}

watch(
  () => isOpen.value,
  async (open) => {
    if (!open) return;
    await syncSizes();
  }
);

useEventListener(defaultWindow, "keydown", (event: KeyboardEvent) => {
  if (!props.escClosable || !isOpen.value) return;
  if (event.key === "Escape") onCancel();
});

useEventListener(defaultWindow, "resize", () => {
  if (!isOpen.value) return;
  syncSizes();
});

onUnmounted(() => {
  if (fleeTimeout.value.confirm) window.clearTimeout(fleeTimeout.value.confirm);
});
</script>

<style scoped>
.nsui-dodge-overlay {
  position: fixed;
  inset: 0;
  z-index: 60;
}

.nsui-dodge-mask {
  position: absolute;
  inset: 0;
  background: rgba(15, 23, 42, 0.2);
  backdrop-filter: blur(2px);
}

.nsui-dodge-stage {
  position: absolute;
  inset: 0;
}

.nsui-dodge-modal {
  position: absolute;
  left: 50%;
  top: 45%;
  transform: translate(-50%, -50%);
  width: 420px;
  max-width: calc(100vw - 32px);
  height: 220px;
  border-radius: 1rem;
  border: 2px solid rgba(226, 232, 240, 1);
  background: #ffffff;
  box-shadow: 0 30px 60px -30px rgba(15, 23, 42, 0.3);
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.dark .nsui-dodge-modal {
  border-color: rgba(51, 65, 85, 1);
  background: #0f172a;
}

.nsui-dodge-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  padding: 16px 20px 8px;
  position: relative;
}

.nsui-dodge-close {
  position: absolute;
  width: 32px;
  height: 32px;
  border-radius: 10px;
  border: 2px solid rgba(226, 232, 240, 1);
  background: rgba(248, 250, 252, 0.9);
  color: rgba(71, 85, 105, 0.9);
  font-weight: 900;
  box-shadow: 0 10px 20px rgba(15, 23, 42, 0.08);
  transform: translate(-50%, -50%);
  transition: left 140ms cubic-bezier(0.2, 0.9, 0.2, 1), top 140ms cubic-bezier(0.2, 0.9, 0.2, 1);
  will-change: left, top;
}

.dark .nsui-dodge-close {
  border-color: rgba(51, 65, 85, 1);
  background: rgba(15, 23, 42, 0.85);
  color: rgba(226, 232, 240, 0.8);
}

.nsui-dodge-close-placeholder {
  width: 32px;
  height: 32px;
}

.nsui-dodge-actions-spacer {
  width: 160px;
  height: 38px;
}

.nsui-dodge-content {
  flex: 1;
  padding: 0 20px;
  display: flex;
  align-items: center;
}

.nsui-dodge-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  padding: 12px 20px 16px;
  border-top: 1px solid rgba(226, 232, 240, 0.8);
}

.dark .nsui-dodge-footer {
  border-top-color: rgba(51, 65, 85, 1);
}

.nsui-dodge-helper {
  font-size: 12px;
  font-weight: 800;
  color: rgba(100, 116, 139, 0.85);
  line-height: 1.4;
}

.dark .nsui-dodge-helper {
  color: rgba(148, 163, 184, 0.8);
}

.nsui-dodge-btn {
  padding: 6px 14px;
  border-radius: 10px;
  font-weight: 800;
  border: 2px solid rgba(226, 232, 240, 1);
  background: #ffffff;
  color: rgba(71, 85, 105, 0.9);
  white-space: nowrap;
}

.dark .nsui-dodge-btn {
  border-color: rgba(51, 65, 85, 1);
  background: rgba(15, 23, 42, 0.85);
  color: rgba(226, 232, 240, 0.8);
}

.nsui-dodge-btn.primary {
  border-color: rgba(239, 68, 68, 0.25);
  background: rgba(239, 68, 68, 0.12);
  color: rgba(185, 28, 28, 0.95);
}

.nsui-dodge-btn.primary:hover {
  background: rgba(239, 68, 68, 0.10);
}

.dark .nsui-dodge-btn.primary {
  border-color: rgba(248, 113, 113, 0.22);
  background: rgba(248, 113, 113, 0.12);
  color: rgba(254, 202, 202, 0.85);
}

.dark .nsui-dodge-btn.primary:hover {
  background: rgba(248, 113, 113, 0.10);
}

.nsui-dodge-confirm {
  position: absolute;
  transform: translate(-50%, -50%);
  min-width: 96px;
  transition: left 140ms cubic-bezier(0.2, 0.9, 0.2, 1), top 140ms cubic-bezier(0.2, 0.9, 0.2, 1);
  will-change: left, top;
  z-index: 2;
}

.is-fleeing {
  animation: nsui-flee 180ms ease-in-out;
}

@keyframes nsui-flee {
  0% { transform: translate(-50%, -50%) scale(1); }
  50% { transform: translate(-50%, -50%) scale(0.96) rotate(-1deg); }
  100% { transform: translate(-50%, -50%) scale(1); }
}

.nsui-dodge-tip {
  position: absolute;
  right: 14px;
  bottom: 10px;
  font-size: 10px;
  font-weight: 900;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: rgba(100, 116, 139, 0.5);
  user-select: none;
  pointer-events: none;
}

.dark .nsui-dodge-tip {
  color: rgba(148, 163, 184, 0.45);
}
</style>

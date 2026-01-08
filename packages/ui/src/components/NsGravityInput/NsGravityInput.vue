<template>
  <div
    class="nsui nsui-card relative inline-flex flex-col gap-6 p-8 min-w-[460px] overflow-hidden select-none"
    :class="{ 'opacity-60 grayscale-[0.5]': disabled }"
  >
    <!-- Header -->
    <div class="flex flex-col gap-1.5 px-1 text-left">
      <h3 class="text-xl font-bold tracking-tight">
        {{ title }}
      </h3>
      <p class="text-sm font-medium opacity-60">{{ subtitle }}</p>
    </div>

    <!-- Physics Container -->
    <div
      ref="boxRef"
      class="relative w-full rounded-2xl border-2 bg-slate-100 dark:bg-slate-900/50 shadow-inner overflow-hidden cursor-text transition-all duration-300 group"
      :class="[
        isFocused ? 'border-emerald-400 bg-white dark:bg-slate-900 ring-4 ring-emerald-500/10' : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
      ]"
      :style="{ height: `${props.height}px` }"
      @pointerdown="focusInput"
    >
      <canvas ref="canvasRef" class="absolute inset-0 w-full h-full pointer-events-none" />

      <!-- Placeholder -->
      <div
        v-if="innerValue.length === 0"
        class="absolute inset-0 flex items-center justify-center text-slate-500 text-sm font-bold tracking-wide select-none pointer-events-none transition-opacity duration-300"
        :class="{ 'opacity-20': isFocused }"
      >
        <div class="flex flex-col items-center gap-2">
          <div class="w-10 h-10 rounded-full bg-white/50 dark:bg-slate-800/50 flex items-center justify-center mb-1">
            <svg viewBox="0 0 24 24" class="w-6 h-6 fill-slate-400 animate-bounce"><path d="M19 13H5v-2h14v2z"/></svg>
          </div>
          {{ placeholder }}
        </div>
      </div>

      <!-- Real Hidden Input for Focus/Keyboard -->
      <textarea
        ref="inputRef"
        :value="innerValue"
        :disabled="disabled"
        class="absolute inset-0 w-full h-full resize-none bg-transparent p-6 text-transparent caret-emerald-500 outline-none selection:bg-emerald-500/20"
        spellcheck="false"
        @focus="isFocused = true"
        @blur="isFocused = false"
        @input="onInput"
        @compositionstart="onCompositionStart"
        @compositionend="onCompositionEnd"
        @keydown.delete="onDelete"
      />

      <!-- "Helpful" Hint -->
      <div 
        v-if="isFocused && innerValue.length > 5 && !revealing" 
        class="absolute top-2 right-4 text-[10px] font-black opacity-20 uppercase animate-pulse"
      >
        摇晃鼠标以整理文字
      </div>
    </div>

    <!-- Controls -->
    <div class="flex items-center justify-between gap-4 mt-2">
      <div class="flex flex-col gap-1 text-left">
        <div class="text-[10px] font-black opacity-30 uppercase tracking-widest">
          Engine Status
        </div>
        <div class="text-xs font-bold opacity-60 flex items-center gap-2">
          <span :class="revealing ? 'text-emerald-500' : 'opacity-30'">● 重排模式</span>
          <span class="opacity-20">|</span>
          <span :class="innerValue.length > 0 ? 'text-blue-500' : 'opacity-30'">● 载荷: {{ innerValue.length }} 字</span>
        </div>
      </div>

      <div class="flex items-center gap-3">
        <button
          type="button"
          class="group px-6 py-2.5 rounded-xl bg-slate-900 dark:bg-slate-700 text-white text-xs font-black hover:bg-black dark:hover:bg-slate-600 transition-all shadow-lg active:scale-95 disabled:opacity-30 flex items-center gap-2"
          :disabled="disabled || innerValue.length === 0"
          @click="shakeAndReveal"
        >
          <svg viewBox="0 0 24 24" class="w-3 h-3 fill-current group-hover:animate-spin"><path d="M12 4V1L8 5l4 4V6c3.31 0 6 2.69 6 6 0 1.01-.25 1.97-.7 2.8l1.46 1.46C19.54 15.03 20 13.57 20 12c0-4.42-3.58-8-8-8zm0 14c-3.31 0-6-2.69-6-6 0-1.01.25-1.97.7-2.8L5.24 7.74C4.46 8.97 4 10.43 4 12c0 4.42 3.58 8 8 8v3l4-4-4-4v3z"/></svg>
          一键摇匀
        </button>
        <button
          type="button"
          class="px-6 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 text-xs font-black hover:bg-rose-50 dark:hover:bg-rose-900/30 hover:text-rose-600 dark:hover:text-rose-400 transition-all active:scale-95 disabled:opacity-30"
          :disabled="disabled || innerValue.length === 0"
          @click="clear"
        >
          丢弃
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref, watch } from "vue";

defineOptions({ name: "NsGravityInput" });

interface Particle {
  id: number;
  ch: string;
  x: number;
  y: number;
  vx: number;
  vy: number;
  targetX: number;
  targetY: number;
  angle: number;
  va: number;
}

const props = withDefaults(
  defineProps<{
    modelValue?: string;
    disabled?: boolean;
    title?: string;
    subtitle?: string;
    placeholder?: string;
    height?: number;
    gravity?: number;
    bounciness?: number;
    fontSize?: number;
    revealDurationMs?: number;
    shakePower?: number;
    jitterThreshold?: number;
  }>(),
  {
    modelValue: "",
    disabled: false,
    title: "重力输入框 v2.0",
    subtitle: "文字已坍塌，请手动摇匀以进行核对。",
    placeholder: "点击此处开始输入，看文字坍塌...",
    height: 180,
    gravity: 1200,
    bounciness: 0.4,
    fontSize: 24,
    revealDurationMs: 1500,
    shakePower: 800,
    jitterThreshold: 1500
  }
);

const emit = defineEmits<{
  (event: "update:modelValue", value: string): void;
  (event: "shake"): void;
  (event: "reveal"): void;
}>();

// --- Internal State ---
const boxRef = ref<HTMLElement | null>(null);
const canvasRef = ref<HTMLCanvasElement | null>(null);
const inputRef = ref<HTMLTextAreaElement | null>(null);

const innerValue = ref(String(props.modelValue ?? ""));
const isFocused = ref(false);
const revealing = ref(false);
const isComposing = ref(false);

const gravityValue = computed(() => Math.max(0, props.gravity));
const bounceValue = computed(() => Math.min(0.9, Math.max(0, props.bounciness)));
const isBrowser = typeof window !== "undefined";

let particles: Particle[] = [];
let nextParticleId = 0;
let rafId: number | null = null;
let lastTs = 0;
let revealTimer: number | null = null;
let lastMouseX = 0;
let lastMouseY = 0;
let lastMouseT = 0;

// Canvas metrics
let canvasWidth = 0;
let canvasHeight = 0;
let dpr = 1;

function focusInput() {
  if (props.disabled) return;
  inputRef.value?.focus();
}

function onInput(e: Event) {
  const value = (e.target as HTMLTextAreaElement).value ?? "";
  
  // If composing (IME active), we update the value but don't commit to particles
  if (isComposing.value) {
    innerValue.value = value;
    return;
  }

  innerValue.value = value;
  
  // Re-sync particles based on final committed text
  syncParticles(value);
  
  ensureAnimation();
  emit("update:modelValue", value);
}

function onCompositionStart() {
  isComposing.value = true;
}

function onCompositionEnd(e: CompositionEvent) {
  isComposing.value = false;
  // Use the standard input event mechanism to finalize
  const val = (e.target as HTMLTextAreaElement).value;
  syncParticles(val);
  ensureAnimation();
  emit("update:modelValue", val);
}

function onDelete() {
  // Keydown delete handled by standard input event mostly
}

function syncParticles(text: string) {
  if (!isBrowser) return;

  const currentCount = particles.length;
  const targetCount = text.length;

  if (targetCount > currentCount) {
    // Add missing particles
    for (let i = currentCount; i < targetCount; i++) {
      addParticle(text[i], i);
    }
  } else if (targetCount < currentCount) {
    // Remove extra particles
    particles = particles.slice(0, targetCount);
  }

  // Critical: Update character content for each particle (handles conversion from pinyin to Hanzi)
  for (let i = 0; i < targetCount; i++) {
    if (particles[i]) {
      particles[i].ch = text[i];
    }
  }
  
  updateTargetPositions();
}

function addParticle(ch: string, index: number) {
  const charWidth = props.fontSize * 0.6;
  const startX = 24 + index * charWidth;
  const startY = 40;

  particles.push({
    id: nextParticleId++,
    ch,
    x: startX,
    y: startY,
    vx: (Math.random() - 0.5) * 100,
    vy: (Math.random() - 0.5) * 100,
    targetX: startX,
    targetY: startY,
    angle: (Math.random() - 0.5) * 0.5,
    va: (Math.random() - 0.5) * 2
  });
}

function updateTargetPositions() {
  const charWidth = props.fontSize * 0.6;
  const paddingX = 24;
  const paddingY = 40;
  const maxWidth = canvasWidth - paddingX * 2;
  
  particles.forEach((p, i) => {
    const row = Math.floor((i * charWidth) / maxWidth);
    const col = i % Math.floor(maxWidth / charWidth);
    p.targetX = paddingX + col * charWidth;
    p.targetY = paddingY + row * (props.fontSize * 1.2);
  });
}

function shakeAndReveal() {
  if (props.disabled || innerValue.value.length === 0) return;
  
  revealing.value = true;
  emit("shake");
  emit("reveal");

  const power = props.shakePower;
  particles.forEach(p => {
    p.vx += (Math.random() - 0.5) * power;
    p.vy -= Math.random() * power;
    p.va += (Math.random() - 0.5) * 5;
  });

  if (revealTimer) clearTimeout(revealTimer);
  revealTimer = window.setTimeout(() => {
    revealing.value = false;
    revealTimer = null;
  }, props.revealDurationMs);

  ensureAnimation();
}

function clear() {
  innerValue.value = "";
  particles = [];
  emit("update:modelValue", "");
}

function resize() {
  if (!boxRef.value || !canvasRef.value) return;
  const rect = boxRef.value.getBoundingClientRect();
  canvasWidth = rect.width;
  canvasHeight = rect.height;
  dpr = window.devicePixelRatio || 1;
  
  canvasRef.value.width = canvasWidth * dpr;
  canvasRef.value.height = canvasHeight * dpr;
  updateTargetPositions();
}

function draw(ts: number) {
  if (!canvasRef.value) return;
  const ctx = canvasRef.value.getContext("2d");
  if (!ctx) return;

  const dt = Math.min(0.032, (ts - lastTs) / 1000);
  lastTs = ts;

  ctx.clearRect(0, 0, canvasRef.value.width, canvasRef.value.height);
  ctx.save();
  ctx.scale(dpr, dpr);

  ctx.font = `black ${props.fontSize}px ui-sans-serif, system-ui, -apple-system, sans-serif`;
  ctx.textBaseline = "middle";
  ctx.textAlign = "center";

  const g = gravityValue.value;
  const b = bounceValue.value;
  const floor = canvasHeight - 20;
  const wallL = 20;
  const wallR = canvasWidth - 20;

  let stillMoving = false;

  const isDark = document.documentElement.classList.contains('dark');

  particles.forEach(p => {
    if (revealing.value) {
      // "Shake to rearrange" - apply spring force towards target
      const dx = p.targetX - p.x;
      const dy = p.targetY - p.y;
      p.vx += dx * 15 * dt;
      p.vy += dy * 15 * dt;
      p.vx *= 0.92; // High damping when rearranging
      p.vy *= 0.92;
      p.angle *= 0.9; // Straighten up
    } else {
      // Gravity wins
      p.vy += g * dt;
      p.vx *= 0.995; // Air resistance
      p.angle += p.va * dt;
    }

    p.x += p.vx * dt;
    p.y += p.vy * dt;

    // Floor Collision
    if (p.y > floor) {
      p.y = floor;
      p.vy *= -b;
      p.va *= 0.5;
      p.vx *= 0.8; // Friction
    }
    
    // Wall Collisions
    if (p.x < wallL) {
      p.x = wallL;
      p.vx *= -b;
    } else if (p.x > wallR) {
      p.x = wallR;
      p.vx *= -b;
    }

    // Drawing
    ctx.save();
    ctx.translate(p.x, p.y);
    ctx.rotate(p.angle);
    if (revealing.value) {
      ctx.fillStyle = "#10b981"; // emerald-500
    } else {
      ctx.fillStyle = isDark ? "#f8fafc" : "#1e293b"; // slate-50 or slate-800
    }
    ctx.fillText(p.ch, 0, 0);
    ctx.restore();

    if (Math.abs(p.vx) > 1 || Math.abs(p.vy) > 1 || revealing.value) {
      stillMoving = true;
    }
  });

  ctx.restore();

  if (stillMoving || innerValue.value.length > 0) {
    rafId = requestAnimationFrame(draw);
  } else {
    rafId = null;
  }
}

function ensureAnimation() {
  if (rafId) return;
  lastTs = performance.now();
  rafId = requestAnimationFrame(draw);
}

function onMouseMove(e: MouseEvent) {
  if (props.disabled || innerValue.value.length === 0 || !isFocused.value) return;

  const t = performance.now();
  const dx = e.clientX - lastMouseX;
  const dy = e.clientY - lastMouseY;
  const dt = t - lastMouseT;
  
  if (dt > 0) {
    const speed = (Math.sqrt(dx * dx + dy * dy) / dt) * 1000;
    if (speed > props.jitterThreshold) {
      shakeAndReveal();
    }
  }

  lastMouseX = e.clientX;
  lastMouseY = e.clientY;
  lastMouseT = t;
}

onMounted(() => {
  resize();
  window.addEventListener("resize", resize);
  window.addEventListener("mousemove", onMouseMove);
  
  // Initial sync if modelValue exists
  if (props.modelValue) {
    syncParticles(String(props.modelValue));
  }
});

onBeforeUnmount(() => {
  window.removeEventListener("resize", resize);
  window.removeEventListener("mousemove", onMouseMove);
  if (rafId) cancelAnimationFrame(rafId);
});

// Sync from prop changes
watch(() => props.modelValue, (newVal) => {
  if (newVal !== innerValue.value) {
    syncParticles(String(newVal ?? ""));
    innerValue.value = String(newVal ?? "");
    ensureAnimation();
  }
});
</script>

<style scoped>
.ns-fade-enter-active,
.ns-fade-leave-active {
  transition: all 0.5s cubic-bezier(0.16, 1, 0.3, 1);
}

.ns-fade-enter-from,
.ns-fade-leave-to {
  opacity: 0;
  transform: translateY(10px);
}

@keyframes pulse-slow {
  0%, 100% { opacity: 0.2; }
  50% { opacity: 0.5; }
}

.animate-pulse {
  animation: pulse-slow 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}
</style>

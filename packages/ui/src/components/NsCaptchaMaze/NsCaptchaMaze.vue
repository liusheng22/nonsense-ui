<template>
  <div
    class="nsui nsui-card relative flex flex-col gap-6 p-8 w-full max-w-[960px] select-none bg-white dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-800 rounded-[32px] shadow-xl overflow-hidden"
  >
    <!-- Header -->
    <div class="flex items-center justify-between">
      <div class="flex flex-col gap-1">
        <h3 class="text-xl font-black tracking-tighter text-slate-900 dark:text-white uppercase">
          人机验证
        </h3>
        <p class="text-xs text-slate-400 font-bold uppercase tracking-widest">
          NS-CAPTCHA v0.0.1
        </p>
      </div>
      <div class="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
        <span class="text-lg">🤖</span>
      </div>
    </div>

    <!-- Main Interaction Area -->
    <div 
      ref="areaEl"
      class="relative w-full h-[440px] bg-slate-50 dark:bg-slate-800/50 rounded-2xl border-2 border-slate-100 dark:border-slate-700 overflow-hidden group touch-none"
      @mouseleave="onMouseLeaveArea"
      @pointermove="onPointerMove"
      @pointerup="onPointerUp"
      @pointercancel="onPointerCancel"
      @contextmenu.prevent
    >
      <!-- Game Layer (Always rendered for layout, but interactive state changes) -->
      <div 
        class="absolute inset-0 z-10 transition-all duration-500"
        :class="{
          'blur-sm opacity-40 grayscale': gameState === 'idle' || gameState === 'verified' || gameState === 'failed',
          'pointer-events-none': gameState === 'idle' || gameState === 'verified' || gameState === 'failed'
        }"
      >
        <!-- Maze Canvas -->
        <div class="absolute inset-0 z-0">
          <svg
            v-if="maze"
            class="absolute inset-0"
            :viewBox="`0 0 ${maze.viewWidth} ${maze.viewHeight}`"
            preserveAspectRatio="xMidYMid meet"
          >
            <rect x="0" y="0" :width="maze.viewWidth" :height="maze.viewHeight" fill="transparent" />

            <rect
              :x="maze.offsetX"
              :y="maze.offsetY"
              :width="maze.cols * maze.cellSize"
              :height="maze.rows * maze.cellSize"
              class="nsui-maze-board"
              rx="18"
            />

            <circle
              v-if="maze"
              :cx="maze.offsetX + (maze.end.col + 0.5) * maze.cellSize"
              :cy="maze.offsetY + (maze.end.row + 0.5) * maze.cellSize"
              :r="Math.max(10, Math.floor(maze.cellSize * 0.28))"
              class="nsui-maze-exit"
            />

            <text
              v-if="maze"
              :x="maze.offsetX + (maze.end.col + 0.5) * maze.cellSize"
              :y="maze.offsetY + (maze.end.row + 0.5) * maze.cellSize + 3"
              text-anchor="middle"
              class="nsui-maze-exit-text"
            >
              END
            </text>

            <g v-if="gameState === 'playing' && showStartAssist && startAssistPath">
              <path
                :d="startAssistPath"
                class="nsui-maze-start-assist"
                stroke-linecap="round"
                stroke-linejoin="round"
                fill="none"
                vector-effect="non-scaling-stroke"
              />
            </g>

            <polyline
              v-if="gameState === 'playing' && trailPoints"
              :points="trailPoints"
              class="nsui-maze-trail"
              fill="none"
              :stroke-width="mazeTrailWidth"
              stroke-linecap="round"
              stroke-linejoin="round"
            />

            <path
              :d="mazeWallPath"
              class="nsui-maze-walls"
              :stroke-width="maze.wallWidth"
              vector-effect="non-scaling-stroke"
              stroke-linecap="round"
              stroke-linejoin="round"
              fill="none"
            />
          </svg>
        </div>

        <!-- Start Zone -->
        <div 
          ref="startEl"
          class="absolute -translate-x-1/2 -translate-y-1/2 rounded-full flex items-center justify-center font-black transition-all duration-300 z-20"
          :class="[
            gameState === 'waiting' ? 'w-14 h-14 border-4 text-xs bg-gradient-to-br from-blue-500 to-blue-600 border-blue-200 text-white scale-110 animate-pulse cursor-grab active:cursor-grabbing shadow-[0_0_22px_rgba(59,130,246,0.5)]' : 
            gameState === 'playing' ? 'w-8 h-8 border-2 text-[10px] bg-blue-50/70 border-blue-300/70 text-blue-600 shadow-sm pointer-events-none opacity-60' : 
            'w-14 h-14 border-4 text-xs bg-slate-200 border-slate-300 text-slate-400'
          ]"
          :style="startStyle"
          @pointerdown.prevent.stop="onStartPointerDown"
        >
          <span v-if="gameState === 'waiting'">START</span>
        </div>

        <!-- Cursor / Player Dot -->
        <div
          v-if="gameState === 'playing'"
          class="nsui-maze-dot absolute z-30"
          :class="{ 'opacity-0': !isHolding }"
          :style="{
            left: `${dot.x}px`,
            top: `${dot.y}px`,
            width: `${dotDiameter}px`,
            height: `${dotDiameter}px`
          }"
        ></div>
      </div>

      <!-- Overlays -->
      
      <!-- IDLE: Start Button -->
      <div 
        v-if="gameState === 'idle'"
        class="absolute inset-0 z-30 flex items-center justify-center bg-white/10 dark:bg-black/10 backdrop-blur-[2px] pointer-events-auto"
      >
        <button
          type="button"
          class="group relative px-8 py-4 bg-white dark:bg-slate-800 rounded-2xl shadow-xl border-2 border-slate-200 dark:border-slate-700 hover:scale-105 active:scale-95 transition-all pointer-events-auto"
          @click.stop="requestStart"
        >
          <div class="flex items-center gap-3">
            <div class="w-5 h-5 border-2 border-slate-400 rounded animate-spin-slow"></div>
            <span class="font-black text-slate-700 dark:text-slate-200 text-lg">点击开始验证</span>
          </div>
          <div class="absolute -bottom-8 left-0 right-0 text-center text-[10px] text-slate-400 font-bold opacity-0 group-hover:opacity-100 transition-opacity">
            (请准备好你的鼠标)
          </div>
        </button>
      </div>

      <!-- WAITING: Instruction -->
      <div 
        v-else-if="gameState === 'waiting'" 
        class="absolute inset-0 z-30 pointer-events-none"
      >
        <div
          class="absolute left-1/2 top-3 -translate-x-1/2 transition-opacity duration-500"
          :class="showHint ? 'opacity-100' : 'opacity-0'"
        >
          <div class="bg-blue-600/95 text-white px-4 py-2 rounded-full text-sm font-bold shadow-lg backdrop-blur-sm">
            1) 按住 START  2) 拖动穿迷宫  3) 到 END 才算人类
          </div>
        </div>
      </div>

      <!-- PLAYING: Subtle Reminder -->
      <div
        v-else-if="gameState === 'playing'"
        class="absolute inset-0 z-30 pointer-events-none"
      >
        <div class="absolute right-3 top-3">
          <div class="nsui-maze-chip">
            别松手
          </div>
        </div>
      </div>

      <!-- FAILED: Retry -->
      <div 
        v-else-if="gameState === 'failed'"
        class="absolute inset-0 z-40 flex flex-col items-center justify-center bg-red-50/90 dark:bg-red-900/90 backdrop-blur-sm animate-in fade-in zoom-in duration-200"
      >
        <div class="text-6xl mb-4 animate-shake">🤖</div>
        <h4 class="text-2xl font-black text-red-600 dark:text-red-400 mb-2">验证失败</h4>
        <p class="text-red-500/80 font-bold mb-1">{{ failReasonText }}</p>
        <p class="text-red-500/70 text-sm font-semibold mb-6">提示：按住 START 不松手，沿通道走。</p>
        <button 
          class="px-8 py-3 bg-red-600 hover:bg-red-700 text-white rounded-xl font-bold shadow-lg hover:shadow-red-500/30 transition-all active:scale-95"
          @click="resetGame"
        >
          再试一次
        </button>
      </div>

      <!-- VERIFIED: Success -->
      <div 
        v-else-if="gameState === 'verified'"
        class="absolute inset-0 z-40 flex flex-col items-center justify-center bg-emerald-50/90 dark:bg-emerald-900/90 backdrop-blur-sm animate-in fade-in zoom-in duration-300"
      >
        <div class="text-6xl mb-4 animate-bounce">🎉</div>
        <h4 class="text-2xl font-black text-emerald-600 dark:text-emerald-400 mb-2">人类认证通过</h4>
        <p class="text-emerald-500/80 font-bold mb-6">恭喜你，你的手稳得像个外科医生。</p>
        <button 
          class="px-8 py-3 bg-white text-emerald-600 border-2 border-emerald-100 rounded-xl font-bold shadow-lg hover:bg-emerald-50 transition-all"
          @click="resetGame"
        >
          重置
        </button>
      </div>

    </div>

    <!-- Footer Status -->
    <div class="h-6 flex items-center justify-center text-[10px] font-mono uppercase tracking-widest transition-colors duration-300"
      :class="{
        'text-slate-300 dark:text-slate-600': gameState === 'idle',
        'text-blue-500 font-bold': gameState === 'waiting',
        'text-orange-500 font-bold': gameState === 'playing',
        'text-red-500 font-bold': gameState === 'failed',
        'text-emerald-500 font-bold': gameState === 'verified',
      }"
    >
      <span v-if="gameState === 'idle'">System Standby</span>
      <span v-else-if="gameState === 'waiting'">Waiting for input...</span>
      <span v-else-if="gameState === 'playing'">Tracking Biological Movement...</span>
      <span v-else-if="gameState === 'failed'">Bot Detected</span>
      <span v-else-if="gameState === 'verified'">Human Verified</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, nextTick, onMounted, onUnmounted, ref, watch } from "vue";

defineOptions({ name: "NsCaptchaMaze" });

type Difficulty = "easy" | "hard" | "impossible";
type Direction = "N" | "E" | "S" | "W";

type Cell = Record<Direction, boolean>;

type Maze = {
  rows: number;
  cols: number;
  cellSize: number;
  wallWidth: number;
  dotDiameter: number;
  offsetX: number;
  offsetY: number;
  viewWidth: number;
  viewHeight: number;
  cells: Cell[][];
  start: { row: number; col: number };
  end: { row: number; col: number };
};

const props = withDefaults(
  defineProps<{
    difficulty?: Difficulty;
    wallSensitivity?: number;
  }>(),
  {
    difficulty: "hard",
    wallSensitivity: 6
  }
);

const emit = defineEmits<{
  (event: 'success'): void
  (event: 'fail'): void
}>()

const gameState = ref<'idle' | 'waiting' | 'playing' | 'verified' | 'failed'>('idle')
const areaEl = ref<HTMLElement | null>(null);
const startEl = ref<HTMLElement | null>(null);
const isHolding = ref(false);
const activePointerId = ref<number | null>(null);
const dot = ref({ x: 0, y: 0 });
const lastDot = ref<{ x: number; y: number } | null>(null);
const maze = ref<Maze | null>(null);
const resizeObserver = ref<ResizeObserver | null>(null);
const showHint = ref(true);
const hintTimeout = ref<number | null>(null);
const failReason = ref<"wall" | "release" | "leave" | "cancel" | null>(null);
const trail = ref<Array<{ x: number; y: number }>>([]);
const showStartAssist = ref(false);
const startAssistTimeout = ref<number | null>(null);

const difficulty = computed(() => props.difficulty);
const mazeWallPath = computed(() => {
  const m = maze.value;
  if (!m) return "";

  const commands: string[] = [];
  const size = m.cellSize;
  const ox = m.offsetX;
  const oy = m.offsetY;

  for (let row = 0; row < m.rows; row++) {
    for (let col = 0; col < m.cols; col++) {
      const cell = m.cells[row]?.[col];
      if (!cell) continue;
      const x = ox + col * size;
      const y = oy + row * size;
      if (cell.N) commands.push(`M ${x} ${y} L ${x + size} ${y}`);
      if (cell.W) commands.push(`M ${x} ${y} L ${x} ${y + size}`);
      if (row === m.rows - 1 && cell.S)
        commands.push(`M ${x} ${y + size} L ${x + size} ${y + size}`);
      if (col === m.cols - 1 && cell.E)
        commands.push(`M ${x + size} ${y} L ${x + size} ${y + size}`);
    }
  }
  return commands.join(" ");
});

const startStyle = computed(() => {
  const m = maze.value;
  if (!m) return {};
  const x = m.offsetX + (m.start.col + 0.5) * m.cellSize;
  const y = m.offsetY + (m.start.row + 0.5) * m.cellSize;
  return { left: `${x}px`, top: `${y}px` };
});

const dotDiameter = computed(() => maze.value?.dotDiameter ?? 12);

const mazeTrailWidth = computed(() => {
  const m = maze.value;
  if (!m) return 8;
  return Math.max(6, Math.floor(m.dotDiameter * 0.7));
});

function computeStartExitDirection(m: Maze): Direction {
  const cell = m.cells[m.start.row]?.[m.start.col];
  if (!cell) return "E";
  if (!cell.E) return "E";
  if (!cell.N) return "N";
  if (!cell.S) return "S";
  return "E";
}

const startAssistPath = computed(() => {
  const m = maze.value;
  if (!m) return "";
  const dir = computeStartExitDirection(m);
  const cx = m.offsetX + (m.start.col + 0.5) * m.cellSize;
  const cy = m.offsetY + (m.start.row + 0.5) * m.cellSize;
  const length = Math.max(22, Math.floor(m.cellSize * 1.2));
  const shaft = Math.max(16, Math.floor(length * 0.7));
  const head = Math.max(10, Math.floor(length * 0.35));

  const dx = dir === "E" ? 1 : dir === "W" ? -1 : 0;
  const dy = dir === "S" ? 1 : dir === "N" ? -1 : 0;

  const x1 = cx + dx * 10;
  const y1 = cy + dy * 10;
  const x2 = x1 + dx * shaft;
  const y2 = y1 + dy * shaft;
  const x3 = x2 + dx * head;
  const y3 = y2 + dy * head;

  const px = dy;
  const py = -dx;
  const wing = Math.max(7, Math.floor(head * 0.45));

  const hx1 = x2 + px * wing;
  const hy1 = y2 + py * wing;
  const hx2 = x2 - px * wing;
  const hy2 = y2 - py * wing;

  return `M ${x1} ${y1} L ${x2} ${y2} M ${hx1} ${hy1} L ${x3} ${y3} L ${hx2} ${hy2}`;
});

const trailPoints = computed(() => {
  if (gameState.value !== "playing") return "";
  if (!trail.value.length) return "";
  return trail.value.map((p) => `${p.x},${p.y}`).join(" ");
});

const failReasonText = computed(() => {
  if (failReason.value === "wall") return "你碰到墙了（机器人喜欢贴墙走）。";
  if (failReason.value === "release") return "你松手了（人类不会半途而废）。";
  if (failReason.value === "leave") return "你逃离了验证区域（可疑）。";
  if (failReason.value === "cancel") return "你的指针被系统打断了（借口）。";
  return "手太抖了？还是说...你就是个机器人？";
});

function requestStart() {
  generateMaze();
  showHint.value = true;
  if (hintTimeout.value != null) window.clearTimeout(hintTimeout.value);
  hintTimeout.value = window.setTimeout(() => {
    showHint.value = false;
  }, 1800);
  failReason.value = null;
  gameState.value = "waiting";
}

function clamp(numberValue: number, minValue: number, maxValue: number) {
  return Math.max(minValue, Math.min(maxValue, numberValue));
}

function randomInt(minValue: number, maxValue: number) {
  return Math.floor(Math.random() * (maxValue - minValue + 1)) + minValue;
}

function createEmptyCells(rows: number, cols: number): Cell[][] {
  return Array.from({ length: rows }, () =>
    Array.from({ length: cols }, () => ({ N: true, E: true, S: true, W: true }))
  );
}

function shuffle<T>(items: T[]) {
  for (let i = items.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [items[i], items[j]] = [items[j], items[i]];
  }
  return items;
}

function carveMaze(cells: Cell[][]) {
  const rows = cells.length;
  const cols = cells[0]?.length ?? 0;
  const visited = Array.from({ length: rows }, () => Array.from({ length: cols }, () => false));
  const stack: Array<{ row: number; col: number }> = [];
  const startRow = randomInt(0, rows - 1);
  const startCol = randomInt(0, cols - 1);

  visited[startRow][startCol] = true;
  stack.push({ row: startRow, col: startCol });

  const neighbors = (row: number, col: number) => {
    const list: Array<{ row: number; col: number; dir: Direction; opposite: Direction }> = [];
    if (row > 0) list.push({ row: row - 1, col, dir: "N", opposite: "S" });
    if (col < cols - 1) list.push({ row, col: col + 1, dir: "E", opposite: "W" });
    if (row < rows - 1) list.push({ row: row + 1, col, dir: "S", opposite: "N" });
    if (col > 0) list.push({ row, col: col - 1, dir: "W", opposite: "E" });
    return shuffle(list);
  };

  while (stack.length > 0) {
    const current = stack[stack.length - 1];
    const options = neighbors(current.row, current.col).filter(
      (n) => !visited[n.row]?.[n.col]
    );

    if (options.length === 0) {
      stack.pop();
      continue;
    }

    const next = options[0];
    const currentCell = cells[current.row]?.[current.col];
    const nextCell = cells[next.row]?.[next.col];
    if (!currentCell || !nextCell) continue;

    currentCell[next.dir] = false;
    nextCell[next.opposite] = false;
    visited[next.row][next.col] = true;
    stack.push({ row: next.row, col: next.col });
  }
}

function pickGridSize(level: Difficulty) {
  if (level === "easy") return { rows: 9, cols: 13 };
  if (level === "hard") return { rows: 13, cols: 19 };
  return { rows: 13, cols: 19 };
}

function generateMaze() {
  const area = areaEl.value;
  if (!area) return;
  const rect = area.getBoundingClientRect();
  const padding = 18;
  const { rows, cols } = pickGridSize(props.difficulty);
  const cellSize = Math.floor(
    Math.min((rect.width - padding * 2) / cols, (rect.height - padding * 2) / rows)
  );
  const normalizedCellSize = clamp(cellSize, 14, 72);
  const dotDiameter = clamp(Math.floor(normalizedCellSize * 0.32), 10, 14);
  const desiredWall = (props.wallSensitivity ?? 6) * 2;
  const minCorridor = dotDiameter + 8;
  const maxWall = Math.max(2, Math.floor(normalizedCellSize - minCorridor));
  const wallWidth = clamp(desiredWall, 2, maxWall);

  const boardWidth = cols * normalizedCellSize;
  const boardHeight = rows * normalizedCellSize;
  const offsetX = Math.floor(padding + (rect.width - padding * 2 - boardWidth) / 2);
  const offsetY = Math.floor(padding + (rect.height - padding * 2 - boardHeight) / 2);

  const cells = createEmptyCells(rows, cols);
  carveMaze(cells);

  const start = { row: randomInt(0, rows - 1), col: clamp(1, 1, cols - 2) };
  const end = { row: randomInt(0, rows - 1), col: clamp(cols - 2, 1, cols - 2) };

  if (props.difficulty === "impossible") {
    cells[end.row][end.col] = { N: true, E: true, S: true, W: true };
  }

  maze.value = {
    rows,
    cols,
    cellSize: normalizedCellSize,
    wallWidth,
    dotDiameter,
    offsetX,
    offsetY,
    viewWidth: Math.floor(rect.width),
    viewHeight: Math.floor(rect.height),
    cells,
    start,
    end
  };
}

onMounted(() => {
  generateMaze();
  resizeObserver.value = new ResizeObserver(() => {
    generateMaze();
  });
  if (areaEl.value) resizeObserver.value.observe(areaEl.value);
});

watch(difficulty, async () => {
  await nextTick();
  generateMaze();
});

function setDotFromEvent(event: PointerEvent) {
  const rect = areaEl.value?.getBoundingClientRect();
  if (!rect) return;
  const x = Math.max(0, Math.min(rect.width, event.clientX - rect.left));
  const y = Math.max(0, Math.min(rect.height, event.clientY - rect.top));
  dot.value = { x, y };
}

function isInEndZone(x: number, y: number) {
  const m = maze.value;
  if (!m) return false;
  const cx = m.offsetX + (m.end.col + 0.5) * m.cellSize;
  const cy = m.offsetY + (m.end.row + 0.5) * m.cellSize;
  const half = Math.min(26, Math.floor(m.cellSize * 0.55));
  return x >= cx - half && x <= cx + half && y >= cy - half && y <= cy + half;
}

function hitWallAtPoint(x: number, y: number) {
  const m = maze.value;
  if (!m) return true;

  const left = m.offsetX;
  const top = m.offsetY;
  const right = m.offsetX + m.cols * m.cellSize;
  const bottom = m.offsetY + m.rows * m.cellSize;
  if (x < left || x > right || y < top || y > bottom) return true;

  const col = clamp(Math.floor((x - left) / m.cellSize), 0, m.cols - 1);
  const row = clamp(Math.floor((y - top) / m.cellSize), 0, m.rows - 1);
  const cell = m.cells[row]?.[col];
  if (!cell) return true;

  const localX = x - (left + col * m.cellSize);
  const localY = y - (top + row * m.cellSize);
  const dotRadius = m.dotDiameter / 2;
  const wallHalf = m.wallWidth / 2;
  const hitMargin = clamp(Math.ceil(wallHalf + dotRadius), 4, Math.floor(m.cellSize / 2));

  if (cell.N && localY <= hitMargin) return true;
  if (cell.S && localY >= m.cellSize - hitMargin) return true;
  if (cell.W && localX <= hitMargin) return true;
  if (cell.E && localX >= m.cellSize - hitMargin) return true;
  return false;
}

function fail() {
  if (gameState.value !== "playing") return;
  gameState.value = "failed";
  isHolding.value = false;
  lastDot.value = null;
  trail.value = [];
  if (activePointerId.value != null && areaEl.value?.hasPointerCapture(activePointerId.value)) {
    areaEl.value.releasePointerCapture(activePointerId.value);
  }
  activePointerId.value = null;
  emit("fail");
}

function succeed() {
  if (gameState.value !== "playing") return;
  gameState.value = "verified";
  isHolding.value = false;
  lastDot.value = null;
  trail.value = [];
  if (activePointerId.value != null && areaEl.value?.hasPointerCapture(activePointerId.value)) {
    areaEl.value.releasePointerCapture(activePointerId.value);
  }
  activePointerId.value = null;
  emit("success");
}

function onStartPointerDown(event: PointerEvent) {
  if (gameState.value !== "waiting") return;
  if (!areaEl.value) return;
  activePointerId.value = event.pointerId;
  areaEl.value.setPointerCapture(event.pointerId);
  setDotFromEvent(event);
  lastDot.value = { ...dot.value };
  trail.value = [{ ...dot.value }];
  failReason.value = null;
  showHint.value = false;
  showStartAssist.value = true;
  if (startAssistTimeout.value != null) window.clearTimeout(startAssistTimeout.value);
  startAssistTimeout.value = window.setTimeout(() => {
    showStartAssist.value = false;
  }, 1200);
  isHolding.value = true;
  gameState.value = "playing";
}

function onPointerMove(event: PointerEvent) {
  if (gameState.value !== "playing") return;
  if (!isHolding.value) return;
  if (activePointerId.value !== event.pointerId) return;

  setDotFromEvent(event);
  const current = { ...dot.value };
  const previous = lastDot.value ?? current;
  lastDot.value = current;

  if (!trail.value.length || Math.hypot(current.x - trail.value[trail.value.length - 1].x, current.y - trail.value[trail.value.length - 1].y) > 6) {
    trail.value.push(current);
    if (trail.value.length > 240) trail.value.shift();
  }

  const dx = current.x - previous.x;
  const dy = current.y - previous.y;
  const dist = Math.hypot(dx, dy);
  const step = Math.max(6, Math.floor((maze.value?.cellSize ?? 24) / 3));
  const steps = Math.max(1, Math.ceil(dist / step));

  for (let i = 0; i <= steps; i++) {
    const t = steps === 0 ? 1 : i / steps;
    const sx = previous.x + dx * t;
    const sy = previous.y + dy * t;
    if (hitWallAtPoint(sx, sy)) {
      failReason.value = "wall";
      fail();
      return;
    }
    if (isInEndZone(sx, sy)) {
      succeed();
      return;
    }
  }
}

function onPointerUp(event: PointerEvent) {
  if (activePointerId.value !== event.pointerId) return;
  if (gameState.value === "playing" && isHolding.value) {
    failReason.value = "release";
    fail();
  }
}

function onPointerCancel(event: PointerEvent) {
  if (activePointerId.value !== event.pointerId) return;
  if (gameState.value === "playing" && isHolding.value) {
    failReason.value = "cancel";
    fail();
  }
}

function onMouseLeaveArea() {
  if (gameState.value === "playing" && isHolding.value) {
    failReason.value = "leave";
    fail();
  }
}

function resetGame() {
  if (activePointerId.value != null && areaEl.value?.hasPointerCapture(activePointerId.value)) {
    areaEl.value.releasePointerCapture(activePointerId.value);
  }
  activePointerId.value = null;
  isHolding.value = false;
  gameState.value = "idle";
  dot.value = { x: 0, y: 0 };
  lastDot.value = null;
  trail.value = [];
  failReason.value = null;
  showStartAssist.value = false;
  generateMaze();
  showHint.value = true;
}

onUnmounted(() => {
  if (hintTimeout.value != null) window.clearTimeout(hintTimeout.value);
  if (startAssistTimeout.value != null) window.clearTimeout(startAssistTimeout.value);
  if (areaEl.value && resizeObserver.value) resizeObserver.value.unobserve(areaEl.value);
  resizeObserver.value?.disconnect();
  resizeObserver.value = null;
});
</script>

<style scoped>
.nsui-maze-board {
  fill: rgba(148, 163, 184, 0.10);
  stroke: rgba(148, 163, 184, 0.25);
  stroke-width: 2;
}

.dark .nsui-maze-board {
  fill: rgba(148, 163, 184, 0.07);
  stroke: rgba(148, 163, 184, 0.16);
}

.nsui-maze-walls {
  stroke: rgba(148, 163, 184, 0.95);
}

.dark .nsui-maze-walls {
  stroke: rgba(71, 85, 105, 1);
}

.nsui-maze-exit {
  fill: rgba(16, 185, 129, 0.08);
  stroke: rgba(16, 185, 129, 0.85);
  stroke-width: 6;
  filter: drop-shadow(0 14px 28px rgba(16, 185, 129, 0.22));
}

.dark .nsui-maze-exit {
  fill: rgba(16, 185, 129, 0.06);
  stroke: rgba(52, 211, 153, 0.75);
}

.group:has(.nsui-maze-dot) .nsui-maze-walls {
  stroke: rgba(100, 116, 139, 1);
}

.dark .group:has(.nsui-maze-dot) .nsui-maze-walls {
  stroke: rgba(100, 116, 139, 0.9);
}

.nsui-maze-trail {
  stroke: rgba(59, 130, 246, 0.25);
  filter: drop-shadow(0 10px 18px rgba(37, 99, 235, 0.18));
}

.dark .nsui-maze-trail {
  stroke: rgba(96, 165, 250, 0.22);
}

.nsui-maze-start-assist {
  stroke: rgba(59, 130, 246, 0.65);
  stroke-width: 6;
  filter: drop-shadow(0 12px 22px rgba(37, 99, 235, 0.18));
}

.dark .nsui-maze-start-assist {
  stroke: rgba(147, 197, 253, 0.55);
}

.nsui-maze-chip {
  @apply text-[11px] font-black tracking-widest uppercase px-3 py-1 rounded-full;
  color: rgba(59, 130, 246, 0.95);
  background: rgba(255, 255, 255, 0.85);
  border: 1px solid rgba(59, 130, 246, 0.2);
  backdrop-filter: blur(6px);
}

.dark .nsui-maze-chip {
  color: rgba(147, 197, 253, 0.95);
  background: rgba(15, 23, 42, 0.6);
  border: 1px solid rgba(59, 130, 246, 0.18);
}

.nsui-maze-dot {
  border-radius: 9999px;
  transform: translate(-50%, -50%);
  background: radial-gradient(circle at 30% 30%, #ffffff 0%, #60a5fa 30%, #2563eb 100%);
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.15), 0 10px 30px rgba(37, 99, 235, 0.25);
  transition: opacity 120ms ease;
}

.nsui-maze-exit-text {
  fill: rgba(6, 95, 70, 0.7);
  font-size: 10px;
  font-weight: 900;
  letter-spacing: 0.12em;
  pointer-events: none;
  user-select: none;
}

.dark .nsui-maze-exit-text {
  fill: rgba(167, 243, 208, 0.65);
}

.animate-spin-slow {
  animation: spin 3s linear infinite;
}

@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

@keyframes shake {
  0%, 100% { transform: translateX(0); }
  25% { transform: translateX(-5px) rotate(-5deg); }
  75% { transform: translateX(5px) rotate(5deg); }
}

.animate-shake {
  animation: shake 0.4s ease-in-out;
}
</style>

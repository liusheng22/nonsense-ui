<template>
  <div
    class="nsui nsui-card relative inline-flex flex-col gap-6 p-8 min-w-[380px] select-none bg-white dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-800 rounded-[32px] shadow-xl overflow-hidden"
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
      class="relative w-full h-[240px] bg-slate-50 dark:bg-slate-800/50 rounded-2xl border-2 border-slate-100 dark:border-slate-700 overflow-hidden group"
      @mouseleave="onMouseLeaveArea"
    >
      <!-- Game Layer (Always rendered for layout, but interactive state changes) -->
      <div 
        class="absolute inset-0 z-10 transition-all duration-500"
        :class="{
          'blur-sm opacity-40 grayscale': gameState === 'idle' || gameState === 'verified' || gameState === 'failed',
          'pointer-events-none': gameState === 'idle' || gameState === 'verified' || gameState === 'failed'
        }"
      >
        <!-- Start Zone -->
        <div 
          class="absolute left-6 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full flex items-center justify-center border-4 text-xs font-black transition-all duration-300 z-20"
          :class="[
            gameState === 'waiting' ? 'bg-blue-500 border-blue-200 text-white scale-110 animate-pulse cursor-crosshair shadow-[0_0_20px_rgba(59,130,246,0.5)]' : 
            gameState === 'playing' ? 'bg-blue-100 border-blue-300 text-blue-400' : 
            'bg-slate-200 border-slate-300 text-slate-400'
          ]"
          @mouseenter="onEnterStart"
        >
          START
        </div>

        <!-- End Zone -->
        <div 
          class="absolute right-6 top-1/2 -translate-y-1/2 w-12 h-12 rounded-lg flex items-center justify-center border-4 text-xs font-black transition-all duration-300 z-20"
          :class="[
            gameState === 'playing' ? 'bg-emerald-100 border-emerald-400 text-emerald-600 cursor-pointer hover:bg-emerald-500 hover:text-white hover:scale-110' : 
            'bg-slate-200 border-slate-300 text-slate-400'
          ]"
          @mouseenter="onEnterEnd"
        >
          END
        </div>

        <!-- Walls Container -->
        <div class="absolute inset-0 pointer-events-none">
           <!-- EASY MAP -->
           <template v-if="difficulty === 'easy'">
              <div class="wall absolute top-0 left-0 right-0 h-[80px]" @mouseenter="onHitWall"></div>
              <div class="wall absolute bottom-0 left-0 right-0 h-[80px]" @mouseenter="onHitWall"></div>
           </template>

           <!-- HARD MAP (S-Shape) -->
           <template v-else-if="difficulty === 'hard'">
              <!-- Top Block -->
              <div class="wall absolute top-0 left-[80px] right-0 h-[80px]" @mouseenter="onHitWall"></div>
              <!-- Bottom Block -->
              <div class="wall absolute bottom-0 left-0 right-[80px] h-[80px]" @mouseenter="onHitWall"></div>
              <!-- Middle Obstacle -->
              <div class="wall absolute top-[80px] bottom-[80px] left-[140px] right-[140px]" @mouseenter="onHitWall"></div>
           </template>

           <!-- IMPOSSIBLE MAP -->
           <template v-else>
               <!-- Narrow Tunnel -->
               <div class="wall absolute top-0 left-0 right-0 h-[100px]" @mouseenter="onHitWall"></div>
               <div class="wall absolute bottom-0 left-0 right-0 h-[100px]" @mouseenter="onHitWall"></div>
               <!-- Invisible Wall near End -->
               <div class="wall absolute top-0 bottom-0 right-[70px] w-4 bg-transparent cursor-none z-30" @mouseenter="onHitWall"></div>
           </template>
        </div>
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
        class="absolute inset-0 z-30 flex flex-col items-center justify-center pointer-events-none"
      >
         <div class="bg-blue-600 text-white px-4 py-2 rounded-full text-sm font-bold shadow-lg animate-bounce">
            👈 请移动到起点
         </div>
      </div>

      <!-- FAILED: Retry -->
      <div 
        v-else-if="gameState === 'failed'"
        class="absolute inset-0 z-40 flex flex-col items-center justify-center bg-red-50/90 dark:bg-red-900/90 backdrop-blur-sm animate-in fade-in zoom-in duration-200"
      >
        <div class="text-6xl mb-4 animate-shake">🤖</div>
        <h4 class="text-2xl font-black text-red-600 dark:text-red-400 mb-2">验证失败</h4>
        <p class="text-red-500/80 font-bold mb-6">手太抖了？还是说...你就是个机器人？</p>
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
import { ref } from 'vue'

defineOptions({ name: "NsCaptchaMaze" });

const props = withDefaults(defineProps<{
  difficulty?: 'easy' | 'hard' | 'impossible'
}>(), {
  difficulty: 'hard'
})

const emit = defineEmits<{
  (event: 'success'): void
  (event: 'fail'): void
}>()

const gameState = ref<'idle' | 'waiting' | 'playing' | 'verified' | 'failed'>('idle')

function requestStart() {
  gameState.value = 'waiting'
}

function onEnterStart() {
  if (gameState.value === 'waiting') {
    gameState.value = 'playing'
  }
}

function onMouseLeaveArea() {
  // Only reset if we are waiting. If playing, leaving the area is a fail (or safe?).
  // Let's make leaving the area a fail for strictness.
  if (gameState.value === 'playing') {
    gameState.value = 'failed'
    emit('fail')
  } else if (gameState.value === 'waiting') {
    // reset if they leave while waiting? maybe not, just stay waiting.
    gameState.value = 'idle'
  }
}

function resetGame() {
  gameState.value = 'idle'
}

function onHitWall() {
  if (gameState.value === 'playing') {
    gameState.value = 'failed'
    emit('fail')
  }
}

function onEnterEnd() {
  if (gameState.value === 'playing') {
    gameState.value = 'verified'
    emit('success')
  }
}
</script>

<style scoped>
.wall {
    @apply bg-slate-200 dark:bg-slate-700 pointer-events-auto transition-colors duration-300;
}

/* Danger pattern for walls when playing */
.group:has(.wall:hover) .wall {
    @apply bg-red-100 dark:bg-red-900/40;
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

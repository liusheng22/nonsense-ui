# NsCaptchaMaze 迷宫验证码

为了证明“你不是机器人”，请像个真正的有机生物一样，颤抖着手走完这个迷宫。

### 🤖 为什么选择它？
传统的验证码只需要点击一下，太缺乏挑战性了。本组件引入了**生物运动学验证**：
- **精准惩罚**：碰到墙壁不仅仅是失败，更是对你“帕金森手抖”的嘲讽。
- **不可预测性**：迷宫是静态的，但你的手不是。

### 🎮 演示

<div class="flex flex-col gap-4">
  <div class="demo-box">
    <h4>简单模式 (Easy)</h4>
    <p class="text-sm opacity-60 mb-2">直来直去，如果你连这个都过不了...</p>
    <NsCaptchaMaze difficulty="easy" />
  </div>

  <div class="demo-box">
    <h4>困难模式 (Hard)</h4>
    <p class="text-sm opacity-60 mb-2">这里有个弯，小心翻车。</p>
    <NsCaptchaMaze difficulty="hard" />
  </div>

  <div class="demo-box">
    <h4>绝望模式 (Impossible)</h4>
    <p class="text-sm opacity-60 mb-2">理论上存在通路的...大概？</p>
    <NsCaptchaMaze difficulty="impossible" />
  </div>
</div>

### 📚 使用方法

```vue
<template>
  <NsCaptchaMaze 
    difficulty="hard" 
    @success="handleSuccess" 
    @fail="handleFail" 
  />
</template>
```

### 属性 (Props)

| 属性名 | 类型 | 默认值 | 说明 |
| :--- | :--- | :--- | :--- |
| `difficulty` | `'easy' \| 'hard' \| 'impossible'` | `'hard'` | 难度级别。`impossible` 模式下出口会被隐形墙挡住。 |

### 事件 (Events)

| 事件名 | 说明 |
| :--- | :--- |
| `success` | 当用户奇迹般地到达终点时触发。 |
| `fail` | 当用户（大概率）碰到墙壁时触发。 |

# NsCaptchaMaze 迷宫验证码

这是一个“验活”用的整蛊验证码：机器只需要点一下，你需要把手抖着走完迷宫，才算通过。

### 🤖 为什么选择它？
传统验证码只要点一下，太便宜了。本组件引入**生物运动学验证**，强迫用户证明“我真的是个抖得动鼠标的人类”：
- **墙是裁判**：碰壁即判负，没有弹窗赦免。
- **微颤识别**：迷宫不动，你的手在动，晃多了就出局。
- **难度可调**：从“简单”到“绝望”，给同事留面子或留阴影。

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
    :wallSensitivity="6"
    @success="handleSuccess" 
    @fail="handleFail" 
  />
</template>
```

### 属性 (Props)

| 属性名 | 类型 | 默认值 | 说明 |
| :--- | :--- | :--- | :--- |
| `difficulty` | `'easy' \| 'hard' \| 'impossible'` | `'hard'` | 难度级别。`impossible` 模式下出口会被隐形墙挡住。 |
| `wallSensitivity` | `number` | `6` | 墙壁判定宽度（像素），值越大越容易“碰壁”。 |

### 事件 (Events)

| 事件名 | 说明 |
| :--- | :--- |
| `success` | 当用户奇迹般地到达终点时触发。 |
| `fail` | 当用户（大概率）碰到墙壁时触发。 |

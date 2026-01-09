---
title: 组件总览 | Nonsense UI 实验室
description: 欢迎来到 Nonsense UI 实验室。这里汇集了全宇宙交互效率最低的组件，旨在通过反人类设计挑战现代 UI/UX 准则。
---

# 组件总览

这里是 **Nonsense UI** 的核心实验室。每一个组件都经过严密的“效率降低”测试，确保能够为您和您的用户带来极致的心理博弈体验。

<div class="ns-component-grid">

  <a href="/components/unclickable-button" class="ns-component-card">
    <div class="card-content">
      <div class="card-icon">🖱️</div>
      <h4>抓不住的按钮</h4>
      <p>它会预判你的预判，你永远点不到它。除非它想让你点到。</p>
      <div class="frustration-level">挫败感：🤡🤡🤡🤡🤡</div>
    </div>
  </a>

  <a href="/components/mismatched-button" class="ns-component-card">
    <div class="card-content">
      <div class="card-icon">🛑</div>
      <h4>指鹿为马按钮</h4>
      <p>颜色是红的，文字是确认。点击瞬间，一切都变了。</p>
      <div class="frustration-level">挫败感：🤡🤡🤡🤡</div>
    </div>
  </a>

  <a href="/components/rotary-dial" class="ns-component-card">
    <div class="card-content">
      <div class="card-icon">☎️</div>
      <h4>复古拨盘输入</h4>
      <p>在这个快节奏时代，拨个电话号码应该是一项体力活。</p>
      <div class="frustration-level">挫败感：🤡🤡🤡🤡</div>
    </div>
  </a>

  <a href="/components/gravity-input" class="ns-component-card">
    <div class="card-content">
      <div class="card-icon">⏳</div>
      <h4>重力沙尘输入</h4>
      <p>文字像沙子一样坍塌。想看清自己写了什么？先摇匀再说。</p>
      <div class="frustration-level">挫败感：🤡🤡🤡</div>
    </div>
  </a>

  <a href="/components/reverse-input" class="ns-component-card">
    <div class="card-content">
      <div class="card-icon">🪞</div>
      <h4>逻辑镜像输入</h4>
      <p>你输入的是正的，看到的是反的。连光标都在反抗你。</p>
      <div class="frustration-level">挫败感：🤡🤡🤡</div>
    </div>
  </a>

  <a href="/components/mood-rate" class="ns-component-card">
    <div class="card-content">
      <div class="card-icon">💖</div>
      <h4>强买强卖评分</h4>
      <p>我们非常在乎您的意见，只要您的意见是“很好”。</p>
      <div class="frustration-level">挫败感：🤡🤡</div>
    </div>
  </a>

  <a href="/components/narcissistic-rate" class="ns-component-card">
    <div class="card-content">
      <div class="card-icon">👑</div>
      <h4>自恋五星好评</h4>
      <p>差评按钮已物理移除，您只能发现我的闪光点。</p>
      <div class="frustration-level">挫败感：🤡🤡</div>
    </div>
  </a>

  <a href="/components/contradicting-checkbox" class="ns-component-card">
    <div class="card-content">
      <div class="card-icon">🤨</div>
      <h4>自我怀疑勾选</h4>
      <p>勾选了？不，你并没有。它有它自己的想法。</p>
      <div class="frustration-level">挫败感：🤡🤡🤡</div>
    </div>
  </a>

</div>

<style>
.ns-component-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 24px;
  margin-top: 32px;
}

.ns-component-card {
  display: block;
  background: var(--vp-c-bg-soft);
  border: 1px solid var(--vp-c-gutter);
  border-radius: 24px;
  text-decoration: none !important;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
  cursor: pointer;
}

/* 核心修复：外层容器保持不动，只改变内层或装饰效果 */
.ns-component-card:hover {
  border-color: var(--vp-c-brand);
  background: var(--vp-c-bg-mute);
  box-shadow: 0 20px 40px -15px rgba(16, 185, 129, 0.15);
}

.card-content {
  padding: 32px 24px;
  transition: transform 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
}

/* 只对内部内容做轻微的向上平移，不影响 A 标签的点击区域 */
.ns-component-card:hover .card-content {
  transform: translateY(-4px);
}

.card-icon { 
  font-size: 48px; 
  margin-bottom: 20px; 
  transition: all 0.5s cubic-bezier(0.68, -0.55, 0.265, 1.55);
  display: inline-block;
}

.ns-component-card:hover .card-icon {
  transform: scale(1.2) rotate(10deg);
  filter: drop-shadow(0 10px 15px rgba(16, 185, 129, 0.3));
}

.ns-component-card h4 { 
  margin: 0 0 10px 0; 
  font-size: 20px;
  font-weight: 800;
  color: var(--vp-c-text-1); 
  letter-spacing: -0.02em;
}

.ns-component-card p { 
  font-size: 14px; 
  color: var(--vp-c-text-2); 
  margin-bottom: 24px;
  line-height: 1.6;
  min-height: 44px;
}

.frustration-level { 
  font-size: 12px; 
  font-weight: 900; 
  color: var(--vp-c-brand); 
  background: rgba(16, 185, 129, 0.1);
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 6px 16px;
  border-radius: 30px;
  border: 1px solid rgba(16, 185, 129, 0.2);
}
</style>

---
layout: home
title: Nonsense UI - 专门制造“笑点”的 Vue 3 荒诞派组件库
description: Nonsense UI 是一个基于 Vue 3 的反常规组件库，专注于反人类设计、反直觉交互和极致的幽默感。包含旋转拨盘输入、重力坍塌输入框等创意组件。虽然并不好用，但它真的很有趣。
keywords: Vue 3 组件库, 反人类设计, Nonsense UI, 幽默设计, 交互艺术, 创意前端, Nonsensical UI, 荒诞交互

hero:
  name: "Nonsense UI"
  text: "全宇宙交互效率最低的组件库"
  tagline: "在一个追求效率与生产力的时代，我们决定反其道而行之。解构 UI/UX，制造令人愉悦的挫败感。"
  actions:
    - theme: brand
      text: 立即受挫
      link: /components/

features:
  - title: "极致挫败"
    details: "每一处交互都经过精心设计，确保用户在点击时产生怀疑。反直觉、反人类，就是我们的准则。"
    icon: 😩
  - title: "严谨乱来"
    details: "虽然交互很荒诞，但代码很严肃。全量 TypeScript 支持，工程化发布流程，它是艺术，也是严谨的库。"
    icon: 🛡️
  - title: "情绪价值"
    details: "枯燥的业务代码中需要一点调味剂。Nonsense UI 不解决问题，它只负责让你在开发过程中笑出声。"
    icon: 🤡

---

<div class="home-prank-container" style="margin-top: 64px; display: flex; flex-direction: column; align-items: center; gap: 24px; padding: 40px; background: var(--vp-c-bg-soft); border-radius: 32px; border: 1px solid var(--vp-c-gutter);">
  <div style="text-align: center;">
    <h3 style="font-weight: 900; font-size: 24px; margin-bottom: 8px;">🎁 进店礼包</h3>
    <p style="font-size: 14px; opacity: 0.6;">点击下方按钮领取你的“首位访客”专属勋章</p>
  </div>
  
  <NsUnclickableButton 
    label="立即领取勋章" 
    :panic-radius="120"
    :speed="0.7"
    :width="360"
    :height="180"
  />
  
  <p style="font-[10px]; font-weight: bold; opacity: 0.3; text-transform: uppercase; letter-spacing: 0.2em; margin-top: 12px;">
    * 提示：本组件库不建议用于任何生产环境
  </p>
</div>

<style>
:root {
  --vp-home-hero-name-color: transparent;
  --vp-home-hero-name-background: linear-gradient(135deg, #10b981 0%, #34d399 100%);
}

.home-prank-container {
  transition: transform 0.5s cubic-bezier(0.16, 1, 0.3, 1);
}

.home-prank-container:hover {
  transform: translateY(-4px);
}
</style>

---
layout: home
title: Nonsense UI - 毫无用处的 Vue 3 荒诞组件实验室
description: 专注整蛊与反人类交互的数字化实验。内置抓不住的按钮、复古拨盘等反直觉组件，毫无用户体验可言。
keywords: Vue 3 组件库, 反人类, 反直觉, 无厘头, 整蛊组件, 实验室, 毫无生产力, 毫无用户体验, Nonsense UI, 交互艺术, 荒诞交互

hero:
  name: "Nonsense UI"
  text: "全宇宙交互效率最低的组件库"
  tagline: "在一个追求效率与生产力的时代，我们决定‘反其道而行’。抛弃所谓的用户体验，专注于制造反人类的交互障碍。"
  actions:
    - theme: brand
      text: 立即受挫
      link: /components/

features:
  - title: "极致挫败"
    details: "每一处交互都经过反直觉设计，确保用户在点击时产生怀疑。反人类、反直觉，就是我们的准则。"
    icon: 😩
  - title: "严谨乱来"
    details: "交互很荒诞，但代码很严肃。全量 TS 支持，工程化发布，一场认真的数字化整蛊实验。"
    icon: 🛡️
  - title: "毫无用处"
    details: "这里没有任何能提升生产力的工具。Nonsense UI 只负责记录那些违背直觉的荒谬瞬间。"
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

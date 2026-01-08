import { defineConfig } from "vitepress";
import { fileURLToPath } from "node:url";

export default defineConfig({
  lang: "zh-CN",
  title: "Nonsense UI",
  description: "一个专门制造“笑点”的 Vue 3 组件库，专注反人类设计与极致荒诞交互。",
  base: process.env.VITEPRESS_BASE ?? "/",
  vite: {
    resolve: {
      alias: [
        {
          find: "nonsense-ui/style.css",
          replacement: fileURLToPath(
            new URL("../../../../packages/ui/src/style.css", import.meta.url)
          )
        },
        {
          find: /^nonsense-ui$/,
          replacement: fileURLToPath(
            new URL("../../../../packages/ui/src/index.ts", import.meta.url)
          )
        }
      ]
    },
    server: {
      fs: {
        allow: [fileURLToPath(new URL("../../../../", import.meta.url))]
      }
    }
  },
  themeConfig: {
    nav: [
      { text: "指南", link: "/guide/getting-started" },
      { text: "组件", link: "/components/" }
    ],
    sidebar: {
      "/guide/": [
        {
          text: "指南",
          items: [{ text: "快速开始", link: "/guide/getting-started" }]
        }
      ],
      "/components/": [
        {
          text: "总览",
          items: [{ text: "全部组件", link: "/components/" }]
        },
        {
          text: "基础欺诈 Buttons",
          items: [
            { text: "NsUnclickableButton", link: "/components/unclickable-button" },
            { text: "NsMismatchedButton", link: "/components/mismatched-button" }
          ]
        },
        {
          text: "输入折磨 Inputs",
          items: [
            { text: "NsRotaryDial", link: "/components/rotary-dial" },
            { text: "NsGravityInput", link: "/components/gravity-input" },
            { text: "NsReverseInput", link: "/components/reverse-input" }
          ]
        },
        {
          text: "虚伪反馈 Feedback",
          items: [
            { text: "NsMoodRate", link: "/components/mood-rate" },
            { text: "NsNarcissisticRate", link: "/components/narcissistic-rate" },
            { text: "NsContradictingCheckbox", link: "/components/contradicting-checkbox" }
          ]
        }
      ]
    },
    socialLinks: [{ icon: "github", link: "https://github.com/liusheng22/nonsense-ui" }],
    footer: {
      message: "Built with VitePress",
      copyright: "MIT Licensed"
    }
  }
});


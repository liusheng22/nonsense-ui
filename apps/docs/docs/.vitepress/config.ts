import { defineConfig } from "vitepress";
import { fileURLToPath } from "node:url";

export default defineConfig({
  lang: "zh-CN",
  title: "Nonsense UI",
  description: "一个毫无用处、专门折磨用户的 Vue 3 荒诞组件实验室。内置一系列反人类、反直觉的整蛊交互。",
  base: process.env.VITEPRESS_BASE ?? "/",
  lastUpdated: true,
  cleanUrls: true,
  sitemap: {
    hostname: "https://nonsense-ui.lius.me"
  },
  head: [
    ["meta", { name: "viewport", content: "width=device-width, initial-scale=1" }],
    ["meta", { name: "author", content: "liusheng22" }],
    ["meta", { property: "og:type", content: "website" }],
    ["meta", { property: "og:title", content: "Nonsense UI - 毫无用处、专门折磨用户的 Vue 3 荒诞组件实验室" }],
    ["meta", { property: "og:description", content: "抛弃所谓的用户体验，专注于制造反人类的交互障碍。这里只有无厘头的折磨，没有生产力工具。" }],
    ["meta", { property: "og:url", content: "https://nonsense-ui.lius.me" }],
    ["meta", { name: "twitter:card", content: "summary_large_image" }],
    ["link", { rel: "icon", href: "/favicon.ico?v=1" }],
    ["link", { rel: "icon", type: "image/svg+xml", href: "/favicon.svg?v=1" }]
  ],
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
    logo: "/logo.svg?v=1",
    siteTitle: "Nonsense UI",
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
        },
        {
          text: "关于实验室",
          items: [
            { text: "贡献坏点子", link: "https://github.com/liusheng22/nonsense-ui/issues" }
          ]
        }
      ]
    },
    socialLinks: [
      { icon: "github", link: "https://github.com/liusheng22/nonsense-ui" },
      { icon: 'npm', link: 'https://npmjs.com/package/nonsense-ui' }
    ],
    footer: {
      message: "Built with VitePress",
      copyright: "MIT Licensed"
    }
  }
});


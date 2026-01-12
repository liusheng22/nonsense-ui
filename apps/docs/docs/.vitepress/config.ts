import { defineConfig } from "vitepress";
import { fileURLToPath } from "node:url";

// 动态获取 hostname，支持多个部署域名
function getHostname(): string {
  // ⚠️ 必须设置 SITE_URL 环境变量，否则 sitemap 会使用错误的域名
  // Vercel: 设置 SITE_URL=https://nonsense-ui.vercel.app
  // Cloudflare: 设置 SITE_URL=https://nonsense-ui.lius.me
  if (process.env.SITE_URL) {
    return process.env.SITE_URL;
  }
  
  // 如果没有设置 SITE_URL，根据部署平台使用默认域名
  // Vercel 部署
  if (process.env.VERCEL) {
    // 即使有 VERCEL_URL，也不使用（可能是预览 URL）
    // 强制要求设置 SITE_URL
    console.warn('[VitePress] ⚠️ 警告: 未设置 SITE_URL，sitemap 将使用默认域名。请在 Vercel 项目设置中配置 SITE_URL=https://nonsense-ui.vercel.app');
    return "https://nonsense-ui.vercel.app";
  }
  
  // Cloudflare Pages 部署
  if (process.env.CF_PAGES) {
    console.warn('[VitePress] ⚠️ 警告: 未设置 SITE_URL，sitemap 将使用默认域名。请在 Cloudflare Pages 项目设置中配置 SITE_URL=https://nonsense-ui.lius.me');
    return "https://nonsense-ui.lius.me";
  }
  
  // 本地开发或其他环境
  return "https://nonsense-ui.vercel.app";
}

const siteUrl = getHostname();
const GA_ID = process.env.GA_MEASUREMENT_ID;

export default defineConfig({
  lang: "zh-CN",
  title: "Nonsense UI",
  description: "专注于制造交互障碍的 Vue 3 整蛊组件库。拒绝用户体验，挑战直觉极限，提供反人类、反直觉的荒诞交互。",
  base: process.env.VITEPRESS_BASE ?? "/",
  lastUpdated: true,
  cleanUrls: true,
  sitemap: {
    hostname: siteUrl
  },
  head: [
    ["meta", { name: "viewport", content: "width=device-width, initial-scale=1" }],
    ["meta", { name: "author", content: "liusheng22" }],
    ["meta", { property: "og:type", content: "website" }],
    ["meta", { property: "og:title", content: "Nonsense UI - 制造交互障碍的 Vue 3 荒诞组件实验室" }],
    ["meta", { property: "og:description", content: "专注于制造交互障碍的 Vue 3 整蛊组件库。拒绝用户体验，挑战直觉极限，提供反人类、反直觉的荒诞交互。" }],
    ["meta", { property: "og:url", content: siteUrl }],
    ["meta", { name: "twitter:card", content: "summary_large_image" }],
    ["link", { rel: "icon", href: "/favicon.ico?v=1" }],
    ["link", { rel: "icon", type: "image/svg+xml", href: "/favicon.svg?v=1" }],
    // Google Analytics (GA4)，仅在配置了 GA_MEASUREMENT_ID 时注入
    ...(GA_ID
      ? ([
          [
            "script",
            {
              async: "true",
              src: `https://www.googletagmanager.com/gtag/js?id=${GA_ID}`
            }
          ],
          [
            "script",
            {},
            `
window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('js', new Date());
gtag('config', '${GA_ID}', {
  cookie_flags: 'SameSite=None;Secure'
});
`.trim()
          ]
        ] as any)
      : [])
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
            { text: "NsSatisfactionRate", link: "/components/satisfaction-rate" },
            { text: "NsNarcissisticRate", link: "/components/narcissistic-rate" },
            { text: "NsContradictingCheckbox", link: "/components/contradicting-checkbox" }
          ]
        },
        {
          text: "混沌验证 Captcha",
          items: [
            { text: "NsCaptchaMaze", link: "/components/captcha-maze" }
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


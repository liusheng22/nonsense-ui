const path = require("node:path");

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    path.join(__dirname, "apps/docs/docs/**/*.{md,vue,ts,js}"),
    path.join(__dirname, "apps/docs/docs/.vitepress/theme/**/*.{ts,js,vue}"),
    path.join(__dirname, "packages/ui/src/**/*.{vue,ts,js}")
  ],
  theme: {
    extend: {}
  },
  plugins: []
};

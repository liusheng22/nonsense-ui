import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import dts from "vite-plugin-dts";

export default defineConfig({
  plugins: [
    vue(),
    dts({
      entryRoot: "src",
      insertTypesEntry: true,
      exclude: ["**/*.test.*", "**/*.spec.*"]
    })
  ],
  build: {
    lib: {
      entry: "src/index.ts",
      name: "NonsenseUI",
      formats: ["es"],
      fileName: "index"
    },
    rollupOptions: {
      external: ["vue"],
      output: {
        assetFileNames: (assetInfo) => {
          if (assetInfo.name?.endsWith(".css")) return "style.css";
          return "assets/[name]-[hash][extname]";
        }
      }
    }
  }
});


# 快速开始

## 安装

```bash
pnpm add nonsense-ui
```

## 使用

```ts
import { createApp } from "vue";
import App from "./App.vue";
import NonsenseUI from "nonsense-ui";
import "nonsense-ui/style.css";

createApp(App).use(NonsenseUI).mount("#app");
```

也可以按需引入：

```ts
import { NsUnclickableButton } from "nonsense-ui";
```

## 免责声明（认真脸）

这些组件是为了好玩，很多交互是“故意不友好”的；请不要在生产环境里折磨你的用户（除非你的产品也很无厘头）。


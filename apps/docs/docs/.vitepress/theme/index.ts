import DefaultTheme from "vitepress/theme";
import NonsenseUI from "nonsense-ui";
import "nonsense-ui/style.css";
import "./custom.css";

export default {
  ...DefaultTheme,
  enhanceApp({ app }) {
    app.use(NonsenseUI);
  }
};


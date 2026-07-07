import { defineUserConfig } from "vuepress";
import { docsearchPlugin } from '@vuepress/plugin-docsearch'

import theme from "./theme.js";

export default defineUserConfig({
  base: "/",

  locales: {
    "/": {
      lang: "en-US",
      title: "Vexilog",
      description: "Vexillium's blog",
    },
    "/zh/": {
      lang: "zh-CN",
      title: "Vexilog",
      description: "Vexillium 的博客",
    },
  },

  plugins: [
    //docsearchPlugin({}),
  ],

  theme,

  // Enable it with pwa
  // shouldPrefetch: false,
});

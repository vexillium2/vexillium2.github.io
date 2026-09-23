import { defineUserConfig } from "vuepress";
import { docsearchPlugin } from '@vuepress/plugin-docsearch'

import theme from "./theme.js";

export default defineUserConfig({
  base: "/",

  locales: {
    "/": {
      lang: "zh-CN",
      title: "Vexilog",
      description: "Vexillium's blog",
    },
    "/zh/": {
      lang: "zh-CN",
      title: "Vexilog",
      description: "Vexillium 的博客",
    },
    "/en/": {
      lang: "en-US",
      title: "Vexilog",
      description: "Vexillium's blog",
    },
  },

  plugins: [
    //docsearchPlugin({}),
  ],

  // 正文内目录：markdown 里写 `[[toc]]` 即可插入。
  // 只列二级标题，三级标题的导航由右侧栏承担。
  markdown: {
    toc: {
      level: [2],
    },
  },

  theme,

  // Enable it with pwa
  // shouldPrefetch: false,
});

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
  // 列出二级和三级标题（三级标题同样计入正文目录）。
  markdown: {
    toc: {
      level: [2, 3],
    },
  },

  theme,

  // Enable it with pwa
  // shouldPrefetch: false,
});

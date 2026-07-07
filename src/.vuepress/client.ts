import { defineClientConfig } from "@vuepress/client";
import { Layout } from "vuepress-theme-hope/client";

export default defineClientConfig({
  enhance: ({ app }) => {
    // setup() {
    //   setupTransparentNavbar({ light: "#333", dark: "#fff" });
    // },
  },
  layouts: {
    Origin: Layout,
  },
});
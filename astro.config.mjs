// @ts-check
import { defineConfig } from "astro/config";

import react from "@astrojs/react";
import partytown from "@astrojs/partytown";

import tailwindcss from "@tailwindcss/vite";

import mdx from "@astrojs/mdx";

import icon from "astro-icon";

import netlify from "@astrojs/netlify";

import remarkToc from "remark-toc";

import expressiveCode from "astro-expressive-code";

import { pluginLineNumbers } from "@expressive-code/plugin-line-numbers";

// https://astro.build/config
export default defineConfig({
  integrations: [
    react(),
    partytown(),
    expressiveCode({
      frames: {
        showCopyToClipboardButton: true,
      },
      // plugins: [pluginLineNumbers()],
      // defaultProps: {
      //   showLineNumbers: false,
      //   overridesByLang: {
      //     "js,ts,html,css,jsx,tsx": {
      //       showLineNumbers: true,
      //     },
      //   },
      // },
    }),
    mdx(),
    icon(),
  ],
  markdown: {
    remarkPlugins: [[remarkToc, { heading: "目录" }]],
  },
  vite: {
    plugins: [tailwindcss()],
  },
  redirects: {
    "/posts": "/posts/1",
  },
  adapter: netlify(),
  image: {
    remotePatterns: [{ protocol: "https" }],
  },
});

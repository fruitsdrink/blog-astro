import { defineEcConfig } from "astro-expressive-code";
import { pluginLineNumbers } from "@expressive-code/plugin-line-numbers";
import { pluginCollapsibleSections } from "@expressive-code/plugin-collapsible-sections";
import { pluginFullscreen } from "expressive-code-fullscreen";

export default defineEcConfig({
  plugins: [
    pluginCollapsibleSections(),
    pluginFullscreen({
      fullscreenButtonTooltip: "切换全屏",
      enableEscapeKey: true,
      exitOnBrowserBack: true,
      animationDuration: 250,
      addToUntitledBlocks: false, // Only show on blocks with titles.
    }),
    pluginLineNumbers(),
  ],
  defaultProps: {
    showLineNumbers: false,
    overridesByLang: {
      "js,ts,html,css,jsx,tsx": {
        showLineNumbers: true,
      },
    },
  },
});

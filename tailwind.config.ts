import type { Config } from "tailwindcss";
import { BASE_COLORS, SEMANTIC_COLORS } from "./src/config/theme";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Base colors
        primary: { dark: BASE_COLORS.primaryDark },
        secondary: { dark: BASE_COLORS.secondaryDark },
        accent: BASE_COLORS.accent,
        amber: BASE_COLORS.amber,
        emerald: BASE_COLORS.emerald,

        // Semantic colors
        app: { bg: SEMANTIC_COLORS.appBg },
        sidebar: { border: SEMANTIC_COLORS.sidebarBorder },
        card: {
          bg: SEMANTIC_COLORS.cardBg,
          border: SEMANTIC_COLORS.cardBorder,
        },
        text: {
          primary: SEMANTIC_COLORS.textPrimary,
          secondary: SEMANTIC_COLORS.textSecondary,
          accent: SEMANTIC_COLORS.textAccent,
        },
        btn: {
          primary: {
            bg: SEMANTIC_COLORS.btnPrimaryBg,
            hover: SEMANTIC_COLORS.btnPrimaryHover,
          },
          secondary: {
            bg: SEMANTIC_COLORS.btnSecondaryBg,
            hover: SEMANTIC_COLORS.btnSecondaryHover,
          },
        },
        overlay: SEMANTIC_COLORS.overlay,
        danger: {
          bg: SEMANTIC_COLORS.danger.bg,
          border: SEMANTIC_COLORS.danger.border,
          text: SEMANTIC_COLORS.danger.text,
        },
      },
    },
  },
  plugins: [],
} satisfies Config;

export default config;

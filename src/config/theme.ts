export const BASE_COLORS = {
  primaryDark: "#1a1306",
  secondaryDark: "#2d2012",
  accent: "rgba(124, 45, 18, 0.3)", // amber-800/30 equivalent
  amber: {
    100: "#fef3c7",
    200: "#fde68a",
    300: "#fcd34d",
    400: "#fbbf24",
    500: "#f59e0b",
    600: "#d97706",
    700: "#b45309",
    800: "#92400e",
    900: "#78350f",
  },
  emerald: {
    100: "#d1fae5",
    200: "#a7f3d0",
    300: "#6ee7b7",
    400: "#34d399",
    500: "#10b981",
    600: "#059669",
    700: "#047857",
    800: "#065f46",
    900: "#064e3b",
  },
  red: {
    100: "#fee2e2",
    200: "#fecaca",
    300: "#fca5a5",
    400: "#f87171",
    500: "#ef4444",
    600: "#dc2626",
    700: "#b91c1c",
    800: "#991b1b",
    900: "#7f1d1d",
  },
} as const;

export const SEMANTIC_COLORS = {
  // Layout
  appBg: BASE_COLORS.primaryDark,
  sidebarBorder: BASE_COLORS.accent,

  // Cards
  cardBg: BASE_COLORS.secondaryDark,
  cardBorder: BASE_COLORS.accent,

  // Text
  textPrimary: BASE_COLORS.amber[100],
  textSecondary: BASE_COLORS.amber[200],
  textAccent: BASE_COLORS.emerald[300],

  // Buttons
  btnPrimaryBg: BASE_COLORS.amber[700],
  btnPrimaryHover: BASE_COLORS.amber[600],
  btnSecondaryBg: `${BASE_COLORS.amber[800]}66`, // 40% opacity
  btnSecondaryHover: `${BASE_COLORS.amber[700]}99`, // 60% opacity

  // Overlays
  overlay: {
    default: `${BASE_COLORS.amber[900]}20`, // 20% opacity
    subtle: `${BASE_COLORS.amber[800]}10`, // 10% opacity
    medium: `${BASE_COLORS.amber[700]}30`, // 30% opacity
    danger: `${BASE_COLORS.red[500]}20`,
  },

  // Danger
  danger: {
    bg: BASE_COLORS.red[100],
    border: BASE_COLORS.red[200],
    text: BASE_COLORS.red[700],
  },

  // Tabs
  tabs: {
    activeBg: `${BASE_COLORS.amber[800]}30`,
    activeBorder: BASE_COLORS.amber[600],
  },
} as const;

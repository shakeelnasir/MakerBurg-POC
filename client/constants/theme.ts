import { Platform } from "react-native";

export const Colors = {
  light: {
    text: "#111111",
    textSecondary: "#4B4B4B",
    buttonText: "#FFFFFF",
    tabIconDefault: "#9B9B9B",
    tabIconSelected: "#2E2A24",
    link: "#2E2A24",
    backgroundRoot: "#F6F2EC",
    backgroundDefault: "#FFFFFF",
    backgroundSecondary: "#EFE8DF",
    backgroundTertiary: "#E5DED4",
    hairline: "rgba(0,0,0,0.08)",
    accent: "#2E2A24",
    pill: "#EFE8DF",
    pillText: "#4B4B4B",
    cardBorder: "rgba(0,0,0,0.06)",
  },
  dark: {
    text: "#ECEDEE",
    textSecondary: "#9BA1A6",
    buttonText: "#FFFFFF",
    tabIconDefault: "#9BA1A6",
    tabIconSelected: "#F6F2EC",
    link: "#F6F2EC",
    backgroundRoot: "#1A1816",
    backgroundDefault: "#252320",
    backgroundSecondary: "#302D29",
    backgroundTertiary: "#3B3733",
    hairline: "rgba(255,255,255,0.08)",
    accent: "#F6F2EC",
    pill: "#302D29",
    pillText: "#9BA1A6",
    cardBorder: "rgba(255,255,255,0.06)",
  },
};

export const Spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  "2xl": 24,
  "3xl": 32,
  "4xl": 40,
  "5xl": 48,
  inputHeight: 48,
  buttonHeight: 52,
  pageMargin: 24,
};

export const BorderRadius = {
  xs: 8,
  sm: 12,
  md: 16,
  lg: 20,
  xl: 24,
  "2xl": 32,
  "3xl": 40,
  full: 9999,
};

export const Typography = {
  h1: {
    fontSize: 34,
    lineHeight: 40,
    fontWeight: "700" as const,
  },
  h2: {
    fontSize: 24,
    lineHeight: 32,
    fontWeight: "600" as const,
  },
  h3: {
    fontSize: 20,
    lineHeight: 28,
    fontWeight: "600" as const,
  },
  h4: {
    fontSize: 18,
    lineHeight: 26,
    fontWeight: "600" as const,
  },
  body: {
    fontSize: 16,
    lineHeight: 26,
    fontWeight: "400" as const,
  },
  small: {
    fontSize: 14,
    lineHeight: 20,
    fontWeight: "400" as const,
  },
  caption: {
    fontSize: 13,
    lineHeight: 18,
    fontWeight: "400" as const,
  },
  pill: {
    fontSize: 12,
    lineHeight: 16,
    fontWeight: "500" as const,
  },
  link: {
    fontSize: 16,
    lineHeight: 24,
    fontWeight: "400" as const,
  },
};

export const Fonts = Platform.select({
  ios: {
    sans: "system-ui",
    serif: "ui-serif",
    rounded: "ui-rounded",
    mono: "ui-monospace",
  },
  default: {
    sans: "normal",
    serif: "serif",
    rounded: "normal",
    mono: "monospace",
  },
  web: {
    sans: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
    serif: "Georgia, 'Times New Roman', serif",
    rounded:
      "'SF Pro Rounded', 'Hiragino Maru Gothic ProN', Meiryo, 'MS PGothic', sans-serif",
    mono: "SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace",
  },
});

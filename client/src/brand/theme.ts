/**
 * Brand theme tokens currently mirror the existing low-stimulation game palette.
 * Replace only these values after the official Sunny Seeds colors are approved.
 */
export const BRAND_THEME = {
  primary: "#153a63",
  secondary: "#eef2ef",
  accent: "oklch(0.9 0.028 82)",
  success: "oklch(0.55 0.09 148)",
  warning: "#d5892e",
  error: "oklch(0.52 0.13 28)",
  background: "#f6f8f6",
  surface: "#ffffff",
  sun: "#d5892e",
  seed: "#8aaa4e",
} as const;

export type BrandThemeToken = keyof typeof BRAND_THEME;

export function applyBrandTheme(root: HTMLElement = document.documentElement) {
  for (const [token, value] of Object.entries(BRAND_THEME)) {
    root.style.setProperty(`--brand-${token}`, value);
  }
}

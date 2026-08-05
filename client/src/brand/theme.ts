/**
 * Brand theme tokens currently mirror the existing low-stimulation game palette.
 * Replace only these values after the official Sunny Seeds colors are approved.
 */
export const BRAND_THEME = {
  primary: "oklch(0.32 0.045 62)",
  secondary: "oklch(0.915 0.022 84)",
  accent: "oklch(0.9 0.028 82)",
  success: "oklch(0.55 0.09 148)",
  warning: "oklch(0.62 0.08 70)",
  error: "oklch(0.52 0.13 28)",
  background: "oklch(0.945 0.016 84)",
  surface: "oklch(0.975 0.01 86)",
} as const;

export type BrandThemeToken = keyof typeof BRAND_THEME;

export function applyBrandTheme(root: HTMLElement = document.documentElement) {
  for (const [token, value] of Object.entries(BRAND_THEME)) {
    root.style.setProperty(`--brand-${token}`, value);
  }
}

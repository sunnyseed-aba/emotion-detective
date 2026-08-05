import { BRAND } from "@/brand/brand";
import { useLocation } from "wouter";

export function BrandFooter() {
  const [location] = useLocation();
  if (location.startsWith("/play/")) return null;

  return (
    <footer className="border-t border-border/70 px-5 py-5 text-center text-[0.8125rem] leading-relaxed text-muted-foreground">
      <p>{BRAND.copyright}</p>
      <p className="font-file mt-1">
        {BRAND.appNameEnglish} · Version {BRAND.version}
      </p>
    </footer>
  );
}

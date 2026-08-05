import { BRAND } from "@/brand/brand";

export function BrandFooter() {
  return (
    <footer className="border-t border-border/70 px-5 py-5 text-center text-[0.8125rem] leading-relaxed text-muted-foreground">
      <p>{BRAND.copyright}</p>
      <p className="font-file mt-1">
        {BRAND.appNameEnglish} · Version {BRAND.version}
      </p>
    </footer>
  );
}

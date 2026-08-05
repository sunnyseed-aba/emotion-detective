import { BRAND } from "@/brand/brand";
import { cn } from "@/lib/utils";

export function SunnySeedsSignature({ className }: { className?: string }) {
  return (
    <div className={cn("sunny-signature", className)} aria-label={BRAND.organization}>
      <img src={BRAND.logos.default} alt="" className="sunny-signature__logo" aria-hidden />
      <span className="font-file text-[0.75rem] leading-tight tracking-wide">
        Sunny Seeds Academy
      </span>
    </div>
  );
}

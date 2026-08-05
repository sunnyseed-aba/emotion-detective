import { Brain, Eye, HandHeart, Heart, Route } from "lucide-react";
import type { CaseStage } from "@/game/types";
import { cn } from "@/lib/utils";

const ICONS = {
  observe: Eye,
  name: Heart,
  mind: Brain,
  abc: Route,
  strategy: HandHeart,
  debrief: HandHeart,
} satisfies Record<CaseStage, typeof Eye>;

export function StageIcon({ stage, className }: { stage: CaseStage; className?: string }) {
  const Icon = ICONS[stage];
  return <Icon className={cn("h-5 w-5", className)} aria-hidden />;
}

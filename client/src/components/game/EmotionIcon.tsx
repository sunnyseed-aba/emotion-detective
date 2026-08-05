import {
  Angry,
  Award,
  CircleAlert,
  EyeOff,
  Frown,
  Smile,
  Sparkles,
  UserRound,
} from "lucide-react";
import type { EmotionId } from "@/game/types";
import { EMOTIONS } from "@/game/emotions";

const ICONS = {
  joy: Smile,
  sadness: Frown,
  anger: Angry,
  fear: CircleAlert,
  embarrassment: EyeOff,
  pride: Award,
  surprise: Sparkles,
  loneliness: UserRound,
} satisfies Record<EmotionId, typeof Smile>;

export function EmotionIcon({ emotionId }: { emotionId: EmotionId }) {
  const Icon = ICONS[emotionId];
  const emotion = EMOTIONS[emotionId];

  return (
    <span
      className="emotion-option-icon"
      style={{ color: emotion.color, background: emotion.tint }}
      aria-hidden
    >
      <Icon className="h-6 w-6" strokeWidth={1.9} />
    </span>
  );
}

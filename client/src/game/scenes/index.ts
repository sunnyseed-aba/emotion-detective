/**
 * 場景註冊表。新增場景（如醫院、職場）只需在此匯入並加入陣列，
 * 引擎與 UI 完全不需改動。
 */
import type { GameScene } from "../types";
import { homeScene } from "./home";
import { schoolScene } from "./school";
import { communityScene } from "./community";

export const SCENES: GameScene[] = [schoolScene, homeScene, communityScene];

export function getScene(id: string): GameScene | undefined {
  return SCENES.find((s) => s.id === id);
}

export function getCase(sceneId: string, caseId: string) {
  return getScene(sceneId)?.cases.find((c) => c.id === caseId);
}

export const ALL_CASES = SCENES.flatMap((s) =>
  s.cases.map((c) => ({
    sceneId: s.id,
    sceneName: s.name,
    backdrop: c.backdrop ?? s.backdrop,
    case: c,
  })),
);

import {
  APP_NAME,
  APP_NAME_EN,
  APP_VERSION,
  AUTHOR,
  COPYRIGHT,
  EMAIL,
  LOGO_PATHS,
  ORGANIZATION,
  VERSION_LABEL,
  WEBSITE,
} from "./constants";
import { BRAND_THEME } from "./theme";

export const BRAND = {
  appName: APP_NAME,
  appNameEnglish: APP_NAME_EN,
  organization: ORGANIZATION,
  copyright: COPYRIGHT,
  website: WEBSITE,
  email: EMAIL,
  version: APP_VERSION,
  versionLabel: VERSION_LABEL,
  author: AUTHOR,
  logos: LOGO_PATHS,
  theme: BRAND_THEME,
  metadata: {
    title: `${APP_NAME}｜${ORGANIZATION}`,
    description: `${APP_NAME}是由 ${ORGANIZATION} 推出的心智理論互動學習 Prototype。`,
    applicationName: APP_NAME,
  },
} as const;

export function applyBrandMetadata(doc: Document = document) {
  doc.title = BRAND.metadata.title;
  const descriptions = doc.head.querySelectorAll('meta[name="description"]');
  const description = descriptions.item(0) ?? doc.createElement("meta");
  description.setAttribute("name", "description");
  description.setAttribute("content", BRAND.metadata.description);
  if (!description.parentNode) doc.head.append(description);
}

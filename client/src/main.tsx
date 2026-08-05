import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";
import { applyBrandMetadata } from "./brand/brand";
import { applyBrandTheme } from "./brand/theme";

applyBrandTheme();
applyBrandMetadata();

createRoot(document.getElementById("root")!).render(<App />);

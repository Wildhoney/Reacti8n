import "@ant-design/v5-patch-for-react-19";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

import { App } from "./app";
import { i18n } from "./i18n";

const root = document.getElementById("root");
if (root === null) {
  throw new Error('Reacti8n example: missing <div id="root" />.');
}

const detected = i18n.detect();

createRoot(root).render(
  <StrictMode>
    <i18n.Provider locale={detected}>
      <App />
    </i18n.Provider>
  </StrictMode>,
);

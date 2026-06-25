import "@ant-design/v5-patch-for-react-19";
import { StrictMode, useState } from "react";
import { createRoot } from "react-dom/client";

import { App } from "./app";
import { Locale, i18n } from "./i18n";

const root = document.getElementById("root");
if (root === null) {
  throw new Error('Reacti8n example: missing <div id="root" />.');
}

function Root() {
  const [locale, setLocale] = useState<Locale>(() => i18n.detect());
  return (
    <i18n.Provider locale={locale} onLocaleChange={setLocale}>
      <App />
    </i18n.Provider>
  );
}

createRoot(root).render(
  <StrictMode>
    <Root />
  </StrictMode>,
);

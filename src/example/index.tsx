import "@ant-design/v5-patch-for-react-19";
import { StrictMode, useState } from "react";
import { createRoot } from "react-dom/client";

import { App } from "./app";
import { Locale, config, i18n, initialLocale } from "./utils";

const root = document.getElementById("root");
if (root === null) {
  throw new Error('Reacti8n example: missing <div id="root" />.');
}

function Root() {
  const [locale, setLocale] = useState<Locale>(initialLocale);
  return (
    <i18n.Provider
      locale={locale}
      onLocaleChange={(next) => {
        sessionStorage.setItem(config.storageKey, next);
        setLocale(next);
      }}
    >
      <App />
    </i18n.Provider>
  );
}

createRoot(root).render(
  <StrictMode>
    <Root />
  </StrictMode>,
);

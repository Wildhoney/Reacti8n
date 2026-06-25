import "@ant-design/v5-patch-for-react-19";
import { StrictMode, useState } from "react";
import { createRoot } from "react-dom/client";

import { App } from "./components/app";
import { Locale } from "./types";
import { config, getLocale, i18n } from "./utils";

const root = document.getElementById("root");
if (root === null) {
  throw new Error('Tradurre example: missing <div id="root" />.');
}

function Root() {
  const [locale, setLocale] = useState<Locale>(getLocale);

  return (
    <i18n.Provider
      locale={locale}
      onLocaleChange={(locale) => {
        sessionStorage.setItem(config.storageKey, locale);
        setLocale(locale);
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

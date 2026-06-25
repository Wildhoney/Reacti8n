import { I18n } from "tradurre";

import { Option } from "./components/option";
import { Locale } from "./types";

export const i18n = new I18n({
  locales: [
    Locale.En,
    Locale.Fr,
    Locale.De,
    Locale.It,
    Locale.Es,
    Locale.Ar,
    Locale.Ja,
    Locale.Ru,
    Locale.Uk,
    Locale.Ka,
    Locale.Zh,
  ] as const,
  onFallback({ key, requested, resolved }) {
    console.error(
      `[tradurre] "${key}" missing for ${requested}; using ${resolved ?? "no locale"}.`,
    );
  },
});

const flags: Record<Locale, string> = {
  [Locale.En]: "gb",
  [Locale.Fr]: "fr",
  [Locale.De]: "de",
  [Locale.It]: "it",
  [Locale.Es]: "es",
  [Locale.Ar]: "ae",
  [Locale.Ja]: "jp",
  [Locale.Ru]: "ru",
  [Locale.Uk]: "ua",
  [Locale.Ka]: "ge",
  [Locale.Zh]: "cn",
};

const labels: Record<Locale, string> = {
  [Locale.En]: "English",
  [Locale.Fr]: "Français",
  [Locale.De]: "Deutsch",
  [Locale.It]: "Italiano",
  [Locale.Es]: "Español",
  [Locale.Ar]: "العربية",
  [Locale.Ja]: "日本語",
  [Locale.Ru]: "Русский",
  [Locale.Uk]: "Українська",
  [Locale.Ka]: "ქართული",
  [Locale.Zh]: "中文",
};

export const config = {
  storageKey: "tradurre.example.locale",
  locales: Object.values(Locale) as Locale[],
  flags,
  labels,
  languages: (Object.keys(labels) as Locale[]).map((code) => ({
    value: code,
    label: <Option flag={flags[code]} label={labels[code]} />,
  })),
};

export function getLocale(): Locale {
  const preference = sessionStorage.getItem(config.storageKey);
  return i18n.detect([preference, ...navigator.languages]);
}

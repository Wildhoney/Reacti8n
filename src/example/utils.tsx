import { css } from "@emotion/css";
import { CircleFlag } from "react-circle-flags";
import { I18n } from "reacti8n";

export enum Locale {
  En = "en",
  Fr = "fr",
  De = "de",
  It = "it",
  Es = "es",
  Ar = "ar",
  Ja = "ja",
  Ru = "ru",
  Uk = "uk",
  Ka = "ka",
  Zh = "zh",
}

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
});

const flagOption = css`
  display: flex;
  align-items: center;
  gap: 8px;
`;

const flagFor: Record<Locale, string> = {
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

const nativeLabel: Record<Locale, string> = {
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
  storageKey: "reacti8n.example.locale",
  locales: Object.values(Locale) as Locale[],
  flagFor,
  nativeLabel,
  languageOptions: (Object.keys(nativeLabel) as Locale[]).map((code) => ({
    value: code,
    label: (
      <div className={flagOption}>
        <CircleFlag countryCode={flagFor[code]} width={18} height={18} />
        <span>{nativeLabel[code]}</span>
      </div>
    ),
  })),
};

export function initialLocale(): Locale {
  const stored = sessionStorage.getItem(config.storageKey);
  if (stored === null) return i18n.detect();
  return i18n.detect([stored, ...(navigator.languages ?? [])]);
}

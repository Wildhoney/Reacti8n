import { I18n } from "reacti8n";

export enum Locale {
  En = "en",
  Fr = "fr",
  De = "de",
  It = "it",
  Es = "es",
}

export const i18n = new I18n({
  locales: [Locale.En, Locale.Fr, Locale.De, Locale.It, Locale.Es] as const,
});

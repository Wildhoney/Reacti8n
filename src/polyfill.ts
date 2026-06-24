export type PolyfillLoader = {
  polyfill(): Promise<void>;
  data(locale: string): Promise<void>;
};

const defaultLoader: PolyfillLoader = {
  async polyfill() {
    await import("@formatjs/intl-pluralrules/polyfill.js");
  },
  async data(locale: string) {
    await import(
      /* @vite-ignore */ `@formatjs/intl-pluralrules/locale-data/${locale}.js`
    );
  },
};

export async function installPluralRulesPolyfill(
  locales: readonly string[],
  loader: PolyfillLoader = defaultLoader,
): Promise<void> {
  await loader.polyfill();
  await Promise.all(locales.map((locale) => loader.data(locale)));
}

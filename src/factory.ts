import { makeDetect } from "./detect";
import { makeDictionary, type FallbackHandler } from "./dictionary";
import { makeHooks } from "./hooks";
import { makeProvider } from "./provider";
import { makeTemplate } from "./template";
import type { Input, Merged } from "./types";

export type CreateI18nConfig<L extends string> = {
  locales: readonly L[];
  fallback?: L;
  onFallback?: FallbackHandler<L>;
};

export type I18n<L extends string> = ReturnType<typeof createI18n<L>>;

export type ResolvedDictionary<L extends string, D extends Input<L>> = Merged<
  L,
  D
>;

export function createI18n<const L extends string>(
  config: CreateI18nConfig<L>,
) {
  const { locales, onFallback } = config;
  if (locales.length === 0) {
    throw new Error(
      "Reacti8n: createI18n requires at least one locale in config.locales.",
    );
  }
  const fallback = config.fallback ?? locales[0]!;
  if (!locales.includes(fallback)) {
    throw new Error(
      `Reacti8n: fallback locale "${fallback}" is not in the configured locales list.`,
    );
  }

  const dictionary = makeDictionary<L>(locales, onFallback);
  const template = makeTemplate<L>();
  const { LocaleProvider, useLocale } = makeProvider<L>(fallback);
  const { useI18n, useNumberFormat, useDateTimeFormat, usePluralRules } =
    makeHooks<L>(useLocale);
  const { detectLocale, isLocale } = makeDetect<L>(locales, fallback);

  return {
    locales,
    fallback,
    dictionary,
    template,
    LocaleProvider,
    useLocale,
    useI18n,
    useNumberFormat,
    useDateTimeFormat,
    usePluralRules,
    detectLocale,
    isLocale,
  };
}

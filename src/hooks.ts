import { useMemo } from "react";

import type { Dictionary } from "./dictionary";
import type { Input, Merged } from "./types";

export function makeHooks<L extends string>(
  useLocale: () => { locale: L },
) {
  function useI18n<D extends Input<L>>(
    dictionary: Dictionary<L, D>,
  ): Merged<L, D> {
    return dictionary.resolve(useLocale().locale);
  }

  function useNumberFormat(
    options?: Intl.NumberFormatOptions,
  ): Intl.NumberFormat {
    const { locale } = useLocale();
    return useMemo(
      () => new Intl.NumberFormat(locale, options),
      [locale, options],
    );
  }

  function useDateTimeFormat(
    options?: Intl.DateTimeFormatOptions,
  ): Intl.DateTimeFormat {
    const { locale } = useLocale();
    return useMemo(
      () => new Intl.DateTimeFormat(locale, options),
      [locale, options],
    );
  }

  function usePluralRules(
    options?: Intl.PluralRulesOptions,
  ): Intl.PluralRules {
    const { locale } = useLocale();
    return useMemo(
      () => new Intl.PluralRules(locale, options),
      [locale, options],
    );
  }

  return { useI18n, useNumberFormat, useDateTimeFormat, usePluralRules };
}

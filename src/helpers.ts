export type Helpers = {
  numberFormat(options?: Intl.NumberFormatOptions): Intl.NumberFormat;
  dateTimeFormat(options?: Intl.DateTimeFormatOptions): Intl.DateTimeFormat;
  pluralRules(options?: Intl.PluralRulesOptions): Intl.PluralRules;
};

export function makeHelpers(locale: string): Helpers {
  return {
    numberFormat: (options) => new Intl.NumberFormat(locale, options),
    dateTimeFormat: (options) => new Intl.DateTimeFormat(locale, options),
    pluralRules: (options) => new Intl.PluralRules(locale, options),
  };
}

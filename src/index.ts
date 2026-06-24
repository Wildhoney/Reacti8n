export { createI18n } from "./factory";
export type {
  CreateI18nConfig,
  I18n,
  ResolvedDictionary,
} from "./factory";

export { Dictionary } from "./dictionary";
export type { FallbackEvent, FallbackHandler } from "./dictionary";
export { Template } from "./template";
export { installPluralRulesPolyfill } from "./polyfill";
export type { PolyfillLoader } from "./polyfill";
export type { LocaleHandle } from "./provider";
export type {
  AtLeastOne,
  Entry,
  Formatter,
  Input,
  Merged,
  Resolved,
  TemplateLike,
  Variants,
} from "./types";

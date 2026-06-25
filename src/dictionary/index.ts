import { makeHelpers } from "../helpers/index.ts";
import { Template } from "../template/index.ts";
import type {
  FallbackHandler,
  Formatter,
  Helpers,
  Input,
  Merged,
  ResolvedTemplateMeta,
} from "../types.ts";

/**
 * Typed message bundle — pairs a locale list with a dictionary input and
 * resolves entries against any locale in that list. Built by
 * `i18n.dictionary(...)`; consumers never construct this directly.
 *
 * Internally caches the resolved object per-locale, so a re-render with the
 * same active locale returns the same reference.
 *
 * @typeParam L - Locale union for this i18n instance.
 * @typeParam D - Original dictionary input shape — used to preserve per-key
 * typing through resolution.
 */
export class Dictionary<L extends string, D extends Input<L>> {
  readonly #entries: D;
  readonly #locales: readonly L[];
  readonly #onFallback?: FallbackHandler<L>;
  readonly #cache = new Map<L, Merged<L, D>>();

  /**
   * @param locales - Configured locale list, in fallback-chain order.
   * @param entries - The dictionary input object passed to
   * `i18n.dictionary(...)`.
   * @param onFallback - Optional callback fired when an entry falls back to
   * a non-requested locale, or to `null` when the key is missing from every
   * locale.
   */
  constructor(
    locales: readonly L[],
    entries: D,
    onFallback?: FallbackHandler<L>,
  ) {
    this.#locales = locales;
    this.#entries = entries;
    this.#onFallback = onFallback;
  }

  /**
   * Resolves every entry against `locale`, building the typed object
   * consumers see from `useI18n(...)`. Result is memoised per-locale.
   *
   * @param locale - Active locale to resolve against.
   * @returns A fully resolved dictionary view typed by {@link Merged}.
   */
  resolve(locale: L): Merged<L, D> {
    const cached = this.#cache.get(locale);
    if (cached !== undefined) return cached;
    const helpers = makeHelpers(locale);
    const resolved = Object.fromEntries(
      Object.entries(this.#entries).map(([key, entry]) => [
        key,
        this.#pick(entry as Template<L, unknown>, key, locale, helpers),
      ]),
    ) as Merged<L, D>;
    this.#cache.set(locale, resolved);
    return resolved;
  }

  /**
   * Resolves a single {@link Template} entry into a helpers-bound callable
   * carrying a {@link ResolvedTemplateMeta} sidecar. Non-Template values are
   * rejected by the type system at `i18n.dictionary(...)`; the runtime check
   * is a defensive guard rather than a supported branch.
   */
  #pick(entry: Template<L, unknown>, key: string, locale: L, helpers: Helpers) {
    const { value: formatter, resolvedAt } = this.#fromVariants(
      entry.variants as Record<string, unknown>,
      key,
      locale,
    );
    if (typeof formatter !== "function") return null;
    const callable = (tokens: unknown = {}) =>
      (formatter as Formatter<unknown>)({ tokens, helpers });
    // Invariant: when formatter is a function, resolvedAt is the locale
    // whose variant supplied it — it can only be null when the value was
    // null too, which the typeof guard already rejected.
    return Object.assign(callable, this.#metaFor(resolvedAt as L));
  }

  /**
   * Walks the configured locale list to find a defined variant, firing
   * `onFallback` whenever the requested locale was missing. The returned
   * `resolvedAt` field reports which locale's variant the dictionary
   * actually used — `null` only when no locale defines the key at all.
   */
  #fromVariants(
    variants: Record<string, unknown>,
    key: string,
    locale: L,
  ): { value: unknown; resolvedAt: L | null } {
    const active = variants[locale];
    if (active !== undefined && active !== null) {
      return { value: active, resolvedAt: locale };
    }
    for (const candidate of this.#locales) {
      if (candidate === locale) continue;
      const value = variants[candidate];
      if (value !== undefined && value !== null) {
        this.#onFallback?.({ key, requested: locale, resolved: candidate });
        return { value, resolvedAt: candidate };
      }
    }
    this.#onFallback?.({ key, requested: locale, resolved: null });
    return { value: null, resolvedAt: null };
  }

  /**
   * Builds the {@link ResolvedTemplateMeta} sidecar attached to every
   * resolved template callable. `locale` is a full {@link Intl.Locale}
   * instance so consumers can reach week info, numbering system, calendar,
   * etc. via the standard API; `direction` is a shortcut for the common
   * `textInfo.direction` case, with a known-RTL-language fallback for
   * runtimes that haven't shipped the Intl Locale Info API yet.
   */
  #metaFor(resolvedAt: L): ResolvedTemplateMeta {
    const intlLocale = new Intl.Locale(resolvedAt);
    const direction =
      intlLocale.textInfo?.direction ??
      (RTL_LANGUAGES.has(intlLocale.language) ? "rtl" : "ltr");
    return { locale: intlLocale, direction };
  }
}

/**
 * Fallback RTL language set used by `#metaFor` when the runtime's
 * `Intl.Locale.prototype.textInfo` getter isn't available — covers the
 * widely-deployed RTL scripts. Modern engines never hit this path; it's a
 * safety net for older Chrome / Safari.
 */
const RTL_LANGUAGES: ReadonlySet<string> = new Set([
  "ar",
  "fa",
  "he",
  "ps",
  "sd",
  "ur",
  "yi",
]);

/**
 * Curried alternative to constructing {@link Dictionary} directly — captures
 * the locales (and optional fallback handler) and returns a function that
 * accepts dictionary entries.
 *
 * @typeParam L - Locale union for this i18n instance.
 * @param locales - Configured locale list in fallback-chain order.
 * @param onFallback - Optional fallback handler.
 * @returns A `dictionary(entries)` function that builds a typed
 * {@link Dictionary}.
 */
export function makeDictionary<L extends string>(
  locales: readonly L[],
  onFallback?: FallbackHandler<L>,
) {
  return function dictionary<D extends Input<L>>(entries: D): Dictionary<L, D> {
    return new Dictionary<L, D>(locales, entries, onFallback);
  };
}

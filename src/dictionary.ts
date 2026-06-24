import { Template } from "./template";
import type { Input, Merged } from "./types";

export type FallbackEvent<L extends string> = {
  key: string;
  requested: L;
  resolved: L | null;
};

export type FallbackHandler<L extends string> = (event: FallbackEvent<L>) => void;

export class Dictionary<L extends string, D extends Input<L>> {
  readonly #entries: D;
  readonly #locales: readonly L[];
  readonly #onFallback?: FallbackHandler<L>;
  readonly #cache = new Map<L, Merged<L, D>>();

  constructor(
    locales: readonly L[],
    entries: D,
    onFallback?: FallbackHandler<L>,
  ) {
    this.#locales = locales;
    this.#entries = entries;
    this.#onFallback = onFallback;
  }

  resolve(locale: L): Merged<L, D> {
    const cached = this.#cache.get(locale);
    if (cached !== undefined) return cached;
    const resolved = Object.fromEntries(
      Object.entries(this.#entries).map(([key, entry]) => [
        key,
        this.#pick(entry, key, locale),
      ]),
    ) as Merged<L, D>;
    this.#cache.set(locale, resolved);
    return resolved;
  }

  #pick(entry: unknown, key: string, locale: L): unknown {
    if (entry instanceof Template) {
      return this.#fromVariants(
        entry.variants as Record<string, unknown>,
        key,
        locale,
      );
    }
    if (isObject(entry)) {
      return this.#fromVariants(
        entry as Record<string, unknown>,
        key,
        locale,
      );
    }
    return entry;
  }

  #fromVariants(
    variants: Record<string, unknown>,
    key: string,
    locale: L,
  ): unknown {
    const active = variants[locale];
    if (active !== undefined && active !== null) return active;
    for (const candidate of this.#locales) {
      if (candidate === locale) continue;
      const value = variants[candidate];
      if (value !== undefined && value !== null) {
        this.#onFallback?.({ key, requested: locale, resolved: candidate });
        return value;
      }
    }
    this.#onFallback?.({ key, requested: locale, resolved: null });
    return null;
  }
}

function isObject(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

export function makeDictionary<L extends string>(
  locales: readonly L[],
  onFallback?: FallbackHandler<L>,
) {
  return function dictionary<D extends Input<L>>(
    entries: D,
  ): Dictionary<L, D> {
    return new Dictionary<L, D>(locales, entries, onFallback);
  };
}

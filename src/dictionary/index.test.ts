import { describe, expect, it, vi } from "vitest";

import { makeDictionary } from "./index.ts";
import { makeTemplate } from "../template/index.ts";
import type { FallbackEvent } from "../types.ts";

const locales = ["en", "fr"] as const;
const dictionary = makeDictionary<"en" | "fr">(locales);
const template = makeTemplate<"en" | "fr">();

describe("Dictionary.resolve()", () => {
  it("returns the active locale's variant for token-less templates", () => {
    const dict = dictionary({
      ok: template({ en: () => "OK", fr: () => "Accepter" }),
    });
    expect(dict.resolve("en").ok()).toBe("OK");
    expect(dict.resolve("fr").ok()).toBe("Accepter");
  });

  it("falls back to any defined locale when the active one is missing", () => {
    const dict = dictionary({
      auRevoir: template({ fr: () => "Au revoir" }),
    });
    expect(dict.resolve("en").auRevoir()).toBe("Au revoir");
  });

  it("invokes Template variants with the supplied args", () => {
    const dict = dictionary({
      greet: template<{ name: string }>({
        en({ tokens }) {
          return `Hello, ${tokens.name}`;
        },
        fr({ tokens }) {
          return `Bonjour, ${tokens.name}`;
        },
      }),
    });
    expect(dict.resolve("en").greet({ name: "Imogen" })).toBe("Hello, Imogen");
    expect(dict.resolve("fr").greet({ name: "Phoebe" })).toBe(
      "Bonjour, Phoebe",
    );
  });

  it("passes locale-bound helpers to Template formatters", () => {
    const dict = dictionary({
      balance: template<{ amount: number }>({
        en({ tokens, helpers }) {
          return helpers
            .numberFormat({ style: "currency", currency: "USD" })
            .format(tokens.amount);
        },
        fr({ tokens, helpers }) {
          return helpers
            .numberFormat({ style: "currency", currency: "EUR" })
            .format(tokens.amount);
        },
      }),
    });
    expect(dict.resolve("en").balance({ amount: 1234.5 })).toBe("$1,234.50");
    expect(dict.resolve("fr").balance({ amount: 1234.5 })).toBe(
      new Intl.NumberFormat("fr", {
        style: "currency",
        currency: "EUR",
      }).format(1234.5),
    );
  });

  it("supports dateTimeFormat via helpers in Template formatters", () => {
    const dict = dictionary({
      sentOn: template<{ when: Date }>({
        en({ tokens, helpers }) {
          return helpers
            .dateTimeFormat({ dateStyle: "short" })
            .format(tokens.when);
        },
      }),
    });
    const when = new Date("2026-06-24T00:00:00Z");
    expect(dict.resolve("en").sentOn({ when })).toBe(
      new Intl.DateTimeFormat("en", { dateStyle: "short" }).format(when),
    );
  });

  it("supports pluralRules via helpers in Template formatters", () => {
    const dict = dictionary({
      items: template<{ count: number }>({
        en({ tokens, helpers }) {
          const category = helpers.pluralRules().select(tokens.count);
          return category === "one" ? "1 item" : `${tokens.count} items`;
        },
      }),
    });
    expect(dict.resolve("en").items({ count: 1 })).toBe("1 item");
    expect(dict.resolve("en").items({ count: 5 })).toBe("5 items");
  });

  it("falls back through locales for a Template missing the active variant", () => {
    const dict = dictionary({
      goodbye: template<{ name: string }>({
        en({ tokens }) {
          return `Goodbye, ${tokens.name}`;
        },
      }),
    });
    expect(dict.resolve("fr").goodbye({ name: "Imogen" })).toBe(
      "Goodbye, Imogen",
    );
  });

  it("memoises the resolved object per locale", () => {
    const dict = dictionary({
      ok: template({ en: () => "OK", fr: () => "Accepter" }),
    });
    expect(dict.resolve("en")).toBe(dict.resolve("en"));
    expect(dict.resolve("en")).not.toBe(dict.resolve("fr"));
  });

  it("returns null from a Template when no variant is defined anywhere", () => {
    // @ts-expect-error - intentionally empty to exercise the resolve-null path
    const empty = template<{ name: string }>({});
    const dict = dictionary({ broken: empty });
    expect(dict.resolve("en").broken).toBeNull();
  });

  it("invokes onFallback when a Template misses the active locale", () => {
    const events: FallbackEvent<"en" | "fr">[] = [];
    const localDictionary = makeDictionary<"en" | "fr">(locales, (event) =>
      events.push(event),
    );
    const dict = localDictionary({
      goodbye: template<{ name: string }>({
        en({ tokens }) {
          return `Goodbye, ${tokens.name}`;
        },
      }),
    });
    (dict.resolve("fr").goodbye as (args: { name: string }) => string)({
      name: "Imogen",
    });
    expect(events).toEqual([
      { key: "goodbye", requested: "fr", resolved: "en" },
    ]);
  });

  it("invokes onFallback with resolved=null when no locale defines the key", () => {
    const events: FallbackEvent<"en" | "fr">[] = [];
    const localDictionary = makeDictionary<"en" | "fr">(locales, (event) =>
      events.push(event),
    );
    // @ts-expect-error - intentionally empty to exercise the resolve-null path
    const empty = template<{ name: string }>({});
    const dict = localDictionary({ broken: empty });
    expect(dict.resolve("en").broken).toBeNull();
    expect(events).toEqual([
      { key: "broken", requested: "en", resolved: null },
    ]);
  });

  it("does not invoke onFallback when the active locale's variant resolves", () => {
    const callback = vi.fn();
    const localDictionary = makeDictionary<"en" | "fr">(locales, callback);
    const dict = localDictionary({
      ok: template({ en: () => "OK", fr: () => "Accepter" }),
    });
    dict.resolve("fr");
    expect(callback).not.toHaveBeenCalled();
  });

  it("attaches direction + locale metadata to resolved Template callables", () => {
    const arLocales = ["en", "ar"] as const;
    const arDict = makeDictionary<"en" | "ar">(arLocales);
    const arTemplate = makeTemplate<"en" | "ar">();
    const dict = arDict({
      greet: arTemplate<{ name: string }>({
        en({ tokens }) {
          return `Hello, ${tokens.name}`;
        },
        ar({ tokens }) {
          return `مرحباً، ${tokens.name}`;
        },
      }),
    });

    const ltr = dict.resolve("en").greet;
    expect(ltr.direction).toBe("ltr");
    expect(ltr.locale.language).toBe("en");

    const rtl = dict.resolve("ar").greet;
    expect(rtl.direction).toBe("rtl");
    expect(rtl.locale.language).toBe("ar");
  });

  it("reports the resolved (not requested) locale on a Template fallback", () => {
    const arLocales = ["ar", "fr"] as const;
    const dict = makeDictionary<"ar" | "fr">(arLocales)({
      farewell: makeTemplate<"ar" | "fr">()<{ name: string }>({
        fr({ tokens }) {
          return `Au revoir, ${tokens.name}`;
        },
      }),
    });

    const resolved = dict.resolve("ar").farewell;
    expect(resolved.direction).toBe("ltr");
    expect(resolved.locale.language).toBe("fr");
    expect(resolved({ name: "Imogen" })).toBe("Au revoir, Imogen");
  });

  it("falls back to a known-RTL language list when Intl.Locale.textInfo is unavailable", () => {
    const original = Object.getOwnPropertyDescriptor(
      Intl.Locale.prototype,
      "textInfo",
    );
    Object.defineProperty(Intl.Locale.prototype, "textInfo", {
      get: () => undefined,
      configurable: true,
    });

    try {
      const dict = makeDictionary<"en" | "ar">(["en", "ar"] as const)({
        greet: makeTemplate<"en" | "ar">()<{ name: string }>({
          en({ tokens }) {
            return `Hello, ${tokens.name}`;
          },
          ar({ tokens }) {
            return `مرحباً، ${tokens.name}`;
          },
        }),
      });
      expect(dict.resolve("ar").greet.direction).toBe("rtl");
      expect(dict.resolve("en").greet.direction).toBe("ltr");
    } finally {
      if (original !== undefined) {
        Object.defineProperty(Intl.Locale.prototype, "textInfo", original);
      } else {
        delete (Intl.Locale.prototype as Record<string, unknown>).textInfo;
      }
    }
  });
});

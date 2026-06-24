import { describe, expect, it, vi } from "vitest";

import { Dictionary, makeDictionary, type FallbackEvent } from "./dictionary";
import { makeTemplate } from "./template";

const locales = ["en", "fr"] as const;
const dictionary = makeDictionary<"en" | "fr">(locales);
const template = makeTemplate<"en" | "fr">();

describe("Dictionary.resolve()", () => {
  it("returns the active locale's variant for plain string entries", () => {
    const dict = dictionary({
      ok: { en: "OK", fr: "Accepter" },
    });
    expect(dict.resolve("en").ok).toBe("OK");
    expect(dict.resolve("fr").ok).toBe("Accepter");
  });

  it("falls back to any defined locale when the active one is missing", () => {
    const dict = dictionary({
      auRevoir: { fr: "Au revoir" },
    });
    expect(dict.resolve("en").auRevoir).toBe("Au revoir");
  });

  it("invokes Template variants with the supplied args", () => {
    const dict = dictionary({
      greet: template<{ name: string }>({
        en: ({ name }) => `Hello, ${name}`,
        fr: ({ name }) => `Bonjour, ${name}`,
      }),
    });
    expect(dict.resolve("en").greet({ name: "Imogen" })).toBe(
      "Hello, Imogen",
    );
    expect(dict.resolve("fr").greet({ name: "Phoebe" })).toBe(
      "Bonjour, Phoebe",
    );
  });

  it("falls back through locales for a Template missing the active variant", () => {
    const dict = dictionary({
      goodbye: template<{ name: string }>({
        en: ({ name }) => `Goodbye, ${name}`,
      }),
    });
    expect(dict.resolve("fr").goodbye({ name: "Imogen" })).toBe(
      "Goodbye, Imogen",
    );
  });

  it("memoises the resolved object per locale", () => {
    const dict = dictionary({ ok: { en: "OK", fr: "Accepter" } });
    expect(dict.resolve("en")).toBe(dict.resolve("en"));
    expect(dict.resolve("en")).not.toBe(dict.resolve("fr"));
  });

  it("returns null when no variant is defined for any locale", () => {
    const dict = new Dictionary<"en" | "fr", Record<string, never>>(
      locales,
      { broken: {} } as never,
    );
    expect(dict.resolve("en").broken).toBeNull();
  });

  it("returns primitive entries as-is when they aren't Templates or objects", () => {
    const dict = new Dictionary<"en" | "fr", Record<string, never>>(
      locales,
      { stray: 42 } as never,
    );
    expect(
      (dict.resolve("en") as unknown as { stray: number }).stray,
    ).toBe(42);
  });

  it("invokes onFallback when a Template misses the active locale", () => {
    const events: FallbackEvent<"en" | "fr">[] = [];
    const localDictionary = makeDictionary<"en" | "fr">(locales, (event) =>
      events.push(event),
    );
    const dict = localDictionary({
      goodbye: template<{ name: string }>({
        en: ({ name }) => `Goodbye, ${name}`,
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
    const dict = new Dictionary<"en" | "fr", Record<string, never>>(
      locales,
      { broken: {} } as never,
      (event) => events.push(event),
    );
    expect(dict.resolve("en").broken).toBeNull();
    expect(events).toEqual([
      { key: "broken", requested: "en", resolved: null },
    ]);
  });

  it("does not invoke onFallback when the active locale's variant resolves", () => {
    const callback = vi.fn();
    const localDictionary = makeDictionary<"en" | "fr">(locales, callback);
    const dict = localDictionary({
      ok: { en: "OK", fr: "Accepter" },
    });
    dict.resolve("fr");
    expect(callback).not.toHaveBeenCalled();
  });
});

import { renderHook } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { makeDictionary } from "./dictionary";
import { makeHooks } from "./hooks";
import { makeTemplate } from "./template";

const locales = ["en", "fr"] as const;
const dictionary = makeDictionary<"en" | "fr">(locales);
const template = makeTemplate<"en" | "fr">();

function fixed(locale: "en" | "fr") {
  return () => ({ locale });
}

describe("useI18n()", () => {
  const dict = dictionary({
    greet: template<{ name: string }>({
      en: ({ name }) => `Hello, ${name}`,
      fr: ({ name }) => `Bonjour, ${name}`,
    }),
  });

  it("resolves the dictionary for the active locale", () => {
    const { useI18n } = makeHooks<"en" | "fr">(fixed("fr"));
    const { result } = renderHook(() => useI18n(dict));
    expect(result.current.greet({ name: "Phoebe" })).toBe("Bonjour, Phoebe");
  });
});

describe("useNumberFormat()", () => {
  it("formats numbers in the active locale", () => {
    const { useNumberFormat } = makeHooks<"en" | "fr">(fixed("en"));
    const { result } = renderHook(() => useNumberFormat());
    expect(result.current.format(1234.5)).toBe(
      new Intl.NumberFormat("en").format(1234.5),
    );
  });

  it("honours options like currency", () => {
    const { useNumberFormat } = makeHooks<"en" | "fr">(fixed("en"));
    const { result } = renderHook(() =>
      useNumberFormat({ style: "currency", currency: "USD" }),
    );
    expect(result.current.format(1234.5)).toBe("$1,234.50");
  });
});

describe("useDateTimeFormat()", () => {
  it("formats dates in the active locale", () => {
    const { useDateTimeFormat } = makeHooks<"en" | "fr">(fixed("en"));
    const { result } = renderHook(() =>
      useDateTimeFormat({ dateStyle: "short" }),
    );
    const date = new Date("2026-06-24T00:00:00Z");
    expect(result.current.format(date)).toBe(
      new Intl.DateTimeFormat("en", { dateStyle: "short" }).format(date),
    );
  });
});

describe("usePluralRules()", () => {
  it("returns 'one' for 1 in English", () => {
    const { usePluralRules } = makeHooks<"en" | "fr">(fixed("en"));
    const { result } = renderHook(() => usePluralRules());
    expect(result.current.select(1)).toBe("one");
  });

  it("returns 'other' for 2 in English", () => {
    const { usePluralRules } = makeHooks<"en" | "fr">(fixed("en"));
    const { result } = renderHook(() => usePluralRules());
    expect(result.current.select(2)).toBe("other");
  });

  it("respects fr CLDR (1.5 is 'one')", () => {
    const { usePluralRules } = makeHooks<"en" | "fr">(fixed("fr"));
    const { result } = renderHook(() => usePluralRules());
    expect(result.current.select(1.5)).toBe("one");
  });
});

import { act, renderHook } from "@testing-library/react";
import type { ReactNode } from "react";
import { describe, expect, it } from "vitest";

import { Translations } from "./translations";

const translator = new Translations({ locales: ["en", "fr", "de"] as const });

const translations = translator.dictionary({
  greet: translator.template<{ name: string }>({
    en: ({ name }) => `Hello, ${name}`,
    fr: ({ name }) => `Bonjour, ${name}`,
    de: ({ name }) => `Hallo, ${name}`,
  }),
  ok: { en: "OK", fr: "Accepter", de: "OK" },
  auRevoir: { fr: "Au revoir" },
  balance: translator.template<{ amount: number }>({
    en: ({ amount }, helpers) =>
      `Balance: ${helpers
        .numberFormat({ style: "currency", currency: "USD" })
        .format(amount)}`,
    fr: ({ amount }, helpers) =>
      `Solde : ${helpers
        .numberFormat({ style: "currency", currency: "EUR" })
        .format(amount)}`,
  }),
});

function wrap(locale?: "en" | "fr" | "de") {
  return function Wrapper({ children }: { children: ReactNode }) {
    return (
      <translator.LocaleProvider locale={locale}>
        {children}
      </translator.LocaleProvider>
    );
  };
}

describe("new Translations()", () => {
  it("exposes the configured locales", () => {
    expect(translator.locales).toEqual(["en", "fr", "de"]);
  });

  it("rejects an empty locales list", () => {
    expect(() => new Translations({ locales: [] as never })).toThrow(
      /at least one locale/i,
    );
  });

  it("resolves plain string entries via the hooks", () => {
    const { result } = renderHook(() => translator.useI18n(translations), {
      wrapper: wrap("fr"),
    });
    expect(result.current.ok).toBe("Accepter");
  });

  it("resolves Template entries with args", () => {
    const { result } = renderHook(() => translator.useI18n(translations), {
      wrapper: wrap("de"),
    });
    expect(result.current.greet({ name: "Imogen" })).toBe("Hallo, Imogen");
  });

  it("passes locale-bound helpers to Template formatters", () => {
    const { result } = renderHook(() => translator.useI18n(translations), {
      wrapper: wrap("en"),
    });
    expect(result.current.balance({ amount: 1234.5 })).toBe(
      "Balance: $1,234.50",
    );
  });

  it("falls back across locales when the active one is missing", () => {
    const { result } = renderHook(() => translator.useI18n(translations), {
      wrapper: wrap("en"),
    });
    expect(result.current.auRevoir).toBe("Au revoir");
  });

  it("lets the consumer override the locale at runtime", () => {
    const { result } = renderHook(
      () => ({
        handle: translator.useLocale(),
        translations: translator.useI18n(translations),
      }),
      { wrapper: wrap() },
    );
    expect(result.current.translations.ok).toBe("OK");
    act(() => result.current.handle.setLocale("fr"));
    expect(result.current.translations.ok).toBe("Accepter");
  });

  it("matches the detected locale against the supported set", () => {
    expect(translator.detectLocale(["de-CH", "en-GB"])).toBe("de");
    expect(translator.detectLocale(["es-ES"])).toBe("en");
    expect(translator.isLocale("fr")).toBe(true);
    expect(translator.isLocale("ja")).toBe(false);
  });

  it("threads onFallback into the dictionary", () => {
    const events: {
      key: string;
      requested: "en" | "fr";
      resolved: "en" | "fr" | null;
    }[] = [];
    const scoped = new Translations({
      locales: ["en", "fr"] as const,
      onFallback: (event) => events.push(event),
    });
    const dict = scoped.dictionary({
      auRevoir: { fr: "Au revoir" },
    });
    const { result } = renderHook(() => scoped.useI18n(dict), {
      wrapper: ({ children }: { children: ReactNode }) => (
        <scoped.LocaleProvider locale="en">{children}</scoped.LocaleProvider>
      ),
    });
    expect(result.current.auRevoir).toBe("Au revoir");
    expect(events).toEqual([
      { key: "auRevoir", requested: "en", resolved: "fr" },
    ]);
  });
});

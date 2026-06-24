import { act, renderHook } from "@testing-library/react";
import type { ReactNode } from "react";
import { describe, expect, it } from "vitest";

import { createI18n } from "./factory";

const i18n = createI18n({ locales: ["en", "fr", "de"] as const });

const translations = i18n.dictionary({
  greet: i18n.template<{ name: string }>({
    en: ({ name }) => `Hello, ${name}`,
    fr: ({ name }) => `Bonjour, ${name}`,
    de: ({ name }) => `Hallo, ${name}`,
  }),
  ok: { en: "OK", fr: "Accepter", de: "OK" },
  auRevoir: { fr: "Au revoir" },
});

function wrap(locale?: "en" | "fr" | "de") {
  return function Wrapper({ children }: { children: ReactNode }) {
    return <i18n.LocaleProvider locale={locale}>{children}</i18n.LocaleProvider>;
  };
}

describe("createI18n()", () => {
  it("exposes the configured locales and the chosen fallback", () => {
    expect(i18n.locales).toEqual(["en", "fr", "de"]);
    expect(i18n.fallback).toBe("en");
  });

  it("honours an explicit fallback", () => {
    const custom = createI18n({
      locales: ["en", "fr"] as const,
      fallback: "fr",
    });
    expect(custom.fallback).toBe("fr");
  });

  it("rejects an empty locales list", () => {
    expect(() => createI18n({ locales: [] as never })).toThrow(
      /at least one locale/i,
    );
  });

  it("rejects a fallback not in the locales list", () => {
    expect(() =>
      createI18n({ locales: ["en"] as const, fallback: "de" as never }),
    ).toThrow(/not in the configured locales/i);
  });

  it("resolves plain string entries via the hooks", () => {
    const { result } = renderHook(() => i18n.useI18n(translations), {
      wrapper: wrap("fr"),
    });
    expect(result.current.ok).toBe("Accepter");
  });

  it("resolves Template entries with args", () => {
    const { result } = renderHook(() => i18n.useI18n(translations), {
      wrapper: wrap("de"),
    });
    expect(result.current.greet({ name: "Imogen" })).toBe("Hallo, Imogen");
  });

  it("falls back across locales when the active one is missing", () => {
    const { result } = renderHook(() => i18n.useI18n(translations), {
      wrapper: wrap("en"),
    });
    expect(result.current.auRevoir).toBe("Au revoir");
  });

  it("lets the consumer override the locale at runtime", () => {
    const { result } = renderHook(
      () => ({
        handle: i18n.useLocale(),
        translations: i18n.useI18n(translations),
      }),
      { wrapper: wrap() },
    );
    expect(result.current.translations.ok).toBe("OK");
    act(() => result.current.handle.setLocale("fr"));
    expect(result.current.translations.ok).toBe("Accepter");
  });

  it("matches the detected locale against the supported set", () => {
    expect(i18n.detectLocale(["de-CH", "en-GB"])).toBe("de");
    expect(i18n.detectLocale(["es-ES"])).toBe("en");
    expect(i18n.isLocale("fr")).toBe(true);
    expect(i18n.isLocale("ja")).toBe(false);
  });

  it("threads onFallback from createI18n into the dictionary", () => {
    const events: {
      key: string;
      requested: "en" | "fr";
      resolved: "en" | "fr" | null;
    }[] = [];
    const scoped = createI18n({
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

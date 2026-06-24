import { describe, expect, it, vi } from "vitest";

import { installPluralRulesPolyfill } from "./polyfill";

describe("installPluralRulesPolyfill()", () => {
  it("invokes the loader's polyfill, then data for each locale", async () => {
    const calls: string[] = [];
    await installPluralRulesPolyfill(["en", "fr", "de"], {
      polyfill: vi.fn(async () => {
        calls.push("polyfill");
      }),
      data: vi.fn(async (locale: string) => {
        calls.push(`data:${locale}`);
      }),
    });
    expect(calls[0]).toBe("polyfill");
    expect(calls.slice(1).sort()).toEqual(["data:de", "data:en", "data:fr"]);
  });

  it("propagates errors from the polyfill loader", async () => {
    await expect(
      installPluralRulesPolyfill(["en"], {
        polyfill: async () => {
          throw new Error("boom");
        },
        data: async () => {},
      }),
    ).rejects.toThrow("boom");
  });

  it("uses the default loader when none is supplied", async () => {
    await expect(installPluralRulesPolyfill(["en"])).resolves.toBeUndefined();
  });
});

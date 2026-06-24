import { describe, expect, it } from "vitest";

import { Template, makeTemplate } from "./template";

describe("Template", () => {
  it("stores the variants record on the instance", () => {
    const variants = { en: ({ name }: { name: string }) => `Hi, ${name}` };
    const message = new Template<"en", { name: string }>(variants);
    expect(message.variants).toBe(variants);
  });
});

describe("makeTemplate()", () => {
  it("returns a template helper bound to the locale set", () => {
    const template = makeTemplate<"en" | "fr">();
    const message = template<{ name: string }>({
      en: ({ name }) => `Hello, ${name}`,
      fr: ({ name }) => `Bonjour, ${name}`,
    });
    expect(message).toBeInstanceOf(Template);
    expect(message.variants.en?.({ name: "Imogen" })).toBe("Hello, Imogen");
  });
});

# Reacti8n

Tiny, type-safe, message-first i18n for React. No DSL, no ICU runtime, no codegen — translations are plain TypeScript functions.

## Why

- **Plain TS / JS** — interpolation is template literals, plurals are JS conditionals (or `Intl.PluralRules`), and `Intl.NumberFormat` / `Intl.DateTimeFormat` handle the rest.
- **Type-safe arguments** — `template<{ name: string }>({...})` enforces the argument shape across every locale at the type level.
- **Message-first nesting** — each message lives next to its translations, not split across `en: { ... }` and `fr: { ... }` blocks.
- **At-least-one locale** — a message must be defined in at least one configured locale (any of them, not specifically `en`). Type system rejects empty entries; runtime walks the locale list to find a defined variant.
- **Fallback observability** — register a callback to log Sentry events whenever the requested locale falls back to another.
- **No runtime DSL** — drop the `intl-messageformat` parser entirely. Polyfill `Intl.PluralRules` for older runtimes via `@formatjs/intl-pluralrules` if you need full CLDR coverage.

## Install

```sh
pnpm add reacti8n
# optional, for CLDR plural data on older runtimes:
pnpm add @formatjs/intl-pluralrules @formatjs/intl-localematcher
```

Peer dep: `react >= 18`.

## Setup

Configure once in your app entry. The factory returns a typed set of helpers scoped to your locale list — no module-level globals.

```ts
// src/i18n.ts
import { createI18n } from "reacti8n";

export const i18n = createI18n({
  locales: ["en", "fr", "de"] as const,
  fallback: "en", // optional, defaults to locales[0]
  onFallback: (event) => {
    // event: { key, requested, resolved }
    // Fires whenever a key resolves to a non-requested locale,
    // or to null when the key is missing everywhere.
    Sentry.captureMessage(
      `i18n fallback: ${event.key} (${event.requested} → ${event.resolved ?? "null"})`,
      "warning",
    );
  },
});
```

Wrap your app in the provider:

```tsx
// src/main.tsx
import { i18n } from "./i18n";

const detected = i18n.detectLocale();

createRoot(document.getElementById("root")!).render(
  <i18n.LocaleProvider locale={detected}>
    <App />
  </i18n.LocaleProvider>,
);
```

## Defining messages

A `Dictionary` is a flat record of message-id → variants. Each entry is either a plain `{ en, fr, ... }` map or a `template<Args>({ ... })` wrapper for messages that take arguments.

```ts
import { i18n } from "./i18n";

export const translations = i18n.dictionary({
  // Plain strings per locale.
  ok: { en: "OK", fr: "OK", de: "OK" },

  // Function variants with explicit args (recommended).
  greet: i18n.template<{ name: string }>({
    en: ({ name }) => `Hello, ${name}`,
    fr: ({ name }) => `Bonjour, ${name}`,
    de: ({ name }) => `Hallo, ${name}`,
  }),

  // Plurals via plain JS.
  items: i18n.template<{ count: number }>({
    en: ({ count }) =>
      count === 0 ? "No items" : count === 1 ? "1 item" : `${count} items`,
    fr: ({ count }) =>
      count <= 1 ? `${count} article` : `${count} articles`,
    de: ({ count }) => (count === 1 ? "1 Eintrag" : `${count} Einträge`),
  }),

  // Partial coverage is fine — falls back to any defined locale at runtime,
  // and the onFallback callback fires so you can flag the gap upstream.
  auRevoir: { fr: "Au revoir" },
});
```

## Consuming messages

```tsx
import { i18n } from "./i18n";
import { translations } from "./translations";

export function Welcome({ name }: { name: string }) {
  const t = i18n.useI18n(translations);
  return (
    <section>
      <h1>{t.greet({ name })}</h1>
      <p>{t.ok}</p>
    </section>
  );
}
```

Plain string entries become strings on the resolved object. Template entries become callables typed with their declared `Args`.

## Locale switching

`useLocale()` returns `{ locale, setLocale }`. Switch at runtime however you like:

```tsx
function LanguageSwitcher() {
  const { locale, setLocale } = i18n.useLocale();
  return (
    <select value={locale} onChange={(e) => setLocale(e.target.value as never)}>
      {i18n.locales.map((l) => (
        <option key={l} value={l}>
          {l}
        </option>
      ))}
    </select>
  );
}
```

Or drive it externally via the controlled `locale` prop on `<LocaleProvider>`.

## Number / date / plural formatting

Three hooks return memoised `Intl` instances scoped to the active locale:

```tsx
const amount = i18n.useNumberFormat({ style: "currency", currency: "USD" });
const when = i18n.useDateTimeFormat({ dateStyle: "medium" });
const plural = i18n.usePluralRules();

amount.format(1234.5);                 // "$1,234.50" in en, "1 234,50 $US" in fr
when.format(new Date());               // locale-formatted date
plural.select(1.5);                    // "one" in fr, "other" in en
```

Compose formatted values into your templates at the call site — keep template strings and formatting separate:

```ts
balance: i18n.template<{ amount: string }>({
  en: ({ amount }) => `Balance: ${amount}`,
  fr: ({ amount }) => `Solde : ${amount}`,
}),

// Call site:
const format = i18n.useNumberFormat({ style: "currency", currency: "USD" });
const t = i18n.useI18n(translations);
t.balance({ amount: format.format(1234.5) });
```

## Locale detection

`i18n.detectLocale()` reads `navigator.languages` (or `navigator.language`), matches each candidate's primary tag against the configured `locales`, and returns the first hit. Falls back to the configured fallback if nothing matches.

```ts
const detected = i18n.detectLocale();           // from navigator
const detected = i18n.detectLocale(["fr-CA"]);  // from explicit candidates
```

## Fallback observability

A common operational worry with i18n is "missing translations shipped quietly." Reacti8n calls the `onFallback` handler (registered on `createI18n`) every time a Dictionary entry resolves to a non-requested locale, or to `null` when the key is missing entirely.

```ts
type FallbackEvent<L> = {
  key: string;       // the message id that fell back
  requested: L;      // the locale the consumer asked for
  resolved: L | null; // the locale actually used (null = nothing found anywhere)
};
```

Pipe these into Sentry / Datadog / your logger of choice:

```ts
createI18n({
  locales: ["en", "fr", "de"] as const,
  onFallback: ({ key, requested, resolved }) => {
    if (resolved === null) {
      Sentry.captureException(
        new Error(`i18n key "${key}" is missing in every locale`),
      );
    } else {
      Sentry.captureMessage(
        `i18n key "${key}" missing for ${requested}; served ${resolved}`,
        "warning",
      );
    }
  },
});
```

The callback is invoked synchronously inside `Dictionary.resolve()`, so keep it cheap — typically just a logger call.

## Polyfilling `Intl.PluralRules`

Modern browsers + Node 18+ ship full ICU plural data natively. For older runtimes (React Native Hermes, small-icu Node, locked-down embedded), pull in the formatjs polyfill once at app entry:

```ts
import { installPluralRulesPolyfill } from "reacti8n";
import { i18n } from "./i18n";

await installPluralRulesPolyfill(i18n.locales);
```

This conditionally installs `@formatjs/intl-pluralrules` (no-op on engines that already have it) and loads each locale's CLDR data. The two `@formatjs/*` packages are optional peer deps — install them only if you call this function.

## API

| Export | Description |
|---|---|
| `createI18n({ locales, fallback?, onFallback? })` | Factory returning the typed helper set (see below) |
| `Dictionary<L, D>` | The class returned by `i18n.dictionary(...)` — exposed for `instanceof` checks and advanced typing |
| `Template<L, Args>` | The class returned by `i18n.template(...)` |
| `installPluralRulesPolyfill(locales, loader?)` | Optional polyfill installer for older runtimes |

`createI18n` returns:

| Member | Description |
|---|---|
| `locales`, `fallback` | Echoes of the configured values |
| `dictionary(entries)` | Builds a `Dictionary<L, D>` |
| `template<Args>(variants)` | Builds a `Template<L, Args>` |
| `LocaleProvider`, `useLocale` | The provider + `{ locale, setLocale }` hook |
| `useI18n(dictionary)` | Resolves a Dictionary for the active locale |
| `useNumberFormat`, `useDateTimeFormat`, `usePluralRules` | Memoised `Intl` wrappers |
| `detectLocale(candidates?)`, `isLocale(value)` | Detection helpers |

### Types

`Variants<L, V>` is `AtLeastOne<Record<L, V>>` — exactly one or more of the configured locales must be present at the type level. Empty entries fail to compile.

`Merged<L, D>` is the resolved shape of a Dictionary `D` for locale set `L` — string entries map to `string`, Template entries map to `(args: Args) => string`.

## License

MIT — see [LICENSE](./LICENSE).

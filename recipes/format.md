# Format factories

Every template formatter receives a `format` object scoped to the active locale. Each factory returns a fresh `Intl` instance configured for that locale — no setup, no caching to manage. The sections below show each factory as a single dictionary entry you'd add alongside the rest. Between them they cover the full locale-scoped `Intl` surface: `number`, `dateTime`, `plural`, `list`, `relativeTime`, `displayNames`, `duration`, `collator`, and `segmenter`.

## Plurals

`format.plural()` returns an `Intl.PluralRules` for the active locale. Branch on the category to pick the right form per language.

```ts
namespace Tokens {
  type Items = { count: number };
}

items: i18n.template<Tokens.Items>({
  [Locale.En]({ tokens, format }) {
    const category = format.plural().select(tokens.count);
    return category === "one" ? "1 item" : `${tokens.count} items`;
  },
  [Locale.Fr]({ tokens, format }) {
    const category = format.plural().select(tokens.count);
    return category === "one"
      ? `${tokens.count} article`
      : `${tokens.count} articles`;
  },
  [Locale.De]({ tokens, format }) {
    const category = format.plural().select(tokens.count);
    return category === "one" ? "1 Eintrag" : `${tokens.count} Einträge`;
  },
}),
```

## Numbers

`format.number(options)` returns an `Intl.NumberFormat`. Pass it standard `Intl.NumberFormatOptions` — currency, percentage, units, anything the spec supports.

```ts
namespace Tokens {
  type Balance = { amount: number };
}

balance: i18n.template<Tokens.Balance>({
  [Locale.En]({ tokens, format }) {
    return `Balance: ${format
      .number({ style: "currency", currency: "USD" })
      .format(tokens.amount)}`;
  },
  [Locale.Fr]({ tokens, format }) {
    return `Solde : ${format
      .number({ style: "currency", currency: "EUR" })
      .format(tokens.amount)}`;
  },
  [Locale.De]({ tokens, format }) {
    return `Saldo: ${format
      .number({ style: "currency", currency: "EUR" })
      .format(tokens.amount)}`;
  },
}),
```

## Dates

`format.dateTime(options)` returns an `Intl.DateTimeFormat`. Use the `dateStyle` / `timeStyle` presets or any granular option.

```ts
namespace Tokens {
  type SentOn = { when: Date };
}

sentOn: i18n.template<Tokens.SentOn>({
  [Locale.En]({ tokens, format }) {
    return `Sent on ${format
      .dateTime({ dateStyle: "long" })
      .format(tokens.when)}`;
  },
  [Locale.Fr]({ tokens, format }) {
    return `Envoyé le ${format
      .dateTime({ dateStyle: "long" })
      .format(tokens.when)}`;
  },
  [Locale.De]({ tokens, format }) {
    return `Gesendet am ${format
      .dateTime({ dateStyle: "long" })
      .format(tokens.when)}`;
  },
}),
```

## Lists

`format.list(options)` returns an `Intl.ListFormat`. Combine an array of strings into a locale-appropriate conjunction (`"a, b and c"`) or disjunction (`"a, b or c"`).

```ts
namespace Tokens {
  type Attendees = { names: string[] };
}

attendees: i18n.template<Tokens.Attendees>({
  [Locale.En]({ tokens, format }) {
    return `Attending: ${format
      .list({ style: "long", type: "conjunction" })
      .format(tokens.names)}`;
  },
  [Locale.Fr]({ tokens, format }) {
    return `Présents : ${format
      .list({ style: "long", type: "conjunction" })
      .format(tokens.names)}`;
  },
  [Locale.De]({ tokens, format }) {
    return `Anwesend: ${format
      .list({ style: "long", type: "conjunction" })
      .format(tokens.names)}`;
  },
}),
```

## Relative time

`format.relativeTime(options)` returns an `Intl.RelativeTimeFormat`. Pass a signed offset and a unit (`"minute"`, `"day"`, `"month"`, …) to render `"3 days ago"` / `"in 2 hours"` correctly per locale. `numeric: "auto"` picks natural phrasings like `"yesterday"` where available.

```ts
namespace Tokens {
  type Ago = { minutes: number };
}

ago: i18n.template<Tokens.Ago>({
  [Locale.En]({ tokens, format }) {
    return format
      .relativeTime({ numeric: "auto" })
      .format(-tokens.minutes, "minute");
  },
  [Locale.Fr]({ tokens, format }) {
    return format
      .relativeTime({ numeric: "auto" })
      .format(-tokens.minutes, "minute");
  },
  [Locale.De]({ tokens, format }) {
    return format
      .relativeTime({ numeric: "auto" })
      .format(-tokens.minutes, "minute");
  },
}),
```

## Display names

`format.displayNames(options)` returns an `Intl.DisplayNames`. Resolve a BCP-47 code to a human-readable name — regions (`"AE"` → `"United Arab Emirates"`), languages, currencies, scripts, calendars, or date/time fields. `type` is required.

```ts
namespace Tokens {
  type Region = { code: string };
}

region: i18n.template<Tokens.Region>({
  [Locale.En]({ tokens, format }) {
    return `Region: ${format.displayNames({ type: "region" }).of(tokens.code)}`;
  },
  [Locale.Fr]({ tokens, format }) {
    return `Région : ${format.displayNames({ type: "region" }).of(tokens.code)}`;
  },
  [Locale.De]({ tokens, format }) {
    return `Region: ${format.displayNames({ type: "region" }).of(tokens.code)}`;
  },
}),
```

## Duration

`format.duration(options)` returns an `Intl.DurationFormat` (stage-3). Pass an object with `hours`, `minutes`, `seconds`, etc. — the formatter renders it in the active locale's conventional form.

```ts
namespace Tokens {
  type Elapsed = { duration: Intl.DurationInput };
}

elapsed: i18n.template<Tokens.Elapsed>({
  [Locale.En]({ tokens, format }) {
    return `Elapsed: ${format
      .duration({ style: "long" })
      .format(tokens.duration)}`;
  },
  [Locale.Fr]({ tokens, format }) {
    return `Durée : ${format
      .duration({ style: "long" })
      .format(tokens.duration)}`;
  },
  [Locale.De]({ tokens, format }) {
    return `Vergangen: ${format
      .duration({ style: "long" })
      .format(tokens.duration)}`;
  },
}),
```

## Collator

`format.collator(options)` returns an `Intl.Collator` — use its `.compare` method as an `Array.prototype.sort` comparator for locale-correct ordering (Swedish `å` after `z`, German `ä` alongside `a`, etc.).

```ts
namespace Tokens {
  type Sorted = { items: string[] };
}

sorted: i18n.template<Tokens.Sorted>({
  [Locale.En]({ tokens, format }) {
    const collator = format.collator({ sensitivity: "base" });
    return [...tokens.items].sort(collator.compare).join(", ");
  },
  [Locale.Fr]({ tokens, format }) {
    const collator = format.collator({ sensitivity: "base" });
    return [...tokens.items].sort(collator.compare).join(", ");
  },
  [Locale.De]({ tokens, format }) {
    const collator = format.collator({ sensitivity: "base" });
    return [...tokens.items].sort(collator.compare).join(", ");
  },
}),
```

## Segmenter

`format.segmenter(options)` returns an `Intl.Segmenter`. Split text into locale-aware graphemes, words, or sentences — essential for scripts like Thai or Chinese where whitespace doesn't delimit words. Filter on `isWordLike` to skip punctuation.

```ts
namespace Tokens {
  type WordCount = { text: string };
}

wordCount: i18n.template<Tokens.WordCount>({
  [Locale.En]({ tokens, format }) {
    const words = [
      ...format.segmenter({ granularity: "word" }).segment(tokens.text),
    ].filter((segment) => segment.isWordLike).length;
    return `${words} words`;
  },
  [Locale.Fr]({ tokens, format }) {
    const words = [
      ...format.segmenter({ granularity: "word" }).segment(tokens.text),
    ].filter((segment) => segment.isWordLike).length;
    return `${words} mots`;
  },
  [Locale.De]({ tokens, format }) {
    const words = [
      ...format.segmenter({ granularity: "word" }).segment(tokens.text),
    ].filter((segment) => segment.isWordLike).length;
    return `${words} Wörter`;
  },
}),
```

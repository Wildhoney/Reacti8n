export type Formatter<Args> = (args: Args) => string;

export type AtLeastOne<T> = {
  [K in keyof T]-?: Required<Pick<T, K>> & Partial<Omit<T, K>>;
}[keyof T];

export type Variants<L extends string, V> = AtLeastOne<Record<L, V>>;

export type TemplateLike<L extends string> = {
  readonly __args: unknown;
  readonly variants: Variants<L, (args: never) => string>;
};

export type Entry<L extends string> = TemplateLike<L> | Variants<L, unknown>;

export type Input<L extends string> = Record<string, Entry<L>>;

import type { Template } from "./template";

export type Resolved<L extends string, E> = E extends Template<L, infer Args>
  ? (args: Args) => string
  : E extends Variants<L, infer V>
    ? V
    : never;

export type Merged<L extends string, D extends Input<L>> = {
  [K in keyof D]: Resolved<L, D[K]>;
};

import type { Formatter, Variants } from "./types";

export class Template<L extends string, Args> {
  declare readonly __args: Args;
  constructor(public readonly variants: Variants<L, Formatter<Args>>) {}
}

export function makeTemplate<L extends string>() {
  return function template<Args>(
    variants: Variants<L, Formatter<Args>>,
  ): Template<L, Args> {
    return new Template<L, Args>(variants);
  };
}

export enum MaybeType {
  Some,
  None
}

export type Maybe<T> =
  | {
      type: typeof MaybeType.None;
    }
  | {
      type: typeof MaybeType.Some;
      value: T;
    };

export function some<T>(x: T): Maybe<T> {
  return {
    type: MaybeType.Some,
    value: x
  };
}

export function none<T>(): Maybe<T> {
  return {
    type: MaybeType.None
  };
}

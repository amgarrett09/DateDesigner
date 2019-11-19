export enum ResultType {
  Ok,
  Err
}

export type Result<T> =
  | {
      type: typeof ResultType.Ok;
      value: T;
    }
  | {
      type: typeof ResultType.Err;
      message: string;
    };

export function ok<T>(x: T): Result<T> {
  return {
    type: ResultType.Ok,
    value: x
  };
}

export function err<T>(message: string): Result<T> {
  return {
    type: ResultType.Err,
    message
  };
}

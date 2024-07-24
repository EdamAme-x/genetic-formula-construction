export type Result<T, E> = ReturnType<typeof Ok<T> | typeof Err<E>>;

export function Ok<T>(value: T) {
  return {
    isOk: true,
    isErr: false,
    value,
  };
}

export function Err<E>(error: E) {
  return {
    isOk: false,
    isErr: true,
    error,
  };
}

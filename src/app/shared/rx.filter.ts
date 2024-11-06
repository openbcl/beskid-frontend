import { filter, Observable, OperatorFunction, pipe, UnaryFunction } from "rxjs";

export const filterNullish = <T>(): UnaryFunction<Observable<T | null | undefined>, Observable<T>> => {
  return pipe(
    filter(x => x != null) as OperatorFunction<T | null |  undefined, T>
  );
}
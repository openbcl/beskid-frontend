import { Observable, of, OperatorFunction } from "rxjs"

export const StoreMock = {
    pipe: (..._operations: OperatorFunction<any, any>[]) => of<any>({}),
    dispatch: (_action: any): void => {},
    select: (_selector: any): Observable<any> => of<any>({})
}

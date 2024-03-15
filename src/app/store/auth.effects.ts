import { Injectable } from "@angular/core";
import { Actions, createEffect , ofType } from '@ngrx/effects';
import { AuthService } from "../services/auth.service";
import { catchError, filter, map, of, switchMap, tap } from "rxjs";
import { Router } from "@angular/router";
import { Store } from "@ngrx/store";
import { finishProcessing, startProcessing } from "./ui.actions";
import * as AuthActions from './auth.actions';
import * as ToastActions from './toast.actions';


@Injectable()
export class AuthEffects {

  newSession$ = createEffect(() => this.actions$.pipe(
    ofType(AuthActions.newSession),
    tap(action => this.store.dispatch(startProcessing({id: action.type}))),
    switchMap(action =>
      this.authService.newSession().pipe(
        switchMap(auth => of(finishProcessing({id: action.type}), AuthActions.newSessionSuccess({ auth }))),
        catchError(error => of(finishProcessing({id: action.type}), AuthActions.newSessionFailure({ error })))
      )
    )
  ));

  newSessionSuccess$ = createEffect(() => this.actions$.pipe(
    ofType(AuthActions.newSessionSuccess),
    tap(() => this.router.navigate(['/'])),
    switchMap(() => of(ToastActions.toastInfo({
      summary: 'Welcome!'
    })))
  ));

  renewSession$ = createEffect(() => this.actions$.pipe(
    ofType(AuthActions.renewSession),
    tap(action => this.store.dispatch(startProcessing({id: action.type}))),
    switchMap(action =>
      this.authService.renewSession(action.auth).pipe(
        switchMap(auth => of(finishProcessing({id: action.type}), AuthActions.renewSessionSuccess({ auth }))),
        catchError(error => of(finishProcessing({id: action.type}), AuthActions.renewSessionFailure({ error })))
      )
    )
  ));

  checkSession$ = createEffect(() => this.actions$.pipe(
    ofType(AuthActions.checkSession),
    tap(action => this.store.dispatch(startProcessing({id: action.type}))),
    switchMap(action =>
      this.authService.checkSession().pipe(
        switchMap(sessionState => of(finishProcessing({id: action.type}), AuthActions.checkSessionSuccess(sessionState))),
        catchError(error => of(finishProcessing({id: action.type}), AuthActions.checkSessionFailure({ error })))
      )
    )
  ));

  checkSessionSuccess$ = createEffect(() => this.actions$.pipe(
    ofType(AuthActions.checkSessionSuccess),
    filter(action => !action.isValid || action.ageInDays > 0),
    switchMap(action => of(action.isValid ? AuthActions.renewSession({ auth: action.auth }) : AuthActions.newSession()))
  ));

  checkSessionFailure$ = createEffect(() => this.actions$.pipe(
    ofType(AuthActions.checkSessionFailure),
    map(() => AuthActions.newSession())
  ));

  deleteSession$ = createEffect(() => this.actions$.pipe(
    ofType(AuthActions.deleteSession),
    tap(action => this.store.dispatch(startProcessing({id: action.type}))),
    switchMap(action =>
      this.authService.deleteSession().pipe(
        switchMap(() => of(finishProcessing({id: action.type}), AuthActions.deleteSessionSuccess())),
        catchError(error => of(finishProcessing({id: action.type}), AuthActions.deleteSessionFailure({ error })))
      )
    )
  ));

  deleteSessionSuccess$ = createEffect(() => this.actions$.pipe(
    ofType(AuthActions.deleteSessionSuccess),
    map(() => AuthActions.newSession())
  ));

  constructor(
    private actions$: Actions,
    private router: Router,
    private store: Store,
    private authService: AuthService
  ) {}

}

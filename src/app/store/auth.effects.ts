import { Injectable } from "@angular/core";
import { Actions, createEffect , ofType } from '@ngrx/effects';
import { AuthService } from "../services/auth.service";
import { catchError, filter, map, of, switchMap, tap } from "rxjs";
import * as AuthActions from './auth.actions';
import * as ToastActions from './toast.actions';
import { Router } from "@angular/router";


@Injectable()
export class AuthEffects {

  newSession$ = createEffect(() => this.actions$.pipe(
    ofType(AuthActions.newSession),
    switchMap(() =>
      this.authService.newSession().pipe(
        map(auth => AuthActions.newSessionSuccess({ auth })),
        catchError(error => of(AuthActions.newSessionFailure({ error })))
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
    switchMap(action =>
      this.authService.renewSession(action.auth).pipe(
        map(auth => AuthActions.renewSessionSuccess({ auth })),
        catchError(error => of(AuthActions.renewSessionFailure({ error })))
      )
    )
  ));

  checkSession$ = createEffect(() => this.actions$.pipe(
    ofType(AuthActions.checkSession),
    switchMap(() =>
      this.authService.checkSession().pipe(
        map(sessionState => AuthActions.checkSessionSuccess(sessionState)),
        catchError(error => of(AuthActions.checkSessionFailure({ error })))
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
    switchMap(() =>
      this.authService.deleteSession().pipe(
        map(() => AuthActions.deleteSessionSuccess()),
        catchError(error => of(AuthActions.deleteSessionFailure({ error })))
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
    private authService: AuthService
  ) {}

}

import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { tap } from 'rxjs/operators';
import { ToastService } from '../services/toast.service';
import * as ToastActions from './toast.actions';

@Injectable()
export class ToastEffects {

  toastSuccess$ = createEffect(() => this.actions$.pipe(
    ofType(ToastActions.toastSuccess),
    tap(action => this.toastService.toastSuccess(action.summary, action.detail))
  ), { dispatch: false });

  toastInfo$ = createEffect(() => this.actions$.pipe(
    ofType(ToastActions.toastInfo),
    tap(action => this.toastService.toastInfo(action.summary, action.detail))
  ), { dispatch: false });

  toastWarn$ = createEffect(() => this.actions$.pipe(
    ofType(ToastActions.toastWarn),
    tap(action => this.toastService.toastWarn(action.summary, action.detail))
  ), { dispatch: false });

  toastError$ = createEffect(() => this.actions$.pipe(
    ofType(ToastActions.toastError),
    tap(action => this.toastService.toastError(action.summary, action.detail))
  ), { dispatch: false });

  constructor(
    private actions$: Actions,
    private toastService: ToastService
  ) {}

}
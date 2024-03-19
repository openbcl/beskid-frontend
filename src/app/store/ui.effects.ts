import { Injectable } from "@angular/core";
import { Actions, createEffect , ofType } from '@ngrx/effects';
import { UiService } from "../services/ui.service";
import { catchError, map, tap, of, switchMap } from "rxjs";
import { Router } from "@angular/router";
import * as UiActions from './ui.actions';
import * as ToastActions from './toast.actions';
import * as AuthActions from './auth.actions';
import * as ModelActions from './model.actions';
import * as TaskActions from './task.actions';


@Injectable()
export class UiEffects {

  changeTaskListSidebarVisibility$ = createEffect(() => this.actions$.pipe(
    ofType(UiActions.changeTaskListSidebarVisibility),
    switchMap(() =>
      this.uiService.changeTaskListSidebarVisibility().pipe(
        map(showTaskListSidebar => UiActions.changeTaskListSidebarVisibilitySuccess({ showTaskListSidebar })),
        catchError(error => of(UiActions.changeTaskListSidebarVisibilityFailure({ error })))
      )
    )
  ));

  catchError$ = createEffect(() => this.actions$.pipe(
    ofType(...[
      AuthActions.renewSessionFailure, AuthActions.deleteSessionFailure,
      ModelActions.findModelFailure, ModelActions.findModelsFailure,
      TaskActions.addTaskFailure, TaskActions.deleteTaskFailure, TaskActions.deleteTaskResultFailure,
      TaskActions.editTaskFailure, TaskActions.evaluateTaskResultFailure, TaskActions.findTaskFailure,
      TaskActions.findTaskResultFailure, TaskActions.findTasksFailure, TaskActions.runTaskFailure
    ]),
    tap(action => action.type === TaskActions.findTaskFailure.type && this.router.navigate(['/'])),
    map(action => action.error?.status === 0 ? ToastActions.toastWarn({
      summary: 'Offline',
      detail: 'Unable to connect to the server.'
    }) : ToastActions.toastError({
      summary: `${action.error?.error?.message || action.error?.statusText || 'Unknown Error'} (${action.error?.status || action.error?.error?.statusCode})`,
      detail: action.error?.message || ''
    }))
  ));

  constructor(
    private actions$: Actions,
    private router: Router,
    private uiService: UiService
  ) {}

}

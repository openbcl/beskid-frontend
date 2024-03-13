import { Injectable } from "@angular/core";
import { Actions, createEffect , ofType } from '@ngrx/effects';
import { UiService } from "../services/ui.service";
import { catchError, map, of, switchMap } from "rxjs";
import * as UiActions from './ui.actions';


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

  constructor(
    private actions$: Actions,
    private uiService: UiService
  ) {}

}

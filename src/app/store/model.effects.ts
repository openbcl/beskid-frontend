import { Injectable } from "@angular/core";
import { Actions, createEffect , ofType } from '@ngrx/effects';
import { ModelService } from "../services/model.service";
import { catchError, map, of, switchMap } from "rxjs";
import * as ModelActions from './model.actions';


@Injectable()
export class ModelEffects {

  findModel$ = createEffect(() => this.actions$.pipe(
    ofType(ModelActions.findModel),
    switchMap(action =>
      this.modelService.findModel(action.modelId).pipe(
        map(model => ModelActions.findModelSuccess({ model })),
        catchError(error => of(ModelActions.findModelFailure({ error })))
      )
    )
  ));

  findModels$ = createEffect(() => this.actions$.pipe(
    ofType(ModelActions.findModels),
    switchMap(() =>
      this.modelService.findModels().pipe(
        map(models => ModelActions.findModelsSuccess({ models })),
        catchError(error => of(ModelActions.findModelsFailure({ error })))
      )
    )
  ));

  constructor(
    private actions$: Actions,
    private modelService: ModelService
  ) {}

}

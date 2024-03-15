import { Injectable } from "@angular/core";
import { Actions, createEffect , ofType } from '@ngrx/effects';
import { ModelService } from "../services/model.service";
import { catchError, map, of, switchMap, tap } from "rxjs";
import { Store } from "@ngrx/store";
import { finishProcessing, startProcessing } from "./ui.actions";
import * as ModelActions from './model.actions';


@Injectable()
export class ModelEffects {

  findModel$ = createEffect(() => this.actions$.pipe(
    ofType(ModelActions.findModel),
    tap(action => this.store.dispatch(startProcessing({id: action.type}))),
    switchMap(action =>
      this.modelService.findModel(action.modelId).pipe(
        switchMap(model => of(finishProcessing({id: action.type}), ModelActions.findModelSuccess({ model }))),
        catchError(error => of(finishProcessing({id: action.type}), ModelActions.findModelFailure({ error })))
      )
    )
  ));

  findModels$ = createEffect(() => this.actions$.pipe(
    ofType(ModelActions.findModels),
    tap(action => this.store.dispatch(startProcessing({id: action.type}))),
    switchMap(action =>
      this.modelService.findModels().pipe(
        switchMap(models => of(finishProcessing({id: action.type}), ModelActions.findModelsSuccess({ models }))),
        catchError(error => of(finishProcessing({id: action.type}), ModelActions.findModelsFailure({ error })))
      )
    )
  ));

  constructor(
    private actions$: Actions,
    private store: Store,
    private modelService: ModelService
  ) {}

}

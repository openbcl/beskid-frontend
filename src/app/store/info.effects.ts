import { Injectable } from "@angular/core";
import { Actions, createEffect , ofType } from '@ngrx/effects';
import { InfoService } from "../services/info.service";
import { catchError, of, switchMap, tap } from "rxjs";
import { Store } from "@ngrx/store";
import { finishProcessing, startProcessing } from "./ui.actions";
import * as InfoActions from './info.actions';


@Injectable()
export class InfoEffects {

  obtainInfo$ = createEffect(() => this.actions$.pipe(
    ofType(InfoActions.obtainInfo),
    tap(action => this.store.dispatch(startProcessing({id: action.type}))),
    switchMap(action =>
      this.infoService.info().pipe(
        switchMap(info => of(finishProcessing({id: action.type}), InfoActions.obtainInfoSuccess({ info }))),
        catchError(error => of(finishProcessing({id: action.type}), InfoActions.obtainInfoFailure({ error })))
      )
    )
  ));

  constructor(
    private actions$: Actions,
    private store: Store,
    private infoService: InfoService
  ) {}

}

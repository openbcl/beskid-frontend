import { Injectable } from "@angular/core";
import { Actions, createEffect , ofType } from '@ngrx/effects';
import { QueueService } from "../services/queue.service";
import { catchError, of, switchMap, tap } from "rxjs";
import { Store } from "@ngrx/store";
import { finishProcessing, startProcessing } from "./ui.actions";
import * as JobActions from './job.actions';


@Injectable()
export class JobEffects {

  findJobs$ = createEffect(() => this.actions$.pipe(
    ofType(JobActions.findJobs),
    tap(action => this.store.dispatch(startProcessing({id: action.type}))),
    switchMap(action =>
      this.queueService.findJobs(action.types).pipe(
        switchMap(jobs => of(finishProcessing({id: action.type}), JobActions.findJobsSuccess({ jobs }))),
        catchError(error => of(finishProcessing({id: action.type}), JobActions.findJobsFailure({ error })))
      )
    )
  ));

  constructor(
    private actions$: Actions,
    private store: Store,
    private queueService: QueueService
  ) {}

}

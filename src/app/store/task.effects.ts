import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { Actions, createEffect , ofType } from '@ngrx/effects';
import { TaskService } from "../services/task.service";
import { catchError, concatMap, filter, map, of, switchMap, tap } from "rxjs";
import { Store } from "@ngrx/store";
import { finishProcessing, startProcessing } from "./ui.actions";
import * as TaskActions from './task.actions';
import * as JobActions from './job.actions';
import * as ToastActions from './toast.actions';


@Injectable()
export class TaskEffects {

  addTask$ = createEffect(() => this.actions$.pipe(
    ofType(TaskActions.addTask),
    tap(action => this.store.dispatch(startProcessing({id: action.type}))),
    concatMap(action =>
      this.taskService.addTask(action.createTask).pipe(
        switchMap(task => of(finishProcessing({id: action.type}), TaskActions.addTaskSuccess({ task }))),
        catchError(error => of(finishProcessing({id: action.type}), TaskActions.addTaskFailure({ error })))
      )
    )
  ));

  addTaskSuccess$ = createEffect(() => this.actions$.pipe(
    ofType(TaskActions.addTaskSuccess),
    tap(action => this.router.navigate(['tasks', action.task.id])),
    switchMap(action => of(ToastActions.toastSuccess({
      summary: 'Task successfully created!',
      detail: action.task.id
    })))
  ));

  findTask$ = createEffect(() => this.actions$.pipe(
    ofType(TaskActions.findTask),
    tap(action => this.store.dispatch(startProcessing({id: action.type}))),
    switchMap(action =>
      this.taskService.findTask(action.taskId).pipe(
        switchMap(task => of(finishProcessing({id: action.type}), TaskActions.findTaskSuccess({ task, showSuccessMessage: action.showSuccessMessage }))),
        catchError(error => of(finishProcessing({id: action.type}), TaskActions.findTaskFailure({ error })))
      )
    )
  ));

  findTaskSuccess$ = createEffect(() => this.actions$.pipe(
    ofType(TaskActions.findTaskSuccess),
    filter(action => !!action.showSuccessMessage),
    switchMap(action => of(ToastActions.toastSuccess({
      summary: 'Job successfully completed!',
      detail: action.task.id
    })))
  ));

  findTasks$ = createEffect(() => this.actions$.pipe(
    ofType(TaskActions.findTasks),
    tap(action => this.store.dispatch(startProcessing({id: action.type}))),
    switchMap(action =>
      this.taskService.findTasks().pipe(
        switchMap(tasks => of(finishProcessing({id: action.type}), TaskActions.findTasksSuccess({ tasks }))),
        catchError(error => of(finishProcessing({id: action.type}), TaskActions.findTasksFailure({ error })))
      )
    )
  ));

  editTask$ = createEffect(() => this.actions$.pipe(
    ofType(TaskActions.editTask),
    tap(action => this.store.dispatch(startProcessing({id: action.type}))),
    switchMap(action =>
      this.taskService.editTask(action.taskId, action.training).pipe(
        switchMap(task => of(finishProcessing({id: action.type}), TaskActions.editTaskSuccess({ task }))),
        catchError(error => of(finishProcessing({id: action.type}), TaskActions.editTaskFailure({ error })))
      )
    )
  ));

  editTaskSuccess$ = createEffect(() => this.actions$.pipe(
    ofType(TaskActions.editTaskSuccess),
    switchMap(action => of(ToastActions.toastInfo({
      summary: 'Task successfully edited!',
      detail: `Training ${action.task.training}`
    })))
  ));

  deleteTask$ = createEffect(() => this.actions$.pipe(
    ofType(TaskActions.deleteTask),
    tap(action => this.store.dispatch(startProcessing({id: action.type}))),
    concatMap(action =>
      this.taskService.deleteTask(action.taskId).pipe(
        switchMap(() => of(finishProcessing({id: action.type}), TaskActions.deleteTaskSuccess({ taskId: action.taskId }))),
        catchError(error => of(finishProcessing({id: action.type}), TaskActions.deleteTaskFailure({ error })))
      )
    )
  ));

  deleteTaskSuccess$ = createEffect(() => this.actions$.pipe(
    ofType(TaskActions.deleteTaskSuccess),
    tap(() => this.router.navigate(['/'])),
    switchMap(action => of(ToastActions.toastSuccess({
      summary: 'Task successfully deleted!',
      detail: `Training ${action.taskId}`
    })))
  ));

  runTask$ = createEffect(() => this.actions$.pipe(
    ofType(TaskActions.runTask),
    concatMap(action =>
      this.taskService.runTask(action.taskId, action.modelId, action.resolution).pipe(
        map(task => TaskActions.runTaskSuccess({ task })),
        catchError(error => of(TaskActions.runTaskFailure({ error, taskId: action.taskId })))
      )
    )
  ));

  runTaskSuccess$ = createEffect(() => this.actions$.pipe(
    ofType(TaskActions.runTaskSuccess),
    tap(action => !!action.task.jobs?.length && this.store.dispatch(JobActions.findJobs())),
    switchMap(action => of(
      !!action.task.jobs?.length ?
        ToastActions.toastSuccess({
          summary: 'New job added to queue!',
          detail: action.task.id
        }) :
        ToastActions.toastSuccess({
          summary: 'Task run successfully completed!',
          detail: action.task.id
        })
    ))
  ));


  findTaskResult$ = createEffect(() => this.actions$.pipe(
    ofType(TaskActions.findTaskResult),
    tap(action => this.store.dispatch(startProcessing({id: action.type}))),
    switchMap(action =>
      this.taskService.findTaskResult(action.taskId, action.fileId).pipe(
        switchMap(resultValue => of(finishProcessing({id: action.type}), TaskActions.findTaskResultSuccess({ taskId: action.taskId, fileId: action.fileId, resultValue }))),
        catchError(error => of(finishProcessing({id: action.type}), TaskActions.findTaskResultFailure({ error })))
      )
    )
  ));

  evaluateTaskResult$ = createEffect(() => this.actions$.pipe(
    ofType(TaskActions.evaluateTaskResult),
    tap(action => this.store.dispatch(startProcessing({id: action.type}))),
    switchMap(action =>
      this.taskService.evaluateTaskResult(action.taskId, action.fileId, action.evaluation).pipe(
        switchMap(task => of(finishProcessing({id: action.type}), TaskActions.evaluateTaskResultSuccess({ task, evaluation: action.evaluation }))),
        catchError(error => of(finishProcessing({id: action.type}), TaskActions.evaluateTaskResultFailure({ error })))
      )
    )
  ));

  evaluateTaskResultSuccess$ = createEffect(() => this.actions$.pipe(
    ofType(TaskActions.evaluateTaskResultSuccess),
    switchMap(action => of(ToastActions.toastInfo({
      summary: 'Task result successfully evaluated!',
      detail: `Result is ${action.evaluation}`
    })))
  ));

  deleteTaskResult$ = createEffect(() => this.actions$.pipe(
    ofType(TaskActions.deleteTaskResult),
    tap(action => this.store.dispatch(startProcessing({id: action.type}))),
    switchMap(action =>
      this.taskService.deleteTaskResult(action.taskId, action.fileId, action.keepTrainingData).pipe(
        switchMap(task => of(finishProcessing({id: action.type}), TaskActions.deleteTaskResultSuccess({ task }))),
        catchError(error => of(finishProcessing({id: action.type}), TaskActions.deleteTaskResultFailure({ error })))
      )
    )
  ));

  deleteTaskResultSuccess$ = createEffect(() => this.actions$.pipe(
    ofType(TaskActions.deleteTaskResultSuccess),
    tap(() => this.store.dispatch(JobActions.findJobs())),
    switchMap(() => of(ToastActions.toastSuccess({
      summary: 'Task result successfully deleted!'
    })))
  ));

  constructor(
    private actions$: Actions,
    private router: Router,
    private store: Store,
    private taskService: TaskService
  ) {}

}

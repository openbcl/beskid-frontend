import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { Actions, createEffect , ofType } from '@ngrx/effects';
import { TaskService } from "../services/task.service";
import { catchError, map, of, switchMap, tap } from "rxjs";
import * as TaskActions from './task.actions';
import * as ToastActions from './toast.actions';


@Injectable()
export class TaskEffects {

  addTask$ = createEffect(() => this.actions$.pipe(
    ofType(TaskActions.addTask),
    switchMap(action =>
      this.taskService.addTask(action.createTask).pipe(
        map(task => TaskActions.addTaskSuccess({ task })),
        catchError(error => of(TaskActions.addTaskFailure({ error })))
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
    switchMap(action =>
      this.taskService.findTask(action.taskId).pipe(
        map(task => TaskActions.findTaskSuccess({ task })),
        catchError(error => of(TaskActions.findTaskFailure({ error })))
      )
    )
  ));

  findTasks$ = createEffect(() => this.actions$.pipe(
    ofType(TaskActions.findTasks),
    switchMap(() =>
      this.taskService.findTasks().pipe(
        map(tasks => TaskActions.findTasksSuccess({ tasks })),
        catchError(error => of(TaskActions.findTasksFailure({ error })))
      )
    )
  ));

  editTask$ = createEffect(() => this.actions$.pipe(
    ofType(TaskActions.editTask),
    switchMap(action =>
      this.taskService.editTask(action.taskId, action.training).pipe(
        map(task => TaskActions.editTaskSuccess({ task })),
        catchError(error => of(TaskActions.editTaskFailure({ error })))
      )
    )
  ));

  editTaskSuccess$ = createEffect(() => this.actions$.pipe(
    ofType(TaskActions.editTaskSuccess),
    switchMap(action => of(ToastActions.toastSuccess({
      summary: 'Task successfully edited!',
      detail: `Training ${action.task.training}`
    })))
  ));

  deleteTask$ = createEffect(() => this.actions$.pipe(
    ofType(TaskActions.deleteTask),
    switchMap(action =>
      this.taskService.deleteTask(action.taskId).pipe(
        map(() => TaskActions.deleteTaskSuccess({ taskId: action.taskId })),
        catchError(error => of(TaskActions.deleteTaskFailure({ error })))
      )
    )
  ));

  deleteTaskSuccess$ = createEffect(() => this.actions$.pipe(
    ofType(TaskActions.deleteTaskSuccess),
    tap(() => this.router.navigate(['/'])),
    switchMap(action => of(ToastActions.toastInfo({
      summary: 'Task successfully deleted!',
      detail: `Training ${action.taskId}`
    })))
  ));

  runTask$ = createEffect(() => this.actions$.pipe(
    ofType(TaskActions.runTask),
    switchMap(action =>
      this.taskService.runTask(action.taskId, action.modelId, action.resolution).pipe(
        map(task => TaskActions.runTaskSuccess({ task })),
        catchError(error => of(TaskActions.runTaskFailure({ error })))
      )
    )
  ));

  runTaskSuccess$ = createEffect(() => this.actions$.pipe(
    ofType(TaskActions.runTaskSuccess),
    switchMap(action => of(ToastActions.toastSuccess({
      summary: 'Task run successfully completed!',
      detail: action.task.id
    })))
  ));


  findTaskResult$ = createEffect(() => this.actions$.pipe(
    ofType(TaskActions.findTaskResult),
    switchMap(action =>
      this.taskService.findTaskResult(action.taskId, action.fileId).pipe(
        map(resultValue => TaskActions.findTaskResultSuccess({ taskId: action.taskId, fileId: action.fileId, resultValue })),
        catchError(error => of(TaskActions.findTaskResultFailure({ error })))
      )
    )
  ));

  evaluateTaskResult$ = createEffect(() => this.actions$.pipe(
    ofType(TaskActions.evaluateTaskResult),
    switchMap(action =>
      this.taskService.evaluateTaskResult(action.taskId, action.fileId, action.evaluation).pipe(
        map(task => TaskActions.evaluateTaskResultSuccess({ task, evaluation: action.evaluation })),
        catchError(error => of(TaskActions.evaluateTaskResultFailure({ error })))
      )
    )
  ));

  evaluateTaskResultSuccess$ = createEffect(() => this.actions$.pipe(
    ofType(TaskActions.evaluateTaskResultSuccess),
    switchMap(action => of(ToastActions.toastSuccess({
      summary: 'Task result successfully evaluated!',
      detail: `Result is ${action.evaluation}`
    })))
  ));

  constructor(
    private actions$: Actions,
    private router: Router,
    private taskService: TaskService
  ) {}

}

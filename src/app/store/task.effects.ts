import { Injectable } from "@angular/core";
import { Actions, createEffect , ofType } from '@ngrx/effects';
import { TaskService } from "../services/task.service";
import { catchError, map, of, switchMap } from "rxjs";
import * as TaskActions from './task.actions';


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

  deleteTask$ = createEffect(() => this.actions$.pipe(
    ofType(TaskActions.deleteTask),
    switchMap(action =>
      this.taskService.deleteTask(action.taskId).pipe(
        map(() => TaskActions.deleteTaskSuccess({ taskId: action.taskId })),
        catchError(error => of(TaskActions.deleteTaskFailure({ error })))
      )
    )
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
        map(task => TaskActions.evaluateTaskResultSuccess({ task })),
        catchError(error => of(TaskActions.evaluateTaskResultFailure({ error })))
      )
    )
  ));

  constructor(
    private actions$: Actions,
    private taskService: TaskService
  ) {}

}

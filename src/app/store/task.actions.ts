import { createAction, props } from '@ngrx/store';
import { Task, TaskResultEvaluation, TaskTraining } from './task';

export const addTask = createAction(
  '[Task] Add Task',
  props<{ taskId: number }>()
);

export const addTaskSuccess = createAction(
  '[Task] Add Task Success',
  props<{ task: Task }>()
);

export const addTaskFailure = createAction(
  '[Task] Add Task Failure',
  props<{ error: any }>()
);

export const findTask = createAction(
  '[Task] Find Task',
  props<{ taskId: number }>()
);

export const findTaskSuccess = createAction(
  '[Task] Find Task Success',
  props<{ task: Task }>()
);

export const findTaskFailure = createAction(
  '[Task] Find Task Failure',
  props<{ error: any }>()
);

export const findTasks = createAction(
  '[Task] Find Tasks'
);

export const findTasksSuccess = createAction(
  '[Task] Find Tasks Success',
  props<{ tasks: Task[] }>()
);

export const findTasksFailure = createAction(
  '[Task] Find Tasks Failure',
  props<{ error: any }>()
);

export const editTask = createAction(
  '[Task] Edit Task',
  props<{ taskId: number, training: TaskTraining }>()
);

export const editTaskSuccess = createAction(
  '[Task] Edit Task Success',
  props<{ task: Task }>()
);

export const editTaskFailure = createAction(
  '[Task] Edit Task Failure',
  props<{ error: any }>()
);

export const deleteTask = createAction(
  '[Task] Delete Task',
  props<{ taskId: number }>()
);

export const deleteTaskSuccess = createAction(
  '[Task] Delete Task Success'
);

export const deleteTaskFailure = createAction(
  '[Task] Delete Task Failure',
  props<{ error: any }>()
);

export const runTask = createAction(
  '[Task] Run Task',
  props<{ taskId: number, modelId: number, resolution: number }>()
);

export const runTaskSuccess = createAction(
  '[Task] Run Task Success',
  props<{ task: Task }>()
);

export const runTaskFailure = createAction(
  '[Task] Run Task Failure',
  props<{ error: any }>()
);

export const findTaskResult = createAction(
  '[Task] Find Task Result',
  props<{ taskId: number, fileId: string }>()
);

export const findTaskResultSuccess = createAction(
  '[Task] Find Task Result Success',
  props<{ data: any }>()
);

export const findTaskResultFailure = createAction(
  '[Task] Find Task Result Failure',
  props<{ error: any }>()
);

export const evaluateTaskResult = createAction(
  '[Task] Evaluate Task Result',
  props<{ taskId: number, fileId: string, evaluation: TaskResultEvaluation }>()
);

export const evaluateTaskResultSuccess = createAction(
  '[Task] Evaluate Task Result Success',
  props<{ task: Task }>()
);

export const evaluateTaskResultFailure = createAction(
  '[Task] Evaluate Task Result Failure',
  props<{ error: any }>()
);
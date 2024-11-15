import { createAction, props } from '@ngrx/store';
import { BlobFile, CreateTask, KeepTrainingData, ResultValue, Task, TaskResultEvaluation, TaskTraining } from './task';

export const addTask = createAction(
  '[Task] Add Task',
  props<{ createTask: CreateTask }>()
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
  props<{ taskId: string, showSuccessMessage?: boolean }>()
);

export const findTaskSuccess = createAction(
  '[Task] Find Task Success',
  props<{ task: Task, showSuccessMessage?: boolean }>()
);

export const findTaskFailure = createAction(
  '[Task] Find Task Failure',
  props<{ error: any }>()
);

export const selectTask = createAction(
  '[Task] Select Task',
  props<{ task: Task }>()
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
  props<{ taskId: string, training: TaskTraining }>()
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
  props<{ taskId: string }>()
);

export const deleteTaskSuccess = createAction(
  '[Task] Delete Task Success',
  props<{ taskId: string }>()
);

export const deleteTaskFailure = createAction(
  '[Task] Delete Task Failure',
  props<{ error: any }>()
);

export const runTask = createAction(
  '[Task] Run Task',
  props<{ taskId: string, modelId: number }>()
);

export const runTaskSuccess = createAction(
  '[Task] Run Task Success',
  props<{ task: Task }>()
);

export const runTaskFailure = createAction(
  '[Task] Run Task Failure',
  props<{ taskId: string, error: any }>()
);

export const findTaskResult = createAction(
  '[Task] Find Task Result',
  props<{ taskId: string, fileId: string }>()
);

export const findTaskResultSuccess = createAction(
  '[Task] Find Task Result Success',
  props<{ taskId: string, fileId: string, resultValue: ResultValue }>()
);

export const findTaskResultFailure = createAction(
  '[Task] Find Task Result Failure',
  props<{ error: any }>()
);

export const findTaskResultTemplateFile = createAction(
  '[Task] Find Task Result Template File',
  props<{ taskId: string, fileId: string }>()
);

export const findTaskResultTemplateFileSuccess = createAction(
  '[Task] Find Task Result Template File Success',
  props<{ taskId: string, fileId: string, fileFDS: BlobFile }>()
);

export const findTaskResultTemplateFileFailure = createAction(
  '[Task] Find Task Result Template File Failure',
  props<{ error: any }>()
);

export const findTaskResultTemplateData = createAction(
  '[Task] Find Task Result Template Data',
  props<{ taskId: string, fileId: string }>()
);

export const findTaskResultTemplateDataSuccess = createAction(
  '[Task] Find Task Result Template Data Success',
  props<{ taskId: string, fileId: string, dataFDS: string }>()
);

export const findTaskResultTemplateDataFailure = createAction(
  '[Task] Find Task Result Template Data Failure',
  props<{ error: any }>()
);

export const evaluateTaskResult = createAction(
  '[Task] Evaluate Task Result',
  props<{ taskId: string, fileId: string, evaluation: TaskResultEvaluation }>()
);

export const evaluateTaskResultSuccess = createAction(
  '[Task] Evaluate Task Result Success',
  props<{ task: Task, evaluation: TaskResultEvaluation }>()
);

export const evaluateTaskResultFailure = createAction(
  '[Task] Evaluate Task Result Failure',
  props<{ error: any }>()
);

export const deleteTaskResult = createAction(
  '[Task] Delete Task Result',
  props<{ taskId: string, fileId: string, keepTrainingData: KeepTrainingData }>()
);

export const deleteTaskResultSuccess = createAction(
  '[Task] Delete Task Result Success',
  props<{ task: Task }>()
);

export const deleteTaskResultFailure = createAction(
  '[Task] Delete Task Result Failure',
  props<{ error: any }>()
);
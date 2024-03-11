import { createFeatureSelector, createSelector } from "@ngrx/store";
import { TaskState, taskFeatureKey } from "./task.reducer";

export const getTaskState = createFeatureSelector<TaskState>(taskFeatureKey);

export const taskProcessing = createSelector(
  getTaskState,
  taskState => taskState.processing
);

export const task = (taskId?: string) => createSelector(
  getTaskState,
  taskState => !!taskId?.length ?
    (taskState.task?.id === taskId ? taskState.task : taskState.tasks.find(task => task.id === taskId)) : taskState.task
);

export const tasks = createSelector(
  getTaskState,
  taskState => taskState.tasks
);

export const resultFile = (taskId: string, fileId: string) => createSelector(
  getTaskState,
  taskState => (
    taskState.task?.id === taskId ? taskState.task : taskState.tasks.find(task => task.id === task.id)
  )?.results.find(result => result.filename.includes(fileId))?.file || null
);

export const resultData = (taskId: string, fileId: string) => createSelector(
  getTaskState,
  taskState => (
    taskState.task?.id === taskId ? taskState.task : taskState.tasks.find(task => task.id === task.id)
  )?.results.find(result => result.filename.includes(fileId))?.data || null
);
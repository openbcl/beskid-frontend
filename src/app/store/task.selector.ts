import { createFeatureSelector, createSelector } from "@ngrx/store";
import { TaskState, taskFeatureKey } from "./task.reducer";
import { activeOrWaitingJobsOfTask } from "./job.selector";
import { map, Observable } from "rxjs";
import { Task } from "./task";

export const getTaskState = createFeatureSelector<TaskState>(taskFeatureKey);

export const task = (taskId: string) => createSelector(
  getTaskState,
  taskState => taskState.tasks.find(task => task.id === taskId)
);

export const selectedTask = createSelector(
  getTaskState,
  taskState => taskState.task
);

export const tasks = createSelector(
  getTaskState,
  taskState => taskState.tasks
);

export const isTaskRunning$ = (task$: Observable<Task>) => createSelector(
  getTaskState,
  taskState => task$.pipe(map(task => !!taskState.running.find(runningTaskId => runningTaskId === task.id)))
);

export const isTaskRunning = (taskId: string) => createSelector(
  getTaskState,
  taskState => !!taskState.running.find(runningTaskId => runningTaskId === taskId)
);

export const areTaskJobsRunning = (taskId: string) => createSelector(
  isTaskRunning(taskId),
  activeOrWaitingJobsOfTask(taskId),
  (taskRunning, jobs) => taskRunning || !!jobs?.length
);

export const resultFile = (taskId: string, fileId: string) => createSelector(
  getTaskState,
  taskState => (
    taskState.task?.id === taskId ? taskState.task : taskState.tasks.find(task => task.id === task.id)
  )?.results.find(result => result.filename.includes(fileId))?.fileResult
);

export const resultData = (taskId: string, fileId: string) => createSelector(
  getTaskState,
  taskState => (
    taskState.task?.id === taskId ? taskState.task : taskState.tasks.find(task => task.id === task.id)
  )?.results.find(result => result.filename.includes(fileId))?.dataResult
);

export const templateFile = (taskId: string, fileId: string) => createSelector(
  getTaskState,
  taskState => (
    taskState.task?.id === taskId ? taskState.task : taskState.tasks.find(task => task.id === task.id)
  )?.results.find(result => result.filename.includes(fileId))?.fileFDS
);

export const templateData = (taskId: string, fileId: string) => createSelector(
  getTaskState,
  taskState => (
    taskState.task?.id === taskId ? taskState.task : taskState.tasks.find(task => task.id === task.id)
  )?.results.find(result => result.filename.includes(fileId))?.dataFDS
);
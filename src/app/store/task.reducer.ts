import { createReducer, on } from "@ngrx/store";
import { Task } from "./task";
import { newSessionSuccess } from "./auth.actions";
import * as TaskAction from './task.actions';

export const taskFeatureKey = 'tasks';

export interface TaskState {
  task?: Task;
  tasks: Task[],
  running: string[],
  error: any;
}

export const initialTaskState: TaskState = {
  task: undefined,
  tasks: [],
  running: [],
  error: null
};

const mergeTasksState = (task: Task, tasks: Task[]) => {
  const updatedTask = {
    ...task,
    values: !!task.values?.length ? task.values : tasks.find(stateTask => stateTask.id === task.id)?.values || [],
  }
  let merged = false;
  const mergedTasks = [ ...tasks ].map(stateTask => {
    if (stateTask.id === updatedTask.id) {
      merged = true;
      return updatedTask;
    }
    return stateTask
  });
  if (!merged) {
    mergedTasks.push(updatedTask)
  }
  return { task: updatedTask, tasks: mergedTasks }
}

export const taskReducer = createReducer(
  initialTaskState,

  on(newSessionSuccess, () => {
    return { ...initialTaskState };
  }),

  on(TaskAction.runTask, (state, action) => {
    return { ...state, running: [ ...state.running, action.taskId ] };
  }),

  on(TaskAction.runTaskSuccess, (state, action) => {
    return { ...state, ...mergeTasksState(action.task, state.tasks), running: state.running.filter(taskId => taskId !== action.task.id ) };
  }),

  on(...[TaskAction.addTaskSuccess, TaskAction.findTaskSuccess, TaskAction.editTaskSuccess, TaskAction.evaluateTaskResultSuccess, TaskAction.deleteTaskResultSuccess], (state, action) => {
    return { ...state, ...mergeTasksState(action.task, state.tasks) };
  }),

  on(TaskAction.findTasksSuccess, (state, action) => {
    const keptStateTasks = state.tasks.filter(stateTask => action.tasks.find(actionTask => actionTask.id === stateTask.id));
    const mergedTasks = action.tasks.map(actionTask => ({
      ...actionTask,
      values: keptStateTasks.find(stateTask => stateTask.id === actionTask.id)?.values || actionTask.values
    }))
    return { ...state, tasks: mergedTasks };
  }),

  on(TaskAction.deleteTaskSuccess, (state, action) => {
    return { ...state, tasks: state.tasks.filter(task => task.id !== action.taskId), task: undefined };
  }),

  on(TaskAction.findTaskResultSuccess, (state, action) => {
    const updatedTask = state.task?.id === action.taskId ? state.task : state.tasks.find(task => task.id === action.taskId)
    if (!updatedTask) return state;
    const isBlob = action.fileId.toLowerCase().endsWith('.json');
    const results = updatedTask.results.map(result => !result.filename.includes(action.fileId) ? result : {
      ...result,
      data:  !isBlob ? action.resultValue.data : result.data,
      file:  isBlob ? action.resultValue.file : result.file
    });
    return {
      ...state,
      task: state.task?.id === action.taskId ? { ...updatedTask, results } : state.task,
      tasks: state.tasks.map(task => task.id === action.taskId ? { ...updatedTask, results } : task),
    };
  }),

  on(...[TaskAction.addTaskFailure, TaskAction.findTaskFailure, TaskAction.findTasksFailure, TaskAction.editTaskFailure, TaskAction.deleteTaskFailure, TaskAction.findTaskResultFailure, TaskAction.evaluateTaskResultFailure, TaskAction.deleteTaskResultFailure], (state, action) => {
    return { ...state, error: action.error };
  }),

  on(TaskAction.runTaskFailure, (state, action) => {
    return { ...state, error: action.error, running: state.running.filter(taskId => taskId !== action.taskId ) };
  }),
)

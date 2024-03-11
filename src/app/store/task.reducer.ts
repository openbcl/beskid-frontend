import { createReducer, on } from "@ngrx/store";
import { Task } from "./task";
import { newSessionSuccess } from "./auth.actions";
import * as TaskAction from './task.actions';

export const taskFeatureKey = 'tasks';

export interface TaskState {
  task?: Task;
  tasks: Task[],
  processing: boolean;
  error: any;
}

export const initialTaskState: TaskState = {
  task: undefined,
  tasks: [],
  processing: false,
  error: null
};

export const taskReducer = createReducer(
  initialTaskState,

  on(newSessionSuccess, () => {
    return { ...initialTaskState };
  }),
  
  on(...[TaskAction.addTask, TaskAction.findTask, TaskAction.findTasks, TaskAction.editTask, TaskAction.deleteTask, TaskAction.runTask, TaskAction.findTaskResult, TaskAction.evaluateTaskResult], state => {
    return { ...state, processing: true };
  }),

  on(...[TaskAction.addTaskSuccess, TaskAction.findTaskSuccess, TaskAction.editTaskSuccess, TaskAction.runTaskSuccess, TaskAction.evaluateTaskResultSuccess], (state, action) => {
    const updatedTask = {
      ...action.task,
      values: !!action.task.values?.length ? action.task.values : state.tasks.find(stateTask => stateTask.id === action.task.id)?.values || [],
    }
    let merged = false;
    const mergedTasks = [ ...state.tasks ].map(stateTask => {
      if (stateTask.id === updatedTask.id) {
        merged = true;
        return updatedTask;
      }
      return stateTask
    });
    if (!merged) {
      mergedTasks.push(updatedTask)
    }
    return { ...state, task: updatedTask, tasks: mergedTasks, processing: false };
  }),

  on(TaskAction.findTasksSuccess, (state, action) => {
    const keptStateTasks = state.tasks.filter(stateTask => action.tasks.find(actionTask => actionTask.id === stateTask.id));
    const mergedTasks = action.tasks.map(actionTask => ({
      ...actionTask,
      values: keptStateTasks.find(stateTask => stateTask.id === actionTask.id)?.values || actionTask.values
    }))
    return { ...state, tasks: mergedTasks, processing: false };
  }),

  on(TaskAction.deleteTaskSuccess, (state, action) => {
    return { ...state, tasks: state.tasks.filter(task => task.id !== action.taskId), processing: false };
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
      processing: false
    };
  }),

  on(...[TaskAction.addTaskFailure, TaskAction.findTaskFailure, TaskAction.findTasksFailure, TaskAction.editTaskFailure, TaskAction.deleteTaskFailure, TaskAction.runTaskFailure, TaskAction.findTaskResultFailure, TaskAction.evaluateTaskResultFailure], (state, action) => {
    return { ...state, error: action.error, processing: false };
  }),
)

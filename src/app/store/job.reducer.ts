import { createReducer, on } from "@ngrx/store";
import { Job } from "./job";
import * as JobAction from './job.actions';
import * as TaskAction from './task.actions';

export const jobFeatureKey = 'jobs';

export interface JobState {
  jobs: Job[],
  error: any;
}

export const initialJobState: JobState = {
  jobs: [],
  error: null
};

export const jobReducer = createReducer(
  initialJobState,

  on(TaskAction.runTaskSuccess, (state, action) => {
    return { ...state, jobs: [ ...state.jobs.filter(job => job.taskId === action.task.id), ...(action.task.jobs || [])] };
  }),

  on(JobAction.findJobsSuccess, (state, action) => {
    return { ...state, jobs: action.jobs };
  }),

  on(JobAction.findJobsFailure, (state, action) => {
    return { ...state, error: action.error };
  }),
)

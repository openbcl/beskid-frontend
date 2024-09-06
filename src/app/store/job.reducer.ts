import { createReducer, on } from "@ngrx/store";
import { Job } from "./job";
import * as JobAction from './job.actions';

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

  on(JobAction.findJobsSuccess, (state, action) => {
    return { ...state, jobs: action.jobs };
  }),

  on(JobAction.findJobsFailure, (state, action) => {
    return { ...state, error: action.error };
  }),
)

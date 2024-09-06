import { createAction, props } from '@ngrx/store';
import { Job } from './job';

export const findJobs = createAction(
  '[Job] Find Jobs',
  props<{ types?: string[] }>()
);

export const findJobsSuccess = createAction(
  '[Job] Find Jobs Success',
  props<{ jobs: Job[] }>()
);

export const findJobsFailure = createAction(
  '[Job] Find Jobs Failure',
  props<{ error: any }>()
);

import { createFeatureSelector, createSelector } from "@ngrx/store";
import { JobState, jobFeatureKey } from "./job.reducer";

export const getJobState = createFeatureSelector<JobState>(jobFeatureKey);

export const jobs = createSelector(
  getJobState,
  jobState => jobState.jobs
);

export const activeOrWaitingJobsOfTask = (taskId: string) => createSelector(
  getJobState,
  jobState => jobState.jobs.filter(job => job.taskId === taskId && ['active', 'waiting', 'repeat', 'wait'].find(state => state === job.state))
);

export const allJobsOfTask = (taskId: string) => createSelector(
  getJobState,
  jobState => jobState.jobs.filter(job => job.taskId === taskId)
);

export const activeOrWaitingJobs = createSelector(
  getJobState,
  jobState => jobState.jobs.filter(job => ['active', 'waiting', 'repeat', 'wait'].find(state => state === job.state))
);
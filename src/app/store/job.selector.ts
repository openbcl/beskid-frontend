import { createFeatureSelector, createSelector } from "@ngrx/store";
import { JobState, jobFeatureKey } from "./job.reducer";

export const getJobState = createFeatureSelector<JobState>(jobFeatureKey);

export const activeOrWaitingJobs = createSelector(
  getJobState,
  jobState => jobState.jobs.filter(job => ['active', 'waiting', 'repeat', 'wait'].find(state => state === job.state))
);
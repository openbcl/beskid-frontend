import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { Job } from '../store/job';
import { Store } from '@ngrx/store';
import { activeOrWaitingJobs } from '../store/job.selector';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { findTask } from '../store/task.actions';
import { findJobs } from '../store/job.actions';

@Injectable({
  providedIn: 'root'
})
export class QueueService {

  private activeJobs: Job[] = [];
  private jobPollingEnabled = false;

  constructor(
    private http: HttpClient,
    private store: Store
  ) {
    this.store.select(activeOrWaitingJobs).pipe(takeUntilDestroyed()).subscribe(jobs => {
      this.activeJobs = this.activeJobs.filter(activeJob => {
        if (!jobs.find(job => job.jobId === activeJob.jobId)) {
          this.store.dispatch(findTask({ taskId: activeJob.taskId, showSuccessMessage: true }));
          return false;
        }
        return true;
      });
      jobs.forEach(job => {
        if (!this.activeJobs.find(activeJob => activeJob.jobId === job.jobId)) {
          this.activeJobs.push(job);
        }
      });
      if (!!this.activeJobs.length && !this.jobPollingEnabled) {
        this.jobPollingEnabled = true;
        this.startPolling();
      } else if (!this.activeJobs.length && this.jobPollingEnabled) {
        this.jobPollingEnabled = false;
      }
    });
  }

  findJob(jobId: string) {
    return this.http.get<Job>(`${environment.api}/v1/queue/${jobId}`);
  }

  findJobs(types?: string[]) {
    return this.http.get<Job[]>(`${environment.api}/v1/queue`, types ? { params: { types } } : undefined);
  }

  private async startPolling() {
    await new Promise((resolve) => setTimeout(resolve, 5000));
    if (this.jobPollingEnabled) {
      this.store.dispatch(findJobs({ types: ['failed', 'active', 'waiting', 'repeat', 'wait'] }));
      this.startPolling();
    }
  }
}

import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { Store } from '@ngrx/store';
import { PanelModule } from 'primeng/panel';
import { allJobsOfTask } from '../store/job.selector';
import { Observable } from 'rxjs';
import { AsyncPipe } from '@angular/common';
import { TableModule } from 'primeng/table';
import { TooltipModule } from 'primeng/tooltip';
import { Job } from '../store/job';
import { JobStatusComponent } from '../job-status/job-status.component';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'be-task-jobs',
  standalone: true,
  imports: [AsyncPipe, PanelModule, TableModule, RouterLink, JobStatusComponent, TooltipModule],
  templateUrl: './task-jobs.component.html',
  styleUrl: './task-jobs.component.scss'
})
export class TaskJobsComponent implements OnChanges  {

  @Input({ required: true })
  taskId!: string;

  jobs$: Observable<Job[]> = new Observable();

  columns = [
    { header: 'AI-model', width: 'auto' },
    { header: 'FDS', width: 'auto' },
    { header: 'State', width: 'auto' }
  ];

  constructor(private store: Store) {}

  ngOnChanges(changes: SimpleChanges) {
    if (changes['taskId'] && !!this.taskId) {
      this.jobs$ = this.store.select(allJobsOfTask(this.taskId));
    }
  }
}

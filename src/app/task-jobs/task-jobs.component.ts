import { Component, Input, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { PanelModule } from 'primeng/panel';
import { allJobsOfTask } from '../store/job.selector';
import { Observable } from 'rxjs';
import { AsyncPipe } from '@angular/common';
import { TableModule } from 'primeng/table';
import { Job } from '../store/job';
import { ProgressBarModule } from 'primeng/progressbar';
import { ProgressSpinnerModule } from 'primeng/progressspinner';

@Component({
  selector: 'be-task-jobs',
  standalone: true,
  imports: [AsyncPipe, PanelModule, TableModule, ProgressBarModule, ProgressSpinnerModule],
  templateUrl: './task-jobs.component.html',
  styleUrl: './task-jobs.component.scss'
})
export class TaskJobsComponent implements OnInit  {

  @Input({ required: true })
  taskId!: string;

  jobs$: Observable<Job[]> = new Observable();

  columns = [
    { header: 'AI-model', width: 'auto' },
    { header: 'Resolution', width: 'auto' },
    { header: 'State', width: 'auto' }
  ];

  constructor(private store: Store) {}

  ngOnInit(): void {
    this.jobs$ = this.store.select(allJobsOfTask(this.taskId));
  }
}

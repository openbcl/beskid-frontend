import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Store } from '@ngrx/store';
import { AsyncPipe, DatePipe } from '@angular/common';
import { PanelModule } from 'primeng/panel';
import { ButtonModule } from 'primeng/button';
import { ConfirmationService } from 'primeng/api';
import { combineLatest, filter, map, switchMap, tap } from 'rxjs';
import { isTaskRunning$, task } from '../store/task.selector';
import { findTask, selectTask } from '../store/task.actions';
import { Task, TaskResultEvaluation } from '../store/task';
import { TaskChartComponent } from "../task-chart/task-chart.component";
import { NumbersToStringsPipe } from "../shared/numbers-to-strings.pipe";
import { deleteTask } from '../store/task.actions';
import { TaskRunComponent } from "../task-run/task-run.component";
import { TaskResultsComponent } from "../task-results/task-results.component";
import { TaskJobsComponent } from "../task-jobs/task-jobs.component";
import { findModels } from '../store/model.actions';
import { compatibleModels$ } from '../store/model.selector';
import { filterNullish } from '../shared/rx.filter';
import { LockableModel } from '../store/model';
import { jobs } from '../store/job.selector';


@Component({
    selector: 'be-task',
    standalone: true,
    templateUrl: './task.component.html',
    styleUrl: './task.component.scss',
    imports: [AsyncPipe, DatePipe, TaskChartComponent, PanelModule, ButtonModule, NumbersToStringsPipe, TaskRunComponent, TaskResultsComponent, TaskJobsComponent]
})
export class TaskComponent implements OnInit {
  
  private activatedRoute = inject(ActivatedRoute);

  task$ = this.activatedRoute.params.pipe(
    map((p) => p['taskId'] as string),
    switchMap(taskId => this.store.select(task(taskId))),
    filterNullish()
  );

  taskWithValues$ = this.task$.pipe(
    tap(task => {
      if(!task.values?.length) {
        this.store.dispatch(findTask({ taskId: task.id }));
      } else {
        this.store.dispatch(selectTask({ task }));
      }
    }),
    filter(task => !!task.values?.length)
  )
  
  running$ = this.store.select(isTaskRunning$(this.task$)).pipe(switchMap(running => running));
  compatibleModels$ = this.store.select(compatibleModels$(this.task$)).pipe(switchMap(models => models));
  lockableModels$ = combineLatest([this.task$, this.store.select(jobs), this.compatibleModels$]).pipe(map(combined => combined[2].map(model => ({
    ...model,
    locked:
      !!combined[0].results.find(result => result.model.id === model.id) || 
      !!combined[0].jobs?.find(job => job.model.id === model.id) ||
      !!combined[1].find(job => job.taskId === combined[0].id && job.model.id === model.id)
  }) as LockableModel)));

  constructor(
    private confirmationService: ConfirmationService,
    private store: Store
  ) { }

  ngOnInit(): void {
    this.store.dispatch(findModels());
  }

  deleteTask(task: Task) {
    const dialog = {
      header: 'Delete task',
      icon: 'fas fa-trash-can',
      acceptButtonStyleClass: 'p-button-danger',
      message: 'Are you sure that you want to delete this task? Evaluated training data is retained.',
      accept: () => this.store.dispatch(deleteTask({ taskId: task.id }))
    };
    if (task.training && !!task.results?.find(result => result.evaluation !== TaskResultEvaluation.NEUTRAL)) {
      dialog.message += ' Previously evaluated training data is retained.'
    }
    this.confirmationService.confirm(dialog);
  }
}

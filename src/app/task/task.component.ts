import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Store } from '@ngrx/store';
import { AsyncPipe, DatePipe } from '@angular/common';
import { isTaskRunning$, task } from '../store/task.selector';
import { filter, map, Observable, switchMap,  take,  tap } from 'rxjs';
import { findTask } from '../store/task.actions';
import { Task, TaskResultEvaluation } from '../store/task';
import { TaskChartComponent } from "../task-chart/task-chart.component";
import { NumbersToStringsPipe } from "../shared/numbers-to-strings.pipe";
import { PanelModule } from 'primeng/panel';
import { ButtonModule } from 'primeng/button';
import { ConfirmationService } from 'primeng/api';
import { deleteTask } from '../store/task.actions';
import { TaskRunComponent } from "../task-run/task-run.component";
import { TaskResultsComponent } from "../task-results/task-results.component";
import { TaskJobsComponent } from "../task-jobs/task-jobs.component";
import { findModels } from '../store/model.actions';
import { compatibleModels$ } from '../store/model.selector';
import { filterNullish } from '../shared/rx.filter';


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
    switchMap(taskId => this.store.select(task(taskId)).pipe(
      filter(task => task?.id === taskId),
      tap(task => {
        if (!task?.values?.length) {
          taskId && this.store.dispatch(findTask({ taskId }))
        }
      })
    )),
    filterNullish()
  );

  running$ = this.store.select(isTaskRunning$(this.task$)).pipe(switchMap(running => running));
  models$ = this.store.select(compatibleModels$(this.task$)).pipe(switchMap(models => models));

  constructor(
    private confirmationService: ConfirmationService,
    private store: Store
  ) { }

  ngOnInit(): void {
    this.store.dispatch(findModels());
    this.activatedRoute.params.pipe(take(1), map((p) => p['taskId'] as string)).subscribe(taskId => this.store.dispatch(findTask({ taskId })));
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

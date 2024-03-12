import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Store } from '@ngrx/store';
import { AsyncPipe } from '@angular/common';
import { task } from '../store/task.selector';
import { filter, map, switchMap, take, tap } from 'rxjs';
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


@Component({
    selector: 'be-task',
    standalone: true,
    templateUrl: './task.component.html',
    styleUrl: './task.component.scss',
    imports: [AsyncPipe, TaskChartComponent, PanelModule, ButtonModule, NumbersToStringsPipe, TaskRunComponent, TaskResultsComponent]
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
    ))
  );

  constructor(
    private confirmationService: ConfirmationService,
    private store: Store
  ) { }

  ngOnInit(): void {
    this.activatedRoute.params.pipe(take(1), map((p) => p['taskId'] as string)).subscribe(taskId => this.store.dispatch(findTask({ taskId })));
  }

  deleteTask(task: Task) {
    const dialog = {
      header: 'Delete task',
      icon: 'fas fa-trash-can',
      acceptButtonStyleClass: 'p-button-danger',
      message: 'Are you sure you that want to delete this task? Analysed training data is retained.',
      accept: () => this.store.dispatch(deleteTask({ taskId: task.id }))
    };
    if (task.training && !!task.results?.find(result => result.evaluation !== TaskResultEvaluation.NEUTRAL)) {
      dialog.message += ' Previously analysed training data is retained.'
    }
    this.confirmationService.confirm(dialog);
  }
}

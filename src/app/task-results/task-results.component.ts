import { Component, Input } from '@angular/core';
import { Store } from '@ngrx/store';
import { AsyncPipe } from '@angular/common';
import { task } from '../store/task.selector';
import { tap } from 'rxjs';
import { findTask } from '../store/task.actions';

@Component({
  selector: 'be-task-results',
  standalone: true,
  imports: [AsyncPipe],
  templateUrl: './task-results.component.html',
  styleUrl: './task-results.component.scss'
})
export class TaskResultsComponent {
  @Input() taskId?: string;

  task$ = this.store.select(task(this.taskId)).pipe(
    tap(task => !task?.values?.length && this.taskId && this.store.dispatch(findTask({ taskId: this.taskId })))
  );

  constructor(private store: Store) {}
}

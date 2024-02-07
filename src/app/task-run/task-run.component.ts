import { Component, Input } from '@angular/core';
import { Store } from '@ngrx/store';
import { AsyncPipe } from '@angular/common';
import { task } from '../store/task.selector';
import { tap } from 'rxjs';
import { findTask } from '../store/task.actions';

@Component({
  selector: 'be-task-run',
  standalone: true,
  imports: [AsyncPipe],
  templateUrl: './task-run.component.html',
  styleUrl: './task-run.component.scss'
})
export class TaskRunComponent {
  @Input() taskId?: string;

  task$ = this.store.select(task(this.taskId)).pipe(
    tap(task => !task?.values?.length && this.taskId && this.store.dispatch(findTask({ taskId: this.taskId })))
  );

  constructor(private store: Store) {}
}

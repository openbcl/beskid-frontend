import { Component, Input, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { AsyncPipe } from '@angular/common';
import { task } from '../store/task.selector';
import { Observable, filter, tap } from 'rxjs';
import { findTask } from '../store/task.actions';
import { Task } from '../store/task';

@Component({
  selector: 'be-task-run',
  standalone: true,
  imports: [AsyncPipe],
  templateUrl: './task-run.component.html',
  styleUrl: './task-run.component.scss'
})
export class TaskRunComponent implements OnInit {
  @Input() taskId?: string;

  task$ = new Observable<Task | undefined>;

  constructor(private store: Store) {}

  ngOnInit(): void {
    this.task$ = this.store.select(task(this.taskId)).pipe(filter(task => task?.id === this.taskId), tap(task => !task?.values?.length && this.taskId && this.store.dispatch(findTask({ taskId: this.taskId }))));
  }
}

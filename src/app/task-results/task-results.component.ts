import { Component, Input, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { AsyncPipe } from '@angular/common';
import { task } from '../store/task.selector';
import { Observable, filter, tap } from 'rxjs';
import { findTask } from '../store/task.actions';
import { Task } from '../store/task';

@Component({
  selector: 'be-task-results',
  standalone: true,
  imports: [AsyncPipe],
  templateUrl: './task-results.component.html',
  styleUrl: './task-results.component.scss'
})
export class TaskResultsComponent implements OnInit {
  @Input() taskId?: string;

  task$ = new Observable<Task | undefined>;

  constructor(private store: Store) {}

  ngOnInit(): void {
    this.task$ = this.store.select(task(this.taskId)).pipe(filter(task => task?.id === this.taskId), tap(task => !task?.values?.length && this.taskId && this.store.dispatch(findTask({ taskId: this.taskId }))));
  }
}

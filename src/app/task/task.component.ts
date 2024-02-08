import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Store } from '@ngrx/store';
import { AsyncPipe } from '@angular/common';
import { task } from '../store/task.selector';
import { Observable, filter, map, switchMap, tap } from 'rxjs';
import { findTask } from '../store/task.actions';
import { Task } from '../store/task';

@Component({
  selector: 'be-task',
  standalone: true,
  imports: [AsyncPipe],
  templateUrl: './task.component.html',
  styleUrl: './task.component.scss'
})
export class TaskComponent implements OnInit {
  
  private activatedRoute = inject(ActivatedRoute);

  task$ = new Observable<Task | undefined>;

  constructor(private store: Store) { }

  ngOnInit(): void {
    this.task$ = this.activatedRoute.params.pipe(
      map((p) => p['taskId'] as string),
      switchMap(taskId => this.store.select(task(taskId)).pipe(
        filter(task => task?.id === taskId),
        tap(task => !task?.values?.length && taskId && this.store.dispatch(findTask({ taskId })))
      ))
    );
  }
}

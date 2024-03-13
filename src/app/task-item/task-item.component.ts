import { AsyncPipe, DatePipe } from '@angular/common';
import { AfterViewInit, Component, Input } from '@angular/core';
import { CardModule } from 'primeng/card';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { Task } from '../store/task';
import { Store } from '@ngrx/store';
import { isRunning } from '../store/task.selector';
import { Subject, switchMap } from 'rxjs';

@Component({
  selector: 'be-task-item',
  standalone: true,
  imports: [AsyncPipe, DatePipe, CardModule, ProgressSpinnerModule],
  templateUrl: './task-item.component.html',
  styleUrl: './task-item.component.scss'
})
export class TaskItemComponent implements AfterViewInit {
  @Input(({ required: true })) task!: Task;
  @Input(({ required: true })) nr!: number;

  taskId$ = new Subject<string>();
  running$ = this.taskId$.pipe(switchMap(taskId => this.store.select(isRunning(taskId))));

  constructor(private store: Store) { }

  ngAfterViewInit(): void {
    this.taskId$.next(this.task.id);
  }
}

import { Component } from '@angular/core';
import { findTasks } from '../store/task.actions';
import { Store } from '@ngrx/store';
import { tasks } from '../store/task.selector';
import { AsyncPipe } from '@angular/common';
import { TaskItemComponent } from "../task-item/task-item.component";
import { RouterLink } from '@angular/router';
import { ButtonModule } from 'primeng/button';

@Component({
    selector: 'be-task-list',
    standalone: true,
    templateUrl: './task-list.component.html',
    styleUrl: './task-list.component.scss',
    imports: [AsyncPipe, TaskItemComponent, RouterLink, ButtonModule]
})
export class TaskListComponent {

  tasks$ = this.store.select(tasks);

  constructor(private store: Store) {
    this.store.dispatch(findTasks())
  }

}

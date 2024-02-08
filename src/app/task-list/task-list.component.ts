import { Component, ElementRef, EventEmitter, Input, Output } from '@angular/core';
import { findTasks } from '../store/task.actions';
import { Store } from '@ngrx/store';
import { tasks } from '../store/task.selector';
import { AsyncPipe } from '@angular/common';
import { TaskItemComponent } from "../task-item/task-item.component";
import { RouterLink, RouterLinkActive } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { RippleModule } from 'primeng/ripple';

@Component({
    selector: 'be-task-list',
    standalone: true,
    templateUrl: './task-list.component.html',
    styleUrl: './task-list.component.scss',
    imports: [AsyncPipe, TaskItemComponent, RouterLink, RouterLinkActive, ButtonModule, RippleModule]
})
export class TaskListComponent {
  @Input(({ required: true })) showTaskListSidebar = false;
  @Output() showTaskListSidebarChange = new EventEmitter<boolean>();

  tasks$ = this.store.select(tasks);

  constructor(private store: Store, private elementRef: ElementRef) {
    this.store.dispatch(findTasks());
  }

  changeShowTaskListSidebar() {
    const body = (this.elementRef.nativeElement as HTMLElement).parentElement;
    if (body && body.offsetWidth <= 700) {
      this.showTaskListSidebar = !this.showTaskListSidebar;
      this.showTaskListSidebarChange.emit(this.showTaskListSidebar);
    }
  }

}

import { Component, ElementRef } from '@angular/core';
import { Store } from '@ngrx/store';
import { tasks } from '../store/task.selector';
import { AsyncPipe } from '@angular/common';
import { TaskItemComponent } from "../task-item/task-item.component";
import { RouterLink, RouterLinkActive } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { RippleModule } from 'primeng/ripple';
import { SortTasksPipe } from "../shared/sort-tasks.pipe";
import { changeTaskListSidebarVisibility } from '../store/ui.actions';

@Component({
    selector: 'be-task-list',
    standalone: true,
    templateUrl: './task-list.component.html',
    styleUrl: './task-list.component.scss',
    imports: [AsyncPipe, TaskItemComponent, RouterLink, RouterLinkActive, ButtonModule, RippleModule, SortTasksPipe]
})
export class TaskListComponent {
  tasks$ = this.store.select(tasks);

  constructor(private store: Store, private elementRef: ElementRef) { }

  changeShowTaskListSidebar() {
    const body = (this.elementRef.nativeElement as HTMLElement).parentElement?.parentElement;
    if (body && body.offsetWidth <= 700) {
      this.store.dispatch(changeTaskListSidebarVisibility())
    }
  }

}

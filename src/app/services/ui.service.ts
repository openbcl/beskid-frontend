import { Injectable } from '@angular/core';
import { of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UiService {

  constructor() { }

  isTaskListSidebarVisible() {
    return of(localStorage.getItem('showTaskListSidebar') === 'true');
  }

  changeTaskListSidebarVisibility() {
    const showTaskListSidebar = localStorage.getItem('showTaskListSidebar') === 'true'
    localStorage.setItem('showTaskListSidebar', showTaskListSidebar ? 'false' : 'true');
    return of(!showTaskListSidebar);
  }
}

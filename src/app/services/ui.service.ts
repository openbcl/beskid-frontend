import { Injectable } from '@angular/core';
import { of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UiService {

  constructor() { }

  changeTaskListSidebarVisibility() {
    const showTaskListSidebar = localStorage.getItem('showTaskListSidebar') === 'true'
    localStorage.setItem('showTaskListSidebar', showTaskListSidebar ? 'false' : 'true');
    return of(!showTaskListSidebar);
  }
}

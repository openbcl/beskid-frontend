import { Routes } from '@angular/router';
import { TaskCreateComponent } from './task-create/task-create.component';
import { WelcomeComponent } from './welcome/welcome.component';
import { TaskComponent } from './task/task.component';
import { TaskRunComponent } from './task-run/task-run.component';
import { TaskResultsComponent } from './task-results/task-results.component';

export const routes: Routes = [
  {
    path: '',
    component: WelcomeComponent
  }, {
    path: 'create',
    component: TaskCreateComponent
  }, {
    path: 'tasks/:taskId',
    component: TaskComponent
  }, {
    path: 'tasks/:taskId/run',
    component: TaskRunComponent
  }, {
    path: 'tasks/:taskId/results',
    component: TaskResultsComponent
  }, {
    path: '**',
    redirectTo: '/'
  }
];

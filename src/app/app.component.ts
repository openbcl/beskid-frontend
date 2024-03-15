import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { AsyncPipe } from '@angular/common';
import { Store } from '@ngrx/store';
import { PrimeNGConfig } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { checkSession } from './store/auth.actions';
import { TaskCreateComponent } from "./task-create/task-create.component";
import { TaskListComponent } from "./task-list/task-list.component";
import { ToolbarComponent } from "./toolbar/toolbar.component";
import { uiState } from './store/ui.selector';
import { ProcessingComponent } from "./processing/processing.component";


@Component({
    selector: 'be-root',
    standalone: true,
    templateUrl: './app.component.html',
    styleUrl: './app.component.scss',
    imports: [AsyncPipe, RouterOutlet, TaskCreateComponent, ConfirmDialogModule, ToastModule, TaskListComponent, ToolbarComponent, ProcessingComponent]
})
export class AppComponent {
  uiState$ = this.store.select(uiState);

  constructor(private store: Store, private primengConfig: PrimeNGConfig) {
    this.primengConfig.ripple = true;
    this.store.dispatch(checkSession());
  }
}

import { Component } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { RouterOutlet } from '@angular/router';
import { AsyncPipe } from '@angular/common';
import { Store } from '@ngrx/store';
import { filter } from 'rxjs';
import { PrimeNGConfig } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { TaskListComponent } from "./task-list/task-list.component";
import { ToolbarComponent } from "./toolbar/toolbar.component";
import { uiState } from './store/ui.selector';
import { ProcessingComponent } from "./processing/processing.component";
import { isValid } from './store/auth.selector';
import { findTasks } from './store/task.actions';
import { findJobs } from './store/job.actions';
import { SwUpdate, VersionReadyEvent } from '@angular/service-worker';


@Component({
    selector: 'be-root',
    standalone: true,
    templateUrl: './app.component.html',
    styleUrl: './app.component.scss',
    imports: [AsyncPipe, RouterOutlet, ConfirmDialogModule, ToastModule, TaskListComponent, ToolbarComponent, ProcessingComponent]
})
export class AppComponent {
  uiState$ = this.store.select(uiState);

  constructor(
    private store: Store,
    private swUpdate: SwUpdate,
    private primengConfig: PrimeNGConfig
  ) {
    this.primengConfig.ripple = true;
    this.store.select(isValid).pipe(takeUntilDestroyed(), filter(isValid => isValid)).subscribe(() => {
      this.store.dispatch(findTasks());
      this.store.dispatch(findJobs());
    });
    if (this.swUpdate.isEnabled) {
      this.swUpdate.versionUpdates.pipe(
        filter((evt): evt is VersionReadyEvent => evt.type === 'VERSION_READY')
      ).subscribe(() => window.location.reload());
    }
  }
}

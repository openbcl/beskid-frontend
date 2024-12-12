import { Component, ElementRef, Input } from '@angular/core';
import { ToolbarModule } from 'primeng/toolbar';
import { SpeedDialModule } from 'primeng/speeddial';
import { ConfirmationService, MenuItem } from 'primeng/api';
import { OverlayPanelModule } from 'primeng/overlaypanel';
import { BadgeModule } from 'primeng/badge';
import { ToggleButtonModule } from 'primeng/togglebutton';
import { DialogModule } from 'primeng/dialog';
import { TabViewModule } from 'primeng/tabview';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { Store } from '@ngrx/store';
import { AsyncPipe } from '@angular/common';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { deleteSession } from '../store/auth.actions';
import { changeTaskListSidebarVisibility } from '../store/ui.actions';
import { map, Observable } from 'rxjs';
import { Job } from '../store/job';
import { jobs } from '../store/job.selector';
import { JobStatusComponent } from '../job-status/job-status.component';
import { validityPeriodInDays } from '../store/auth.selector';
import { info } from '../store/info.selector';
import { obtainInfo } from '../store/info.actions';
import { environment } from '../../environments/environment';


@Component({
  selector: 'be-toolbar',
  standalone: true,
  imports: [AsyncPipe, ToolbarModule, SpeedDialModule, DialogModule, ToggleButtonModule, TabViewModule, RouterLink, BadgeModule, ProgressSpinnerModule, RouterLinkActive, OverlayPanelModule, JobStatusComponent],
  templateUrl: './toolbar.component.html',
  styleUrl: './toolbar.component.scss'
})
export class ToolbarComponent {
  @Input(({ required: true })) showTaskListSidebar = false;

  frontendURL = location.origin;
  backendURL = environment.api;

  avatarItems: MenuItem[] = [
    {
      icon: 'fa-solid fa-arrow-right-from-bracket',
      command: () => this.confirmationService.confirm({
        header: 'Delete current session and tasks',
        icon: 'fas fa-trash-can',
        acceptButtonStyleClass: 'p-button-danger',
        message: 'Are you sure that you want to delete your session and all corresponding tasks? Evaluated training data is retained.',
        accept: () => this.store.dispatch(deleteSession())
      })
    },
    { icon: 'fas fa-info', command: () => this.showInfoDialog = true },
    { icon: 'fas fa-house', url: 'https://www.beskid-projekt.de/en', target: '_blank' }
  ]

  jobs$: Observable<Job[]> =this.store.select(jobs);
  uncompletedJobs$ = this.jobs$.pipe(map(jobs => jobs.filter(job => ['active', 'waiting'].includes(job.state)).length));
  validityPeriodInDays$ = this.store.select(validityPeriodInDays);
  info$ = this.store.select(info);

  showInfoDialog = false;


  constructor(
    private elementRef: ElementRef,
    private confirmationService: ConfirmationService,
    private store: Store
  ) {
    this.store.dispatch((obtainInfo()));
  }

  changeShowTaskListSidebar() {
    this.store.dispatch(changeTaskListSidebarVisibility())
  }

  checkChangeShowTaskListSidebar() {
    const body = (this.elementRef.nativeElement as HTMLElement).parentElement;
    if (body && body.offsetWidth <= 764) {
      this.changeShowTaskListSidebar();
    }
  }
}

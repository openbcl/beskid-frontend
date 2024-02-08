import { Component, ElementRef, EventEmitter, Input, Output } from '@angular/core';
import { ToolbarModule } from 'primeng/toolbar';
import { SpeedDialModule } from 'primeng/speeddial';
import { ConfirmationService, MenuItem } from 'primeng/api';
import { ToggleButtonModule } from 'primeng/togglebutton';
import { RouterLink } from '@angular/router';
import { Store } from '@ngrx/store';
import { deleteSession } from '../store/auth.actions';

@Component({
  selector: 'be-toolbar',
  standalone: true,
  imports: [ToolbarModule, SpeedDialModule, ToggleButtonModule, RouterLink],
  templateUrl: './toolbar.component.html',
  styleUrl: './toolbar.component.scss'
})
export class ToolbarComponent {
  @Input(({ required: true })) showTaskListSidebar = false;
  @Output() showTaskListSidebarChange = new EventEmitter<boolean>();

  avatarItems: MenuItem[] = [
    {
      icon: 'fas fa-trash',
      command: () => this.confirmationService.confirm({
        header: 'Delete current session and tasks',
        icon: 'fas fa-trash-can',
        acceptButtonStyleClass: 'p-button-danger',
        message: 'Are you sure you that want to delete your session and all corresponding tasks? Analysed training data is retained.',
        accept: () => this.store.dispatch(deleteSession())
      })
    },
    { icon: 'fas fa-info' },
    { icon: 'fas fa-house', url: 'https://www.beskid-projekt.de/en', target: '_blank' }
  ]

  constructor(
    private elementRef: ElementRef,
    private confirmationService: ConfirmationService,
    private store: Store
  ) { }

  changeShowTaskListSidebar() {
    this.showTaskListSidebar = !this.showTaskListSidebar;
    this.showTaskListSidebarChange.emit(this.showTaskListSidebar);
  }

  checkChangeShowTaskListSidebar() {
    const body = (this.elementRef.nativeElement as HTMLElement).parentElement;
    if (body && body.offsetWidth <= 700) {
      this.showTaskListSidebar = false;
      this.showTaskListSidebarChange.emit(this.showTaskListSidebar);
    }
  }
}

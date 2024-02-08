import { Component, ElementRef, EventEmitter, Input, Output } from '@angular/core';
import { ToolbarModule } from 'primeng/toolbar';
import { SpeedDialModule } from 'primeng/speeddial';
import { MenuItem } from 'primeng/api';
import { ToggleButtonModule } from 'primeng/togglebutton';
import { RouterLink } from '@angular/router';

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
    {icon: 'fas fa-trash' },
    {icon: 'fas fa-info' },
    {icon: 'fas fa-house' }
  ]

  constructor(private elementRef: ElementRef) { }

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

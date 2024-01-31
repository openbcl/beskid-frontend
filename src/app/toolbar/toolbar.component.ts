import { Component } from '@angular/core';
import { ToolbarModule } from 'primeng/toolbar';
import { SpeedDialModule } from 'primeng/speeddial';
import { MenuItem } from 'primeng/api';
import { ToggleButtonModule } from 'primeng/togglebutton';


@Component({
  selector: 'be-toolbar',
  standalone: true,
  imports: [ToolbarModule, SpeedDialModule, ToggleButtonModule],
  templateUrl: './toolbar.component.html',
  styleUrl: './toolbar.component.scss'
})
export class ToolbarComponent {
  avatarItems: MenuItem[] = [
    {icon: 'fas fa-trash' },
    {icon: 'fas fa-info' },
    {icon: 'fas fa-house' }
  ]
}

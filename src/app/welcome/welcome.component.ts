import { Component } from '@angular/core';
import { FieldsetModule } from 'primeng/fieldset';
import { MessagesModule } from 'primeng/messages';
import { TagModule } from 'primeng/tag';
import { ButtonModule } from 'primeng/button';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'be-welcome',
  standalone: true,
  imports: [FieldsetModule, MessagesModule, TagModule, ButtonModule, RouterLink],
  templateUrl: './welcome.component.html',
  styleUrl: './welcome.component.scss'
})
export class WelcomeComponent {
}

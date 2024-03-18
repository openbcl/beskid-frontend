import { Component } from '@angular/core';
import { FieldsetModule } from 'primeng/fieldset';
import { MessagesModule } from 'primeng/messages';
import { TagModule } from 'primeng/tag';
import { ButtonModule } from 'primeng/button';
import { RouterLink } from '@angular/router';
import { Store } from '@ngrx/store';
import { tasks } from '../store/task.selector';
import { AsyncPipe } from '@angular/common';

@Component({
  selector: 'be-welcome',
  standalone: true,
  imports: [AsyncPipe, FieldsetModule, MessagesModule, TagModule, ButtonModule, RouterLink],
  templateUrl: './welcome.component.html',
  styleUrl: './welcome.component.scss'
})
export class WelcomeComponent {

  tasks$ = this.store.select(tasks);

  constructor(private store: Store) {}
}

import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Store } from '@ngrx/store';
import { checkSession } from './store/auth.actions';
import { TaskCreateComponent } from "./task-create/task-create.component";


@Component({
    selector: 'be-root',
    standalone: true,
    templateUrl: './app.component.html',
    styleUrl: './app.component.scss',
    imports: [RouterOutlet, TaskCreateComponent]
})
export class AppComponent {
  title = 'beskid-frontend';

  constructor(private store: Store) {
    this.store.dispatch(checkSession());
  }
}

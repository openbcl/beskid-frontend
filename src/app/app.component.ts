import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Store } from '@ngrx/store';
import { checkSession } from './store/auth.actions';
import { TaskCreateComponent } from "./task-create/task-create.component";
import { PrimeNGConfig } from 'primeng/api';


@Component({
    selector: 'be-root',
    standalone: true,
    templateUrl: './app.component.html',
    styleUrl: './app.component.scss',
    imports: [RouterOutlet, TaskCreateComponent]
})
export class AppComponent {
  title = 'beskid-frontend';

  constructor(private store: Store, private primengConfig: PrimeNGConfig) {
    this.primengConfig.ripple = true;
    this.store.dispatch(checkSession());
  }
}

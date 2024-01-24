import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { AsyncPipe } from '@angular/common';
import { Store, select } from '@ngrx/store';
import { checkSession } from './store/auth.actions';
import { auth } from './store/auth.selector';


@Component({
  selector: 'be-root',
  standalone: true,
  imports: [RouterOutlet, AsyncPipe],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'beskid-frontend';
  auth$ = this.store.pipe(select(auth));

  constructor(private store: Store) {
    this.store.dispatch(checkSession());
  }

}

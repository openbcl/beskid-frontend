import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { AsyncPipe } from '@angular/common';
import { Store, select } from '@ngrx/store';
import { checkSession, deleteSession } from './store/auth.actions';
import { auth } from './store/auth.selector';
import { models, model } from './store/model.selector';
import { findModel, findModels } from './store/model.actions';


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
  models$ = this.store.pipe(select(models));
  model$ = this.store.pipe(select(model));

  constructor(private store: Store) {
    this.store.dispatch(checkSession());
    this.store.dispatch(findModel({ modelId: 1 }));
    this.store.dispatch(findModels());
  }

  deleteSession() {
    this.store.dispatch(deleteSession());
  }
}

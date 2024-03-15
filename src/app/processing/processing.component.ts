import { AsyncPipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ProgressBarModule } from 'primeng/progressbar';
import { uiState } from '../store/ui.selector';
import { Store } from '@ngrx/store';
import { checkSession } from '../store/auth.actions';

@Component({
  selector: 'be-processing',
  standalone: true,
  imports: [AsyncPipe, ProgressBarModule],
  templateUrl: './processing.component.html',
  styleUrl: './processing.component.scss'
})
export class ProcessingComponent implements OnInit {
  uiState$ = this.store.select(uiState);

  constructor(private store: Store) { }

  ngOnInit(): void {
    this.store.dispatch(checkSession());
  }
}

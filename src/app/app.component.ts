import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { AuthService } from './services/auth.service';
import { Observable } from 'rxjs';
import { AsyncPipe } from '@angular/common';
import { Auth } from './schemas/auth';


@Component({
  selector: 'be-root',
  standalone: true,
  imports: [RouterOutlet, AsyncPipe],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'beskid-frontend';
  auth$: Observable<Auth>;

  constructor(authService: AuthService) {
    this.auth$ = authService.newSession();
  }

}

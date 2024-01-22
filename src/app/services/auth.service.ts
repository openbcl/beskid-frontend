import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { map } from 'rxjs';
import { JwtHelperService } from '@auth0/angular-jwt';
import { Auth } from '../schemas/auth';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private http: HttpClient, private readonly jwtHelperService: JwtHelperService) { }

  newSession() {
    return this.http.post<Auth>(`${environment.api}/v1/auth`, '').pipe(map(auth => this.setSession(auth)));
  }

  deleteSession(){
    localStorage.removeItem('token');
  }

  renewSession() {
    const token = localStorage.getItem('token');
    if (!!token && !this.jwtHelperService.isTokenExpired(token))
      return this.http.put<Auth>(`${environment.api}/v1/auth`, '').pipe(map(auth => this.setSession(auth)));
    else
      return this.newSession();
  }

  private setSession(auth: Auth): Auth {
    localStorage.setItem('token', auth.token);
    return { ...auth, sessionId: this.jwtHelperService.decodeToken(auth.token).sessionId };
  }


}

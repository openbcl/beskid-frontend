import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { map, of, throwError } from 'rxjs';
import { JwtHelperService } from '@auth0/angular-jwt';
import { Auth } from '../store/auth';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private http: HttpClient, private readonly jwtHelperService: JwtHelperService) { }

  newSession() {
    return this.http.post<Auth>(`${environment.api}/v1/auth`, '').pipe(map(auth => this.setSessionToken(auth)));
  }

  deleteSession(){
    return this.http.delete<Auth>(`${environment.api}/v1/auth`).pipe(map(() => localStorage.removeItem('token')));
  }

  renewSession(auth = this.getAuth()) {
    if (!!auth && !this.jwtHelperService.isTokenExpired(auth.token))
      return this.http.put<Auth>(`${environment.api}/v1/auth`, '').pipe(map(auth => this.setSessionToken(auth)));
    else
      return this.newSession();
  }

  checkSession() {
    const auth = this.getAuth();
    const rand = Math.random();
    console.log(rand);
    console.log(auth);
    if (!auth) {
      return throwError(() => new Error('No session found!'));
    }
    console.log(rand);

    return of({
      auth,
      ...!this.jwtHelperService.isTokenExpired(auth.token) ? {
        isValid: true,
        ageInDays: Math.floor(((+new Date()) - this.jwtHelperService.decodeToken(auth.token).iat * 1000) / 86400000)
      } : { isValid: false, ageInDays: 0 }
    })
  }

  private getAuth() {
    const token = localStorage.getItem('token');
    return !!token ? { token, sessionId: this.jwtHelperService.decodeToken(token).sessionId } as Auth : null;
  }

  private setSessionToken(auth: Auth): Auth {
    localStorage.setItem('token', auth.token);
    return { ...auth, sessionId: this.jwtHelperService.decodeToken(auth.token).sessionId };
  }
}

import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { map, Observable } from "rxjs";
import { environment } from '../../environments/environment';
import { version, commit, branch } from '../../environments/info';
import { Git, Info } from "../store/info";

@Injectable({
  providedIn: 'root'
})
export class InfoService {

  constructor(private http: HttpClient) { }

  info(): Observable<Info> {
    return this.http.get<Git>(`${environment.api}/info`).pipe(map(backend => ({
      frontend: { version, commit, branch },
      backend,
    })));
  }
}
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { Model } from '../store/model';

@Injectable({
  providedIn: 'root'
})
export class ModelService {

  constructor(private http: HttpClient) { }

  findModel(modelId: number) {
    return this.http.get<Model>(`${environment.api}/v1/models/${modelId}`);
  }

  findModels() {
    return this.http.get<Model[]>(`${environment.api}/v1/models`);
  }
}

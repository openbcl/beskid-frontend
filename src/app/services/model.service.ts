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

  findModels(fdsVersion?: string, experimentID?: string) {
    let url = `${environment.api}/v1/models`
    if (!!fdsVersion?.length && !!experimentID?.length) {
      url += `?fdsVersion=${fdsVersion}&experimentID=${experimentID}`
    } else if (!!fdsVersion?.length) {
      url += `?fdsVersion=${fdsVersion}`
    } else if (!!experimentID?.length) {
      url += `?experimentID=${experimentID}`
    }
    return this.http.get<Model[]>(url);
  }
}

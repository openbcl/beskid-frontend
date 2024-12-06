import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { BlobFile, CreateTask, KeepTrainingData, ResultValue, Task, TaskResultEvaluation } from '../store/task';
import { Observable, map } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TaskService {

  constructor(private http: HttpClient) { }

  addTask(createTask: CreateTask) {
    return this.http.post<Task>(`${environment.api}/v1/tasks`, createTask);
  }

  findTasks() {
    return this.http.get<Task[]>(`${environment.api}/v1/tasks`);
  }

  findTask(taskId: string) {
    return this.http.get<Task>(`${environment.api}/v1/tasks/${taskId}`);
  }

  deleteTask(taskId: string) {
    return this.http.delete<void>(`${environment.api}/v1/tasks/${taskId}`);
  }

  runTask(taskId: string, modelId: number) {
    return this.http.post<Task>(`${environment.api}/v1/tasks/${taskId}/model/${modelId}`, undefined);
  }

  findTaskResult(taskId: string, fileId: string): Observable<ResultValue> {
    if (fileId.toLowerCase().endsWith('.json')) {
      return this.http.get(`${environment.api}/v1/tasks/${taskId}/results/${fileId}`, { observe: 'response', responseType: 'blob' }).pipe(map(response => ({
        fileResult: {
          blob: (response?.body ? new Blob([response.body], { type:  'application/json' }) : undefined),
          filename: response.headers.get('content-disposition')?.match(/filename="(.+?)"/)?.[1]
        } as BlobFile
      })));
    }
    return this.http.get<any>(`${environment.api}/v1/tasks/${taskId}/results/${fileId}`).pipe(map(dataResult => ({ dataResult })));
  }

  findTaskResultTemplateFile(taskId: string, fileId: string, experimentId: string, condition: number): Observable<BlobFile> {
    return this.http.get(`${environment.api}/v1/tasks/${taskId}/results/${fileId}/template-file?experimentId=${experimentId}&condition=${condition}`, { observe: 'response', responseType: 'blob' }).pipe(map(response =>  ({
        blob: response?.body ? new Blob([response.body], { type: 'text/plain' }) : null,
        filename: response.headers.get('content-disposition')?.match(/filename="(.+?)"/)?.[1]
    } as BlobFile)));
  }

  findTaskResultTemplateData(taskId: string, fileId: string, experimentId: string, condition: number) {
    return this.http.get(`${environment.api}/v1/tasks/${taskId}/results/${fileId}/template-data?experimentId=${experimentId}&condition=${condition}`, { responseType: 'text' });
  }

  evaluateTaskResult(taskId: string, fileId: string, evaluation: TaskResultEvaluation) {
    return this.http.put<Task>(`${environment.api}/v1/tasks/${taskId}/results/${fileId}`, undefined, { params: { evaluation } });
  }

  deleteTaskResult(taskId: string, fileId: string, keepTrainingData: KeepTrainingData ) {
    return this.http.delete<Task>(`${environment.api}/v1/tasks/${taskId}/results/${fileId}`, { params: { keepTrainingData } });
  }
}

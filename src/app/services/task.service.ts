import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { CreateTaskDto, Task, TaskResultEvaluation, TaskTraining } from '../store/task';

@Injectable({
  providedIn: 'root'
})
export class TaskService {

  constructor(private http: HttpClient) { }

  addTask(createTask: CreateTaskDto) {
    return this.http.post<Task>(`${environment.api}/v1/tasks`, createTask);
  }

  findTasks() {
    return this.http.get<Task[]>(`${environment.api}/v1/tasks`);
  }

  findTask(taskId: string) {
    return this.http.get<Task>(`${environment.api}/v1/tasks/${taskId}`);
  }

  editTask(taskId: string, training: TaskTraining) {
    return this.http.put<Task>(`${environment.api}/v1/tasks/${taskId}`, undefined, { params: { training } });
  }

  deleteTask(taskId: string) {
    return this.http.delete<void>(`${environment.api}/v1/tasks/${taskId}`);
  }

  runTask(taskId: string, modelId: number, resolution: number) {
    return this.http.post<Task>(`${environment.api}/v1/tasks/${taskId}/model/${modelId}/resolution/${resolution}`, undefined);
  }

  findTaskResult(taskId: string, fileId: string) {
    return this.http.get<any>(`${environment.api}/v1/tasks/${taskId}/results/${fileId}`);
  }

  evaluateTaskResult(taskId: string, fileId: string, evaluation: TaskResultEvaluation) {
    return this.http.put<Task>(`${environment.api}/v1/tasks/${taskId}/results/${fileId}`, undefined, { params: { evaluation } });
  }
}
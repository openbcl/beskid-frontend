import { TaskResult } from "./result";

export enum TaskTraining {
  DISABLED = 'DISABLED',
  ENABLED = 'ENABLED',
}

export interface Task {
  id: string;
  values: number[];
  training: TaskTraining;
  date: Date;
  results: TaskResult[];
}

export interface CreateTaskDto extends Pick<Task, 'values'>{};


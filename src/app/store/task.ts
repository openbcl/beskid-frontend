import { Job } from "./job";
import { ModelPartial } from "./model";

export enum TaskTraining {
  DISABLED = 'DISABLED',
  ENABLED = 'ENABLED',
}

export interface TaskCondition {
  id: string;
  resolution: number;
  value: number;
}

export interface Task {
  id: string;
  values: number[];
  condition: TaskCondition;
  training: TaskTraining;
  date: Date;
  results: TaskResult[];
  jobs?: Job[];
}

export interface CreateTask extends Pick<Task, 'values' | 'condition' | 'training'>{};

export enum TaskResultEvaluation {
  NEUTRAL = 'NEUTRAL',
  POSITIVE = 'POSITIVE',
  NEGATIVE = 'NEGATIVE',
}

export enum KeepTrainingData {
  TRUE = 'TRUE',
  FALSE = 'FALSE',
}

export interface TaskResult extends ResultValue{
  filename: string;
  uriFile: string;
  uriData: string;
  date: Date;
  model: ModelPartial;
  evaluation: TaskResultEvaluation;
}

export interface ResultValue {
  data?: { name: string, value: number }[];
  file?: Blob;
}
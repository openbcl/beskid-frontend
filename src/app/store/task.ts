import { Job } from "./job";
import { ModelPartial } from "./model";

export enum TaskTraining {
  DISABLED = 'DISABLED',
  ENABLED = 'ENABLED',
}

export interface TaskSetting {
  id: string;
  name: string;
  resolution: number;
  condition: number;
  conditionMU: string;
}

export interface Task {
  id: string;
  values: number[];
  setting: TaskSetting;
  training: TaskTraining;
  date: Date;
  results: TaskResult[];
  jobs?: Job[];
}

export interface CreateTask extends Pick<Task, 'values' | 'training'> {
  setting: Omit<TaskSetting, 'name' | 'conditionMU'>
};

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
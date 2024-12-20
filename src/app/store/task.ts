import { Job } from "./job";
import { ModelPartial, Template } from "./model";

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
  date: Date;
  results: TaskResult[];
  jobs?: Job[];
}

export interface CreateTask extends Pick<Task, 'values'> {
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

export interface TaskResult extends ResultValue {
  filename: string;
  uriFile: string;
  uriData: string;
  date: Date;
  model: ModelPartial;
  evaluation: TaskResultEvaluation;
  templates?: (Template & { file?: BlobFile, data?: string })[]
}

export interface ResultValue {
  dataResult?: { name: string, value: number }[];
  fileResult?: BlobFile;
}

export interface BlobFile {
  blob: Blob,
  filename: string
}
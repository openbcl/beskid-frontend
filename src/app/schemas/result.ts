import { Model } from "./model";

export enum TaskResultEvaluation {
  NEUTRAL = 'NEUTRAL',
  POSITIVE = 'POSITIVE',
  NEGATIVE = 'NEGATIVE',
}

export interface TaskResult {
  filename: string;
  uriFile: string;
  uriData: string;
  date: Date;
  model: Model;
  evaluation: TaskResultEvaluation;
}
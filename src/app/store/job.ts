import { ModelPartial } from "./model";

export interface Job {
  jobId: string;
  taskId: string;
  model: ModelPartial;
  state: 'completed' | 'failed' | 'active' | 'delayed' | 'prioritized' | 'waiting' | 'waiting-children' | 'paused' | 'repeat' | 'wait' | 'unknown';
}
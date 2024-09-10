import { Model } from "./model";

export interface Job {
  jobId: string;
  taskId: string;
  model: Model;
  state: 'completed' | 'failed' | 'active' | 'delayed' | 'prioritized' | 'waiting' | 'waiting-children' | 'paused' | 'repeat' | 'wait' | 'unknown';
}
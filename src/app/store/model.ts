export interface FDS {
  version: string;
  revision: string;
}

export interface Scale {
  name: string;
  desc: string;
}

export interface Experiment {
  id: string;
  name: string;
  scale: Scale;
  conditions: number[];
  conditionMU: string
}

export interface Template {
  experimentId: string;
  condition: number;
}

export interface Model {
  id: number;
  description: string,
  name: string;
  resolution: number;
  experiments: Experiment[];
  fds: FDS;
  templates: Template[];
  disabled: boolean;
}

export interface LockableModel extends Model {
  locked: boolean;
}

export interface ModelPartial extends Pick<Model, 'id' | 'name' | 'fds' | 'disabled'> {}
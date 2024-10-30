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

export interface Model {
  id: number;
  name: string;
  resolution: number;
  experiments: Experiment[];
  fds: FDS;
}

export interface ModelPartial extends Pick<Model, 'id' | 'name' | 'fds'> {}
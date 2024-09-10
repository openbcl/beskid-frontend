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
}

export interface Model {
  id: number;
  name: string;
  resolutions: number[];
  experiments?: Experiment[];
  fds?: FDS[];
}
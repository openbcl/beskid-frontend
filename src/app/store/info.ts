export interface Git {
  branch: string,
  commit: string
}

export interface Info {
  frontend: Git & {
    version: string
  },
  backend: Git
}
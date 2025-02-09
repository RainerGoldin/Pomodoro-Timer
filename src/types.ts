export interface TimerSettings {
  studyMinutes: number;
  studySeconds: number;
  restMinutes: number;
  restSeconds: number;
  autoSwitch: boolean;
}

export type TimerMode = 'study' | 'rest';
export type TimerStatus = 'idle' | 'running' | 'paused';
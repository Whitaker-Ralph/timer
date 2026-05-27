export type TimerStatus = 'idle' | 'running' | 'paused' | 'finished'

export interface TimerState {
  totalSeconds: number
  initialSeconds: number
  status: TimerStatus
  alarmEnabled: boolean
  alarmFired: boolean
}

export interface Preset {
  id: string
  label: string
  seconds: number
}

export type TimerAction =
  | { type: 'START' }
  | { type: 'PAUSE' }
  | { type: 'RESET' }
  | { type: 'TICK' }
  | { type: 'SET_TIME'; seconds: number }
  | { type: 'TOGGLE_ALARM' }
  | { type: 'FIRE_ALARM' }
  | { type: 'CLEAR_ALARM' }

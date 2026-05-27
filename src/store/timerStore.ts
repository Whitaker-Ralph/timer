import { TimerState, TimerAction } from '../types/timer'

export const initialState: TimerState = {
  totalSeconds: 5 * 60,
  initialSeconds: 5 * 60,
  status: 'idle',
  alarmEnabled: true,
  alarmFired: false,
}

export function timerReducer(state: TimerState, action: TimerAction): TimerState {
  switch (action.type) {
    case 'START':
      return { ...state, status: 'running', alarmFired: false }
    case 'PAUSE':
      return { ...state, status: 'paused' }
    case 'RESET':
      return {
        ...state,
        totalSeconds: state.initialSeconds,
        status: 'idle',
        alarmFired: false,
      }
    case 'TICK': {
      if (state.totalSeconds <= 0) return state
      const next = state.totalSeconds - 1
      return {
        ...state,
        totalSeconds: next,
        status: next === 0 ? 'finished' : 'running',
      }
    }
    case 'SET_TIME':
      return {
        ...state,
        totalSeconds: action.seconds,
        initialSeconds: action.seconds,
        status: 'idle',
        alarmFired: false,
      }
    case 'TOGGLE_ALARM':
      return { ...state, alarmEnabled: !state.alarmEnabled }
    case 'FIRE_ALARM':
      return { ...state, alarmFired: true }
    case 'CLEAR_ALARM':
      return { ...state, alarmFired: false }
    default:
      return state
  }
}

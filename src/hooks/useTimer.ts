import { useEffect } from 'react'
import type { TimerState, TimerAction } from '../types/timer'

export function useTimer(state: TimerState, dispatch: React.Dispatch<TimerAction>) {
  useEffect(() => {
    if (state.status !== 'running') return
    const id = setInterval(() => dispatch({ type: 'TICK' }), 1000)
    return () => clearInterval(id)
  }, [state.status, dispatch])

  useEffect(() => {
    if (state.status === 'finished' && state.alarmEnabled && !state.alarmFired) {
      dispatch({ type: 'FIRE_ALARM' })
    }
  }, [state.status, state.alarmEnabled, state.alarmFired, dispatch])
}

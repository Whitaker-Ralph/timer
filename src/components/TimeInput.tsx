import { useState } from 'react'
import type { TimerAction, TimerStatus } from '../types/timer'

interface Props {
  status: TimerStatus
  dispatch: React.Dispatch<TimerAction>
}

export default function TimeInput({ status, dispatch }: Props) {
  const [h, setH] = useState(0)
  const [m, setM] = useState(5)
  const [s, setS] = useState(0)

  const disabled = status === 'running' || status === 'paused'

  function handleSet() {
    const total = h * 3600 + m * 60 + s
    if (total <= 0) return
    dispatch({ type: 'SET_TIME', seconds: total })
  }

  function clamp(val: number, min: number, max: number) {
    return Math.max(min, Math.min(max, val))
  }

  const inputCls =
    'w-16 text-center bg-gray-800 border border-gray-600 rounded-lg px-2 py-1 text-white text-xl font-mono focus:outline-none focus:border-indigo-500 disabled:opacity-40'

  return (
    <div className="flex items-center gap-2 justify-center">
      <input
        type="number"
        min={0}
        max={99}
        value={h}
        disabled={disabled}
        onChange={(e) => setH(clamp(parseInt(e.target.value) || 0, 0, 99))}
        className={inputCls}
      />
      <span className="text-gray-400 text-xl font-bold">:</span>
      <input
        type="number"
        min={0}
        max={59}
        value={m}
        disabled={disabled}
        onChange={(e) => setM(clamp(parseInt(e.target.value) || 0, 0, 59))}
        className={inputCls}
      />
      <span className="text-gray-400 text-xl font-bold">:</span>
      <input
        type="number"
        min={0}
        max={59}
        value={s}
        disabled={disabled}
        onChange={(e) => setS(clamp(parseInt(e.target.value) || 0, 0, 59))}
        className={inputCls}
      />
      <button
        onClick={handleSet}
        disabled={disabled || h * 3600 + m * 60 + s <= 0}
        className="ml-2 px-4 py-1 rounded-lg bg-gray-700 hover:bg-gray-600 text-white text-sm font-medium transition-all active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed"
      >
        설정
      </button>
    </div>
  )
}

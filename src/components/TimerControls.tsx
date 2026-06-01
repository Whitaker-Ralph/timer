import type { TimerAction, TimerStatus } from '../types/timer'

interface Props {
  status: TimerStatus
  dispatch: React.Dispatch<TimerAction>
}

export default function TimerControls({ status, dispatch }: Props) {
  const isRunning = status === 'running'
  const isFinished = status === 'finished'

  return (
    <div className="flex items-center gap-4 justify-center">
      <button
        onClick={() => dispatch({ type: isRunning ? 'PAUSE' : 'START' })}
        disabled={isFinished}
        className="w-36 py-3 rounded-xl text-lg font-semibold transition-all
          bg-indigo-600 hover:bg-indigo-500 active:scale-95 text-white
          disabled:opacity-40 disabled:cursor-not-allowed"
      >
        {isRunning ? '일시정지' : '시작'}
      </button>
      <button
        onClick={() => dispatch({ type: 'RESET' })}
        className="w-36 py-3 rounded-xl text-lg font-semibold transition-all
          bg-gray-700 hover:bg-gray-600 active:scale-95 text-white"
      >
        초기화
      </button>
    </div>
  )
}

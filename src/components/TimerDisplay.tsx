import { formatTime } from '../utils/time'

interface Props {
  totalSeconds: number
  alarmFired: boolean
  isFullscreen?: boolean
}

export default function TimerDisplay({ totalSeconds, alarmFired, isFullscreen = false }: Props) {
  return (
    <div
      className={`flex items-center justify-center transition-colors duration-300 ${
        alarmFired ? 'text-red-400' : 'text-white'
      }`}
    >
      <span
        className={`font-mono font-bold select-none tabular-nums transition-all duration-300 ${
          isFullscreen ? 'text-[18vw] tracking-normal leading-none' : 'text-8xl md:text-9xl tracking-widest'
        }`}
      >
        {formatTime(totalSeconds)}
      </span>
    </div>
  )
}

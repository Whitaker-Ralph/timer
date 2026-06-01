import { useReducer, useRef, useState, useCallback } from 'react'
import { timerReducer, initialState } from '../store/timerStore'
import { useTimer } from '../hooks/useTimer'
import { useFullscreen } from '../hooks/useFullscreen'
import { usePip } from '../hooks/usePip'
import { usePresets } from '../hooks/usePresets'
import { useKeyboardShortcuts } from '../hooks/useKeyboardShortcuts'
import { formatTime } from '../utils/time'
import TimerDisplay from '../components/TimerDisplay'
import TimerControls from '../components/TimerControls'
import TimeInput from '../components/TimeInput'
import PresetPanel from '../components/PresetPanel'
import AlarmIndicator from '../components/AlarmIndicator'
import Toolbar from '../components/Toolbar'

export default function TimerPage() {
  const [state, dispatch] = useReducer(timerReducer, initialState)
  const containerRef = useRef<HTMLDivElement>(null)
  const [showBottomPanel, setShowBottomPanel] = useState(false)

  useTimer(state, dispatch)

  const { isFullscreen, enter: enterFullscreen, exit: exitFullscreen } = useFullscreen(containerRef)
  const { startPip, stopPip, updateLabel, updateAlarm, isPipActive, isPipSupported } = usePip()
  const { slots, saveSlot, clearSlot } = usePresets()

  const getLabel = useCallback(() => formatTime(state.totalSeconds), [state.totalSeconds])
  updateLabel(getLabel)
  updateAlarm(state.alarmFired)
  if (state.alarmFired && showBottomPanel) setShowBottomPanel(false)

  async function handlePip() {
    if (isPipActive) await stopPip()
    else await startPip()
  }

  function handleFullscreen() {
    if (isFullscreen) exitFullscreen()
    else enterFullscreen()
  }

  const handleStartPause = useCallback(() => {
    if (state.status === 'running') dispatch({ type: 'PAUSE' })
    else dispatch({ type: 'START' })
  }, [state.status])

  const handleReset = useCallback(() => dispatch({ type: 'RESET' }), [])

  const handlePreset = useCallback((index: number) => {
    const slot = slots[index]
    if (slot) dispatch({ type: 'SET_TIME', seconds: slot.seconds })
  }, [slots])

  useKeyboardShortcuts({
    onStartPause: handleStartPause,
    onReset: handleReset,
    onPreset: handlePreset,
    onFullscreen: handleFullscreen,
  })

  function handleMouseMove(e: React.MouseEvent) {
    if (!isFullscreen || state.alarmFired) return
    setShowBottomPanel(e.clientY >= window.innerHeight - 120)
  }

  // ── Fullscreen layout ──────────────────────────────────────────────────────
  if (isFullscreen) {
    return (
      <div
        ref={containerRef}
        className="fixed inset-0 bg-gray-900 text-white flex items-center justify-center overflow-hidden"
        onMouseMove={handleMouseMove}
        onMouseLeave={() => setShowBottomPanel(false)}
      >
        <AlarmIndicator alarmFired={state.alarmFired} dispatch={dispatch} />

        {/* Fullscreen exit button — top-right, visible on hover */}
        <button
          onClick={handleFullscreen}
          className="absolute top-4 right-4 p-2 rounded-lg text-gray-600 hover:text-white hover:bg-gray-700 transition-all z-20"
          title="전체화면 종료"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-5 h-5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 9V4.5M9 9H4.5M9 9 3.75 3.75M9 15v4.5M9 15H4.5M9 15l-5.25 5.25M15 9h4.5M15 9V4.5M15 9l5.25-5.25M15 15h4.5M15 15v4.5m0-4.5 5.25 5.25" />
          </svg>
        </button>

        {/* Giant timer — centered */}
        <TimerDisplay
          totalSeconds={state.totalSeconds}
          alarmFired={state.alarmFired}
          isFullscreen
        />

        {/* Bottom panel — slides up when mouse reaches bottom edge */}
        <div
          className={`absolute bottom-0 left-0 right-0 z-20 transition-transform duration-300 ease-in-out ${
            showBottomPanel ? 'translate-y-0' : 'translate-y-full'
          }`}
        >
          <div className="bg-gray-900/95 backdrop-blur-sm border-t border-gray-700 px-8 py-5 flex flex-col items-center gap-4">
            <TimerControls status={state.status} dispatch={dispatch} />

            {slots.some(Boolean) && (
              <div className="flex flex-wrap gap-2 justify-center">
                {slots.map((slot, i) =>
                  slot ? (
                    <button
                      key={i}
                      onClick={() => dispatch({ type: 'SET_TIME', seconds: slot.seconds })}
                      className="px-4 py-1.5 rounded-lg bg-gray-800 hover:bg-gray-700 text-sm text-gray-200 hover:text-white transition-all"
                    >
                      <span className="font-medium">{slot.label}</span>
                      <span className="ml-2 font-mono text-gray-400 text-xs">{formatTime(slot.seconds)}</span>
                    </button>
                  ) : null
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    )
  }

  // ── Normal layout ──────────────────────────────────────────────────────────
  return (
    <div
      ref={containerRef}
      className="h-screen overflow-hidden bg-gray-900 text-white flex flex-col items-center justify-center gap-6 px-4 py-6"
    >
      <AlarmIndicator alarmFired={state.alarmFired} dispatch={dispatch} />

      <Toolbar
        isFullscreen={isFullscreen}
        isPipSupported={isPipSupported}
        isPipActive={isPipActive}
        alarmEnabled={state.alarmEnabled}
        onFullscreen={handleFullscreen}
        onPip={handlePip}
        onToggleAlarm={() => dispatch({ type: 'TOGGLE_ALARM' })}
      />

      <TimerDisplay
        totalSeconds={state.totalSeconds}
        alarmFired={state.alarmFired}
      />

      <TimerControls status={state.status} dispatch={dispatch} />

      <TimeInput status={state.status} dispatch={dispatch} />

      <PresetPanel
        slots={slots}
        dispatch={dispatch}
        onSave={saveSlot}
        onClear={clearSlot}
      />
    </div>
  )
}

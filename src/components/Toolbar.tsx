interface Props {
  isFullscreen: boolean
  isPipSupported: boolean
  isPipActive: boolean
  alarmEnabled: boolean
  onFullscreen: () => void
  onPip: () => void
  onToggleAlarm: () => void
}

function IconFullscreen({ active }: { active: boolean }) {
  return active ? (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-5 h-5">
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 9V4.5M9 9H4.5M9 9 3.75 3.75M9 15v4.5M9 15H4.5M9 15l-5.25 5.25M15 9h4.5M15 9V4.5M15 9l5.25-5.25M15 15h4.5M15 15v4.5m0-4.5 5.25 5.25" />
    </svg>
  ) : (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-5 h-5">
      <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 3.75v4.5m0-4.5h4.5m-4.5 0L9 9M3.75 20.25v-4.5m0 4.5h4.5m-4.5 0L9 15M20.25 3.75h-4.5m4.5 0v4.5m0-4.5L15 9m5.25 11.25h-4.5m4.5 0v-4.5m0 4.5L15 15" />
    </svg>
  )
}

function IconPip() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-5 h-5">
      <rect x="2" y="3" width="20" height="14" rx="2" />
      <rect x="13" y="10" width="8" height="6" rx="1" fill="currentColor" stroke="none" />
    </svg>
  )
}

function IconBell({ enabled }: { enabled: boolean }) {
  return enabled ? (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-5 h-5">
      <path strokeLinecap="round" strokeLinejoin="round" d="M14.857 17.082a23.848 23.848 0 0 0 5.454-1.31A8.967 8.967 0 0 1 18 9.75V9A6 6 0 0 0 6 9v.75a8.967 8.967 0 0 1-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 0 1-5.714 0m5.714 0a3 3 0 1 1-5.714 0" />
    </svg>
  ) : (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-5 h-5 opacity-40">
      <path strokeLinecap="round" strokeLinejoin="round" d="M9.143 17.082a24.248 24.248 0 0 0 3.844.148m-3.844-.148a23.856 23.856 0 0 1-5.455-1.31 8.964 8.964 0 0 0 2.3-5.542m3.155 6.852a3 3 0 0 0 5.667 1.97m1.965-2.277L21 21m-4.225-4.225a23.81 23.81 0 0 0 .225-2.277m0 0A8.935 8.935 0 0 0 18 9.75V9A6 6 0 0 0 6.53 6.53m10.245 10.245L6.53 6.53M3 3l3.53 3.53" />
    </svg>
  )
}

export default function Toolbar({
  isFullscreen,
  isPipSupported,
  isPipActive,
  alarmEnabled,
  onFullscreen,
  onPip,
  onToggleAlarm,
}: Props) {
  const btnCls =
    'p-2 rounded-lg text-gray-400 hover:text-white hover:bg-gray-700 transition-all active:scale-95'

  return (
    <div className="flex items-center gap-1 justify-center">
      <button onClick={onToggleAlarm} className={btnCls} title={alarmEnabled ? '알람 켜짐' : '알람 꺼짐'}>
        <IconBell enabled={alarmEnabled} />
      </button>
      {isPipSupported && (
        <button
          onClick={onPip}
          className={`${btnCls} ${isPipActive ? 'text-indigo-400' : ''}`}
          title={isPipActive ? 'PiP 종료' : 'PiP 모드'}
        >
          <IconPip />
        </button>
      )}
      <button onClick={onFullscreen} className={btnCls} title={isFullscreen ? '전체화면 종료' : '전체화면'}>
        <IconFullscreen active={isFullscreen} />
      </button>
    </div>
  )
}

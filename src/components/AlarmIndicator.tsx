import { useEffect } from "react";
import type { TimerAction } from "../types/timer";
import { useAlarm } from "../hooks/useAlarm";

interface Props {
  alarmFired: boolean;
  dispatch: React.Dispatch<TimerAction>;
}

export default function AlarmIndicator({ alarmFired, dispatch }: Props) {
  const { playAlarm } = useAlarm();

  useEffect(() => {
    if (alarmFired) playAlarm();
  }, [alarmFired, playAlarm]);

  if (!alarmFired) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-red-950/95" />
      <button
        onClick={() => dispatch({ type: "RESET" })}
        className="relative z-10 pointer-events-auto px-12 py-6 bg-red-600 hover:bg-red-500 text-white text-3xl font-bold rounded-2xl shadow-2xl transition-all active:scale-95 animate-pulse"
      >
        시간 종료!
      </button>
    </div>
  );
}

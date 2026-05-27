import { useState } from 'react'
import type { TimerAction } from '../types/timer'
import type { PresetSlot } from '../hooks/usePresets'
import { formatTime } from '../utils/time'

interface Props {
  slots: (PresetSlot | null)[]
  dispatch: React.Dispatch<TimerAction>
  onSave: (index: number, label: string, seconds: number) => void
  onClear: (index: number) => void
}

function clamp(v: number, min: number, max: number) {
  return Math.max(min, Math.min(max, v))
}

interface EditState {
  label: string
  h: number
  m: number
  s: number
}

const numCls =
  'w-9 text-center bg-gray-900 border border-gray-700 rounded px-1 py-0.5 text-white text-xs font-mono focus:outline-none focus:border-indigo-500'

export default function PresetPanel({ slots, dispatch, onSave, onClear }: Props) {
  const [editingIndex, setEditingIndex] = useState<number | null>(null)
  const [edit, setEdit] = useState<EditState>({ label: '', h: 0, m: 5, s: 0 })

  function startEdit(index: number) {
    const slot = slots[index]
    if (slot) {
      setEdit({
        label: slot.label,
        h: Math.floor(slot.seconds / 3600),
        m: Math.floor((slot.seconds % 3600) / 60),
        s: slot.seconds % 60,
      })
    } else {
      setEdit({ label: '', h: 0, m: 5, s: 0 })
    }
    setEditingIndex(index)
  }

  function cancelEdit() {
    setEditingIndex(null)
  }

  function confirmEdit(index: number) {
    const trimmed = edit.label.trim()
    const total = edit.h * 3600 + edit.m * 60 + edit.s
    if (!trimmed || total <= 0) return
    onSave(index, trimmed, total)
    setEditingIndex(null)
  }

  return (
    <div className="w-full max-w-sm">
      <span className="text-gray-500 text-xs font-medium uppercase tracking-wider mb-1 block">
        프리셋
      </span>
      <div className="rounded-xl overflow-hidden border border-gray-800">
        {slots.map((slot, i) => {
          const isEditing = editingIndex === i

          return (
            <div
              key={i}
              className={`h-11 flex items-center gap-2 px-3 ${
                i < slots.length - 1 ? 'border-b border-gray-800' : ''
              } ${!isEditing && slot ? 'hover:bg-gray-800 cursor-pointer' : ''}`}
            >
              {/* Slot number */}
              <span className="text-gray-600 text-xs w-3 flex-shrink-0">{i + 1}</span>

              {isEditing ? (
                <>
                  <input
                    autoFocus
                    type="text"
                    placeholder="이름"
                    value={edit.label}
                    onChange={(e) => setEdit((s) => ({ ...s, label: e.target.value }))}
                    onKeyDown={(e) => e.key === 'Enter' && confirmEdit(i)}
                    className="flex-1 min-w-0 bg-gray-900 border border-gray-700 rounded px-2 py-0.5 text-white text-xs focus:outline-none focus:border-indigo-500 placeholder-gray-600"
                  />
                  <input
                    type="number" min={0} max={99} value={edit.h}
                    onChange={(e) => setEdit((s) => ({ ...s, h: clamp(parseInt(e.target.value) || 0, 0, 99) }))}
                    className={numCls}
                  />
                  <span className="text-gray-600 text-xs">:</span>
                  <input
                    type="number" min={0} max={59} value={edit.m}
                    onChange={(e) => setEdit((s) => ({ ...s, m: clamp(parseInt(e.target.value) || 0, 0, 59) }))}
                    className={numCls}
                  />
                  <span className="text-gray-600 text-xs">:</span>
                  <input
                    type="number" min={0} max={59} value={edit.s}
                    onChange={(e) => setEdit((s) => ({ ...s, s: clamp(parseInt(e.target.value) || 0, 0, 59) }))}
                    className={numCls}
                  />
                  <button
                    onClick={() => confirmEdit(i)}
                    disabled={!edit.label.trim() || edit.h * 3600 + edit.m * 60 + edit.s <= 0}
                    className="text-indigo-400 hover:text-indigo-300 disabled:opacity-30 text-sm px-1 transition-colors"
                    title="저장"
                  >
                    ✓
                  </button>
                  <button
                    onClick={cancelEdit}
                    className="text-gray-600 hover:text-gray-300 text-xs px-1 transition-colors"
                    title="취소"
                  >
                    ✕
                  </button>
                </>
              ) : slot ? (
                <>
                  <button
                    className="flex-1 min-w-0 flex items-baseline gap-2 text-left"
                    onClick={() => dispatch({ type: 'SET_TIME', seconds: slot.seconds })}
                  >
                    <span className="text-gray-200 text-sm font-medium truncate">{slot.label}</span>
                    <span className="text-gray-500 text-xs font-mono flex-shrink-0">{formatTime(slot.seconds)}</span>
                  </button>
                  <button
                    onClick={() => startEdit(i)}
                    className="text-gray-600 hover:text-gray-300 text-xs px-1 transition-colors flex-shrink-0"
                    title="편집"
                  >
                    ✎
                  </button>
                  <button
                    onClick={() => onClear(i)}
                    className="text-gray-700 hover:text-red-400 text-xs px-1 transition-colors flex-shrink-0"
                    title="삭제"
                  >
                    ✕
                  </button>
                </>
              ) : (
                <button
                  className="flex-1 text-left text-gray-700 text-xs hover:text-gray-500 transition-colors"
                  onClick={() => startEdit(i)}
                >
                  — 비어있음 —
                </button>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}

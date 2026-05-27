import { useState, useCallback } from 'react'

export interface PresetSlot {
  label: string
  seconds: number
}

const SLOTS = 5
const KEY = 'timer-presets'

function load(): (PresetSlot | null)[] {
  try {
    const raw = localStorage.getItem(KEY)
    if (!raw) return Array(SLOTS).fill(null)
    const parsed = JSON.parse(raw) as unknown[]
    // ensure exactly SLOTS entries
    const slots: (PresetSlot | null)[] = Array(SLOTS).fill(null)
    parsed.slice(0, SLOTS).forEach((p, i) => {
      if (p && typeof p === 'object' && 'label' in p && 'seconds' in p) {
        slots[i] = { label: (p as PresetSlot).label, seconds: (p as PresetSlot).seconds }
      }
    })
    return slots
  } catch {
    return Array(SLOTS).fill(null)
  }
}

export function usePresets() {
  const [slots, setSlots] = useState<(PresetSlot | null)[]>(load)

  const saveSlot = useCallback((index: number, label: string, seconds: number) => {
    setSlots((prev) => {
      const next = [...prev]
      next[index] = { label, seconds }
      localStorage.setItem(KEY, JSON.stringify(next))
      return next
    })
  }, [])

  const clearSlot = useCallback((index: number) => {
    setSlots((prev) => {
      const next = [...prev]
      next[index] = null
      localStorage.setItem(KEY, JSON.stringify(next))
      return next
    })
  }, [])

  return { slots, saveSlot, clearSlot }
}

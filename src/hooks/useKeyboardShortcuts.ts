import { useEffect, useRef } from 'react'
import { KEYBOARD_SHORTCUTS } from '../config/keyboardShortcuts'

export interface ShortcutHandlers {
  onStartPause: () => void
  onReset: () => void
  onPreset: (index: number) => void
  onFullscreen: () => void
}

export function useKeyboardShortcuts(handlers: ShortcutHandlers): void {
  // Stable ref so the keydown listener never needs to be re-registered
  const handlersRef = useRef(handlers)
  handlersRef.current = handlers

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      // Skip when typing in any input or textarea
      const target = e.target as HTMLElement
      if (target instanceof HTMLInputElement || target instanceof HTMLTextAreaElement) return

      const key = e.key
      const h = handlersRef.current

      if ((KEYBOARD_SHORTCUTS.startPause as readonly string[]).includes(key)) {
        e.preventDefault()
        h.onStartPause()
      } else if ((KEYBOARD_SHORTCUTS.reset as readonly string[]).includes(key)) {
        h.onReset()
      } else if ((KEYBOARD_SHORTCUTS.presets as readonly string[]).includes(key)) {
        h.onPreset(Number(key) - 1)
      } else if ((KEYBOARD_SHORTCUTS.fullscreen as readonly string[]).includes(key)) {
        e.preventDefault()
        h.onFullscreen()
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, []) // empty — listener registered once, handlers accessed via ref
}

import { useCallback, useEffect, useState } from 'react'

export function useFullscreen(targetRef: React.RefObject<HTMLElement | null>) {
  const [isFullscreen, setIsFullscreen] = useState(false)

  const enter = useCallback(async () => {
    const el = targetRef.current
    if (!el) return
    if ('requestFullscreen' in el) {
      await el.requestFullscreen()
    } else if ('webkitRequestFullscreen' in el) {
      ;(el as HTMLElement & { webkitRequestFullscreen(): Promise<void> }).webkitRequestFullscreen()
    }
  }, [targetRef])

  const exit = useCallback(async () => {
    if (document.fullscreenElement) {
      await document.exitFullscreen()
    }
  }, [])

  useEffect(() => {
    const handler = () => setIsFullscreen(!!document.fullscreenElement)
    document.addEventListener('fullscreenchange', handler)
    document.addEventListener('webkitfullscreenchange', handler)
    return () => {
      document.removeEventListener('fullscreenchange', handler)
      document.removeEventListener('webkitfullscreenchange', handler)
    }
  }, [])

  return { isFullscreen, enter, exit }
}

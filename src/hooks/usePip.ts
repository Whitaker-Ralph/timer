import { useRef, useCallback, useState } from 'react'

export function usePip() {
  const videoRef = useRef<HTMLVideoElement | null>(null)
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const intervalRef = useRef<number | null>(null)
  const getLabelRef = useRef<() => string>(() => '')
  const alarmFiredRef = useRef(false)
  const [isPipActive, setIsPipActive] = useState(false)

  const updateLabel = useCallback((getter: () => string) => {
    getLabelRef.current = getter
  }, [])

  const updateAlarm = useCallback((fired: boolean) => {
    alarmFiredRef.current = fired
  }, [])

  const cleanup = useCallback(() => {
    if (intervalRef.current !== null) {
      clearInterval(intervalRef.current)
      intervalRef.current = null
    }
    if (videoRef.current?.parentNode) {
      videoRef.current.parentNode.removeChild(videoRef.current)
    }
    if (canvasRef.current?.parentNode) {
      canvasRef.current.parentNode.removeChild(canvasRef.current)
    }
    videoRef.current = null
    canvasRef.current = null
    setIsPipActive(false)
  }, [])

  const startPip = useCallback(async () => {
    const canvas = document.createElement('canvas')
    canvas.width = 400
    canvas.height = 150
    // Must be in DOM for captureStream to work reliably in all browsers
    canvas.style.cssText = 'position:fixed;width:1px;height:1px;opacity:0;pointer-events:none;top:0;left:0'
    document.body.appendChild(canvas)
    canvasRef.current = canvas

    const draw = () => {
      const ctx = canvas.getContext('2d')
      if (!ctx) return
      const alarm = alarmFiredRef.current
      ctx.fillStyle = alarm ? '#7f1d1d' : '#111827'
      ctx.fillRect(0, 0, canvas.width, canvas.height)
      ctx.fillStyle = alarm ? '#fca5a5' : '#f9fafb'
      ctx.font = 'bold 72px monospace'
      ctx.textAlign = 'center'
      ctx.textBaseline = 'middle'
      if (alarm) {
        ctx.fillText('시간 종료!', canvas.width / 2, canvas.height / 2)
      } else {
        ctx.fillText(getLabelRef.current(), canvas.width / 2, canvas.height / 2)
      }
    }

    // Draw first frame before capturing stream so video has content immediately
    draw()

    const stream = canvas.captureStream(2)
    const video = document.createElement('video')
    video.srcObject = stream
    video.muted = true
    // Must be in DOM for requestPictureInPicture to work in all browsers
    video.style.cssText = 'position:fixed;width:1px;height:1px;opacity:0;pointer-events:none;top:0;left:0'
    document.body.appendChild(video)
    videoRef.current = video

    video.addEventListener('leavepictureinpicture', cleanup, { once: true })

    // Wait for canplay before requesting PiP — more reliable than play()
    await new Promise<void>((resolve) => {
      video.addEventListener('canplay', () => resolve(), { once: true })
      video.play().catch(() => resolve()) // fallback if canplay never fires
    })

    draw()
    intervalRef.current = window.setInterval(draw, 500)

    try {
      await video.requestPictureInPicture()
      setIsPipActive(true)
    } catch (err) {
      console.error('PiP failed:', err)
      cleanup()
    }
  }, [cleanup])

  const stopPip = useCallback(async () => {
    if (intervalRef.current !== null) {
      clearInterval(intervalRef.current)
      intervalRef.current = null
    }
    try {
      if (document.pictureInPictureElement) {
        await document.exitPictureInPicture()
      }
    } catch {
      // ignore
    }
    cleanup()
  }, [cleanup])

  const isPipSupported =
    typeof document !== 'undefined' && document.pictureInPictureEnabled === true

  return { startPip, stopPip, updateLabel, updateAlarm, isPipActive, isPipSupported }
}

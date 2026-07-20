import { useEffect, useRef, useState } from 'react'

const INTERACTIVE_SELECTOR = 'a, button, [role="button"], input, textarea, select, summary'
const NATIVE_CURSOR_SELECTOR = 'input, textarea, select, [contenteditable="true"]'

export function CustomCursor() {
  const dotRef = useRef<HTMLDivElement | null>(null)
  const ringRef = useRef<HTMLDivElement | null>(null)
  const [enabled, setEnabled] = useState(false)

  useEffect(() => {
    const canUseCursor =
      window.matchMedia('(hover: hover) and (pointer: fine)').matches &&
      !window.matchMedia('(prefers-reduced-motion: reduce)').matches

    if (!canUseCursor) return

    setEnabled(true)

    let frame = 0
    let visible = false
    const target = { x: window.innerWidth / 2, y: window.innerHeight / 2 }
    const ring = { x: target.x, y: target.y }

    const setVisible = (nextVisible: boolean) => {
      visible = nextVisible
      dotRef.current?.classList.toggle('is-visible', visible)
      ringRef.current?.classList.toggle('is-visible', visible)
    }

    const animate = () => {
      ring.x += (target.x - ring.x) * 0.18
      ring.y += (target.y - ring.y) * 0.18

      if (dotRef.current) {
        dotRef.current.style.transform = `translate3d(${target.x}px, ${target.y}px, 0)`
      }
      if (ringRef.current) {
        ringRef.current.style.transform = `translate3d(${ring.x}px, ${ring.y}px, 0)`
      }

      frame = window.requestAnimationFrame(animate)
    }

    const handleMove = (event: PointerEvent) => {
      target.x = event.clientX
      target.y = event.clientY
      if (!visible) setVisible(true)

      const targetElement = event.target instanceof Element ? event.target : null
      const isNative = Boolean(targetElement?.closest(NATIVE_CURSOR_SELECTOR))
      const isInteractive = Boolean(targetElement?.closest(INTERACTIVE_SELECTOR))

      document.documentElement.classList.toggle('tg-custom-cursor-active', !isNative)
      ringRef.current?.classList.toggle('is-interactive', isInteractive && !isNative)
      dotRef.current?.classList.toggle('is-interactive', isInteractive && !isNative)
    }

    const handleDown = () => {
      ringRef.current?.classList.add('is-pressed')
    }
    const handleUp = () => {
      ringRef.current?.classList.remove('is-pressed')
    }
    const handleLeave = () => setVisible(false)
    const handleEnter = () => setVisible(true)

    frame = window.requestAnimationFrame(animate)
    window.addEventListener('pointermove', handleMove, { passive: true })
    window.addEventListener('pointerdown', handleDown, { passive: true })
    window.addEventListener('pointerup', handleUp, { passive: true })
    document.addEventListener('mouseleave', handleLeave)
    document.addEventListener('mouseenter', handleEnter)

    return () => {
      window.cancelAnimationFrame(frame)
      window.removeEventListener('pointermove', handleMove)
      window.removeEventListener('pointerdown', handleDown)
      window.removeEventListener('pointerup', handleUp)
      document.removeEventListener('mouseleave', handleLeave)
      document.removeEventListener('mouseenter', handleEnter)
      document.documentElement.classList.remove('tg-custom-cursor-active')
    }
  }, [])

  if (!enabled) return null

  return (
    <>
      <div ref={dotRef} className="tg-cursor-dot" aria-hidden="true" />
      <div ref={ringRef} className="tg-cursor-ring" aria-hidden="true" />
    </>
  )
}

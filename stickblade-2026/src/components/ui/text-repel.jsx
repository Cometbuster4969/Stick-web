// Fork of watermelon text-repel — backdrop letters flee the cursor.
import { useEffect, useRef, useState } from 'react'

export function TextRepel({ text = '', radius = 220, strength = 80, className = '', letterClassName = '' }) {
  const ref = useRef(null)
  const chars = String(text).split('')
  const [offsets, setOffsets] = useState(() => chars.map(() => ({ x: 0, y: 0 })))

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const cur = chars.map(() => ({ x: 0, y: 0 }))
    const target = chars.map(() => ({ x: 0, y: 0 }))
    let raf = 0
    const onMove = (e) => {
      const spans = el.querySelectorAll('[data-l]')
      spans.forEach((sp, i) => {
        const r = sp.getBoundingClientRect()
        const dx = r.left + r.width / 2 - e.clientX
        const dy = r.top + r.height / 2 - e.clientY
        const d = Math.hypot(dx, dy)
        if (d < radius && d > 0.01) {
          const f = (1 - d / radius) * strength
          target[i] = { x: (dx / d) * f, y: (dy / d) * f }
        } else {
          target[i] = { x: 0, y: 0 }
        }
      })
    }
    const tick = () => {
      cur.forEach((c, i) => {
        c.x += (target[i].x - c.x) * 0.16
        c.y += (target[i].y - c.y) * 0.16
      })
      setOffsets(cur.map((c) => ({ x: c.x, y: c.y })))
      raf = requestAnimationFrame(tick)
    }
    window.addEventListener('mousemove', onMove, { passive: true })
    raf = requestAnimationFrame(tick)
    return () => {
      window.removeEventListener('mousemove', onMove)
      cancelAnimationFrame(raf)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [text, radius, strength])

  return (
    <span ref={ref} className={`inline-block ${className}`}>
      {chars.map((c, i) => (
        <span
          key={i}
          data-l
          className={`inline-block will-change-transform ${letterClassName}`}
          style={{ transform: `translate(${offsets[i]?.x ?? 0}px, ${offsets[i]?.y ?? 0}px)` }}
        >
          {c === ' ' ? ' ' : c}
        </span>
      ))}
    </span>
  )
}

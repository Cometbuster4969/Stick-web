// Fork of componentry scroll-based-velocity — marquee rows that speed up
// and flip direction with scroll velocity. `direction` mirrors a row so two
// rows can counter-scroll against each other.
import { useRef } from 'react'
import {
  motion,
  useAnimationFrame,
  useMotionValue,
  useScroll,
  useSpring,
  useTransform,
  useVelocity,
  wrap,
} from 'framer-motion'

export function ScrollBasedVelocity({ text = '', default_velocity = 0.12, direction = 1, className = '' }) {
  const baseX = useMotionValue(0)
  const { scrollY } = useScroll()
  const scrollVelocity = useVelocity(scrollY)
  const smooth = useSpring(scrollVelocity, { damping: 50, stiffness: 400 })
  const velocityFactor = useTransform(smooth, [0, 1000], [0, 2], { clamp: false })
  const x = useTransform(baseX, (v) => `${wrap(-25, 0, v)}%`)
  const dir = useRef(direction)

  useAnimationFrame((_, delta) => {
    const d = Math.min(delta, 64)
    const vf = velocityFactor.get()
    if (vf < -0.15) dir.current = -1 * direction
    else if (vf > 0.15) dir.current = 1 * direction
    let move = dir.current * default_velocity * (d / 100)
    move += dir.current * move * Math.min(Math.abs(vf), 2)
    baseX.set(baseX.get() + move)
  })

  return (
    <motion.div style={{ x }} className={`flex w-max whitespace-nowrap ${className}`}>
      {[0, 1, 2, 3].map((i) => (
        <span key={i} className="shrink-0 pr-[0.35em]">
          {text}
        </span>
      ))}
    </motion.div>
  )
}

// Inspired by Cult UI's animated-number (cult-ui.com) — spring-physics counting.
// Fork: framer-motion instead of motion/react (same engine lineage, zero new deps).
import { useEffect } from 'react'
import { motion, useSpring, useTransform } from 'framer-motion'

export function AnimatedNumber({
  value,
  mass = 0.8,
  stiffness = 75,
  damping = 15,
  precision = 0,
  format = (num) => num.toLocaleString(),
  onAnimationStart,
  onAnimationComplete,
  className = '',
}) {
  const spring = useSpring(value, { mass, stiffness, damping })
  const display = useTransform(spring, (current) => format(parseFloat(current.toFixed(precision))))

  useEffect(() => {
    spring.set(value)
    if (onAnimationStart) onAnimationStart()
    const unsubscribe = spring.on('change', () => {
      if (spring.get() === value && onAnimationComplete) onAnimationComplete()
    })
    return () => unsubscribe()
  }, [spring, value, onAnimationStart, onAnimationComplete])

  return <motion.span className={className}>{display}</motion.span>
}
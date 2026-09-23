// Fork of watermelon kinetic-text-reveal — masked segment rise for the H1.
import { motion } from 'framer-motion'

export function KineticTextReveal({
  text = '',
  splitBy = 'words',
  direction = 'up',
  stagger = 0.1,
  delay = 0,
  className = '',
  segmentClassName = '',
}) {
  const segs = splitBy === 'chars' ? text.split('') : text.split(' ')
  const y = direction === 'up' ? '112%' : '-112%'
  return (
    <span className={className}>
      {segs.map((s, i) => (
        <span key={i} className="-mb-[0.1em] inline-block overflow-hidden pb-[0.1em] align-bottom">
          <motion.span
            className={`inline-block will-change-transform ${segmentClassName}`}
            initial={{ y }}
            animate={{ y: '0%' }}
            transition={{ delay: delay + i * stagger, duration: 0.75, ease: [0.22, 1, 0.36, 1] }}
          >
            {s === ' ' ? ' ' : s}
            {splitBy === 'words' ? ' ' : ''}
          </motion.span>
        </span>
      ))}
    </span>
  )
}

// Fork of skiper-ui skiper99 (animated icons: arrow / menu / volume).
// Fork: icons accept controlled props (open/muted) so they can't desync
// from menu/mute state. Visual-only — parents own the click handlers.
import { motion, AnimatePresence } from 'framer-motion'

export function ArrowIcon({ className = '' }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} width="100%" height="100%" aria-hidden>
      <motion.path
        d="M7 17 L17 7 M8 7 h9 v9"
        initial={{ pathLength: 0.6, opacity: 0.6 }}
        whileHover={{ pathLength: 1, opacity: 1 }}
      />
    </svg>
  )
}

export function MenuIcon({ open = false }) {
  return (
    <span className="relative block h-full w-full" aria-hidden>
      <motion.span
        className="absolute left-0 right-0 top-[3px] h-[2px] rounded-full bg-current"
        animate={open ? { top: '50%', rotate: 45, y: '-50%' } : { top: 3, rotate: 0, y: 0 }}
        transition={{ type: 'spring', stiffness: 400, damping: 28 }}
      />
      <motion.span
        className="absolute left-0 right-0 top-1/2 h-[2px] -translate-y-1/2 rounded-full bg-current"
        animate={open ? { opacity: 0, scaleX: 0.2 } : { opacity: 1, scaleX: 1 }}
        transition={{ duration: 0.18 }}
      />
      <motion.span
        className="absolute bottom-[3px] left-0 right-0 h-[2px] rounded-full bg-current"
        animate={open ? { bottom: '50%', rotate: -45, y: '50%' } : { bottom: 3, rotate: 0, y: 0 }}
        transition={{ type: 'spring', stiffness: 400, damping: 28 }}
      />
    </span>
  )
}

export function VolumeIcon({ muted = false }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="100%" height="100%" aria-hidden>
      <path d="M11 5 6 9H2v6h4l5 4V5z" fill="currentColor" stroke="none" />
      <AnimatePresence initial={false}>
        {muted ? (
          <motion.g key="x" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <line x1="16" y1="9" x2="22" y2="15" />
            <line x1="22" y1="9" x2="16" y2="15" />
          </motion.g>
        ) : (
          <motion.g key="w" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <path d="M15.5 8.5a5 5 0 0 1 0 7" />
            <path d="M18.4 5.6a9 9 0 0 1 0 12.8" />
          </motion.g>
        )}
      </AnimatePresence>
    </svg>
  )
}

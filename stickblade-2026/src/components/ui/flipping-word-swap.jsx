// Fork of watermelon flipping-word-swap — inline word flip in hero copy.
import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

export function FlippingWordSwap({ word1 = '', word2 = '', className = '', toClassName = '', interval = 2600 }) {
  const [flip, setFlip] = useState(false)
  useEffect(() => {
    const id = setInterval(() => setFlip((f) => !f), interval)
    return () => clearInterval(id)
  }, [interval])
  return (
    <span className={`relative inline-block overflow-hidden pb-[0.12em] -mb-[0.12em] align-bottom ${className}`}>
      <AnimatePresence mode="wait" initial={false}>
        <motion.span
          key={flip ? 'b' : 'a'}
          initial={{ y: '105%', rotateX: -75, opacity: 0 }}
          animate={{ y: '0%', rotateX: 0, opacity: 1 }}
          exit={{ y: '-105%', rotateX: 75, opacity: 0 }}
          transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
          className={`inline-block ${flip ? toClassName : ''}`}
          style={{ transformPerspective: 400 }}
        >
          {flip ? word2 : word1}
        </motion.span>
      </AnimatePresence>
    </span>
  )
}

// Ember fork of magicui text-reveal — sticky scroll-linked word reveal.
// The final word ignites ember as the manifesto completes.
import { useRef } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'

function Word({ progress, range, word, ember }) {
  const opacity = useTransform(progress, range, [0.13, 1])
  const color = useTransform(progress, range, ['#57503f', ember ? '#ff5a1f' : '#ece7dc'])
  return (
    <motion.span style={{ opacity, color }} className="mr-[0.28em] inline-block">
      {word}
    </motion.span>
  )
}

export function TextReveal({ children, className = '' }) {
  const words = String(children ?? '').split(' ')
  const ref = useRef(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start 0.85', 'end 0.45'] })
  return (
    <div ref={ref} className={`relative ${className}`}>
      <div className="sticky top-0 flex min-h-[70vh] items-center justify-center px-5 py-24">
        <p className="max-w-4xl text-center font-display text-3xl font-bold leading-[1.25] tracking-tight md:text-5xl">
          {words.map((w, i) => (
            <Word
              key={i}
              progress={scrollYProgress}
              range={[i / words.length, (i + 1) / words.length]}
              word={w}
              ember={i === words.length - 1}
            />
          ))}
        </p>
      </div>
    </div>
  )
}

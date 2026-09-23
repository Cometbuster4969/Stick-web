import { useRef, useState } from 'react'
import { motion, useMotionValueEvent, useScroll, useTransform } from 'framer-motion'
import { Reveal } from './ui'

const CARDS = [
  { id: 'normal', image: '/arena-cards/normal.svg', alt: 'Normal arena — the control condition' },
  { id: 'ice', image: '/arena-cards/ice.svg', alt: 'Ice arena — friction goes on vacation' },
  { id: 'lowg', image: '/arena-cards/lowg.svg', alt: 'Low-gravity arena — ballistics priors shatter' },
  { id: 'forge', image: '/arena-cards/forge.svg', alt: 'Forge your own arena — open source' },
]

// One card in the stack. Entrance + exit are scrub-linked to runway progress:
// card i slides up during window [(i-1)/(n-1), i/(n-1)] while card i-1
// shrinks + tilts away. Pure sticky + transforms — no pin, no spacer math,
// so overlapping the next section is structurally impossible.
function StackCard({ card, i, total, progress }) {
  const segs = total - 1
  const y = useTransform(
    progress,
    i === 0 ? [0, 1] : [(i - 1) / segs, i / segs],
    i === 0 ? ['0%', '0%'] : ['100%', '0%']
  )
  const range = [i / segs, Math.min(1, (i + 1) / segs)]
  const scale = useTransform(progress, range, i === total - 1 ? [1, 1] : [1, 0.7])
  const rotate = useTransform(progress, range, i === total - 1 ? [0, 0] : [0, 5])
  return (
    <motion.img
      src={card.image}
      alt={card.alt}
      style={{ y, scale, rotate, zIndex: i }}
      className="absolute inset-0 h-full w-full object-cover"
      draggable={false}
    />
  )
}

export default function ArenaStack() {
  const runway = useRef(null)
  const { scrollYProgress } = useScroll({ target: runway, offset: ['start start', 'end end'] })
  const [active, setActive] = useState(0)
  useMotionValueEvent(scrollYProgress, 'change', (v) =>
    setActive(Math.min(CARDS.length - 1, Math.floor(v * CARDS.length)))
  )
  return (
    <section id="arena-stack" className="relative scroll-mt-20">
      <div className="max-w-7xl mx-auto px-5 md:px-8 pt-20 md:pt-28 pb-8">
        <Reveal>
          <span className="font-mono text-[11px] md:text-xs font-bold tracking-[0.3em] uppercase text-ember">The gauntlet</span>
        </Reveal>
        <Reveal delay={0.08}>
          <h2 className="font-display font-bold tracking-tight text-3xl md:text-5xl mt-3 leading-[1.08]">Three arenas. One stack.</h2>
        </Reveal>
        <Reveal delay={0.16}>
          <p className="text-muted text-base md:text-lg mt-4 max-w-3xl leading-relaxed">Keep scrolling — the stack pins and each arena rotates through. Same fighters, different physics.</p>
        </Reveal>
      </div>
      <div ref={runway} className="relative h-[400svh]">
        <div className="sticky top-0 flex h-[100svh] items-center justify-center overflow-hidden p-3 lg:p-8">
          <div className="relative h-[90%] w-full max-w-sm overflow-hidden rounded-lg border border-white/12 shadow-[0_30px_90px_rgba(0,0,0,0.6)] sm:max-w-md md:max-w-lg lg:max-w-xl xl:max-w-2xl 2xl:max-w-3xl">
            {CARDS.map((card, i) => (
              <StackCard key={card.id} card={card} i={i} total={CARDS.length} progress={scrollYProgress} />
            ))}
          </div>
          <div className="absolute bottom-7 left-1/2 -translate-x-1/2 flex items-center gap-2 pointer-events-none" aria-hidden>
            {CARDS.map((c, i) => (
              <span
                key={c.id}
                className={`h-1.5 rounded-full transition-all duration-300 ${i === active ? 'w-7 bg-ember' : 'w-1.5 bg-white/20'}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
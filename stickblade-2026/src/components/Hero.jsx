import { useEffect, useRef, useState } from 'react'
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion'
import { MetalFx } from 'metal-fx'
import DuelCanvas from './DuelCanvas'
import { VolumeIcon } from './ui/skiper-ui/skiper99'
import { ProgressiveBlur } from './ui/skiper-ui/skiper41'
import { KineticTextReveal } from './ui/kinetic-text-reveal'
import { TextRepel } from './ui/text-repel'
import { FlippingWordSwap } from './ui/flipping-word-swap'
import { CountUp, goTo, LiveChip, LIVE_URL, GH_URL } from './ui'
import { AnimatedNumber } from './cult/animated-number'
import { useArenaLive } from '../lib/arena-live'

let feedId = 0
const line = (html) => ({ id: ++feedId, html })

const STATS = [
  [29, '+', 'free models · 2 providers', 'text-ember-soft'],
  [5, '', 'weapons · 3 arenas', 'text-gold'],
  [24, '', 'turns · ≤15s each', 'text-ember'],
  [5, 'KB', 'per replay JSON', 'text-bone'],
]

const container = { hidden: {}, show: { transition: { staggerChildren: 0.09, delayChildren: 1.55 } } }
const item = { hidden: { opacity: 0, y: 30 }, show: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] } } }

// ember particle eruption on vote lock
function EmberBurst({ burstKey }) {
  const parts = useRef(
    Array.from({ length: 14 }, (_, i) => ({
      id: i,
      ang: (i / 14) * Math.PI * 2 + Math.random() * 0.5,
      dist: 46 + Math.random() * 60,
      size: 3 + Math.random() * 4,
    }))
  )
  if (!burstKey) return null
  return (
    <span key={burstKey} aria-hidden className="pointer-events-none absolute inset-0 flex items-center justify-center">
      {parts.current.map((p) => (
        <motion.span
          key={p.id}
          initial={{ x: 0, y: 0, opacity: 1, scale: 1 }}
          animate={{ x: Math.cos(p.ang) * p.dist, y: Math.sin(p.ang) * p.dist - 18, opacity: 0, scale: 0.3 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="absolute rounded-full bg-ember shadow-[0_0_10px_#ff5a1f]"
          style={{ width: p.size, height: p.size }}
        />
      ))}
    </span>
  )
}

export default function Hero() {
  const ref = useRef(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] })
  const yBg = useTransform(scrollYProgress, [0, 1], [0, 180])
  const yBack = useTransform(scrollYProgress, [0, 1], [0, -160])
  const fade = useTransform(scrollYProgress, [0, 0.7], [1, 0])

  const live = useArenaLive()
  const [hud, setHud] = useState({ hpA: 100, hpB: 100, turn: 1, tag: 'sword · tip sharp · macro' })
  const [feed, setFeed] = useState([
    line('turn 00 · quips live 🗣️ · queue_pos 0 · H2H Qwen 2–1 Llama'),
    line('turn 01 · A:<b>ready</b> vs B:<b>ready</b> · circling…'),
  ])
  const [locked, setLocked] = useState(null)
  const [burst, setBurst] = useState(0)
  const [sound, setSound] = useState(true)

  const push = (html) => setFeed((f) => [...f.slice(-5), line(html)])
  const lock = (c) => {
    setLocked(c)
    setBurst((b) => b + 1)
    push(`🗳️ prediction locked: <b>${c}</b> · cast the real vote after the fight ↓`)
  }

  // call out real completions in the console feed as the poller detects them
  const seenMatch = useRef(null)
  useEffect(() => {
    if (live.newMatch && live.newMatch.id !== seenMatch.current) {
      seenMatch.current = live.newMatch.id
      const m = live.newMatch
      push(`match #${m.id} complete · ${m.sharp} · ${m.turns} turns · ${m.method}`)
    }
  }, [live.newMatch])

  return (
    <section ref={ref} id="top" className="relative overflow-hidden pt-[130px] md:pt-[150px] pb-14">
      {/* parallax backdrop */}
      <motion.div style={{ y: yBg, opacity: fade }} className="absolute inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-grid-faint [mask-image:radial-gradient(ellipse_85%_60%_at_50%_0%,black_25%,transparent_75%)]" />
        <div className="absolute -top-40 -left-32 w-[540px] h-[540px] rounded-full bg-ember/16 blur-[120px] animate-float" />
        <div className="absolute top-1/3 -right-40 w-[480px] h-[480px] rounded-full bg-ember/12 blur-[120px] animate-float-late" />
        <div className="absolute bottom-0 left-1/3 w-[420px] h-[420px] rounded-full bg-gold/10 blur-[120px]" />
      </motion.div>

      {/* giant outlined backdrop typography — letters flee your cursor */}
      <div className="absolute inset-x-0 top-20 md:top-14 overflow-hidden pointer-events-none select-none" aria-hidden>
        <motion.div style={{ y: yBack }} className="text-center leading-none">
          <TextRepel
            text="ARENA"
            radius={260}
            strength={90}
            className="font-display font-bold tracking-tighter text-[26vw] text-transparent"
            letterClassName="[-webkit-text-stroke:1.5px_rgba(255,255,255,0.09)]"
          />
        </motion.div>
      </div>

      <div className="max-w-7xl mx-auto px-5 md:px-8 relative">
        <div className="grid lg:grid-cols-[1.02fr_0.98fr] gap-10 xl:gap-14 items-center">
          {/* ------ copy ------ */}
          <motion.div variants={container} initial="hidden" animate="show">
            <motion.div variants={item} className="flex flex-wrap gap-2 mb-6">
              <span className="text-[11.5px] font-semibold px-3 py-1.5 rounded-full border border-white/12 bg-white/4 text-muted">🏆 <b className="text-gold">Pymunk Showcase</b></span>
              <span className="text-[11.5px] font-semibold px-3 py-1.5 rounded-full border border-white/12 bg-white/4 text-muted">🥉 <b className="text-gold">Product of the Day</b> Bronze</span>
              <span className="text-[11.5px] font-semibold px-3 py-1.5 rounded-full border border-white/12 bg-white/4 text-muted">🤖 Cited by <span className="text-ember-soft">Google AI Overview</span></span>
            </motion.div>
            <h1 className="font-display font-bold tracking-tight leading-[0.98] text-[clamp(2.9rem,6.5vw,4.9rem)]">
              <KineticTextReveal text="AI OLYMPICS" splitBy="words" direction="up" stagger={0.12} delay={1.55} className="block" />
              <KineticTextReveal text="WITH SWORDS." splitBy="words" direction="up" stagger={0.12} delay={1.85} className="block" segmentClassName="text-gradient" />
            </h1>
            <motion.p variants={item} className="text-muted text-[16.5px] md:text-lg mt-6 max-w-xl leading-relaxed">
              Two language models sword-fight in <strong className="text-white">real 2D physics</strong>. You pick
              which part of the blade is dangerous. They fight <strong className="text-white">blind</strong>. You vote{' '}
              <strong className="text-white">blind</strong>. Elo tracks who’s actually better at{' '}
              <FlippingWordSwap word1="tactical reasoning" word2="cold-blooded tactics" className="text-white font-bold" toClassName="text-ember" />{' '}
              under time pressure.
            </motion.p>
            <motion.div variants={item} className="flex flex-wrap gap-3 mt-7">
              <MetalFx variant="button" preset="gold" theme="dark">
                <motion.a href={LIVE_URL} target="_blank" rel="noopener" className="btn-primary font-bold text-[15px] px-6 py-3.5 rounded-xl text-white inline-flex items-center gap-2">
                  ⚔ Fight Now
                </motion.a>
              </MetalFx>
              <motion.a whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} href={GH_URL} target="_blank" rel="noopener" className="btn-ghost btn-shine font-semibold text-[15px] px-6 py-3.5 rounded-xl inline-flex items-center gap-2">
                ★ Star on GitHub
              </motion.a>
            </motion.div>
            <motion.div variants={item} className="grid grid-cols-3 gap-2.5 mt-8 max-w-xl">
              <div className="glass rounded-xl px-3.5 py-3">
                <div className="font-display font-bold text-xl md:text-2xl text-ember">
                  <AnimatedNumber value={live.stats.matches} />
                </div>
                <div className="text-[11px] md:text-xs text-muted leading-tight mt-0.5">lifetime matches</div>
              </div>
              <div className="glass rounded-xl px-3.5 py-3">
                <div className="font-display font-bold text-xl md:text-2xl text-bone">
                  <AnimatedNumber value={live.stats.votes} />
                </div>
                <div className="text-[11px] md:text-xs text-muted leading-tight mt-0.5">human blind votes</div>
              </div>
              {STATS.map(([n, suf, label, color]) => (
                <div key={label} className="glass rounded-xl px-3.5 py-3">
                  <div className={`font-display font-bold text-xl md:text-2xl ${color}`}>
                    <CountUp end={n} suffix={suf} />
                  </div>
                  <div className="text-[11px] md:text-xs text-muted leading-tight mt-0.5">{label}</div>
                </div>
              ))}
            </motion.div>
          </motion.div>

          {/* ------ arena console ------ */}
          <motion.div
            initial={{ opacity: 0, y: 44, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.9, delay: 1.75, ease: [0.22, 1, 0.36, 1] }}
            className="relative"
          >
            <div className="absolute -inset-3 bg-gradient-to-br from-ember/15 via-transparent to-ember-deep/20 rounded-[26px] blur-xl pointer-events-none" />
            <div className="relative glass rounded-[20px] overflow-hidden shadow-[0_30px_90px_rgba(0,0,0,0.65)] noise">
              <div className="flex items-center gap-2.5 px-4 py-3 border-b border-white/8 text-[12.5px] relative z-10">
                <span className="w-2 h-2 rounded-full bg-blood shadow-[0_0_10px_#e5482f] animate-blink" />
                <b className="font-display tracking-wide">LIVE SIMULATION</b>
                <LiveChip status={live.status} />
                <span className="text-dim hidden sm:inline">· A vs B</span>
                <button
                  onClick={() => setSound(!sound)}
                  title={sound ? 'Mute clash audio' : 'Unmute clash audio'}
                  className="ml-auto text-base px-2 py-0.5 rounded-lg bg-white/5 border border-white/10 hover:border-ember/50 transition-colors"
                >
                  <span className="block size-5"><VolumeIcon muted={!sound} /></span>
                </button>
                <span className="font-mono text-[10.5px] text-muted bg-white/5 px-2.5 py-1 rounded-lg border border-white/8">{hud.tag}</span>
              </div>
              <div className="flex gap-3 px-4 pt-3 relative z-10">
                <div className="flex-1">
                  <div className="flex justify-between text-[11px] font-bold text-fighter-a mb-1"><span>🟢 FIGHTER A</span><span>{hud.hpA}</span></div>
                  <div className="h-2 rounded-full bg-white/8 overflow-hidden">
                    <motion.div className="h-full rounded-full bg-gradient-to-r from-emerald-600 to-fighter-a" animate={{ width: hud.hpA + '%' }} transition={{ type: 'spring', stiffness: 90, damping: 20 }} />
                  </div>
                </div>
                <div className="flex-1">
                  <div className="flex justify-between text-[11px] font-bold text-fighter-b mb-1"><span>🔵 FIGHTER B</span><span>{hud.hpB}</span></div>
                  <div className="h-2 rounded-full bg-white/8 overflow-hidden">
                    <motion.div className="h-full rounded-full bg-gradient-to-r from-blue-600 to-fighter-b" animate={{ width: hud.hpB + '%' }} transition={{ type: 'spring', stiffness: 90, damping: 20 }} />
                  </div>
                </div>
              </div>
              <div className="relative z-10 mt-2">
                <DuelCanvas soundOn={sound} onTick={push} onHud={setHud} />
              </div>
              <div className="border-t border-white/8 bg-black/50 px-4 py-2.5 font-mono text-[11.5px] h-[104px] overflow-hidden flex flex-col justify-end gap-[3px] relative z-10">
                <ProgressiveBlur position="top" height="30px" blurAmount="3px" backgroundColor="#0d0b09" />
                <AnimatePresence initial={false}>
                  {feed.map((l) => (
                    <motion.div
                      key={l.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="whitespace-nowrap overflow-hidden text-ellipsis text-muted"
                      dangerouslySetInnerHTML={{ __html: l.html }}
                    />
                  ))}
                </AnimatePresence>
              </div>
              <div className="relative flex gap-2 px-4 py-3.5 border-t border-white/8 z-10">
                {['A', 'B', 'Draw'].map((c) => (
                  <button
                    key={c}
                    onClick={() => lock(c)}
                    className={`flex-1 py-2.5 rounded-[10px] border font-bold text-[13px] transition-all ${
                      locked === c
                        ? 'border-ember/60 bg-ember/10 text-ember shadow-[0_0_18px_rgba(255,90,31,0.25)]'
                        : 'border-white/12 bg-white/4 hover:border-ember/50 hover:bg-ember/5'
                    }`}
                  >
                    {c === 'A' ? '🟢 Vote A' : c === 'B' ? '🔵 Vote B' : '🤝 Draw'}
                  </button>
                ))}
                <EmberBurst burstKey={burst} />
              </div>
            </div>
          </motion.div>
        </div>

        {/* scroll cue — rotating blood badge */}
        <motion.button
          onClick={() => goTo('#why')}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2.7 }}
          aria-label="Scroll to Why"
          className="mx-auto mt-12 relative flex items-center justify-center w-28 h-28 text-dim hover:text-white transition-colors"
        >
          <svg viewBox="0 0 100 100" className="absolute inset-0 animate-spin-slow" aria-hidden>
            <defs>
              <path id="blood-circle" d="M50,50 m-38,0 a38,38 0 1,1 76,0 a38,38 0 1,1 -76,0" fill="none" />
            </defs>
            <text fontSize="10" letterSpacing="2" fill="currentColor" style={{ fontFamily: 'JetBrains Mono, monospace', fontWeight: 700 }}>
              <textPath href="#blood-circle" textLength="236" lengthAdjust="spacingAndGlyphs">SCROLL FOR BLOOD · SCROLL FOR BLOOD ·</textPath>
            </text>
          </svg>
          <motion.span animate={{ y: [0, 6, 0] }} transition={{ repeat: Infinity, duration: 1.8 }} className="text-2xl text-ember">▾</motion.span>
        </motion.button>
      </div>
    </section>
  )
}

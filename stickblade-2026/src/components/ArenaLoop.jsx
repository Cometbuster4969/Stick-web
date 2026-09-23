import { useCallback, useEffect, useRef, useState } from 'react'
import { motion, AnimatePresence, useScroll, useSpring, useInView } from 'framer-motion'
import { Reveal } from './ui'
import { useArenaLive } from '../lib/arena-live'

// ---------------- mini product mocks ----------------

function SetupMock() {
  return (
    <div className="rounded-2xl border border-white/12 bg-[#12100d] p-5 md:p-6 shadow-[0_24px_70px_rgba(0,0,0,0.5)]">
      <div className="font-mono text-[10.5px] tracking-[0.25em] text-dim mb-3">FIGHT SETUP · SWORD</div>
      <div className="flex flex-wrap gap-2 mb-4">
        {['🗡 Sword', '🔪 Dagger', '🥄 Spear', '⛓ Flail', '🏹 Bow'].map((w, i) => (
          <span key={w} className={`text-[13px] font-semibold px-3.5 py-2 rounded-xl border ${i === 0 ? 'border-ember/70 bg-ember/10 text-white' : 'border-white/10 text-dim'}`}>{w}</span>
        ))}
      </div>
      <div className="font-mono text-[10.5px] tracking-[0.25em] text-dim mb-3">DANGEROUS ZONES — THE TWIST</div>
      <div className="flex flex-wrap gap-2 mb-4">
        <span className="font-mono text-xs px-3.5 py-2 rounded-full border border-ember/70 bg-ember/15 text-ember-soft font-bold">☠ tip · lethal</span>
        {['edge · blunt', 'back_edge · blunt', 'pommel · blunt'].map((z) => (
          <span key={z} className="font-mono text-xs px-3.5 py-2 rounded-full border border-white/10 text-dim">· {z}</span>
        ))}
      </div>
      <div className="flex flex-wrap gap-2 mb-5">
        {['🏟 Normal', '❄ Ice', '🌙 Low G'].map((a, i) => (
          <span key={a} className={`text-[12.5px] px-3 py-1.5 rounded-lg border ${i === 0 ? 'border-white/25 text-white' : 'border-white/10 text-dim'}`}>{a}</span>
        ))}
        <span className="text-[12.5px] px-3 py-1.5 rounded-lg border border-white/10 text-dim ml-auto">♟ Macro · ≤15s/turn</span>
      </div>
      <div className="btn-primary rounded-xl py-3.5 text-center font-bold text-white text-[15px]">⚔ FIGHT — GPT-OSS 120B vs Llama 3.3 70B</div>
    </div>
  )
}

const TICK = [
  'turn 04 · A:<b>thrust</b> vs B:<b>guard_high</b> ◆ <span style="color:#ffc857">4.1dmg</span> blunt',
  'turn 05 · A:<b>lunge</b> vs B:<b>hop_back</b> ◆ <span style="color:#ffc857">0.0dmg</span> miss',
  'turn 06 · A:<b>rising_slash</b> vs B:<b>thrust</b> ◆ <span style="color:#ffc857">9.7dmg</span> <span style="color:#ff5a1f;font-weight:700">SHARP</span>',
  'turn 07 · A:<b>guard_low</b> vs B:<b>overhead_slash</b> ◆ <span style="color:#ffc857">6.2dmg</span> blunt',
  'turn 08 · A:<b>thrust</b> vs B:<b>thrust</b> ◆ <span style="color:#ffc857">14.3dmg</span> <span style="color:#ff5a1f;font-weight:700">SHARP</span>',
  'turn 09 · A:<b>pommel_strike</b> vs B:<b>guard_high</b> ◆ <span style="color:#ffc857">2.0dmg</span> blunt',
]

function FightMock() {
  const ref = useRef(null)
  const inView = useInView(ref, { amount: 0.25 })
  const [lines, setLines] = useState(TICK.slice(0, 3))
  const [hp, setHp] = useState([100, 100])
  const [turn, setTurn] = useState(4)

  useEffect(() => {
    if (!inView) return
    let i = 3
    const id = setInterval(() => {
      setLines((p) => [...p.slice(-2), TICK[i % TICK.length]])
      setHp(([a, b]) => {
        const na = a - Math.round(3 + Math.random() * 9)
        const nb = b - Math.round(3 + Math.random() * 11)
        return na <= 10 || nb <= 10 ? [100, 100] : [na, nb]
      })
      setTurn((t) => (t >= 24 ? 1 : t + 1))
      i++
    }, 1800)
    return () => clearInterval(id)
  }, [inView])

  return (
    <div ref={ref} className="rounded-2xl border border-white/12 bg-[#12100d] overflow-hidden shadow-[0_24px_70px_rgba(0,0,0,0.5)]">
      <div className="flex items-center gap-2 px-4 py-2.5 border-b border-white/8 text-[11.5px]">
        <span className="w-2 h-2 rounded-full bg-blood shadow-[0_0_8px_#e5482f] animate-blink" />
        <b className="font-display tracking-wide">LIVE</b>
        <span className="font-mono text-[10.5px] text-dim ml-auto">TURN {String(turn).padStart(2, '0')}/24 · pymunk 60fps</span>
      </div>
      <div className="flex gap-3 px-4 pt-3">
        <div className="flex-1">
          <div className="flex justify-between text-[10.5px] font-bold text-fighter-a mb-1"><span>🟢 A</span><span>{hp[0]}</span></div>
          <div className="h-1.5 rounded-full bg-white/8 overflow-hidden">
            <motion.div className="h-full rounded-full bg-gradient-to-r from-emerald-600 to-fighter-a" animate={{ width: hp[0] + '%' }} transition={{ type: 'spring', stiffness: 80, damping: 20 }} />
          </div>
        </div>
        <div className="flex-1">
          <div className="flex justify-between text-[10.5px] font-bold text-fighter-b mb-1"><span>🔵 B</span><span>{hp[1]}</span></div>
          <div className="h-1.5 rounded-full bg-white/8 overflow-hidden">
            <motion.div className="h-full rounded-full bg-gradient-to-r from-blue-600 to-fighter-b" animate={{ width: hp[1] + '%' }} transition={{ type: 'spring', stiffness: 80, damping: 20 }} />
          </div>
        </div>
      </div>
      <div className="px-4 py-3 font-mono text-[11.5px] flex flex-col gap-1.5 min-h-[92px] justify-end">
        <AnimatePresence initial={false}>
          {lines.map((l, i) => (
            <motion.div key={`${turn}-${i}-${l.slice(0, 12)}`} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="whitespace-nowrap overflow-hidden text-ellipsis text-muted" dangerouslySetInnerHTML={{ __html: l }} />
          ))}
        </AnimatePresence>
      </div>
    </div>
  )
}

function VoteMock() {
  const [v, setV] = useState(null)
  return (
    <div className="rounded-2xl border border-white/12 bg-[#12100d] p-5 md:p-6 shadow-[0_24px_70px_rgba(0,0,0,0.5)]">
      <div className="font-mono text-[10.5px] tracking-[0.25em] text-dim mb-1">BLIND BALLOT · MODELS HIDDEN 🔒</div>
      <div className="font-display font-bold text-lg mb-3">Who fought smarter?</div>
      <div className="flex gap-2.5">
        {['A', 'B'].map((c) => (
          <button
            key={c} onClick={() => setV(c)}
            className={`flex-1 py-3 rounded-xl font-bold text-sm border transition-all ${v === c ? 'border-ember/60 bg-ember/10 text-ember' : 'border-white/12 bg-white/4 hover:border-ember/50'}`}
          >
            {c === 'A' ? '🟢 Fighter A' : '🔵 Fighter B'}
          </button>
        ))}
      </div>
      <AnimatePresence>
        {v && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="overflow-hidden">
            <div className="border border-ember/30 bg-ember/5 rounded-xl p-3.5 mt-3 text-[13px]">
              <b>🎭 Reveal:</b> <span className="text-fighter-a">A was <b>Qwen3 32B</b></span> · <span className="text-fighter-b">B was <b>Llama 3.2 3B</b></span>
              <div className="font-mono text-[11.5px] mt-1.5 text-ember-soft">Qwen3 · sword/tip · 1041 → 1057 (+16)</div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      {!v && <p className="text-[12px] text-dim mt-3">Cast a vote to reveal identities + Elo deltas. (Try it — this one is live.)</p>}
    </div>
  )
}

const RANK_ROWS = [
  ['🥇', 'GPT-OSS 120B', 1142, '+16', true],
  ['🥈', 'Qwen3 32B', 1089, '+9', false],
  ['🥉', 'DeepSeek R1 70B', 1057, '−4', false],
]

function RankMock() {
  const live = useArenaLive()
  const liveRows = live.board.slice(0, 3)
  const rows = liveRows.length
    ? liveRows.map((r, i) => ({ medal: ['🥇', '🥈', '🥉'][i], m: r.name, elo: r.elo, tag: `n=${r.n}`, top: i === 0, live: true }))
    : RANK_ROWS.map(([medal, m, elo, delta, top]) => ({ medal, m, elo, tag: delta, top, live: false }))
  const max = Math.max(1, ...rows.map((r) => r.elo))
  return (
    <div className="rounded-2xl border border-white/12 bg-[#12100d] overflow-hidden shadow-[0_24px_70px_rgba(0,0,0,0.5)]">
      <div className="flex items-center gap-2 px-4 py-2.5 border-b border-white/8">
        <span className="font-display font-bold text-[13px]">Human-Voted Elo</span>
        <span className="font-mono text-[10px] text-muted bg-white/5 px-2 py-0.5 rounded-md border border-white/8">🗡 sword · tip sharp</span>
        {liveRows.length > 0 && (
          <span className="ml-auto flex items-center gap-1.5 font-mono text-[10px] text-fighter-a">
            <span className="w-1.5 h-1.5 rounded-full bg-fighter-a animate-blink" />LIVE
          </span>
        )}
      </div>
      {rows.map((row, i) => (
        <div key={row.m} className="flex items-center gap-3 px-4 py-3 border-b border-white/5 last:border-0">
          <span className="w-6 text-center">{row.medal}</span>
          <div className="flex-1 min-w-0">
            <div className="font-mono text-[12.5px] truncate">{row.m}</div>
            <div className="h-1.5 rounded-full bg-white/6 mt-1 overflow-hidden">
              <motion.div
                initial={{ width: 0 }} whileInView={{ width: `${(row.elo / max) * 100}%` }} viewport={{ once: true }}
                transition={{ delay: 0.15 + i * 0.12, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                className={`h-full rounded-full ${row.top ? 'bg-gradient-to-r from-gold to-amber-200' : 'bg-gradient-to-r from-ember/70 to-ember-deep/70'}`}
              />
            </div>
          </div>
          {row.live ? (
            <span className="font-mono text-[11px] px-1.5 py-0.5 rounded bg-white/8 text-muted">{row.tag}</span>
          ) : (
            <span className={`font-mono text-[11px] px-1.5 py-0.5 rounded ${String(row.tag).startsWith('+') ? 'bg-ember/10 text-ember' : 'bg-blood/10 text-blood'}`}>{row.tag}</span>
          )}
          <span className={`font-display font-bold ${row.top ? 'text-gold' : ''}`}>{row.elo}</span>
        </div>
      ))}
    </div>
  )
}

// ---------------- steps ----------------

const STEPS = [
  {
    n: '01', label: 'Constrain', accent: 'text-ember',
    headline: 'Pick the weapon. Name the killer edge.',
    d: 'You decide what part of the blade deals damage — tip, edge, back-edge, pommel, or all of it. Set pommel-only and every memorized fencing tutorial becomes a liability.',
    pill: (live) => `${live.stats.matches} matches · 5 weapons · 16 zone combos live now`,
    Mock: SetupMock,
  },
  {
    n: '02', label: 'Fight', accent: 'text-blood',
    headline: 'Two minds enter. Physics decides.',
    d: 'Both LLMs get the same compressed world-state and ≤15 seconds to commit. Then 3 seconds of 60fps rigid-body physics resolve every swing,and the ticker streams it live.',
    pill: '24 turns · ≤15s each · ~60 seconds a duel',
    Mock: FightMock,
  },
  {
    n: '03', label: 'Vote', accent: 'text-ember-soft',
    headline: 'Judge the fight, not the brand.',
    d: 'Identities are scrambled server-side — you only ever see Fighter A vs Fighter B. Vote on form, tactics, and kills, then the reveal shows who was who.',
    pill: (live) => `${live.stats.votes} blind votes cast · zero brand bias`,
    Mock: VoteMock,
  },
  {
    n: '04', label: 'Rank', accent: 'text-gold',
    headline: 'Elo, split by weapon and zone.',
    d: 'Ratings update per (model, weapon, sharp-zone) cell — atomically. A fencer’s rating never borrows glory from the brawler’s, or the bowman’s.',
    pill: 'Per-zone cells · K=32 · Wilson 95% confidence',
    Mock: RankMock,
  },
]

function StepBlock({ s, i, onActive }) {
  const ref = useRef(null)
  const live = useArenaLive()
  const pill = typeof s.pill === 'function' ? s.pill(live) : s.pill
  const inCenter = useInView(ref, { margin: '-38% 0px -38% 0px' })

  useEffect(() => {
    if (inCenter) onActive(i)
  }, [inCenter, i, onActive])

  return (
    <div ref={ref} id={`loop-step-${i}`} className="py-10 md:py-14 first:pt-2">
      <Reveal>
        <div className={`font-mono text-[12px] md:text-[13px] font-bold tracking-[0.3em] ${s.accent}`}>{s.n} · {s.label.toUpperCase()}</div>
      </Reveal>
      <Reveal delay={0.06}>
        <h3 className="font-display font-bold tracking-tight text-3xl md:text-[44px] leading-[1.05] mt-3">{s.headline}</h3>
      </Reveal>
      <Reveal delay={0.12}>
        <p className="text-muted text-[15.5px] md:text-[17px] leading-relaxed mt-4">{s.d}</p>
      </Reveal>
      <Reveal delay={0.18}>
        <div className="inline-flex items-center gap-2 mt-5 text-[13px] text-muted border border-white/12 bg-white/[0.03] rounded-full px-4 py-2">
          <span className="w-1.5 h-1.5 rounded-full bg-ember" />{pill}
        </div>
      </Reveal>
      <Reveal delay={0.22}>
        <div className="mt-7 max-w-2xl"><s.Mock /></div>
      </Reveal>
    </div>
  )
}

// ---------------- section ----------------

export default function ArenaLoop() {
  const stepsRef = useRef(null)
  const [active, setActive] = useState(0)
  const { scrollYProgress } = useScroll({ target: stepsRef, offset: ['start 0.72', 'end 0.55'] })
  const fill = useSpring(scrollYProgress, { stiffness: 120, damping: 26 })
  const onActive = useCallback((i) => setActive(i), [])

  const jump = (i) => {
    const el = document.getElementById(`loop-step-${i}`)
    if (!el) return
    if (window.__lenis) window.__lenis.scrollTo(el, { offset: -110, duration: 1.2 })
    else {
      const y = el.getBoundingClientRect().top + window.scrollY - 110
      window.scrollTo({ top: y, behavior: 'smooth' })
    }
  }

  return (
    <section id="loop" className="relative py-20 md:py-28">
      <div className="max-w-7xl mx-auto px-5 md:px-8">
        <Reveal>
          <span className="font-mono text-[11px] md:text-xs font-bold tracking-[0.3em] uppercase text-ember">How a duel works</span>
        </Reveal>
        <Reveal delay={0.08}>
          <h2 className="font-display font-bold tracking-tight text-3xl md:text-5xl mt-3">Every match runs the same loop.</h2>
        </Reveal>
        <Reveal delay={0.16}>
          <p className="text-muted text-base md:text-lg mt-4 max-w-2xl">Four steps, in order, for every duel. Here is what each one looks like.</p>
        </Reveal>

        {/* mobile: sticky mini-stepper */}
        <div className="lg:hidden sticky top-[68px] z-30 -mx-5 px-5 py-3 mt-6 bg-void/85 backdrop-blur-xl border-y border-white/8">
          <div className="flex gap-2 overflow-x-auto no-scrollbar">
            {STEPS.map((s, i) => (
              <button
                key={s.n}
                onClick={() => jump(i)}
                className={`shrink-0 flex items-center gap-2 text-[12.5px] font-semibold rounded-full px-3.5 py-1.5 border transition-colors ${i === active ? 'border-ember/60 bg-ember/10 text-white' : 'border-white/10 text-dim'}`}
              >
                <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-mono font-bold ${i === active ? 'bg-ember text-white' : 'bg-white/8 text-dim'}`}>{i + 1}</span>
                {s.n} · {s.label}
              </button>
            ))}
          </div>
          <div className="h-[2px] rounded-full bg-white/8 mt-2.5 overflow-hidden">
            <motion.div style={{ scaleX: fill }} className="h-full w-full origin-left bg-gradient-to-r from-ember to-ember-deep" />
          </div>
        </div>

        <div className="grid lg:grid-cols-[290px_1fr] gap-10 lg:gap-16 mt-8">
          {/* desktop: sticky vertical rail */}
          <div className="hidden lg:block">
            <div className="sticky top-32 pb-20">
              <div className="relative">
                {/* track + fill */}
                <div className="absolute left-[19px] top-3 bottom-3 w-[2px] rounded-full bg-white/8 overflow-hidden">
                  <motion.div style={{ scaleY: fill }} className="w-full h-full origin-top bg-gradient-to-b from-ember-soft via-ember to-ember-deep" />
                </div>
                {/* loop-back tail */}
                <svg className="absolute left-[19px] -bottom-16 w-16 h-16 overflow-visible" viewBox="0 0 64 64" fill="none">
                  <motion.path
                    d="M1 0 V22 C1 34 12 36 30 36 H52"
                    stroke="#ff5a1f" strokeWidth="2" strokeLinecap="round"
                    strokeDasharray="120" initial={{ strokeDashoffset: 120 }}
                    animate={{ strokeDashoffset: active === 3 ? 0 : 120 }}
                    transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
                    style={{ opacity: active === 3 ? 1 : 0.25 }}
                  />
                  <motion.g
                    initial={{ opacity: 0, scale: 0.6 }} animate={{ opacity: active === 3 ? 1 : 0.25, scale: 1 }}
                    transition={{ delay: active === 3 ? 0.7 : 0 }}
                  >
                    <circle cx="56" cy="36" r="4" fill="#ff5a1f" />
                    <path d="M54 30 L60 36 L54 42" stroke="#ff5a1f" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
                  </motion.g>
                </svg>
                <motion.button
                  onClick={() => jump(0)}
                  title="Back to step 1 — the loop never ends"
                  initial={false}
                  animate={{ opacity: active === 3 ? 1 : 0.35, color: active === 3 ? '#ff5a1f' : '#71717a' }}
                  className="absolute left-[70px] -bottom-[26px] font-mono text-[12px] font-bold tracking-[0.35em] hover:scale-105 active:scale-95 transition-transform"
                >
                  ⇄ REPEAT
                </motion.button>

                {/* stops */}
                <div className="flex flex-col gap-9">
                  {STEPS.map((st, i) => {
                    const done = i <= active
                    const now = i === active
                    return (
                      <button key={st.n} onClick={() => jump(i)} className="relative flex items-center gap-4 group text-left">
                        <motion.span
                          animate={{ scale: now ? 1.15 : 1 }}
                          transition={{ type: 'spring', stiffness: 320, damping: 18 }}
                          className={`w-10 h-10 rounded-full border-2 flex items-center justify-center font-mono text-sm font-bold transition-colors relative z-10 shrink-0 ${done ? 'bg-ember border-ember text-white shadow-[0_0_26px_rgba(255,90,31,0.55)]' : 'bg-void border-white/15 text-dim group-hover:border-white/35 group-hover:text-muted'}`}
                        >
                          {i + 1}
                        </motion.span>
                        <span>
                          <span className={`block font-mono text-[11px] font-bold tracking-[0.25em] ${now ? 'text-ember' : 'text-dim'}`}>{st.n}</span>
                          <span className={`block font-display font-bold text-[22px] leading-tight transition-colors ${now ? 'text-white' : done ? 'text-muted' : 'text-dim'}`}>{st.label}</span>
                        </span>
                      </button>
                    )
                  })}
                </div>
              </div>
            </div>
          </div>

          {/* scrolling content */}
          <div ref={stepsRef}>
            {STEPS.map((s, i) => (
              <StepBlock key={s.n} s={s} i={i} onActive={onActive} />
            ))}

            {/* then the next matchup */}
            <div className="pt-6 pb-4">
              <Reveal>
                <div className="font-mono text-[12px] font-bold tracking-[0.3em] text-ember-soft">THEN THE NEXT MATCHUP</div>
              </Reveal>
              <Reveal delay={0.06}>
                <h3 className="font-display font-bold tracking-tight text-3xl md:text-4xl mt-3">Same loop. Every duel.</h3>
              </Reveal>
              <Reveal delay={0.12}>
                <div className="flex flex-wrap gap-2.5 mt-6">
                  {['✓ sword · tip', '✓ dagger · pommel', '✓ spear · tip', '✓ flail · spikes'].map((c) => (
                    <span key={c} className="text-sm px-4 py-2.5 rounded-full border border-white/12 bg-white/[0.03] text-muted">{c}</span>
                  ))}
                  <span className="text-sm font-semibold px-4 py-2.5 rounded-full border border-ember/50 bg-ember/10 text-white">Next: bow · arrowhead →</span>
                </div>
              </Reveal>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
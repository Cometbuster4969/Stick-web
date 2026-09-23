import { useCallback, useEffect, useRef, useState } from 'react'
import { motion, AnimatePresence, useScroll, useSpring, useInView } from 'framer-motion'
import { MODELS } from '../data'
import { navigate, getPath } from '../router'
import { Link000, Link001, Link002 } from './ui/skiper-ui/skiper40'
import { TextRoll } from './ui/skiper-ui/skiper58'
import { ArrowIcon, MenuIcon } from './ui/skiper-ui/skiper99'

export const LIVE_URL = 'https://stickblade-arena.vercel.app/'
export const GH_URL = 'https://github.com/Cometbuster4969/STICKBLADE-ARENA'

// smooth-scroll helper (Lenis-aware, respects reduced motion)
export function goTo(hash) {
  const el = document.querySelector(hash)
  if (!el) return
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  if (window.__lenis && !reduced) window.__lenis.scrollTo(el, { offset: -76, duration: 1.4 })
  else el.scrollIntoView({ behavior: reduced ? 'auto' : 'smooth' })
}

// ---------- skip link ----------
export function SkipLink() {
  return (
    <a
      href="#main"
      onClick={(e) => {
        e.preventDefault()
        const main = document.getElementById('main')
        if (main) {
          main.setAttribute('tabindex', '-1')
          main.focus({ preventScroll: true })
        }
        goTo('#main')
      }}
      className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-[200] focus:px-4 focus:py-2.5 focus:rounded-xl focus:bg-ember focus:text-white focus:font-bold focus:text-sm"
    >
      Skip to content
    </a>
  )
}

// ---------- live status chip ----------
const CHIP = {
  live: ['● LIVE', 'text-fighter-a border-fighter-a/40 bg-fighter-a/10'],
  cached: ['◐ CACHED', 'text-gold border-gold/40 bg-gold/10'],
  connecting: ['… SYNCING', 'text-ember-soft border-ember/40 bg-ember/10 animate-pulse'],
  offline: ['○ OFFLINE', 'text-dim border-white/15 bg-white/4'],
}
export function LiveChip({ status }) {
  const [label, cls] = CHIP[status] || CHIP.connecting
  return (
    <span className={`font-mono text-[10.5px] font-bold px-2.5 py-1 rounded-lg border whitespace-nowrap ${cls}`}>
      {label}
    </span>
  )
}

// ---------- scroll reveal wrapper ----------
export function Reveal({ children, delay = 0, y = 28, className = '' }) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.7, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  )
}

// ---------- section header ----------
const EYEBROW = {
  cyan: 'text-ember-soft', magenta: 'text-ember', mint: 'text-ember-soft',
  gold: 'text-gold', purple: 'text-ember-soft', red: 'text-blood',
  ember: 'text-ember',
}
export function SectionHead({ eyebrow, color = 'cyan', title, sub }) {
  return (
    <div className="mb-10 md:mb-14">
      <Reveal>
        <span className={`font-mono text-[11px] md:text-xs font-bold tracking-[0.3em] uppercase ${EYEBROW[color]}`}>
          {eyebrow}
        </span>
      </Reveal>
      <Reveal delay={0.08}>
        <h2 className="font-display font-bold tracking-tight text-3xl md:text-5xl mt-3 leading-[1.08]">{title}</h2>
      </Reveal>
      {sub && (
        <Reveal delay={0.16}>
          <p className="text-muted text-base md:text-lg mt-4 max-w-3xl leading-relaxed">{sub}</p>
        </Reveal>
      )}
    </div>
  )
}

// ---------- animated counter ----------
export function CountUp({ end, suffix = '', duration = 1.6 }) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-40px' })
  const [val, setVal] = useState(0)
  useEffect(() => {
    if (!inView) return
    let raf, t0
    const f = (t) => {
      if (!t0) t0 = t
      const p = Math.min((t - t0) / (duration * 1000), 1)
      setVal(Math.round(end * (1 - Math.pow(1 - p, 3))))
      if (p < 1) raf = requestAnimationFrame(f)
    }
    raf = requestAnimationFrame(f)
    return () => cancelAnimationFrame(raf)
  }, [inView, end, duration])
  return <span ref={ref}>{val}{suffix}</span>
}

// ---------- copy button ----------
export function CopyBtn({ text }) {
  const [ok, setOk] = useState(false)
  return (
    <button
      onClick={() => {
        const done = () => { setOk(true); setTimeout(() => setOk(false), 1500) }
        if (navigator.clipboard) navigator.clipboard.writeText(text).then(done).catch(done)
        else done()
      }}
      className="font-mono text-[11px] px-2.5 py-1 rounded-md bg-white/5 border border-white/10 text-muted hover:text-white hover:border-ember/60 transition-colors"
    >
      {ok ? 'copied ✓' : 'copy'}
    </button>
  )
}

// ---------- models marquee ----------
export function Marquee() {
  return (
    <div role="marquee" aria-label="Models fighting in the arena" tabIndex={0} className="border-y border-white/8 bg-white/[0.015] overflow-hidden py-3.5 relative outline-none">
      <div className="flex w-max animate-marquee gap-10 whitespace-nowrap font-mono text-[13px] text-dim hover:[animation-play-state:paused] focus-within:[animation-play-state:paused] motion-reduce:animate-none">
        {MODELS.map((m, i) => (
          <span key={i}>⚔ <b className="text-muted font-medium">{m}</b></span>
        ))}
        {MODELS.map((m, i) => (
          <span key={`dup-${i}`} aria-hidden>⚔ <b className="text-muted font-medium">{m}</b></span>
        ))}
      </div>
      <div className="absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-void to-transparent pointer-events-none" />
      <div className="absolute inset-y-0 right-0 w-24 bg-gradient-to-l from-void to-transparent pointer-events-none" />
    </div>
  )
}

// ---------- descramble wordmark ----------
const GLYPHS = '⚔#/\\|<>*+×'
function Scramble({ text, className = '' }) {
  const [out, setOut] = useState(text)
  const run = useCallback(() => {
    let i = 0
    const id = setInterval(() => {
      i++
      setOut(
        text
          .split('')
          .map((c, j) => (j < i ? c : GLYPHS[Math.floor(Math.random() * GLYPHS.length)]))
          .join('')
      )
      if (i > text.length) clearInterval(id)
    }, 30)
    return () => clearInterval(id)
  }, [text])
  useEffect(() => run(), [run])
  return (
    <span className={className} onMouseEnter={run}>
      {out}
    </span>
  )
}

function Brand() {
  return (
    <>
      <span className="text-[22px]" aria-hidden>⚔️</span>{' '}
      <Scramble text="STICKBLADE" />&nbsp;<span className="text-gradient"><Scramble text="ARENA" /></span>
    </>
  )
}

// ---------- preloader ----------
export function Preloader({ done }) {
  const [n, setN] = useState(0)
  const doneRef = useRef(done)
  doneRef.current = done
  useEffect(() => {
    let v = 0
    const id = setInterval(() => {
      v += Math.floor(Math.random() * 16) + 5
      if (v >= 100) { v = 100; clearInterval(id); setTimeout(() => doneRef.current(), 400) }
      setN(v)
    }, 120)
    return () => clearInterval(id)
  }, [])
  return (
    <motion.div
      exit={{ y: '-100%' }}
      transition={{ duration: 0.85, ease: [0.76, 0, 0.24, 1] }}
      className="fixed inset-0 z-[100] bg-void flex flex-col items-center justify-center gap-5"
    >
      <motion.div animate={{ rotate: [0, -10, 10, 0] }} transition={{ repeat: Infinity, duration: 2.2 }} className="text-6xl">⚔️</motion.div>
      <div className="font-display font-bold tracking-[0.35em] text-[13px] text-muted">STICKBLADE&nbsp;<span className="text-gradient">ARENA</span></div>
      <div className="font-display font-bold text-7xl md:text-8xl tabular-nums">{n}<span className="text-ember">%</span></div>
      <div className="w-56 h-[3px] rounded-full bg-white/8 overflow-hidden">
        <div className="h-full bg-gradient-to-r from-ember to-ember-deep transition-all duration-150" style={{ width: n + '%' }} />
      </div>
      <div className="dotmatrix-loader" aria-hidden>
        {Array.from({ length: 12 }, (_, i) => <i key={i} />)}
      </div>
      <div className="font-mono text-[10.5px] tracking-[0.35em] text-dim">NOCKING ARROWS…</div>
    </motion.div>
  )
}

// ---------- custom cursor (desktop only) ----------
export function Cursor() {
  const dot = useRef(null)
  const ring = useRef(null)
  useEffect(() => {
    if (window.matchMedia('(hover: none)').matches) return
    let x = -100, y = -100, rx = -100, ry = -100, s = 1, ts = 1, raf
    const move = (e) => {
      x = e.clientX; y = e.clientY
      ts = e.target?.closest?.('a,button,[data-hover]') ? 2.1 : 1
    }
    const loop = () => {
      rx += (x - rx) * 0.16; ry += (y - ry) * 0.16; s += (ts - s) * 0.2
      if (dot.current) dot.current.style.transform = `translate(${x}px,${y}px)`
      if (ring.current) ring.current.style.transform = `translate(${rx}px,${ry}px) scale(${s.toFixed(3)})`
      raf = requestAnimationFrame(loop)
    }
    window.addEventListener('mousemove', move, { passive: true })
    raf = requestAnimationFrame(loop)
    return () => { window.removeEventListener('mousemove', move); cancelAnimationFrame(raf) }
  }, [])
  return (
    <div className="cursor-layer" aria-hidden>
      <div ref={ring} className="cursor-ring" />
      <div ref={dot} className="cursor-dot" />
    </div>
  )
}

// ---------- nav ----------
const PAGE_LINKS = [
  ['Home', '/'], ['Fights', '/fights'], ['Research', '/research'], ['About', '/about'],
]
const SECTION_LINKS = [
  ['Why', '/', 'why'], ['Loop', '/', 'loop'], ['Twist', '/fights', 'twist'],
  ['Voting', '/fights', 'voting'], ['Board', '/fights', 'board'], ['FAQ', '/about', 'faq'],
]
export function Nav() {
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [path, setPath] = useState(() => (typeof window !== 'undefined' ? getPath() ?? '/' : '/'))
  useEffect(() => {
    const f = () => setScrolled(window.scrollY > 24)
    window.addEventListener('scroll', f, { passive: true })
    return () => window.removeEventListener('scroll', f)
  }, [])
  useEffect(() => {
    const f = () => { setPath(getPath() ?? '/'); setOpen(false) }
    window.addEventListener('popstate', f)
    window.addEventListener('routechange', f)
    return () => { window.removeEventListener('popstate', f); window.removeEventListener('routechange', f) }
  }, [])
  useEffect(() => {
    if (!open) return
    const f = (e) => { if (e.key === 'Escape') setOpen(false) }
    window.addEventListener('keydown', f)
    return () => window.removeEventListener('keydown', f)
  }, [open ])
  const go = (to, section) => { setOpen(false); navigate(to, section) }
  return (
    <motion.header
      initial={{ y: -70, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className={`fixed top-0 inset-x-0 z-50 transition-all ${scrolled ? 'bg-void/85 backdrop-blur-xl border-b border-white/8 shadow-[0_8px_30px_rgba(0,0,0,0.5)]' : 'bg-transparent'}`}
    >
      <div className="max-w-7xl mx-auto px-5 md:px-8 h-[68px] flex items-center gap-6">
        <button onClick={() => go('/')} className="flex items-center gap-2.5 font-display font-bold tracking-wide text-[17px]" aria-label="Stickblade Arena — home">
          <Brand />
        </button>
        <nav className="hidden lg:flex gap-1 ml-auto items-center" aria-label="Pages">
          {PAGE_LINKS.map(([t, to]) => (
            <Link000
              key={to} href={to} onClick={(e) => { e.preventDefault(); go(to) }}
              aria-current={path === to ? 'page' : undefined}
              className={`text-[13.5px] px-3 py-2 rounded-lg transition-colors ${path === to ? 'text-white bg-white/8 font-semibold' : 'text-muted hover:text-white hover:bg-white/6'}`}
            >
              {t}
            </Link000>
          ))}
        </nav>
        <div className="hidden lg:flex gap-2.5 ml-2 items-center">
          <a href={GH_URL} target="_blank" rel="noopener" className="btn-ghost btn-shine text-[13px] font-semibold px-3.5 py-2 rounded-[10px]">★ Star on GitHub</a>
          <a href={LIVE_URL} target="_blank" rel="noopener" className="btn-primary text-[13px] font-bold px-3.5 py-2 rounded-[10px] text-white">⚔ Fight Now</a>
        </div>
        <div className="lg:hidden ml-auto flex items-center gap-2.5">
          <button
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            aria-label={open ? 'Close menu' : 'Open menu'}
            className="block size-11 p-2.5 rounded-lg border border-white/12 cursor-pointer hover:border-white/25 transition-colors"
          >
            <MenuIcon open={open} onToggle={() => setOpen((v) => !v)} />
          </button>
        </div>
      </div>
      <AnimatePresence>
        {open && (
          <motion.nav
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="lg:hidden overflow-hidden bg-abyss/95 backdrop-blur-xl border-b border-white/8"
            aria-label="Menu"
          >
            <div className="px-6 py-4 flex flex-col">
              {PAGE_LINKS.map(([t, to]) => (
                <button key={to} onClick={() => go(to)} aria-current={path === to ? 'page' : undefined} className="group flex items-center justify-between py-2.5 border-b border-white/5">
                  <TextRoll center className={`font-display text-[26px] font-bold uppercase tracking-tight transition-colors ${path === to ? 'text-white' : 'text-muted group-hover:text-white'}`}>
                    {t.toUpperCase()}
                  </TextRoll>
                  <span className="block size-7 shrink-0 text-dim group-hover:text-ember transition-colors"><ArrowIcon /></span>
                </button>
              ))}
              <div className="flex flex-wrap gap-2 pt-4">
                {SECTION_LINKS.map(([t, to, sec]) => (
                  <button
                    key={sec} onClick={() => go(to, sec)}
                    className="text-[12.5px] font-semibold px-3.5 py-2 rounded-full border border-white/10 text-muted hover:text-white hover:border-ember/50 transition-colors"
                  >
                    {t}
                  </button>
                ))}
              </div>
              <div className="flex gap-2.5 pt-4 pb-2">
                <a href={GH_URL} target="_blank" rel="noopener" className="btn-ghost btn-shine flex-1 text-center text-sm font-semibold px-3.5 py-2.5 rounded-[10px]">★ Star on GitHub</a>
                <a href={LIVE_URL} target="_blank" rel="noopener" className="btn-primary flex-1 text-center text-sm font-bold px-3.5 py-2.5 rounded-[10px] text-white">⚔ Fight Now</a>
              </div>
            </div>
          </motion.nav>
        )}
      </AnimatePresence>
    </motion.header>
  )
}

// ---------- vertical page-scroll rail (desktop) ----------
function ScrollRail() {
  const { scrollYProgress } = useScroll()
  const progress = useSpring(scrollYProgress, { stiffness: 120, damping: 28 })
  return (
    <div aria-hidden className="hidden md:flex fixed right-5 top-1/2 -translate-y-1/2 z-40 flex-col items-center gap-3 pointer-events-none">
      <span className="font-mono text-[10px] tracking-[0.3em] text-dim [writing-mode:vertical-rl]">SCROLL</span>
      <div className="relative w-[2px] h-[36vh] rounded-full bg-white/8 overflow-hidden">
        <motion.div style={{ scaleY: progress }} className="absolute inset-0 origin-top bg-gradient-to-b from-ember-soft via-ember to-ember-deep" />
      </div>
      <span className="w-1.5 h-1.5 rounded-full bg-ember shadow-[0_0_12px_#ff5a1f]" />
    </div>
  )
}

// ---------- footer ----------
export function Footer() {
  return (
    <footer className="border-t border-white/8 bg-[#040407] pt-14 pb-8 relative overflow-hidden">
      <ScrollRail />
      <div className="max-w-7xl mx-auto px-5 md:px-8">
        <div className="grid md:grid-cols-[1.4fr_1fr_1fr_1fr] gap-8 mb-10">
          <div>
            <div className="flex items-center gap-2.5 font-display font-bold text-lg">
              <Brand />
            </div>
            <p className="text-sm text-muted mt-3 max-w-xs leading-relaxed">
              A physics-driven benchmark for LLM reasoning, creativity, and real-time decision-making — disguised as a Toribash-style sword duel.
            </p>
            <div className="flex gap-2 mt-4">
              <a href={LIVE_URL} target="_blank" rel="noopener" className="btn-primary text-[13px] font-bold px-4 py-2 rounded-[10px] text-white">⚔ Fight Now</a>
              <a href="https://github.com/sponsors/Cometbuster4969" target="_blank" rel="noopener" className="btn-ghost btn-shine text-[13px] font-semibold px-4 py-2 rounded-[10px]">💖 Sponsor</a>
            </div>
          </div>
          <div>
            <h2 className="text-[11px] tracking-[0.2em] uppercase text-dim mb-4 font-semibold">Arena</h2>
            {[['⚔ Live fights', LIVE_URL], ['📊 Leaderboard', LIVE_URL + 'leaderboard'], ['🏆 Tournaments', LIVE_URL + 'tournament'], ['📜 History', LIVE_URL + 'history']].map(([t, u]) => (
              <Link001 key={t} href={u} className="text-sm text-muted hover:text-ember-soft mb-2.5 w-fit">{t}</Link001>
            ))}
          </div>
          <div>
            <h2 className="text-[11px] tracking-[0.2em] uppercase text-dim mb-4 font-semibold">Code & Docs</h2>
            {[['★ GitHub repo', GH_URL], ['🐞 Issues', GH_URL + '/issues'], ['📖 METHODOLOGY.md', GH_URL + '/blob/main/METHODOLOGY.md'], ['📜 CITATION.cff', GH_URL + '/blob/main/CITATION.cff']].map(([t, u]) => (
              <Link001 key={t} href={u} className="text-sm text-muted hover:text-ember-soft mb-2.5 w-fit">{t}</Link001>
            ))}
          </div>
          <div>
            <h2 className="text-[11px] tracking-[0.2em] uppercase text-dim mb-4 font-semibold">Project</h2>
            <Link000 href="/research#research" onClick={(e) => { e.preventDefault(); navigate('/research', 'research') }} className="text-sm text-muted hover:text-ember-soft mb-2.5 w-fit">🔬 Frozen Eval Pack v1</Link000>
            <Link000 href="/about#roadmap" onClick={(e) => { e.preventDefault(); navigate('/about', 'roadmap') }} className="text-sm text-muted hover:text-ember-soft mb-2.5 w-fit">🛣️ Roadmap</Link000>
            <Link000 href="/about#team" onClick={(e) => { e.preventDefault(); navigate('/about', 'team') }} className="text-sm text-muted hover:text-ember-soft mb-2.5 w-fit">👥 Team</Link000>
            <Link002 href="mailto:btech10536.25@bitmesra.ac.in" className="text-sm text-muted hover:text-ember-soft mb-2.5 w-fit break-all">✉️ btech10536.25@bitmesra.ac.in</Link002>
          </div>
        </div>
        <div className="border-t border-white/8 pt-6 flex flex-col md:flex-row justify-between gap-3 font-mono text-[11.5px] text-dim">
          <span>© {new Date().getFullYear()} Ayush Kumar · BIT Mesra — pymunk × FastAPI × React</span>
          <span>Code: Apache 2.0 · Data: CC-BY-SA 4.0</span>
        </div>
      </div>
    </footer>
  )
}

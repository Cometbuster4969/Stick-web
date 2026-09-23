import { useEffect, useMemo, useRef, useState } from 'react'
import { useInView } from 'framer-motion'
import { GithubCalendar } from './ui/github-calendar'
import { AnimatedNumber } from './cult/animated-number'
import { useArenaLive } from '../lib/arena-live'
import { Reveal, SectionHead } from './ui'

// deterministic PRNG so the illustrative season looks identical every visit
function mulberry32(a) {
  return function () {
    a |= 0; a = (a + 0x6d2b79f5) | 0
    let t = Math.imul(a ^ (a >>> 15), 1 | a)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

// 52-week Sun–Sat grid ending today, tournament spikes every ~9 weeks
function buildPulseData() {
  const rand = mulberry32(20260914)
  const today = new Date(); today.setHours(12, 0, 0, 0)
  const start = new Date(today); start.setDate(start.getDate() - (51 * 7 + today.getDay()))
  const weeks = []
  let total = 0
  for (let w = 0; w < 52; w++) {
    const week = []
    for (let d = 0; d < 7; d++) {
      const date = new Date(start); date.setDate(start.getDate() + w * 7 + d)
      if (date > today) break
      const spike = w % 9 === 4 ? 2.1 : 1
      const weekend = d === 0 || d === 6 ? 0.55 : 1
      const roll = rand()
      const count = roll > 0.24 ? Math.min(9, Math.round((roll - 0.24) * 9 * spike * weekend)) : 0
      total += count
      const level = count >= 8 ? 'FOURTH_QUARTILE' : count >= 5 ? 'THIRD_QUARTILE' : count >= 3 ? 'SECOND_QUARTILE' : count >= 1 ? 'FIRST_QUARTILE' : 'NONE'
      week.push({
        color: '',
        contributionCount: count,
        contributionLevel: level,
        date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      })
    }
    weeks.push(week)
  }
  return { contributions: weeks, totalContributions: total }
}

function PulseStat({ value, suffix = '', label, color }) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-40px' })
  const [v, setV] = useState(0)
  useEffect(() => { if (inView) setV(value) }, [inView, value])
  return (
    <div ref={ref} className="glass rounded-2xl p-5 text-center">
      <div className={`font-display font-bold text-3xl md:text-4xl tabular-nums ${color}`}>
        <AnimatedNumber value={v} />{suffix}
      </div>
      <div className="text-xs text-muted mt-1.5">{label}</div>
    </div>
  )
}

export default function Pulse() {
  const live = useArenaLive()
  const data = useMemo(buildPulseData, [])
  return (
    <section id="pulse" className="scroll-mt-20 py-20 md:py-28 relative">
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[560px] h-[380px] bg-ember-deep/8 blur-[150px] rounded-full pointer-events-none" />
      <div className="max-w-7xl mx-auto px-5 md:px-8 relative">
        <SectionHead
          eyebrow="Arena Pulse" color="ember" title="The arena never sleeps."
          sub="A season of duels at a glance — nightly skirmishes, weekend majors, and the occasional 3AM pommel-only rebellion. Hover any cell."
        />
        <div className="grid grid-cols-3 gap-3 mb-4">
          <Reveal delay={0}><PulseStat value={live.stats.matches} label="lifetime matches" color="text-ember" /></Reveal>
          <Reveal delay={0.07}><PulseStat value={live.stats.votes} label="human blind votes" color="text-bone" /></Reveal>
          <Reveal delay={0.14}><PulseStat value={52} suffix="" label="weeks on the calendar" color="text-bone" /></Reveal>
        </div>
        <Reveal delay={0.1}>
          <div className="glass rounded-2xl p-5 md:p-7 overflow-x-auto">
            <GithubCalendar
              username="stickblade-arena"
              data={data}
              variant="city-lights"
              colorSchema="orange"
              shape="rounded"
              glowIntensity={6}
              showTotal={false}
              unitLabel="duels"
              className="mx-auto"
            />
            <p className="text-center font-mono text-[11px] text-dim mt-5">activity rhythm · illustrative season · live totals: {live.stats.matches} matches · {live.stats.votes} votes</p>
          </div>
        </Reveal>
      </div>
    </section>
  )
}
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Reveal, SectionHead, LiveChip } from './ui'
import { useArenaLive } from '../lib/arena-live'
import { WEAPONS, ARENAS } from '../data'

// ================= WEAPONS =================
const SPANS = ['md:col-span-3', 'md:col-span-3', 'md:col-span-2', 'md:col-span-2', 'md:col-span-2']

export function Weapons() {
  return (
    <section id="weapons" className="scroll-mt-20 py-20 md:py-28">
      <div className="max-w-7xl mx-auto px-5 md:px-8">
        <SectionHead
          eyebrow="Arsenal" color="gold" title="Five weapons. Five different PhDs."
          sub={<>Same arena, completely different benchmark per weapon. Elo is tracked separately for each — <b className="text-white">“DeepSeek the fencer”</b> and <b className="text-white">“DeepSeek the bowman”</b> rank independently.</>}
        />
        <div className="grid md:grid-cols-6 gap-3.5">
          {Object.values(WEAPONS).map((w, i) => (
            <Reveal key={w.name} delay={(i % 3) * 0.07} className={SPANS[i]}>
              <div className="glass card-hover spot rounded-2xl p-5 md:p-6 h-full group">
                <div className="text-[34px] group-hover:scale-110 transition-transform origin-left">{w.icon}</div>
                <h3 className="font-display font-bold text-[17px] mt-2">{w.name}</h3>
                <div className="font-mono text-[11px] text-ember-soft mt-1 leading-relaxed">{w.zones.join(' · ')}</div>
                <p className="text-[13px] text-muted mt-2.5 leading-relaxed">{w.note}</p>
                <div className="font-mono text-[11px] text-dim mt-3">reach <b className="text-gold">{w.reach}</b></div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}

// ================= ARENAS =================
const ARENA_BAR = {
  normal: 'from-zinc-500 to-zinc-300',
  ice: 'from-sky-400 to-cyan-200',
  moon: 'from-ember-soft to-gold',
}

export function Arenas() {
  return (
    <section id="arenas" className="scroll-mt-20 py-20 md:py-28 relative">
      <div className="absolute bottom-0 left-1/4 w-[500px] h-[400px] bg-ember/6 blur-[140px] rounded-full pointer-events-none" />
      <div className="max-w-7xl mx-auto px-5 md:px-8 relative">
        <SectionHead
          eyebrow="Arena Modifiers" color="cyan" title="Physics that punish assumptions."
          sub={<>Modifiers are surfaced in the state payload <b className="text-white">and</b> the system prompt — a well-tuned model adapts its footwork. One that assumes Earth-normal ballistics misses every shot.</>}
        />
        <div className="grid md:grid-cols-3 gap-3.5">
          {ARENAS.map((a, i) => (
            <Reveal key={a.t} delay={i * 0.08}>
              <div className="glass card-hover spot rounded-2xl p-6 h-full relative overflow-hidden">
                <div className={`absolute top-0 inset-x-0 h-[3px] bg-gradient-to-r ${ARENA_BAR[a.c]}`} />
                <h3 className="font-display font-bold text-xl">{a.e} {a.t}</h3>
                <p className="text-sm text-muted mt-2 leading-relaxed">{a.d}</p>
                <div className="font-mono text-[11.5px] bg-black/50 border border-white/8 rounded-xl px-3.5 py-2.5 mt-4 text-muted leading-[1.9]">
                  {a.p.map((l) => <div key={l}>{l}</div>)}
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}

// ================= VOTING =================
export function Voting() {
  const [voted, setVoted] = useState(null)
  return (
    <section id="voting" className="scroll-mt-20 py-20 md:py-28">
      <div className="max-w-7xl mx-auto px-5 md:px-8">
        <SectionHead
          eyebrow="Blind Evaluation + Elo" color="mint" title="You judge the fighting. Never the brand."
          sub={<>Brand anchoring is real eval bias. Identity is scrambled server-side, and Elo is tracked per <b className="text-white">(model, weapon, sharp-zone)</b> triple. Try a mock vote:</>}
        />
        <div className="grid lg:grid-cols-2 gap-4 items-start">
          <Reveal>
            <div className="glass rounded-2xl p-6 h-full">
              <h3 className="font-display font-bold text-lg">🔀 Server-side identity scramble</h3>
              <p className="text-sm text-muted mt-1.5">Which model becomes the green vs blue ragdoll is <strong className="text-white">randomized per match</strong>. The picker shows neutral Slot 1 / Slot 2 — color never leaks identity.</p>
              <div className="flex items-center justify-around py-7 font-mono text-[13px]">
                <div className="flex flex-col gap-3">
                  <div className="bg-white/4 border border-white/12 rounded-xl px-4 py-3 text-center">Slot 1<small className="block text-dim text-[10.5px]">GPT-OSS 120B</small></div>
                  <div className="bg-white/4 border border-white/12 rounded-xl px-4 py-3 text-center">Slot 2<small className="block text-dim text-[10.5px]">Llama 3.3 70B</small></div>
                </div>
                <div className="text-center">
                  <motion.span animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 3, ease: 'linear' }} className="text-[26px] inline-block">🎲</motion.span>
                  <div className="text-dim text-[10.5px] mt-1">random flip<br />per match</div>
                </div>
                <div className="flex flex-col gap-3">
                  <div className="bg-white/4 border border-fighter-a/50 rounded-xl px-4 py-3 text-center text-fighter-a">Fighter A<small className="block text-dim text-[10.5px]">🟢 green · ???</small></div>
                  <div className="bg-white/4 border border-fighter-b/50 rounded-xl px-4 py-3 text-center text-fighter-b">Fighter B<small className="block text-dim text-[10.5px]">🔵 blue · ???</small></div>
                </div>
              </div>
              <p className="text-[13px] text-muted">Vote on <strong className="text-white">form, tactics, kills</strong> — not the model name. Reveal + Elo deltas land after your vote, with the commentator’s roast.</p>
            </div>
          </Reveal>
          <Reveal delay={0.1}>
            <div className="rounded-2xl p-6 bg-gradient-to-b from-panel to-abyss border border-white/12 h-full">
              <h3 className="font-display font-bold text-[17px]">🗳️ Mock vote — who fought smarter?</h3>
              <p className="text-[13px] text-muted mt-1">Fighter A landed three clean thrusts · Fighter B panicked and faceplanted twice.</p>
              <div className="flex gap-2.5 my-4">
                {['A', 'B', 'Draw'].map((c) => (
                  <motion.button
                    key={c} whileHover={{ y: -2 }} whileTap={{ scale: 0.96 }} onClick={() => setVoted(c)}
                    className={`flex-1 py-3 rounded-xl font-bold text-sm border transition-all ${voted === c ? 'border-ember/60 bg-ember/10 text-ember' : 'border-white/12 bg-white/4 hover:border-ember/50'}`}
                  >
                    {c === 'A' ? '🟢 Fighter A' : c === 'B' ? '🔵 Fighter B' : '🤝 Draw'}
                  </motion.button>
                ))}
              </div>
              <AnimatePresence>
                {voted && (
                  <motion.div
                    key={voted} initial={{ opacity: 0, y: 12, scale: 0.98 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0 }}
                    className="border border-ember/30 bg-ember/5 rounded-xl p-4 text-[13.5px]"
                  >
                    <div><b>🎭 Reveal:</b> <span className="text-fighter-a">Fighter A was <b>Qwen3 32B</b></span> · <span className="text-fighter-b">Fighter B was <b>Llama 3.2 3B</b></span></div>
                    <div className="font-mono text-xs mt-2 text-ember-soft">Qwen3 32B · sword/tip · 1041 → 1057 (+16) · Llama 3.2 3B · 986 → 973 (−13)</div>
                    <div className="mt-2.5 italic text-muted border-l-[3px] border-ember pl-3">🎙️ Commentator: “Fighter B fought like the sword owed it money and the floor was lava. Technically both were true.”</div>
                  </motion.div>
                )}
              </AnimatePresence>
              <p className="text-xs text-dim mt-3.5">Standard Elo · K=32 · from 1000 · under 10 matches = <b className="text-gold">?</b> provisional · Win% shows 95% Wilson CI.</p>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  )
}

// ================= LEADERBOARD =================
const MEDAL = ['🥇', '🥈', '🥉', '4.', '5.', '6.']
const pct = (x) => (x == null || Number.isNaN(+x) ? '—' : `${Math.round(+x * 100)}%`)

export function Leaderboard() {
  const live = useArenaLive()
  const rows = live.board
  const max = Math.max(1, ...rows.map((r) => r.elo))
  return (
    <section id="board" className="scroll-mt-20 py-20 md:py-28 relative">
      <div className="absolute top-0 right-1/4 w-[440px] h-[440px] bg-gold/6 blur-[140px] rounded-full pointer-events-none" />
      <div className="max-w-7xl mx-auto px-5 md:px-8 relative">
        <SectionHead
          eyebrow="Live Rankings" color="gold" title="Per-weapon, per-zone Elo."
          sub="A model’s overall score hides huge skill gaps. Each (model, weapon, zone) cell ranks independently — fencer skill ≠ brawler skill ≠ bowman skill."
        />
        <Reveal>
          <div className="glass rounded-2xl overflow-hidden">
            <div className="flex flex-wrap items-center gap-2 px-5 py-4 border-b border-white/8">
              <span className="font-display font-bold">Human-Voted Elo</span>
              <span className="font-mono text-[11px] text-muted bg-white/5 px-2.5 py-1 rounded-lg border border-white/8">🗡 sword · tip sharp · macro · normal</span>
              <span className="ml-auto flex items-center gap-2">
                <LiveChip status={live.status} />
                <span className="font-mono text-[11px] text-dim hidden sm:inline">live from the arena · refreshes 60s</span>
              </span>
            </div>
            <div className="divide-y divide-white/6">
              {rows.length === 0 && (
                <div className="px-5 py-8 text-center text-sm text-muted">
                  Syncing the live board… (the backend may be waking up — cached rows appear here when available)
                </div>
              )}
              {rows.map((r, i) => (
                <motion.div
                  key={r.model}
                  initial={{ opacity: 0, x: -24 }} whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }} transition={{ delay: i * 0.07, duration: 0.5 }}
                  className="flex items-center gap-3 md:gap-4 px-5 py-3.5 hover:bg-white/[0.02] transition-colors"
                >
                  <span className="w-7 text-center font-bold text-muted">{MEDAL[i]}</span>
                  <div className="min-w-0 flex-1">
                    <div className="font-mono text-[13px] md:text-sm font-medium truncate">
                      {r.name}
                      {r.provisional && <span title="provisional — under 10 matches" className="ml-1.5 text-gold font-bold">?</span>}
                    </div>
                    <div className="h-1.5 rounded-full bg-white/6 mt-1.5 overflow-hidden max-w-md">
                      <motion.div
                        initial={{ width: 0 }} whileInView={{ width: `${(r.elo / max) * 100}%` }}
                        viewport={{ once: true }} transition={{ delay: 0.2 + i * 0.07, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                        className={`h-full rounded-full ${i === 0 ? 'bg-gradient-to-r from-gold to-amber-200' : 'bg-gradient-to-r from-ember/70 to-ember-deep/70'}`}
                      />
                    </div>
                  </div>
                  <span className="font-mono text-[11px] text-dim hidden sm:inline">Win {pct(r.wr)} · n={r.n} · CI {pct(r.lo)}–{pct(r.hi)}</span>
                  <span className={`font-display font-bold text-lg md:text-xl ${i === 0 ? 'text-gold' : ''}`}>{r.elo}</span>
                </motion.div>
              ))}
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  )
}

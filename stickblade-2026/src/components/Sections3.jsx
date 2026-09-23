import { useMemo, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Reveal, SectionHead, CountUp, goTo, LiveChip, LIVE_URL, GH_URL } from './ui'
import { TerminalTheater } from './ui/terminal-theater'
import { useArenaLive } from '../lib/arena-live'
import { FEATURES, ENDPOINTS, SHIPPED, COMING, FAQS, STACK } from '../data'

// ================= FEATURES =================
export function Features() {
  return (
    <section id="features" className="scroll-mt-20 py-20 md:py-28">
      <div className="max-w-7xl mx-auto px-5 md:px-8">
        <SectionHead
          eyebrow="Key Features" color="magenta" title="A benchmark that feels alive."
          sub="Every system serves the eval: killcam helps you judge the lethal moment, the ticker keeps you watching real inference, failover keeps matches fair."
        />
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {FEATURES.map((f, i) => (
            <Reveal key={f.t} delay={(i % 4) * 0.06}>
              <div className="glass card-hover spot rounded-2xl p-5 h-full group">
                <div className="text-[26px] group-hover:scale-125 transition-transform origin-left inline-block">{f.e}</div>
                <h4 className="font-display font-bold text-[15px] mt-2.5">{f.t}</h4>
                <p className="text-[12.5px] text-muted mt-1 leading-relaxed">{f.d}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}

// ================= TOURNAMENTS =================
const BMatch = ({ a, b, sa, sb, wa, delay }) => (
  <motion.div
    initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
    transition={{ delay, duration: 0.5 }}
    className="border border-white/12 rounded-xl overflow-hidden min-w-[200px] bg-white/[0.02] font-mono text-[13px]"
  >
    <div className="px-3.5 py-2.5 border-b border-white/8 flex justify-between gap-3">
      <span className={wa ? 'text-ember font-bold' : 'text-dim line-through'}>{a}</span><span className="text-dim">{sa}</span>
    </div>
    <div className="px-3.5 py-2.5 flex justify-between gap-3">
      <span className={!wa ? 'text-ember font-bold' : 'text-dim line-through'}>{b}</span><span className="text-dim">{sb}</span>
    </div>
  </motion.div>
)

export function Tournaments() {
  return (
    <section id="tournaments" className="scroll-mt-20 py-20 md:py-28 relative">
      <div className="absolute top-10 left-1/3 w-[480px] h-[380px] bg-ember/6 blur-[140px] rounded-full pointer-events-none" />
      <div className="max-w-7xl mx-auto px-5 md:px-8 relative">
        <SectionHead
          eyebrow="Brackets" color="gold" title="Tournaments: 4 or 8 models enter."
          sub="Standard seeding (#1 vs #N) so top seeds can’t meet until the final. Small open-source models sometimes upset frontier giants — tighter motor patterns the big model “overthinks”."
        />
        <Reveal>
          <div className="glass rounded-2xl overflow-hidden">
            <div className="caution h-2.5 w-full opacity-80" aria-hidden />
            <div className="p-6 md:p-8 relative">
              <div
                aria-hidden
                className="absolute inset-0 pointer-events-none opacity-[0.5]"
                style={{ backgroundImage: 'repeating-linear-gradient(-45deg, rgba(236,231,220,0.025) 0 2px, transparent 2px 14px)' }}
              />
              <div className="relative flex flex-wrap justify-center gap-y-6 gap-x-4 md:gap-x-10 items-stretch">
              <div className="flex flex-col justify-center gap-4">
                <h5 className="text-[10.5px] tracking-[0.25em] uppercase text-dim text-center font-semibold">Semifinals</h5>
                <BMatch a="GPT-OSS 120B" b="Llama 3.1 8B" sa="KO" sb="T9" wa delay={0} />
                <BMatch a="DeepSeek R1 70B" b="Qwen3 32B" sa="T11" sb="KO" wa={false} delay={0.12} />
              </div>
              <div className="flex flex-col justify-center gap-4">
                <h5 className="text-[10.5px] tracking-[0.25em] uppercase text-dim text-center font-semibold">Final</h5>
                <BMatch a="GPT-OSS 120B" b="Qwen3 32B" sa="KO" sb="T7" wa delay={0.24} />
              </div>
              <div className="flex flex-col justify-center gap-4">
                <h5 className="text-[10.5px] tracking-[0.25em] uppercase text-dim text-center font-semibold">Champion</h5>
                <motion.div
                  initial={{ opacity: 0, scale: 0.85 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }}
                  transition={{ delay: 0.4, type: 'spring', stiffness: 120 }}
                  className="border border-gold/60 rounded-xl px-5 py-4 text-center font-display font-bold text-gold text-[15px] shadow-[0_0_36px_rgba(255,200,87,0.22)] bg-gold/5"
                >
                  👑 GPT-OSS 120B
                </motion.div>
              </div>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  )
}

// ================= RESEARCH =================
export function Research() {
  return (
    <section id="research" className="scroll-mt-20 py-20 md:py-28">
      <div className="max-w-7xl mx-auto px-5 md:px-8">
        <SectionHead
          eyebrow="Research & Reproducibility" color="gold" title="Frozen Evaluation Pack v1."
          sub={<>Live leaderboards fluctuate. The frozen pack is a <b className="text-white">citable, deterministic regression suite</b> — fixed seeds, pinned prompts, locked roster — so researchers can verify results locally.</>}
        />
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-4">
          {[
            [<CountUp key="a" end={100} />, 'deterministic matchups · 20 per weapon', 'text-ember'],
            [<CountUp key="b" end={22} />, 'LLMs + scripted baseline bots (noise floor)', 'text-ember'],
            ['2→36', 'median objective_n per model after the pack', 'text-ember-soft'],
            ['$0.05', 'total API compute · 199 min · PROMPT v15', 'text-gold'],
          ].map(([v, l, c], i) => (
            <Reveal key={l} delay={i * 0.07}>
              <div className="glass card-hover rounded-2xl p-5 text-center h-full">
                <div className={`font-display font-bold text-3xl md:text-4xl ${c}`}>{v}</div>
                <div className="text-xs text-muted mt-1.5 leading-relaxed">{l}</div>
              </div>
            </Reveal>
          ))}
        </div>
        <Reveal>
          <div className="border border-gold/30 bg-gold/5 rounded-2xl p-6 md:p-7">
            <h4 className="font-display font-bold text-gold text-[17px]">📉 The honest null: perceived Elo ≠ mechanical win-rate</h4>
            <p className="text-sm md:text-[15px] text-muted mt-2 leading-relaxed">
              Merging organic + frozen matches (<strong className="text-white">n=14 shared models</strong>) found{' '}
              <code className="font-mono text-gold bg-gold/10 px-2 py-0.5 rounded-md text-[13px]">Spearman ρ = +0.148, p = 0.629, 95% CI [−0.450, +0.712]</code>{' '}
              between human-voted Elo and objective win-rate. Humans reward <strong className="text-white">spatial planning and tactical patience</strong> over
              clumsy button-mashing that happens to win. The gap <em>is</em> the signal — it justifies the dual-leaderboard design. Full protocol in{' '}
              <strong className="text-white">METHODOLOGY.md</strong>.
            </p>
          </div>
        </Reveal>
      </div>
    </section>
  )
}

// ================= API =================
const ARCH_BE = [
  ['server.py', 'FastAPI · queues · LIVE_STATE ticker · /api/debug/*'],
  ['main.py', '24-turn orchestration · arena-aware physics'],
  ['brains.py', 'Mock/GPT/Gemini/OpenRouter · 429 breaker · buddy failover'],
  ['joint_mode.py', 'per-joint flex/extend/relax + bow fire'],
  ['ragdoll.py', 'pymunk fighter · 16 limbs · 10 servo joints'],
  ['combat.py', 'zone classifier · sharp-vs-blunt resolution'],
  ['storage*.py', 'SQLite · Supabase + atomic apply_elo_vote() RPC'],
  ['security.py', 'rate limits · spend caps · spoof-resistant IP'],
]
const ARCH_FE = [
  ['app/page.js', 'setup + leaderboard + reveal + vote'],
  ['app/tournament', 'bracket creator + live viewer'],
  ['app/leaderboard · history · replay', 'per-zone boards · recents · share links'],
  ['public/player.js', 'canvas engine + WebAudio + killcam (single source)'],
  ['components/WaitPanel', 'quips + queue + ticker + H2H + recents'],
  ['components/ModelPicker', 'neutral Slot 1/2 · no color leak'],
  ['lib/api.js', 'fetch client + keepalive + head-to-head'],
  ['next.config.mjs', 'strict CSP + COOP + HSTS preload'],
]

export function ApiDocs() {
  const live = useArenaLive()
  const lastId = live.recent[0]?.match_id ?? null
  const tabs = useMemo(() => {
    const top3 = live.board.slice(0, 3)
    return [
      {
        label: 'GET /api/recent',
        command: 'curl $API/api/recent | jq ".[0] | {match_id, sharp, turns}"',
        lines: [
          { text: `latest replay  →  /replay/${lastId ?? '…'} · match #${lastId ?? '…'} complete`, color: 'code-str' },
          { text: `next match no. →  #${lastId != null ? lastId + 1 : live.stats.matches + 1}`, color: 'code-num' },
          { text: `tonight's zones →  ${(live.recent.slice(0, 4).map((m) => m.sharp).filter(Boolean).join(' · ') || 'tip · edge · pommel')}`, color: 'text-muted' },
          { text: '// newest-first · the site polls this every 15s', color: 'code-com' },
        ],
      },
      {
        label: 'GET /api/leaderboard',
        command: 'curl $API/api/leaderboard | jq "sort_by(-.rating) | .[0:3]"',
        lines: top3.length
          ? [
              ...top3.map((r, i) => ({
                text: `#${i + 1} ${r.name} · ${r.elo} · ${r.w}W/${r.l}L${r.provisional ? ' · provisional' : ''}`,
                color: i === 0 ? 'code-num' : 'text-muted',
              })),
              { text: '// Elo per (model, sharp, weapon) · refreshes 60s', color: 'code-com' },
            ]
          : [
              { text: '// board syncing… cached rows land here when the backend answers', color: 'code-com' },
            ],
      },
      {
        label: 'GET /api/stats/vote_rate',
        command: 'curl $API/api/stats/vote_rate | jq .lifetime',
        lines: [
          { text: `lifetime done  →  ${live.stats.matches}`, color: 'code-num' },
          { text: `human voted    →  ${live.stats.votes}`, color: 'code-num' },
          { text: `vote-through   →  ${(live.stats.rate * 100).toFixed(1)}%`, color: 'code-str' },
          { text: '// every counter on this site reads this route', color: 'code-com' },
        ],
      },
    ]
  }, [live.board, live.recent, live.stats, lastId])
  return (
    <section id="api" className="scroll-mt-20 py-20 md:py-28 relative">
      <div className="absolute bottom-0 right-0 w-[460px] h-[460px] bg-ember/6 blur-[140px] rounded-full pointer-events-none" />
      <div className="max-w-7xl mx-auto px-5 md:px-8 relative">
        <SectionHead
          eyebrow="Under the Hood" color="cyan" title="Production stack, open API."
          sub={<>Frontend and backend are independent and stateless across each other — the web app only knows <b className="text-white">NEXT_PUBLIC_API_BASE</b> and talks REST. Physics at 60Hz with 2× substeps.</>}
        />
        <div className="grid lg:grid-cols-2 gap-3.5 mb-5">
          <Reveal>
            <div className="glass rounded-2xl p-6 h-full">
              <h4 className="font-mono text-sm text-ember mb-4">◈ stickblade/ — Python backend</h4>
              <ul className="font-mono text-[12.5px] flex flex-col gap-2.5">
                {ARCH_BE.map(([f, d]) => (
                  <li key={f}><b className="text-white">{f}</b> <span className="text-dim">{d}</span></li>
                ))}
              </ul>
            </div>
          </Reveal>
          <Reveal delay={0.08}>
            <div className="glass rounded-2xl p-6 h-full">
              <h4 className="font-mono text-sm text-ember mb-4">◈ stickblade-web/ — Next.js 15 frontend</h4>
              <ul className="font-mono text-[12.5px] flex flex-col gap-2.5">
                {ARCH_FE.map(([f, d]) => (
                  <li key={f}><b className="text-white">{f}</b> <span className="text-dim">{d}</span></li>
                ))}
              </ul>
            </div>
          </Reveal>
        </div>
        <Reveal>
          <div className="overflow-x-auto rounded-2xl border border-white/8">
            <table className="w-full text-sm min-w-[640px]">
              <thead>
                <tr className="bg-white/4 text-left">
                  <th className="px-5 py-3.5 text-[11.5px] uppercase tracking-wider text-muted">Method</th>
                  <th className="px-5 py-3.5 text-[11.5px] uppercase tracking-wider text-muted">Path</th>
                  <th className="px-5 py-3.5 text-[11.5px] uppercase tracking-wider text-muted">Purpose</th>
                </tr>
              </thead>
              <tbody>
                {ENDPOINTS.map((e) => (
                  <tr key={e.p} className="border-t border-white/8 hover:bg-white/[0.02] transition-colors">
                    <td className="px-5 py-2.5"><span className={`font-mono text-[11.5px] px-2 py-1 rounded-md ${e.m === 'GET' ? 'bg-ember/10 text-ember' : 'bg-gold/10 text-gold'}`}>{e.m}</span></td>
                    <td className="px-5 py-2.5 font-mono text-[12.5px] text-ember-soft whitespace-nowrap">{e.p}</td>
                    <td className="px-5 py-2.5 text-muted text-[13.5px]">{e.d}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Reveal>
        <Reveal delay={0.05}>
          <div className="flex flex-wrap gap-2 mt-4">
            {STACK.map((s) => (
              <span key={s} className="text-xs px-3 py-1.5 rounded-full border border-white/12 bg-white/3 text-muted">{s}</span>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  )
}

// ================= ROADMAP =================
export function Roadmap() {
  return (
    <section id="roadmap" className="scroll-mt-20 py-20 md:py-28">
      <div className="max-w-7xl mx-auto px-5 md:px-8">
        <SectionHead
          eyebrow="Roadmap" color="purple" title="Shipped fast. Honest about what’s next."
          sub="Built solo in ~4 months. Every claim maps to a merged change — and the limitations are published, not buried."
        />
        <div className="grid lg:grid-cols-[1.2fr_0.8fr] gap-3.5">
          <Reveal>
            <div className="rounded-2xl p-6 border border-ember/25 bg-ember/[0.03] h-full">
              <h4 className="font-display font-bold text-[17px] mb-4">✅ Shipped (2026-06 → 2026-09)</h4>
              <ul className="grid sm:grid-cols-2 gap-x-5 gap-y-2.5 text-[13px] text-muted">
                {SHIPPED.map(([t, d], i) => (
                  <motion.li key={t} initial={{ opacity: 0, x: -10 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.03 }} className="flex gap-2">
                    <span className="text-ember">✅</span><span><b className="text-white font-semibold">{t}</b> — {d}</span>
                  </motion.li>
                ))}
              </ul>
            </div>
          </Reveal>
          <Reveal delay={0.08}>
            <div className="rounded-2xl p-6 border border-gold/25 bg-gold/[0.03] h-full">
              <h4 className="font-display font-bold text-[17px] mb-4">🟦 Coming next</h4>
              <ul className="flex flex-col gap-2.5 text-[13px] text-muted">
                {COMING.map(([t, d], i) => (
                  <motion.li key={t} initial={{ opacity: 0, x: -10 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.05 }} className="flex gap-2">
                    <span>🟦</span><span><b className="text-white font-semibold">{t}</b>{d ? ` — ${d}` : ''}</span>
                  </motion.li>
                ))}
              </ul>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  )
}

// ================= TEAM =================
export function Team() {
  return (
    <section id="team" className="scroll-mt-20 py-20 md:py-28">
      <div className="max-w-7xl mx-auto px-5 md:px-8">
        <SectionHead
          eyebrow="Team & Transparency" color="cyan" title="Solo-built. Radically honest numbers."
          sub={<>567 lifetime matches · 121 human votes · 25% vote-through · <b className="text-white">₹0 revenue</b>. Cross-benchmark correlation reports NULL under converged limits — published, not hidden.</>}
        />
        <div className="grid md:grid-cols-2 gap-3.5">
          <Reveal>
            <div className="glass card-hover rounded-2xl p-6 flex gap-4 items-center">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-ember to-ember-deep flex items-center justify-center font-display font-bold text-2xl text-void shrink-0">AK</div>
              <div>
                <h4 className="font-display font-bold text-[17px]">Ayush Kumar</h4>
                <div className="text-[13px] text-ember font-semibold">Founder · BIT Mesra ECE ’29 · 100% of code</div>
                <p className="text-[13px] text-muted mt-1">Physics engine, LLM brains, frontend, eval methodology, frozen pack, CI. 19, building the benchmark the agentic era needs.</p>
              </div>
            </div>
          </Reveal>
          <Reveal delay={0.08}>
            <div className="glass card-hover rounded-2xl p-6 flex gap-4 items-center">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-zinc-600 to-zinc-800 flex items-center justify-center font-display font-bold text-2xl text-muted shrink-0">?</div>
              <div>
                <h4 className="font-display font-bold text-[17px]">Co-founder (BITS Pilani Hyderabad)</h4>
                <div className="text-[13px] text-muted font-semibold">Product & research strategy · joining at grant approval</div>
                <p className="text-[13px] text-muted mt-1">Genuine founding partnership — equity split, joint development, Pvt. Ltd. on funding. Team risk, stated plainly.</p>
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  )
}

// ================= FAQ =================
export function Faq() {
  const [open, setOpen] = useState(0)
  return (
    <section id="faq" className="scroll-mt-20 py-20 md:py-28">
      <div className="max-w-4xl mx-auto px-5 md:px-8">
        <SectionHead eyebrow="FAQ" color="gold" title="Real questions, straight answers." />
        <div className="flex flex-col gap-2.5">
          {FAQS.map((f, i) => (
            <Reveal key={f.q} delay={Math.min(i * 0.04, 0.2)}>
              <div className={`border rounded-2xl overflow-hidden bg-white/[0.015] transition-colors ${open === i ? 'border-ember/40' : 'border-white/8'}`}>
                <button
                  onClick={() => setOpen(open === i ? -1 : i)}
                  aria-expanded={open === i}
                  aria-controls={`faq-panel-${i}`}
                  id={`faq-button-${i}`}
                  className="w-full flex justify-between items-center gap-3 px-5 py-4.5 py-4 font-bold text-[15px] text-left"
                >
                  {f.q}
                  <motion.span animate={{ rotate: open === i ? 45 : 0 }} className="text-ember text-xl leading-none shrink-0" aria-hidden>+</motion.span>
                </button>
                <AnimatePresence initial={false}>
                  {open === i && (
                    <motion.div
                      key="c" initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }} className="overflow-hidden"
                      role="region" id={`faq-panel-${i}`} aria-labelledby={`faq-button-${i}`}
                    >
                      <p className="px-5 pb-5 text-sm text-muted leading-relaxed">{f.a}</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}

// ================= CTA =================
// "Fight alerts" email capture (skiper106 smooth-input spirit, dialkit-free):
// spring-physics focus caret, honest success state — alerts ship via releases.
function FightAlerts() {
  const [email, setEmail] = useState('')
  const [focus, setFocus] = useState(false)
  const [done, setDone] = useState(false)
  if (done) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
        className="mt-8 mx-auto max-w-md rounded-2xl border border-ember/40 bg-ember/8 px-5 py-4"
      >
        <div className="font-bold text-[15px]"><span aria-hidden>🔔</span> Noted — alerts ship via GitHub releases.</div>
        <p className="text-[13px] text-muted mt-1">No newsletter infrastructure yet, so no fake promises. Watch the repo and you’ll never miss a season.</p>
        <a href={GH_URL} target="_blank" rel="noopener" className="btn-ghost btn-shine inline-flex items-center gap-2 font-semibold text-sm px-4 py-2.5 rounded-xl mt-3">
          <span aria-hidden>★</span> Watch the repo
        </a>
      </motion.div>
    )
  }
  return (
    <form
      className="mt-8 mx-auto max-w-md"
      onSubmit={(e) => { e.preventDefault(); if (email.includes('@')) setDone(true) }}
    >
      <label htmlFor="fight-alerts-email" className="font-mono text-[11px] tracking-[0.25em] uppercase text-dim font-semibold">
        <span aria-hidden>🔔</span> Fight alerts
      </label>
      <div className="relative mt-2.5">
        <motion.div
          aria-hidden
          animate={{ opacity: focus ? 1 : 0, scale: focus ? 1 : 0.97 }}
          transition={{ type: 'spring', stiffness: 380, damping: 26 }}
          className="absolute -inset-[2px] rounded-2xl bg-gradient-to-r from-ember/60 via-ember-soft/40 to-ember/60 blur-[6px]"
        />
        <div className="relative flex gap-2 rounded-2xl border border-white/12 bg-void/80 p-1.5 backdrop-blur">
          <input
            id="fight-alerts-email"
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            onFocus={() => setFocus(true)}
            onBlur={() => setFocus(false)}
            placeholder="you@arena.gg"
            className="flex-1 min-w-0 bg-transparent px-3.5 py-2.5 text-[14px] placeholder:text-dim focus:outline-none"
          />
          <motion.button
            whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.96 }}
            type="submit"
            className="btn-primary shrink-0 font-bold text-sm px-5 py-2.5 rounded-xl text-white"
          >
            Notify me
          </motion.button>
        </div>
      </div>
    </form>
  )
}

export function Cta() {
  return (
    <section className="py-20 md:py-28">
      <div className="max-w-5xl mx-auto px-5 md:px-8">
        <Reveal>
          <div className="relative rounded-[28px] border border-white/12 px-6 py-14 md:py-20 text-center overflow-hidden bg-abyss">
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_70%_90%_at_50%_0%,rgba(255,90,31,0.16),transparent)]" />
            <div className="absolute inset-0 bg-grid-faint [mask-image:radial-gradient(ellipse_60%_60%_at_50%_40%,black,transparent)]" />
            <div className="relative">
              <motion.div aria-hidden animate={{ rotate: [0, -8, 8, 0] }} transition={{ repeat: Infinity, duration: 5 }} className="text-5xl mb-4">⚔️</motion.div>
              <h2 className="font-display font-bold tracking-tight text-3xl md:text-5xl leading-tight">
                Stop testing file managers.<br />Start testing <span className="text-gradient">fighters.</span>
              </h2>
              <p className="text-muted mt-4 max-w-xl mx-auto">Pick two models, set the sharp zone, and watch them think with swords in ~60 seconds. Free forever. Open source. Blind-voted.</p>
              <div className="flex flex-wrap gap-3 justify-center mt-8">
                <motion.a
                  whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}
                  href={LIVE_URL} target="_blank" rel="noopener"
                  className="btn-primary group font-bold text-[15px] px-7 py-4 rounded-xl text-white inline-flex items-center gap-2.5"
                >
                  <span aria-hidden>⚔</span> Fight Now
                  <span aria-hidden className="relative inline-flex w-5 h-5 overflow-hidden">
                    <span className="absolute inset-0 transition-transform duration-300 group-hover:translate-x-5">→</span>
                    <span className="absolute inset-0 -translate-x-5 transition-transform duration-300 group-hover:translate-x-0">→</span>
                  </span>
                </motion.a>
                <motion.a whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }} href={GH_URL} target="_blank" rel="noopener" className="btn-ghost btn-shine font-semibold text-[15px] px-7 py-4 rounded-xl">
                  <span aria-hidden>★</span> Star on GitHub
                </motion.a>
              </div>
              <p className="font-mono text-[11px] text-dim mt-3.5">Opens stickblade-arena.vercel.app in a new tab ↗</p>
              <FightAlerts />
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  )
}
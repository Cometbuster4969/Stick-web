import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Reveal, SectionHead, CopyBtn } from './ui'
import { WEAPONS, STEPS, MACRO_ACTIONS } from '../data'
import { BallotTally } from './ui/ballot-tally'

// ================= PROBLEM =================
const QUOTES = [
  ['I think it’s a very cool project!', '@viblo — creator of Pymunk, Official Showcase'],
  ['A brilliant example of gamified AI evaluation', 'Google AI Overview — on Stickblade Arena'],
  ['Turn 7: spatial + HP + tactical reasoning in one turn — executed 4 turns later for the kill', 'Match proof — GPT-OSS 120B vs Llama 3.3 70B'],
]
const TABLE = [
  ['Static knowledge', '✅ MMLU, ARC', '— not tested', 'yes', 'no'],
  ['Code synthesis', '✅ HumanEval, SWE-bench', '— not tested', 'yes', 'no'],
  ['Multi-turn coherence', '❌ mostly single-turn', '✅ 24 turns of state continuity', 'no', 'yes'],
  ['Real-time deadline', '❌ no time budget', '✅ ≤15s per turn or forfeit', 'no', 'yes'],
  ['Spatial reasoning', '◐ math word problems', '✅ continuous 2D physics + velocity vectors', 'part', 'yes'],
  ['Constraint satisfaction', '◐ partial', '✅ only chosen zones do damage', 'part', 'yes'],
  ['Creativity by outcome', '❌ judged by prose', '✅ judged by who lands kills', 'no', 'yes'],
  ['Adversarial pressure', '❌ opponent is fixed', '✅ opponent is another adapting LLM', 'no', 'yes'],
  ['Blind human eval', '◐ Chatbot Arena (chat only)', '✅ + server-side identity scramble', 'part', 'yes'],
  ['Embodied / motor planning', '❌', '✅ JOINT mode — Toribash-style joints', 'no', 'yes'],
]
const cell = (v) => (v === 'yes' ? 'text-ember' : v === 'no' ? 'text-dim' : 'text-gold')

export function Problem() {
  return (
    <section id="why" className="scroll-mt-20 py-20 md:py-28">
      <div className="max-w-7xl mx-auto px-5 md:px-8">
        <div className="grid md:grid-cols-3 gap-3.5 mb-16">
          {QUOTES.map(([q, by], i) => (
            <Reveal key={by} delay={i * 0.08}>
              <figure className="glass card-hover spot rounded-2xl p-5 h-full">
                <blockquote className="text-[15px] italic leading-relaxed">“{q}”</blockquote>
                <figcaption className="text-xs text-muted mt-3">— <b className="text-gold">{by.split('—')[0]}</b>{by.includes('—') ? ' —' + by.split('—').slice(1).join('—') : ''}</figcaption>
              </figure>
            </Reveal>
          ))}
        </div>
        <SectionHead
          eyebrow="The Problem" color="red" title={<>Today’s benchmarks treat LLMs like humans.</>}
          sub={<>A model can ace MMLU or a 4000-rated Codeforces problem by pattern-matching its training data — then collapse the moment the environment changes. Stickblade tests the opposite axis: <b className="text-white">open-ended, real-time tactical reasoning under physical constraints, judged by human eyes.</b></>}
        />
        <div className="grid md:grid-cols-2 gap-4">
          <Reveal>
            <div className="glass card-hover rounded-2xl p-6 md:p-7 h-full">
              <h3 className="font-display font-bold text-xl mb-3">🪤 Trap 1 · The Memorization Loop</h3>
              <p className="text-muted text-[15px] leading-relaxed">
                If a human solves a 4000-rated Codeforces question, they’re a <strong className="text-white">generational prodigy</strong> — only
                4–5 people alive hold that rating. But tough questions just stitch 5–6 hard concepts together. For an LLM trained on the
                whole internet, <strong className="text-white">every one of those concepts is already indexed</strong>. It isn’t thinking — it’s
                copy-pasting and arranging. A <strong className="text-white">very smart file manager that also explains itself</strong>.
              </p>
              <div className="font-mono text-[12.5px] bg-black/50 border border-white/8 rounded-xl px-4 py-3 mt-4 text-ember-soft">tough question = 5 known concepts × recall — zero novelty required</div>
            </div>
          </Reveal>
          <Reveal delay={0.1}>
            <div className="glass card-hover rounded-2xl p-6 md:p-7 h-full">
              <h3 className="font-display font-bold text-xl mb-3">🛣️ Trap 2 · The Static Goal</h3>
              <p className="text-muted text-[15px] leading-relaxed">
                Every DSA problem has a <strong className="text-white">golden roadmap</strong> — one optimal path. Follow it and you pass.
                But real life is dynamic: even crossing a road has <strong className="text-white">no single optimal solution</strong>. Empty road? Run.
                Traffic? Wait 2 minutes. Rush hour? Wait 10. <strong className="text-white">Situational, multi-turn reasoning under pressure</strong> is
                completely ignored by current benchmarks.
              </p>
              <div className="font-mono text-[12.5px] bg-black/50 border border-white/8 rounded-xl px-4 py-3 mt-4 text-ember">real world = no golden roadmap — adapt or fail, every single turn</div>
            </div>
          </Reveal>
        </div>
        <Reveal delay={0.1}>
          <div className="overflow-x-auto rounded-2xl border border-white/8 mt-5">
            <table className="w-full text-sm min-w-[660px]">
              <thead>
                <tr className="bg-white/4 text-left">
                  <th className="px-5 py-3.5 text-[11.5px] uppercase tracking-wider text-muted font-semibold">Capability</th>
                  <th className="px-5 py-3.5 text-[11.5px] uppercase tracking-wider text-muted font-semibold">Standard benchmarks</th>
                  <th className="px-5 py-3.5 text-[11.5px] uppercase tracking-wider text-muted font-semibold">Stickblade Arena</th>
                </tr>
              </thead>
              <tbody>
                {TABLE.map(([c, s, st, cs, ct]) => (
                  <tr key={c} className="border-t border-white/8 hover:bg-white/[0.02] transition-colors">
                    <td className="px-5 py-3 font-semibold whitespace-nowrap">{c}</td>
                    <td className={`px-5 py-3 ${cell(cs)}`}>{s}</td>
                    <td className={`px-5 py-3 ${cell(ct)} font-medium`}>{st}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Reveal>
      </div>
    </section>
  )
}

// ================= TWIST LAB =================

const BALLOT_ITEMS = [
  { id: 'bow', name: '🏹 Bow — count shaft grazes', votes: 48, detail: 'tumbling/deflected arrows should deal partial damage' },
  { id: 'flail', name: '⛓ Flail — lower the spike speed gate', votes: 36, detail: 'HIGH-only spikes end too many duels in timeouts' },
  { id: 'dagger', name: '🔪 Dagger — widen the clinch window', votes: 29, detail: '<70px is brutal for reasoning-heavy models' },
  { id: 'spear', name: '🥄 Spear — sudden-death clinch round', votes: 21, detail: 'past the spike = a pommel-only overtime' },
  { id: 'sword', name: '🗡 Sword — keep it the untouched baseline', votes: 17, detail: 'the control condition; change nothing' },
]

const CHAOS = ['☢️ Open Chaos', 'Forgiving, bloody, fast. Tactical nuance collapses into raw aggression and reaction speed.']
const PILLOW = ['🛋️ The Pillow Fight', 'Nothing is lethal — pure shoving, tripping and humiliation. Surprisingly useful for isolating footwork and balance recovery.']

export function TwistLab() {
  const [w, setW] = useState('sword')
  const [zones, setZones] = useState(new Set(['tip']))
  const W = WEAPONS[w]
  const toggle = (z) => setZones((p) => { const n = new Set(p); n.has(z) ? n.delete(z) : n.add(z); return n })
  const pick = (k) => { setW(k); setZones(new Set([WEAPONS[k].zones[0]])) }

  let style, desc, cls
  if (zones.size === 0) { [style, desc] = PILLOW; cls = 'text-dim' }
  else if (zones.size === 1) { const s = W.single[[...zones][0]]; style = s[0]; desc = s[1]; cls = /Brawler|Basher|Reverser/.test(style) ? 'text-blood' : 'text-ember' }
  else { [style] = CHAOS; desc = `${zones.size} lethal zones — ${[...zones].join(' + ')}. ` + CHAOS[1]; cls = 'text-gold' }

  return (
    <section id="twist" className="scroll-mt-20 py-20 md:py-28 relative">
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-ember/8 blur-[140px] rounded-full pointer-events-none" />
      <div className="max-w-7xl mx-auto px-5 md:px-8 relative">
        <SectionHead
          eyebrow="The Core Mechanic" color="magenta"
          title={<>The sharp-zone twist <span className="text-dim">breaks memorized swordsmanship.</span></>}
          sub={<>LLMs have read every fencing tutorial on the internet. So <b className="text-white">you decide which part of the weapon deals damage</b>. Set pommel-only and any model that blindly slashes deals <b className="text-white">zero damage</b>. Try it live:</>}
        />
        <Reveal>
          <div className="glass rounded-3xl overflow-hidden">
            <div className="flex flex-wrap gap-2.5 p-5 border-b border-white/8">
              {Object.entries(WEAPONS).map(([k, v]) => (
                <motion.button
                  key={k} whileTap={{ scale: 0.95 }} onClick={() => pick(k)}
                  className={`px-4 py-2.5 rounded-xl border font-bold text-sm transition-all ${w === k ? 'bg-ember/12 border-ember/70 shadow-[0_0_20px_rgba(255,90,31,0.25)]' : 'border-white/12 bg-white/3 hover:border-ember/50'}`}
                >
                  {v.icon} {v.name}
                </motion.button>
              ))}
            </div>
            <div className="grid lg:grid-cols-[1.1fr_0.9fr]">
              <div className="p-6 border-b lg:border-b-0 lg:border-r border-white/8">
                <div className="bg-black/50 border border-white/8 rounded-2xl p-4 [&_svg]:w-full [&_svg]:h-auto">
                  {W.svg(zones)}
                </div>
              </div>
              <div className="p-6">
                <h3 className="text-[11px] tracking-[0.2em] uppercase text-muted mb-3 font-semibold">☠ Select lethal zones</h3>
                <div className="flex flex-wrap gap-2 mb-5">
                  {W.zones.map((z) => (
                    <button
                      key={z} onClick={() => toggle(z)}
                      className={`font-mono text-xs px-3.5 py-2 rounded-full border transition-all ${zones.has(z) ? 'bg-ember/15 border-ember/70 text-ember-soft font-bold' : 'border-white/12 text-muted hover:border-ember/60 hover:text-white'}`}
                    >
                      {zones.has(z) ? '☠ ' : '· '}{z}
                    </button>
                  ))}
                </div>
                <AnimatePresence mode="wait">
                  <motion.div
                    key={w + [...zones].sort().join(',')}
                    initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}
                    transition={{ duration: 0.3 }}
                    className="border border-white/10 rounded-2xl p-5 bg-white/[0.02]"
                  >
                    <div className={`font-display font-bold text-[22px] ${cls}`}>{style}</div>
                    <p className="text-sm text-muted mt-1.5 leading-relaxed">{desc}</p>
                    <div className="flex gap-5 mt-3.5 font-mono text-xs text-dim">
                      <span>reach <b className="text-muted">{W.reach}</b></span>
                      <span>zones <b className="text-muted">{zones.size} of {W.zones.length} lethal</b></span>
                    </div>
                  </motion.div>
                </AnimatePresence>
              </div>
            </div>
          </div>
        </Reveal>
        <Reveal delay={0.1}>
          <div className="glass rounded-3xl p-6 md:p-8 mt-4">
            <h3 className="font-display font-bold text-xl">🗳️ Community ballot — which weapon rule should change next?</h3>
            <p className="text-sm text-muted mt-1.5">Up-vote the tweaks you want to see in the arena. The list re-sorts live as the community weighs in.</p>
            <BallotTally items={BALLOT_ITEMS} />
          </div>
        </Reveal>
      </div>
    </section>
  )
}

// ================= HOW IT WORKS =================
const STATE_LINES = [
  <span key={0}><span className="code-com">{'// turn 4 of 24 · both fighters get this · ≤15s to answer'}</span></span>,
  <span key={1}>{'{ '}<span className="code-key">"turn"</span>{': '}<span className="code-num">4</span>{', '}<span className="code-key">"turns_left"</span>{': '}<span className="code-num">20</span>{', '}<span className="code-key">"my_hp"</span>{': '}<span className="code-num">67.3</span>{', '}<span className="code-key">"enemy_hp"</span>{': '}<span className="code-num">80.1</span>{','}</span>,
  <span key={2}>{'  '}<span className="code-key">"distance"</span>{': '}<span className="code-num">142</span>{','}</span>,
  <span key={3}>{'  '}<span className="code-key">"me"</span>{': { '}<span className="code-key">"torso"</span>{': ['}<span className="code-num">412</span>{', '}<span className="code-num">150</span>{'], '}<span className="code-key">"head"</span>{': ['}<span className="code-num">412</span>{', '}<span className="code-num">191</span>{'],'}</span>,
  <span key={4}>{'          '}<span className="code-key">"facing"</span>{': '}<span className="code-num">1</span>{', '}<span className="code-key">"velocity"</span>{': ['}<span className="code-num">30</span>{', '}<span className="code-num">-2</span>{'] },'}</span>,
  <span key={5}>{'  '}<span className="code-key">"relative"</span>{': { '}<span className="code-key">"dx"</span>{': '}<span className="code-num">142</span>{', '}<span className="code-key">"enemy_is"</span>{': '}<span className="code-str">"right"</span>{','}</span>,
  <span key={6}>{'               '}<span className="code-key">"facing_enemy"</span>{': '}<span className="code-bool">true</span>{' },'}</span>,
  <span key={7}>{'  '}<span className="code-key">"enemy_last_action"</span>{': '}<span className="code-str">"guard_high"</span>{','}</span>,
  <span key={8}>{'  '}<span className="code-key">"my_last_action"</span>{': '}<span className="code-str">"thrust"</span>{','}</span>,
  <span key={9}>{'  '}<span className="code-key">"last_turn_hits"</span>{': [{ '}<span className="code-key">"by"</span>{': '}<span className="code-str">"enemy"</span>{', '}<span className="code-key">"zone"</span>{': '}<span className="code-str">"edge"</span>{','}</span>,
  <span key={10}>{'    '}<span className="code-key">"damage"</span>{': '}<span className="code-num">4.1</span>{', '}<span className="code-key">"was_sharp"</span>{': '}<span className="code-bool">false</span>{' }]'}</span>,
  <span key={11}>{'}'}</span>,
  <span key={12}><span className="code-com">{'→ answer: {"action": "rising_slash", "footwork": "lunge"}'}</span></span>,
]
const STATE_COPY = '{"turn":4,"turns_left":20,"my_hp":67.3,"enemy_hp":80.1,"distance":142,"me":{"torso":[412,150],"head":[412,191],"facing":1,"velocity":[30,-2]},"relative":{"dx":142,"enemy_is":"right","facing_enemy":true},"enemy_last_action":"guard_high","my_last_action":"thrust"}'
const THINKS = [
  ['📍 Spatial reasoning —', 'interpret relative.dx, velocity, facing_enemy. Tiny models swing while facing the wrong way and whiff.'],
  ['🔗 Plan continuity —', 'my_last_action + enemy_last_action demand multi-turn coherence. Random play loses to a windup → strike loop.'],
  ['⛓️ Constraint satisfaction —', 'only user-marked zones do real damage. Always-swing-edge vs tip-only = lose every fight.'],
  ['🩹 Recovery —', 'knocked down? Switch from offense to defense. Panic-thrashers get dismantled.'],
  ['⏱️ Deadline discipline —', '≤15s per turn or forfeit to fallback. No redrafts, no apologies, no “let me think again.”'],
]

export function HowItWorks() {
  return (
    <section id="how" className="scroll-mt-20 py-20 md:py-28">
      <div className="max-w-7xl mx-auto px-5 md:px-8">
        <SectionHead
          eyebrow="End-to-End" color="cyan" title="How a match works."
          sub={<>Pick two models, hit <b className="text-white">Fight</b>, and watch a full duel in ~60 seconds. The physics engine is the referee. You’re the judge.</>}
        />
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
          {STEPS.map((s, i) => (
            <Reveal key={s.n} delay={(i % 3) * 0.08}>
              <div className="glass card-hover rounded-2xl p-5.5 p-5 h-full">
                <div className="font-mono text-xs font-bold text-void bg-gradient-to-br from-ember to-ember-deep w-8 h-8 rounded-[10px] flex items-center justify-center mb-3.5">{s.n}</div>
                <h3 className="font-display font-bold text-[16px] mb-1.5">{s.t}</h3>
                <p className="text-[13.5px] text-muted leading-relaxed">{s.d}</p>
              </div>
            </Reveal>
          ))}
        </div>
        <div className="grid lg:grid-cols-[1.15fr_0.85fr] gap-4 mt-5">
          <Reveal>
            <div className="rounded-2xl overflow-hidden border border-white/12 bg-[#12100d] h-full">
              <div className="flex items-center gap-2 px-4 py-3 border-b border-white/8 font-mono text-xs text-muted">
                <span className="flex gap-1.5"><i className="w-2.5 h-2.5 rounded-full bg-[#33291f] block" /><i className="w-2.5 h-2.5 rounded-full bg-[#33291f] block" /><i className="w-2.5 h-2.5 rounded-full bg-[#33291f] block" /></span>
                <span className="ml-1">turn_04.json → what the LLM sees</span>
                <span className="ml-auto"><CopyBtn text={STATE_COPY} /></span>
              </div>
              <motion.pre
                initial="hidden" whileInView="show" viewport={{ once: true, margin: '-80px' }}
                transition={{ staggerChildren: 0.12 }}
                className="p-5 font-mono text-[12.5px] leading-[1.7] overflow-x-auto"
              >
                {STATE_LINES.map((l, i) => (
                  <motion.div key={i} variants={{ hidden: { opacity: 0, x: -14 }, show: { opacity: 1, x: 0 } }}>{l}</motion.div>
                ))}
                <motion.span variants={{ hidden: { opacity: 0 }, show: { opacity: 1 } }} className="inline-block w-2 h-4 bg-ember animate-blink align-middle" />
              </motion.pre>
            </div>
          </Reveal>
          <div className="flex flex-col gap-2.5">
            {THINKS.map(([b, d], i) => (
              <Reveal key={b} delay={i * 0.06}>
                <div className="border border-white/8 rounded-xl px-4 py-3.5 bg-white/[0.02] text-[13.5px] leading-relaxed">
                  <b className="text-ember">{b}</b> <span className="text-muted">{d}</span>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

// ================= MODES =================
const JOINT_COPY = '{"thought":"Coil the sword arm, then release.","joints":{"shoulder":"extend","elbow":"flex","grip":"hold","hip_f":"flex","knee_f":"flex","neck":"hold"},"footwork":"advance","fire":false}'

export function Modes() {
  const [tab, setTab] = useState('macro')
  return (
    <section id="modes" className="scroll-mt-20 py-20 md:py-28 relative">
      <div className="absolute top-1/3 -left-40 w-[460px] h-[460px] bg-ember-deep/10 blur-[140px] rounded-full pointer-events-none" />
      <div className="max-w-7xl mx-auto px-5 md:px-8 relative">
        <SectionHead
          eyebrow="Two Control Modes" color="purple" title="Strategic mind vs motor cortex."
          sub="Strong MACRO players are sometimes terrible at JOINT — they understand chess-like moves but can’t compose “extend shoulder + flex elbow” into a coherent swing."
        />
        <Reveal>
          <div className="flex flex-col sm:flex-row gap-2.5 mb-4">
            <button onClick={() => setTab('macro')} className={`flex-1 p-4 rounded-2xl border text-center transition-all ${tab === 'macro' ? 'border-ember/70 bg-ember/8 shadow-[0_0_28px_rgba(255,90,31,0.15)]' : 'border-white/12 bg-white/[0.02] hover:border-white/25'}`}>
              <div className="font-display font-bold text-[17px]">♟️ MACRO <span className="text-[10.5px] text-ember-soft font-bold">· DEFAULT</span></div>
              <div className="text-[13px] text-muted mt-0.5">One named tactical move per turn — the strategic test</div>
            </button>
            <button onClick={() => setTab('joint')} className={`flex-1 p-4 rounded-2xl border text-center transition-all ${tab === 'joint' ? 'border-ember/70 bg-ember/8 shadow-[0_0_28px_rgba(255,90,31,0.15)]' : 'border-white/12 bg-white/[0.02] hover:border-white/25'}`}>
              <div className="font-display font-bold text-[17px]">🦾 JOINT <span className="text-[10.5px] text-ember font-bold">· TRUE TORIBASH</span></div>
              <div className="text-[13px] text-muted mt-0.5">Raw per-joint flex / extend / hold / relax — the motor test</div>
            </button>
          </div>
        </Reveal>
        <AnimatePresence mode="wait">
          {tab === 'macro' ? (
            <motion.div key="macro" initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.3 }} className="glass rounded-2xl p-6">
              <h3 className="font-display font-bold text-lg mb-1.5">♟️ MACRO — pick a tactic + footwork</h3>
              <p className="text-muted text-sm mb-4">The engine animates the named keyframe and runs physics for 3s. Footwork: <span className="code-inline">advance / retreat / lunge / hop_back / hold</span></p>
              <div className="flex flex-col gap-2.5">
                {MACRO_ACTIONS.map((g) => (
                  <div key={g.w} className="flex flex-wrap gap-1.5 items-center">
                    <span className="font-mono text-xs px-3 py-1.5 rounded-lg bg-ember/8 border border-ember/25 text-ember-soft mr-1">{g.w}</span>
                    {g.a.map((a) => (
                      <span key={a} className="font-mono text-xs px-3 py-1.5 rounded-lg bg-ember/8 border border-ember/25 text-ember-soft">{a}</span>
                    ))}
                  </div>
                ))}
              </div>
            </motion.div>
          ) : (
            <motion.div key="joint" initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.3 }} className="grid lg:grid-cols-2 gap-4">
              <div className="rounded-2xl overflow-hidden border border-white/12 bg-[#12100d]">
                <div className="flex items-center gap-2 px-4 py-3 border-b border-white/8 font-mono text-xs text-muted">
                  <span className="flex gap-1.5"><i className="w-2.5 h-2.5 rounded-full bg-[#33291f] block" /><i className="w-2.5 h-2.5 rounded-full bg-[#33291f] block" /><i className="w-2.5 h-2.5 rounded-full bg-[#33291f] block" /></span>
                  <span className="ml-1">joint_action.json</span>
                  <span className="ml-auto"><CopyBtn text={JOINT_COPY} /></span>
                </div>
                <pre className="p-5 font-mono text-[12.5px] leading-[1.7] overflow-x-auto">
                  <span className="code-com">{'// JOINT mode · every joint, every turn · bow: "fire": true'}</span>{'\n'}
                  {'{ '}<span className="code-key">"thought"</span>{': '}<span className="code-str">"Coil the sword arm, then release."</span>{','}{'\n'}
                  {'  '}<span className="code-key">"joints"</span>{': {'}{'\n'}
                  {'    '}<span className="code-key">"shoulder"</span>{': '}<span className="code-str">"extend"</span>{', '}<span className="code-key">"elbow"</span>{': '}<span className="code-str">"flex"</span>{', '}<span className="code-key">"grip"</span>{': '}<span className="code-str">"hold"</span>{','}{'\n'}
                  {'    '}<span className="code-key">"hip_f"</span>{': '}<span className="code-str">"flex"</span>{', '}<span className="code-key">"knee_f"</span>{': '}<span className="code-str">"flex"</span>{', '}<span className="code-key">"neck"</span>{': '}<span className="code-str">"hold"</span>{'\n'}
                  {'  },'}{'\n'}
                  {'  '}<span className="code-key">"footwork"</span>{': '}<span className="code-str">"advance"</span>{', '}<span className="code-key">"fire"</span>{': '}<span className="code-bool">false</span>{' }'}
                </pre>
              </div>
              <div className="flex flex-col gap-2.5">
                {[['🦾 Every joint, every turn —', 'shoulder, elbow, grip, hips, knees, neck: flex (drive +), extend (drive −), hold (lock), relax (floppy).'],
                  ['🏹 Bows —', 'set "fire": true to loose an arrow mid-turn. Timing + aim + stance, all at once.'],
                  ['🌀 Emergent chaos —', 'produces the most surprising kills — and the most spectacular faceplants. Mesmerizing either way.']].map(([b, d]) => (
                  <div key={b} className="border border-white/8 rounded-xl px-4 py-3.5 bg-white/[0.02] text-[13.5px]">
                    <b className="text-ember">{b}</b> <span className="text-muted">{d}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  )
}
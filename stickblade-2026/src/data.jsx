// ---------- shared content for the Stickblade Arena 2026 site ----------

// SVG styling helpers for the sharp-zone lab
const shape = (active, z, extra = {}) => ({
  fill: active.has(z) ? 'rgba(255,90,31,.30)' : '#241f1a',
  stroke: active.has(z) ? '#ff5a1f' : '#57503f',
  strokeWidth: 1.5,
  filter: active.has(z) ? 'drop-shadow(0 0 7px rgba(255,90,31,.9))' : undefined,
  transition: 'all .25s',
  ...extra,
});
const label = (active, z) => ({
  fill: active.has(z) ? '#ff8b4d' : '#8a8474',
  fontWeight: active.has(z) ? 700 : 400,
});
const TL = { fontFamily: 'JetBrains Mono, monospace', fontSize: 9.5, textAnchor: 'middle' };

export const MODELS = [
  'GPT-OSS 120B (Groq)', 'Llama 3.3 70B (Groq)', 'DeepSeek R1 Distill 70B',
  'Kimi K2 (Groq)', 'GPT-OSS 20B', 'Gemma 4 31B', 'Nemotron 3 Super 120B',
  'GPT-4o mini', 'Llama 3.1 8B', 'Cohere North Mini', 'Mock Duelist', 'Scripted Pro 🏆',
];

export const WEAPONS = {
  sword: {
    name: 'Sword', icon: '🗡', reach: 'medium',
    zones: ['tip', 'edge', 'back_edge', 'pommel'],
    note: 'The baseline. Balanced reach and damage — every other weapon is judged against it.',
    single: {
      tip: ['🤺 The Fencer', 'Patient spacing, thrusts at exact range, guards between exchanges. The baseline every model understands — until you take the tip away.'],
      edge: ['⚔️ The Duelist', 'Slashing exchanges, horizontal cuts, edge alignment. Classic aggressive swordplay with full blade commitment.'],
      back_edge: ['🌀 The Trickster', 'Back-edge cuts need reversed wrist angles and weird body mechanics. Models that only know tutorials look drunk here.'],
      pommel: ['🥊 The Brawler', 'Grip flips, clinch entries, hilt smashes to the head. Deeply counter-intuitive — memorized fencing priors actively hurt.'],
    },
    svg: (a) => (
      <svg viewBox="0 0 320 130">
        <text x="160" y="16" style={{ ...TL, ...label(a, '') }}>SWORD — click zones →</text>
        <circle cx="36" cy="70" r="13" style={shape(a, 'pommel')} />
        <text x="36" y="105" style={{ ...TL, ...label(a, 'pommel') }}>pommel</text>
        <rect x="49" y="64" width="26" height="12" rx="3" fill="#33291f" />
        <rect x="72" y="48" width="8" height="44" rx="2" fill="#57503f" />
        <rect x="80" y="56" width="150" height="13" style={shape(a, 'back_edge')} />
        <rect x="80" y="69" width="150" height="13" style={shape(a, 'edge')} />
        <polygon points="230,56 268,69 230,82" style={shape(a, 'tip')} />
        <text x="130" y="48" style={{ ...TL, ...label(a, 'back_edge') }}>back_edge</text>
        <text x="150" y="105" style={{ ...TL, ...label(a, 'edge') }}>edge</text>
        <text x="258" y="105" style={{ ...TL, ...label(a, 'tip') }}>tip</text>
      </svg>
    ),
  },
  dagger: {
    name: 'Dagger', icon: '🔪', reach: 'short · clinch <70px',
    zones: ['tip', 'edge', 'back_edge', 'pommel'],
    note: 'Half-length, lighter, faster recovery. Small models survive shockingly well here.',
    single: {
      tip: ['🗡️ The Assassin', 'Explosive lunges into clinch, tip-first. Reach is tiny — positioning is everything, hesitation is death.'],
      edge: ['🔪 The Slasher', 'Fast flurries at grappling range, rapid recovery. Rewards aggression over planning.'],
      back_edge: ['🌀 The Trickster', 'Reverse-grip weirdness at knife range. Almost no training data covers this — pure reasoning test.'],
      pommel: ['🥊 The Brawler', 'Pistol-grip the blade and skull-thump with the pommel. Absurd, effective, hilarious to watch.'],
    },
    svg: (a) => (
      <svg viewBox="0 0 320 130">
        <text x="160" y="16" style={{ ...TL, ...label(a, '') }}>DAGGER — half-length, fast recovery</text>
        <circle cx="86" cy="70" r="12" style={shape(a, 'pommel')} />
        <text x="86" y="105" style={{ ...TL, ...label(a, 'pommel') }}>pommel</text>
        <rect x="98" y="64" width="22" height="12" rx="3" fill="#33291f" />
        <rect x="118" y="50" width="7" height="40" rx="2" fill="#57503f" />
        <rect x="125" y="58" width="80" height="11" style={shape(a, 'back_edge')} />
        <rect x="125" y="69" width="80" height="11" style={shape(a, 'edge')} />
        <polygon points="205,58 232,69 205,80" style={shape(a, 'tip')} />
        <text x="165" y="48" style={{ ...TL, ...label(a, 'back_edge') }}>back_edge</text>
        <text x="165" y="105" style={{ ...TL, ...label(a, 'edge') }}>edge</text>
        <text x="228" y="105" style={{ ...TL, ...label(a, 'tip') }}>tip</text>
      </svg>
    ),
  },
  spear: {
    name: 'Spear', icon: '🥄', reach: 'very long · kill 120–180px',
    zones: ['tip', 'shaft', 'butt'],
    note: 'Thrust kingdom at the 120–180px kill zone. Let them past the spike and you are dead.',
    single: {
      tip: ['🎯 The Pikeman', 'Hold the 120–180px kill zone, thrust on approach, retreat to re-establish. Clinch range is death.'],
      shaft: ['🏒 The Basher', 'Shaft checks and sweeps — a staff-fighting game with a spear’s length. Footwork-heavy, timing-heavy.'],
      butt: ['🔄 The Reverser', 'Spin the spear and butt-stroke. Enormous weapon, tiny lethal zone at the wrong end. Glorious chaos.'],
    },
    svg: (a) => (
      <svg viewBox="0 0 320 130">
        <text x="160" y="16" style={{ ...TL, ...label(a, '') }}>SPEAR — thrust kingdom, clinch is death</text>
        <circle cx="26" cy="70" r="10" style={shape(a, 'butt')} />
        <text x="26" y="105" style={{ ...TL, ...label(a, 'butt') }}>butt</text>
        <rect x="36" y="66" width="200" height="7" rx="3" style={shape(a, 'shaft')} />
        <text x="136" y="48" style={{ ...TL, ...label(a, 'shaft') }}>shaft</text>
        <polygon points="236,58 268,70 236,82" style={shape(a, 'tip')} />
        <text x="258" y="105" style={{ ...TL, ...label(a, 'tip') }}>tip</text>
      </svg>
    ),
  },
  flail: {
    name: 'Flail', icon: '⛓', reach: 'medium · momentum',
    zones: ['ball', 'spikes', 'chain', 'handle'],
    note: 'spin_up for 2 turns, then strike. Spikes only count at high speed.',
    single: {
      ball: ['⚒️ The Crusher', 'Whirl 2 turns to build speed, then overhead_smash. Raw momentum — swing early and it bounces off.'],
      spikes: ['🌟 The Shredder', 'Spikes only count at HIGH speed. Patience → spin_up → perfect release. The hardest timing in the arena.'],
      chain: ['⛓ The Entangler', 'Chain wraps and yank_backs. Unpredictable physics, unblockable angles, unreadable telemetry.'],
      handle: ['🥢 The Improviser', 'Hold the ball, jab with the stick. Everything you know about flails is now wrong. Adapt.'],
    },
    svg: (a) => (
      <svg viewBox="0 0 320 130">
        <text x="160" y="16" style={{ ...TL, ...label(a, '') }}>FLAIL — spin_up first, then strike</text>
        <rect x="30" y="60" width="60" height="16" rx="6" style={shape(a, 'handle')} />
        <text x="60" y="105" style={{ ...TL, ...label(a, 'handle') }}>handle</text>
        <line x1="90" y1="68" x2="170" y2="68" strokeDasharray="7 5" strokeWidth="5" style={shape(a, 'chain')} />
        <text x="130" y="48" style={{ ...TL, ...label(a, 'chain') }}>chain</text>
        <circle cx="205" cy="68" r="20" style={shape(a, 'ball')} />
        <circle cx="205" cy="68" r="27" fillOpacity=".35" style={shape(a, 'spikes')} />
        <text x="205" y="115" style={{ ...TL, ...label(a, 'ball') }}>ball</text>
        <text x="262" y="48" style={{ ...TL, ...label(a, 'spikes') }}>spikes (speed-gated)</text>
      </svg>
    ),
  },
  bow: {
    name: 'Bow', icon: '🏹', reach: 'ranged · ballistics',
    zones: ['arrowhead', 'arrow_shaft', 'bow_limb'],
    note: 'Unlimited arrows, real ballistics. Bow_limb is the melee fallback.',
    single: {
      arrowhead: ['🏹 The Marksman', 'Lead the target, compensate drop (~24px at range), loose at the right frame. Pure applied physics exam.'],
      arrow_shaft: ['🎋 The Trickshot', 'Only shaft contact counts — grazing, tumbling, deflected arrows. Nearly impossible. Models hate this.'],
      bow_limb: ['🪃 The Basher', 'No arrows matter — it’s a melee stick now. bow_bash and pray. The archer’s nightmare scenario.'],
    },
    svg: (a) => (
      <svg viewBox="0 0 320 130">
        <text x="160" y="16" style={{ ...TL, ...label(a, '') }}>BOW — arrows drop, lead your shots</text>
        <path d="M110,25 Q60,68 110,111" fill="none" strokeWidth="7" style={shape(a, 'bow_limb')} />
        <text x="70" y="48" style={{ ...TL, ...label(a, 'bow_limb') }}>bow_limb</text>
        <line x1="105" y1="68" x2="225" y2="68" strokeWidth="5" style={shape(a, 'arrow_shaft')} />
        <text x="165" y="48" style={{ ...TL, ...label(a, 'arrow_shaft') }}>arrow_shaft</text>
        <polygon points="225,60 245,68 225,76" style={shape(a, 'arrowhead')} />
        <text x="248" y="105" style={{ ...TL, ...label(a, 'arrowhead') }}>arrowhead</text>
        <text x="160" y="122" style={TL}>drop ≈ 24px · flight ≈ 0.20s</text>
      </svg>
    ),
  },
};

export const STEPS = [
  { n: '01', t: '🎯 You set the rules', d: 'Pick two models, a weapon, sharp[] zones, arena and mode. POST /api/match queues the fight.' },
  { n: '02', t: '🔀 Server scrambles identity', d: 'A random flip maps models → green/blue canvas sides. Even the host can’t tell which is which.' },
  { n: '03', t: '🗣️ Trash talk in ~5–15s', d: 'Each model throws a pre-fight one-liner, streamed instantly with queue position and head-to-head card.' },
  { n: '04', t: '🧠 24 turns · think → sim → resolve', d: 'Both brains get compressed JSON, must reply in ≤15s, then 3s of 60fps pymunk resolves hits.' },
  { n: '05', t: '🎬 Replay + killcam + SFX', d: '~5KB of replay JSON plays back on canvas with synthesized WebAudio clangs and slow-mo killcam.' },
  { n: '06', t: '🗳️ Blind vote → reveal + Elo', d: 'You vote A/B on who fought smarter. Reveal shows names, Elo deltas, and the commentator’s roast.' },
];

export const MACRO_ACTIONS = [
  { w: '🗡 sword / 🔪 dagger', a: ['thrust', 'overhead_slash', 'horizontal_slash', 'rising_slash', 'pommel_strike', 'guard_high', 'guard_low', 'ready'] },
  { w: '⛓ flail', a: ['spin_up', 'overhead_smash', 'wide_swing', 'yank_back', 'handle_jab', 'guard_high', 'guard_low', 'ready'] },
  { w: '🏹 bow', a: ['draw_shot', 'quick_shot', 'high_arc_shot', 'bow_bash', 'guard_high', 'guard_low', 'ready'] },
];

export const ARENAS = [
  { c: 'normal', e: '🏟', t: 'Normal', d: 'Standard stone floor. The control condition — every claim is measured against this.', p: ['friction = 1.5 · damping = 0.99', 'gravity = 1.0× (earth)'] },
  { c: 'ice', e: '❄', t: 'Ice', d: 'Friction ×0.10, slides last ~2× longer. Smart models prefer advance/hold over lunge.', p: ['floor friction × 0.10 · shin μ → 0.2', 'damping → 0.996 · slides ~2× longer'] },
  { c: 'moon', e: '🌙', t: 'Low Gravity', d: 'Bigger arcs, slower falls. Brutal for spear thrusts and bow arcs. Ballistics priors shatter.', p: ['y-gravity × 0.35 (moon-ish)', 'arcs float · drops shrink'] },
];

export const FEATURES = [
  { e: '🎬', t: 'Killcam', d: 'Auto slow-motion replay of the lethal blow with cinematic letterbox bars.' },
  { e: '🔊', t: 'Synthesized SFX', d: 'WebAudio clangs, thuds, hit-stop chime. Zero assets, CSP-clean.' },
  { e: '📡', t: 'Live wait screen', d: 'Quips in ~5–15s, queue position, spoiler-safe ticker, H2H card, recents.' },
  { e: '🏆', t: 'Tournaments', d: '4/8-model single-elim brackets, live viewer, auto-advance, champion card.' },
  { e: '🗣️', t: 'Trash talk + roast', d: 'Pre-fight one-liners; a third LLM roasts the loser post-vote.' },
  { e: '🔥', t: 'Predict streaks', d: 'Call the winner before voting. Streaks in localStorage.' },
  { e: '🔑', t: 'BYOK', d: 'Your OpenRouter key, your quota. localStorage-only, scrubbed from logs.' },
  { e: '🔀', t: 'Multi-provider failover', d: 'Retry ladder crosses OpenRouter → Groq automatically. 21 + 8 models.' },
  { e: '🛡️', t: '429 circuit breaker', d: 'Per-model cooldowns + buddy pools + scripted fallback banner.' },
  { e: '🔗', t: 'Shareable replays', d: 'Tiny deterministic JSON. /replay links always show the true winner.' },
  { e: '🐞', t: 'Debug endpoints', d: 'brain_errors · cooldowns · openrouter_ping. Full transparency.' },
  { e: '📊', t: 'Per-zone Elo cells', d: 'Ratings per (model, weapon, zone, mode, arena).' },
];

export const ENDPOINTS = [
  { m: 'GET', p: '/api/health', d: 'Liveness + flags (providers, queue depths)' },
  { m: 'GET', p: '/api/models', d: 'Roster · /api/weapons for valid zones' },
  { m: 'POST', p: '/api/match', d: 'Queue a match {models, sharp[], weapon, arena, mode, blind}' },
  { m: 'GET', p: '/api/match/{mid}', d: 'Status + blind-safe .live {quips, queue, log[]}' },
  { m: 'GET', p: '/api/replay/{mid}', d: 'Compact replay JSON (frames, events, thoughts)' },
  { m: 'POST', p: '/api/vote/{mid}', d: '{a|b|draw} → reveal + Elo deltas + roast' },
  { m: 'GET', p: '/api/leaderboard', d: 'Elo per (model, sharp, weapon) + filters' },
  { m: 'GET', p: '/api/head_to_head', d: 'Order-insensitive H2H (?a=X&b=Y)' },
  { m: 'POST', p: '/api/tournament', d: 'Queue + poll single-elim brackets (4/8)' },
  { m: 'GET', p: '/api/debug/*', d: 'brain_errors · cooldowns · openrouter_ping' },
];

export const SHIPPED = [
  ['Multi-provider backend (Groq)', '8 LPU models, 288× free-tier quota, auto failover'],
  ['BYOK', 'your key, your quota, localStorage-only, scrubbed from logs'],
  ['Live wait screen', 'quips, queue, ticker, H2H card, recents feed'],
  ['429 circuit breaker + buddy failover', 'catalog-driven reasoning policy'],
  ['Atomic Elo RPC', 'on Postgres · self-play = draw, 0 delta'],
  ['Tournaments', '4/8-model single-elim + live bracket viewer'],
  ['Killcam + WebAudio SFX', '+ predict-then-watch streaks'],
  ['Arena modifiers that bite', 'ice damping + shin friction, LLM-informed'],
  ['Frozen Eval Pack v1', '100 seeded matchups, citable baseline'],
  ['252-case pytest suite', '+ replay smoke + audit regressions'],
  ['Strict CSP/COOP/HSTS', '+ XFF-spoof hardening + rate limits'],
  ['Pymunk Showcase + PeerPush Bronze', '+ GitHub Sponsors'],
];

export const COMING = [
  ['Daily challenge', 'rotating weapon/zone, shared global board'],
  ['OG-image generator', 'for /replay links (social previews)'],
  ['GIF/MP4 killcam export', 'client-side'],
  ['2v2 team battles', ''],
  ['Live thought streaming', 'during THINK phase'],
  ['BYOA + concurrent matches', 'premium tier (₹499/mo hypothesis)'],
  ['Enterprise white-label evals', '+ compliance-grade reports'],
];

export const FAQS = [
  { q: 'Wait — is this a game?', a: 'No. There’s no controllable character, no XP, no player skill. It’s closer to Chatbot Arena — a human-in-the-loop benchmark. Chatbot Arena rates models on text; this rates them on decision-making under adversarial physical constraints. The stickmen exist because you need to see the physics to judge the decisions.' },
  { q: 'Why does a match take a full minute?', a: 'Each turn is a real LLM API call per fighter — 5–15s of actual model inference — plus 3s of simulated physics. Reasoning-heavy models take longer. If it were faster, the models wouldn’t be thinking — they’d be reflex-responding, which defeats the point.' },
  { q: 'Why hide model identities until I vote?', a: 'Brand anchoring is real bias. Knowing “green is GPT-4o” would make you rate its moves charitably. Blind voting means you rate behavior on its own merits — same methodology as Chatbot Arena, RLHF preference datasets, and serious human eval.' },
  { q: 'Why can’t LMSYS or Hugging Face clone this in a weekend?', a: 'Technically, they can. The moat isn’t code — it’s methodology, first-mover brand in embodied evals, and a published citation graph including a null-result correlation study. That takes 6–12 months of lead time.' },
  { q: 'Your correlation is NULL — doesn’t that prove inconsistency?', a: 'Opposite — it proves necessity. If human Elo and mechanical win-rate correlated perfectly, one leaderboard would be redundant. Voters reward spatial planning and restraint; raw win-rate rewards clumsy aggression that happens to connect. The gap is the benchmark’s signal.' },
  { q: 'Physics has floating-point non-determinism — how is this science?', a: 'Matches are reproducible per-seed with hard-pinned prompt versions — practical determinism meeting the Databricks offline-online consistency standard. Statistical conclusions are stable.' },
  { q: 'Can I use my own model or API key?', a: 'Yes. The setup panel has a BYOK toggle — paste any OpenRouter key and any model ID they route to. The backend uses your key for that one match only, then discards it: never logged, never persisted, scrubbed from error buffers by regex.' },
  { q: 'How do I cite this work?', a: 'Use the “Cite this repository ▾” button in the GitHub sidebar (auto-generated from CITATION.cff). Code is Apache 2.0, match data is CC-BY-SA 4.0 with an open /api/export endpoint.' },
];

export const LEADERBOARD = [
  { m: 'GPT-OSS 120B (Groq)', w: '🗡', z: 'tip', elo: 1142, wr: '68%', n: 31 },
  { m: 'Qwen3 32B', w: '🗡', z: 'tip', elo: 1089, wr: '61%', n: 26 },
  { m: 'DeepSeek R1 70B', w: '🗡', z: 'tip', elo: 1057, wr: '57%', n: 22 },
  { m: 'Llama 3.3 70B (Groq)', w: '🗡', z: 'tip', elo: 1013, wr: '52%', n: 28 },
  { m: 'Kimi K2 (Groq)', w: '🗡', z: 'tip', elo: 978, wr: '46%', n: 17 },
  { m: 'Llama 3.2 3B', w: '🗡', z: 'tip', elo: 931, wr: '38%', n: 19 },
];

export const STACK = [
  '⚛️ React 19 · Vite · Canvas 2D', '🐍 FastAPI · Python 3.13 · pymunk',
  '🗄️ Supabase Postgres · SQLite', '🧠 OpenRouter · Groq LPU · OpenAI · Gemini',
  '☁️ Vercel + HF Spaces', '🔊 WebAudio (no assets)',
  '🔒 CSP · COOP · HSTS · Trusted Types',
];
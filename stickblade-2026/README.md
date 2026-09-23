⚔️ STICKBLADE ARENA — 2026 Showcase Site (React Edition)
A cinematic, motion-rich showcase website for Stickblade Arena — the physics-grounded LLM benchmark where two language models sword-fight in real 2D physics.

Built with React 19 + Vite + Tailwind CSS v4 + Framer Motion + Lenis smooth scrolling. Fonts are self-hosted via Fontsource (no external requests).

This is a separate marketing/showcase site. The functional arena lives at
stickblade-arena.vercel.app and the
engine repo at github.com/Cometbuster4969/STICKBLADE-ARENA.

Highlights
Live animated duel hero — canvas engine with DPR-aware rendering, screen shake,
hit-stop, hit flash, slow-mo KO killcam, ambient dust, and synthesized WebAudio
clash sounds (toggleable)
Interactive sharp-zone lab — pick a weapon, toggle lethal zones, watch the
doctrine flip from Fencer → Brawler → Chaos
Animated JSON terminal — line-by-line reveal of exactly what the LLM sees each turn
Mock blind-vote demo with reveal, Elo deltas, and commentator roast
Animated Elo leaderboard, tournament bracket, roadmap, FAQ accordion, API reference
Lenis buttery smooth scrolling, scroll progress bar, parallax hero, staggered reveals
4 pages on clean paths — Home / Fights / Research / About via a zero-dep
pushState router, with per-page titles and a custom 404
Live arena data — one shared poller reads the HF Space backend (stats every 15s,
board every 60s); new completions spring the counters and get called out in the
hero console. Sleeps gracefully to cached data with an honest LIVE/CACHED chip.

Run locally
Bash

cd stickblade-2026
npm install
npm run dev
# → http://localhost:5173
Build
Bash

npm run build     # outputs to dist/
npm run preview   # preview the production build
Deploy to Vercel
Bash

npm i -g vercel
vercel
Or drag-import the folder in the Vercel dashboard — the defaults (Vite preset) just work.

Design notes
Ember theme — warm near-black, bone text, one molten-orange accent. Gold is kept
for trophies/Elo, green/blue for the two fighters (readability), icy-blue for
the Ice arena. No light mode: single-theme confidence.
Awwwards layer — preloader with curtain-lift exit, difference-blend custom
cursor (touch-gated), spotlight hover on cards, film grain, mono section
indices, giant outlined marquee type.
Accessibility — skip-to-content link, real menu button with Escape-to-close,
pausable marquee, MotionConfig reducedMotion="user", AA-passing dim text,
:−focus-visible ember rings, labelled FAQ regions.

Library forks (all adapted for Vite + Tailwind v4, documented here)
skiper-ui skiper40 — animated links (nav underline sweep, footer hover arrows).
Fork: next/link swapped to <a> + Lenis-aware clicks.
skiper-ui skiper58 — text-roll menu (mobile nav rollers with staggered flips).
skiper-ui skiper99 — animated icons (hamburger↔X, speaker/mute, chevrons).
Fork: controlled open/muted props so they can't desync.
skiper-ui skiper41 — progressive blur (hero feed edge softening).
skiper-ui skiper106 spirit — smooth fight-alerts email capture (spring focus
caret) with an honest success state; dialkit's tuning panel stripped to static
defaults instead of shipping a second animation engine.
cult-ui animated-number — spring-physics counters (live stats).
cult-ui vote-tally spirit — community weapon ballot with live re-sorting.
cult-ui terminal-animation spirit — tabbed typed-command API theater.
magicui text-reveal (ember fork) — sticky scroll-linked Creed manifesto; the
final word ignites ember.
componentry scroll-based-velocity — manifesto strip that speeds up + flips with
scroll velocity.
watermelon kinetic-text-reveal / text-repel / flipping-word-swap /
github-calendar — H1 masked rise, cursor-fleeing ARENA backdrop, inline word
flip, and the Arena Pulse season grid.
metal-fx — metallic treatment on the hero CTA.
dotmatrix spirit — sequential dot pulse under the preloader counter.
uiverse spirit — ghost-button shine sweep + arena caution tape (their catalog
exposes only codename slugs, so these two CSS details are original).

Structure
text

stickblade-2026/
├── index.html
├── vite.config.js
├── vercel.json            # SPA rewrites for /fights /research /about
├── components.json        # shadcn scaffold (aliases, @/lib/utils)
└── src/
    ├── main.jsx            # entry + self-hosted fonts
    ├── App.jsx             # Lenis + routing + preloader + cursor + spotlight
    ├── router.jsx          # zero-dep path router (pushState + event)
    ├── pages/              # Home / Fights / Research / About / 404 (lazy-split)
    ├── index.css           # Tailwind v4 ember theme + custom utilities
    ├── data.jsx            # weapons/SVGs, features, API, roadmap, FAQs
    ├── lib/
    │   ├── arena-live.js   # shared HF Space poller (external store + cache)
    │   └── utils.js        # cn() helper
    └── components/
        ├── ui.jsx               # nav, footer, reveals, counters, marquee, chips
        ├── DuelCanvas.jsx       # upgraded duel engine (canvas + WebAudio)
        ├── Hero.jsx             # hero + live arena console
        ├── VelocityDivider.jsx  # scroll-velocity manifesto strip
        ├── Creed.jsx            # sticky scroll-linked manifesto beat
        ├── ArenaLoop.jsx        # sticky-rail 4-step loop with product mocks
        ├── ArenaStack.jsx       # CSS-sticky arena card runway ("the Gauntlet")
        ├── Pulse.jsx            # Arena Pulse season calendar + live totals
        ├── Sections1.jsx        # problem · twist lab · how-it-works · modes
        ├── Sections2.jsx        # weapons · arenas · voting · leaderboard
        ├── Sections3.jsx        # features · brackets · research · API · roadmap · team · FAQ · CTA
        ├── cult/
        │   └── animated-number.jsx
        ├── dotmatrix-loader.css
        └── ui/
            ├── ballot-tally.jsx
            ├── terminal-theater.jsx
            ├── text-reveal.jsx
            ├── github-calendar.jsx
            ├── scroll-based-velocity.jsx
            ├── kinetic-text-reveal.jsx
            ├── text-repel.jsx
            ├── flipping-word-swap.jsx
            └── skiper-ui/
                ├── skiper40.jsx
                ├── skiper41.jsx
                ├── skiper58.jsx
                └── skiper99.jsx
Code: Apache 2.0 · Match data: CC-BY-SA 4.0 · © Ayush Kumar, BIT Mesra

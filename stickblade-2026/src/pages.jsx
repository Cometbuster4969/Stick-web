import Hero from './components/Hero'
import VelocityDivider from './components/VelocityDivider'
import Creed from './components/Creed'
import ArenaLoop from './components/ArenaLoop'
import ArenaStack from './components/ArenaStack'
import Pulse from './components/Pulse'
import { Marquee } from './components/ui'
import { Problem, TwistLab, HowItWorks, Modes } from './components/Sections1'
import { Weapons, Arenas, Voting, Leaderboard } from './components/Sections2'
import { Features, Tournaments, Research, ApiDocs, Roadmap, Team, Faq, Cta } from './components/Sections3'
import { navigate } from './router'

export function HomePage() {
  return (<>
    <Hero />
    <Marquee />
    <VelocityDivider />
    <Creed />
    <Problem />
    <ArenaLoop />
    <Cta />
  </>)
}

export function FightsPage() {
  return (<>
    <TwistLab />
    <HowItWorks />
    <Modes />
    <Weapons />
    <Arenas />
    <ArenaStack />
    <Voting />
    <Leaderboard />
    <Pulse />
    <Tournaments />
  </>)
}

export function ResearchPage() {
  return (<>
    <Features />
    <Research />
    <ApiDocs />
  </>)
}

export function AboutPage() {
  return (<>
    <Roadmap />
    <Team />
    <Faq />
  </>)
}

export function NotFoundPage() {
  return (
    <section className="py-32 md:py-40">
      <div className="max-w-2xl mx-auto px-5 md:px-8 text-center">
        <p className="font-mono text-[12px] tracking-[0.25em] text-ember mb-4">404 · LOST IN THE ARENA</p>
        <h1 className="font-display font-bold tracking-tight text-4xl md:text-6xl">No fighters here.</h1>
        <p className="text-muted mt-4">That page doesn't exist — the trail goes cold. Head back to the arena.</p>
        <button onClick={() => navigate('/')} className="btn-primary font-bold text-[15px] px-6 py-3.5 rounded-xl text-white inline-flex items-center gap-2 mt-8">
          <span aria-hidden="true">⚔</span> Back home
        </button>
      </div>
    </section>
  )
}
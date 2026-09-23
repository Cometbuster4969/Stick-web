import Hero from '../components/Hero'
import VelocityDivider from '../components/VelocityDivider'
import Creed from '../components/Creed'
import ArenaLoop from '../components/ArenaLoop'
import { Marquee } from '../components/ui'
import { Problem } from '../components/Sections1'
import { Cta } from '../components/Sections3'

export default function HomePage() {
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

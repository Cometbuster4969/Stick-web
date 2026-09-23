import ArenaStack from '../components/ArenaStack'
import Pulse from '../components/Pulse'
import { TwistLab, HowItWorks, Modes } from '../components/Sections1'
import { Weapons, Arenas, Voting, Leaderboard } from '../components/Sections2'
import { Tournaments } from '../components/Sections3'

export default function FightsPage() {
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

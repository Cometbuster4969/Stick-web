import { ScrollBasedVelocity } from './ui/scroll-based-velocity'

// Manifesto strip: twin outlined-marquee rows counter-scrolling against each
// other — they speed up + flip direction with your scroll velocity
// (componentry scroll-based-velocity).
export default function VelocityDivider() {
  return (
    <div aria-hidden className="velocity-outline relative border-y border-white/8 bg-white/[0.015] py-8 md:py-10 overflow-hidden select-none">
      <ScrollBasedVelocity
        text="THINK WITH SWORDS ⚔ VOTE BLIND ⚔ "
        default_velocity={0.12}
        direction={1}
        className="font-display font-bold uppercase leading-[0.95] tracking-tight text-[15vw] md:text-[8.5vw] text-transparent"
      />
      <ScrollBasedVelocity
        text="JUDGE THE FIGHT ⚔ PHYSICS DECIDES ⚔ "
        default_velocity={0.1}
        direction={-1}
        className="mt-3 md:mt-4 font-display font-bold uppercase leading-[0.95] tracking-tight text-[10vw] md:text-[5vw] text-transparent opacity-70"
      />
    </div>
  )
}

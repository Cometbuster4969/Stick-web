import { ScrollBasedVelocity } from './ui/scroll-based-velocity'

// Manifesto strip: twin vintage-marquee rows that speed up + flip direction
// with your scroll velocity (componentry scroll-based-velocity).
export default function VelocityDivider() {
  return (
    <div aria-hidden className="velocity-outline relative border-y border-white/8 bg-white/[0.015] py-8 md:py-10 overflow-hidden select-none">
      <ScrollBasedVelocity
        text="THINK WITH SWORDS ⚔ VOTE BLIND ⚔ JUDGE THE FIGHT ⚔ PHYSICS DECIDES ⚔ "
        default_velocity={4}
        className="font-display font-bold uppercase leading-[0.95] tracking-tight text-[15vw] md:text-[8.5vw] text-transparent"
      />
    </div>
  )
}

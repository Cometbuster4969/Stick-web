import { TextReveal } from './ui/text-reveal'

// The creed: a sticky scroll-linked manifesto beat between the velocity
// divider and the Problem section (magicui text-reveal, ember-forked).
export default function Creed() {
  return (
    <section id="creed" className="scroll-mt-20 relative">
      <TextReveal className="h-[140vh]">Benchmarks reward recall. The arena rewards nerve.</TextReveal>
    </section>
  )
}

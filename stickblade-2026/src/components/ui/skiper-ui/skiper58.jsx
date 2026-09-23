// Fork of skiper-ui skiper58 (text-roll menu).
// Big uppercase rollers with staggered per-letter flips on group hover.
import { cn } from '@/lib/utils'

export function TextRoll({ center = false, className = '', children }) {
  const text = String(children ?? '')
  return (
    <span className={cn('relative inline-block whitespace-nowrap', center && 'text-center', className)}>
      {text.split('').map((c, i) => (
        <span key={i} className="relative inline-block overflow-hidden align-bottom">
          <span
            className="block transition-transform duration-300 ease-out group-hover:-translate-y-full"
            style={{ transitionDelay: `${i * 22}ms` }}
          >
            {c === ' ' ? ' ' : c}
          </span>
          <span
            aria-hidden
            className="absolute inset-0 block transition-transform duration-300 ease-out translate-y-full group-hover:translate-y-0"
            style={{ transitionDelay: `${i * 22}ms` }}
          >
            {c === ' ' ? ' ' : c}
          </span>
        </span>
      ))}
    </span>
  )
}

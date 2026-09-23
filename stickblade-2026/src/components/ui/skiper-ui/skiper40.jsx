// Fork of skiper-ui skiper40 (animated links).
// Fork: next/link swapped to plain <a> + Lenis-aware clicks (Vite has no next/*).
import { cn } from '@/lib/utils'

export function Link000({ href = '#', onClick, className = '', children, ...rest }) {
  return (
    <a
      href={href}
      onClick={onClick}
      className={cn('group/link000 relative inline-flex w-fit items-center', className)}
      {...rest}
    >
      <span className="relative">
        {children}
        <span
          aria-hidden
          className="absolute -bottom-[3px] left-0 h-[1.5px] w-full origin-left scale-x-0 bg-ember transition-transform duration-300 ease-out group-hover/link000:scale-x-100"
        />
      </span>
    </a>
  )
}

export function Link001({ href = '#', onClick, className = '', children, ...rest }) {
  return (
    <a
      href={href}
      onClick={onClick}
      className={cn('group/link001 relative flex w-fit items-center gap-1', className)}
      {...rest}
    >
      <span className="relative">
        {children}
        <span
          aria-hidden
          className="absolute -bottom-[3px] left-0 h-[1.5px] w-full origin-left scale-x-0 bg-ember transition-transform duration-300 ease-out group-hover/link001:scale-x-100"
        />
      </span>
      <span
        aria-hidden
        className="inline-block text-[11px] text-ember opacity-0 -translate-x-1 translate-y-1 transition-all duration-300 group-hover/link001:opacity-100 group-hover/link001:translate-x-0 group-hover/link001:translate-y-0"
      >
        ↗
      </span>
    </a>
  )
}

export function Link002({ href = '#', onClick, className = '', children, ...rest }) {
  return (
    <a
      href={href}
      onClick={onClick}
      className={cn('group/link002 relative inline-flex w-fit items-start gap-1', className)}
      {...rest}
    >
      <span className="relative">
        {children}
        <span
          aria-hidden
          className="absolute -bottom-[3px] left-0 h-[1.5px] w-full origin-left scale-x-0 bg-ember transition-transform duration-300 ease-out group-hover/link002:scale-x-100"
        />
      </span>
      <span aria-hidden className="inline-block text-[11px] text-ember transition-transform duration-300 group-hover/link002:translate-x-0.5 group-hover/link002:-translate-y-0.5">
        ↗
      </span>
    </a>
  )
}

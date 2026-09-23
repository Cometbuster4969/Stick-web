// Inspired by Cult UI's terminal-animation (cult-ui.com) — tabbed typed-command
// playback with staggered output lines. Custom build for the arena API.
import { useCallback, useEffect, useRef, useState } from 'react'
import { useInView } from 'framer-motion'
import { cn } from '@/lib/utils'

export function TerminalTheater({ tabs, className = '' }) {
  const [active, setActive] = useState(0)
  const [typed, setTyped] = useState('')
  const [typing, setTyping] = useState(true)
  const [visible, setVisible] = useState(0)
  const [cursor, setCursor] = useState(true)
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, amount: 0.25 })
  const timers = useRef([])

  const play = useCallback((idx) => {
    timers.current.forEach(clearTimeout)
    timers.current = []
    setVisible(0)
    setTyped('')
    setTyping(true)
    setCursor(true)
    const tab = tabs[idx]
    if (!tab) return
    let ci = 0
    const type = () => {
      if (ci <= tab.command.length) {
        setTyped(tab.command.slice(0, ci))
        ci++
        timers.current.push(setTimeout(type, 24 + Math.random() * 34))
      } else {
        timers.current.push(setTimeout(() => { setTyping(false); show(0) }, 280))
      }
    }
    const show = (li) => {
      if (li <= tab.lines.length) {
        setVisible(li)
        if (li < tab.lines.length) {
          timers.current.push(setTimeout(() => show(li + 1), tab.lines[li].delay ?? 110))
        } else {
          timers.current.push(setTimeout(() => setCursor(false), 1200))
        }
      }
    }
    timers.current.push(setTimeout(type, 350))
  }, [tabs])

  const played = useRef(false)
  useEffect(() => {
    if (!inView || played.current) return
    played.current = true
    play(0)
    return () => timers.current.forEach(clearTimeout)
  }, [inView, play])

  const tab = tabs[active] ?? tabs[0]

  return (
    <div ref={ref} className={cn('rounded-2xl border border-white/12 bg-[#0a0a14] overflow-hidden text-left font-mono shadow-[0_24px_70px_rgba(0,0,0,0.5)]', className)}>
      <div className="flex items-center gap-1.5 px-4 py-3 border-b border-white/8">
        <span className="w-3 h-3 rounded-full bg-blood/80" />
        <span className="w-3 h-3 rounded-full bg-gold/80" />
        <span className="w-3 h-3 rounded-full bg-fighter-a/80" />
        <div className="flex gap-1 ml-3">
          {tabs.map((t, i) => (
            <button
              key={t.label}
              onClick={() => { setActive(i); play(i) }}
              className={cn(
                'text-[11.5px] px-3 py-1 rounded-lg border transition-colors',
                i === active
                  ? 'border-ember/50 bg-ember/10 text-ember font-bold'
                  : 'border-transparent text-dim hover:text-muted'
              )}
            >
              {t.label}
            </button>
          ))}
        </div>
        <span className="ml-auto text-[10.5px] text-dim hidden sm:inline">stab — zsh</span>
      </div>
      <div className="px-5 py-5 text-[12.5px] md:text-[13px] leading-[1.9] min-h-[290px]">
        <div className="text-white whitespace-pre-wrap break-all">
          <span className="text-ember-soft">$ </span>{typed}{typing && cursor && <span className="animate-blink text-ember-soft">▌</span>}
        </div>
        {!typing && tab.lines.slice(0, visible).map((l, i) => (
          <div key={`${active}-${i}`} className={l.color || 'text-muted'}>{l.text || ' '}</div>
        ))}
        {!typing && visible >= tab.lines.length && cursor && (
          <div><span className="text-ember-soft">$ </span><span className="animate-blink text-ember-soft">▌</span></div>
        )}
      </div>
    </div>
  )
}
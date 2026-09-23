// Inspired by Cult UI's vote-tally (cult-ui.com) — up-vote list with live
// re-sorting. Custom build for the community weapon ballot.
import { useState } from 'react'
import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'

export function BallotTally({ items, className = '' }) {
  const [votes, setVotes] = useState(() => Object.fromEntries(items.map((i) => [i.id, i.votes])))
  const [voted, setVoted] = useState(() => new Set())

  const toggle = (id) => {
    setVoted((prev) => {
      const next = new Set(prev)
      if (next.has(id)) {
        next.delete(id)
        setVotes((v) => ({ ...v, [id]: v[id] - 1 }))
      } else {
        next.add(id)
        setVotes((v) => ({ ...v, [id]: v[id] + 1 }))
      }
      return next
    })
  }

  const sorted = [...items].sort((a, b) => votes[b.id] - votes[a.id])
  const max = Math.max(...Object.values(votes))

  return (
    <div className={cn('flex flex-col gap-2 mt-4', className)}>
      {sorted.map((it, i) => {
        const mine = voted.has(it.id)
        return (
          <motion.button
            layout
            key={it.id}
            onClick={() => toggle(it.id)}
            transition={{ type: 'spring', stiffness: 350, damping: 32 }}
            className={cn(
              'relative overflow-hidden flex items-center gap-3 rounded-xl border px-4 py-3 text-left transition-colors',
              mine ? 'border-ember/60 bg-ember/[0.07]' : 'border-white/10 bg-white/[0.02] hover:border-ember/40'
            )}
          >
            <motion.div
              className={cn('absolute inset-y-0 left-0', mine ? 'bg-ember/10' : 'bg-white/[0.03]')}
              animate={{ width: `${(votes[it.id] / max) * 100}%` }}
              transition={{ type: 'spring', stiffness: 120, damping: 24 }}
            />
            <span className="relative font-mono text-[11px] text-dim w-6">#{i + 1}</span>
            <span className="relative flex-1 min-w-0">
              <b className="block text-[14px]">{it.name}</b>
              <small className="block text-[11.5px] text-dim truncate">{it.detail}</small>
            </span>
            <span className={cn('relative font-display font-bold tabular-nums', mine ? 'text-ember' : '')}>{votes[it.id]}</span>
            <span className={cn('relative text-sm transition-transform', mine ? 'text-ember scale-110' : 'text-dim')}>▲</span>
          </motion.button>
        )
      })}
      <p className="font-mono text-[10.5px] text-dim mt-1">mock ballot · resets on reload · real polls run on the arena →</p>
    </div>
  )
}
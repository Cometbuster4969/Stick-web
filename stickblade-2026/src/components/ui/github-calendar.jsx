// Fork of watermelon github-calendar (city-lights spirit, ember schema) —
// the Arena Pulse season grid. Consumes GitHub-style contribution levels.
import { cn } from '@/lib/utils'

const LEVEL_STYLE = {
  NONE: { background: 'rgba(236,231,220,0.055)', boxShadow: 'none' },
  FIRST_QUARTILE: { background: 'rgba(181,52,0,0.45)', boxShadow: 'none' },
  SECOND_QUARTILE: { background: 'rgba(255,90,31,0.55)', boxShadow: 'none' },
  THIRD_QUARTILE: { background: 'rgba(255,90,31,0.85)', boxShadow: '0 0 6px rgba(255,90,31,0.45)' },
  FOURTH_QUARTILE: { background: '#ff5a1f', boxShadow: '0 0 10px rgba(255,90,31,0.7)' },
}

export function GithubCalendar({
  username = '',
  data = { contributions: [], totalContributions: 0 },
  variant = 'city-lights',
  colorSchema = 'orange',
  shape = 'rounded',
  glowIntensity = 6,
  showTotal = false,
  unitLabel = 'duels',
  className = '',
}) {
  const weeks = Array.isArray(data?.contributions) ? data.contributions : []
  void username
  void variant
  void colorSchema
  const radius = shape === 'rounded' ? 3.5 : shape === 'circle' ? 999 : 1
  return (
    <div className={cn('w-fit', className)}>
      <div className="flex gap-[3px]" role="img" aria-label={`${data?.totalContributions ?? 0} ${unitLabel} in the last year`}>
        {weeks.map((week, w) => (
          <div key={w} className="flex flex-col gap-[3px]">
            {week.map((day, d) => {
              const st = LEVEL_STYLE[day.contributionLevel] || LEVEL_STYLE.NONE
              const glow =
                day.contributionLevel === 'FOURTH_QUARTILE' || day.contributionLevel === 'THIRD_QUARTILE'
                  ? { boxShadow: `0 0 ${glowIntensity + 4}px rgba(255,90,31,0.65)` }
                  : null
              return (
                <span
                  key={`${w}-${d}`}
                  title={`${day.contributionCount} ${unitLabel} · ${day.date}`}
                  className="block h-[11px] w-[11px] transition-transform hover:scale-125"
                  style={{ borderRadius: radius, ...st, ...glow }}
                />
              )
            })}
          </div>
        ))}
      </div>
      <div className="mt-3 flex items-center justify-end gap-1.5 font-mono text-[10.5px] text-dim">
        <span>Less</span>
        {['NONE', 'FIRST_QUARTILE', 'SECOND_QUARTILE', 'THIRD_QUARTILE', 'FOURTH_QUARTILE'].map((l) => (
          <span key={l} className="block h-[10px] w-[10px]" style={{ borderRadius: radius, ...LEVEL_STYLE[l] }} />
        ))}
        <span>More</span>
        {showTotal && <span className="ml-2 text-muted">{data?.totalContributions ?? 0} {unitLabel}</span>}
      </div>
    </div>
  )
}

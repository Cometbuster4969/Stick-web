// Fork of skiper-ui skiper41 (progressive blur).
// Stacked blur layers behind a gradient mask — softens the feed's top edge.
export function ProgressiveBlur({
  position = 'top',
  height = '30px',
  blurAmount = '3px',
  backgroundColor = '#0d0b09',
}) {
  const isTop = position === 'top'
  const layers = [0.25, 0.5, 0.75, 1]
  return (
    <div
      aria-hidden
      className="pointer-events-none absolute inset-x-0"
      style={{ [isTop ? 'top' : 'bottom']: 0, height, zIndex: 20 }}
    >
      {layers.map((o, i) => (
        <div
          key={i}
          className="absolute inset-0"
          style={{
            background: backgroundColor,
            opacity: o * 0.55,
            backdropFilter: `blur(${parseFloat(blurAmount) * (i + 1) * 0.4}px)`,
            WebkitBackdropFilter: `blur(${parseFloat(blurAmount) * (i + 1) * 0.4}px)`,
            WebkitMaskImage: `linear-gradient(${isTop ? 'to bottom' : 'to top'}, black ${(i / layers.length) * 100}%, transparent ${(i + 1.6) * 25}%)`,
            maskImage: `linear-gradient(${isTop ? 'to bottom' : 'to top'}, black ${(i / layers.length) * 100}%, transparent ${(i + 1.6) * 25}%)`,
          }}
        />
      ))}
    </div>
  )
}

import { navigate } from '../router'

export default function NotFoundPage() {
  return (
    <section className="py-32 md:py-40">
      <div className="max-w-2xl mx-auto px-5 md:px-8 text-center">
        <p className="font-mono text-[12px] tracking-[0.25em] text-ember mb-4">404 · LOST IN THE ARENA</p>
        <h1 className="font-display font-bold tracking-tight text-4xl md:text-6xl">No fighters here.</h1>
        <p className="text-muted mt-4">That page doesn't exist — the trail goes cold. Head back to the arena.</p>
        <button onClick={() => navigate('/')} className="btn-primary font-bold text-[15px] px-6 py-3.5 rounded-xl text-white inline-flex items-center gap-2 mt-8">
          <span aria-hidden="true">⚔</span> Back home
        </button>
      </div>
    </section>
  )
}

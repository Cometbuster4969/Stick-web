import { useEffect, useState } from 'react'
import Lenis from 'lenis'
import { AnimatePresence, MotionConfig } from 'framer-motion'
import { Nav, Footer, Preloader, Cursor, SkipLink, goTo } from './components/ui'
import { HomePage, FightsPage, ResearchPage, AboutPage, NotFoundPage } from './pages'
import { PAGES, SECTION_PAGE, getPath } from './router'

const PAGE_COMPONENTS = { '/': HomePage, '/fights': FightsPage, '/research': ResearchPage, '/about': AboutPage }

export default function App() {
  const [path, setPath] = useState(() => getPath() ?? '/__404__')
  const [navId, setNavId] = useState(0)
  const [loading, setLoading] = useState(true)

  // page routing
  useEffect(() => {
    window.history.scrollRestoration = 'manual'
    const f = () => { setPath(getPath() ?? '/__404__'); setNavId((n) => n + 1) }
    window.addEventListener('popstate', f)
    window.addEventListener('routechange', f)
    // preserve old single-page #anchor links: /#voting -> /fights#voting
    const h = window.location.hash.replace('#', '')
    if (h && SECTION_PAGE[h] && SECTION_PAGE[h] !== getPath()) {
      window.history.replaceState({}, '', SECTION_PAGE[h] + '#' + h)
      f()
    }
    return () => { window.removeEventListener('popstate', f); window.removeEventListener('routechange', f) }
  }, [])

  useEffect(() => {
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const lenis = new Lenis({ duration: 1.15, smoothWheel: !reducedMotion })
    window.__lenis = lenis
    let raf
    const loop = (t) => {
      lenis.raf(t)
      raf = requestAnimationFrame(loop)
    }
    raf = requestAnimationFrame(loop)
    return () => {
      cancelAnimationFrame(raf)
      lenis.destroy()
      window.__lenis = null
    }
  }, [])

  // title + scroll on navigation (loading dep re-scrolls once the preloader releases Lenis)
  useEffect(() => {
    document.title = PAGES[path] ?? 'Lost in the Arena — STICKBLADE ARENA'
    const h = window.location.hash.replace('#', '')
    if (h && document.getElementById(h)) requestAnimationFrame(() => goTo('#' + h))
    else if (window.__lenis) window.__lenis.scrollTo(0, { immediate: true })
    else window.scrollTo(0, 0)
  }, [path, navId, loading])

  // lock scroll while the preloader is up
  useEffect(() => {
    if (!window.__lenis) return
    if (loading) window.__lenis.stop()
    else window.__lenis.start()
  }, [loading])

  // global spotlight tracker for .spot cards
  useEffect(() => {
    const f = (e) => {
      const el = e.target?.closest?.('.spot')
      document.querySelectorAll('.spot.lit').forEach((s) => { if (s !== el) s.classList.remove('lit') })
      if (el) {
        const r = el.getBoundingClientRect()
        el.style.setProperty('--mx', e.clientX - r.left + 'px')
        el.style.setProperty('--my', e.clientY - r.top + 'px')
        el.classList.add('lit')
      }
    }
    window.addEventListener('mousemove', f, { passive: true })
    return () => window.removeEventListener('mousemove', f)
  }, [])

  const Page = PAGE_COMPONENTS[path] ?? NotFoundPage
  return (
      <div id="top" className="relative min-h-screen bg-void text-[#eaecf4] font-body">
        <Cursor />
        <AnimatePresence>{loading && <Preloader done={() => setLoading(false)} />}</AnimatePresence>
        <SkipLink />
        <Nav />
        <MotionConfig reducedMotion="user">
        <main id="main">
          <Page />
        </main>
        </MotionConfig>
        <Footer />
      </div>
  )
}

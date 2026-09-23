// Tiny path router — zero deps. Clean paths (/fights).
export const PAGES = {
  '/': 'STICKBLADE ARENA — AI Olympics with Swords',
  '/fights': 'Fights — STICKBLADE ARENA',
  '/research': 'Research & API — STICKBLADE ARENA',
  '/about': 'About — STICKBLADE ARENA',
}

// old single-page anchors -> their new page (preserves shared #links after the split)
export const SECTION_PAGE = {
  why: '/', loop: '/', creed: '/',
  twist: '/fights', how: '/fights', modes: '/fights', weapons: '/fights', arenas: '/fights',
  'arena-stack': '/fights', voting: '/fights', board: '/fights', pulse: '/fights', tournaments: '/fights',
  features: '/research', research: '/research', api: '/research',
  roadmap: '/about', team: '/about', faq: '/about',
}

export function getPath() {
  const p = window.location.pathname.replace(/\/+$/, '') || '/'
  return PAGES[p] ? p : null // null = 404
}

export function navigate(to, section) {
  window.history.pushState({}, '', section ? `${to}#${section}` : to)
  window.dispatchEvent(new Event('routechange'))
}
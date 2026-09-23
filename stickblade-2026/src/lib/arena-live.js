// Live data layer for STICKBLADE ARENA.
// Source: HF Space backend (FastAPI, Supabase-backed).
//   stats  -> GET /api/stats/vote_rate  (lifetime done/voted/rate)
//   fresh  -> GET /api/recent           (newest-first; [0].match_id detects completions)
//   board  -> GET /api/leaderboard      (Elo rows + Wilson CI + provisional flags)
// One shared poller (15s stats / 60s board) across all components via a tiny
// external store. Last-good payload is cached to localStorage so the site
// degrades to "cached" instead of lying or blanking when the Space sleeps.
// NOTE: prod serves a subset of origin/main's routes (/api/metrics, /api/status,
// /api/model_stats 404 on prod) — only verified endpoints are used here.
import { useSyncExternalStore } from 'react'

export const API_BASE = 'https://pioneer37-stickman-arena.hf.space'
const CACHE_KEY = 'stickblade-live-v1'
const STATS_EVERY = 15000
const BOARD_EVERY = 60000

// Real numbers (verified Sep 14 2026) — shown only before first fetch resolves.
export const FALLBACK = { matches: 657, votes: 152, rate: 0.2314 }

async function fetchJSON(path, timeoutMs = 12000) {
  const ctrl = new AbortController()
  const t = setTimeout(() => ctrl.abort(), timeoutMs)
  try {
    const r = await fetch(API_BASE + path, { signal: ctrl.signal, cache: 'no-store' })
    if (!r.ok) throw new Error(`HTTP ${r.status}`)
    return await r.json()
  } finally {
    clearTimeout(t)
  }
}

export function cleanName(row) {
  const raw = row.name || row.model || 'unknown'
  if (raw.startsWith('bot:')) return raw
  let n = raw.replace(/:free$/, '')
  if (n.includes('/')) n = n.split('/').pop()
  return n
}

export function shapeBoard(rows) {
  return (Array.isArray(rows) ? rows : [])
    .filter((r) => r && typeof r.rating === 'number' && !String(r.model || '').startsWith('bot:'))
    .sort((a, b) => b.rating - a.rating)
    .slice(0, 6)
    .map((r) => ({
      model: r.model,
      name: cleanName(r),
      elo: Math.round(r.rating),
      w: r.wins ?? 0,
      l: r.losses ?? 0,
      n: r.n ?? 0,
      wr: r.win_rate,
      lo: r.win_rate_lo,
      hi: r.win_rate_hi,
      provisional: r.provisional ?? (r.n ?? 0) < 10,
    }))
}

let state = {
  status: 'connecting', // connecting | live | cached | offline
  stats: { ...FALLBACK },
  recent: [],
  board: [],
  lastMatchId: null,
  newMatch: null, // {id, sharp, turns, method, at} — set when a completion is detected
  updatedAt: 0,
}
const listeners = new Set()
function emit() {
  listeners.forEach((l) => {
    try {
      l()
    } catch {
      /* noop */
    }
  })
}
function set(patch) {
  state = { ...state, ...patch }
  emit()
}

function saveCache() {
  try {
    localStorage.setItem(
      CACHE_KEY,
      JSON.stringify({
        stats: state.stats,
        board: state.board,
        recent: state.recent.slice(0, 3),
        updatedAt: state.updatedAt,
      })
    )
  } catch {
    /* private mode */
  }
}
function loadCache() {
  try {
    const c = JSON.parse(localStorage.getItem(CACHE_KEY) || 'null')
    if (c && c.stats) {
      state = {
        ...state,
        stats: c.stats,
        board: c.board || [],
        recent: c.recent || [],
        status: 'cached',
        updatedAt: c.updatedAt || 0,
        lastMatchId: c.recent?.[0]?.match_id ?? null,
      }
    }
  } catch {
    /* corrupt cache */
  }
}

let started = false

async function pollStats() {
  if (typeof document !== 'undefined' && document.visibilityState === 'hidden') return
  try {
    const [vr, recent] = await Promise.all([fetchJSON('/api/stats/vote_rate'), fetchJSON('/api/recent')])
    const L = vr?.lifetime || {}
    const stats = {
      matches: Number.isFinite(+L.done) ? +L.done : state.stats.matches,
      votes: Number.isFinite(+L.voted) ? +L.voted : state.stats.votes,
      rate: Number.isFinite(+L.rate) ? +L.rate : state.stats.rate,
    }
    const list = Array.isArray(recent) ? recent : []
    const firstId = list[0]?.match_id ?? null
    let newMatch = null
    if (state.lastMatchId && firstId && firstId !== state.lastMatchId) {
      const m = list[0]
      newMatch = { id: firstId, sharp: m.sharp || '—', turns: m.turns ?? '?', method: m.method || '—', at: Date.now() }
    }
    set({
      status: 'live',
      stats,
      recent: list,
      lastMatchId: firstId ?? state.lastMatchId,
      ...(newMatch ? { newMatch } : {}),
      updatedAt: Date.now(),
    })
    saveCache()
  } catch {
    set({ status: state.updatedAt ? 'cached' : 'offline' })
  }
}

async function pollBoard() {
  if (typeof document !== 'undefined' && document.visibilityState === 'hidden') return
  try {
    const rows = await fetchJSON('/api/leaderboard')
    const board = shapeBoard(rows)
    if (board.length) {
      set({ board, status: 'live', updatedAt: Date.now() })
      saveCache()
    }
  } catch {
    /* keep stale board; stats poller owns status */
  }
}

function start() {
  if (started || typeof window === 'undefined') return
  started = true
  loadCache()
  emit()
  pollStats()
  pollBoard()
  setInterval(pollStats, STATS_EVERY)
  setInterval(pollBoard, BOARD_EVERY)
  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'visible') {
      pollStats()
      pollBoard()
    }
  })
}

export function subscribe(l) {
  start()
  listeners.add(l)
  return () => {
    listeners.delete(l)
  }
}
export function getSnapshot() {
  return state
}
export function useArenaLive() {
  return useSyncExternalStore(subscribe, getSnapshot, getSnapshot)
}
export function refreshLive() {
  pollStats()
  pollBoard()
}
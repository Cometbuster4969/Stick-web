import { useEffect, useRef } from 'react'

const TAGS = [
  'sword · tip sharp · macro', 'dagger · pommel only · macro', 'spear · tip sharp · macro',
  'flail · spikes · macro', 'bow · arrowhead · macro',
]
const ACTS_A = ['thrust', 'overhead_slash', 'lunge', 'guard_high', 'rising_slash', 'pommel_strike']
const ACTS_B = ['guard_low', 'horizontal_slash', 'thrust', 'hop_back', 'lunge', 'guard_high']

/**
 * Upgraded duel engine: DPR-aware, screen shake, hit-stop, hit flash,
 * slow-mo KO, letterbox, ambient dust, and synthesized WebAudio clashes.
 * Animation + audio automatically pause while scrolled off-screen.
 */
export default function DuelCanvas({ soundOn, onTick, onHud }) {
  const canvasRef = useRef(null)
  const cb = useRef({ soundOn, onTick, onHud })
  cb.current = { soundOn, onTick, onHud }

  useEffect(() => {
    const cv = canvasRef.current
    const ctx = cv.getContext('2d')
    const DPR = Math.min(window.devicePixelRatio || 1, 2)
    let W = 0, H = 320, raf = 0, dead = false
    let vig = null

    const resize = () => {
      const r = cv.parentElement.getBoundingClientRect()
      W = Math.max(280, r.width)
      H = 320
      cv.width = W * DPR
      cv.height = H * DPR
      cv.style.height = H + 'px'
      ctx.setTransform(DPR, 0, 0, DPR, 0, 0)
      vig = ctx.createRadialGradient(W / 2, H / 2, H * 0.35, W / 2, H / 2, H * 0.95)
      vig.addColorStop(0, 'rgba(0,0,0,0)')
      vig.addColorStop(1, 'rgba(0,0,0,0.55)')
    }
    resize()
    const ro = new ResizeObserver(resize)
    ro.observe(cv.parentElement)

    // pause animation + sound while the simulation is scrolled off-screen
    let visible = true
    const io = new IntersectionObserver(([e]) => { visible = e.isIntersecting }, { threshold: 0.04 })
    io.observe(cv)

    // ---------------- state ----------------
    let hpA = 100, hpB = 100, turn = 1, tagIdx = 0
    let sparks = [], floats = [], rings = [], dust = []
    let phase = 0, cd = -70, koTimer = 0, lungeT = 0, lungeSide = 0
    let shake = 0, flash = 0, hitstop = 0, timeScale = 1, koText = 0, barH = 0
    for (let i = 0; i < 48; i++) {
      dust.push({ x: Math.random(), y: Math.random(), r: 0.6 + Math.random() * 1.9, s: 0.15 + Math.random() * 0.6, o: 0.08 + Math.random() * 0.3 })
    }
    const floorY = () => H - 34
    const hud = () => cb.current.onHud({ hpA: Math.max(0, Math.round(hpA)), hpB: Math.max(0, Math.round(hpB)), turn, tag: TAGS[tagIdx] })

    // ---------------- audio ----------------
    let AC = null, master = null, NB = null
    const ensureAudio = () => {
      if (AC) { if (AC.state === 'suspended') AC.resume().catch(() => {}) ; return }
      try {
        AC = new (window.AudioContext || window.webkitAudioContext)()
        master = AC.createGain()
        master.gain.value = 0.38
        master.connect(AC.destination)
      } catch (e) { /* audio unavailable */ }
    }
    window.addEventListener('pointerdown', ensureAudio)
    const audible = () => visible && cb.current.soundOn && AC && AC.state === 'running'
    const playClash = (sharp) => {
      if (!audible()) return
      try {
        const t = AC.currentTime
        const bp = AC.createBiquadFilter(); bp.type = 'bandpass'
        bp.frequency.value = sharp ? 2600 : 1300; bp.Q.value = 6
        const g = AC.createGain()
        g.gain.setValueAtTime(0.5, t); g.gain.exponentialRampToValueAtTime(0.001, t + 0.22)
        const o1 = AC.createOscillator(); o1.type = 'square'; o1.frequency.value = 520 + Math.random() * 300
        const o2 = AC.createOscillator(); o2.type = 'square'; o2.frequency.value = 1240 + Math.random() * 500
        o1.connect(bp); o2.connect(bp); bp.connect(g); g.connect(master)
        o1.start(t); o2.start(t); o1.stop(t + 0.25); o2.stop(t + 0.25)
        if (!NB) {
          NB = AC.createBuffer(1, AC.sampleRate * 0.15, AC.sampleRate)
          const d = NB.getChannelData(0)
          for (let i = 0; i < d.length; i++) d[i] = (Math.random() * 2 - 1) * (1 - i / d.length)
        }
        const ns = AC.createBufferSource(); ns.buffer = NB
        const ng = AC.createGain()
        ng.gain.setValueAtTime(sharp ? 0.7 : 0.4, t); ng.gain.exponentialRampToValueAtTime(0.001, t + 0.15)
        ns.connect(ng); ng.connect(master); ns.start(t)
        if (!sharp) {
          const o = AC.createOscillator(); o.type = 'sine'
          o.frequency.setValueAtTime(120, t); o.frequency.exponentialRampToValueAtTime(42, t + 0.18)
          const og = AC.createGain()
          og.gain.setValueAtTime(0.6, t); og.gain.exponentialRampToValueAtTime(0.001, t + 0.2)
          o.connect(og); og.connect(master); o.start(t); o.stop(t + 0.22)
        }
      } catch (e) { /* ignore */ }
    }
    const playKO = () => {
      if (!audible()) return
      try {
        const t = AC.currentTime
        const o = AC.createOscillator(); o.type = 'sawtooth'
        o.frequency.setValueAtTime(320, t); o.frequency.exponentialRampToValueAtTime(55, t + 0.55)
        const f = AC.createBiquadFilter(); f.type = 'lowpass'; f.frequency.value = 900
        const g = AC.createGain()
        g.gain.setValueAtTime(0.5, t); g.gain.exponentialRampToValueAtTime(0.001, t + 0.6)
        o.connect(f); f.connect(g); g.connect(master); o.start(t); o.stop(t + 0.65)
      } catch (e) { /* ignore */ }
    }

    // ---------------- drawing ----------------
    function stick(x, face, color, pip, swordAng, lunge, guard) {
      const fy = floorY()
      const bob = Math.sin(phase * 2.2 + x) * 2
      const hipY = fy - 46 + bob, shY = hipY - 34, headY = shY - 16
      ctx.strokeStyle = color; ctx.lineWidth = 3.5; ctx.lineCap = 'round'
      ctx.beginPath(); ctx.arc(x, headY, 11, 0, 7); ctx.stroke()
      ctx.fillStyle = color; ctx.fillRect(x - 11, headY - 6, 22, 3.5)
      ctx.beginPath(); ctx.moveTo(x, headY + 11); ctx.lineTo(x, hipY); ctx.stroke()
      const sw = Math.sin(phase * 2 + x) * 4
      ctx.beginPath()
      ctx.moveTo(x, hipY); ctx.lineTo(x - 12 + sw, fy)
      ctx.moveTo(x, hipY); ctx.lineTo(x + 12 - sw, fy)
      ctx.stroke()
      const hx2 = x + face * (lunge + (guard ? 6 : 26)), hy = shY + (guard ? -12 : 6)
      ctx.beginPath(); ctx.moveTo(x, shY); ctx.lineTo(hx2, hy); ctx.stroke()
      ctx.beginPath(); ctx.moveTo(x, shY); ctx.lineTo(x - face * 14, shY + 16); ctx.stroke()
      // sword
      const L = guard ? 30 : 56
      ctx.save(); ctx.translate(hx2, hy); ctx.scale(face, 1); ctx.rotate(swordAng)
      ctx.fillStyle = '#5a3a22'; ctx.fillRect(-13, -3, 13, 6)
      ctx.fillStyle = '#8a8f9e'; ctx.beginPath(); ctx.arc(-14, 0, 3.2, 0, 7); ctx.fill()
      ctx.fillStyle = '#a89f8f'; ctx.fillRect(-2, -10, 4.5, 20)
      ctx.fillStyle = '#e8ecf7'
      ctx.beginPath(); ctx.arc(0.25, -10, 2.4, 0, 7); ctx.arc(0.25, 10, 2.4, 0, 7); ctx.fill()
      const bg = ctx.createLinearGradient(2.5, 0, 2.5 + L, 0)
      bg.addColorStop(0, '#8f96ad'); bg.addColorStop(0.5, '#eef1fa'); bg.addColorStop(1, '#aab1c5')
      ctx.fillStyle = bg; ctx.fillRect(2.5, -3, L, 6)
      ctx.fillStyle = 'rgba(255,255,255,.55)'; ctx.fillRect(2.5, -0.75, L, 1.5)
      ctx.beginPath(); ctx.moveTo(2.5 + L, -3); ctx.lineTo(2.5 + L + 11, 0); ctx.lineTo(2.5 + L, 3); ctx.closePath()
      ctx.fillStyle = '#eef1fa'; ctx.fill()
      const pulse = 2.6 + Math.sin(phase * 3 + x) * 1.4
      ctx.shadowColor = '#ff5a1f'; ctx.shadowBlur = 14
      ctx.fillStyle = '#ff5a1f'; ctx.beginPath(); ctx.arc(2.5 + L + 11, 0, pulse, 0, 7); ctx.fill()
      ctx.shadowBlur = 0
      ctx.restore()
      ctx.fillStyle = color; ctx.beginPath(); ctx.arc(hx2, hy, 4.6, 0, 7); ctx.fill()
      ctx.strokeStyle = 'rgba(0,0,0,.5)'; ctx.lineWidth = 1.2
      ctx.beginPath(); ctx.arc(hx2, hy, 4.6, 0, 7); ctx.stroke()
      // name pip
      ctx.fillStyle = 'rgba(0,0,0,.55)'
      ctx.beginPath(); ctx.arc(x, headY - 24, 10, 0, 7); ctx.fill()
      ctx.strokeStyle = color; ctx.lineWidth = 1.5
      ctx.beginPath(); ctx.arc(x, headY - 24, 10, 0, 7); ctx.stroke()
      ctx.fillStyle = color; ctx.font = 'bold 10px "JetBrains Mono", monospace'
      ctx.textAlign = 'center'; ctx.fillText(pip, x, headY - 20.5); ctx.textAlign = 'left'
      const d = 2.5 + L + 11
      return { tx: hx2 + face * d * Math.cos(swordAng), ty: hy + d * Math.sin(swordAng) }
    }

    function burst(x, y, n, col) {
      for (let i = 0; i < n; i++) {
        sparks.push({ x, y, vx: (Math.random() - 0.5) * 7, vy: Math.random() * -5 - 1, l: 1, col: col || '#ffd166' })
      }
    }

    function frame() {
      if (dead) return
      if (!visible) { raf = requestAnimationFrame(frame); return }
      if (hitstop > 0) { hitstop--; timeScale = 0.06 }
      else if (koTimer > 70) timeScale += (0.26 - timeScale) * 0.2
      else timeScale += (1 - timeScale) * 0.25
      phase += 0.045 * timeScale
      cd--

      const fy = floorY()
      ctx.clearRect(0, 0, W, H)
      ctx.save()
      if (shake > 0.3) ctx.translate((Math.random() - 0.5) * shake, (Math.random() - 0.5) * shake)

      // backdrop
      const g = ctx.createLinearGradient(0, 0, 0, H)
      g.addColorStop(0, '#14100d'); g.addColorStop(0.7, '#0d0b09'); g.addColorStop(1, '#0a0806')
      ctx.fillStyle = g; ctx.fillRect(-20, -20, W + 40, H + 40)
      // pillars
      ;[[6, '#3ddc84'], [W - 14, '#4da3ff']].forEach(([px, c]) => {
        const pg = ctx.createLinearGradient(px, 0, px + 8, 0)
        pg.addColorStop(0, 'rgba(255,255,255,.06)'); pg.addColorStop(1, 'rgba(255,255,255,.01)')
        ctx.fillStyle = pg; ctx.fillRect(px, 0, 8, fy)
        ctx.fillStyle = c; ctx.globalAlpha = 0.5; ctx.fillRect(px, 0, 2, fy); ctx.globalAlpha = 1
      })
      // dust
      dust.forEach(p => {
        p.y -= 0.0011 * p.s * 60 * 0.016 * 3
        p.x += Math.sin(phase + p.y * 9) * 0.0006
        if (p.y < -0.02) { p.y = 1.02; p.x = Math.random() }
        ctx.globalAlpha = p.o
        ctx.fillStyle = '#e8a33d'
        ctx.beginPath(); ctx.arc(p.x * W, p.y * H, p.r, 0, 7); ctx.fill()
        ctx.globalAlpha = 1
      })
      // floor
      ctx.fillStyle = 'rgba(255,255,255,.12)'; ctx.fillRect(0, fy, W, 2)
      const fg = ctx.createLinearGradient(0, fy, 0, H)
      fg.addColorStop(0, 'rgba(255,90,31,.10)'); fg.addColorStop(1, 'rgba(255,90,31,0)')
      ctx.fillStyle = fg; ctx.fillRect(0, fy, W, H - fy)
      ctx.fillStyle = 'rgba(255,139,77,.65)'; ctx.font = '10px "JetBrains Mono", monospace'
      ctx.fillText('pymunk · 60fps · turn ' + String(turn).padStart(2, '0') + '/24', 24, 20)
      ctx.fillStyle = 'rgba(255,90,31,.9)'
      ctx.fillText('● glowing tip = SHARP zone', 24, 34)

      // lunge state machine
      if (lungeT > 0) lungeT--; else lungeSide = 0
      if (lungeT === 0 && cd < -50 && koTimer <= 0 && Math.random() < 0.035) {
        lungeT = 22; lungeSide = Math.random() < 0.55 ? 1 : -1
      }
      const k = lungeT > 0 ? Math.sin((1 - lungeT / 22) * Math.PI) : 0
      const lungeA = lungeSide === 1 ? k * 30 : 0
      const lungeB = lungeSide === -1 ? k * 30 : 0
      const ax = W / 2 - 108 - lungeA * 1.1 + Math.sin(phase) * 10
      const bx = W / 2 + 108 + lungeB * 1.1 + Math.cos(phase * 0.9) * 10
      const guardB = Math.sin(phase * 0.35) > 0.25 && lungeSide !== -1
      const pA = stick(ax, 1, '#3ddc84', 'A', lungeSide === 1 ? -0.06 : -0.55 + Math.sin(phase * 1.4) * 0.22, lungeA, false)
      const pB = stick(bx, -1, '#4da3ff', 'B', lungeSide === -1 ? -0.06 : (guardB ? -1.25 : -0.55 - Math.cos(phase * 1.2) * 0.22), lungeB, guardB)

      // clash at the blades
      if (lungeT === 11 && cd < -40) {
        cd = 0
        const cx = (pA.tx + pB.tx) / 2, cy = (pA.ty + pB.ty) / 2
        burst(cx, cy, 22); burst(cx, cy, 10, '#ff5a1f')
        rings.push({ x: cx, y: cy, r: 5, l: 1 })
        shake = Math.min(15, shake + 9)
        hitstop = 5
        const dmg = 4 + Math.random() * 16
        const sharp = Math.random() < 0.55
        if (sharp) flash = 0.6
        if (Math.random() < 0.5) hpA = Math.max(0, hpA - (sharp ? dmg : dmg * 0.25))
        else hpB = Math.max(0, hpB - (sharp ? dmg : dmg * 0.25))
        floats.push({ x: cx, y: cy - 14, t: dmg.toFixed(1) + 'dmg' + (sharp ? ' SHARP' : ''), c: sharp ? '#ff5a1f' : '#a89f8f', l: 1 })
        playClash(sharp)
        const tn = String(turn).padStart(2, '0')
        cb.current.onTick(`turn ${tn} · A:<b>${ACTS_A[turn % ACTS_A.length]}</b> vs B:<b>${ACTS_B[turn % ACTS_B.length]}</b> ◆ <span style="color:#ffc857">${dmg.toFixed(1)}dmg</span> ${sharp ? '<span style="color:#ff5a1f;font-weight:700">SHARP</span>' : 'blunt'}`)
        turn++
        hud()
        if (hpA <= 0 || hpB <= 0) {
          koTimer = 195
          const w = hpA > hpB ? 'A' : 'B'
          cb.current.onTick(`<span style="color:#ff5a1f;font-weight:800">☠ K.O. — Fighter ${w} wins · KILLCAM ▮▮</span>`)
          burst(cx, cy, 60, '#ff5a1f')
          shake = 16; flash = 0.8; hitstop = 10
          playKO()
        }
      }

      // particles
      sparks = sparks.filter(s => s.l > 0)
      sparks.forEach(s => {
        s.x += s.vx * timeScale; s.y += s.vy * timeScale; s.vy += 0.35 * timeScale; s.l -= 0.03
        ctx.globalAlpha = Math.max(0, s.l); ctx.fillStyle = s.col; ctx.fillRect(s.x, s.y, 3, 3); ctx.globalAlpha = 1
      })
      rings = rings.filter(r => r.l > 0)
      rings.forEach(r => {
        r.r += 3.4 * Math.max(timeScale, 0.3); r.l -= 0.06
        ctx.globalAlpha = Math.max(0, r.l); ctx.strokeStyle = '#ffd166'; ctx.lineWidth = 2.5
        ctx.beginPath(); ctx.arc(r.x, r.y, r.r, 0, 7); ctx.stroke(); ctx.globalAlpha = 1
      })
      floats = floats.filter(f => f.l > 0)
      floats.forEach(f => {
        f.y -= 1 * Math.max(timeScale, 0.3); f.l -= 0.02
        ctx.globalAlpha = Math.max(0, f.l); ctx.fillStyle = f.c
        ctx.font = 'bold 13px "JetBrains Mono", monospace'
        ctx.fillText(f.t, f.x - 30, f.y); ctx.globalAlpha = 1
      })
      ctx.fillStyle = vig; ctx.fillRect(-20, -20, W + 40, H + 40)
      ctx.restore()

      // hit flash
      if (flash > 0.02) {
        ctx.fillStyle = `rgba(255,240,240,${(flash * 0.22).toFixed(3)})`
        ctx.fillRect(0, 0, W, H)
        flash *= 0.85
      }
      shake *= 0.88

      // killcam
      const targetBar = koTimer > 60 ? 26 : 0
      barH += (targetBar - barH) * 0.15
      if (koTimer > 0) {
        koTimer--
        if (koTimer > 70) koText = Math.min(1, koText + 0.06)
        if (barH > 0.5) {
          ctx.fillStyle = '#000'
          ctx.fillRect(0, 0, W, barH); ctx.fillRect(0, H - barH, W, barH)
          if (koTimer > 70) {
            ctx.fillStyle = '#ff5a1f'; ctx.font = 'bold 11px "JetBrains Mono", monospace'; ctx.textAlign = 'center'
            ctx.fillText('▮ KILLCAM — SLOW-MO REPLAY ▮', W / 2, Math.min(barH - 8, 18)); ctx.textAlign = 'left'
          }
        }
        if (koTimer > 70 && koText > 0) {
          const s = 1 + Math.max(0, 1 - koText) * 2.2
          ctx.save(); ctx.translate(W / 2, H / 2 - 10); ctx.scale(s, s)
          ctx.font = '900 54px "Space Grotesk", sans-serif'; ctx.textAlign = 'center'
          ctx.shadowColor = '#ff5a1f'; ctx.shadowBlur = 30
          ctx.fillStyle = '#fff'; ctx.fillText('K.O.', 0, 0)
          ctx.restore(); ctx.textAlign = 'left'
        }
        if (koTimer === 0) {
          hpA = hpB = 100; turn = 1; koText = 0
          tagIdx = (tagIdx + 1) % TAGS.length
          hud()
          cb.current.onTick('—— new duel queued · identities re-scrambled 🎲 ——')
        }
      }
      raf = requestAnimationFrame(frame)
    }

    hud()
    raf = requestAnimationFrame(frame)
    return () => {
      dead = true
      cancelAnimationFrame(raf)
      ro.disconnect()
      io.disconnect()
      window.removeEventListener('pointerdown', ensureAudio)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return <canvas ref={canvasRef} className="w-full block select-none" />
}
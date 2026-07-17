import { useEffect, useRef, useState } from 'react'

function readVisitCount() {
  try {
    const visitKey = 'sj_visit_count'
    const sessionKey = 'sj_visit_counted'
    let count = Number.parseInt(localStorage.getItem(visitKey) || '0', 10)

    if (!sessionStorage.getItem(sessionKey)) {
      count += 1
      localStorage.setItem(visitKey, String(count))
      sessionStorage.setItem(sessionKey, 'true')
    }

    return Math.max(count, 1)
  } catch {
    return 1
  }
}

export const VISIT_COUNT = readVisitCount()

export function useHaunting() {
  const [hauntingActive, setHauntingActive] = useState(VISIT_COUNT >= 2)
  const [archiveVisible, setArchiveVisible] = useState(false)
  const [redPulse, setRedPulse] = useState(false)
  const [isPossessed, setIsPossessed] = useState(false)
  const [possessionElapsed, setPossessionElapsed] = useState(0)
  const [isJumpScare, setIsJumpScare] = useState(false)
  const [isConsumed, setIsConsumed] = useState(false)
  const terminalRef = useRef(false)

  useEffect(() => {
    terminalRef.current = isJumpScare || isConsumed
  }, [isConsumed, isJumpScare])

  useEffect(() => {
    const revealTimer = window.setTimeout(() => setHauntingActive(true), VISIT_COUNT >= 2 ? 1200 : 4500)
    const archiveTimer = window.setTimeout(() => setArchiveVisible(true), VISIT_COUNT >= 2 ? 3200 : 11000)
    return () => {
      window.clearTimeout(revealTimer)
      window.clearTimeout(archiveTimer)
    }
  }, [])

  useEffect(() => {
    if (!hauntingActive) return undefined

    let pulseTimer
    let pulseEndTimer
    let stopped = false

    function schedulePulse() {
      pulseTimer = window.setTimeout(() => {
        if (stopped) return
        setRedPulse(true)
        pulseEndTimer = window.setTimeout(() => {
          setRedPulse(false)
          schedulePulse()
        }, 180 + Math.random() * 620)
      }, 2800 + Math.random() * 6200)
    }

    schedulePulse()
    return () => {
      stopped = true
      window.clearTimeout(pulseTimer)
      window.clearTimeout(pulseEndTimer)
    }
  }, [hauntingActive])

  useEffect(() => {
    let idleTimer

    function resetIdle() {
      if (terminalRef.current) return
      window.clearTimeout(idleTimer)
      setIsPossessed(false)
      setPossessionElapsed(0)
      idleTimer = window.setTimeout(() => setIsPossessed(true), 4000)
    }

    const activityEvents = ['pointermove', 'pointerdown', 'keydown', 'touchstart', 'scroll']
    activityEvents.forEach((eventName) => window.addEventListener(eventName, resetIdle, { passive: true }))
    resetIdle()

    return () => {
      window.clearTimeout(idleTimer)
      activityEvents.forEach((eventName) => window.removeEventListener(eventName, resetIdle))
    }
  }, [])

  useEffect(() => {
    if (!isPossessed || isConsumed) return undefined

    const startedAt = window.performance.now()
    let consumeTimer
    const progressTimer = window.setInterval(() => {
      const elapsed = (window.performance.now() - startedAt) / 1000
      setPossessionElapsed(elapsed)

      if (elapsed >= 44 && !terminalRef.current) {
        terminalRef.current = true
        setIsJumpScare(true)
        window.clearInterval(progressTimer)
        consumeTimer = window.setTimeout(() => {
          setIsConsumed(true)
          setIsJumpScare(false)
        }, 1350)
      }
    }, 100)

    return () => {
      window.clearInterval(progressTimer)
      window.clearTimeout(consumeTimer)
    }
  }, [isConsumed, isPossessed])

  return {
    archiveVisible,
    hauntingActive,
    isConsumed,
    isJumpScare,
    isPossessed,
    possessionElapsed,
    redPulse,
  }
}

function Watcher({ visible }) {
  const watcherRef = useRef(null)
  const targetRef = useRef({ x: -100, y: -100 })
  const currentRef = useRef({ x: -100, y: -100 })

  useEffect(() => {
    if (!visible) return undefined

    let animationFrame
    const handlePointerMove = (event) => {
      targetRef.current = { x: event.clientX, y: event.clientY }
    }

    function follow() {
      const current = currentRef.current
      const target = targetRef.current
      current.x += (target.x - current.x) * 0.032
      current.y += (target.y - current.y) * 0.032

      if (watcherRef.current) {
        watcherRef.current.style.transform = `translate3d(${current.x}px, ${current.y}px, 0)`
      }
      animationFrame = window.requestAnimationFrame(follow)
    }

    window.addEventListener('pointermove', handlePointerMove, { passive: true })
    animationFrame = window.requestAnimationFrame(follow)
    return () => {
      window.removeEventListener('pointermove', handlePointerMove)
      window.cancelAnimationFrame(animationFrame)
    }
  }, [visible])

  if (!visible) return null
  return <span className="watcher-dot" ref={watcherRef} aria-hidden="true" />
}

const HANDPRINT_ASSETS = [
  ...Array.from({ length: 9 }, (_, index) => ({
    src: '/images/bloody-handprints-sprite.png',
    columns: 3,
    rows: 3,
    cell: index,
  })),
  ...Array.from({ length: 8 }, (_, index) => ({
    src: '/images/bloody-handprints-sprite-8.png',
    columns: 4,
    rows: 2,
    cell: index,
  })),
]

const HANDPRINT_PLACEMENTS = [
  [1.1, 5, 7, 210, -18, 92], [3.35, 67, 4, 176, 13, 58], [5.6, 36, 13, 245, -7, 110],
  [7.85, 78, 27, 220, 25, 86], [10.1, 9, 34, 188, 8, 76], [12.35, 52, 38, 270, -22, 125],
  [14.6, 27, 48, 215, 17, 68], [16.85, 72, 53, 235, -11, 118], [19.1, -3, 66, 255, 28, 98],
  [21.35, 42, 69, 205, 6, 72], [23.6, 82, 72, 190, -29, 105], [25.85, 17, 79, 230, -8, 115],
  [28.1, 61, 82, 265, 19, 92], [30.35, 88, 2, 172, -15, 78], [32.6, 0, 20, 195, 31, 88],
  [34.85, 39, -5, 228, 11, 103], [37.1, 69, 68, 280, -19, 140],
]

const FLOOD_PLACEMENTS = HANDPRINT_PLACEMENTS.map((placement, index) => [
  38 + index * 0.32,
  (placement[1] + 29 + index * 7) % 96 - 5,
  (placement[2] + 23 + index * 11) % 94 - 4,
  placement[3] * 1.08,
  placement[4] * -1.25,
  placement[5] * 1.35,
])

function Handprint({ asset, placement, index }) {
  const [at, x, y, size, rotation, drip] = placement
  const column = asset.cell % asset.columns
  const row = Math.floor(asset.cell / asset.columns)
  return (
    <span
      className="handprint-mark"
      style={{
        '--mark-x': `${x}%`, '--mark-y': `${y}%`, '--mark-size': `${size}px`,
        '--mark-rotation': `${rotation}deg`, '--drip-length': `${drip}px`,
        '--mark-delay': `${(index % 5) * 0.06}s`,
      }}
      data-appears-at={at}
    >
      <b aria-hidden="true">
        <img
          src={asset.src}
          alt=""
          style={{
            width: `${asset.columns * 100}%`, height: `${asset.rows * 100}%`,
            left: `${column * -100}%`, top: `${row * -100}%`,
          }}
        />
      </b>
      <i aria-hidden="true" />
    </span>
  )
}

function HandprintSwarm({ elapsed, isJumpScare }) {
  const placements = [...HANDPRINT_PLACEMENTS, ...FLOOD_PLACEMENTS]
  const visible = placements.filter(([at]) => isJumpScare || elapsed >= at)
  if (!visible.length) return null

  return (
    <div className={`handprint-swarm${isJumpScare ? ' handprint-flood' : ''}`} aria-hidden="true">
      {visible.map((placement, index) => (
        <Handprint
          key={`${index}-${placement[0]}`}
          asset={HANDPRINT_ASSETS[index % HANDPRINT_ASSETS.length]}
          placement={placement}
          index={index}
        />
      ))}
    </div>
  )
}

function createNoiseBuffer(context, seconds = 2) {
  const buffer = context.createBuffer(1, context.sampleRate * seconds, context.sampleRate)
  const samples = buffer.getChannelData(0)
  let previous = 0
  for (let index = 0; index < samples.length; index += 1) {
    const white = Math.random() * 2 - 1
    previous = previous * 0.985 + white * 0.015
    samples[index] = previous
  }
  return buffer
}

function Soundscape({ active, consumed, jumpScare }) {
  const contextRef = useRef(null)
  const ambienceRef = useRef(null)
  const jumpPlayedRef = useRef(false)
  const activationPlayedRef = useRef(false)
  const [enabled, setEnabled] = useState(false)
  const [muted, setMuted] = useState(false)

  function ensureAudio() {
    if (!contextRef.current) {
      const AudioContext = window.AudioContext || window.webkitAudioContext
      if (!AudioContext) return null
      contextRef.current = new AudioContext()
    }
    if (contextRef.current.state === 'suspended') contextRef.current.resume()
    if (!activationPlayedRef.current) {
      activationPlayedRef.current = true
      const context = contextRef.current
      const now = context.currentTime
      const oscillator = context.createOscillator()
      const gain = context.createGain()
      oscillator.type = 'triangle'
      oscillator.frequency.setValueAtTime(246.9, now)
      oscillator.frequency.exponentialRampToValueAtTime(110, now + 0.72)
      gain.gain.setValueAtTime(0.0001, now)
      gain.gain.exponentialRampToValueAtTime(0.14, now + 0.035)
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.74)
      oscillator.connect(gain).connect(context.destination)
      oscillator.start(now)
      oscillator.stop(now + 0.76)
    }
    setEnabled(true)
    return contextRef.current
  }

  useEffect(() => {
    const unlock = (event) => {
      if (event.target?.closest?.('.sound-toggle')) return
      ensureAudio()
    }
    window.addEventListener('pointerdown', unlock, { once: true })
    window.addEventListener('keydown', unlock, { once: true })
    return () => {
      window.removeEventListener('pointerdown', unlock)
      window.removeEventListener('keydown', unlock)
    }
  }, [])

  useEffect(() => {
    const context = contextRef.current

    function stopAmbience() {
      const ambience = ambienceRef.current
      if (!ambience || !context) return
      const now = context.currentTime
      ambience.master.gain.cancelScheduledValues(now)
      ambience.master.gain.setValueAtTime(Math.max(ambience.master.gain.value, 0.0001), now)
      ambience.master.gain.exponentialRampToValueAtTime(0.0001, now + 0.35)
      window.setTimeout(() => ambience.sources.forEach((source) => {
        try { source.stop() } catch { /* already stopped */ }
      }), 400)
      ambienceRef.current = null
    }

    if (!context || !enabled || muted || jumpScare) {
      stopAmbience()
      return undefined
    }

    const mode = consumed ? 'ruins' : active ? 'haunting' : null
    if (!mode || ambienceRef.current?.mode === mode) return stopAmbience
    stopAmbience()

    const now = context.currentTime
    const master = context.createGain()
    const filter = context.createBiquadFilter()
    master.gain.setValueAtTime(0.0001, now)
    master.gain.exponentialRampToValueAtTime(mode === 'ruins' ? 0.12 : 0.22, now + 1.4)
    filter.type = 'lowpass'
    filter.frequency.value = mode === 'ruins' ? 1100 : 1500
    master.connect(filter).connect(context.destination)

    const frequencies = mode === 'ruins' ? [98, 146.8, 196] : [110, 146.8, 174.6, 220]
    const sources = frequencies.map((frequency, index) => {
      const oscillator = context.createOscillator()
      const gain = context.createGain()
      oscillator.type = index % 3 === 2 ? 'triangle' : 'sine'
      oscillator.frequency.value = frequency
      oscillator.detune.value = index * 4 - 3
      gain.gain.value = mode === 'ruins' ? 0.24 : 0.32
      oscillator.connect(gain).connect(master)
      oscillator.start()
      return oscillator
    })

    const noise = context.createBufferSource()
    const noiseGain = context.createGain()
    noise.buffer = createNoiseBuffer(context)
    noise.loop = true
    noiseGain.gain.value = mode === 'ruins' ? 0.13 : 0.22
    noise.connect(noiseGain).connect(master)
    noise.start()
    sources.push(noise)

    ambienceRef.current = { master, mode, sources }
    return stopAmbience
  }, [active, consumed, enabled, jumpScare, muted])

  useEffect(() => {
    if (!jumpScare || !enabled || muted || jumpPlayedRef.current) return
    const context = ensureAudio()
    if (!context) return
    jumpPlayedRef.current = true

    const now = context.currentTime
    const master = context.createGain()
    const compressor = context.createDynamicsCompressor()
    compressor.threshold.value = -16
    compressor.ratio.value = 16
    master.gain.setValueAtTime(0.0001, now)
    master.gain.exponentialRampToValueAtTime(0.38, now + 0.025)
    master.gain.exponentialRampToValueAtTime(0.0001, now + 1.15)
    master.connect(compressor).connect(context.destination)

    const noise = context.createBufferSource()
    noise.buffer = createNoiseBuffer(context, 1.2)
    noise.connect(master)
    noise.start(now)
    noise.stop(now + 1.2)

    ;[57, 61, 720].forEach((frequency, index) => {
      const oscillator = context.createOscillator()
      oscillator.type = index === 2 ? 'sawtooth' : 'square'
      oscillator.frequency.setValueAtTime(frequency, now)
      oscillator.frequency.exponentialRampToValueAtTime(Math.max(32, frequency * 0.42), now + 1.1)
      oscillator.connect(master)
      oscillator.start(now)
      oscillator.stop(now + 1.2)
    })
  }, [enabled, jumpScare, muted])

  return (
    <>
      {!enabled && (
        <button type="button" className="sound-start" onClick={() => { ensureAudio(); setMuted(false) }}>
          <strong>음향 포함 체험 시작</strong>
          <span>브라우저 정책상 한 번 눌러야 소리가 재생됩니다</span>
        </button>
      )}
      <button
        type="button"
        className="sound-toggle"
        onClick={() => {
          if (!enabled) {
            ensureAudio()
            setMuted(false)
          } else {
            setMuted((value) => !value)
          }
        }}
        aria-pressed={enabled && !muted}
      >
        {!enabled ? '음향 켜기' : muted ? '음향 꺼짐' : '음향 켜짐'}
      </button>
    </>
  )
}

export function DecommissionedScreen() {
  return (
    <main className="decommissioned-screen">
      <div className="decommissioned-copy">
        <p>SERVICE TERMINATED · ARCHIVE 07</p>
        <h1>이 사이트는<br />폐지되었습니다.</h1>
        <span>마지막 정상 접속 이후 모든 기록이 회수되었습니다.</span>
        <small>연결된 열람자 1명 · 연결 종료 불가</small>
      </div>
    </main>
  )
}

export function HorrorOverlay({ hauntingActive, isConsumed, isJumpScare, isPossessed, possessionElapsed }) {
  const corruptedPhrases = [
    '보지않았는데기억하고있다', '문을닫으면문안쪽이열린다', '사람수가맞지않는다',
    '아직들어오지않은사람이나갔다', '이름이름이름없음없음', '여기여기아님여기아님',
    '기록외부기록내부열람자없음', '0307031703170317', '뒤에없다고하지마뒤에없다',
    '네번째벽은처음부터없었다', '나가지않았는데다시왔다', '읽지마읽었네읽지마읽었네',
  ]

  return (
    <>
      <div className="noise-layer" aria-hidden="true" />
      <div className="scanline-layer" aria-hidden="true" />
      <img className="handprint-preload" src="/images/bloody-handprints-sprite.png" alt="" aria-hidden="true" />
      <img className="handprint-preload" src="/images/bloody-handprints-sprite-8.png" alt="" aria-hidden="true" />
      <Watcher visible={hauntingActive && !isConsumed} />
      <Soundscape active={isPossessed} consumed={isConsumed} jumpScare={isJumpScare} />
      {(isPossessed || isJumpScare) && <HandprintSwarm elapsed={possessionElapsed} isJumpScare={isJumpScare} />}
      {isPossessed && !isConsumed && (
        <>
          <div className="phrase-swarm" aria-hidden="true">
            {[...corruptedPhrases, ...corruptedPhrases].map((phrase, index) => (
              <span key={`${phrase}-${index}`}>{phrase}</span>
            ))}
          </div>
          {!isJumpScare && possessionElapsed < 5 && (
            <div className="possession-message" aria-hidden="true">
              <span>움직이지 마세요. 화면이 먼저 움직이고 있습니다.</span>
              <small>아래에 있는 문장은 아래에 없습니다. 위에 있는 사람은 사람이 아닙니다.</small>
            </div>
          )}
        </>
      )}
    </>
  )
}

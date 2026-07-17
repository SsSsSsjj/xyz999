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

function apparitionStage(elapsed) {
  if (elapsed >= 1.5 && elapsed < 4.5) return 1
  if (elapsed >= 7 && elapsed < 10.5) return 2
  if (elapsed >= 14 && elapsed < 17.5) return 3
  if (elapsed >= 22 && elapsed < 25.5) return 4
  if (elapsed >= 31 && elapsed < 35) return 5
  if (elapsed >= 38) return 6
  return 0
}

function Apparition({ elapsed, isJumpScare }) {
  const stage = isJumpScare ? 7 : apparitionStage(elapsed)
  if (!stage) return null

  return (
    <div className={`apparition-layer apparition-stage-${stage}`} aria-hidden="true">
      <img src="/images/corridor-apparition.png" alt="" />
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
  const [enabled, setEnabled] = useState(false)
  const [muted, setMuted] = useState(false)

  function ensureAudio() {
    if (!contextRef.current) {
      const AudioContext = window.AudioContext || window.webkitAudioContext
      if (!AudioContext) return null
      contextRef.current = new AudioContext()
    }
    if (contextRef.current.state === 'suspended') contextRef.current.resume()
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
    master.gain.exponentialRampToValueAtTime(mode === 'ruins' ? 0.07 : 0.14, now + 1.4)
    filter.type = 'lowpass'
    filter.frequency.value = mode === 'ruins' ? 520 : 310
    master.connect(filter).connect(context.destination)

    const frequencies = mode === 'ruins' ? [82.4, 123.5, 164.8] : [43.2, 46.1, 87.4]
    const sources = frequencies.map((frequency, index) => {
      const oscillator = context.createOscillator()
      const gain = context.createGain()
      oscillator.type = index === 2 ? 'triangle' : 'sine'
      oscillator.frequency.value = frequency
      oscillator.detune.value = index * 4 - 3
      gain.gain.value = mode === 'ruins' ? 0.22 : 0.3
      oscillator.connect(gain).connect(master)
      oscillator.start()
      return oscillator
    })

    const noise = context.createBufferSource()
    const noiseGain = context.createGain()
    noise.buffer = createNoiseBuffer(context)
    noise.loop = true
    noiseGain.gain.value = mode === 'ruins' ? 0.08 : 0.18
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
    compressor.threshold.value = -12
    compressor.ratio.value = 12
    master.gain.setValueAtTime(0.0001, now)
    master.gain.exponentialRampToValueAtTime(0.24, now + 0.025)
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
      <img className="apparition-preload" src="/images/corridor-apparition.png" alt="" aria-hidden="true" />
      <Watcher visible={hauntingActive && !isConsumed} />
      <Soundscape active={isPossessed} consumed={isConsumed} jumpScare={isJumpScare} />
      {(isPossessed || isJumpScare) && <Apparition elapsed={possessionElapsed} isJumpScare={isJumpScare} />}
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

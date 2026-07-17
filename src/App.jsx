import { lazy, Suspense } from 'react'
import { DecommissionedScreen, HorrorOverlay, useHaunting, VISIT_COUNT } from './HorrorEffects.jsx'

const Guestbook = lazy(() => import('./Guestbook.jsx'))

const GITHUB_URL = 'https://github.com/SsSsSsjj'

function ArrowIcon() {
  return <span aria-hidden="true">↗</span>
}

function visitorMessage(isPossessed) {
  if (isPossessed) return '4초 동안 움직임이 없었습니다. 숨겨 둔 기록이 먼저 당신을 열었습니다.'
  if (VISIT_COUNT === 1) return '안녕하세요. 처음 오셨군요.'
  if (VISIT_COUNT === 2) return '다시 오셨네요. 이전 기록은 아직 남아 있습니다.'
  if (VISIT_COUNT === 3) return '이번에는 조금 오래 계시네요.'
  return `${VISIT_COUNT}번째 방문입니다. 계속 같은 부분을 보고 계시네요.`
}

function App() {
  const { archiveVisible, hauntingActive, isConsumed, isJumpScare, isPossessed, possessionElapsed, redPulse } = useHaunting()

  if (isConsumed) {
    return (
      <div className="site-shell haunting-active consumed">
        <HorrorOverlay hauntingActive isConsumed isJumpScare={false} isPossessed={false} possessionElapsed={44} />
        <DecommissionedScreen />
      </div>
    )
  }

  return (
    <div className={`site-shell${hauntingActive ? ' haunting-active' : ''}${redPulse ? ' red-pulse' : ''}${isPossessed ? ' possessed' : ''}${isJumpScare ? ' jump-scare' : ''}`}>
      <HorrorOverlay hauntingActive={hauntingActive} isConsumed={false} isJumpScare={isJumpScare} isPossessed={isPossessed} possessionElapsed={possessionElapsed} />
      <a className="skip-link" href="#main">본문으로 건너뛰기</a>

      <header className="nav-wrap">
        <nav className="nav container" aria-label="주요 메뉴">
          <a className="brand" href="#top" aria-label="서진 홈">
            <span className="brand-dot" aria-hidden="true" />
            SJ
          </a>
          <div className="nav-links">
            <a href="#about">{isPossessed ? '발견' : '소개'}</a>
            <a href="#now">{isPossessed ? '관찰' : '요즘'}</a>
            <a href="#rhythm">{isPossessed ? '절차' : '리듬'}</a>
            <a href="#guestbook">{isPossessed ? '증언' : '방명록'}</a>
            {archiveVisible && <a className="archive-link" href="#record" aria-label="07 · 기록">07 · 기록</a>}
          </div>
          <a className="nav-cta" href={GITHUB_URL} target="_blank" rel="noreferrer">
            GitHub <ArrowIcon />
          </a>
        </nav>
      </header>

      <main id="main">
        <section className="hero container" id="top" aria-labelledby="hero-title">
          <div className="hero-copy">
            <p className="eyebrow"><span /> {isPossessed ? 'ARCHIVE 07 · 열람 중' : 'KANGNAM UNIV. · SEOJIN'}</p>
            <h1 id="hero-title" className="glitch-text" aria-label={isPossessed ? '이 화면은 당신을 기다리고 있었습니다.' : '아직 정답보다 가능성을.'} data-text={isPossessed ? '이 화면은 당신을 기다리고 있었습니다.' : '아직 정답보다 가능성을.'}>
              {isPossessed ? <>이 화면은 당신을<br /><em>기다리고 있었습니다.</em></> : <>아직 정답보다<br /><em>가능성을.</em></>}
            </h1>
            <p className="hero-lead memory-line">{visitorMessage(isPossessed)}</p>
            <div className="hero-actions">
              <a className="button button-primary" href={isPossessed ? '#record' : GITHUB_URL} target={isPossessed ? undefined : '_blank'} rel={isPossessed ? undefined : 'noreferrer'}>
                {isPossessed ? '기록 원본 열기' : 'GitHub에서 보기'} <ArrowIcon />
              </a>
              <a className="text-link" href="#about">{isPossessed ? '처음 발견된 장소' : '조금 더 알아보기'} <span aria-hidden="true">↓</span></a>
            </div>
          </div>
          <figure className="hero-art">
            <img className="hero-image normal-image" src="/images/thought-to-screen-v2.png" alt="메모 카드와 화면이 역동적인 보라색 경로로 이어진 그래픽 일러스트" />
            <img className="hero-image haunted-image" src="/images/thought-to-screen-haunted.png" alt="" aria-hidden="true" />
            <figcaption>{isPossessed ? '화면 안쪽에서 움직임이 감지됨' : '배우고 · 고민하고 · 시도하는 중'}</figcaption>
          </figure>
        </section>

        <section className="section container" id="about" aria-labelledby="about-title">
          <div className="section-heading">
            <p className="section-index">{isPossessed ? '01 · 최초 발견 기록' : '01 · ABOUT'}</p>
            <h2 id="about-title" className="glitch-text" aria-label={isPossessed ? '처음부터 혼자 만든 사이트가 아니었습니다.' : '조용히, 꾸준히 내 방향을 찾는 중.'} data-text={isPossessed ? '처음부터 혼자 만든 사이트가 아니었습니다.' : '조용히, 꾸준히 내 방향을 찾는 중.'}>{isPossessed ? <>처음부터 혼자 만든<br />사이트가 아니었습니다.</> : <>조용히, 꾸준히<br />내 방향을 찾는 중.</>}</h2>
          </div>
          <div className="about-card">
            <p className="about-statement">{isPossessed ? <>작성자가 지운 파일 안에서 <strong>두 번째 방문자</strong>가 발견되었습니다.</> : <>소프트웨어를 배우며 미래를 탐색하는 <strong>ISFP</strong> 학생입니다.</>}</p>
            <p>{isPossessed ? '최초 업로드 당시에는 이 페이지가 존재하지 않았습니다. 매일 새벽 3시 17분, 서버에 없는 문장이 한 줄씩 늘어났고 삭제할 때마다 마지막 접속자의 화면에서 다시 나타났습니다.' : '전공 수업을 따라가며 개발의 여러 모습을 알아가는 중이지만, 아직 어떤 분야가 저와 가장 잘 맞는지는 고민하고 있습니다. 빠르게 답을 정하기보다 직접 배우고 경험하면서 제 속도로 선택하고 싶습니다. 요즘은 개발 진로와 취업을 생각하며 정보처리기사도 준비하고 있습니다.'}</p>
            <div className="chips" aria-label="서진을 설명하는 키워드">
              {(isPossessed ? ['복구 불가', '출처 없음', '03:17', '접속 유지', '열람 중'] : ['소프트웨어전공', 'ISFP', '진로 탐색', '개발', '진행 중']).map((chip) => <span key={chip}>{chip}</span>)}
            </div>
          </div>
        </section>

        <section className="now-section" id="now" aria-labelledby="now-title">
          <div className="container">
            <div className="section-heading compact">
              <p className="section-index">{isPossessed ? '02 · 관찰 보고서' : '02 · NOW'}</p>
              <h2 id="now-title" className="glitch-text" aria-label={isPossessed ? '당신이 멈춘 동안 세 가지가 움직였습니다.' : '요즘의 세 가지 장면'} data-text={isPossessed ? '당신이 멈춘 동안 세 가지가 움직였습니다.' : '요즘의 세 가지 장면'}>{isPossessed ? <>당신이 멈춘 동안<br />세 가지가 움직였습니다.</> : <>요즘의<br />세 가지 장면</>}</h2>
            </div>
            <div className="now-grid">
              <article><span>01</span><h3>{isPossessed ? '사진 속 인원 증가' : '진로라는 긴 질문'}</h3><p>{isPossessed ? '처음 저장된 이미지에는 아무도 없었습니다. 지금은 화면 안쪽에 한 명이 서 있습니다.' : '개발의 어떤 분야가 저와 맞을지, 취업을 위해 무엇부터 준비해야 할지 생각하고 있습니다.'}</p></article>
              <article><span>02</span><h3>{isPossessed ? '커서의 독립 이동' : '두 가지 시험 준비'}</h3><p>{isPossessed ? '사용자가 손을 떼도 붉은 점은 멈추지 않았습니다. 점이 닿은 위치에서 마지막 접속 기록이 발견됩니다.' : '전공과 연결된 정보처리기사, 생활의 새로운 시작이 될 운전면허 필기시험을 함께 준비하고 있습니다.'}</p></article>
              <article><span>03</span><h3>{isPossessed ? '열람자 이름 확인' : '수영 못 다니게 되어 슬퍼하는 중'}</h3><p>{isPossessed ? `기록에 적힌 ${VISIT_COUNT}번째 열람자의 방문 시간과 지금 이 화면의 시간이 일치합니다.` : '다니던 수영장의 화재로 12월까지 수영을 쉬게 되어 아쉬워하고 있습니다.'}</p></article>
            </div>
          </div>
        </section>

        <section className="section container style-section" id="style" aria-labelledby="style-title">
          <div className="style-copy">
            <p className="section-index">{isPossessed ? '03 · 음성 복구본' : '03 · STYLE'}</p>
            <h2 id="style-title">{isPossessed ? <>마지막 녹음에<br />남아 있던 소리</> : <>좋아하는<br />시간과 공간</>}</h2>
            <p>{isPossessed ? '말소리 뒤에서 낮게 반복되는 문장은 현재 페이지의 방문 횟수와 일치했습니다.' : '무언가를 크게 해내는 시간만큼, 조용히 보고 듣거나 풍경 속에 머무는 시간을 좋아합니다.'}</p>
          </div>
          <ul className="style-list">
            <li><span>{isPossessed ? '00:04' : '보고 듣기'}</span><strong>{isPossessed ? '움직임이 멈췄다' : '유튜브 · 애니메이션 · 팟캐스트'}</strong></li>
            <li><span>{isPossessed ? '00:08' : '천천히 읽기'}</span><strong>{isPossessed ? '화면 안쪽에서 숨소리가 들렸다' : '세계문학전집에서 끌리는 작품 골라 읽기'}</strong></li>
            <li><span>{isPossessed ? '00:13' : '밖에서 쉬기'}</span><strong>{isPossessed ? '이름을 부르지 않았는데 대답했다' : '공원 · 바다 · 도서관'}</strong></li>
            <li><span>{isPossessed ? '00:17' : '빛을 보기'}</span><strong>{isPossessed ? '녹음은 여기서 끝나지 않았다' : '일출과 일몰의 조용한 순간'}</strong></li>
          </ul>
        </section>

        <section className="rhythm-wrap" id="rhythm" aria-labelledby="rhythm-title">
          <div className="container rhythm-card">
            <div>
              <p className="section-index">{isPossessed ? '04 · 종료 절차' : '04 · NEXT'}</p>
              <h2 id="rhythm-title">{isPossessed ? <>화면을 닫기 전<br />확인할 것</> : <>앞으로<br />알아가고 싶은 것</>}</h2>
            </div>
            <ol className="rhythm-flow">
              <li><span>01</span><div><strong>{isPossessed ? '뒤' : '분야'}</strong><small>{isPossessed ? '화면이 꺼져도 뒤를 돌아보지 말 것' : '어떤 개발 분야가 저와 잘 맞는지'}</small></div></li>
              <li><span>02</span><div><strong>{isPossessed ? '소리' : '경험'}</strong><small>{isPossessed ? '이름을 불러도 대답하지 말 것' : '작은 프로젝트로 무엇을 배울 수 있는지'}</small></div></li>
              <li><span>03</span><div><strong>{isPossessed ? '창' : '준비'}</strong><small>{isPossessed ? '닫힌 창문에 비친 인원을 세지 말 것' : '정보처리기사부터 취업 역량까지 하나씩'}</small></div></li>
              <li><span>04</span><div><strong>{isPossessed ? '기록' : '균형'}</strong><small>{isPossessed ? '이 절차를 읽었다는 사실을 남기지 말 것' : '배움과 취미를 제 리듬으로 이어가는 법'}</small></div></li>
            </ol>
          </div>
        </section>

        <Suspense fallback={<section className="guestbook-loading" aria-live="polite">방명록을 준비하는 중…</section>}>
          <Guestbook hauntingActive={hauntingActive} isPossessed={isPossessed} />
        </Suspense>

        <section className="contact container" id="contact" aria-labelledby="contact-title">
          <p className="section-index">{isPossessed ? '06 · 마지막 전송' : '06 · CONTACT'}</p>
          <h2 id="contact-title">{isPossessed ? <>이미 당신의 화면으로<br />전송되었습니다.</> : <>다음 생각은<br />여기에서 이어집니다.</>}</h2>
          <a className="button button-contact" href={GITHUB_URL} target="_blank" rel="noreferrer">
            {isPossessed ? '전송 취소 불가' : 'SsSsSsjj'} <ArrowIcon />
          </a>
        </section>

        {archiveVisible && (
          <section className="archive-section" id="record" aria-labelledby="archive-title">
            <div className="container archive-card">
              <p className="section-index">07 · {isPossessed ? '숨겨진 원본' : '존재하지 않는 기록'}</p>
              <h2 id="archive-title" className="glitch-text" aria-label={isPossessed ? '이 기록은 당신이 오기 전에 작성되었습니다.' : '이 페이지에는 일곱 번째 항목이 없습니다.'} data-text={isPossessed ? '이 기록은 당신이 오기 전에 작성되었습니다.' : '이 페이지에는 일곱 번째 항목이 없습니다.'}>
                {isPossessed ? <>이 기록은 당신이 오기 전에<br />작성되었습니다.</> : <>이 페이지에는<br />일곱 번째 항목이 없습니다.</>}
              </h2>
              <div className="archive-log">
                <p><time>03:17:02</time><span>{isPossessed ? '다음 열람자가 4초 동안 움직이지 않을 것' : '방문자가 페이지를 닫았다고 보고됨'}</span></p>
                <p><time>03:17:09</time><span>{isPossessed ? '붉은 화면에서 이 문장을 발견할 것' : '커서 움직임이 계속 감지됨'}</span></p>
                <p><time>03:18:44</time><span>{isPossessed ? '기록된 인원보다 한 명이 더 있을 것' : '삭제된 문장이 스스로 복구됨'}</span></p>
                <p><time>NOW</time><span>{isPossessed ? '예측 완료. 현재 열람자와 일치함' : `현재 열람자: ${VISIT_COUNT}번째 기록과 동일`}</span></p>
              </div>
              <small>{isPossessed ? '발견하지않음발견함발견당함기록자가열람자를열람중' : '이 항목을 발견하지 못한 것으로 처리했습니다.'}</small>
            </div>
          </section>
        )}
      </main>

      <footer className="footer container">
        <p>{isPossessed ? 'ARCHIVE 07 · SUBJECT ONLINE' : 'SEOJIN · KANGNAM UNIV.'}</p><p>{isPossessed ? '다음 열람자를 기다리는 중' : '배우고 · 고민하고 · 시도하는 중'}</p><p>{isPossessed ? '종료되지 않음' : `© ${new Date().getFullYear()} SEOJIN`}</p>
      </footer>
    </div>
  )
}

export default App

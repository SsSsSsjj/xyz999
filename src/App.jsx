const GITHUB_URL = 'https://github.com/SsSsSsjj'

function ArrowIcon() {
  return <span aria-hidden="true">↗</span>
}

function App() {
  return (
    <div className="site-shell">
      <a className="skip-link" href="#main">본문으로 건너뛰기</a>

      <header className="nav-wrap">
        <nav className="nav container" aria-label="주요 메뉴">
          <a className="brand" href="#top" aria-label="서진 홈">
            <span className="brand-dot" aria-hidden="true" />
            SJ
          </a>
          <div className="nav-links">
            <a href="#about">소개</a>
            <a href="#now">요즘</a>
            <a href="#rhythm">리듬</a>
          </div>
          <a className="nav-cta" href={GITHUB_URL} target="_blank" rel="noreferrer">
            GitHub <ArrowIcon />
          </a>
        </nav>
      </header>

      <main id="main">
        <section className="hero container" id="top" aria-labelledby="hero-title">
          <div className="hero-copy">
            <p className="eyebrow"><span /> KANGNAM UNIV. · SEOJIN</p>
            <h1 id="hero-title">아직 정답보다<br /><em>가능성을.</em></h1>
            <p className="hero-lead">안녕하세요. 강남대학교에서 소프트웨어를 전공하는 서진입니다. 개발과 진로 사이에서, 저에게 맞는 방향을 천천히 찾아가고 있습니다.</p>
            <div className="hero-actions">
              <a className="button button-primary" href={GITHUB_URL} target="_blank" rel="noreferrer">
                GitHub에서 보기 <ArrowIcon />
              </a>
              <a className="text-link" href="#about">조금 더 알아보기 <span aria-hidden="true">↓</span></a>
            </div>
          </div>
          <figure className="hero-art">
            <img src="/images/thought-to-screen-v2.png" alt="메모 카드와 화면이 역동적인 보라색 경로로 이어진 그래픽 일러스트" />
            <figcaption>배우고 · 고민하고 · 시도하는 중</figcaption>
          </figure>
        </section>

        <section className="section container" id="about" aria-labelledby="about-title">
          <div className="section-heading">
            <p className="section-index">01 · ABOUT</p>
            <h2 id="about-title">조용히, 꾸준히<br />내 방향을 찾는 중.</h2>
          </div>
          <div className="about-card">
            <p className="about-statement">소프트웨어를 배우며 미래를 탐색하는 <strong>ISFP</strong> 학생입니다.</p>
            <p>전공 수업을 따라가며 개발의 여러 모습을 알아가는 중이지만, 아직 어떤 분야가 저와 가장 잘 맞는지는 고민하고 있습니다. 빠르게 답을 정하기보다 직접 배우고 경험하면서 제 속도로 선택하고 싶습니다. 요즘은 개발 진로와 취업을 생각하며 정보처리기사도 준비하고 있습니다.</p>
            <div className="chips" aria-label="서진을 설명하는 키워드">
              <span>소프트웨어전공</span><span>ISFP</span><span>진로 탐색</span><span>개발</span><span>진행 중</span>
            </div>
          </div>
        </section>

        <section className="now-section" id="now" aria-labelledby="now-title">
          <div className="container">
            <div className="section-heading compact">
              <p className="section-index">02 · NOW</p>
              <h2 id="now-title">요즘의<br />세 가지 장면</h2>
            </div>
            <div className="now-grid">
              <article><span>01</span><h3>진로라는 긴 질문</h3><p>개발의 어떤 분야가 저와 맞을지, 취업을 위해 무엇부터 준비해야 할지 생각하고 있습니다.</p></article>
              <article><span>02</span><h3>두 가지 시험 준비</h3><p>전공과 연결된 정보처리기사, 생활의 새로운 시작이 될 운전면허 필기시험을 함께 준비하고 있습니다.</p></article>
              <article><span>03</span><h3>수영 대신 드럼</h3><p>다니던 수영장의 화재로 12월까지 수영을 쉬게 되어 아쉽지만, 그 빈자리에 드럼을 배우기 시작했습니다.</p></article>
            </div>
          </div>
        </section>

        <section className="section container style-section" id="style" aria-labelledby="style-title">
          <div className="style-copy">
            <p className="section-index">03 · STYLE</p>
            <h2 id="style-title">좋아하는<br />시간과 공간</h2>
            <p>무언가를 크게 해내는 시간만큼, 조용히 보고 듣거나 풍경 속에 머무는 시간을 좋아합니다.</p>
          </div>
          <ul className="style-list">
            <li><span>보고 듣기</span><strong>유튜브 · 애니메이션 · 팟캐스트</strong></li>
            <li><span>천천히 읽기</span><strong>세계문학전집에서 끌리는 작품 골라 읽기</strong></li>
            <li><span>밖에서 쉬기</span><strong>공원 · 바다 · 도서관</strong></li>
            <li><span>빛을 보기</span><strong>일출과 일몰의 조용한 순간</strong></li>
          </ul>
        </section>

        <section className="rhythm-wrap" id="rhythm" aria-labelledby="rhythm-title">
          <div className="container rhythm-card">
            <div>
              <p className="section-index">04 · NEXT</p>
              <h2 id="rhythm-title">앞으로<br />알아가고 싶은 것</h2>
            </div>
            <ol className="rhythm-flow">
              <li><span>01</span><div><strong>분야</strong><small>어떤 개발 분야가 저와 잘 맞는지</small></div></li>
              <li><span>02</span><div><strong>경험</strong><small>작은 프로젝트로 무엇을 배울 수 있는지</small></div></li>
              <li><span>03</span><div><strong>준비</strong><small>정보처리기사부터 취업 역량까지 하나씩</small></div></li>
              <li><span>04</span><div><strong>균형</strong><small>배움과 취미를 제 리듬으로 이어가는 법</small></div></li>
            </ol>
          </div>
        </section>

        <section className="contact container" id="contact" aria-labelledby="contact-title">
          <p className="section-index">05 · CONTACT</p>
          <h2 id="contact-title">다음 생각은<br />여기에서 이어집니다.</h2>
          <a className="button button-contact" href={GITHUB_URL} target="_blank" rel="noreferrer">
            SsSsSsjj <ArrowIcon />
          </a>
        </section>
      </main>

      <footer className="footer container">
        <p>SEOJIN · KANGNAM UNIV.</p><p>배우고 · 고민하고 · 시도하는 중</p><p>© {new Date().getFullYear()} SEOJIN</p>
      </footer>
    </div>
  )
}

export default App

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
            <p className="eyebrow"><span /> KOREA · SEOJIN</p>
            <h1 id="hero-title">생각을 붙잡아<br /><em>화면으로.</em></h1>
            <p className="hero-lead">안녕하세요, 서진입니다. 떠오른 생각을 메모하고 연결해, 직접 볼 수 있는 화면으로 옮깁니다.</p>
            <div className="hero-actions">
              <a className="button button-primary" href={GITHUB_URL} target="_blank" rel="noreferrer">
                GitHub에서 보기 <ArrowIcon />
              </a>
              <a className="text-link" href="#about">조금 더 알아보기 <span aria-hidden="true">↓</span></a>
            </div>
          </div>
          <figure className="hero-art">
            <img src="/images/thought-to-screen-v2.png" alt="메모 카드와 화면이 역동적인 보라색 경로로 이어진 그래픽 일러스트" />
            <figcaption>메모에서 화면까지</figcaption>
          </figure>
        </section>

        <section className="section container" id="about" aria-labelledby="about-title">
          <div className="section-heading">
            <p className="section-index">01 · ABOUT</p>
            <h2 id="about-title">한 문장보다<br />한 사람답게.</h2>
          </div>
          <div className="about-card">
            <p className="about-statement">안녕하세요. 한국에서 나만의 방향을 만들어가는 <strong>서진</strong>입니다.</p>
            <p>저를 하나의 직함으로 서둘러 정리하기보다, 무엇을 눈여겨보고 어떻게 표현하는지를 이곳에 차곡차곡 남기려 합니다. 이 사이트는 완성된 이력서가 아니라, 지금의 관심과 취향이 조금씩 선명해지는 개인 공간입니다.</p>
            <div className="chips" aria-label="서진을 설명하는 키워드">
              <span>서진</span><span>한국</span><span>관찰</span><span>기록</span><span>진행 중</span>
            </div>
          </div>
        </section>

        <section className="now-section" id="now" aria-labelledby="now-title">
          <div className="container">
            <div className="section-heading compact">
              <p className="section-index">02 · NOW</p>
              <h2 id="now-title">지금 이곳에서<br />만드는 것</h2>
            </div>
            <div className="now-grid">
              <article><span>01</span><h3>나를 설명하는 언어</h3><p>과장된 수식어 대신, 지금의 저와 정말 가까운 문장을 찾고 있습니다.</p></article>
              <article><span>02</span><h3>취향이 보이는 화면</h3><p>좋아하는 색과 리듬, 여백을 조합해 제 분위기가 느껴지는 공간을 만듭니다.</p></article>
              <article><span>03</span><h3>계속 달라지는 기록</h3><p>새로운 관심이 생길 때마다 이 페이지도 함께 고치고 채워갑니다.</p></article>
            </div>
          </div>
        </section>

        <section className="section container style-section" id="style" aria-labelledby="style-title">
          <div className="style-copy">
            <p className="section-index">03 · STYLE</p>
            <h2 id="style-title">이 공간이<br />지키는 태도</h2>
            <p>멋있어 보이는 말보다 저와 가까운 선택을 남깁니다. 아직 정하지 못한 부분까지 억지로 채우지 않는 것도 그중 하나입니다.</p>
          </div>
          <ul className="style-list">
            <li><span>솔직하게</span><strong>모르는 부분은 꾸며내지 않기</strong></li>
            <li><span>가볍게</span><strong>처음부터 완벽하려 하지 않기</strong></li>
            <li><span>분명하게</span><strong>한 화면에는 한 가지 이야기</strong></li>
            <li><span>꾸준하게</span><strong>달라진 만큼 다시 업데이트하기</strong></li>
          </ul>
        </section>

        <section className="rhythm-wrap" id="rhythm" aria-labelledby="rhythm-title">
          <div className="container rhythm-card">
            <div>
              <p className="section-index">04 · RHYTHM</p>
              <h2 id="rhythm-title">한 페이지를<br />만드는 순서</h2>
            </div>
            <ol className="rhythm-flow">
              <li><span>01</span><div><strong>수집</strong><small>마음에 남은 장면과 문장을 모읍니다.</small></div></li>
              <li><span>02</span><div><strong>선택</strong><small>지금의 저와 가까운 것만 고릅니다.</small></div></li>
              <li><span>03</span><div><strong>구성</strong><small>글과 색, 여백에 순서를 만듭니다.</small></div></li>
              <li><span>04</span><div><strong>조정</strong><small>직접 보고 어색한 부분을 다시 고칩니다.</small></div></li>
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
        <p>SEOJIN · KOREA</p><p>생각 → 메모 → 화면</p><p>© {new Date().getFullYear()} SEOJIN</p>
      </footer>
    </div>
  )
}

export default App

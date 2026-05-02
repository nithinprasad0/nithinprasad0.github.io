---
layout: null
---
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Nithin Prasad - Assistant Systems Engineer</title>
<!-- Google Fonts: Outfit for Display, Inter for Body -->
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600&family=Outfit:wght@200;300;400;500;600;700&display=swap" rel="stylesheet">
<style>
*,*::before,*::after { box-sizing: border-box; margin: 0; padding: 0; }

:root {
  --bg:         #030303;
  --surface:    #0a0a0a;
  --surface2:   #121212;
  --border:     #222222;
  --border-hlt: #444444;
  --accent:     #ffffff;
  --accent-dim: rgba(255, 255, 255, 0.1);
  --text:       #f5f5f5;
  --muted:      #999999;
  --faint:      #444444;
}

html { scroll-behavior: smooth; }

body {
  background: var(--bg);
  color: var(--text);
  font-family: 'Inter', sans-serif;
  font-weight: 300;
  overflow-x: hidden;
  cursor: none;
  line-height: 1.6;
}

/* ── Minimalist Background Ambient Glow ── */
body::before {
  content: '';
  position: fixed;
  top: -50%; left: -50%; width: 200%; height: 200%;
  background: radial-gradient(circle at 50% 30%, rgba(255,255,255,0.03) 0%, transparent 60%);
  pointer-events: none;
  z-index: 0;
}

/* Noise overlay for texture */
body::after {
  content: '';
  position: fixed; inset: 0;
  opacity: 0.04;
  background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E");
  pointer-events: none;
  z-index: 1;
}

/* ── Custom Cursor ── */
#cur {
  width: 6px; height: 6px;
  background: var(--accent);
  border-radius: 50%;
  position: fixed; top: 0; left: 0;
  pointer-events: none; z-index: 9999;
  transition: transform 0.05s linear;
  mix-blend-mode: difference;
}
#cur-ring {
  width: 34px; height: 34px;
  border: 1px solid rgba(255,255,255,0.3);
  border-radius: 50%;
  position: fixed; top: 0; left: 0;
  pointer-events: none; z-index: 9998;
  transition: transform 0.2s cubic-bezier(0.16,1,0.3,1), width 0.3s, height 0.3s, border-color 0.3s, background 0.3s;
}
#cur-ring.expand { 
  width: 60px; height: 60px; 
  background: rgba(255,255,255,0.1); 
  border-color: transparent;
  backdrop-filter: blur(2px);
}

/* ── NAV ── */
nav {
  position: fixed; top: 0; left: 0; right: 0; z-index: 800;
  background: rgba(3, 3, 3, 0.8);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border-bottom: 1px solid var(--border);
}
.nav-inner {
  max-width: 1100px; margin: 0 auto; padding: 0 40px;
  height: 64px; display: flex; align-items: center; justify-content: space-between;
}
.nav-logo {
  font-family: 'Outfit', sans-serif;
  font-size: 0.9rem; letter-spacing: 1px; color: var(--accent);
  text-decoration: none; font-weight: 600;
}
.nav-links { display: flex; gap: 40px; }
.nav-links a {
  font-size: 0.75rem; letter-spacing: 1px;
  color: var(--muted); text-decoration: none;
  transition: color 0.3s;
  position: relative;
}
.nav-links a:hover { color: var(--accent); }

/* ── LAYOUT ── */
.wrap { max-width: 1100px; margin: 0 auto; padding: 0 40px; position: relative; z-index: 2; }

/* ── HERO ── */
header {
  min-height: 100vh;
  display: flex; flex-direction: column; justify-content: center;
  padding: 120px 0 80px;
  position: relative;
}

.coord-tag {
  font-size: 0.7rem; letter-spacing: 2px; color: var(--muted);
  text-transform: uppercase; display: flex; align-items: center; gap: 12px;
  margin-bottom: 30px;
  opacity: 0; animation: fadeup 0.8s forwards 0.2s;
}
.coord-tag::before { content: ''; width: 24px; height: 1px; background: var(--muted); }

h1 {
  font-family: 'Outfit', sans-serif;
  font-size: clamp(3.5rem, 8vw, 7rem);
  font-weight: 300;
  letter-spacing: -2px;
  line-height: 1.05;
  color: var(--text);
  margin-bottom: 10px;
  opacity: 0; animation: fadeup 1s forwards 0.4s;
}
h1 strong { font-weight: 600; }

.hero-role {
  font-family: 'Outfit', sans-serif;
  font-size: clamp(1.2rem, 3vw, 2rem);
  font-weight: 300;
  color: var(--muted);
  margin-bottom: 40px;
  opacity: 0; animation: fadeup 0.8s forwards 0.6s;
}

.hero-bio {
  max-width: 540px;
  font-size: 0.95rem; color: var(--muted); line-height: 1.8;
  font-weight: 300;
  opacity: 0; animation: fadeup 0.8s forwards 0.8s;
}

.hero-chips {
  display: flex; gap: 16px; margin-top: 60px; flex-wrap: wrap;
  opacity: 0; animation: fadeup 0.8s forwards 1s;
}
.chip {
  display: flex; align-items: baseline; gap: 8px;
  padding: 12px 20px;
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: 4px;
  transition: border-color 0.3s, background 0.3s;
}
.chip:hover { border-color: var(--border-hlt); background: var(--surface2); }
.chip-val { font-family: 'Outfit', sans-serif; font-size: 1.4rem; font-weight: 500; color: var(--accent); }
.chip-key { font-size: 0.7rem; letter-spacing: 1px; color: var(--muted); text-transform: uppercase; }

/* ── SECTION ── */
.sec { padding: 120px 0; border-top: 1px solid var(--border); }

.sec-header {
  display: flex; align-items: flex-end; justify-content: space-between;
  margin-bottom: 70px;
}
.sec-title {
  font-family: 'Outfit', sans-serif;
  font-size: clamp(2rem, 4vw, 3rem);
  font-weight: 300; letter-spacing: -1px;
  color: var(--text);
}
.sec-num { font-family: 'Outfit', sans-serif; font-size: 1rem; color: var(--muted); }

/* ── PROJECTS ── */
.cards-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 24px;
}

.card {
  background: var(--surface);
  border: 1px solid var(--border);
  padding: 40px;
  border-radius: 6px;
  transition: transform 0.4s cubic-bezier(0.16,1,0.3,1), border-color 0.4s;
  display: flex; flex-direction: column;
}
.card:hover {
  border-color: var(--border-hlt);
  transform: translateY(-6px);
}

.card-idx {
  font-family: 'Outfit', sans-serif;
  font-size: 0.7rem; color: var(--muted);
  margin-bottom: 20px; display: block;
}
.card h3 {
  font-family: 'Outfit', sans-serif;
  font-size: 1.4rem; font-weight: 500;
  color: var(--text); margin-bottom: 16px;
}
.card p {
  font-size: 0.9rem; color: var(--muted); line-height: 1.7;
  margin-bottom: 30px; flex-grow: 1;
}
.tags { display: flex; flex-wrap: wrap; gap: 10px; }
.tag {
  font-size: 0.65rem; letter-spacing: 1px; text-transform: uppercase;
  color: var(--text); border: 1px solid var(--border);
  padding: 6px 12px; border-radius: 30px;
}

/* ── TIMELINE ── */
.timeline { border-left: 1px solid var(--border); padding-left: 40px; margin-left: 10px; }
.tl-row { position: relative; margin-bottom: 60px; }
.tl-row:last-child { margin-bottom: 0; }
.tl-row::before {
  content: '';
  position: absolute; left: -45px; top: 6px;
  width: 9px; height: 9px; border-radius: 50%;
  background: var(--bg); border: 1px solid var(--border-hlt);
  transition: background 0.3s, border-color 0.3s, transform 0.3s;
}
.tl-row:hover::before { background: var(--accent); border-color: var(--accent); transform: scale(1.2); }

.tl-meta { display: flex; align-items: center; gap: 16px; margin-bottom: 12px; }
.tl-date { font-family: 'Outfit', sans-serif; font-size: 0.85rem; color: var(--accent); }
.tl-cat  { font-size: 0.75rem; color: var(--muted); text-transform: uppercase; letter-spacing: 1px; }

.tl-body h4 {
  font-family: 'Outfit', sans-serif;
  font-size: 1.2rem; font-weight: 500;
  color: var(--text); margin-bottom: 12px;
}
.tl-body p  { font-size: 0.95rem; color: var(--muted); line-height: 1.7; }
.tl-body .sub { font-size: 0.85rem; color: var(--faint); margin-top: 8px; display: block; }

.gpa-tag {
  display: inline-block; margin-top: 14px;
  font-size: 0.75rem; font-family: 'Outfit', sans-serif;
  color: var(--text); border: 1px solid var(--border);
  padding: 6px 14px; border-radius: 4px;
  background: var(--surface);
}

/* ── CTA ── */
.cta-wrap { padding: 100px 0; border-top: 1px solid var(--border); text-align: center; }

.btn {
  display: inline-flex; align-items: center; gap: 16px;
  font-family: 'Outfit', sans-serif;
  font-size: 0.9rem; letter-spacing: 1px; font-weight: 500;
  color: var(--bg); text-decoration: none;
  background: var(--accent);
  padding: 18px 48px; border-radius: 4px;
  transition: transform 0.3s, box-shadow 0.3s;
}
.btn:hover { transform: translateY(-3px); box-shadow: 0 10px 20px rgba(255,255,255,0.1); }

/* ── FOOTER ── */
footer {
  border-top: 1px solid var(--border);
  padding: 50px 0;
  display: flex; justify-content: space-between; align-items: center;
}
footer .f-left { font-size: 0.8rem; color: var(--muted); }
.f-status { display: flex; align-items: center; gap: 10px; font-size: 0.8rem; color: var(--text); }
.f-dot {
  width: 6px; height: 6px; border-radius: 50%;
  background: var(--accent);
  animation: blink-dot 2.5s ease-in-out infinite;
}
@keyframes blink-dot { 0%,100%{opacity:1} 50%{opacity:0.3} }

/* ── SCROLL REVEAL ── */
.sr { opacity: 0; transform: translateY(30px); transition: opacity 0.8s cubic-bezier(0.16,1,0.3,1), transform 0.8s cubic-bezier(0.16,1,0.3,1); }
.sr.on { opacity: 1; transform: translateY(0); }
.d1 { transition-delay: 0.1s; } .d2 { transition-delay: 0.2s; }
.d3 { transition-delay: 0.3s; } .d4 { transition-delay: 0.4s; }

/* ── KEYFRAMES ── */
@keyframes fadeup { to { opacity: 1; transform: translateY(0); } }
.coord-tag, h1, .hero-role, .hero-bio, .hero-chips { transform: translateY(20px); }

/* ── RESPONSIVE ── */
@media (max-width: 768px) {
  .wrap { padding: 0 24px; }
  .nav-inner { padding: 0 24px; }
  .nav-links { display: none; }
  .cards-grid { grid-template-columns: 1fr; }
  footer { flex-direction: column; gap: 20px; align-items: flex-start; }
}
</style>
</head>
<body>

<!-- Cursor -->
<div id="cur"></div>
<div id="cur-ring"></div>

<!-- NAV -->
<nav>
  <div class="nav-inner">
    <a class="nav-logo" href="#">NITHIN.</a>
    <div class="nav-links">
      <a href="#projects">Projects</a>
      <a href="#leadership">Leadership</a>
      <a href="#education">Education</a>
      <a href="./assets/docs/resume_tcs.pdf">Résumé</a>
    </div>
  </div>
</nav>

<div class="wrap">

  <!-- HERO -->
  <header>
    <div class="coord-tag">10.53° N &nbsp;·&nbsp; Kerala, India</div>

    <h1>Nithin <strong>Prasad</strong></h1>
    <h2 class="hero-role">Assistant Systems Engineer</h2>

    <p class="hero-bio">
      Software developer proficient in Python and AI-driven automation.
      Focused on autonomous data systems and national-level technical leadership.
      Currently pursuing MCA at ASIET Kalady.
    </p>

    <div class="hero-chips">
      <div class="chip"><span class="chip-val">04</span><span class="chip-key">Projects</span></div>
      <div class="chip"><span class="chip-val">03</span><span class="chip-key">Leadership</span></div>
      <div class="chip"><span class="chip-val">7.9</span><span class="chip-key">GPA</span></div>
      <div class="chip"><span class="chip-val">19h</span><span class="chip-key">Hackathon</span></div>
    </div>
  </header>

  <!-- PROJECTS -->
  <section class="sec" id="projects">
    <div class="sec-header sr">
      <h2 class="sec-title">Selected Projects</h2>
      <span class="sec-num">(01)</span>
    </div>

    <div class="cards-grid">
      <div class="card sr d1">
        <span class="card-idx">PRJ 01</span>
        <h3>Insight Gen</h3>
        <p>Agentic AI platform for autonomous data analysis and professional report generation from natural language queries via multi-agent orchestration.</p>
        <div class="tags"><span class="tag">Python</span><span class="tag">CrewAI</span><span class="tag">Streamlit</span><span class="tag">Pandas</span></div>
      </div>
      <div class="card sr d2">
        <span class="card-idx">PRJ 02</span>
        <h3>Revo</h3>
        <p>Social news Android application with advanced content rating and real-time community discussion threads backed by Firebase infrastructure.</p>
        <div class="tags"><span class="tag">Java</span><span class="tag">Android</span><span class="tag">Firebase</span></div>
      </div>
      <div class="card sr d3">
        <span class="card-idx">PRJ 03</span>
        <h3>Profexia</h3>
        <p>Web-based skill-barter platform enabling community-driven exchange without financial dependency. Full-stack Django implementation.</p>
        <div class="tags"><span class="tag">Django</span><span class="tag">Python</span><span class="tag">SQL</span></div>
      </div>
      <div class="card sr d4">
        <span class="card-idx">PRJ 04</span>
        <h3>Vaccination Manager</h3>
        <p>Child vaccination tracking system with automated notification schedules, reducing missed immunizations through intelligent reminders.</p>
        <div class="tags"><span class="tag">JavaScript</span><span class="tag">HTML5</span><span class="tag">SQL</span></div>
      </div>
    </div>
  </section>

  <!-- LEADERSHIP -->
  <section class="sec" id="leadership">
    <div class="sec-header sr">
      <h2 class="sec-title">Leadership</h2>
      <span class="sec-num">(02)</span>
    </div>

    <div class="timeline">
      <div class="tl-row sr d1">
        <div class="tl-meta">
          <span class="tl-date">Mar 2026</span>
          <span class="tl-cat">Hackathon</span>
        </div>
        <div class="tl-body">
          <h4>Main Coordinator — Hackastra 2026</h4>
          <p>Directed end-to-end execution of a 19-hour hackathon themed "Design for Human Weakness". Managed teams, judges, venues, and full logistics.</p>
        </div>
      </div>
      <div class="tl-row sr d2">
        <div class="tl-meta">
          <span class="tl-date">Oct 2025</span>
          <span class="tl-cat">Dept Fest</span>
        </div>
        <div class="tl-body">
          <h4>Main Coordinator — Pragyan Tech Fest</h4>
          <p>Led strategic planning, sponsorship acquisition, and full multi-track execution for the departmental technical festival.</p>
        </div>
      </div>
      <div class="tl-row sr d3">
        <div class="tl-meta">
          <span class="tl-date">Apr 25–26</span>
          <span class="tl-cat">Ongoing</span>
        </div>
        <div class="tl-body">
          <h4>MCA Representative — CSI SB ASIET</h4>
          <p>Coordinating technical symposiums and department workshops for the Computer Society of India student branch.</p>
        </div>
      </div>
    </div>
  </section>

  <!-- EDUCATION -->
  <section class="sec" id="education">
    <div class="sec-header sr">
      <h2 class="sec-title">Education</h2>
      <span class="sec-num">(03)</span>
    </div>

    <div class="timeline">
      <div class="tl-row sr d1">
        <div class="tl-meta">
          <span class="tl-date">2024 – Now</span>
          <span class="tl-cat">Postgrad</span>
        </div>
        <div class="tl-body">
          <h4>Master of Computer Applications</h4>
          <p>Adi Shankara Institute of Engineering and Technology, Kalady.</p>
          <span class="sub">Focused on AI systems and software architecture</span>
          <span class="gpa-tag">GPA 7.9 / 10</span>
        </div>
      </div>
      <div class="tl-row sr d2">
        <div class="tl-meta">
          <span class="tl-date">2021 – 2024</span>
          <span class="tl-cat">Undergrad</span>
        </div>
        <div class="tl-body">
          <h4>Bachelor of Computer Applications</h4>
          <p>DePaul Institute of Science and Technology, Angamaly.</p>
          <span class="gpa-tag">GPA 6.7 / 10</span>
        </div>
      </div>
    </div>
  </section>

  <!-- CTA -->
  <div class="cta-wrap sr">
    <a href="./assets/docs/resume_tcs.pdf" class="btn">Download Résumé</a>
  </div>

  <!-- FOOTER -->
  <footer>
    <span class="f-left">© 2026 Nithin Prasad.</span>
    <div class="f-status"><div class="f-dot"></div>Available for opportunities</div>
  </footer>

</div>

<script>
// Cursor
const cur = document.getElementById('cur');
const ring = document.getElementById('cur-ring');
let mx=0,my=0,rx=0,ry=0;
document.addEventListener('mousemove', e => {
  mx = e.clientX; my = e.clientY;
  cur.style.transform = `translate(${mx-3}px,${my-3}px)`;
});
(function lp(){
  rx += (mx-rx)*0.15; ry += (my-ry)*0.15;
  ring.style.transform = `translate(${rx-17}px,${ry-17}px)`;
  requestAnimationFrame(lp);
})();
document.querySelectorAll('a,.card,.tl-row,.chip,.btn').forEach(el=>{
  el.addEventListener('mouseenter',()=>ring.classList.add('expand'));
  el.addEventListener('mouseleave',()=>ring.classList.remove('expand'));
});

// Scroll reveal
const obs = new IntersectionObserver(entries=>{
  entries.forEach(e=>{ if(e.isIntersecting) e.target.classList.add('on'); });
},{threshold:0.1});
document.querySelectorAll('.sr').forEach(el=>obs.observe(el));
</script>
</body>
</html>

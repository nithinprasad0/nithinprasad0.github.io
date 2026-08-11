---
layout: null
---
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Nithin Prasad - Assistant Systems Engineer</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet">
<style>
*,*::before,*::after { box-sizing: border-box; margin: 0; padding: 0; }

:root {
  --bg: #07111F;        /* Aurora Circuit Deep Navy */
  --surface: #0B1F2A;   /* Aurora Surface */
  --surface-hlt: #123746;
  --border: #183442;    
  --accent: #14B8A6;    /* Electric Teal */
  --accent-dim: rgba(20, 184, 166, 0.12);
  --text: #E6F1F5;      
  --muted: #8295A3;     
}

html { scroll-behavior: smooth; }

body {
  background: var(--bg);
  color: var(--text);
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
  font-weight: 300;
  overflow-x: hidden;
  cursor: none; /* Custom cursor */
  line-height: 1.6;
}

/* ── Subtle Mesh Background ── */
body::before {
  content: '';
  position: fixed;
  inset: 0;
  background: 
    radial-gradient(circle at 12% 45%, rgba(20, 184, 166, 0.11), transparent 30%),
    radial-gradient(circle at 82% 25%, rgba(163, 230, 53, 0.07), transparent 27%),
    radial-gradient(circle at 58% 80%, rgba(245, 158, 11, 0.045), transparent 25%);
  pointer-events: none;
  z-index: 0;
}

/* ── Sleek, Professional Cursor ── */
#cur {
  width: 6px; height: 6px;
  background: var(--text);
  border-radius: 50%;
  position: fixed; top: 0; left: 0;
  pointer-events: none; z-index: 9999;
  transition: transform 0.05s linear;
}
#cur-ring {
  width: 26px; height: 26px;
  border: 1px solid rgba(248, 250, 252, 0.2);
  border-radius: 50%;
  position: fixed; top: 0; left: 0;
  pointer-events: none; z-index: 9998;
  transition: transform 0.15s ease-out, width 0.2s, height 0.2s, background 0.2s, border-color 0.2s;
}
#cur-ring.expand { 
  width: 40px; height: 40px; 
  background: rgba(20, 184, 166, 0.08); 
  border-color: rgba(20, 184, 166, 0.55);
}

/* ── NAV ── */
nav {
  position: fixed; top: 0; left: 0; right: 0; z-index: 800;
  background: rgba(7, 17, 31, 0.90);
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
  border-bottom: 1px solid var(--border);
}
.nav-inner {
  max-width: 1000px; margin: 0 auto; padding: 0 40px;
  height: 64px; display: flex; align-items: center; justify-content: space-between;
}
.nav-logo {
  font-size: 0.95rem; letter-spacing: 0.5px; color: var(--text);
  text-decoration: none; font-weight: 600;
}
.nav-links { display: flex; gap: 36px; }
.nav-links a {
  font-size: 0.8rem; font-weight: 400;
  color: var(--muted); text-decoration: none;
  transition: color 0.2s;
}
.nav-links a:hover { color: var(--accent); }

/* ── LAYOUT ── */
.wrap { max-width: 1000px; margin: 0 auto; padding: 0 40px; position: relative; z-index: 2; }

/* ── HERO ── */
header {
  min-height: 100vh;
  display: flex; flex-direction: column; justify-content: center;
  padding: 120px 0 80px;
}

.coord-tag {
  font-size: 0.75rem; letter-spacing: 1px; color: var(--accent);
  text-transform: uppercase; font-weight: 500;
  margin-bottom: 24px;
  opacity: 0; animation: fadeup 0.8s forwards 0.2s;
}

h1 {
  font-size: clamp(3rem, 7vw, 5.5rem);
  font-weight: 700;
  letter-spacing: -1.5px;
  line-height: 1.1;
  color: var(--text);
  margin-bottom: 8px;
  opacity: 0; animation: fadeup 1s forwards 0.4s;
}

.hero-role {
  font-size: clamp(1.2rem, 3vw, 1.8rem);
  font-weight: 400;
  color: var(--muted);
  margin-bottom: 32px;
  opacity: 0; animation: fadeup 0.8s forwards 0.6s;
}

/* ── Aurora System Status ── */
.system-status {
  display: flex;
  align-items: center;
  gap: 8px;
  width: fit-content;
  margin-bottom: 14px;
  font-size: 0.68rem;
  letter-spacing: 1.8px;
  font-weight: 600;
  color: #A3E635;
  text-transform: uppercase;
}

.status-dot {
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background: #A3E635;
  box-shadow: 0 0 12px rgba(163,230,53,.65);
  animation: statusPulse 1.8s ease-in-out infinite;
}

@keyframes statusPulse {
  0%, 100% { opacity: .45; transform: scale(.85); }
  50% { opacity: 1; transform: scale(1); }
}

/* ── Animated Professional Role Switcher ── */
.role-switcher {
  position: relative;
  min-height: 1.8em;
  display: flex;
  align-items: center;
  overflow: hidden;
}

.role-word {
  position: absolute;
  left: 0;
  top: 0;
  opacity: 0;
  transform: translateY(115%);
  filter: blur(2px);
  transition:
    transform 0.7s cubic-bezier(.22,.61,.36,1),
    opacity 0.5s ease,
    filter 0.5s ease;
  white-space: nowrap;
}

.role-word.role-active {
  opacity: 1;
  transform: translateY(0);
  filter: blur(0);
}

/* Gentle cursor-like accent while the role changes */
.role-switcher::after {
  content: '';
  display: inline-block;
  width: 2px;
  height: 1em;
  margin-left: 8px;
  background: var(--accent);
  opacity: 0.75;
  animation: roleCursor 1s steps(1) infinite;
}

@keyframes roleCursor {
  0%, 45% { opacity: 0.75; }
  46%, 100% { opacity: 0.15; }
}

@media (prefers-reduced-motion: reduce) {
  body::before,
  .status-dot { animation: none; }
  .role-word {
    transition: none;
  }
  .role-switcher::after {
    animation: none;
  }
}

.hero-bio {
  max-width: 560px;
  font-size: 1rem; color: var(--muted); line-height: 1.7;
  font-weight: 300;
  opacity: 0; animation: fadeup 0.8s forwards 0.8s;
}

.hero-chips {
  display: flex; gap: 12px; margin-top: 48px; flex-wrap: wrap;
  opacity: 0; animation: fadeup 0.8s forwards 1s;
}
.chip {
  display: flex; flex-direction: column; gap: 4px;
  padding: 14px 24px;
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: 8px;
  transition: transform 0.2s, border-color 0.2s;
}
.chip:hover { transform: translateY(-2px); border-color: var(--accent); }
.chip-val { font-size: 1.3rem; font-weight: 600; color: var(--text); }
.chip-key { font-size: 0.75rem; color: var(--muted); }

/* ── SECTION ── */
.sec { padding: 100px 0; border-top: 1px solid var(--border); }

.sec-header {
  margin-bottom: 60px;
}
.sec-title {
  font-size: clamp(1.8rem, 4vw, 2.4rem);
  font-weight: 600; letter-spacing: -0.5px;
  color: var(--text);
}

/* ── PROJECTS ── */
.cards-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 24px;
}

.card {
  background: var(--surface);
  border: 1px solid var(--border);
  padding: 36px;
  border-radius: 12px;
  transition: transform 0.3s ease, box-shadow 0.3s ease, border-color 0.3s ease;
  display: flex; flex-direction: column;
}
.card:hover {
  border-color: var(--surface-hlt);
  transform: translateY(-4px);
  box-shadow: 0 16px 32px rgba(0,0,0,0.35);
}

.card h3 {
  font-size: 1.3rem; font-weight: 600;
  color: var(--text); margin-bottom: 12px;
}
.card p {
  font-size: 0.95rem; color: var(--muted); line-height: 1.6;
  margin-bottom: 28px; flex-grow: 1;
}
.tags { display: flex; flex-wrap: wrap; gap: 8px; }
.tag {
  font-size: 0.7rem; font-weight: 500;
  color: var(--accent); background: var(--accent-dim);
  padding: 4px 12px; border-radius: 20px;
}

/* ── TIMELINE ── */
.timeline { position: relative; }
.tl-row { 
  display: grid; grid-template-columns: 140px 1fr; gap: 32px;
  padding-bottom: 48px; border-bottom: 1px solid var(--border); margin-bottom: 48px;
}
.tl-row:last-child { border-bottom: none; padding-bottom: 0; margin-bottom: 0; }

.tl-meta { padding-top: 4px; }
.tl-date { font-size: 0.9rem; font-weight: 500; color: var(--text); display: block; margin-bottom: 4px; }
.tl-cat  { font-size: 0.8rem; color: var(--muted); }

.tl-body h4 {
  font-size: 1.15rem; font-weight: 600;
  color: var(--text); margin-bottom: 10px;
}
.tl-body p  { font-size: 0.95rem; color: var(--muted); line-height: 1.6; }
.tl-body .sub { font-size: 0.85rem; color: var(--muted); margin-top: 8px; display: block; }

.gpa-tag {
  display: inline-block; margin-top: 14px;
  font-size: 0.8rem; font-weight: 500;
  color: var(--accent); border: 1px solid var(--accent-dim);
  padding: 4px 12px; border-radius: 6px;
  background: rgba(20, 184, 166, 0.06);
}

/* ── CTA ── */
.cta-wrap { padding: 80px 0; text-align: center; }

.btn {
  display: inline-flex; align-items: center; justify-content: center;
  font-size: 0.95rem; font-weight: 500; letter-spacing: 0.5px;
  color: var(--bg); text-decoration: none;
  background: var(--text);
  padding: 16px 40px; border-radius: 8px;
  transition: background 0.2s, transform 0.2s;
}
.btn:hover { background: var(--accent); transform: translateY(-2px); }

/* ── FOOTER ── */
footer {
  border-top: 1px solid var(--border);
  padding: 40px 0;
  display: flex; justify-content: center; align-items: center;
}
footer .f-left { font-size: 0.85rem; color: var(--muted); }

/* ── SCROLL REVEAL ── */
.sr { opacity: 0; transform: translateY(24px); transition: opacity 0.8s ease-out, transform 0.8s ease-out; }
.sr.on { opacity: 1; transform: translateY(0); }
.d1 { transition-delay: 0.1s; } .d2 { transition-delay: 0.2s; }
.d3 { transition-delay: 0.3s; } .d4 { transition-delay: 0.4s; }

/* ── KEYFRAMES ── */
@keyframes fadeup { to { opacity: 1; transform: translateY(0); } }

/* ── RESPONSIVE ── */
@media (max-width: 768px) {
  .wrap { padding: 0 24px; }
  .nav-inner { padding: 0 24px; }
  .nav-links { display: none; }
  .cards-grid { grid-template-columns: 1fr; }
  .tl-row { grid-template-columns: 1fr; gap: 12px; }
  .tl-meta { padding-top: 0; }
}

/* ── Aurora Circuit Background ── */
body::after {
  content: '';
  position: fixed;
  inset: 0;
  background:
    linear-gradient(90deg, transparent 0 8%, rgba(20,184,166,.035) 8.1%, transparent 8.2% 100%),
    linear-gradient(0deg, transparent 0 18%, rgba(20,184,166,.028) 18.1%, transparent 18.2% 100%);
  background-size: 180px 180px;
  mask-image: linear-gradient(to bottom, rgba(0,0,0,.85), transparent 88%);
  pointer-events: none;
  z-index: 0;
}

body::before {
  content: '';
  position: fixed;
  inset: -15%;
  background:
    radial-gradient(ellipse at 15% 45%, rgba(20,184,166,.10), transparent 25%),
    radial-gradient(ellipse at 78% 20%, rgba(163,230,53,.06), transparent 23%),
    radial-gradient(ellipse at 55% 85%, rgba(245,158,11,.035), transparent 22%);
  filter: blur(28px);
  animation: auroraDrift 16s ease-in-out infinite alternate;
  pointer-events: none;
  z-index: 0;
}

@keyframes auroraDrift {
  from { transform: translate3d(-1%, 0, 0) scale(1); }
  to   { transform: translate3d(1.5%, -1%, 0) scale(1.04); }
}

:root {
  --cyan: #14B8A6;
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
    <a class="nav-logo" href="#">NITHIN PRASAD</a>
    <div class="nav-links">
      <a href="#experience">Work</a>
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
    <div class="coord-tag">Kerala, India</div>

    <h1>Nithin Prasad</h1>
    <h2 class="hero-role role-switcher" aria-label="Assistant Systems Engineer and Android App Developer">
      <span class="role-word role-active">Assistant Systems Engineer</span>
      <span class="role-word">Android App Developer</span>
    </h2>

    <div class="system-status">
      <span class="status-dot"></span>
      SYSTEMS ONLINE
    </div>

    <div class="hero-stack" style="font-size:0.78rem; letter-spacing:1.5px; color:var(--accent); margin:-16px 0 28px; text-transform:uppercase;">
      Python / Flutter / Android / Firebase / AI Systems
    </div>

    <p class="hero-bio">
      Software developer proficient in Python and AI-driven automation.
      Focused on autonomous data systems and national-level technical leadership.
      Currently pursuing MCA at ASIET Kalady.
    </p>

    <div class="hero-chips">
      <div class="chip"><span class="chip-val">04</span><span class="chip-key">Projects</span></div>
      <div class="chip"><span class="chip-val">03</span><span class="chip-key">Leadership</span></div>
      <div class="chip"><span class="chip-val">8.3</span><span class="chip-key">GPA</span></div>
      <div class="chip"><span class="chip-val">19h</span><span class="chip-key">Hackathon</span></div>
    </div>
  </header>

  <!-- PROJECTS -->
  <section class="sec" id="projects">
    <div class="sec-header sr">
      <h2 class="sec-title">Selected Projects</h2>
    </div>

    <div class="cards-grid">
      <div class="card sr d1">
        <h3>Insight Gen</h3>
        <p>Agentic AI platform for autonomous data analysis and professional report generation from natural language queries via multi-agent orchestration.</p>
        <div class="tags"><span class="tag">Python</span><span class="tag">CrewAI</span><span class="tag">Streamlit</span><span class="tag">Pandas</span></div>
      </div>
      <div class="card sr d2">
        <h3>Revo</h3>
        <p>Social news Android application with advanced content rating and real-time community discussion threads backed by Firebase infrastructure.</p>
        <div class="tags"><span class="tag">Java</span><span class="tag">Android</span><span class="tag">Firebase</span></div>
      </div>
      <div class="card sr d3">
        <h3>Profexia</h3>
        <p>Web-based skill-barter platform enabling community-driven exchange without financial dependency. Full-stack Django implementation.</p>
        <div class="tags"><span class="tag">Django</span><span class="tag">Python</span><span class="tag">SQL</span></div>
      </div>
      <div class="card sr d4">
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
          <span class="tl-date">Apr 2025 – 2026</span>
          <span class="tl-cat">CSI SB</span>
        </div>
        <div class="tl-body">
          <h4>MCA Representative — CSI SB ASIET</h4>
          <p>Coordinating technical symposiums and department workshops for the Computer Society of India student branch.</p>
        </div>
      </div>
    </div>
  </section>

  <!-- EXPERIENCE -->
  <section class="sec" id="experience">
    <div class="sec-header sr">
      <h2 class="sec-title">Experience</h2>
    </div>

    <div class="timeline">
      <div class="tl-row sr d1">
        <div class="tl-meta">
          <span class="tl-date">May 2026 – Current</span>
          <span class="tl-cat">Freelance</span>
        </div>
        <div class="tl-body">
          <h4>Freelance Android App Developer — GEM Group</h4>
          <p>Mobile application development for GEM Group, delivering Android applications using Flutter and Dart with Firebase and REST API integrations.</p>
          <span class="sub">Flutter · Dart · Firebase · REST APIs · Android Studio · Firebase Console</span>
        </div>
      </div>
    </div>
  </section>

  <!-- EDUCATION -->
  <section class="sec" id="education">
    <div class="sec-header sr">
      <h2 class="sec-title">Education</h2>
    </div>

    <div class="timeline">
      <div class="tl-row sr d1">
        <div class="tl-meta">
          <span class="tl-date">2024 – 2026</span>
          <span class="tl-cat">Postgrad</span>
        </div>
        <div class="tl-body">
          <h4>Master of Computer Applications</h4>
          <p>Adi Shankara Institute of Engineering and Technology, Kalady.</p>
          <span class="sub">Focused on AI systems and software architecture</span>
          <span class="gpa-tag">GPA 8.3 / 10</span>
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
  rx += (mx-rx)*0.2; ry += (my-ry)*0.2;
  ring.style.transform = `translate(${rx-13}px,${ry-13}px)`;
  requestAnimationFrame(lp);
})();
document.querySelectorAll('a,.card,.chip,.btn').forEach(el=>{
  el.addEventListener('mouseenter',()=>ring.classList.add('expand'));
  el.addEventListener('mouseleave',()=>ring.classList.remove('expand'));
});

// Interchangeable professional role animation
const roles = document.querySelectorAll('.role-word');
let roleIndex = 0;

if (roles.length > 1) {
  setInterval(() => {
    roles[roleIndex].classList.remove('role-active');
    roleIndex = (roleIndex + 1) % roles.length;
    roles[roleIndex].classList.add('role-active');
  }, 2800);
}

// Scroll reveal
const obs = new IntersectionObserver(entries=>{
  entries.forEach(e=>{ if(e.isIntersecting) e.target.classList.add('on'); });
},{threshold:0.1});
document.querySelectorAll('.sr').forEach(el=>obs.observe(el));
</script>
</body>
</html>

---
layout: null
---
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>NITHIN_PRASAD.exe</title>
<link href="https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:ital,wght@0,300;0,400;0,600;0,700;1,300;1,400&family=IBM+Plex+Sans:wght@300;400;500&display=swap" rel="stylesheet">
<style>
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
:root{
  --bg:#080c08;--surface:#0d120d;--surface2:#131a13;
  --green:#39ff14;--green-dim:rgba(57,255,20,0.10);
  --green-border:rgba(57,255,20,0.28);--green-glow:rgba(57,255,20,0.05);
  --white:#e8f0e8;--muted:#4d6b4d;--faint:#1c261c;--red:#ff3b3b;
}
html{scroll-behavior:smooth}
body{
  background:var(--bg);color:var(--white);
  font-family:'IBM Plex Mono',monospace;font-weight:300;
  overflow-x:hidden;cursor:none;line-height:1.6;
}
body::after{
  content:'';position:fixed;inset:0;pointer-events:none;z-index:1000;
  background:repeating-linear-gradient(0deg,transparent,transparent 2px,rgba(0,0,0,0.07) 2px,rgba(0,0,0,0.07) 4px);
}
body::before{
  content:'';position:fixed;inset:0;pointer-events:none;z-index:999;
  background:radial-gradient(ellipse at center,transparent 55%,rgba(0,0,0,0.6) 100%);
}

/* CURSOR */
#cur{width:2px;height:18px;background:var(--green);position:fixed;top:0;left:0;pointer-events:none;z-index:9999;box-shadow:0 0 8px var(--green)}
#curb{width:32px;height:32px;border:1px solid var(--green-border);position:fixed;top:0;left:0;pointer-events:none;z-index:9998;transition:transform .18s cubic-bezier(.23,1,.32,1),width .25s,height .25s,border-color .25s}
#curb.big{width:54px;height:54px;border-color:var(--green)}

/* BOOT */
#boot{
  position:fixed;inset:0;background:var(--bg);z-index:5000;
  display:flex;flex-direction:column;justify-content:center;align-items:flex-start;
  padding:0 10vw;gap:10px;
  transition:opacity .7s ease,visibility .7s;
}
#boot.gone{opacity:0;visibility:hidden}
.bl{font-size:.72rem;letter-spacing:2px;color:var(--muted);opacity:0;transition:opacity .2s}
.bl.show{opacity:1}
.bbar-w{width:280px;height:2px;background:var(--faint);margin-top:24px;overflow:hidden}
.bbar{height:100%;width:0;background:var(--green);box-shadow:0 0 10px var(--green);transition:width 1.4s linear}
.bbar.go{width:100%}

/* NAV */
nav{
  position:fixed;top:0;left:0;right:0;z-index:900;
  border-bottom:1px solid var(--faint);background:rgba(8,12,8,0.94);backdrop-filter:blur(4px);
}
.ni{max-width:980px;margin:0 auto;padding:0 40px;display:flex;justify-content:space-between;align-items:center;height:52px}
.nl a.logo{font-size:.68rem;letter-spacing:4px;color:var(--green);font-weight:600;text-decoration:none}
.nr{display:flex;gap:32px}
.nr a{font-size:.62rem;letter-spacing:3px;color:var(--muted);text-decoration:none;text-transform:uppercase;transition:color .2s;position:relative}
.nr a::after{content:'';position:absolute;left:0;bottom:-3px;width:0;height:1px;background:var(--green);transition:width .3s}
.nr a:hover{color:var(--green)}
.nr a:hover::after{width:100%}

/* WRAP */
.w{max-width:980px;margin:0 auto;padding:0 40px;position:relative;z-index:2}

/* HERO */
header{min-height:100vh;display:flex;flex-direction:column;justify-content:center;padding:120px 0 80px}
.sys-tag{font-size:.62rem;letter-spacing:4px;color:var(--muted);display:flex;align-items:center;gap:10px;margin-bottom:28px}
.sys-tag::before{content:'> ';color:var(--green)}
.pdot{width:5px;height:5px;border-radius:50%;background:var(--green);box-shadow:0 0 6px var(--green);animation:pdot 1.8s ease-in-out infinite;display:inline-block}
@keyframes pdot{0%,100%{opacity:1}50%{opacity:.2}}

h1{
  font-size:clamp(3.5rem,11vw,9rem);font-weight:700;
  line-height:.88;letter-spacing:-3px;color:var(--white);
  position:relative;
}
h1 .acc{color:var(--green);text-shadow:0 0 40px rgba(57,255,20,.35)}
h1.glitch{animation:glitch .07s linear}
@keyframes glitch{
  0%{text-shadow:3px 0 var(--red),-3px 0 #00f9;transform:none}
  40%{text-shadow:-3px 0 var(--red),3px 0 #00f9;transform:skewX(-1.5deg)}
  100%{text-shadow:none;transform:none}
}

.tw{font-size:.95rem;color:var(--green);margin:32px 0 8px;min-height:1.6em;display:flex;align-items:center}
.tw::before{content:'// ';color:var(--muted);margin-right:0}
#tw{color:var(--green)}
.bl2{display:inline-block;width:7px;height:.95em;background:var(--green);margin-left:3px;animation:bl .9s step-end infinite;box-shadow:0 0 5px var(--green);vertical-align:text-bottom}
@keyframes bl{0%,100%{opacity:1}50%{opacity:0}}

.bio{
  max-width:540px;font-family:'IBM Plex Sans',sans-serif;font-size:.93rem;
  color:var(--muted);line-height:1.8;margin-top:24px;font-weight:300;
  padding:18px 22px;border:1px solid var(--faint);border-left:2px solid var(--green);
  background:var(--green-glow);
}

.stats{display:flex;gap:44px;margin-top:48px;flex-wrap:wrap}
.stat{display:flex;flex-direction:column;gap:4px}
.sn{font-size:2rem;font-weight:700;color:var(--green);line-height:1;text-shadow:0 0 20px rgba(57,255,20,.3)}
.sl{font-size:.58rem;letter-spacing:3px;color:var(--muted);text-transform:uppercase}

/* SECTIONS */
.sec{padding:100px 0}
.sh{display:flex;align-items:center;gap:0;margin-bottom:54px;border-bottom:1px solid var(--faint);padding-bottom:16px}
.sn2{font-size:.58rem;letter-spacing:3px;color:var(--green);border:1px solid var(--green-border);padding:3px 9px;margin-right:16px}
.st{font-size:1.35rem;font-weight:600;letter-spacing:2px;text-transform:uppercase;color:var(--white)}
.sr2{flex:1;height:1px;background:var(--faint);margin-left:24px}

/* PROJECTS */
.pg{display:flex;flex-direction:column;gap:0}
.pc{
  display:grid;grid-template-columns:56px 1fr 44px;gap:0;
  border:1px solid var(--faint);border-top:none;
  position:relative;overflow:hidden;transition:background .3s;
}
.pc:first-child{border-top:1px solid var(--faint)}
.pc::before{content:'';position:absolute;left:0;top:0;bottom:0;width:2px;background:var(--green);transform:scaleY(0);transform-origin:bottom;transition:transform .45s cubic-bezier(.16,1,.3,1)}
.pc:hover{background:var(--green-dim)}
.pc:hover::before{transform:scaleY(1)}
.pi{display:flex;align-items:center;justify-content:center;border-right:1px solid var(--faint);font-size:.55rem;color:var(--muted);writing-mode:vertical-rl;letter-spacing:3px;padding:24px 0;transition:color .3s}
.pc:hover .pi{color:var(--green)}
.pb{padding:28px 32px}
.pb h3{font-size:1.1rem;font-weight:600;letter-spacing:1px;color:var(--white);margin-bottom:10px}
.pb p{font-family:'IBM Plex Sans',sans-serif;font-size:.87rem;color:var(--muted);line-height:1.7;margin-bottom:18px;font-weight:300}
.tgs{display:flex;flex-wrap:wrap;gap:8px}
.tgs span{font-size:.56rem;letter-spacing:2px;color:var(--green);border:1px solid var(--green-border);padding:2px 10px;text-transform:uppercase;background:var(--green-glow)}
.pa{display:flex;align-items:center;justify-content:center;border-left:1px solid var(--faint);font-size:1.1rem;color:var(--faint);transition:color .3s,border-color .3s}
.pc:hover .pa{color:var(--green);border-color:var(--green-border)}

/* TIMELINE */
.ti{display:grid;grid-template-columns:160px 1fr;gap:32px;padding:32px 0;border-bottom:1px solid var(--faint);position:relative}
.ti::before{content:'';position:absolute;top:0;bottom:0;left:159px;width:1px;background:var(--faint)}
.tl{text-align:right;padding-top:6px;position:relative}
.td{font-size:.6rem;letter-spacing:2px;color:var(--green);display:block;margin-bottom:4px}
.tc{font-size:.56rem;color:var(--muted);letter-spacing:1px}
.tdot{width:8px;height:8px;border-radius:50%;background:var(--green);position:absolute;right:-5px;top:8px;box-shadow:0 0 8px var(--green);transition:box-shadow .3s}
.ti:hover .tdot{box-shadow:0 0 0 5px var(--green-dim),0 0 16px var(--green)}
.tr h4{font-size:1rem;font-weight:600;letter-spacing:.5px;color:var(--white);margin-bottom:8px}
.tr p{font-family:'IBM Plex Sans',sans-serif;font-size:.87rem;color:var(--muted);line-height:1.7;font-weight:300}
.tsub{font-size:.6rem;letter-spacing:1px;color:var(--muted);margin-top:6px;display:block}
.badge{display:inline-block;margin-top:8px;font-size:.56rem;letter-spacing:2px;color:var(--green);border:1px solid var(--green-border);padding:2px 12px;background:var(--green-glow)}

/* CTA */
.cta{padding:72px 0}
.btn{
  display:inline-flex;align-items:center;gap:14px;
  font-family:'IBM Plex Mono',monospace;font-size:.72rem;
  letter-spacing:3px;text-transform:uppercase;
  color:var(--bg);background:var(--green);border:none;
  padding:18px 44px;text-decoration:none;cursor:none;
  font-weight:700;box-shadow:0 0 30px rgba(57,255,20,.2);
  transition:box-shadow .3s,transform .2s;position:relative;overflow:hidden;
}
.btn::before{content:'';position:absolute;inset:0;background:linear-gradient(90deg,transparent,rgba(255,255,255,.15),transparent);transform:translateX(-100%);transition:transform .5s}
.btn:hover{box-shadow:0 0 60px rgba(57,255,20,.5);transform:translateY(-2px)}
.btn:hover::before{transform:translateX(100%)}

/* FOOTER */
footer{border-top:1px solid var(--faint);padding:36px 0;display:flex;justify-content:space-between;align-items:center}
footer span{font-size:.58rem;letter-spacing:3px;color:var(--muted)}
.fstat{display:flex;align-items:center;gap:8px;color:var(--green);font-size:.58rem;letter-spacing:3px}
.fdot{width:6px;height:6px;border-radius:50%;background:var(--green);box-shadow:0 0 8px var(--green);animation:pdot 2s ease-in-out infinite}

/* SCROLL REVEAL */
.sr{opacity:0;transform:translateY(30px);transition:opacity .8s cubic-bezier(.16,1,.3,1),transform .8s cubic-bezier(.16,1,.3,1)}
.sr.in{opacity:1;transform:translateY(0)}
.d1{transition-delay:.08s}.d2{transition-delay:.16s}.d3{transition-delay:.24s}.d4{transition-delay:.32s}

@media(max-width:640px){
  .w{padding:0 20px}.ni{padding:0 20px}.nr{display:none}
  .pc{grid-template-columns:38px 1fr}.pa{display:none}
  .ti{grid-template-columns:1fr;gap:6px}
  .ti::before,.tdot{display:none}.tl{text-align:left}
  .stats{gap:24px}
  footer{flex-direction:column;gap:10px;text-align:center}
}
</style>
</head>
<body>

<div id="boot">
  <div class="bl">BIOS v2.6.1 — INITIALIZING SYSTEM...</div>
  <div class="bl">LOADING PROFILE: NITHIN_PRASAD</div>
  <div class="bl">MODULES: AI_SYSTEMS · ANDROID · WEB · LEADERSHIP</div>
  <div class="bl">STATUS: ALL SYSTEMS NOMINAL</div>
  <div class="bbar-w"><div class="bbar" id="bbar"></div></div>
</div>

<div id="cur"></div>
<div id="curb"></div>

<nav>
  <div class="ni">
    <div class="nl"><a href="#" class="logo">NP://ROOT</a></div>
    <div class="nr">
      <a href="#projects">Projects</a>
      <a href="#leadership">Leadership</a>
      <a href="#education">Education</a>
      <a href="./assets/docs/resume_tcs.pdf">Resume</a>
    </div>
  </div>
</nav>

<div class="w">

  <header>
    <div class="sys-tag"><span class="pdot"></span> ACTIVE SESSION — MCA CANDIDATE — KERALA, IN</div>
    <h1 id="h1">NITHIN<br><span class="acc">PRASAD</span></h1>
    <div class="tw"><span id="tw"></span><span class="bl2"></span></div>
    <div class="bio">
      Ambitious software developer proficient in Python and AI-driven automation.
      Focus on autonomous data systems and national-level technical leadership.
      Currently pursuing MCA @ ASIET Kalady.
    </div>
    <div class="stats">
      <div class="stat"><span class="sn">04</span><span class="sl">Projects Shipped</span></div>
      <div class="stat"><span class="sn">03</span><span class="sl">Leadership Roles</span></div>
      <div class="stat"><span class="sn">7.9</span><span class="sl">Current GPA</span></div>
      <div class="stat"><span class="sn">19h</span><span class="sl">Hackathon Led</span></div>
    </div>
  </header>

  <section class="sec" id="projects">
    <div class="sh sr"><span class="sn2">01</span><span class="st">Projects</span><div class="sr2"></div></div>
    <div class="pg">
      <div class="pc sr d1">
        <div class="pi">PRJ_001</div>
        <div class="pb">
          <h3>INSIGHT_GEN</h3>
          <p>Agentic AI platform for autonomous data analysis and professional report generation from natural language queries. Multi-agent orchestration via CrewAI.</p>
          <div class="tgs"><span>Python</span><span>CrewAI</span><span>Streamlit</span><span>Pandas</span></div>
        </div>
        <div class="pa">→</div>
      </div>
      <div class="pc sr d2">
        <div class="pi">PRJ_002</div>
        <div class="pb">
          <h3>REVO</h3>
          <p>Social news Android app featuring advanced content rating systems and real-time community discussion threads backed by Firebase.</p>
          <div class="tgs"><span>Java</span><span>Android</span><span>Firebase</span></div>
        </div>
        <div class="pa">→</div>
      </div>
      <div class="pc sr d3">
        <div class="pi">PRJ_003</div>
        <div class="pb">
          <h3>PROFEXIA</h3>
          <p>Web-based skill-barter application for community-driven exchange without financial dependency. Full-stack Django with SQL backend.</p>
          <div class="tgs"><span>Django</span><span>Python</span><span>SQL</span></div>
        </div>
        <div class="pa">→</div>
      </div>
      <div class="pc sr d4">
        <div class="pi">PRJ_004</div>
        <div class="pb">
          <h3>VACCINATION_MANAGER</h3>
          <p>Child vaccination tracking system with automated notification schedules. Reduces missed immunizations through smart reminders.</p>
          <div class="tgs"><span>JavaScript</span><span>HTML5</span><span>SQL</span></div>
        </div>
        <div class="pa">→</div>
      </div>
    </div>
  </section>

  <section class="sec" id="leadership">
    <div class="sh sr"><span class="sn2">02</span><span class="st">Leadership</span><div class="sr2"></div></div>
    <div class="ti sr d1">
      <div class="tl"><span class="td">MAR 2026</span><span class="tc">HACKATHON</span><div class="tdot"></div></div>
      <div class="tr">
        <h4>Main Coordinator — Hackastra 2026</h4>
        <p>Directed end-to-end execution of a 19-hour hackathon themed "Design for Human Weakness". Managed teams, judges, and full logistics.</p>
      </div>
    </div>
    <div class="ti sr d2">
      <div class="tl"><span class="td">OCT 2025</span><span class="tc">DEPT FEST</span><div class="tdot"></div></div>
      <div class="tr">
        <h4>Main Coordinator — Pragyan Tech Fest</h4>
        <p>Led strategic planning, sponsorship acquisition, and execution for the departmental technical festival across multiple event tracks.</p>
      </div>
    </div>
    <div class="ti sr d3">
      <div class="tl"><span class="td">APR 25–26</span><span class="tc">ONGOING</span><div class="tdot"></div></div>
      <div class="tr">
        <h4>MCA Representative — CSI SB ASIET</h4>
        <p>Coordinating technical symposiums and department workshops for the Computer Society of India student branch.</p>
      </div>
    </div>
  </section>

  <section class="sec" id="education">
    <div class="sh sr"><span class="sn2">03</span><span class="st">Education</span><div class="sr2"></div></div>
    <div class="ti sr d1">
      <div class="tl"><span class="td">2024–NOW</span><span class="tc">POSTGRAD</span><div class="tdot"></div></div>
      <div class="tr">
        <h4>Master of Computer Applications</h4>
        <p>Adi Shankara Institute of Engineering and Technology, Kalady.</p>
        <span class="tsub">Focused on AI systems and software architecture</span>
        <span class="badge">GPA: 7.9 / 10</span>
      </div>
    </div>
    <div class="ti sr d2">
      <div class="tl"><span class="td">2021–2024</span><span class="tc">UNDERGRAD</span><div class="tdot"></div></div>
      <div class="tr">
        <h4>Bachelor of Computer Applications</h4>
        <p>DePaul Institute of Science and Technology, Angamaly.</p>
        <span class="badge">GPA: 6.7 / 10</span>
      </div>
    </div>
  </section>

  <div class="cta sr">
    <a href="./assets/docs/resume_tcs.pdf" class="btn">⬇ &nbsp;DOWNLOAD_RESUME.PDF</a>
  </div>

  <footer>
    <span>NITHIN_PRASAD © 2026</span>
    <div class="fstat"><div class="fdot"></div>SYSTEM ONLINE</div>
  </footer>

</div>

<script>
// BOOT
const bootEl = document.getElementById('boot');
const blines = bootEl.querySelectorAll('.bl');
blines.forEach((l,i) => setTimeout(() => l.classList.add('show'), i * 340));
setTimeout(() => document.getElementById('bbar').classList.add('go'), 500);
setTimeout(() => bootEl.classList.add('gone'), 2300);

// CURSOR
const cur = document.getElementById('cur');
const curb = document.getElementById('curb');
let mx=0,my=0,bx=0,by=0;
document.addEventListener('mousemove', e => {
  mx=e.clientX; my=e.clientY;
  cur.style.transform = `translate(${mx-1}px,${my-9}px)`;
});
(function lp(){
  bx+=(mx-bx)*.13; by+=(my-by)*.13;
  curb.style.transform = `translate(${bx-16}px,${by-16}px)`;
  requestAnimationFrame(lp);
})();
document.querySelectorAll('a,.pc,.ti,.btn').forEach(el => {
  el.addEventListener('mouseenter', () => curb.classList.add('big'));
  el.addEventListener('mouseleave', () => curb.classList.remove('big'));
});

// TYPEWRITER
const phrases = ['Python Developer','AI Systems Builder','Hackathon Coordinator','MCA Candidate @ ASIET','Autonomous Data Systems'];
let pi=0,ci=0,del=false;
const twEl = document.getElementById('tw');
function type(){
  const p=phrases[pi];
  if(!del){ twEl.textContent=p.slice(0,ci+1); ci++; if(ci===p.length){del=true;setTimeout(type,1800);return;} setTimeout(type,70); }
  else { twEl.textContent=p.slice(0,ci-1); ci--; if(ci===0){del=false;pi=(pi+1)%phrases.length;setTimeout(type,380);return;} setTimeout(type,36); }
}
setTimeout(type, 2500);

// GLITCH
const h1 = document.getElementById('h1');
function scheduleGlitch(){
  setTimeout(()=>{
    h1.classList.add('glitch');
    setTimeout(()=>h1.classList.remove('glitch'),80);
    scheduleGlitch();
  }, 4000 + Math.random()*4000);
}
scheduleGlitch();

// SCROLL REVEAL
const obs = new IntersectionObserver(entries => {
  entries.forEach(e => { if(e.isIntersecting) e.target.classList.add('in'); });
},{threshold:.1});
document.querySelectorAll('.sr').forEach(el => obs.observe(el));
</script>
</body>
</html>

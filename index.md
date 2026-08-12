---
layout: null
permalink: /
title: "Nithin Prasad — Portfolio"
---

<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta name="description" content="Nithin Prasad — Assistant Systems Engineer, Android App Developer and AI / Software Developer.">
  <title>Nithin Prasad — Portfolio</title>

  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap" rel="stylesheet">

  <style>
    * {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
    }

    html {
      scroll-behavior: smooth;
    }

    body {
      font-family: Inter, Arial, sans-serif;
      background: #fff;
      color: #303033;
      overflow-x: hidden;
      line-height: 1.6;
    }

    body.locked {
      overflow: hidden;
    }

    a {
      color: inherit;
    }

    .container {
      width: min(1180px, calc(100% - 80px));
      margin: 0 auto;
    }

    /* Opening screen */
    #opening {
      position: fixed;
      inset: 0;
      z-index: 9999;
      display: flex;
      align-items: center;
      justify-content: center;
      background: #fff;
      transition: opacity 0.75s ease, visibility 0.75s ease;
    }

    #opening.hide {
      opacity: 0;
      visibility: hidden;
      pointer-events: none;
    }

    .opening-inner {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 42px;
      text-align: center;
    }

    .opening-logo {
      width: min(680px, 78vw);
      height: auto;
      display: block;
      object-fit: contain;
      animation: logoIn 1.1s cubic-bezier(.2,.8,.2,1) both;
    }

    .see-btn {
      border: 1px solid #333;
      background: #fff;
      color: #333;
      border-radius: 999px;
      padding: 13px 30px;
      font-size: 15px;
      cursor: pointer;
      transition: transform .25s ease, background .25s ease, color .25s ease;
    }

    .see-btn:hover {
      background: #333;
      color: #fff;
      transform: translateY(-2px);
    }

    @keyframes logoIn {
      from {
        opacity: 0;
        transform: translateY(24px) scale(.96);
      }
      to {
        opacity: 1;
        transform: none;
      }
    }

    /* Navigation */
    nav {
      position: fixed;
      top: 22px;
      left: 50%;
      transform: translateX(-50%);
      z-index: 1000;
      background: rgba(255,255,255,.82);
      backdrop-filter: blur(12px);
      -webkit-backdrop-filter: blur(12px);
      border-radius: 30px;
      box-shadow: 0 8px 30px rgba(0,0,0,.06);
    }

    .nav-inner {
      display: flex;
      gap: 28px;
      padding: 13px 22px;
    }

    nav a {
      text-decoration: none;
      color: #85858c;
      font-size: 14px;
      transition: color .2s ease;
    }

    nav a:hover,
    nav a.active {
      color: #333;
    }

    nav a.active {
      border-bottom: 1px solid #333;
      padding-bottom: 4px;
    }

    /* Main reveal */
    main {
      opacity: 0;
      transform: translateY(20px);
      transition: opacity .8s ease, transform .8s ease;
    }

    main.visible {
      opacity: 1;
      transform: none;
    }

    /* Hero */
    .hero {
      min-height: 100vh;
      display: grid;
      grid-template-columns: 1.03fr .97fr;
      align-items: center;
      gap: 40px;
      padding-top: 80px;
    }

    .hero-copy {
      padding-left: 26px;
    }

    .name {
      font-size: clamp(64px, 8.2vw, 116px);
      line-height: .83;
      letter-spacing: -6px;
      font-weight: 800;
      margin-bottom: 42px;
    }

    .role {
      font-size: clamp(25px, 3vw, 39px);
      font-weight: 300;
      color: #234d78;
      min-height: 1.35em;
      margin-bottom: 24px;
    }

    .cursor {
      border-right: 2px solid #234d78;
      padding-right: 4px;
    }

    .hero-bio {
      font-size: 18px;
      color: #536171;
      max-width: 600px;
    }

    .hero-actions {
      display: flex;
      gap: 16px;
      margin-top: 38px;
    }

    .btn {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      min-width: 156px;
      padding: 15px 25px;
      border-radius: 6px;
      border: 1px solid #333;
      text-decoration: none;
      font-size: 15px;
      transition: transform .25s ease, background .25s ease;
    }

    .btn.primary {
      background: #333;
      color: #fff;
    }

    .btn:hover {
      transform: translateY(-2px);
    }

    .btn.primary:hover {
      background: #111;
    }

    .visual {
      display: flex;
      justify-content: center;
      align-items: center;
    }

    .keyboard {
      width: min(590px, 100%);
      height: auto;
      display: block;
      object-fit: contain;
      filter: drop-shadow(0 22px 25px rgba(0,0,0,.12));
      animation: float 5s ease-in-out infinite;
    }

    @keyframes float {
      0%, 100% {
        transform: translateY(0);
      }
      50% {
        transform: translateY(-10px);
      }
    }

    /* Sections */
    section {
      padding: 115px 0;
      border-top: 1px solid #eee;
    }

    .section-title {
      font-size: clamp(34px, 5vw, 58px);
      letter-spacing: -2px;
      margin-bottom: 55px;
    }

    .grid {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 24px;
    }

    .card {
      border: 1px solid #e8e8e8;
      border-radius: 18px;
      padding: 30px;
      background: #fff;
      box-shadow: 0 8px 30px rgba(0,0,0,.035);
      transition: transform .3s ease, box-shadow .3s ease;
    }

    .card:hover {
      transform: translateY(-6px);
      box-shadow: 0 18px 45px rgba(0,0,0,.08);
    }

    .card h3 {
      font-size: 23px;
      margin-bottom: 10px;
    }

    .card p {
      color: #66717d;
      margin-bottom: 20px;
    }

    .tags {
      display: flex;
      flex-wrap: wrap;
      gap: 8px;
    }

    .tag {
      font-size: 12px;
      padding: 6px 11px;
      border: 1px solid #ddd;
      border-radius: 999px;
      color: #52606d;
    }


    /* Technology stack */
    .stack-grid {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 16px;
    }

    .stack-card {
      min-height: 125px;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      gap: 13px;
      padding: 20px;
      border: 1px solid #e8e8e8;
      border-radius: 16px;
      background: #fff;
      box-shadow: 0 8px 30px rgba(0,0,0,.035);
      transition: transform .3s ease, box-shadow .3s ease;
    }

    .stack-card:hover {
      transform: translateY(-5px);
      box-shadow: 0 16px 38px rgba(0,0,0,.08);
    }

    .stack-card img {
      width: 38px;
      height: 38px;
      object-fit: contain;
    }

    .stack-card span {
      color: #4f5964;
      font-size: 13px;
      font-weight: 500;
      text-align: center;
    }

    .stack-ai {
      width: 38px;
      height: 38px;
      display: grid;
      place-items: center;
      border: 1.5px solid #333;
      border-radius: 9px;
      font-size: 11px;
      font-weight: 700;
      color: #333;
    }

    /* Timeline */
    .timeline {
      max-width: 920px;
    }

    .item {
      display: grid;
      grid-template-columns: 190px 1fr;
      gap: 35px;
      padding: 0 0 45px;
      margin-bottom: 45px;
      border-bottom: 1px solid #eee;
    }

    .item:last-child {
      margin-bottom: 0;
    }

    .meta {
      color: #7a7f87;
      font-size: 14px;
    }

    .meta strong {
      display: block;
      color: #333;
      font-size: 15px;
      margin-bottom: 4px;
    }

    .content h3 {
      font-size: 23px;
      margin-bottom: 8px;
    }

    .content p {
      color: #65717d;
    }

    .duration {
      display: inline-block;
      margin-top: 10px;
      color: #234d78;
      font-size: 14px;
    }

    /* Scroll reveal */
    .reveal {
      opacity: 0;
      transform: translateY(45px);
      transition: opacity .8s ease, transform .8s ease;
    }

    .reveal.show {
      opacity: 1;
      transform: none;
    }

    .stagger-1 { transition-delay: .08s; }
    .stagger-2 { transition-delay: .16s; }
    .stagger-3 { transition-delay: .24s; }
    .stagger-4 { transition-delay: .32s; }

    footer {
      padding: 55px 0;
      border-top: 1px solid #eee;
      color: #888;
      text-align: center;
    }

    .progress {
      position: fixed;
      top: 0;
      left: 0;
      width: 0;
      height: 3px;
      background: #333;
      z-index: 2000;
    }

    @media (max-width: 850px) {
      .container {
        width: min(100% - 40px, 700px);
      }

      .hero {
        grid-template-columns: 1fr;
        padding-top: 130px;
      }

      .hero-copy {
        padding-left: 0;
      }

      .visual {
        order: -1;
      }

      .keyboard {
        width: 80%;
        margin: auto;
      }

      .stack-grid {
        grid-template-columns: repeat(2, 1fr);
      }

      .name {
        font-size: clamp(58px, 15vw, 90px);
        letter-spacing: -4px;
      }

      .grid {
        grid-template-columns: 1fr;
      }

      .stack-grid {
        grid-template-columns: repeat(2, 1fr);
      }

      .item {
        grid-template-columns: 1fr;
        gap: 10px;
      }

      nav {
        top: 12px;
      }

      .nav-inner {
        gap: 16px;
        padding: 11px 15px;
      }

      nav a {
        font-size: 11px;
      }

      .nav-inner {
        max-width: calc(100vw - 24px);
        overflow-x: auto;
        white-space: nowrap;
        scrollbar-width: none;
      }

      .nav-inner::-webkit-scrollbar {
        display: none;
      }
    }

    @media (max-width: 520px) {
      .opening-logo {
        width: 86vw;
      }

      .opening-inner {
        gap: 30px;
      }

      .hero-actions {
        flex-direction: column;
        align-items: flex-start;
      }

      .btn {
        width: 100%;
        max-width: 240px;
      }
    }

    @media (prefers-reduced-motion: reduce) {
      html {
        scroll-behavior: auto;
      }

      *,
      *::before,
      *::after {
        animation-duration: .01ms !important;
        animation-iteration-count: 1 !important;
        transition-duration: .01ms !important;
      }
    }
  </style>
</head>

<body class="locked">

  <!-- Opening screen -->
  <div id="opening" aria-label="Portfolio introduction">
    <div class="opening-inner">
      <img
        class="opening-logo"
        src="{{ '/assets/docs/nithin-prasad-signature.png' | relative_url }}"
        alt="Nithin Prasad"
      >
      <button class="see-btn" id="enterBtn" type="button">See Portfolio</button>
    </div>
  </div>

  <div class="progress" id="progress"></div>

  <!-- Portfolio navigation -->
  <nav aria-label="Main navigation">
    <div class="nav-inner">
      <a href="#about" class="active">About Me</a>
      <a href="#experience">Experience</a>
      <a href="#projects">Projects</a>
      <a href="#stack">Stack</a>
      <a href="#leadership">Leadership</a>
      <a href="#education">Education</a>
      <a href="#contact">Contact</a>
    </div>
  </nav>

  <main id="portfolio">
    <div class="container">

      <!-- About -->
      <section id="about" class="hero">
        <div class="hero-copy">
          <h1 class="name">Nithin<br>Prasad</h1>

          <div class="role">
            <span id="roleText" class="cursor"></span>
          </div>

          <p class="hero-bio">
            Building intelligent systems, Android applications, and practical
            software with Python, Flutter, Firebase and AI.
          </p>

          <div class="hero-actions">
          <a class="btn primary" href="#projects">View Projects</a>
          <a class="btn secondary" href="#contact">Get in Touch</a>
          <a class="btn secondary" href="{{ '/assets/docs/resume.pdf' | relative_url }}" target="_blank" rel="noopener">Resume</a>
          </div>
        </div>

        <div class="visual">
          <img
            class="keyboard"
            src="{{ '/assets/docs/nithin-keyboard.png' | relative_url }}"
            alt="N-I-T-H-I-N keyboard composition"
          >
        </div>
      </section>

      <!-- Experience -->
      <section id="experience">
        <h2 class="section-title reveal">Experience</h2>

        <div class="timeline">
          <article class="item reveal stagger-1">
            <div class="meta">
              <strong>May 2026 – Present</strong>
              GEM Group
            </div>

            <div class="content">
              <h3>Freelance Android App Developer</h3>
              <p>
                Mobile application development using Flutter and Dart, with
                Firebase integration, REST APIs and Android Studio.
              </p>
              <span class="duration">
                 · Mobile Application Development
              </span>
            </div>
          </article>
        </div>
      </section>

      <!-- Projects -->
      <section id="projects">
        <h2 class="section-title reveal">Selected Projects</h2>

        <div class="grid">
          <article class="card reveal stagger-1">
            <h3>InsightGen</h3>
            <p>
              AI-driven data analysis and automation platform focused on
              turning natural-language requests into useful analytical
              insights and reports.
            </p>
            <div class="tags">
              <span class="tag">Python</span>
              <span class="tag">AI</span>
              <span class="tag">Data Analytics</span>
              <span class="tag">Automation</span>
            </div>
          </article>

          <article class="card reveal stagger-2">
            <h3>Revo</h3>
            <p>
              Community platform with content browsing, profiles, interaction,
              moderation and access control, built with Dart/Flutter frontend
              and Django backend.
            </p>
            <div class="tags">
              <span class="tag">Dart</span>
              <span class="tag">Flutter</span>
              <span class="tag">Django</span>
              <span class="tag">Python</span>
            </div>
          </article>

          <article class="card reveal stagger-3">
            <h3>Profexia</h3>
            <p>
              Web-only skill-bartering platform connecting learners and
              teachers for knowledge exchange, with administration and
              real-time interaction features.
            </p>
            <div class="tags">
              <span class="tag">React</span>
              <span class="tag">Vite</span>
              <span class="tag">Flask</span>
              <span class="tag">MongoDB</span>
              <span class="tag">Socket.IO</span>
            </div>
          </article>
        </div>
      </section>


      <!-- Technology Stack -->
      <section id="stack">
        <h2 class="section-title reveal">Stack</h2>

        <div class="stack-grid">

          <div class="stack-card reveal stagger-1">
            <img src="https://cdn.simpleicons.org/python" alt="Python">
            <span>Python</span>
          </div>

          <div class="stack-card reveal stagger-2">
            <img src="https://cdn.simpleicons.org/dart" alt="Dart">
            <span>Dart</span>
          </div>

          <div class="stack-card reveal stagger-3">
            <img src="https://cdn.simpleicons.org/flutter" alt="Flutter">
            <span>Flutter</span>
          </div>

          <div class="stack-card reveal stagger-4">
            <img src="https://cdn.simpleicons.org/firebase" alt="Firebase">
            <span>Firebase</span>
          </div>

          <div class="stack-card reveal stagger-1">
            <img src="https://cdn.simpleicons.org/django" alt="Django">
            <span>Django</span>
          </div>

          <div class="stack-card reveal stagger-2">
            <img src="https://cdn.simpleicons.org/react" alt="React">
            <span>React</span>
          </div>

          <div class="stack-card reveal stagger-3">
            <img src="https://cdn.simpleicons.org/flask" alt="Flask">
            <span>Flask</span>
          </div>

          <div class="stack-card reveal stagger-4">
            <img src="https://cdn.simpleicons.org/mongodb" alt="MongoDB">
            <span>MongoDB</span>
          </div>

          <div class="stack-card reveal stagger-1">
            <img src="https://cdn.simpleicons.org/vite" alt="Vite">
            <span>Vite</span>
          </div>

          <div class="stack-card reveal stagger-2">
            <img src="https://cdn.simpleicons.org/socketdotio" alt="Socket.IO">
            <span>Socket.IO</span>
          </div>

          <div class="stack-card reveal stagger-3">
            <img src="https://cdn.simpleicons.org/git" alt="Git">
            <span>Git</span>
          </div>

          <div class="stack-card reveal stagger-4">
            <img src="https://cdn.simpleicons.org/github" alt="GitHub">
            <span>GitHub</span>
          </div>

          <div class="stack-card reveal stagger-1">
            <div class="stack-ai">AI</div>
            <span>Artificial Intelligence</span>
          </div>

          <div class="stack-card reveal stagger-2">
            <div class="stack-ai">ML</div>
            <span>Machine Learning</span>
          </div>

          <div class="stack-card reveal stagger-3">
            <div class="stack-ai">API</div>
            <span>REST APIs</span>
          </div>

          <div class="stack-card reveal stagger-4">
            <div class="stack-ai">JWT</div>
            <span>JWT Authentication</span>
          </div>

        </div>
      </section>

      <!-- Leadership -->
      <section id="leadership">
        <h2 class="section-title reveal">Leadership</h2>

        <div class="timeline">
          <article class="item reveal stagger-1">
            <div class="meta">
              <strong>April 2025 – 2026</strong>
              CSI Student Branch
            </div>

            <div class="content">
              <h3>MCA Representative — Computer Society of India</h3>
              <p>
                Coordinating technical events and activities with the
                executive committee of the CSI student branch.
              </p>
              <span class="duration">
                April 2025 – 2026
              </span>
            </div>
          </article>

          <article class="item reveal stagger-2">
            <div class="meta">
              <strong>2025 – 2026</strong>
              Departmental Tech Fest
            </div>

            <div class="content">
              <h3>Main Coordinator — Departmental Tech Fest</h3>
              <p>
                Led planning, coordination and execution of the departmental
                technical festival, working with student teams and organizers.
              </p>
              <span class="duration">
                2025 – 2026
              </span>
            </div>
          </article>
        </div>
      </section>

      <!-- Education -->
      <section id="education">
        <h2 class="section-title reveal">Education</h2>

        <div class="timeline">
          <article class="item reveal stagger-1">
            <div class="meta">
              <strong>2024 – 2026</strong>
              Postgraduate
            </div>

            <div class="content">
              <h3>Master of Computer Applications</h3>
              <p>
                Adi Shankara Institute of Engineering and Technology, Kalady.
              </p>
              <span class="duration">CGPA 8.3</span>
            </div>
          </article>

          <article class="item reveal stagger-2">
            <div class="meta">
              <strong>2021 – 2024</strong>
              Undergraduate
            </div>

            <div class="content">
              <h3>Bachelor of Computer Applications</h3>
              <p>
                DePaul Institute of Science and Technology, Angamaly.
              </p>
              <span class="duration">CGPA 6.7</span>
            </div>
          </article>
        </div>
      </section>

      <!-- Contact -->
      <section id="contact">
        <h2 class="section-title reveal">Contact</h2>

        <div class="card reveal">
          <h3>Let's build something useful.</h3>
          <p>
            Interested in software engineering, Android development,
            AI-driven systems or practical full-stack applications?
          </p>
          <a href="https://github.com/nithinprasad0" target="_blank" rel="noopener" aria-label="GitHub">
    <i class="devicon-github-original"></i>
          </a>

      <a href="https://www.linkedin.com/in/nithin--prasad/" target="_blank" rel="noopener" aria-label="LinkedIn">
    <i class="devicon-linkedin-plain"></i>
      </a>
        </div>
      </section>

      <footer>
        © 2026 Nithin Prasad
      </footer>

    </div>
  </main>

  <script>
    (() => {
      const opening = document.getElementById("opening");
      const portfolio = document.getElementById("portfolio");
      const enterBtn = document.getElementById("enterBtn");

      // Keep portfolio content hidden until the opening button is pressed.
      enterBtn.addEventListener("click", () => {
        opening.classList.add("hide");
        portfolio.classList.add("visible");
        document.body.classList.remove("locked");

        window.setTimeout(() => {
          document.getElementById("about").scrollIntoView({
            behavior: "smooth",
            block: "start"
          });
        }, 180);
      });

      // Rotating hero roles.
      const roles = [
        "Assistant Systems Engineer",
        "Android App Developer",
        "AI / Software Developer",
        "Flutter Developer"
      ];

      const roleEl = document.getElementById("roleText");
      let roleIndex = 0;
      let charIndex = 0;
      let deleting = false;

      function typeRole() {
        const currentRole = roles[roleIndex];

        roleEl.textContent = deleting
          ? currentRole.slice(0, charIndex--)
          : currentRole.slice(0, charIndex++);

        if (!deleting && charIndex > currentRole.length) {
          deleting = true;
          window.setTimeout(typeRole, 1500);
          return;
        }

        if (deleting && charIndex < 0) {
          deleting = false;
          roleIndex = (roleIndex + 1) % roles.length;
          charIndex = 0;
        }

        window.setTimeout(typeRole, deleting ? 45 : 75);
      }

      typeRole();

      // Scroll reveal animation.
      const reveals = document.querySelectorAll(".reveal");

      const revealObserver = new IntersectionObserver(
        entries => {
          entries.forEach(entry => {
            if (entry.isIntersecting) {
              entry.target.classList.add("show");
            }
          });
        },
        { threshold: 0.12 }
      );

      reveals.forEach(element => revealObserver.observe(element));

      // Active navigation item.
      const links = [...document.querySelectorAll("nav a")];
      const sections = [...document.querySelectorAll("main section[id]")];

      const navObserver = new IntersectionObserver(
        entries => {
          entries.forEach(entry => {
            if (entry.isIntersecting) {
              links.forEach(link => {
                link.classList.toggle(
                  "active",
                  link.getAttribute("href") === "#" + entry.target.id
                );
              });
            }
          });
        },
        { rootMargin: "-35% 0px -55% 0px" }
      );

      sections.forEach(section => navObserver.observe(section));

      // Page scroll progress.
      const progress = document.getElementById("progress");

      function updateProgress() {
        const maxScroll =
          document.documentElement.scrollHeight - window.innerHeight;

        progress.style.width =
          (maxScroll > 0 ? (window.scrollY / maxScroll) * 100 : 0) + "%";
      }

      window.addEventListener("scroll", updateProgress, { passive: true });
      updateProgress();
    })();
  </script>

</body>
</html>

---
layout: null
title: Nithin Prasad — Assistant Systems Engineer
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta name="description" content="Nithin Prasad — Assistant Systems Engineer, Android App Developer and software systems builder.">
  <title>Nithin Prasad — Assistant Systems Engineer</title>
  <!-- Technology icons -->
<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/devicon.min.css">
<style>
    :root {
      --bg: #ffffff;
      --surface: #f7f7f7;
      --surface-2: #f2f2f2;
      --text: #303030;
      --muted: #68717c;
      --line: #dedede;
      --accent: #314f70;
      --nav-bg: rgba(248, 248, 248, 0.94);
      --shadow: 0 12px 35px rgba(0,0,0,.07);
      --radius: 12px;
    }

    * { box-sizing: border-box; }

    html {
      scroll-behavior: smooth;
      scroll-padding-top: 92px;
    }

    body {
      margin: 0;
      background: var(--bg);
      color: var(--text);
      font-family: "Trebuchet MS", "Segoe UI", sans-serif;
      font-weight: 400;
      line-height: 1.6;
      overflow-x: hidden;
    }

    button, input, textarea { font: inherit; }

    /* ---------------- Opening screen ---------------- */

    #splash {
      position: fixed;
      inset: 0;
      z-index: 9999;
      display: grid;
      place-items: center;
      background: #f8f8f8;
      transition: opacity .75s ease, visibility .75s ease, transform .75s ease;
    }

    #splash.hidden {
      opacity: 0;
      visibility: hidden;
      transform: translateY(-18px);
      pointer-events: none;
    }

    .splash-inner {
      width: min(820px, 90vw);
      text-align: center;
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 22px;
    }

    .signature {
      width: min(690px, 84vw);
      height: auto;
      display: block;
      object-fit: contain;
    }

    .splash-role {
      margin: 2px 0 8px;
      font-size: clamp(1.05rem, 2vw, 1.45rem);
      color: #263b50;
    }

    .see-portfolio {
      border: 1px solid #303030;
      background: transparent;
      color: #263b50;
      border-radius: 999px;
      padding: 12px 31px;
      cursor: pointer;
      transition: background .25s ease, color .25s ease, transform .25s ease;
    }

    .see-portfolio:hover {
      background: #303030;
      color: #fff;
      transform: translateY(-2px);
    }

    /* ---------------- Main portfolio ---------------- */

    #portfolio {
      opacity: 0;
      visibility: hidden;
      transition: opacity .8s ease;
    }

    #portfolio.visible {
      opacity: 1;
      visibility: visible;
    }

    .container {
      width: min(1180px, calc(100% - 72px));
      margin: 0 auto;
    }

    nav {
      position: sticky;
      top: 18px;
      z-index: 100;
      width: fit-content;
      margin: 18px auto 0;
      padding: 3px;
      background: var(--nav-bg);
      border-radius: 999px;
      box-shadow: 0 3px 20px rgba(0,0,0,.035);
      backdrop-filter: blur(10px);
    }

    .nav-list {
      display: flex;
      align-items: center;
      gap: 4px;
      list-style: none;
      margin: 0;
      padding: 0;
    }

    .nav-list a {
      position: relative;
      display: block;
      padding: 9px 15px;
      color: #7a8490;
      text-decoration: none;
      font-size: .98rem;
      border-radius: 999px;
      transition: color .2s ease;
    }

    .nav-list a:hover,
    .nav-list a.active {
      color: var(--accent);
    }

    .nav-list a.active::after {
      content: "";
      position: absolute;
      left: 15px;
      right: 15px;
      bottom: 3px;
      height: 1px;
      background: #303030;
    }

    section {
      padding: 110px 0;
    }

    .section-title {
      margin: 0 0 58px;
      font-size: clamp(3.4rem, 7vw, 5.2rem);
      line-height: .98;
      font-weight: 300;
      letter-spacing: -0.045em;
    }

    .section-intro {
      max-width: 720px;
      color: var(--muted);
      font-size: 1.05rem;
    }

    /* ---------------- Hero ---------------- */

    #about {
      min-height: calc(100vh - 50px);
      padding-top: 85px;
      display: flex;
      align-items: center;
    }

    .hero {
      display: grid;
      grid-template-columns: minmax(0, 1.02fr) minmax(400px, .98fr);
      align-items: center;
      gap: 45px;
    }

    .hero-name {
      margin: 0;
      font-size: clamp(4.7rem, 9vw, 8.4rem);
      line-height: .88;
      letter-spacing: -0.065em;
      font-weight: 800;
    }

    .hero-role {
      margin: 38px 0 20px;
      min-height: 58px;
      color: var(--accent);
      font-size: clamp(1.7rem, 3vw, 2.55rem);
      line-height: 1.15;
      font-weight: 300;
    }

    .cursor {
      display: inline-block;
      width: 2px;
      height: 1em;
      margin-left: 5px;
      vertical-align: -.1em;
      background: var(--accent);
      animation: blink .8s infinite;
    }

    @keyframes blink {
      50% { opacity: 0; }
    }

    .hero-description {
      max-width: 630px;
      margin: 0;
      color: #596572;
      font-size: clamp(1.05rem, 1.7vw, 1.28rem);
      line-height: 1.55;
    }

    .hero-actions {
      display: flex;
      flex-wrap: wrap;
      gap: 14px;
      margin-top: 30px;
    }

    .btn {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      min-width: 175px;
      padding: 13px 24px;
      border-radius: 7px;
      text-decoration: none;
      cursor: pointer;
      border: 1px solid #303030;
      transition: transform .2s ease, background .2s ease, color .2s ease;
    }

    .btn:hover { transform: translateY(-2px); }

    .btn.primary {
      color: white;
      background: #303030;
    }

    .btn.secondary {
      color: #303030;
      background: white;
    }

    .btn.secondary:hover {
      background: #303030;
      color: white;
    }

    .hero-art-wrap {
      position: relative;
      min-height: 440px;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .keyboard-art {
      width: min(670px, 100%);
      height: auto;
      display: block;
      object-fit: contain;
      filter: drop-shadow(0 22px 20px rgba(0,0,0,.09));
      animation: keyboardIn 1.1s cubic-bezier(.2,.8,.2,1) both;
    }

    @keyframes keyboardIn {
      from { opacity: 0; transform: translateX(45px) translateY(15px) scale(.95); }
      to { opacity: 1; transform: translateX(0) translateY(0) scale(1); }
    }

    .art-caption {
      position: absolute;
      right: 13%;
      bottom: 18px;
      color: #8a8f94;
      font-size: .7rem;
      letter-spacing: .19em;
    }

    .scroll-cue {
      margin-top: 35px;
      text-align: center;
      color: #888;
      font-size: .82rem;
    }

    .scroll-cue span {
      display: block;
      width: 10px;
      height: 10px;
      margin: 10px auto 0;
      border-right: 2px solid #555;
      border-bottom: 2px solid #555;
      transform: rotate(45deg);
    }

    /* ---------------- Timeline / cards ---------------- */

    .timeline {
      position: relative;
      display: grid;
      gap: 45px;
      padding: 0 0 0 0;
    }

    .timeline::before {
      content: "";
      position: absolute;
      left: 52%;
      top: 0;
      bottom: 0;
      width: 1px;
      background: #d7dce0;
    }

    .timeline-item {
      position: relative;
      width: calc(50% - 55px);
      padding: 30px 32px;
      background: var(--surface);
      border: 1px solid #e9e9e9;
      border-radius: var(--radius);
      box-shadow: 0 2px 5px rgba(0,0,0,.035);
    }

    .timeline-item:nth-child(even) {
      margin-left: calc(52% + 55px);
    }

    .timeline-item::after {
      content: "";
      position: absolute;
      top: 50%;
      right: -69px;
      width: 14px;
      height: 14px;
      background: #333;
      border-radius: 50%;
      transform: translateY(-50%);
      box-shadow: 0 0 0 4px white;
    }

    .timeline-item:nth-child(even)::after {
      left: -69px;
      right: auto;
    }

    .card-title {
      margin: 0 0 6px;
      font-size: 1.55rem;
      font-weight: 400;
      line-height: 1.2;
    }

    .card-date {
      color: #7d858d;
      font-size: .96rem;
      margin-bottom: 20px;
    }

    .card-text {
      color: #626a73;
      margin: 0;
    }

    .tags {
      display: flex;
      flex-wrap: wrap;
      gap: 8px;
      margin-top: 20px;
    }

    .tag {
      padding: 5px 11px;
      background: #fff;
      border-radius: 999px;
      color: #687078;
      font-size: .82rem;
      border: 1px solid #ededed;
    }

    /* ---------------- Projects ---------------- */

    .projects-grid {
      display: grid;
      grid-template-columns: repeat(2, minmax(0, 1fr));
      gap: 24px;
    }

    .project {
      padding: 32px;
      background: var(--surface);
      border: 1px solid #e8e8e8;
      border-radius: var(--radius);
      transition: transform .25s ease, box-shadow .25s ease;
    }

    .project:hover {
      transform: translateY(-4px);
      box-shadow: var(--shadow);
    }

    .project h3 {
      margin: 0 0 13px;
      font-size: 1.55rem;
      font-weight: 400;
      line-height: 1.2;
    }

    .project p {
      color: #687078;
      margin: 0;
    }

    /* ---------------- Stack ---------------- */

    .stack-grid {
      display: grid;
      grid-template-columns: repeat(6, minmax(90px, 1fr));
      gap: 38px 22px;
    }

    .stack-item {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 12px;
      text-align: center;
      color: #555d65;
    }

    .stack-item i {
      font-size: 4.2rem;
      line-height: 1;
      color: #333;
    }

    .stack-item span {
      font-size: .92rem;
    }

    /* ---------------- Education / extras ---------------- */

    .two-col {
      display: grid;
      grid-template-columns: repeat(2, minmax(0, 1fr));
      gap: 24px;
    }

    .info-card {
      padding: 30px;
      background: var(--surface);
      border: 1px solid #e8e8e8;
      border-radius: var(--radius);
    }

    .info-card h3 {
      margin: 0 0 8px;
      font-size: 1.35rem;
      font-weight: 400;
    }

    .info-card .institution {
      color: #6d757d;
      margin-bottom: 14px;
    }

    .metric {
      color: var(--accent);
      font-weight: 600;
    }

    .list-clean {
      list-style: none;
      padding: 0;
      margin: 0;
      display: grid;
      gap: 12px;
    }

    .list-clean li {
      padding: 15px 18px;
      background: var(--surface);
      border: 1px solid #e8e8e8;
      border-radius: 9px;
    }

    /* ---------------- Contact ---------------- */

    .contact-heading {
      text-align: center;
    }

    .contact-subtitle {
      text-align: center;
      color: var(--accent);
      font-size: 1.12rem;
      margin: -35px auto 60px;
    }

    .contact-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 64px;
      align-items: start;
    }

    .contact-form {
      display: grid;
      gap: 18px;
    }

    .field {
      width: 100%;
      border: 0;
      background: #f5f5f5;
      border-radius: 9px;
      padding: 17px 23px;
      outline: none;
      color: #333;
      border: 1px solid transparent;
    }

    .field:focus {
      border-color: #d4d8dc;
      background: #fafafa;
    }

    textarea.field {
      min-height: 190px;
      resize: vertical;
    }

    .contact-side h3 {
      margin: 0 0 17px;
      font-size: 1.6rem;
      font-weight: 400;
    }

    .socials {
      display: flex;
      gap: 20px;
      margin-bottom: 28px;
    }

    .socials a {
      color: #333;
      font-size: 2rem;
      text-decoration: none;
      transition: transform .2s ease;
    }

    .socials a:hover { transform: translateY(-2px); }

    .contact-meta {
      padding-top: 26px;
      border-top: 1px solid #ddd;
      color: #65707a;
    }

    footer {
      padding: 35px 0 55px;
      color: #8a8f94;
      text-align: center;
      font-size: .88rem;
    }

    /* ---------------- Reveal animation ---------------- */

    .reveal {
      opacity: 0;
      transform: translateY(28px);
      transition: opacity .75s ease, transform .75s ease;
    }

    .reveal.show {
      opacity: 1;
      transform: translateY(0);
    }

    /* ---------------- Responsive ---------------- */

    @media (max-width: 980px) {
      .container { width: min(900px, calc(100% - 44px)); }

      .hero {
        grid-template-columns: 1fr;
      }

      .hero-art-wrap {
        min-height: 350px;
        order: -1;
      }

      .hero-copy { text-align: center; }

      .hero-description { margin-inline: auto; }

      .hero-actions { justify-content: center; }

      .art-caption {
        right: 20%;
        bottom: 5px;
      }

      .stack-grid {
        grid-template-columns: repeat(4, 1fr);
      }

      .timeline::before { left: 18px; }

      .timeline-item,
      .timeline-item:nth-child(even) {
        width: calc(100% - 55px);
        margin-left: 55px;
      }

      .timeline-item::after,
      .timeline-item:nth-child(even)::after {
        left: -45px;
        right: auto;
      }
    }

    @media (max-width: 680px) {
      .container { width: min(100% - 28px, 560px); }

      nav {
        top: 9px;
        max-width: calc(100% - 20px);
      }

      .nav-list { gap: 0; }

      .nav-list a {
        padding: 8px 9px;
        font-size: .82rem;
      }

      .nav-list a.active::after {
        left: 9px;
        right: 9px;
      }

      section { padding: 78px 0; }

      #about {
        min-height: auto;
        padding-top: 60px;
      }

      .hero-name {
        font-size: clamp(3.8rem, 18vw, 5.6rem);
      }

      .hero-role {
        margin-top: 28px;
        font-size: 1.45rem;
      }

      .hero-art-wrap {
        min-height: 250px;
      }

      .keyboard-art {
        width: 100%;
      }

      .art-caption {
        position: static;
        text-align: center;
        margin-top: 5px;
      }

      .scroll-cue { display: none; }

      .section-title {
        font-size: 3.25rem;
        margin-bottom: 38px;
      }

      .projects-grid,
      .two-col,
      .contact-grid {
        grid-template-columns: 1fr;
      }

      .stack-grid {
        grid-template-columns: repeat(3, 1fr);
        gap: 28px 12px;
      }

      .stack-item i { font-size: 3rem; }

      .timeline-item {
        padding: 24px;
      }

      .splash-inner { gap: 14px; }

      .signature { width: 90vw; }
    }

    @media (prefers-reduced-motion: reduce) {
      html { scroll-behavior: auto; }
      *, *::before, *::after {
        animation-duration: .01ms !important;
        animation-iteration-count: 1 !important;
        transition-duration: .01ms !important;
      }
    }
</head>
<body>
<!-- =========================================================
       OPENING SCREEN
       Required images:
       assets/images/nithin-signature.png
       assets/images/nithin-keyboard.png
<div id="splash" aria-label="Nithin Prasad introduction">
    <div class="splash-inner">
      <img
        class="signature"
        src="assets/images/nithin-signature.png"
        alt="Nithin Prasad"
      >
      <div class="splash-role">Assistant Systems Engineer</div>
      <button class="see-portfolio" id="enterPortfolio">See Portfolio</button>
    </div>
  </div>
<!-- =========================================================
       MAIN PORTFOLIO
       Hidden until "See Portfolio" is pressed.
<main id="portfolio">
    <nav aria-label="Primary navigation">
      <ul class="nav-list">
        <li><a href="#about" class="active">About Me</a></li>
        <li><a href="#experience">Experience</a></li>
        <li><a href="#projects">Projects</a></li>
        <li><a href="#contact">Contact</a></li>
      </ul>
    </nav>

    <!-- ABOUT / HERO -->
    <section id="about">
      <div class="container">
        <div class="hero">

          <div class="hero-copy reveal">
            <h1 class="hero-name">NITHIN<br>PRASAD</h1>

            <div class="hero-role">
              <span id="roleText">Assistant Systems Engineer</span><span class="cursor"></span>
            </div>

            <p class="hero-description">
              Building intelligent systems, Android applications, and practical
              software with Python, Flutter, Firebase and AI.
            </p>

            <div class="hero-actions">
              <a class="btn primary" href="#projects">View Projects</a>
              <a class="btn secondary" href="#contact">Get in Touch</a>
            </div>
          </div>

          <div class="hero-art-wrap reveal">
            <img
              class="keyboard-art"
              src="assets/images/nithin-keyboard.png"
              alt="N-I-T-H-I-N realistic 3D keyboard composition"
            >
            <div class="art-caption">SYSTEMS · MOBILE · AI</div>
          </div>

        </div>

        <div class="scroll-cue">
          Scroll to explore
          <span></span>
        </div>
      </div>
    </section>

    <!-- EXPERIENCE -->
    <section id="experience">
      <div class="container">
        <h2 class="section-title reveal">Experience</h2>

        <div class="timeline">

          <article class="timeline-item reveal">
            <h3 class="card-title">Freelance Android App Developer — GEM Group</h3>
            <div class="card-date">May 2026 – Current</div>
            <p class="card-text">
              Mobile application development focused on practical Android
              applications and production-oriented software delivery.
            </p>
            <div class="tags">
              <span class="tag">Flutter</span>
              <span class="tag">Dart</span>
              <span class="tag">Firebase</span>
              <span class="tag">REST APIs</span>
              <span class="tag">Android Studio</span>
              <span class="tag">Firebase Console</span>
            </div>
          </article>

          <article class="timeline-item reveal">
            <h3 class="card-title">CSI SB ASIET</h3>
            <div class="card-date">April 2025 – 2026</div>
            <p class="card-text">
              Student leadership and technical-community involvement through
              the Computer Society of India Student Branch at ASIET.
            </p>
            <div class="tags">
              <span class="tag">CSI</span>
              <span class="tag">Leadership</span>
              <span class="tag">Technology Community</span>
            </div>
          </article>

        </div>
      </div>
    </section>

    <!-- PROJECTS -->
    <section id="projects">
      <div class="container">
        <h2 class="section-title reveal">Projects</h2>

        <div class="projects-grid">

          <article class="project reveal">
            <h3>InsightGen — Agentic AI Data Analytics Platform</h3>
            <p>
              An AI-oriented data analytics platform designed around practical
              analysis workflows, structured data processing and interactive
              visualisation.
            </p>
            <div class="tags">
              <span class="tag">Python</span>
              <span class="tag">CrewAI</span>
              <span class="tag">Streamlit</span>
              <span class="tag">Pandas</span>
              <span class="tag">Plotly</span>
            </div>
          </article>

          <article class="project reveal">
            <h3>PROFEXIA — Skill Barter Platform</h3>
            <p>
              A skill-exchange platform concept built with a Python/Django
              backend and SQL-based data management.
            </p>
            <div class="tags">
              <span class="tag">Python</span>
              <span class="tag">Django</span>
              <span class="tag">SQL</span>
            </div>
          </article>

          <article class="project reveal">
            <h3>Child Vaccination Management System</h3>
            <p>
              A web-based management system for organising child vaccination
              information and related records.
            </p>
            <div class="tags">
              <span class="tag">HTML</span>
              <span class="tag">CSS</span>
              <span class="tag">JavaScript</span>
              <span class="tag">SQL</span>
            </div>
          </article>

        </div>
      </div>
    </section>

    <!-- TECHNOLOGIES -->
    <section id="technologies">
      <div class="container">
        <h2 class="section-title reveal">Technologies</h2>

        <div class="stack-grid">

          <div class="stack-item reveal">
            <i class="devicon-python-plain" aria-hidden="true"></i>
            <span>Python</span>
          </div>

          <div class="stack-item reveal">
            <i class="devicon-java-plain" aria-hidden="true"></i>
            <span>Java</span>
          </div>

          <div class="stack-item reveal">
            <i class="devicon-cplusplus-plain" aria-hidden="true"></i>
            <span>C/C++</span>
          </div>

          <div class="stack-item reveal">
            <i class="devicon-mysql-plain" aria-hidden="true"></i>
            <span>SQL</span>
          </div>

          <div class="stack-item reveal">
            <i class="devicon-flutter-plain" aria-hidden="true"></i>
            <span>Flutter</span>
          </div>

          <div class="stack-item reveal">
            <i class="devicon-dart-plain" aria-hidden="true"></i>
            <span>Dart</span>
          </div>

          <div class="stack-item reveal">
            <i class="devicon-firebase-plain" aria-hidden="true"></i>
            <span>Firebase</span>
          </div>

          <div class="stack-item reveal">
            <i class="devicon-django-plain" aria-hidden="true"></i>
            <span>Django</span>
          </div>

          <div class="stack-item reveal">
            <i class="devicon-html5-plain" aria-hidden="true"></i>
            <span>HTML</span>
          </div>

          <div class="stack-item reveal">
            <i class="devicon-css3-plain" aria-hidden="true"></i>
            <span>CSS</span>
          </div>

          <div class="stack-item reveal">
            <i class="devicon-javascript-plain" aria-hidden="true"></i>
            <span>JavaScript</span>
          </div>

          <div class="stack-item reveal">
            <i class="devicon-git-plain" aria-hidden="true"></i>
            <span>Git</span>
          </div>

          <div class="stack-item reveal">
            <i class="devicon-github-original" aria-hidden="true"></i>
            <span>GitHub</span>
          </div>

          <div class="stack-item reveal">
            <i class="devicon-androidstudio-plain" aria-hidden="true"></i>
            <span>Android Studio</span>
          </div>

          <div class="stack-item reveal">
            <i class="devicon-pandas-plain" aria-hidden="true"></i>
            <span>Pandas</span>
          </div>

          <div class="stack-item reveal">
            <i class="devicon-streamlit-plain" aria-hidden="true"></i>
            <span>Streamlit</span>
          </div>

        </div>
      </div>
    </section>

    <!-- EDUCATION -->
    <section id="education">
      <div class="container">
        <h2 class="section-title reveal">Education</h2>

        <div class="two-col">

          <article class="info-card reveal">
            <h3>Master of Computer Applications (MCA)</h3>
            <div class="institution">
              Adi Shankara Institute of Engineering and Technology
            </div>
            <div>2024 – 2026</div>
            <div class="metric">CGPA: 8.3</div>
          </article>

          <article class="info-card reveal">
            <h3>Bachelor of Computer Applications (BCA)</h3>
            <div class="institution">
              DePaul Institute of Science and Technology
            </div>
            <div>2021 – 2024</div>
            <div class="metric">CGPA: 6.7</div>
          </article>

        </div>
      </div>
    </section>

    <!-- LEADERSHIP -->
    <section id="leadership">
      <div class="container">
        <h2 class="section-title reveal">Leadership &amp; Activities</h2>

        <ul class="list-clean">
          <li class="reveal"><strong>Main Coordinator</strong> — Hackastra 2026</li>
          <li class="reveal"><strong>Main Coordinator</strong> — Pragyan Tech Fest</li>
          <li class="reveal"><strong>MCA Representative</strong> — CSI SB ASIET</li>
        </ul>
      </div>
    </section>

    <!-- CERTIFICATIONS -->
    <section id="certifications">
      <div class="container">
        <h2 class="section-title reveal">Certifications</h2>

        <ul class="list-clean">
          <li class="reveal">Generative AI: Introduction and Applications — IBM</li>
          <li class="reveal">Developing Front-End Apps with React — IBM</li>
          <li class="reveal">Cloud Computing — NPTEL</li>
          <li class="reveal">Full Stack Development with Django — ICT Academy Kerala</li>
        </ul>
      </div>
    </section>

    <!-- CONTACT -->
    <section id="contact">
      <div class="container">
        <h2 class="section-title contact-heading reveal">Let's Connect</h2>
        <p class="contact-subtitle reveal">
          Have a project in mind or want to collaborate? Get in touch!
        </p>

        <div class="contact-grid">

          <form class="contact-form reveal" action="https://formspree.io/f/REPLACE_WITH_YOUR_FORM_ID" method="POST">
            <input class="field" type="text" name="name" placeholder="Name" required>
            <input class="field" type="email" name="email" placeholder="Email" required>
            <textarea class="field" name="message" placeholder="Message" required></textarea>
            <button class="btn primary" type="submit">Send Message</button>
          </form>

          <div class="contact-side reveal">
            <h3>Connect With Me</h3>

            <div class="socials">
              <!-- Replace these placeholders with Nithin's actual profile URLs. -->
              <a href="https://github.com/" target="_blank" rel="noopener noreferrer" aria-label="GitHub">
                <i class="devicon-github-original"></i>
              </a>

              <a href="https://www.linkedin.com/" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">
                <i class="devicon-linkedin-plain"></i>
              </a>

              <a href="mailto:YOUR_EMAIL@example.com" aria-label="Email">
                ✉
              </a>
            </div>

            <div class="contact-meta">
              <p>
                Building intelligent systems, Android applications and
                practical software.
              </p>
              <p>
                Open to software engineering, Android and AI-oriented
                opportunities.
              </p>
            </div>
          </div>

        </div>
      </div>
    </section>

    <footer>
      © <span id="year"></span> Nithin Prasad
    </footer>

</main>
<script>
    (() => {
      const splash = document.getElementById("splash");
      const portfolio = document.getElementById("portfolio");
      const enterButton = document.getElementById("enterPortfolio");

      enterButton.addEventListener("click", () => {
        splash.classList.add("hidden");
        portfolio.classList.add("visible");

        window.setTimeout(() => {
          document.getElementById("about").scrollIntoView({
            behavior: "smooth",
            block: "start"
          });
        }, 150);
      });

      const roles = [
        "Assistant Systems Engineer",
        "Android App Developer"
      ];

      const roleText = document.getElementById("roleText");
      let roleIndex = 0;
      let charIndex = roles[0].length;
      let deleting = true;

      function typeRole() {
        if (!portfolio.classList.contains("visible")) {
          window.setTimeout(typeRole, 500);
          return;
        }

        const current = roles[roleIndex];

        if (deleting) {
          charIndex--;
          roleText.textContent = current.slice(0, charIndex);

          if (charIndex <= 0) {
            deleting = false;
            roleIndex = (roleIndex + 1) % roles.length;
            window.setTimeout(typeRole, 450);
            return;
          }

          window.setTimeout(typeRole, 48);
        } else {
          const next = roles[roleIndex];
          charIndex++;

          roleText.textContent = next.slice(0, charIndex);

          if (charIndex >= next.length) {
            deleting = true;
            window.setTimeout(typeRole, 1500);
            return;
          }

          window.setTimeout(typeRole, 72);
        }
      }

      /* Start after the opening screen has been entered. */
      window.setTimeout(typeRole, 700);

      const observer = new IntersectionObserver(
        entries => {
          entries.forEach(entry => {
            if (entry.isIntersecting) entry.target.classList.add("show");
          });
        },
        { threshold: 0.12 }
      );

      document.querySelectorAll(".reveal").forEach(el => observer.observe(el));

      const sections = [...document.querySelectorAll("main section[id]")];
      const navLinks = [...document.querySelectorAll(".nav-list a")];

      const sectionObserver = new IntersectionObserver(
        entries => {
          entries.forEach(entry => {
            if (!entry.isIntersecting) return;

            navLinks.forEach(link => link.classList.remove("active"));
            const active = document.querySelector(
              `.nav-list a[href="#${entry.target.id}"]`
            );
            if (active) active.classList.add("active");
          });
        },
        { rootMargin: "-35% 0px -55% 0px" }
      );

      sections.forEach(section => sectionObserver.observe(section));

      document.getElementById("year").textContent = new Date().getFullYear();
    })();
</body>
</html>

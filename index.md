---
layout: null
---

<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta name="description" content="Nithin Prasad — Assistant Systems Engineer, Android App Developer and AI-focused software developer.">
  <title>Nithin Prasad — Portfolio</title>

  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Quicksand:wght@300;400;500;600;700&display=swap" rel="stylesheet">

  <!-- Devicon gives the technology logos used in the Technologies section. -->
  <link rel="stylesheet"
        href="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/devicon.min.css">

  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }

    :root {
      --bg: #ffffff;
      --soft: #f6f6f6;
      --soft-2: #eeeeee;
      --text: #343434;
      --muted: #666666;
      --line: #d8d8d8;
      --accent: #24476b;
      --dark: #333333;
      --shadow: 0 10px 28px rgba(0,0,0,.07);
    }

    html {
      scroll-behavior: smooth;
      background: var(--bg);
    }

    body {
      min-height: 100vh;
      background: var(--bg);
      color: var(--text);
      font-family: "Quicksand", sans-serif;
      font-weight: 400;
      line-height: 1.65;
      overflow-x: hidden;
    }

    a { color: inherit; }

    /* =========================================================
       OPENING SCREEN
       Only this is visible until "See Portfolio" is clicked.
       ========================================================= */

    #intro {
      min-height: 100svh;
      width: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
      background: #f7f7f7;
      position: fixed;
      inset: 0;
      z-index: 1000;
      transition: opacity .75s ease, visibility .75s ease;
    }

    #intro.hide {
      opacity: 0;
      visibility: hidden;
      pointer-events: none;
    }

    .intro-inner {
      width: min(760px, 90vw);
      text-align: center;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      gap: 24px;
      padding: 40px 20px;
    }

    .signature {
      width: min(620px, 82vw);
      max-height: 330px;
      object-fit: contain;
      display: block;
      filter: none;
      user-select: none;
      -webkit-user-drag: none;
      animation: introLogo .9s ease both;
    }

    .intro-role {
      color: #1f3e5d;
      font-size: clamp(1.05rem, 2.5vw, 1.35rem);
      font-weight: 500;
      letter-spacing: .2px;
      animation: fadeUp .8s .15s ease both;
    }

    .see-portfolio {
      margin-top: 4px;
      border: 1px solid #333;
      background: transparent;
      color: #333;
      border-radius: 999px;
      padding: 13px 34px;
      font: 500 1rem "Quicksand", sans-serif;
      cursor: pointer;
      transition: background .25s ease, color .25s ease, transform .25s ease;
      animation: fadeUp .8s .3s ease both;
    }

    .see-portfolio:hover {
      background: #333;
      color: #fff;
      transform: translateY(-2px);
    }

    /* =========================================================
       MAIN PORTFOLIO
       ========================================================= */

    #portfolio {
      opacity: 0;
      visibility: hidden;
      transition: opacity .8s ease;
    }

    #portfolio.show {
      opacity: 1;
      visibility: visible;
    }

    .nav {
      position: fixed;
      top: 18px;
      left: 50%;
      transform: translateX(-50%);
      z-index: 500;
      width: max-content;
      max-width: calc(100% - 28px);
      background: rgba(255,255,255,.88);
      backdrop-filter: blur(12px);
      -webkit-backdrop-filter: blur(12px);
      border-radius: 999px;
      box-shadow: 0 4px 20px rgba(0,0,0,.035);
    }

    .nav-inner {
      display: flex;
      align-items: center;
      gap: 34px;
      padding: 11px 20px;
    }

    .nav a {
      text-decoration: none;
      color: #7a7f88;
      font-size: .92rem;
      font-weight: 400;
      position: relative;
      transition: color .2s ease;
      white-space: nowrap;
    }

    .nav a:hover,
    .nav a.active {
      color: var(--accent);
    }

    .nav a.active::after {
      content: "";
      position: absolute;
      left: 0;
      right: 0;
      bottom: -8px;
      height: 1.5px;
      background: #333;
    }

    .section {
      min-height: 100vh;
      padding: 120px 7vw 90px;
      display: flex;
      flex-direction: column;
      justify-content: center;
    }

    .section-title {
      font-size: clamp(3rem, 6vw, 5rem);
      line-height: 1.05;
      font-weight: 300;
      letter-spacing: -2px;
      margin-bottom: 60px;
    }

    /* HERO */

    .hero {
      min-height: 100svh;
      padding-top: 110px;
      display: grid;
      grid-template-columns: minmax(0, 1.05fr) minmax(340px, .95fr);
      gap: 40px;
      align-items: center;
      max-width: 1280px;
      margin: auto;
    }

    .hero-copy {
      padding-left: 10px;
    }

    .hero-name {
      font-size: clamp(4rem, 8vw, 7rem);
      line-height: .9;
      font-weight: 700;
      letter-spacing: -5px;
      color: var(--dark);
      margin-bottom: 34px;
    }

    .hero-role {
      font-size: clamp(1.6rem, 3.2vw, 2.45rem);
      line-height: 1.35;
      color: var(--accent);
      font-weight: 400;
      min-height: 1.4em;
      margin-bottom: 24px;
    }

    .typing-cursor {
      display: inline-block;
      width: 2px;
      height: 1em;
      background: var(--accent);
      vertical-align: -.1em;
      margin-left: 3px;
      animation: blink 1s infinite;
    }

    .hero-description {
      max-width: 620px;
      color: var(--muted);
      font-size: 1.08rem;
      line-height: 1.65;
      margin-bottom: 34px;
    }

    .hero-buttons {
      display: flex;
      gap: 16px;
      flex-wrap: wrap;
    }

    .btn {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      min-width: 155px;
      padding: 14px 25px;
      border-radius: 7px;
      text-decoration: none;
      font-size: 1rem;
      font-weight: 500;
      border: 1px solid #333;
      transition: transform .2s ease, background .2s ease, color .2s ease;
    }

    .btn:hover {
      transform: translateY(-2px);
    }

    .btn.primary {
      background: #333;
      color: white;
    }

    .btn.primary:hover {
      background: #222;
    }

    .btn.secondary {
      background: white;
      color: #333;
    }

    .btn.secondary:hover {
      background: #f2f2f2;
    }

    .hero-visual {
      display: flex;
      align-items: center;
      justify-content: center;
      min-height: 440px;
    }

    .keyboard {
      width: min(650px, 100%);
      height: auto;
      display: block;
      object-fit: contain;
      filter: drop-shadow(0 22px 24px rgba(0,0,0,.12));
      transform: translateY(10px);
      user-select: none;
      -webkit-user-drag: none;
      animation: keyboardFloat 5s ease-in-out infinite;
    }

    .visual-caption {
      position: absolute;
      margin-top: 360px;
      margin-left: 30px;
      font-size: .72rem;
      letter-spacing: 2px;
      color: #999;
      text-transform: uppercase;
    }

    .scroll-hint {
      position: absolute;
      left: 50%;
      bottom: 28px;
      transform: translateX(-50%);
      text-align: center;
      color: #999;
      font-size: .78rem;
    }

    .scroll-arrow {
      width: 11px;
      height: 11px;
      border-right: 2px solid #555;
      border-bottom: 2px solid #555;
      transform: rotate(45deg);
      margin: 9px auto 0;
    }

    /* ABOUT */

    .about {
      background: #f7f7f7;
    }

    .about-grid {
      max-width: 1120px;
      margin: 0 auto;
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 70px;
      align-items: start;
    }

    .about-text {
      font-size: 1.08rem;
      color: #5d5d5d;
    }

    .about-text p + p {
      margin-top: 20px;
    }

    .facts {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 14px;
    }

    .fact {
      background: white;
      border-radius: 12px;
      padding: 22px;
      box-shadow: var(--shadow);
    }

    .fact-value {
      display: block;
      font-size: 1.65rem;
      font-weight: 600;
      color: #333;
    }

    .fact-label {
      display: block;
      margin-top: 3px;
      font-size: .86rem;
      color: #777;
    }

    /* EXPERIENCE / PROJECTS */

    .content-width {
      width: min(1120px, 100%);
      margin: 0 auto;
    }

    .timeline {
      position: relative;
      padding-left: 40px;
    }

    .timeline::before {
      content: "";
      position: absolute;
      left: 9px;
      top: 6px;
      bottom: 6px;
      width: 1px;
      background: #ccd2d8;
    }

    .timeline-item {
      position: relative;
      background: #fff;
      border: 1px solid #e5e5e5;
      border-radius: 12px;
      padding: 28px 30px;
      margin-bottom: 24px;
      box-shadow: 0 4px 15px rgba(0,0,0,.035);
    }

    .timeline-item::before {
      content: "";
      position: absolute;
      left: -36px;
      top: 39px;
      width: 14px;
      height: 14px;
      background: #333;
      border-radius: 50%;
      border: 3px solid white;
      box-shadow: 0 0 0 1px #c9c9c9;
    }

    .item-title {
      font-size: 1.4rem;
      font-weight: 500;
      margin-bottom: 5px;
    }

    .item-date {
      color: #888;
      font-size: .9rem;
      margin-bottom: 14px;
    }

    .item-text {
      color: #666;
      max-width: 850px;
    }

    .tags {
      display: flex;
      flex-wrap: wrap;
      gap: 8px;
      margin-top: 17px;
    }

    .tag {
      background: #f3f3f3;
      border-radius: 999px;
      padding: 5px 12px;
      font-size: .78rem;
      color: #666;
    }

    /* PROJECT CARDS */

    .projects-grid {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 22px;
    }

    .project-card {
      background: #f6f6f6;
      border: 1px solid #e8e8e8;
      border-radius: 12px;
      padding: 30px;
      min-height: 245px;
      transition: transform .25s ease, box-shadow .25s ease;
    }

    .project-card:hover {
      transform: translateY(-5px);
      box-shadow: var(--shadow);
    }

    .project-card h3 {
      font-size: 1.35rem;
      font-weight: 500;
      margin-bottom: 13px;
    }

    .project-card p {
      color: #666;
      line-height: 1.65;
    }

    /* TECHNOLOGIES */

    .tech-section {
      background: #f7f7f7;
    }

    .tech-grid {
      width: min(1120px, 100%);
      margin: 0 auto;
      display: grid;
      grid-template-columns: repeat(7, 1fr);
      gap: 35px 20px;
    }

    .tech {
      text-align: center;
      color: #444;
    }

    .tech i {
      display: block;
      font-size: 4rem;
      line-height: 1;
      margin-bottom: 15px;
      color: #333;
    }

    .tech span {
      font-size: .98rem;
    }

    /* EDUCATION */

    .education-list {
      width: min(1000px, 100%);
      margin: 0 auto;
    }

    .education-item {
      display: grid;
      grid-template-columns: 150px 1fr;
      gap: 30px;
      padding: 30px 0;
      border-bottom: 1px solid #ddd;
    }

    .education-item:last-child {
      border-bottom: 0;
    }

    .edu-year {
      color: #777;
      font-size: .9rem;
    }

    .edu-degree {
      font-size: 1.35rem;
      font-weight: 500;
      margin-bottom: 5px;
    }

    .edu-school {
      color: #777;
    }

    .gpa {
      display: inline-block;
      margin-top: 13px;
      padding: 5px 13px;
      border-radius: 999px;
      background: #f1f1f1;
      color: #444;
      font-size: .82rem;
      font-weight: 500;
    }

    /* CONTACT */

    .contact {
      background: white;
      text-align: center;
    }

    .contact-subtitle {
      color: #666;
      font-size: 1.15rem;
      margin-top: -32px;
      margin-bottom: 55px;
    }

    .contact-grid {
      width: min(900px, 100%);
      margin: 0 auto;
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 55px;
      text-align: left;
    }

    .contact-form {
      display: grid;
      gap: 15px;
    }

    .contact-form input,
    .contact-form textarea {
      width: 100%;
      border: 0;
      background: #f6f6f6;
      border-radius: 8px;
      padding: 17px 20px;
      font: 400 1rem "Quicksand", sans-serif;
      color: #333;
      outline: none;
      resize: vertical;
    }

    .contact-form textarea {
      min-height: 170px;
    }

    .contact-form input:focus,
    .contact-form textarea:focus {
      box-shadow: 0 0 0 1px #aaa;
    }

    .contact-info {
      padding-top: 4px;
    }

    .contact-info h3 {
      font-size: 1.5rem;
      font-weight: 500;
      margin-bottom: 20px;
    }

    .socials {
      display: flex;
      gap: 18px;
      margin-bottom: 30px;
    }

    .socials a {
      font-size: 1.8rem;
      text-decoration: none;
      color: #333;
      transition: transform .2s ease, color .2s ease;
    }

    .socials a:hover {
      transform: translateY(-2px);
      color: var(--accent);
    }

    .contact-details {
      border-top: 1px solid #ddd;
      padding-top: 22px;
      color: #666;
      line-height: 1.9;
    }

    footer {
      padding: 30px 20px;
      text-align: center;
      border-top: 1px solid #eee;
      color: #888;
      font-size: .85rem;
    }

    /* REVEAL */

    .reveal {
      opacity: 0;
      transform: translateY(28px);
      transition: opacity .8s ease, transform .8s ease;
    }

    .reveal.visible {
      opacity: 1;
      transform: translateY(0);
    }

    @keyframes fadeUp {
      from { opacity: 0; transform: translateY(18px); }
      to { opacity: 1; transform: translateY(0); }
    }

    @keyframes introLogo {
      from { opacity: 0; transform: scale(.96) translateY(10px); }
      to { opacity: 1; transform: scale(1) translateY(0); }
    }

    @keyframes keyboardFloat {
      0%, 100% { transform: translateY(10px) rotate(0deg); }
      50% { transform: translateY(-4px) rotate(-.5deg); }
    }

    @keyframes blink {
      0%, 45% { opacity: 1; }
      46%, 100% { opacity: 0; }
    }

    /* MOBILE */

    @media (max-width: 900px) {
      .hero {
        grid-template-columns: 1fr;
        padding-top: 130px;
        gap: 15px;
      }

      .hero-copy {
        padding-left: 0;
        text-align: center;
      }

      .hero-description {
        margin-left: auto;
        margin-right: auto;
      }

      .hero-buttons {
        justify-content: center;
      }

      .hero-visual {
        min-height: 300px;
      }

      .visual-caption {
        display: none;
      }

      .about-grid,
      .contact-grid {
        grid-template-columns: 1fr;
        gap: 40px;
      }

      .tech-grid {
        grid-template-columns: repeat(4, 1fr);
      }
    }

    @media (max-width: 650px) {
      .nav {
        top: 10px;
        max-width: calc(100% - 20px);
      }

      .nav-inner {
        gap: 15px;
        padding: 10px 14px;
      }

      .nav a {
        font-size: .78rem;
      }

      .section {
        padding: 95px 22px 70px;
      }

      .section-title {
        margin-bottom: 40px;
        letter-spacing: -1px;
      }

      .hero-name {
        font-size: clamp(3.4rem, 16vw, 5.4rem);
        letter-spacing: -3px;
      }

      .projects-grid {
        grid-template-columns: 1fr;
      }

      .facts {
        grid-template-columns: 1fr 1fr;
      }

      .tech-grid {
        grid-template-columns: repeat(2, 1fr);
        gap: 32px 15px;
      }

      .tech i {
        font-size: 3.3rem;
      }

      .education-item {
        grid-template-columns: 1fr;
        gap: 8px;
      }

      .timeline {
        padding-left: 28px;
      }

      .timeline-item::before {
        left: -25px;
      }

      .contact-grid {
        gap: 35px;
      }
    }
  </style>
</head>

<body>

  <!-- =======================================================
       OPENING SCREEN
       Image: assets/docs/nithin-prasad-signature.png
       ======================================================= -->
  <section id="intro" aria-label="Portfolio introduction">
    <div class="intro-inner">
      <img
        class="signature"
        src="assets/docs/nithin-prasad-signature.png"
        alt="Nithin Prasad"
      >

      <div class="intro-role">Assistant Systems Engineer</div>

      <button class="see-portfolio" id="seePortfolio">
        See Portfolio
      </button>
    </div>
  </section>

  <!-- =======================================================
       MAIN CONTENT — hidden until See Portfolio is clicked
       ======================================================= -->
  <main id="portfolio">

    <nav class="nav" aria-label="Main navigation">
      <div class="nav-inner">
        <a href="#about" class="active">About Me</a>
        <a href="#experience">Experience</a>
        <a href="#projects">Projects</a>
        <a href="#contact">Contact</a>
      </div>
    </nav>

    <!-- HERO -->
    <section id="about" class="section">
      <div class="hero">

        <div class="hero-copy">
          <h1 class="hero-name">Nithin<br>Prasad</h1>

          <h2 class="hero-role">
            <span id="roleText">Assistant Systems Engineer</span><span class="typing-cursor"></span>
          </h2>

          <p class="hero-description">
            Building intelligent systems, Android applications, and practical
            software with Python, Flutter, Firebase and AI.
          </p>

          <div class="hero-buttons">
            <a class="btn primary" href="#projects">View Projects</a>
            <a class="btn secondary" href="#contact">Get in Touch</a>
          </div>
        </div>

        <div class="hero-visual">
          <!-- Replace this file with the keyboard image supplied by you. -->
          <img
            class="keyboard"
            src="assets/docs/nithin-keyboard.png"
            alt="Keyboard composition spelling N-I-T-H-I-N"
          >
          <div class="visual-caption">SYSTEMS · MOBILE · AI</div>
        </div>

      </div>

      <div class="scroll-hint">
        Scroll to explore
        <div class="scroll-arrow"></div>
      </div>
    </section>

    <!-- ABOUT -->
    <section class="section about">
      <h2 class="section-title reveal">About Me</h2>

      <div class="about-grid content-width">
        <div class="about-text reveal">
          <p>
            I am a software developer focused on building useful, intelligent
            systems and practical applications. My work spans Python,
            Android, Flutter, Firebase, web development and AI-driven
            automation.
          </p>
          <p>
            I enjoy turning ideas into working products — from mobile
            applications and full-stack platforms to AI-assisted systems.
          </p>
        </div>

        <div class="facts reveal">
          <div class="fact">
            <span class="fact-value">04</span>
            <span class="fact-label">Selected Projects</span>
          </div>
          <div class="fact">
            <span class="fact-value">03</span>
            <span class="fact-label">Leadership Roles</span>
          </div>
          <div class="fact">
            <span class="fact-value">6.7</span>
            <span class="fact-label">BCA CGPA / 10</span>
          </div>
          <div class="fact">
            <span class="fact-value">AI</span>
            <span class="fact-label">Systems Focus</span>
          </div>
        </div>
      </div>
    </section>

    <!-- EXPERIENCE -->
    <section id="experience" class="section">
      <h2 class="section-title reveal">Experience</h2>

      <div class="timeline content-width">
        <article class="timeline-item reveal">
          <h3 class="item-title">Assistant Systems Engineer</h3>
          <div class="item-date">Software Engineering · AI / Automation</div>
          <p class="item-text">
            Building practical software systems, automation workflows and
            AI-assisted applications with a focus on reliability and
            real-world usability.
          </p>
          <div class="tags">
            <span class="tag">Python</span>
            <span class="tag">AI</span>
            <span class="tag">Automation</span>
            <span class="tag">Software Engineering</span>
          </div>
        </article>

        <article class="timeline-item reveal">
          <h3 class="item-title">Android App Development</h3>
          <div class="item-date">Mobile Development</div>
          <p class="item-text">
            Developing Android applications and integrating application
            services with Firebase-backed infrastructure.
          </p>
          <div class="tags">
            <span class="tag">Android</span>
            <span class="tag">Java</span>
            <span class="tag">Firebase</span>
          </div>
        </article>
      </div>
    </section>

    <!-- PROJECTS -->
    <section id="projects" class="section about">
      <h2 class="section-title reveal">Projects</h2>

      <div class="projects-grid content-width">

        <article class="project-card reveal">
          <h3>Insight Gen</h3>
          <p>
            Agentic AI platform for autonomous data analysis and professional
            report generation from natural-language queries through
            multi-agent orchestration.
          </p>
          <div class="tags">
            <span class="tag">Python</span>
            <span class="tag">CrewAI</span>
            <span class="tag">Streamlit</span>
            <span class="tag">Pandas</span>
          </div>
        </article>

        <article class="project-card reveal">
          <h3>Revo</h3>
          <p>
            Social news Android application with content rating and
            real-time community discussion backed by Firebase.
          </p>
          <div class="tags">
            <span class="tag">Java</span>
            <span class="tag">Android</span>
            <span class="tag">Firebase</span>
          </div>
        </article>

        <article class="project-card reveal">
          <h3>Profexia</h3>
          <p>
            Full-stack skill-barter platform enabling community-driven
            exchange without financial dependency.
          </p>
          <div class="tags">
            <span class="tag">Django</span>
            <span class="tag">Python</span>
            <span class="tag">SQL</span>
          </div>
        </article>

        <article class="project-card reveal">
          <h3>Vaccination Manager</h3>
          <p>
            Child vaccination tracking system with automated notification
            schedules and intelligent reminders.
          </p>
          <div class="tags">
            <span class="tag">JavaScript</span>
            <span class="tag">HTML5</span>
            <span class="tag">SQL</span>
          </div>
        </article>

      </div>
    </section>

    <!-- TECHNOLOGIES -->
    <section class="section tech-section">
      <h2 class="section-title reveal">Technologies</h2>

      <div class="tech-grid">

        <div class="tech reveal">
          <i class="devicon-python-plain"></i>
          <span>Python</span>
        </div>

        <div class="tech reveal">
          <i class="devicon-flutter-plain"></i>
          <span>Flutter</span>
        </div>

        <div class="tech reveal">
          <i class="devicon-android-plain"></i>
          <span>Android</span>
        </div>

        <div class="tech reveal">
          <i class="devicon-firebase-plain"></i>
          <span>Firebase</span>
        </div>

        <div class="tech reveal">
          <i class="devicon-django-plain"></i>
          <span>Django</span>
        </div>

        <div class="tech reveal">
          <i class="devicon-javascript-plain"></i>
          <span>JavaScript</span>
        </div>

        <div class="tech reveal">
          <i class="devicon-git-plain"></i>
          <span>Git</span>
        </div>

      </div>
    </section>

    <!-- EDUCATION -->
    <section class="section">
      <h2 class="section-title reveal">Education</h2>

      <div class="education-list">

        <article class="education-item reveal">
          <div class="edu-year">2024 – Now</div>
          <div>
            <h3 class="edu-degree">Master of Computer Applications</h3>
            <p class="edu-school">
              Adi Shankara Institute of Engineering and Technology, Kalady
            </p>
            <span class="gpa">MCA</span>
          </div>
        </article>

        <article class="education-item reveal">
          <div class="edu-year">2021 – 2024</div>
          <div>
            <h3 class="edu-degree">Bachelor of Computer Applications</h3>
            <p class="edu-school">
              DePaul Institute of Science and Technology, Angamaly
            </p>
            <span class="gpa">BCA · CGPA 6.7 / 10</span>
          </div>
        </article>

      </div>
    </section>

    <!-- CONTACT -->
    <section id="contact" class="section contact">
      <h2 class="section-title reveal">Let's Connect</h2>
      <p class="contact-subtitle reveal">
        Have a project in mind or want to collaborate? Get in touch!
      </p>

      <div class="contact-grid">

        <form class="contact-form reveal"
              action="https://formspree.io/f/YOUR_FORM_ID"
              method="POST">
          <input type="text" name="name" placeholder="Name" required>
          <input type="email" name="email" placeholder="Email" required>
          <textarea name="message" placeholder="Message" required></textarea>
          <button class="btn primary" type="submit">Send Message</button>
        </form>

        <div class="contact-info reveal">
          <h3>Connect With Me</h3>

          <div class="socials">
            <a href="https://github.com/" target="_blank" rel="noopener" aria-label="GitHub">
              <i class="devicon-github-original"></i>
            </a>
            <a href="https://www.linkedin.com/" target="_blank" rel="noopener" aria-label="LinkedIn">
              <i class="devicon-linkedin-plain"></i>
            </a>
          </div>

          <div class="contact-details">
            <p>Location: Kerala, India</p>
            <p>Open to software, Android and AI opportunities.</p>
          </div>
        </div>

      </div>
    </section>

    <footer>
      © 2026 Nithin Prasad.
    </footer>

  </main>

  <script>
    /*
      OPENING SCREEN:
      The main portfolio remains hidden until See Portfolio is clicked.
    */
    const intro = document.getElementById("intro");
    const portfolio = document.getElementById("portfolio");
    const seePortfolio = document.getElementById("seePortfolio");

    seePortfolio.addEventListener("click", () => {
      intro.classList.add("hide");
      portfolio.classList.add("show");

      // Start the page at the top of the actual portfolio.
      window.scrollTo({ top: 0, behavior: "instant" });

      setTimeout(() => {
        document.querySelector("#about")?.focus?.();
      }, 50);
    });

    /*
      ROLE ROTATION
    */
    const roles = [
      "Assistant Systems Engineer",
      "Android App Developer",
      "AI / Software Developer"
    ];

    const roleText = document.getElementById("roleText");
    let roleIndex = 0;

    setInterval(() => {
      roleIndex = (roleIndex + 1) % roles.length;

      roleText.style.opacity = "0";
      roleText.style.transform = "translateY(7px)";

      setTimeout(() => {
        roleText.textContent = roles[roleIndex];
        roleText.style.transition = "opacity .35s ease, transform .35s ease";
        roleText.style.opacity = "1";
        roleText.style.transform = "translateY(0)";
      }, 220);
    }, 3200);

    /*
      SCROLL REVEAL
    */
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
        }
      });
    }, { threshold: 0.12 });

    document.querySelectorAll(".reveal").forEach(el => observer.observe(el));

    /*
      ACTIVE NAVIGATION
    */
    const navLinks = document.querySelectorAll(".nav a");
    const sections = document.querySelectorAll("main section[id]");

    const navObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          navLinks.forEach(link => link.classList.remove("active"));
          const active = document.querySelector(`.nav a[href="#${entry.target.id}"]`);
          if (active) active.classList.add("active");
        }
      });
    }, {
      rootMargin: "-35% 0px -55% 0px"
    });

    sections.forEach(section => navObserver.observe(section));
  </script>

</body>
</html>

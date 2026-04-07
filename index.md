---
layout: null
---

<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Nithin Prasad | Systems Engineer</title>
    <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;0,900;1,400;1,700&family=DM+Mono:ital,wght@0,300;0,400;1,300&family=Outfit:wght@300;400;500&display=swap" rel="stylesheet">
    <style>
        :root {
            --bg: #0a0a0f;
            --surface: #12121a;
            --surface2: #1a1a26;
            --gold: #c9a84c;
            --gold-light: #e8c96d;
            --gold-dim: rgba(201, 168, 76, 0.15);
            --gold-border: rgba(201, 168, 76, 0.25);
            --text: #f0ece0;
            --muted: #8a8478;
            --subtle: #3a3830;
        }

        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        html { scroll-behavior: smooth; }

        body {
            background: var(--bg);
            color: var(--text);
            font-family: 'Outfit', sans-serif;
            font-weight: 300;
            overflow-x: hidden;
            cursor: none;
        }

        /* Custom cursor */
        .cursor {
            width: 8px; height: 8px;
            background: var(--gold);
            border-radius: 50%;
            position: fixed;
            top: 0; left: 0;
            pointer-events: none;
            z-index: 9999;
            transition: transform 0.15s ease;
        }
        .cursor-ring {
            width: 36px; height: 36px;
            border: 1px solid rgba(201, 168, 76, 0.5);
            border-radius: 50%;
            position: fixed;
            top: 0; left: 0;
            pointer-events: none;
            z-index: 9998;
            transition: transform 0.4s cubic-bezier(0.23, 1, 0.32, 1), width 0.3s, height 0.3s, opacity 0.3s;
        }
        .cursor-ring.hovered { width: 60px; height: 60px; opacity: 0.6; }

        /* Noise overlay */
        body::before {
            content: '';
            position: fixed;
            inset: 0;
            background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.035'/%3E%3C/svg%3E");
            pointer-events: none;
            z-index: 1;
            opacity: 0.4;
        }

        #bg-canvas {
            position: fixed;
            inset: 0;
            z-index: 0;
            pointer-events: none;
        }

        .page-wrap {
            position: relative;
            z-index: 2;
            max-width: 1100px;
            margin: 0 auto;
            padding: 0 40px;
        }

        /* HEADER */
        header {
            min-height: 100vh;
            display: flex;
            flex-direction: column;
            justify-content: center;
            padding: 80px 0 60px;
            position: relative;
        }

        .eyebrow {
            font-family: 'DM Mono', monospace;
            font-size: 0.72rem;
            letter-spacing: 5px;
            color: var(--gold);
            text-transform: uppercase;
            display: flex;
            align-items: center;
            gap: 16px;
            margin-bottom: 32px;
            opacity: 0;
            transform: translateY(20px);
            animation: fadeUp 0.8s forwards 0.2s;
        }
        .eyebrow::before {
            content: '';
            display: block;
            width: 40px;
            height: 1px;
            background: var(--gold);
        }

        .pulse-dot {
            width: 6px; height: 6px;
            background: var(--gold);
            border-radius: 50%;
            display: inline-block;
            animation: pulse 2s ease-in-out infinite;
        }

        h1.name {
            font-family: 'Playfair Display', serif;
            font-size: clamp(4rem, 12vw, 9rem);
            font-weight: 900;
            line-height: 0.88;
            letter-spacing: -3px;
            color: var(--text);
            margin-bottom: 40px;
            opacity: 0;
            transform: translateY(30px);
            animation: fadeUp 1s forwards 0.4s;
        }
        h1.name em {
            font-style: italic;
            color: var(--gold-light);
        }

        .bio {
            max-width: 520px;
            font-size: 1.05rem;
            color: var(--muted);
            line-height: 1.8;
            font-weight: 300;
            border-left: 1px solid var(--gold-border);
            padding-left: 24px;
            opacity: 0;
            transform: translateY(20px);
            animation: fadeUp 0.9s forwards 0.65s;
        }

        .scroll-hint {
            position: absolute;
            bottom: 40px;
            left: 0;
            font-family: 'DM Mono', monospace;
            font-size: 0.68rem;
            color: var(--subtle);
            letter-spacing: 3px;
            text-transform: uppercase;
            display: flex;
            align-items: center;
            gap: 12px;
            opacity: 0;
            animation: fadeUp 0.8s forwards 1.2s;
        }
        .scroll-line {
            width: 50px;
            height: 1px;
            background: var(--subtle);
            position: relative;
            overflow: hidden;
        }
        .scroll-line::after {
            content: '';
            position: absolute;
            top: 0; left: -100%;
            width: 100%; height: 100%;
            background: var(--gold);
            animation: scanline 2s linear infinite 1.5s;
        }

        .section { padding: 120px 0; }

        .section-header {
            display: flex;
            align-items: center;
            gap: 24px;
            margin-bottom: 64px;
        }
        .section-num {
            font-family: 'DM Mono', monospace;
            font-size: 0.68rem;
            color: var(--gold);
            letter-spacing: 3px;
        }
        .section-title {
            font-family: 'Playfair Display', serif;
            font-size: clamp(1.8rem, 4vw, 2.8rem);
            font-weight: 700;
            color: var(--text);
            letter-spacing: -1px;
        }
        .section-rule {
            flex: 1;
            height: 1px;
            background: linear-gradient(to right, var(--gold-border), transparent);
        }

        .projects-grid {
            display: grid;
            grid-template-columns: repeat(2, 1fr);
            gap: 1px;
            background: var(--subtle);
            border: 1px solid var(--subtle);
        }

        .project-card {
            background: var(--surface);
            padding: 40px;
            transition: background 0.4s ease;
            position: relative;
            overflow: hidden;
        }
        .project-card::before {
            content: '';
            position: absolute;
            top: 0; left: 0;
            width: 100%; height: 2px;
            background: var(--gold);
            transform: scaleX(0);
            transform-origin: left;
            transition: transform 0.5s cubic-bezier(0.16, 1, 0.3, 1);
        }
        .project-card:hover { background: var(--surface2); }
        .project-card:hover::before { transform: scaleX(1); }

        .project-idx {
            font-family: 'DM Mono', monospace;
            font-size: 0.65rem;
            color: var(--gold);
            letter-spacing: 3px;
            margin-bottom: 20px;
            display: block;
        }

        .project-card h3 {
            font-family: 'Playfair Display', serif;
            font-size: 1.55rem;
            font-weight: 700;
            color: var(--text);
            margin-bottom: 14px;
            letter-spacing: -0.5px;
        }

        .project-card p {
            font-size: 0.9rem;
            color: var(--muted);
            line-height: 1.7;
            margin-bottom: 28px;
        }

        .tags {
            display: flex;
            flex-wrap: wrap;
            gap: 8px;
        }
        .tags span {
            font-family: 'DM Mono', monospace;
            font-size: 0.65rem;
            color: var(--gold);
            border: 1px solid var(--gold-border);
            padding: 3px 10px;
            letter-spacing: 1px;
        }

        .timeline { display: flex; flex-direction: column; }

        .timeline-item {
            display: grid;
            grid-template-columns: 180px 1fr;
            gap: 40px;
            padding: 40px 0;
            border-bottom: 1px solid var(--subtle);
            position: relative;
            transition: padding-left 0.3s ease;
        }
        .timeline-item:hover { padding-left: 12px; }
        .timeline-item::before {
            content: '';
            position: absolute;
            left: -1px; top: 0; bottom: 0;
            width: 1px;
            background: transparent;
            transition: background 0.3s;
        }
        .timeline-item:hover::before { background: var(--gold); }

        .timeline-meta {
            text-align: right;
            padding-top: 4px;
        }
        .timeline-date {
            font-family: 'DM Mono', monospace;
            font-size: 0.7rem;
            color: var(--gold);
            letter-spacing: 2px;
            display: block;
            margin-bottom: 6px;
        }
        .timeline-cat {
            font-family: 'DM Mono', monospace;
            font-size: 0.65rem;
            color: var(--subtle);
            letter-spacing: 1px;
        }

        .timeline-content h4 {
            font-family: 'Playfair Display', serif;
            font-size: 1.3rem;
            font-weight: 700;
            color: var(--text);
            margin-bottom: 10px;
            letter-spacing: -0.3px;
        }
        .timeline-content p {
            font-size: 0.9rem;
            color: var(--muted);
            line-height: 1.7;
        }
        .timeline-content .sub {
            font-family: 'DM Mono', monospace;
            font-size: 0.7rem;
            color: var(--subtle);
            margin-top: 6px;
            letter-spacing: 1px;
        }

        .gpa {
            display: inline-block;
            margin-top: 10px;
            font-family: 'DM Mono', monospace;
            font-size: 0.68rem;
            color: var(--gold);
            border: 1px solid var(--gold-border);
            padding: 2px 10px;
            letter-spacing: 2px;
        }

        .cta-wrap { margin-top: 80px; }

        .btn {
            display: inline-block;
            padding: 18px 52px;
            font-family: 'DM Mono', monospace;
            font-size: 0.8rem;
            letter-spacing: 3px;
            text-transform: uppercase;
            color: var(--gold);
            border: 1px solid var(--gold-border);
            text-decoration: none;
            position: relative;
            overflow: hidden;
            transition: color 0.5s ease;
            background: transparent;
        }
        .btn::before {
            content: '';
            position: absolute;
            inset: 0;
            background: var(--gold);
            transform: translateX(-101%);
            transition: transform 0.5s cubic-bezier(0.16, 1, 0.3, 1);
            z-index: -1;
        }
        .btn:hover { color: var(--bg); }
        .btn:hover::before { transform: translateX(0); }

        footer {
            margin-top: 120px;
            padding: 40px 0;
            border-top: 1px solid var(--subtle);
            display: flex;
            justify-content: space-between;
            align-items: center;
        }
        footer span {
            font-family: 'DM Mono', monospace;
            font-size: 0.65rem;
            color: var(--subtle);
            letter-spacing: 2px;
        }
        footer .dot { color: var(--gold); }

        .reveal {
            opacity: 0;
            transform: translateY(40px);
            transition: opacity 0.9s cubic-bezier(0.16, 1, 0.3, 1), transform 0.9s cubic-bezier(0.16, 1, 0.3, 1);
        }
        .reveal.visible { opacity: 1; transform: translateY(0); }
        .reveal-delay-1 { transition-delay: 0.1s; }
        .reveal-delay-2 { transition-delay: 0.2s; }
        .reveal-delay-3 { transition-delay: 0.3s; }
        .reveal-delay-4 { transition-delay: 0.4s; }

        @keyframes fadeUp {
            to { opacity: 1; transform: translateY(0); }
        }
        @keyframes pulse {
            0%, 100% { opacity: 1; transform: scale(1); }
            50% { opacity: 0.4; transform: scale(0.7); }
        }
        @keyframes scanline {
            to { left: 100%; }
        }

        @media (max-width: 700px) {
            .page-wrap { padding: 0 24px; }
            .projects-grid { grid-template-columns: 1fr; }
            .timeline-item { grid-template-columns: 1fr; gap: 8px; }
            .timeline-meta { text-align: left; }
            footer { flex-direction: column; gap: 12px; text-align: center; }
        }
    </style>
</head>
<body>
    <div class="cursor" id="cursor"></div>
    <div class="cursor-ring" id="cursor-ring"></div>
    <canvas id="bg-canvas"></canvas>

    <div class="page-wrap">
        <header>
            <div class="eyebrow">
                <span class="pulse-dot"></span>
                <span>Systems Engineer &nbsp;·&nbsp; MCA Candidate</span>
            </div>
            <h1 class="name">Nithin<br><em>Prasad.</em></h1>
            <p class="bio">
                Ambitious software developer proficient in Python and AI-driven automation, with a focus on autonomous data systems and national-level technical leadership.
            </p>
            <div class="scroll-hint">
                <div class="scroll-line"></div>
                Scroll to explore
            </div>
        </header>

        <section class="section">
            <div class="section-header reveal">
                <span class="section-num">01</span>
                <h2 class="section-title">Selected Projects</h2>
                <div class="section-rule"></div>
            </div>
            <div class="projects-grid">
                <div class="project-card reveal reveal-delay-1">
                    <span class="project-idx">PRJ — 001</span>
                    <h3>Insight Gen</h3>
                    <p>Agentic AI platform designed for autonomous data analysis and professional report generation from natural language queries.</p>
                    <div class="tags"><span>Python</span><span>CrewAI</span><span>Streamlit</span><span>Pandas</span></div>
                </div>
                <div class="project-card reveal reveal-delay-2">
                    <span class="project-idx">PRJ — 002</span>
                    <h3>Revo</h3>
                    <p>Social news Android application featuring advanced content rating systems and real-time community discussions.</p>
                    <div class="tags"><span>Java</span><span>Android</span><span>Firebase</span></div>
                </div>
                <div class="project-card reveal reveal-delay-3">
                    <span class="project-idx">PRJ — 003</span>
                    <h3>PROFEXIA</h3>
                    <p>Web-based skill-barter application built for community-driven exchange without financial dependency.</p>
                    <div class="tags"><span>Django</span><span>Python</span><span>SQL</span></div>
                </div>
                <div class="project-card reveal reveal-delay-4">
                    <span class="project-idx">PRJ — 004</span>
                    <h3>Vaccination Manager</h3>
                    <p>Management system to streamline child vaccination tracking and automated notification schedules.</p>
                    <div class="tags"><span>JavaScript</span><span>HTML5</span><span>SQL</span></div>
                </div>
            </div>
        </section>

        <section class="section">
            <div class="section-header reveal">
                <span class="section-num">02</span>
                <h2 class="section-title">Leadership</h2>
                <div class="section-rule"></div>
            </div>
            <div class="timeline">
                <div class="timeline-item reveal">
                    <div class="timeline-meta">
                        <span class="timeline-date">Mar 2026</span>
                        <span class="timeline-cat">Hackathon</span>
                    </div>
                    <div class="timeline-content">
                        <h4>Main Coordinator — Hackastra 2026</h4>
                        <p>Directed end-to-end execution of a 19-hour hackathon themed "Design for Human Weakness".</p>
                    </div>
                </div>
                <div class="timeline-item reveal reveal-delay-1">
                    <div class="timeline-meta">
                        <span class="timeline-date">Oct 2025</span>
                        <span class="timeline-cat">Dept Level</span>
                    </div>
                    <div class="timeline-content">
                        <h4>Main Coordinator — Pragyan Tech Fest</h4>
                        <p>Led strategic planning, sponsorship acquisition, and execution for the departmental technical festival.</p>
                    </div>
                </div>
                <div class="timeline-item reveal reveal-delay-2">
                    <div class="timeline-meta">
                        <span class="timeline-date">Apr 2025–26</span>
                        <span class="timeline-cat">Ongoing</span>
                    </div>
                    <div class="timeline-content">
                        <h4>MCA Representative — CSI SB ASIET</h4>
                        <p>Coordinating technical symposiums and department workshops for the Computer Society of India.</p>
                    </div>
                </div>
            </div>
        </section>

        <section class="section">
            <div class="section-header reveal">
                <span class="section-num">03</span>
                <h2 class="section-title">Education</h2>
                <div class="section-rule"></div>
            </div>
            <div class="timeline">
                <div class="timeline-item reveal">
                    <div class="timeline-meta">
                        <span class="timeline-date">2024 – Present</span>
                        <span class="timeline-cat">Postgraduate</span>
                    </div>
                    <div class="timeline-content">
                        <h4>Master of Computer Applications</h4>
                        <p class="sub">Adi Shankara Institute of Engineering and Technology, Kalady</p>
                        <span class="gpa">GPA &nbsp;7.9</span>
                    </div>
                </div>
                <div class="timeline-item reveal reveal-delay-1">
                    <div class="timeline-meta">
                        <span class="timeline-date">2021 – 2024</span>
                        <span class="timeline-cat">Undergraduate</span>
                    </div>
                    <div class="timeline-content">
                        <h4>Bachelor of Computer Applications</h4>
                        <p class="sub">DePaul Institute of Science and Technology, Angamaly</p>
                        <span class="gpa">GPA &nbsp;6.7</span>
                    </div>
                </div>
            </div>
        </section>

        <div class="cta-wrap reveal">
            <a href="#" class="btn">Download Résumé</a>
        </div>

        <footer>
            <span>Nithin Prasad <span class="dot">·</span> 2026</span>
            <span>Build <span class="dot">//</span> Successful</span>
        </footer>
    </div>

    <script>
        const cursor = document.getElementById('cursor');
        const ring = document.getElementById('cursor-ring');
        let mx = 0, my = 0, rx = 0, ry = 0;

        document.addEventListener('mousemove', e => {
            mx = e.clientX; my = e.clientY;
            cursor.style.transform = `translate(${mx - 4}px, ${my - 4}px)`;
        });

        function lerpCursor() {
            rx += (mx - rx) * 0.12;
            ry += (my - ry) * 0.12;
            ring.style.transform = `translate(${rx - 18}px, ${ry - 18}px)`;
            requestAnimationFrame(lerpCursor);
        }
        lerpCursor();

        document.querySelectorAll('a, .project-card, .timeline-item, .btn').forEach(el => {
            el.addEventListener('mouseenter', () => ring.classList.add('hovered'));
            el.addEventListener('mouseleave', () => ring.classList.remove('hovered'));
        });

        const canvas = document.getElementById('bg-canvas');
        const ctx = canvas.getContext('2d');
        let orbs = [];

        function initCanvas() {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
            orbs = Array.from({ length: 5 }, () => ({
                x: Math.random() * canvas.width,
                y: Math.random() * canvas.height,
                r: 200 + Math.random() * 300,
                vx: (Math.random() - 0.5) * 0.18,
                vy: (Math.random() - 0.5) * 0.18,
                alpha: 0.03 + Math.random() * 0.04
            }));
        }

        function drawCanvas() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            orbs.forEach(o => {
                o.x += o.vx; o.y += o.vy;
                if (o.x < -o.r) o.x = canvas.width + o.r;
                if (o.x > canvas.width + o.r) o.x = -o.r;
                if (o.y < -o.r) o.y = canvas.height + o.r;
                if (o.y > canvas.height + o.r) o.y = -o.r;

                const g = ctx.createRadialGradient(o.x, o.y, 0, o.x, o.y, o.r);
                g.addColorStop(0, `rgba(201,168,76,${o.alpha})`);
                g.addColorStop(1, 'transparent');
                ctx.fillStyle = g;
                ctx.beginPath();
                ctx.arc(o.x, o.y, o.r, 0, Math.PI * 2);
                ctx.fill();
            });

            ctx.strokeStyle = 'rgba(201,168,76,0.025)';
            ctx.lineWidth = 0.5;
            const step = 80;
            for (let x = 0; x < canvas.width; x += step) {
                ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, canvas.height); ctx.stroke();
            }
            for (let y = 0; y < canvas.height; y += step) {
                ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(canvas.width, y); ctx.stroke();
            }
            requestAnimationFrame(drawCanvas);
        }

        window.addEventListener('resize', initCanvas);
        initCanvas();
        drawCanvas();

        const revealEls = document.querySelectorAll('.reveal');
        const observer = new IntersectionObserver(entries => {
            entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible'); });
        }, { threshold: 0.12 });
        revealEls.forEach(el => observer.observe(el));
    </script>
</body>
</html>

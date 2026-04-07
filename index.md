---
layout: null
---
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Nithin Prasad | Systems Engineer</title>
    <link href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@300;500;700&family=JetBrains+Mono:wght@400&display=swap" rel="stylesheet">
    <style>
        :root { 
            --bg: #020617; 
            --accent: #22d3ee; /* Cyan-400 */
            --text: #f1f5f9;
            --secondary: #94a3b8;
            --card-bg: rgba(15, 23, 42, 0.7);
            --border: rgba(34, 211, 238, 0.2);
        }

        body, html { 
            margin: 0; 
            padding: 0; 
            background: var(--bg); 
            color: var(--text); 
            font-family: 'Space Grotesk', sans-serif; 
            overflow-x: hidden;
            scroll-behavior: smooth;
        }

        /* Interactive Canvas Background */
        #bg-canvas { 
            position: fixed; 
            top: 0; 
            left: 0; 
            z-index: -1; 
            pointer-events: none;
        }

        .container { max-width: 900px; margin: 0 auto; padding: 80px 24px; position: relative; }

        header { margin-bottom: 80px; }
        .label { font-family: 'JetBrains Mono', monospace; color: var(--accent); font-size: 0.8rem; letter-spacing: 4px; display: block; margin-bottom: 15px; }
        h1 { font-size: clamp(3rem, 10vw, 5.5rem); margin: 0; font-weight: 700; letter-spacing: -4px; line-height: 0.9; }
        .bio { max-width: 650px; font-size: 1.15rem; color: var(--secondary); margin-top: 30px; border-left: 3px solid var(--accent); padding-left: 20px; line-height: 1.6; }

        /* Project Grid */
        .grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 20px; margin-top: 40px; }
        .card { 
            background: var(--card-bg); 
            padding: 35px; 
            border: 1px solid var(--border); 
            backdrop-filter: blur(12px);
            border-radius: 4px;
            transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
        }
        .card:hover { 
            border-color: var(--accent); 
            transform: translateY(-8px); 
            box-shadow: 0 15px 40px rgba(34, 211, 238, 0.1); 
            background: rgba(15, 23, 42, 0.9);
        }
        .card h3 { margin: 0 0 12px 0; font-size: 1.4rem; font-weight: 700; color: #fff; }
        .card p { color: var(--secondary); font-size: 0.95rem; margin-bottom: 25px; }
        .tags { display: flex; flex-wrap: wrap; gap: 10px; font-family: 'JetBrains Mono', monospace; font-size: 0.7rem; color: var(--accent); }
        .tags span { border: 1px solid var(--border); padding: 2px 8px; border-radius: 2px; }

        /* Experience & Education sections */
        .section-label { margin-top: 100px; }
        .item { padding: 30px 0; border-bottom: 1px solid var(--border); transition: 0.3s; }
        .item:hover { background: rgba(34, 211, 238, 0.02); padding-left: 15px; }
        .item-meta { font-family: 'JetBrains Mono', monospace; font-size: 0.8rem; color: var(--accent); margin-bottom: 8px; font-weight: 500; }
        .item h4 { margin: 0; font-size: 1.25rem; font-weight: 600; color: #fff; }
        .item-desc { color: var(--secondary); font-size: 1rem; margin-top: 10px; max-width: 750px; }

        /* Responsive CTA Button */
        .btn { 
            display: inline-block; 
            margin-top: 60px; 
            padding: 20px 45px; 
            border: 1px solid var(--accent); 
            color: var(--accent); 
            text-decoration: none; 
            font-family: 'JetBrains Mono', monospace; 
            font-weight: 700; 
            font-size: 0.9rem;
            text-transform: uppercase;
            letter-spacing: 2px;
            transition: all 0.4s ease;
        }
        .btn:hover { 
            background: var(--accent); 
            color: var(--bg); 
            box-shadow: 0 0 40px var(--accent); 
            transform: scale(1.05);
        }

        footer { margin-top: 150px; padding: 60px 0; border-top: 1px solid var(--border); text-align: center; color: #334155; font-size: 0.75rem; font-family: 'JetBrains Mono', monospace; letter-spacing: 2px; }

        @media (max-width: 600px) {
            .btn { width: 100%; box-sizing: border-box; text-align: center; }
        }
    </style>
</head>
<body>
    <canvas id="bg-canvas"></canvas>

    <div class="container">
        <header>
            <span class="label">STATUS: ACTIVE // SYSTEM_OVERVIEW</span>
            <h1>Nithin Prasad</h1>
            <p class="bio">Ambitious Software Developer and MCA candidate. Proficient in Python and AI-driven automation, with a focus on autonomous data systems and national-level technical leadership.</p>
        </header>

        <span class="label section-label">VERIFIED_PROJECTS</span>
        <div class="grid">
            <div class="card">
                <h3>Insight Gen</h3>
                <p>Agentic AI platform designed for autonomous data analysis and professional report generation from natural language queries.</p>
                <div class="tags"><span>Python</span> <span>CrewAI</span> <span>Streamlit</span> <span>Pandas</span></div>
            </div>
            <div class="card">
                <h3>Revo</h3>
                <p>Social news Android application featuring advanced content rating systems and real-time community discussions.</p>
                <div class="tags"><span>Java</span> <span>Android</span> <span>Firebase</span></div>
            </div>
            <div class="card">
                <h3>PROFEXIA</h3>
                <p>Web-based skill-barter application built for community-driven exchange without financial dependency.</p>
                <div class="tags"><span>Django</span> <span>Python</span> <span>SQL</span></div>
            </div>
            <div class="card">
                <h3>Vaccination_Manager</h3>
                <p>Management system developed to streamline child vaccination tracking and automated notification schedules.</p>
                <div class="tags"><span>JavaScript</span> <span>HTML5</span> <span>SQL</span></div>
            </div>
        </div>

        <span class="label section-label">LEADERSHIP_HISTORY</span>
        <div class="item">
            <div class="item-meta">MAR 2026 // Hackathon</div>
            <h4>Main Coordinator | Hackastra 2026</h4>
            <p class="item-desc">Directed end-to-end execution of a 19-hour hackathon themed "Design for Human Weakness".</p>
        </div>
        <div class="item">
            <div class="item-meta">OCT 2025 // Dept Level</div>
            <h4>Main Coordinator | Pragyan Tech Fest</h4>
            <p class="item-desc">Led strategic planning, sponsorship acquisition, and execution for the departmental technical festival.</p>
        </div>
        <div class="item">
            <div class="item-meta">APR 2025 - APR 2026</div>
            <h4>MCA Representative | CSI SB ASIET</h4>
            <p class="item-desc">Coordinating technical symposiums and department workshops for the Computer Society of India.</p>
        </div>

        <span class="label section-label">ACADEMIC_CREDENTIALS</span>
        <div class="item">
            <div class="item-meta">2024 - PRESENT // GPA: 7.9</div>
            <h4>Master of Computer Applications</h4>
            <p class="item-sub">Adi Shankara Institute of Engineering and Technology, Kalady.</p>
        </div>
        <div class="item">
            <div class="item-meta">2021 - 2024 // GPA: 6.7</div>
            <h4>Bachelor of Computer Applications</h4>
            <p class="item-sub">DePaul Institute of Science and Technology, Angamaly.</p>
        </div>

        <a href="./assets/docs/resume_tcs.pdf" class="btn">_EXEC_DOWNLOAD_RESUME</a>

        <footer>
            NITHIN_PRASAD // 2026 // SYSTEM_BUILD_SUCCESSFUL
        </footer>
    </div>

    <script>
        const canvas = document.getElementById('bg-canvas');
        const ctx = canvas.getContext('2d');
        let points = [];
        const mouse = { x: null, y: null };

        function init() {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
            points = [];
            // Create a network of nodes
            const count = window.innerWidth < 600 ? 30 : 60;
            for (let i = 0; i < count; i++) {
                points.push({
                    x: Math.random() * canvas.width,
                    y: Math.random() * canvas.height,
                    vx: (Math.random() - 0.5) * 0.4,
                    vy: (Math.random() - 0.5) * 0.4
                });
            }
        }

        function draw() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.strokeStyle = 'rgba(34, 211, 238, 0.08)';
            ctx.lineWidth = 1;

            points.forEach(p => {
                p.x += p.vx;
                p.y += p.vy;

                // Bounce off boundaries
                if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
                if (p.y < 0 || p.y > canvas.height) p.vy *= -1;

                // Connect nearby nodes
                points.forEach(p2 => {
                    let dx = p.x - p2.x;
                    let dy = p.y - p2.y;
                    let dist = Math.sqrt(dx * dx + dy * dy);
                    if (dist < 180) {
                        ctx.beginPath();
                        ctx.moveTo(p.x, p.y);
                        ctx.lineTo(p2.x, p2.y);
                        ctx.stroke();
                    }
                });

                // Interaction with mouse
                if (mouse.x) {
                    let dx = p.x - mouse.x;
                    let dy = p.y - mouse.y;
                    let dist = Math.sqrt(dx * dx + dy * dy);
                    if (dist < 220) {
                        ctx.strokeStyle = `rgba(34, 211, 238, ${0.4 - dist / 550})`;
                        ctx.beginPath();
                        ctx.moveTo(p.x, p.y);
                        ctx.lineTo(mouse.x, mouse.y);
                        ctx.stroke();
                        ctx.strokeStyle = 'rgba(34, 211, 238, 0.08)';
                    }
                }
            });
            requestAnimationFrame(draw);
        }

        window.addEventListener('mousemove', (e) => { mouse.x = e.x; mouse.y = e.y; });
        window.addEventListener('resize', () => { init(); });
        init();
        draw();
    </script>
</body>
</html>

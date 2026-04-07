---
layout: null
---
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Nithin Prasad | Portfolio</title>
    <style>
        :root { --bg: #0f172a; --card: #1e293b; --text: #f8fafc; --accent: #38bdf8; }
        body { background: var(--bg); color: var(--text); font-family: 'Segoe UI', Tahoma, sans-serif; line-height: 1.6; margin: 0; padding: 0; }
        .container { max-width: 900px; margin: 0 auto; padding: 40px 20px; }
        
        header { border-bottom: 1px solid #334155; padding-bottom: 20px; margin-bottom: 40px; }
        h1 { font-size: 2.5rem; margin: 0; letter-spacing: -1px; }
        .subtitle { color: var(--accent); font-weight: 500; text-transform: uppercase; letter-spacing: 2px; font-size: 0.9rem; }

        .grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 20px; }
        .card { background: var(--card); padding: 25px; border-radius: 12px; border: 1px solid #334155; transition: transform 0.3s ease, border-color 0.3s ease; }
        .card:hover { transform: translateY(-5px); border-color: var(--accent); }
        .card h3 { margin-top: 0; color: var(--accent); }
        
        .tag { font-size: 0.7rem; background: #334155; padding: 3px 10px; border-radius: 4px; margin-right: 5px; color: #cbd5e1; }
        .btn { display: inline-block; margin-top: 30px; padding: 12px 25px; background: var(--accent); color: var(--bg); text-decoration: none; border-radius: 6px; font-weight: bold; transition: opacity 0.2s; }
        .btn:hover { opacity: 0.9; }

        section { margin-top: 50px; }
        h2 { border-left: 4px solid var(--accent); padding-left: 15px; font-size: 1.5rem; }
    </style>
</head>
<body>
    <div class="container">
        <header>
            <h1>Nithin Prasad</h1>
            <div class="subtitle">Master of Computer Applications | Software Engineering</div>
        </header>

        <section>
            <h2>Technical Projects</h2>
            <div class="grid">
                <div class="card">
                    <h3>InsightGen</h3>
                    <p>Agentic AI system developed for autonomous data analysis and strategic insight generation.</p>
                    <span class="tag">Python</span><span class="tag">Agentic AI</span>
                </div>
                <div class="card">
                    <h3>Design2Wear</h3>
                    <p>AI-driven costume generation platform utilizing React and Flask for seamless UI/UX.</p>
                    <span class="tag">React</span><span class="tag">Flask</span>
                </div>
                <div class="card">
                    <h3>Software Systems</h3>
                    <p>Development of Revo (Social News Android App) and PROFEXIA (Skill-sharing Platform).</p>
                    <span class="tag">Java</span><span class="tag">Android</span>
                </div>
            </div>
        </section>

        <section>
            <h2>Experience & Leadership</h2>
            <p><strong>Main Coordinator</strong> | Pragyan Tech Fest</p>
            <p><strong>MCA Student Representative</strong> | Computer Society of India (CSI)</p>
            <p><strong>Institution</strong> | Adi Shankara Institute of Engineering and Technology</p>
        </section>

        <a href="assets/docs/resume.pdf" class="btn">Download Curriculum Vitae</a>
    </div>
</body>
</html>

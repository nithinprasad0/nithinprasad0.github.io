---
layout: null
---
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Nithin Prasad | Portfolio</title>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;500;700&display=swap" rel="stylesheet">
    <style>
        :root { 
            --bg: #0f172a; 
            --card: #1e293b; 
            --text: #f8fafc; 
            --accent: #38bdf8; 
        }

        @keyframes fadeIn {
            from { opacity: 0; transform: translateY(10px); }
            to { opacity: 1; transform: translateY(0); }
        }

        body { 
            background: var(--bg); 
            color: var(--text); 
            font-family: 'Inter', sans-serif; 
            line-height: 1.6; 
            margin: 0; 
            padding: 0;
            animation: fadeIn 1.2s ease-in-out;
        }

        .container { max-width: 900px; margin: 0 auto; padding: 60px 20px; }
        
        header { border-bottom: 1px solid #334155; padding-bottom: 30px; margin-bottom: 50px; }
        h1 { font-size: 3rem; margin: 0; letter-spacing: -1.5px; font-weight: 700; }
        .subtitle { color: var(--accent); font-weight: 500; text-transform: uppercase; letter-spacing: 3px; font-size: 0.85rem; margin-top: 10px; }

        .section-title { 
            font-size: 1.2rem; 
            text-transform: uppercase; 
            letter-spacing: 2px; 
            color: #64748b; 
            margin-bottom: 30px;
            border-left: 4px solid var(--accent);
            padding-left: 15px;
        }

        .grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(350px, 1fr)); gap: 25px; }
        
        .card { 
            background: var(--card); 
            padding: 30px; 
            border-radius: 16px; 
            border: 1px solid #334155; 
            transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275); 
            cursor: default;
        }

        .card:hover { 
            transform: translateY(-8px); 
            border-color: var(--accent); 
            box-shadow: 0 10px 30px rgba(56, 189, 248, 0.15);
        }

        .card h3 { margin: 0 0 15px 0; color: #fff; font-size: 1.4rem; }
        .card p { color: #94a3b8; font-size: 0.95rem; margin-bottom: 20px; }
        
        .tag-group { display: flex; flex-wrap: wrap; gap: 8px; }
        
        .tag { 
            font-size: 0.75rem; 
            background: #0f172a; 
            padding: 4px 12px; 
            border-radius: 6px; 
            color: var(--accent); 
            border: 1px solid var(--accent);
            transition: all 0.3s ease;
        }

        .tag:hover {
            background: var(--accent);
            color: var(--bg);
            box-shadow: 0 0 10px var(--accent);
        }

        .experience-list { list-style: none; padding: 0; }
        .experience-item { margin-bottom: 20px; padding: 15px; border-radius: 8px; transition: background 0.3s; }
        .experience-item:hover { background: #1e293b; }
        .role { font-weight: 700; color: #fff; }
        .org { color: var(--accent); }

        .btn { 
            display: inline-block; 
            margin-top: 40px; 
            padding: 14px 30px; 
            background: var(--accent); 
            color: var(--bg); 
            text-decoration: none; 
            border-radius: 8px; 
            font-weight: 700; 
            transition: all 0.3s ease; 
        }

        .btn:hover { 
            opacity: 0.9; 
            transform: scale(1.02);
            box-shadow: 0 5px 15px rgba(56, 189, 248, 0.4);
        }

        footer { margin-top: 80px; padding-top: 20px; border-top: 1px solid #334155; color: #475569; font-size: 0.8rem; text-align: center; }
    </style>
</head>
<body>
    <div class="container">
        <header>
            <h1>Nithin Prasad</h1>
            <div class="subtitle">Master of Computer Applications | Software Engineering</div>
        </header>

        <section>
            <h2 class="section-title">Technical Expertise</h2>
            <div class="grid">
                <div class="card">
                    <h3>InsightGen</h3>
                    <p>An Agentic AI system engineered for autonomous data analysis and generating strategic business insights.</p>
                    <div class="tag-group">
                        <span class="tag">Python</span>
                        <span class="tag">Agentic AI</span>
                        <span class="tag">Data Analysis</span>
                    </div>
                </div>

                <div class="card">
                    <h3>Revo</h3>
                    <p>A high-performance social news Android application focusing on real-time information delivery and user engagement.</p>
                    <div class="tag-group">
                        <span class="tag">Android</span>
                        <span class="tag">Java</span>
                        <span class="tag">Mobile Development</span>
                    </div>
                </div>

                <div class="card">
                    <h3>PROFEXIA</h3>
                    <p>A comprehensive web-based platform designed to facilitate skill-sharing and professional networking.</p>
                    <div class="tag-group">
                        <span class="tag">Web Development</span>
                        <span class="tag">Skill-Sharing</span>
                        <span class="tag">UI/UX</span>
                    </div>
                </div>
            </div>
        </section>

        <section>
            <h2 class="section-title">Leadership & Engagement</h2>
            <div class="experience-list">
                <div class="experience-item">
                    <span class="role">Main Coordinator</span> — <span class="org">Pragyan Tech Fest</span>
                </div>
                <div class="experience-item">
                    <span class="role">MCA Student Representative</span> — <span class="org">Computer Society of India (CSI)</span>
                </div>
                <div class="experience-item">
                    <span class="role">Institution</span> — <span class="org">Adi Shankara Institute of Engineering and Technology</span>
                </div>
            </div>
        </section>

        <a href="./assets/docs/resume.pdf" class="btn">View Curriculum Vitae</a>

        <footer>
            &copy; 2026 Nithin Prasad. Built from scratch with HTML and CSS.
        </footer>
    </div>
</body>
</html>

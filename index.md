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
            --border: #334155;
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
        
        header { border-bottom: 1px solid var(--border); padding-bottom: 30px; margin-bottom: 50px; }
        h1 { font-size: 3rem; margin: 0; letter-spacing: -1.5px; font-weight: 700; }
        .subtitle { color: var(--accent); font-weight: 500; text-transform: uppercase; letter-spacing: 3px; font-size: 0.85rem; margin-top: 10px; }

        .section-title { 
            font-size: 1rem; 
            text-transform: uppercase; 
            letter-spacing: 3px; 
            color: #64748b; 
            margin: 60px 0 30px 0;
            display: flex;
            align-items: center;
        }

        .section-title::after {
            content: "";
            flex: 1;
            height: 1px;
            background: var(--border);
            margin-left: 20px;
        }

        /* Interactive Bento Grid */
        .grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(350px, 1fr)); gap: 25px; }
        
        .card { 
            background: var(--card); 
            padding: 30px; 
            border-radius: 16px; 
            border: 1px solid var(--border); 
            transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275); 
        }

        .card:hover { 
            transform: translateY(-8px); 
            border-color: var(--accent); 
            box-shadow: 0 10px 30px rgba(56, 189, 248, 0.1);
        }

        .card h3 { margin: 0 0 10px 0; color: #fff; }
        .card p { color: #94a3b8; font-size: 0.95rem; margin-bottom: 20px; }
        
        /* Skill Tags */
        .tag-group { display: flex; flex-wrap: wrap; gap: 8px; }
        .tag { 
            font-size: 0.7rem; 
            background: rgba(56, 189, 248, 0.1); 
            padding: 4px 12px; 
            border-radius: 6px; 
            color: var(--accent); 
            border: 1px solid rgba(56, 189, 248, 0.2);
            transition: all 0.3s ease;
        }

        .tag:hover {
            background: var(--accent);
            color: var(--bg);
        }

        /* Experience/Education List */
        .timeline-item { 
            margin-bottom: 30px; 
            padding-left: 20px; 
            border-left: 2px solid var(--border);
            transition: border-color 0.3s;
        }
        .timeline-item:hover { border-color: var(--accent); }
        .timeline-item h4 { margin: 0; color: #fff; font-size: 1.1rem; }
        .timeline-meta { color: var(--accent); font-size: 0.85rem; font-weight: 500; margin-bottom: 5px; }
        .timeline-desc { color: #94a3b8; font-size: 0.9rem; }

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
            transform: scale(1.05);
            box-shadow: 0 5px 15px rgba(56, 189, 248, 0.3);
        }

        footer { margin-top: 100px; padding: 40px 0; border-top: 1px solid var(--border); color: #475569; font-size: 0.75rem; text-align: center; }
    </style>
</head>
<body>
    <div class="container">
        <header>
            <h1>Nithin Prasad</h1>
            <div class="subtitle">Master of Computer Applications | Software Engineering</div>
        </header>

        <h2 class="section-title">Core Projects</h2>
        <div class="grid">
            <div class="card">
                <h3>InsightGen</h3>
                <p>An Agentic AI system built to automate complex data analysis tasks and generate actionable business insights.</p>
                <div class="tag-group">
                    <span class="tag">Python</span>
                    <span class="tag">Agentic AI</span>
                    <span class="tag">LLM</span>
                </div>
            </div>

            <div class="card">
                <h3>Revo</h3>
                <p>Social news Android application developed to provide real-time updates with a focus on optimized user experience.</p>
                <div class="tag-group">
                    <span class="tag">Java</span>
                    <span class="tag">Android</span>
                    <span class="tag">Firebase</span>
                </div>
            </div>
        </div>

        <h2 class="section-title">Professional Experience</h2>
        <div class="timeline-item">
            <div class="timeline-meta">Main Coordinator | 2025 - 2026</div>
            <h4>Pragyan Tech Fest</h4>
            <p class="timeline-desc">Leading event management, technical coordination, and strategic planning for the institute's flagship tech fest.</p>
        </div>

        <div class="timeline-item">
            <div class="timeline-meta">Student Representative | 2024 - 2026</div>
            <h4>Computer Society of India (CSI)</h4>
            <p class="timeline-desc">Representing the MCA department and coordinating technical workshops and community initiatives.</p>
        </div>

        <h2 class="section-title">Academic Background</h2>
        <div class="timeline-item">
            <div class="timeline-meta">Master of Computer Applications | Current</div>
            <h4>Adi Shankara Institute of Engineering and Technology</h4>
            <p class="timeline-desc">Specializing in AI systems and modern software architecture.</p>
        </div>

        <a href="./assets/docs/resume.pdf" class="btn">Download Curriculum Vitae</a>

        <footer>
            Built by Nithin Prasad &copy; 2026. Designed for performance and clarity.
        </footer>
    </div>
</body>
</html>

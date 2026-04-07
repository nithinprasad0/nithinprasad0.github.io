---
layout: null
---
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Nithin Prasad | Software Developer</title>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;600;700&family=Fira+Code:wght@400;500&display=swap" rel="stylesheet">
    <style>
        :root { 
            --bg: #050505; 
            --card: #111111; 
            --text: #e2e8f0; 
            --accent: #00f2ff; 
            --border: #222222;
            --secondary: #94a3b8;
        }

        @keyframes slideUp {
            from { opacity: 0; transform: translateY(20px); }
            to { opacity: 1; transform: translateY(0); }
        }

        body { 
            background: var(--bg); 
            color: var(--text); 
            font-family: 'Inter', sans-serif; 
            margin: 0; 
            padding: 0;
            overflow-x: hidden;
        }

        .container { max-width: 1000px; margin: 0 auto; padding: 80px 20px; animation: slideUp 1s ease-out; }
        
        /* Header Section */
        header { margin-bottom: 80px; }
        h1 { font-size: 3.5rem; margin: 0; font-weight: 700; letter-spacing: -2px; }
        .glitch-text { color: var(--accent); font-family: 'Fira Code', monospace; font-size: 0.9rem; text-transform: uppercase; letter-spacing: 4px; display: block; margin-bottom: 10px; }
        .bio { max-width: 600px; color: var(--secondary); font-size: 1.1rem; margin-top: 20px; }

        .section-label { font-family: 'Fira Code', monospace; font-size: 0.8rem; color: #444; text-transform: uppercase; letter-spacing: 5px; margin-bottom: 40px; display: block; }

        /* Projects Grid */
        .grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 30px; }
        
        .card { 
            background: var(--card); 
            padding: 40px; 
            border-radius: 2px; 
            border: 1px solid var(--border); 
            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
            position: relative;
        }

        .card:hover { 
            border-color: var(--accent); 
            background: #161616;
            box-shadow: 0 0 40px rgba(0, 242, 255, 0.05);
        }

        .card h3 { margin: 0 0 15px 0; font-size: 1.5rem; letter-spacing: -0.5px; }
        .card p { color: var(--secondary); font-size: 0.95rem; margin-bottom: 25px; line-height: 1.7; }
        
        .tech-stack { display: flex; flex-wrap: wrap; gap: 10px; }
        .tech-pill { font-family: 'Fira Code', monospace; font-size: 0.7rem; color: var(--accent); border-bottom: 1px solid var(--accent); padding-bottom: 2px; }

        /* Education & Experience Items */
        .list-item { margin-bottom: 40px; position: relative; padding-left: 30px; }
        .list-item::before { content: ""; position: absolute; left: 0; top: 10px; width: 6px; height: 6px; background: var(--accent); border-radius: 50%; }
        .list-item h4 { margin: 0; font-size: 1.2rem; }
        .list-meta { font-size: 0.85rem; color: var(--accent); margin-bottom: 10px; font-family: 'Fira Code', monospace; }
        .list-desc { color: var(--secondary); font-size: 0.9rem; }

        .btn { 
            display: inline-block; 
            margin-top: 60px; 
            padding: 18px 40px; 
            border: 1px solid var(--accent);
            color: var(--accent); 
            text-decoration: none; 
            font-family: 'Fira Code', monospace;
            font-size: 0.9rem;
            transition: all 0.3s ease;
        }

        .btn:hover { 
            background: var(--accent);
            color: var(--bg);
            box-shadow: 0 0 20px var(--accent);
        }

        footer { margin-top: 120px; padding: 40px 0; border-top: 1px solid var(--border); text-align: center; color: #333; font-size: 0.8rem; font-family: 'Fira Code', monospace; }
    </style>
</head>
<body>
    <div class="container">
        <header>
            <span class="glitch-text">Systems Engineering</span>
            <h1>Nithin Prasad</h1>
            <p class="bio">Ambitious Software Developer proficient in Python and AI-driven automation[cite: 5]. Focused on building data-centric projects and coordinating high-impact technical events[cite: 6].</p>
        </header>

        <span class="section-label">Verified_Projects</span>
        <div class="grid">
            <div class="card">
                <h3>Insight Gen</h3>
                <p>Developed an Agentic AI Analytics platform using multi-agent orchestration for autonomous data analysis and professional reporting[cite: 33, 34].</p>
                <div class="tech-stack">
                    <span class="tech-pill">CrewAI</span>
                    <span class="tech-pill">Streamlit</span>
                    <span class="tech-pill">Pandas</span>
                    <span class="tech-pill">Plotly</span>
                </div>
            </div>

            <div class="card">
                <h3>Revo</h3>
                <p>Android application featuring content rating and insightful discussions tailored for social news delivery[cite: 40].</p>
                <div class="tech-stack">
                    <span class="tech-pill">Android</span>
                    <span class="tech-pill">Java</span>
                    <span class="tech-pill">XML</span>
                </div>
            </div>

            <div class="card">
                <h3>PROFEXIA</h3>
                <p>A web-based skill-barter application designed for community-driven skill exchange without financial dependency[cite: 35, 38].</p>
                <div class="tech-stack">
                    <span class="tech-pill">Django</span>
                    <span class="tech-pill">Python</span>
                    <span class="tech-pill">SQL</span>
                </div>
            </div>
        </div>

        <span class="section-label">Education_Path</span>
        <div class="list-item">
            <div class="list-meta">2024 - Present | GPA: 7.9</div>
            <h4>Master of Computer Applications (MCA)</h4>
            <p class="list-desc">Adi Shankara Institute of Engineering and Technology, Kalady[cite: 9, 10, 15].</p>
        </div>

        <div class="list-item">
            <div class="list-meta">2021 - 2024 | GPA: 6.7</div>
            <h4>Bachelor of Computer Applications (BCA)</h4>
            <p class="list-desc">DePaul Institute of Science and Technology, Angamaly[cite: 11, 17].</p>
        </div>

        <span class="section-label">Leadership_Roles</span>
        <div class="list-item">
            <div class="list-meta">March 2026</div>
            <h4>Main Coordinator | Hackastra 2026</h4>
            <p class="list-desc">Managed end-to-end execution of a 19-hour national-level hackathon themed "Design for Human Weakness"[cite: 47].</p>
        </div>

        <div class="list-item">
            <div class="list-meta">October 2025</div>
            <h4>Main Coordinator | Pragyan Tech Fest</h4>
            <p class="list-desc">Led strategic planning, sponsorship acquisition, and technical execution[cite: 49].</p>
        </div>

        <a href="./assets/docs/resume_tcs.pdf" class="btn">_GET_FULL_RESUME</a>

        <footer>
            Nithin Prasad // Built on GitHub Pages // Status: Available for Global Placement [cite: 7]
        </footer>
    </div>
</body>
</html>

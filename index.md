---
layout: default
title: Home
---

<style>
  :root { --accent: #00d4ff; --bg-card: #1e1e1e; }
  body { background-color: #121212; color: #e0e0e0; font-family: 'Inter', sans-serif; }
  
  .hero { padding: 60px 0; border-bottom: 1px solid #333; }
  .name-title { font-size: 2.5rem; color: #fff; margin-bottom: 5px; }
  .sub-title { color: var(--accent); font-weight: 300; letter-spacing: 1px; }

  .bento-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    gap: 20px;
    margin: 40px 0;
  }

  .bento-card {
    background: var(--bg-card);
    border: 1px solid #333;
    padding: 24px;
    border-radius: 12px;
    transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
    cursor: default;
  }

  .bento-card:hover {
    transform: translateY(-8px);
    border-color: var(--accent);
    box-shadow: 0 10px 30px rgba(0, 212, 255, 0.1);
  }

  .tech-tag {
    font-size: 0.7rem;
    border: 1px solid var(--accent);
    color: var(--accent);
    padding: 2px 10px;
    border-radius: 20px;
    margin-right: 5px;
    text-transform: uppercase;
  }

  .section-header { font-size: 1.2rem; text-transform: uppercase; letter-spacing: 2px; color: #888; margin-bottom: 20px; }
</style>

<div class="hero">
  <h1 class="name-title">Nithin Prasad</h1>
  <p class="sub-title">Master of Computer Applications | AI Systems & Software Engineering</p>
</div>

<h2 class="section-header">Technical Portfolio</h2>

<div class="bento-grid">
  <div class="bento-card">
    <h3>InsightGen</h3>
    <p>Development of an Agentic AI system for automated data analysis and decision-making workflows.</p>
    <div><span class="tech-tag">Python</span><span class="tech-tag">LLMs</span></div>
  </div>

  <div class="bento-card">
    <h3>Design2Wear</h3>
    <p>Architected an AI-driven costume generation platform with a React and Flask integration.</p>
    <div><span class="tech-tag">React</span><span class="tech-tag">Flask</span></div>
  </div>

  <div class="bento-card">
    <h3>Core Engineering</h3>
    <p>Developed Revo (Social News App) and PROFEXIA (Skill-sharing Platform).</p>
    <div><span class="tech-tag">Android</span><span class="tech-tag">Java</span></div>
  </div>
</div>

<h2 class="section-header">Leadership & Roles</h2>
<p><strong>Main Coordinator</strong> | Pragyan Tech Fest</p>
<p><strong>Student Representative</strong> | Computer Society of India (CSI)</p>

<a href="/assets/docs/resume.pdf" style="display:inline-block; margin-top:20px; color:var(--accent); text-decoration:none; border-bottom: 1px solid var(--accent);">View Full Curriculum Vitae →</a>

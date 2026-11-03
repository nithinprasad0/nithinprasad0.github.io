// Single source of truth for portfolio copy. Facts come from the original
// site and the owner's confirmed details; nothing here should be invented.

export const profile = {
  name: "Nithin Prasad",
  email: "nithinprasadmn@gmail.com",
  github: "https://github.com/nithinprasad0",
  linkedin: "https://linkedin.com/in/nithin--prasad",
  /** Incoming role — not started yet; always presented as "incoming". */
  status: "Incoming System Engineer · TCS",
  designation: "Software Developer | Mobile, Web & AI",
  bio: "Building intelligent systems, Android applications, and practical software with Python, Flutter, Firebase and AI.",
  /** From the LinkedIn profile's "Top Skills". */
  specialisation: ["Prompt Engineering", "Retrieval-Augmented Generation (RAG)", "AI Agents"],
} as const;

export const assets = {
  signature: "/assets/docs/nithin-prasad-signature.png",
  keyboard: "/assets/docs/nithin-keyboard.png",
  resume: "/assets/docs/resume.pdf",
} as const;

export const navItems = [
  { id: "about", label: "About Me" },
  { id: "experience", label: "Experience" },
  { id: "projects", label: "Projects" },
  { id: "stack", label: "Stack" },
  { id: "leadership", label: "Leadership" },
  { id: "education", label: "Education" },
  { id: "certifications", label: "Certifications" },
  { id: "contact", label: "Contact" },
] as const;

// Composed only from confirmed facts (LinkedIn profile summary, GEM
// experience, projects and education). No new claims.
export const about = {
  headline: "Practical software across mobile, web and AI.",
  paragraphs: [
    "I'm a software developer with an MCA background, building practical technology at the intersection of AI, application development and business process automation.",
    "At GEM Lubricants / GEM Group I built business websites, role-specific Android applications, Firebase-backed workflows and a Windows .NET connector for TallyPrime. My projects span AI-driven data analysis, a community app and a skill-bartering platform.",
  ],
  facts: [
    { label: "Next", value: "Incoming System Engineer", detail: "TCS" },
    { label: "Education", value: "Master of Computer Applications", detail: "Adi Shankara Institute of Engineering and Technology · 2024 – 2026" },
    { label: "Focus", value: "Prompt Engineering · RAG · AI Agents", detail: "Python, Flutter, Firebase, React, .NET" },
  ],
} as const;

/** Compact extras (LinkedIn profile). Deliberately secondary to technical skills. */
export const extras = {
  languages: [
    { name: "English", level: "Professional working" },
    { name: "Malayalam", level: "Native or bilingual" },
    { name: "Hindi", level: "Limited working" },
  ],
  // Only the title is known — no journal, date, DOI or link is shown.
  publication: "Blockchain-Based Secure Data Sharing for IoT Devices Using Smart Contracts: A Systematic Review and Taxonomy",
} as const;

export type TimelineEntry = {
  period?: string;
  org: string;
  title: string;
  points: string[];
  note?: string;
  tags?: string[];
};

export type ExperienceEntry = {
  period: string;
  org: string;
  type: string;
  title: string;
  /** One-line overview, from the LinkedIn experience entry. */
  summary: string;
  responsibilities: { area: string; text: string; links?: { label: string; href: string }[] }[];
  /** How the work was done (LinkedIn "Development approach"). */
  approach?: string;
  tags: string[];
};

// Source: LinkedIn profile (GEM Lubricants, May 2026 – October 2026).
export const experience: ExperienceEntry[] = [
  {
    period: "May – October 2026",
    org: "GEM Lubricants / GEM Group",
    type: "Freelance",
    title: "Freelance Software Developer",
    summary:
      "Digital solutions for GEM Group and its businesses, GEM Lubricants and ARK Enterprises, across Android applications, business workflow automation and website development.",
    responsibilities: [
      {
        area: "Android applications for admin and employee workflows",
        text: "Role-specific Android applications covering customer data collection, order entry, payment collection and employee activity monitoring, with employee workflows for customer orders, multi-customer navigation and collection-detail recording behind restricted administrative access.",
      },
      {
        area: "Firebase data, monitoring and routes",
        text: "Administrative features for Firebase data export, order and collection monitoring, and delivery route management, including route updates pushed to employee apps. A separate web and Android customer data collection application for a new branch, on its own Firebase project.",
      },
      {
        area: "Desktop integration with TallyPrime",
        text: "A Windows-based .NET connector that retrieves order data from Firebase and supports bill-entry workflows in TallyPrime.",
      },
      {
        area: "Business websites",
        text: "Two business websites with product information and customer enquiry workflows, built for responsive design, usability and SEO fundamentals.",
        links: [
          { label: "GEM Lubricants", href: "https://gemlubricants.co.in/" },
          { label: "ARK Enterprises", href: "https://arkenterprises.gemlubricants.co.in/" },
        ],
      },
    ],
    approach: "AI-assisted development with ChatGPT and Claude for implementation, debugging and iterative refinement.",
    tags: ["Android", "Flutter", "Dart", "Firebase", ".NET", "C#", "TallyPrime", "Web", "SEO"],
  },
];

export type Project = {
  name: string;
  /** Short typographic mark for the project cover (used until screenshots exist). */
  mark: string;
  description: string;
  tags: string[];
  /** Add a real application screenshot here (place the file in public/assets/projects/). */
  screenshot?: { src: string; alt: string; width: number; height: number };
  /** Only links that are actually public. Profexia must never get one. */
  links?: { label: string; href: string }[];
};

// Profexia's source is not public, so no project carries repo or demo links.
// No other project links have been confirmed yet either.
export const projects: Project[] = [
  {
    name: "InsightGen",
    mark: "IG",
    description:
      "AI-driven data analysis and automation platform that turns natural-language requests into analytical insights and reports.",
    tags: ["Python", "Streamlit", "OpenAI API"],
  },
  {
    name: "Revo",
    mark: "Rv",
    description:
      "Community platform with content browsing, profiles, interaction, moderation and access control, built with a Dart/Flutter frontend and Django backend.",
    tags: ["Dart", "Flutter", "Django", "Python"],
  },
  {
    name: "Profexia",
    mark: "Px",
    description:
      "Web-only skill-bartering platform connecting learners and teachers for knowledge exchange, with administration and real-time interaction features.",
    tags: ["React", "Vite", "Flask", "Python", "PyMongo", "MongoDB Atlas", "JWT", "Socket.IO", "Bcrypt"],
  },
  {
    name: "Child Vaccination Management System",
    mark: "CV",
    description:
      "System for tracking child vaccination schedules, with automated alerts and date-based scheduling logic.",
    tags: ["HTML", "CSS", "JavaScript", "SQL"],
  },
  {
    // Owner-supplied description only. No technologies confirmed yet, so no tags.
    name: "FaceAttend",
    mark: "FA",
    description:
      "Face-recognition attendance system. Liveness detection is still experimental and disabled by default.",
    tags: [],
  },
  {
    // Built only from the approved GEM Group experience details.
    name: "GEM Business Applications",
    mark: "GB",
    description:
      "A connected business application ecosystem for GEM Group: role-specific Android apps for employees and administrators, Firebase as the shared data layer for orders, collections and routes, and a Windows .NET connector that feeds Firebase order data into TallyPrime bill entry.",
    tags: ["Android", "Flutter", "Firebase", ".NET", "C#", "TallyPrime"],
  },
];

/**
 * The technology ecosystem as a graph: nodes are confirmed technologies,
 * edges are relationships that appear in the projects and experience above
 * (e.g. Dart → Flutter → Firebase at GEM Group; Flask → MongoDB, Socket.IO and
 * JWT in Profexia). Positions place each cluster in the 3D constellation.
 */
export const stackGraph = {
  nodes: [
    { id: "python", label: "Python", pos: [0, 0, 0], core: true },
    { id: "dart", label: "Dart", pos: [-2.8, 1.3, 0.4], core: true },
    { id: "csharp", label: "C#", pos: [2.9, 1.4, -0.4], core: true },
    { id: "flutter", label: "Flutter", pos: [-4.4, 2.5, 0.8] },
    { id: "firebase", label: "Firebase", pos: [-4.8, 0.2, 1.6] },
    { id: "androidstudio", label: "Android Studio", pos: [-6, 1.6, -0.8] },
    { id: "rest", label: "REST APIs", pos: [-3.2, -1.3, 2] },
    { id: "django", label: "Django", pos: [-1.4, -2.3, -1.2] },
    { id: "flask", label: "Flask", pos: [0.8, -1.8, -1.4] },
    { id: "react", label: "React", pos: [2.4, -2.4, 1.2] },
    { id: "vite", label: "Vite", pos: [3.8, -3, 0.4] },
    { id: "mongodb", label: "MongoDB", pos: [0.6, -3.7, -2.4] },
    { id: "socketio", label: "Socket.IO", pos: [2.2, -0.9, -2.8] },
    { id: "jwt", label: "JWT", pos: [-0.6, -3.6, -0.2] },
    { id: "streamlit", label: "Streamlit", pos: [-1.8, 1.9, -2.2] },
    { id: "openai", label: "OpenAI API", pos: [-0.2, 3.1, -1.8] },
    { id: "aiml", label: "AI & ML", pos: [1.3, 2.9, -0.4] },
    { id: "dotnet", label: ".NET", pos: [4.6, 2.3, -0.8] },
    { id: "tally", label: "TallyPrime", pos: [5.6, 0.6, 0.4] },
    { id: "git", label: "Git", pos: [4.4, -1.3, 2.6] },
    { id: "github", label: "GitHub", pos: [5.6, -2.1, 1.8] },
  ] as { id: string; label: string; pos: [number, number, number]; core?: boolean }[],
  edges: [
    ["dart", "flutter"], ["flutter", "firebase"], ["flutter", "androidstudio"], ["flutter", "rest"],
    ["python", "django"], ["python", "flask"], ["python", "streamlit"], ["streamlit", "openai"], ["python", "aiml"],
    ["flask", "mongodb"], ["flask", "socketio"], ["flask", "jwt"], ["react", "vite"], ["react", "flask"],
    ["csharp", "dotnet"], ["dotnet", "tally"], ["firebase", "tally"], ["git", "github"],
  ] as [string, string][],
};

/** The same relationships, written for people (the accessible HTML version). */
export const stackPathways: { title: string; chain: string[]; with: string[] }[] = [
  { title: "Mobile apps", chain: ["Dart", "Flutter", "Firebase"], with: ["REST APIs", "Android Studio", "Firebase Console"] },
  { title: "Web platforms", chain: ["Vite", "React", "Flask"], with: ["MongoDB", "Socket.IO", "JWT"] },
  { title: "Python backends", chain: ["Python", "Django"], with: ["Flask"] },
  { title: "AI & data", chain: ["Python", "Streamlit", "OpenAI API"], with: ["AI & ML"] },
  { title: "Business integration", chain: ["C#", ".NET", "TallyPrime"], with: ["Firebase"] },
  { title: "Workflow", chain: ["Git", "GitHub"], with: [] },
];

/** Simple Icons slugs for the HTML pathways (absent = text badge). */
export const stackIcons: Record<string, string> = {
  Python: "python", Dart: "dart", Flutter: "flutter", Firebase: "firebase", "Firebase Console": "firebase",
  "Android Studio": "androidstudio", React: "react", Vite: "vite", Flask: "flask", Django: "django",
  MongoDB: "mongodb", "Socket.IO": "socketdotio", Streamlit: "streamlit", ".NET": "dotnet", Git: "git", GitHub: "github",
};

export const leadership: TimelineEntry[] = [
  {
    period: "April 2025 – April 2026",
    org: "CSI Student Branch",
    title: "MCA Representative — Computer Society of India",
    points: [
      "Coordinated technical events and activities with the executive committee of the CSI student branch.",
    ],
  },
  {
    period: "2026",
    org: "Intercollege Hackathon",
    title: "Main Coordinator — Hackastra 2026",
    points: ["Led an intercollege hackathon with 60+ participants, managing technical execution."],
  },
  {
    period: "2025 – 2026",
    org: "Departmental Tech Fest",
    title: "Main Coordinator — Departmental Tech Fest",
    points: [
      "Led planning, coordination and execution of the departmental technical festival, working with student teams and organizers.",
    ],
  },
  {
    // No date on the résumé, so none is shown.
    org: "Tech Fest",
    title: "Main Coordinator — Pragyan Tech Fest",
    points: ["Managed sponsorship acquisition, strategic planning and event execution."],
  },
];

export type Certification = {
  name: string;
  issuer: string;
  /** Issue month as shown on LinkedIn. */
  issued: string;
  /** Curated priority (1 = most relevant); 1–3 and 4 are shown prominently. */
  priority: number;
  /** Only when a real, public credential URL is known. None are yet. */
  url?: string;
};

export type CertificationGroup = { title: string; items: Certification[] };

// Curated shortlist (owner's priorities); dates from the LinkedIn
// "Licenses & certifications" list. Minor fundamentals certificates stay on
// LinkedIn. No credential IDs or links are shown — no public URLs are known.
export const certificationGroups: CertificationGroup[] = [
  {
    title: "AI, RAG & Agents",
    items: [
      { name: "Master RAG: Ultimate Retrieval-Augmented Generation Course", issuer: "Udemy", issued: "Sep 2026", priority: 1 },
      { name: "Build Autonomous AI Agents From Scratch With Python", issuer: "Udemy", issued: "Sep 2026", priority: 2 },
      { name: "ChatGPT & Generative AI: Prompt Engineering for Business", issuer: "Udemy", issued: "Jan 2026", priority: 7 },
      { name: "Generative AI: Introduction and Applications", issuer: "IBM", issued: "Aug 2025", priority: 3 },
      { name: "AI For Everyone", issuer: "DeepLearning.AI", issued: "Jun 2025", priority: 8 },
    ],
  },
  {
    title: "Full-stack & Web Development",
    items: [
      { name: "Full Stack Development with Python Django", issuer: "ICT Academy of Kerala", issued: "Sep 2025", priority: 4 },
      { name: "Developing Front-End Apps with React", issuer: "IBM", issued: "Aug 2025", priority: 5 },
    ],
  },
  {
    title: "Cloud & Computing",
    items: [{ name: "Cloud Computing", issuer: "NPTEL", issued: "May 2025", priority: 6 }],
  },
];

export const education: TimelineEntry[] = [
  {
    period: "2024 – 2026",
    org: "Postgraduate",
    title: "Master of Computer Applications",
    points: ["Adi Shankara Institute of Engineering and Technology, Kalady."],
    note: "CGPA 8.3",
  },
  {
    period: "2021 – 2024",
    org: "Undergraduate",
    title: "Bachelor of Computer Applications",
    points: ["DePaul Institute of Science and Technology, Angamaly."],
    note: "CGPA 6.7",
  },
];

export const contact = {
  heading: "Let's build something useful.",
  body: "Interested in software engineering, Android development, AI-driven systems or practical full-stack applications?",
} as const;

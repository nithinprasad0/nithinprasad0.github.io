import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { CatmullRomCurve3, Vector3 } from "three";

gsap.registerPlugin(ScrollTrigger);

/**
 * The single source of truth for the 3D journey. One GSAP timeline, scrubbed
 * by one ScrollTrigger, tweens these plain numbers; scene components read them
 * every frame. No React state is touched while scrolling.
 */
export const story = {
  /** Camera target. */
  lookX: 0, lookY: 0.45, lookZ: 0,
  /**
   * Camera as an orbit around the target: azimuth (0 = in front, +z),
   * elevation and distance. Tweening these instead of a position makes every
   * move an arc around its subject rather than a straight dolly.
   */
  az: 0, el: 0.52, dist: 15.4,
  /** Lens: field of view (deg) and a slight roll for dramatic transitions. */
  fov: 32, roll: 0,
  /** Lens shift as a fraction of the viewport (moves the subject beside the text). */
  frameX: 0.2, frameY: 0,
  /** 0..1 along the signal path. */
  signal: 0,
  /** Keys pressed in sequence as the hero scrolls away. */
  keyPress: 0,
  /** About: rings align. */
  rings: 0,
  /** Experience: system links connect. */
  systems: 0,
  /** Projects: continuous index of the composition in focus (-1 = none yet). */
  project: -1,
  /** Stack: constellation assembles. */
  stack: 0,
  /** Editorial chapters: world recedes. */
  dim: 0,
  /** Contact: the loop closes on the keyboard. */
  finale: 0,
  fogFar: 42,
  /* Hand-offs between chapters (0 → 1 while travelling). */
  /** About rings open outward into the Experience network. */
  ringsOut: 0,
  /** The business system folds toward the project corridor. */
  systemsOut: 0,
  /** Each project sends a token into the constellation. */
  converge: 0,
  /** The constellation collapses to a point before the finale. */
  stackOut: 0,
  /**
   * Section-aware calm (0..1): high while a text panel is being read, low in
   * transits and showcase moments. Locally lowers the signal, glow and label
   * brightness and raises the scrim behind the text column — the 3D stays
   * expressive where there is no text to compete with.
   */
  calm: 0,
  /**
   * Environment (Phase 9): each chapter is its own place. Background/fog
   * colour, the accent the illustrations glow with, and the rim light colour,
   * all as 0..1 RGB so the timeline blends one environment into the next.
   */
  /** Contact: the route's stations light up as waypoints on the horizon. */
  horizon: 0,
  envR: 0.031, envG: 0.039, envB: 0.055,
  accR: 0.224, accG: 0.482, accB: 1,
  rimR: 0.184, rimG: 0.435, rimB: 1,
};

/** One-time camera arrival on load (not scroll-driven; finishes in ~2.6 s). */
export const intro = { t: 0 };

export type StoryKey = keyof typeof story;
type State = Partial<Record<StoryKey, number>>;

/* ------------------------------------------------------------ World layout */

export const STATION = {
  keyboard: new Vector3(0, 0, 0),
  about: new Vector3(0, 1.6, -16),
  systems: new Vector3(10, 0.2, -32),
  projectZ: (i: number) => -52 - i * 12,
  projectX: (i: number) => (i % 2 === 0 ? 2.2 : -2.2),
  stack: new Vector3(-10, 2, -132),
};

export const PROJECT_COUNT = 6;

// The signal runs low through the project corridor, beneath the camera's
// path, so it reads as a guide line rather than foreground beams.
const CORRIDOR_Y = -1.9;

// The signal: one continuous line from the keyboard through every station and
// back again — the visual thread that makes the chapters one journey.
export const SIGNAL_PATH = new CatmullRomCurve3(
  [
    [0, 0.4, -1.1],
    [0, 0.5, -5],
    [0, 1.6, -13.4],
    [0, 1.6, -18.6],
    [5, 0.8, -25],
    [10, 0.2, -32],
    [5, 0.4, -42],
    ...Array.from({ length: PROJECT_COUNT }, (_, i) => [STATION.projectX(i) * 0.35, CORRIDOR_Y, STATION.projectZ(i) + 3]),
    [-5, 1, -122],
    [-10, 2, -132],
    [-15, 7, -104],
    [-11, 11, -55],
    [-5, 5, -16],
    [-1.5, 1.6, -5],
    [0, 0.55, -1.25],
  ].map(([x, y, z]) => new Vector3(x, y, z)),
  false,
  "centripetal",
);

// Arc-length position of the point on the path closest to `p` (0..1).
function signalAt(p: Vector3) {
  let best = 0;
  let bestD = Infinity;
  const v = new Vector3();
  for (let i = 0; i <= 800; i++) {
    const u = i / 800;
    const d = SIGNAL_PATH.getPointAt(u, v).distanceToSquared(p);
    if (d < bestD) {
      bestD = d;
      best = u;
    }
  }
  return best;
}

/* -------------------------------------------------------------- Keyframes */

function docTop(el: Element) {
  return el.getBoundingClientRect().top + window.scrollY;
}

type Keyframe = { at: number; s: State; ease?: string };

/* -------------------------------------------------------------- Environments */
const rgb = (h: string) => [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16) / 255);
/** Background, accent and rim light for one chapter. */
function env(bg: string, accent: string, rim: string): State {
  const [envR, envG, envB] = rgb(bg);
  const [accR, accG, accB] = rgb(accent);
  const [rimR, rimG, rimB] = rgb(rim);
  return { envR, envG, envB, accR, accG, accB, rimR, rimG, rimB };
}
/**
 * Every chapter's light, so scrolling feels like moving between places rather
 * than down one dark page. Blue stays the hero's signature; elsewhere it is
 * one accent among several.
 */
export const ENV = {
  /** The signature workstation: obsidian and electric blue. */
  hero: env("#080a0e", "#397bff", "#2f6fff"),
  /** About: warm bronze over graphite. */
  about: env("#140f0a", "#d2a26a", "#b8834a"),
  /** Experience: brushed silver under neutral industrial light. */
  experience: env("#101215", "#c5cbd4", "#e3e9f0"),
  projects: [
    /** InsightGen: deep teal with ice highlights. */
    env("#04161a", "#a9dfff", "#2fb3c9"),
    /** Revo: rich plum and violet. */
    env("#160d1a", "#b59cf0", "#c48ad6"),
    /** Profexia: indigo in a violet atmosphere. */
    env("#0b0c22", "#7f95ff", "#a99ae8"),
    /** Child Vaccination: pearl and soft white, a restrained champagne rim. */
    env("#121416", "#eef2f6", "#d8c5a1"),
    /** FaceAttend: cool steel with precise white highlights. */
    env("#0a0e11", "#eef5fa", "#a9c6d8"),
    /** GEM: warm champagne over graphite. */
    env("#15110b", "#d8c5a1", "#c9a66b"),
  ],
  /** Stack: slate with restrained electric accents. */
  stack: env("#0c1118", "#c5cbd4", "#397bff"),
  /** Leadership → Certifications: clean neutral editorial. */
  quiet: env("#0b0b0c", "#c5cbd4", "#8f96a3"),
  /** Contact: a warm, inviting close. */
  contact: env("#150f0a", "#e0b47a", "#d89a55"),
};

/**
 * A distinct camera move per project (azimuth, elevation, distance — from
 * arrival to the end of its reading hold), so no two compositions are
 * filmed the same way.
 */
const PROJECT_SHOTS: { from: [number, number, number]; to: [number, number, number] }[] = [
  { from: [0.55, 0.28, 12.4], to: [-0.18, 0.16, 11] }, // InsightGen: sweep across the data flow
  { from: [0.1, 0.85, 11.4], to: [-0.05, 0.42, 9.8] }, // Revo: descend onto the community
  { from: [-0.8, 0.1, 11.6], to: [0.45, 0.2, 10.2] }, // Profexia: low side pass across the exchange
  { from: [0.32, 0.95, 11.4], to: [0.05, 0.62, 10.2] }, // Vaccination: overhead on the schedule
  { from: [0, 0.12, 12.4], to: [0.04, 0.14, 9.6] }, // FaceAttend: frontal push-in
  { from: [-0.5, 0.5, 16], to: [0.26, 0.34, 14.4] }, // GEM: wide establishing shot of the ecosystem
];

/** Camera framing as an orbit: target + azimuth/elevation/distance (+ lens). */
function orb(t: Vector3, az: number, el: number, dist: number, extra: State = {}): State {
  return { lookX: t.x, lookY: t.y, lookZ: t.z, az, el, dist, fov: 32, roll: 0, ...extra };
}

// Eases: calm inside a chapter, decisive acceleration/deceleration between them.
const HOLD = "sine.inOut";
const TRAVEL = "power3.inOut";

/*
 * Choreography. Each chapter has three beats — arrive (wide), orbit (closer,
 * sweeping across the subject), depart — and each journey between chapters
 * passes a "transit" beat with a wider lens and a slight roll, so moves read
 * as deliberate shots rather than a camera sliding along a diagram. All
 * values are anchored to the real scroll positions of the HTML sections and
 * scrubbed, so every move reverses exactly when scrolling back up.
 * Phones keep the subject in the upper screen (text cards scroll below).
 */
function buildKeyframes(mobile: boolean): Keyframe[] {
  const vh = window.innerHeight;
  const q = (sel: string) => document.querySelector(sel);
  const home = q("#home");
  const about = q("#about");
  const experience = q("#experience");
  const stack = q("#stack");
  const leadership = q("#leadership");
  const certifications = q("#certifications");
  const contact = q("#contact");
  const projects = Array.from(document.querySelectorAll("[data-project-index]"));
  if (!home || !about || !experience || !stack || !leadership || !certifications || !contact) return [];

  const side = (fx: number, fy = 0.22): State => (mobile ? { frameX: 0, frameY: fy } : { frameX: fx, frameY: 0 });
  const start = (el: Element) => docTop(el) - vh * 0.45;
  const end = (el: Element) => docTop(el) + (el as HTMLElement).offsetHeight - vh * 0.85;
  const sig = (p: Vector3, along = 0) => signalAt(p) + along;
  const mid = (a: number, b: number, t = 0.5) => a + (b - a) * t;
  const kf: Keyframe[] = [];
  const K = new Vector3(0, 0.45, 0);
  const A = STATION.about;
  const S = STATION.systems;
  const T = STATION.stack;

  // Hero — the keyboard; scrolling lifts the camera over it while the keys
  // "type" the signal out into the dark.
  const heroEnd = (home as HTMLElement).offsetHeight * 0.75;
  kf.push({ at: 0, s: { horizon: 0, ...ENV.hero, ...orb(K, 0, 0.5, 14.6), ...side(0.21, 0.305), ...(mobile ? {} : { frameY: 0.035 }), calm: 0, signal: 0, keyPress: 0, finale: 0, dim: 0, fogFar: 46, project: -1, rings: 0, systems: 0, stack: 0, ringsOut: 0, systemsOut: 0, converge: 0, stackOut: 0 } });
  kf.push({ at: heroEnd, ease: HOLD, s: { ...orb(new Vector3(0, 0.3, -2), 0.38, 0.9, 13), ...side(0.24, 0.2), keyPress: 1, signal: sig(new Vector3(0, 0.5, -5)) } });

  // Transit — dive low along the signal toward the rings.
  const aboutIn = start(about);
  kf.push({ at: mid(heroEnd, aboutIn), ease: TRAVEL, s: { ...orb(new Vector3(0, 1, -9), -0.22, 0.22, 9.5, { fov: 40, roll: -0.05 }), ...side(0.24), calm: 0 } });

  // About — arrive wide, sweep low across the rings as they align, settle.
  const aboutOut = end(about);
  kf.push({ at: aboutIn, ease: TRAVEL, s: { ...ENV.about, ...orb(A, 0.6, 0.32, 13.5), ...side(0.26), calm: 0.3, rings: 0, signal: sig(A) - 0.012 } });
  kf.push({ at: mid(aboutIn, aboutOut), ease: HOLD, s: { ...orb(A, -0.05, 0.12, 10.2), ...side(0.26), calm: 0.55, rings: 0.72 } });
  kf.push({ at: aboutOut, ease: HOLD, s: { ...orb(A, -0.7, 0.24, 11.6), ...side(0.26), calm: 0.55, rings: 1, ringsOut: 0, signal: sig(A) + 0.006 } });

  // Transit — the rings open outward into the network ahead; banked turn.
  const expIn = start(experience);
  kf.push({ at: mid(aboutOut, expIn), ease: TRAVEL, s: { ...orb(new Vector3(6, 1, -25), -1.1, 0.42, 12, { fov: 37, roll: 0.05 }), ...side(0.26, 0.24), calm: 0, ringsOut: 0.6 } });

  // Experience — high establishing shot, drop in as links connect, rise out.
  const expOut = end(experience);
  const SX = S.clone().add(new Vector3(1.0, 0.4, -0.6));
  kf.push({ at: expIn, ease: TRAVEL, s: { ...ENV.experience, ...orb(SX, -0.5, 0.5, 16), ...side(0.28, 0.22), calm: 0.45, systems: mobile ? 0.55 : 0, ringsOut: 1, signal: sig(S) - 0.01 } });
  kf.push({ at: mid(expIn, expOut), ease: HOLD, s: { ...orb(SX, -0.1, 0.3, 14.4), ...side(0.28, 0.22), calm: 0.7, systems: mobile ? 1 : 0.62 } });
  kf.push({ at: expOut, ease: HOLD, s: { ...orb(SX, 0.22, 0.38, 14.8), ...side(0.28, 0.22), calm: 0.7, systems: 1, systemsOut: 0, signal: sig(S) + 0.004 } });

  // Projects — each composition gets its own approach and its own orbit
  // direction, alternating sides so consecutive shots feel distinct.
  let prevOut = expOut;
  projects.forEach((el, i) => {
    const P = new Vector3(STATION.projectX(i), 0.6, STATION.projectZ(i));
    const side0 = Math.sign(P.x);
    const pin = docTop(el) - vh * 0.3;
    const pout = docTop(el) + (el as HTMLElement).offsetHeight - vh * 0.75;
    const s = sig(new Vector3(P.x * 0.35, CORRIDOR_Y, P.z + 3));
    if (i === 0) {
      kf.push({ at: mid(prevOut, pin), ease: TRAVEL, s: { ...orb(new Vector3(4, 0.6, -44), 0.9, 0.3, 9, { fov: 40, roll: -0.05 }), ...side(0.24, 0.24), calm: 0, systemsOut: 0.7 } });
    }
    // Each composition faces the corridor (rotated by -side0 * 0.3), so
    // azimuths are given relative to its front.
    const shot = PROJECT_SHOTS[i] ?? PROJECT_SHOTS[0];
    const face = -side0 * 0.3;
    // Desktop alternates sides: even projects frame the scene right of the
    // text, odd ones left of it (the card moves across), so six projects read
    // as six places rather than one repeated layout.
    const fx = i % 2 ? -0.26 : 0.26;
    kf.push({ at: pin, ease: TRAVEL, s: { ...ENV.projects[i], ...orb(P, face + shot.from[0], shot.from[1], shot.from[2]), ...side(fx, 0.24), calm: 0.3, project: i, systemsOut: 1, signal: s } });
    kf.push({ at: pout, ease: HOLD, s: { ...orb(P, face + shot.to[0], shot.to[1], shot.to[2]), ...side(fx, 0.24), calm: 0.3, project: i, signal: s + 0.004 } });
    prevOut = pout;
  });

  // Transit — pull up and back as the project tokens converge on the
  // constellation; wider lens for the reveal.
  const stackIn = start(stack);
  kf.push({ at: prevOut, ease: HOLD, s: { converge: 0 } });
  kf.push({ at: mid(prevOut, stackIn), ease: TRAVEL, s: { ...orb(new Vector3(-6, 3, -124), 1.35, 0.5, 17, { fov: 38, roll: 0.04 }), ...side(0.27, 0.2), calm: 0, converge: 0.6, project: PROJECT_COUNT } });

  // Stack — a slow orbit around the constellation while each pathway lights.
  const stackOut = end(stack);
  kf.push({ at: stackIn, ease: TRAVEL, s: { ...ENV.stack, ...orb(T, 0.85, 0.32, 21), ...side(0.28, 0.2), calm: 0.35, stack: 0, converge: 1, signal: sig(T) - 0.01 } });
  kf.push({ at: mid(stackIn, stackOut), ease: HOLD, s: { ...orb(T, 0.15, 0.18, 18.5), ...side(0.28, 0.2), calm: 0.5, stack: 0.55 } });
  kf.push({ at: stackOut, ease: HOLD, s: { ...orb(T, -0.5, 0.28, 19), ...side(0.28, 0.2), calm: 0.5, stack: 1, stackOut: 0, signal: sig(T) + 0.004 } });

  // Leadership → Certifications — calm, high overview of the whole journey
  // (the constellation has collapsed into a point of light).
  const quietIn = start(leadership);
  const quietOut = end(certifications);
  const route = new Vector3(0, 0, -62);
  kf.push({ at: quietIn, ease: TRAVEL, s: { horizon: 0, ...ENV.quiet, ...orb(route, -0.95, 1.05, 92), ...side(0.12, 0.1), calm: 0.8, dim: 0.6, fogFar: 260, stackOut: 1, signal: 0.88 } });
  kf.push({ at: quietOut, ease: HOLD, s: { ...orb(route, -0.72, 0.98, 88), ...side(0.12, 0.1), dim: 0.6, fogFar: 260, signal: 0.95 } });

  // Contact — the closing scene: the camera descends from the editorial
  // overview to a low, warm horizon over the whole route, every station seen
  // at once with the signal drawn end to end. The keyboard stays the hero's
  // alone (here it is only the first light on the horizon).
  const contactIn = docTop(contact) - vh * 0.2;
  const finale = (fy: number): State => (mobile ? { frameX: 0, frameY: 0.2 } : { frameX: 0, frameY: fy });
  kf.push({ at: contactIn, ease: TRAVEL, s: { ...ENV.contact, ...orb(route, 0.42, 0.26, 66), ...finale(0.1), calm: 0.25, dim: 0.3, fogFar: 150, signal: 1, finale: 0, keyPress: 0, horizon: 1 } });

  const max = ScrollTrigger.maxScroll(window);
  // A slow drift toward the horizon as the footer arrives.
  kf.push({ at: Math.max(max, contactIn + 1), ease: HOLD, s: { ...orb(route, 0.22, 0.2, 58), ...finale(0.16) } });

  return kf.sort((a, b) => a.at - b.at);
}

/* ------------------------------------------------------- Master timeline */

/**
 * Builds the master timeline (time unit = scroll pixels) and binds it to the
 * page with one scrubbed ScrollTrigger. Scrolling up reverses it exactly.
 * Rebuilt whenever layout changes; returns a disposer.
 */
export function bindStory(mobile: boolean): () => void {
  let tl: gsap.core.Timeline | undefined;
  let st: ScrollTrigger | undefined;

  const build = () => {
    st?.kill();
    tl?.kill();
    const frames = buildKeyframes(mobile);
    if (frames.length < 2) return;
    gsap.set(story, frames[0].s);
    tl = gsap.timeline({ paused: true, defaults: { ease: HOLD } });
    for (let i = 1; i < frames.length; i++) {
      const from = frames[i - 1];
      const to = frames[i];
      tl.to(story, { ...to.s, duration: Math.max(1, to.at - from.at), ease: to.ease ?? HOLD }, from.at);
    }
    st = ScrollTrigger.create({ start: 0, end: "max", scrub: 0.7, animation: tl });
  };

  build();
  let timer: number | undefined;
  const rebuild = () => {
    window.clearTimeout(timer);
    timer = window.setTimeout(() => {
      ScrollTrigger.refresh();
      build();
    }, 180);
  };
  const ro = new ResizeObserver(rebuild);
  ro.observe(document.body);
  document.fonts?.ready.then(rebuild);

  return () => {
    window.clearTimeout(timer);
    ro.disconnect();
    st?.kill();
    tl?.kill();
  };
}

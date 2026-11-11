import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import type { Group } from "three";
import { smooth } from "./kit";
import { story } from "./story";
import { ContactShadow, DeskSurface, LAPTOP, StillLaptop, useDisplayMaterial, useDrawnTexture, useFinishes, useProductStudio } from "./still";

/*
 * Profexia as a product still life (Phase 27): a graphite laptop on a desk,
 * seen low and nearly head-on, running the web app. The screen shows only
 * what the deployed app has screens for (see portfolio.ts): course discovery
 * by skill or teacher, course listings, enrolment and progress for a
 * learner, and the teacher workspace where skill-tagged courses are created
 * and published. Nothing suggests skill exchange, payments, live sessions or
 * code execution. Placeholder bars stand in for content; nothing is a
 * screenshot, and the scene keeps its ILLUSTRATION label.
 *
 * Scroll story (lp, reversible), in the order the project describes it: the
 * lid opens and the screen wakes on the teacher workspace → a course's
 * details and skills are filled in → the draft is published → the app moves
 * to the learner side: discovery by skill or teacher, course cards, and the
 * learner's enrolled courses and progress, which is the state held while the
 * project is read.
 */

const I = 2;
// Same timing helpers as the other compositions (ProjectGallery.tsx).
const lp = () => Math.min(2, Math.max(0, story.project - I + 1));
const phase = (a: number, b: number) => smooth((Math.min(lp(), 1) - a) / (b - a));

/** Interface states, each shown from its scroll threshold onwards. */
const STEPS = [0.28, 0.38, 0.5, 0.64, 0.74, 0.84];

/* Graphite UI with a muted periwinkle accent (Profexia's chapter) and brass. */
const C = {
  bg: "#121318",
  bar: "#17181e",
  panel: "#1c1d24",
  raised: "#252731",
  line: "#30323d",
  bars: "#4a4d5c",
  text: "#d8d6de",
  dim: "#8a8999",
  accent: "#a3ade6",
  accentDeep: "#2c3252",
  brass: "#c9a46a",
};

function rr(g: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number, fill: string | CanvasGradient) {
  g.fillStyle = fill;
  g.beginPath();
  g.roundRect(x, y, w, h, r);
  g.fill();
}
function label(g: CanvasRenderingContext2D, s: string, x: number, y: number, px: number, color: string, weight = 600) {
  g.font = `${weight} ${px}px Inter, Arial, sans-serif`;
  g.fillStyle = color;
  g.textBaseline = "middle";
  g.fillText(s, x, y);
}
const line = (g: CanvasRenderingContext2D, x: number, y: number, w: number, color = C.line, h = 7) => rr(g, x, y, w, h, h / 2, color);

function avatar(g: CanvasRenderingContext2D, x: number, y: number, r: number, tone: string) {
  g.save();
  g.beginPath();
  g.arc(x, y, r, 0, Math.PI * 2);
  g.fillStyle = C.raised;
  g.fill();
  g.clip();
  g.fillStyle = tone;
  g.beginPath();
  g.arc(x, y - r * 0.18, r * 0.38, 0, Math.PI * 2);
  g.fill();
  g.beginPath();
  g.ellipse(x, y + r * 0.78, r * 0.7, r * 0.5, 0, 0, Math.PI * 2);
  g.fill();
  g.restore();
}

function chip(g: CanvasRenderingContext2D, x: number, y: number, w: number, on = false) {
  rr(g, x, y, w, 18, 9, on ? C.accentDeep : C.raised);
  line(g, x + 9, y + 6, w - 18, on ? C.accent : C.bars, 6);
}

/** App frame: brand, the Learn / Teach switch, the signed-in user. */
function frame(g: CanvasRenderingContext2D, w: number, teach: boolean) {
  rr(g, 0, 0, w, 40, 0, C.bar);
  rr(g, 18, 12, 16, 16, 4, C.accent);
  label(g, "Profexia", 42, 20, 14, C.text, 700);
  label(g, "Learn", 160, 20, 12, teach ? C.dim : C.text, teach ? 500 : 700);
  label(g, "Teach", 214, 20, 12, teach ? C.text : C.dim, teach ? 700 : 500);
  rr(g, teach ? 214 : 160, 33, teach ? 37 : 34, 3, 1.5, C.accent);
  avatar(g, w - 30, 20, 12, "#8f8aa3");
}

const TONES = ["#2a2f45", "#33293a", "#283632"];

/** Learner side (step 1 = discovery … 3 = continue learning). */
function drawLearner(step: number, g: CanvasRenderingContext2D, w: number) {
  frame(g, w, false);
  // Discover courses by skill or teacher.
  rr(g, 18, 54, 300, 30, 15, C.panel);
  label(g, "Search by skill or teacher", 38, 69, 11, C.dim, 500);
  [62, 78, 54].forEach((cw, k) => chip(g, 332 + [0, 70, 156][k], 60, cw, k === 0));
  label(g, "Courses", 18, 104, 13, C.text, 700);
  const cardW = 132;
  [0, 1, 2].forEach((k) => {
    const x = 18 + k * (cardW + 12);
    const y = 118;
    rr(g, x, y, cardW, 176, 10, C.panel);
    const grad = g.createLinearGradient(0, y, 0, y + 70);
    grad.addColorStop(0, TONES[k]);
    grad.addColorStop(1, C.panel);
    rr(g, x, y, cardW, 70, 10, grad);
    line(g, x + 12, y + 84, cardW * 0.68, "#5a5d6d", 8);
    line(g, x + 12, y + 99, cardW * 0.46, C.line, 6);
    avatar(g, x + 22, y + 126, 10, ["#9a92ab", "#a39887", "#8fa19c"][k]);
    line(g, x + 38, y + 122, 52, C.bars, 6);
    chip(g, x + 12, y + 146, 54, k === 0);
  });
  if (step < 2) return;
  // My learning: enrolled courses and progress.
  const px = 18 + 3 * (cardW + 12);
  const pw = w - px - 18;
  rr(g, px, 104, pw, 190, 10, C.panel);
  label(g, "My learning", px + 14, 122, 12, C.text, 700);
  [0.62, 0.28].forEach((p, k) => {
    const y = 142 + k * 66;
    rr(g, px + 12, y, pw - 24, 56, 8, C.raised);
    line(g, px + 24, y + 13, pw * 0.5, "#5a5d6d", 7);
    rr(g, px + 24, y + 32, pw - 48, 6, 3, C.line);
    rr(g, px + 24, y + 32, (pw - 48) * p, 6, 3, k === 0 ? C.brass : C.accent);
  });
  if (step < 3) return;
  rr(g, 18, 310, w - 36, 72, 10, C.panel);
  label(g, "Continue learning", 32, 330, 12, C.text, 700);
  line(g, 32, 350, w * 0.42, C.bars, 7);
  rr(g, w - 128, 336, 96, 26, 13, C.accentDeep);
  label(g, "Resume", w - 104, 349, 11, C.accent, 700);
}

/** Teacher side (step 1 = courses … 3 = the draft published). */
function drawTeacher(step: number, g: CanvasRenderingContext2D, w: number) {
  frame(g, w, true);
  label(g, "Teacher workspace", 18, 66, 15, C.text, 700);
  rr(g, w - 130, 52, 112, 28, 14, C.brass);
  label(g, "New course", w - 112, 66, 11, "#15120e", 700);
  // Your courses: skill-tagged, published or draft.
  const tw = w * 0.58;
  rr(g, 18, 96, tw, 286, 10, C.panel);
  label(g, "Your courses", 32, 116, 12, C.text, 700);
  label(g, "Status", tw - 110, 116, 10, C.dim, 600);
  [0, 1, 2, 3].forEach((k) => {
    const y = 134 + k * 60;
    const draft = k === 2 && step < 3;
    rr(g, 30, y, tw - 24, 50, 8, k === 2 ? C.raised : "#20212a");
    rr(g, 42, y + 10, 30, 30, 6, TONES[k % 3]);
    line(g, 84, y + 14, tw * 0.3, "#5a5d6d", 7);
    chip(g, 84, y + 26, 50);
    rr(g, tw - 110, y + 16, 70, 20, 10, draft ? C.raised : C.accentDeep);
    label(g, draft ? "Draft" : "Published", tw - 102, y + 26, 9, draft ? C.dim : C.accent, 700);
  });
  if (step < 2) return;
  // The course being edited: details, skill tags and lessons.
  const ex = 18 + tw + 14;
  const ew = w - ex - 18;
  rr(g, ex, 96, ew, 286, 10, C.panel);
  label(g, "Course details", ex + 14, 116, 12, C.text, 700);
  rr(g, ex + 12, 132, ew - 24, 26, 6, C.raised);
  line(g, ex + 22, 142, ew * 0.55, "#5a5d6d", 7);
  label(g, "Skills", ex + 14, 176, 10, C.dim, 600);
  [46, 58].forEach((cw, k) => chip(g, ex + 12 + k * (cw + 8), 186, cw, k === 0));
  label(g, "Lessons", ex + 14, 226, 10, C.dim, 600);
  [0, 1, 2].forEach((k) => {
    const y = 238 + k * 34;
    rr(g, ex + 12, y, ew - 24, 26, 6, C.raised);
    label(g, String(k + 1), ex + 22, y + 13, 10, C.dim, 700);
    line(g, ex + 38, y + 10, ew * (0.5 - k * 0.08), C.bars, 6);
  });
  rr(g, ex + ew - 92, 346, 78, 24, 12, step >= 3 ? C.accentDeep : C.brass);
  label(g, step >= 3 ? "Published" : "Publish", ex + ew - 80, 358, 10, step >= 3 ? C.accent : "#15120e", 700);
}

/** The web app at a given step: 0 = just woken, 1–3 teacher, 4–6 learner. */
function drawApp(step: number) {
  return (g: CanvasRenderingContext2D, w: number, h: number) => {
    g.fillStyle = C.bg;
    g.fillRect(0, 0, w, h);
    if (step < 1) return;
    if (step <= 3) drawTeacher(step, g, w);
    else drawLearner(step - 3, g, w);
  };
}

const DESK_Y = -1.05;
const OPEN = -0.14; // lid a little past upright, for a low eye line
const CLOSED = Math.PI / 2;

export function ProfexiaStill({ lite }: { lite: boolean }) {
  const env = useProductStudio(lite);
  const mats = useFinishes(env, ["graphite", "glass", "keys", "well", "trackpad"] as const);
  const screenTex = useDrawnTexture(640, 400, lite ? 1.6 : 2);
  const screen = useDisplayMaterial(screenTex.texture, env);
  const lid = useRef<Group>(null);
  const shown = useRef(-1);

  useFrame(() => {
    const open = phase(0.04, 0.32);
    if (lid.current) lid.current.rotation.x = CLOSED + (OPEN - CLOSED) * open;
    screen.emissiveIntensity = phase(0.2, 0.34) * 0.95 * (1 - story.calm * 0.3);
    const p = Math.min(lp(), 1);
    let step = 0;
    while (step < STEPS.length && p >= STEPS[step]) step++;
    if (step !== shown.current) {
      shown.current = step;
      screenTex.paint(drawApp(step));
    }
  });

  return (
    <group>
      <DeskSurface y={DESK_Y} size={[9, 6.5]} env={env} color="#5d5a57" />
      <group position={[0, DESK_Y, 0.2]} rotation-y={0.22}>
        <ContactShadow position={[0, 0.002, 0]} size={[LAPTOP.w + 0.8, LAPTOP.d + 0.9]} opacity={0.75} />
        <StillLaptop body={mats.graphite} keys={mats.keys} glass={mats.glass} display={screen} lid={lid} closed={CLOSED} well={mats.well} pad={mats.trackpad} />
      </group>
    </group>
  );
}

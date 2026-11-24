import { useEffect, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import type { Group } from "three";
import { RoundedBox } from "@react-three/drei";
import { smooth } from "./kit";
import { story } from "./story";
import { ContactShadow, DeskSurface, LAPTOP, StillLaptop, useDisplayMaterial, useDrawnTexture, useStillFinishes, useStillStudio } from "./still";

/*
 * Profexia as a product still life (Phase 27; rebuilt in Phase 36 on the
 * still-life standard in still.tsx): a laptop on a desk running the web app,
 * with a closed notebook and a brass pen beside it — a study desk, not an
 * analyst's. The screen shows only what the deployed app has screens for
 * (see portfolio.ts): course discovery by skill or teacher, course cards and
 * enrolment, a learner's courses in progress, and the teacher workspace where
 * skill-tagged courses are created and published. Nothing suggests skill
 * exchange, matching, credits, payments, live sessions or code execution.
 * Course titles are sample content; there are no counts, ratings or names,
 * nothing is a screenshot, and the scene keeps its ILLUSTRATION label.
 *
 * Phase 36: lit by STILL_STUDIO with STILL_FINISH materials, the same baked
 * studio and finishes as InsightGen (no second bake). The composition is its
 * own: the laptop sits nearly square to the lens with the lid upright for the
 * low side pass, and the notebook lies at an angle in front of its left
 * corner, where InsightGen has paper sliding out to the right.
 *
 * Scroll story (lp, reversible), in the order the project describes it: the
 * lid opens and the screen wakes on the teacher workspace → a course's
 * details and skills are filled in → the draft is published → the app moves
 * to the learner side: discovery by skill, course cards, and the learner's
 * courses in progress, which is the state held while the project is read.
 */

const I = 2;
// Same timing helpers as the other compositions (ProjectGallery.tsx).
const lp = () => Math.min(2, Math.max(0, story.project - I + 1));
const phase = (a: number, b: number) => smooth((Math.min(lp(), 1) - a) / (b - a));

/** Interface states, each shown from its scroll threshold onwards. */
const STEPS = [0.28, 0.38, 0.5, 0.64, 0.74, 0.84];

/* Graphite UI; a muted lavender for the app's own accent, brass for actions. */
const C = {
  bg: "#131317",
  bar: "#1a1a1f",
  panel: "#1d1d23",
  raised: "#26262e",
  line: "#30313a",
  text: "#e4e1e8",
  dim: "#8e8c99",
  accent: "#aab1d8",
  accentDeep: "#2d3149",
  brass: "#c9a46a",
  ink: "#15120e",
};

function rr(g: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number, fill: string | CanvasGradient) {
  g.fillStyle = fill;
  g.beginPath();
  g.roundRect(x, y, w, h, r);
  g.fill();
}
function label(g: CanvasRenderingContext2D, s: string, x: number, y: number, px: number, color: string, weight = 600, align: CanvasTextAlign = "left") {
  g.font = `${weight} ${px}px Inter, Arial, sans-serif`;
  g.fillStyle = color;
  g.textAlign = align;
  g.textBaseline = "middle";
  g.fillText(s, x, y);
  g.textAlign = "left";
}
/** A pill with its text, sized to it. Returns the width. */
function pill(g: CanvasRenderingContext2D, s: string, x: number, y: number, on: boolean, px = 11) {
  g.font = `600 ${px}px Inter, Arial, sans-serif`;
  const w = g.measureText(s).width + 22;
  rr(g, x, y, w, px + 11, (px + 11) / 2, on ? C.accentDeep : C.raised);
  label(g, s, x + 11, y + (px + 11) / 2, px, on ? C.accent : C.dim, 600);
  return w;
}
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
function progress(g: CanvasRenderingContext2D, x: number, y: number, w: number, p: number, color: string) {
  rr(g, x, y, w, 6, 3, C.line);
  rr(g, x, y, w * p, 6, 3, color);
}

/** App frame: brand, the Learn / Teach switch, the signed-in user. */
function frame(g: CanvasRenderingContext2D, w: number, teach: boolean) {
  rr(g, 0, 0, w, 42, 0, C.bar);
  rr(g, 18, 13, 16, 16, 4, C.accent);
  label(g, "Profexia", 42, 21, 16, C.text, 700);
  label(g, "Learn", 168, 21, 13, teach ? C.dim : C.text, teach ? 500 : 700);
  label(g, "Teach", 226, 21, 13, teach ? C.text : C.dim, teach ? 700 : 500);
  rr(g, teach ? 226 : 168, 35, teach ? 39 : 37, 3, 1.5, C.accent);
  avatar(g, w - 31, 21, 13, "#948fa6");
}

/* Sample courses (illustrative titles; no people, counts or ratings). */
const TEACHING = [
  { title: "Intro to Python", skill: "Python" },
  { title: "Watercolour basics", skill: "Art" },
  { title: "Spanish for travel", skill: "Spanish" },
];
const FOUND = [
  { title: "Intro to Python", tone: "#2b3047" },
  { title: "Python for data", tone: "#332a3b" },
  { title: "Automating tasks", tone: "#29362f" },
];

/** Teacher side (step 1 = courses … 3 = the draft published). */
function drawTeacher(step: number, g: CanvasRenderingContext2D, w: number) {
  frame(g, w, true);
  label(g, "Teacher workspace", 18, 70, 17, C.text, 700);
  rr(g, w - 132, 55, 114, 30, 15, C.brass);
  label(g, "New course", w - 75, 70, 12, C.ink, 700, "center");
  // Your courses: skill-tagged, published or draft.
  const tw = w * 0.56;
  rr(g, 18, 100, tw, 282, 10, C.panel);
  label(g, "Your courses", 32, 122, 13, C.text, 700);
  TEACHING.forEach((c, k) => {
    const y = 142 + k * 76;
    const editing = k === 2;
    const draft = editing && step < 3;
    rr(g, 30, y, tw - 24, 66, 8, editing ? C.raised : "#212128");
    label(g, c.title, 44, y + 20, 13, C.text, 600);
    pill(g, c.skill, 44, y + 34, false, 10);
    rr(g, tw - 84, y + 21, 66, 24, 12, draft ? "#2c2c33" : C.accentDeep);
    label(g, draft ? "Draft" : "Published", tw - 51, y + 33, 10, draft ? C.dim : C.accent, 700, "center");
  });
  if (step < 2) return;
  // The course being edited: title, skill tags and lessons.
  const ex = 18 + tw + 14;
  const ew = w - ex - 18;
  rr(g, ex, 100, ew, 282, 10, C.panel);
  label(g, "Course details", ex + 14, 122, 13, C.text, 700);
  rr(g, ex + 12, 138, ew - 24, 30, 7, C.raised);
  label(g, "Spanish for travel", ex + 24, 153, 12, C.text, 600);
  label(g, "Skills", ex + 14, 186, 11, C.dim, 600);
  const sw = pill(g, "Spanish", ex + 12, 196, true, 10);
  pill(g, "Speaking", ex + 12 + sw + 6, 196, false, 10);
  label(g, "Lessons", ex + 14, 240, 11, C.dim, 600);
  ["Greetings", "Directions", "Ordering food"].forEach((s, k) => {
    const y = 252 + k * 30;
    rr(g, ex + 12, y, ew - 24, 24, 6, C.raised);
    label(g, String(k + 1), ex + 24, y + 12, 10, C.dim, 700);
    label(g, s, ex + 40, y + 12, 11, C.text, 500);
  });
  const done = step >= 3;
  rr(g, ex + ew - 98, 346, 84, 26, 13, done ? C.accentDeep : C.brass);
  label(g, done ? "Published" : "Publish", ex + ew - 56, 359, 11, done ? C.accent : C.ink, 700, "center");
}

/** Learner side (step 1 = discovery … 3 = continue learning). */
function drawLearner(step: number, g: CanvasRenderingContext2D, w: number) {
  frame(g, w, false);
  // Discover courses by skill or teacher.
  rr(g, 18, 56, 286, 32, 16, C.panel);
  label(g, "Search by skill or teacher", 38, 72, 12, C.dim, 500);
  let x = 318;
  ["Python", "Art", "Spanish"].forEach((s, k) => (x += pill(g, s, x, 61, k === 0, 11) + 8));
  label(g, "Courses", 18, 110, 14, C.text, 700);
  const cardW = 134;
  FOUND.forEach((c, k) => {
    const cx = 18 + k * (cardW + 10);
    const y = 124;
    rr(g, cx, y, cardW, 168, 10, C.panel);
    const grad = g.createLinearGradient(0, y, 0, y + 64);
    grad.addColorStop(0, c.tone);
    grad.addColorStop(1, C.panel);
    rr(g, cx, y, cardW, 64, 10, grad);
    label(g, c.title, cx + 12, y + 80, 12, C.text, 600);
    avatar(g, cx + 21, y + 106, 9, ["#9a92ab", "#a39887", "#8fa19c"][k]);
    label(g, "Teacher", cx + 36, y + 106, 11, C.dim, 500);
    rr(g, cx + 12, y + 128, 60, 24, 12, k === 0 && step >= 2 ? C.accentDeep : C.brass);
    label(g, k === 0 && step >= 2 ? "Enrolled" : "Enrol", cx + 42, y + 140, 10, k === 0 && step >= 2 ? C.accent : C.ink, 700, "center");
  });
  if (step < 2) return;
  // My learning: enrolled courses and their progress.
  const px = 18 + 3 * (cardW + 10);
  const pw = w - px - 18;
  rr(g, px, 98, pw, 194, 10, C.panel);
  label(g, "My learning", px + 14, 118, 13, C.text, 700);
  [
    ["Watercolour basics", 0.62, C.brass],
    ["Intro to Python", 0.18, C.accent],
  ].forEach(([title, p, color], k) => {
    const y = 136 + k * 74;
    rr(g, px + 12, y, pw - 24, 64, 8, C.raised);
    label(g, title as string, px + 24, y + 20, 12, C.text, 600);
    label(g, "In progress", px + 24, y + 38, 10, C.dim, 500);
    progress(g, px + 24, y + 50, pw - 48, p as number, color as string);
  });
  if (step < 3) return;
  rr(g, 18, 306, w - 36, 76, 10, C.panel);
  label(g, "Continue learning", 34, 330, 13, C.text, 700);
  label(g, "Watercolour basics", 34, 354, 12, C.dim, 500);
  rr(g, w - 132, 330, 98, 30, 15, C.brass);
  label(g, "Resume", w - 83, 345, 12, C.ink, 700, "center");
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
/** Lift on the laptop's feet: a sliver, so the contact shadow reads as contact. */
const FEET = 0.006;
const OPEN = -0.14; // lid a little past upright, for the low eye line
const CLOSED = Math.PI / 2;

/** A closed notebook (A5-like, at the laptop's scale) and a pen. */
const BOOK = { w: 1.1, d: 1.55, t: 0.085, cover: 0.014 };
const PEN = { r: 0.03, l: 1.15 };

export function ProfexiaStill({ lite }: { lite: boolean }) {
  // The same studio bake and finish set as InsightGen (still.tsx).
  const env = useStillStudio(lite);
  const mats = useStillFinishes(env, ["chassis", "bezel", "keys", "well", "trackpad", "hinge", "paper", "cover", "brass"] as const);
  const screenTex = useDrawnTexture(640, 400, lite ? 1.6 : 2);
  const screen = useDisplayMaterial(screenTex.texture, env);
  const lid = useRef<Group>(null);
  const shown = useRef(-1);
  // This scene's own instances: the low eye line sees the deck's reflection of
  // the dark back of the studio, so the anodising is a bead-blasted 0.55 here
  // (InsightGen, seen from above, keeps the shared 0.3); and the screen glass
  // reflects as restrainedly as InsightGen's.
  useEffect(() => {
    mats.chassis.roughness = 0.55;
    screen.envMapIntensity = 0.4;
  }, [mats, screen]);

  useFrame(() => {
    const open = phase(0.04, 0.32);
    if (lid.current) lid.current.rotation.x = CLOSED + (OPEN - CLOSED) * open;
    // The display wakes as the lid opens and dims a little while text is read.
    screen.emissiveIntensity = phase(0.2, 0.34) * 0.9 * (1 - story.calm * 0.3);
    const p = Math.min(lp(), 1);
    let step = 0;
    while (step < STEPS.length && p >= STEPS[step]) step++;
    if (step !== shown.current) {
      shown.current = step;
      screenTex.paint(drawApp(step));
    }
  });

  const { w: W, d: D } = LAPTOP;
  return (
    <group position={[0.3, 0, 0.05]} rotation-y={0.08}>
      <DeskSurface y={DESK_Y} size={[10, 7]} env={env} color="#675e56" roughness={0.8} envMapIntensity={0.8} />

      {/* The laptop, nearly square to the lens, on a tight contact shadow. */}
      <ContactShadow position={[0, DESK_Y + 0.002, 0.04]} size={[W + 0.5, D + 0.55]} opacity={0.85} />
      <group position={[0, DESK_Y + FEET, 0]}>
        <StillLaptop body={mats.chassis} keys={mats.keys} glass={mats.bezel} display={screen} lid={lid} closed={CLOSED} well={mats.well} pad={mats.trackpad} hinge={mats.hinge} />
      </group>

      {/* The notebook, at an angle off the laptop's front-left corner (clear of
          it, and of the scene label below), with a pen across it. */}
      <group position={[-2.25, DESK_Y, 0.75]} rotation-y={0.22}>
        <ContactShadow position={[0, 0.002, 0]} size={[BOOK.w + 0.3, BOOK.d + 0.3]} opacity={0.7} />
        {/* The page block, then the cloth cover over it. */}
        <mesh material={mats.paper} position={[0.012, (BOOK.t - BOOK.cover) / 2, 0]}>
          <boxGeometry args={[BOOK.w - 0.05, BOOK.t - BOOK.cover, BOOK.d - 0.06]} />
        </mesh>
        <RoundedBox args={[BOOK.w, BOOK.cover, BOOK.d]} radius={0.007} smoothness={2} position={[0, BOOK.t - BOOK.cover / 2, 0]} material={mats.cover} />
        <mesh material={mats.brass} position={[-0.05, BOOK.t + PEN.r, 0.22]} rotation={[0, -0.55, Math.PI / 2]}>
          <cylinderGeometry args={[PEN.r, PEN.r * 0.78, PEN.l, 20, 1]} />
        </mesh>
      </group>
    </group>
  );
}

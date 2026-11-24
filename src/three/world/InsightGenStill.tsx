import { useEffect, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { type Group } from "three";
import { smooth } from "./kit";
import { story } from "./story";
import { ContactShadow, DeskSurface, LAPTOP, StillLaptop, useDisplayMaterial, useDrawnTexture, useStillFinishes, useStillStudio } from "./still";

/*
 * InsightGen as a product still life (Phase 25; rebuilt in Phase 35 as the
 * reference for the still-life standard in still.tsx): a laptop on a desk
 * running the app, with a printed report beside it. What the screen shows
 * follows the project's real shape — a Streamlit app where a natural-language
 * question about a dataset is handled by CrewAI planner, coder and reporter
 * agents, producing a chart (Plotly), written insights and a report — as a
 * conceptual interface with a sample question and dataset: nothing is a
 * screenshot, and the scene keeps its ILLUSTRATION label.
 *
 * Phase 35: lit by STILL_STUDIO (a warm overhead softbox the deck and keys
 * catch, a neutral fill, a thin steel rim) with STILL_FINISH materials; the
 * shared StillLaptop (the same model as Profexia's) with a hinge cover; a
 * visible warm desk with a tight contact shadow under the laptop's footprint;
 * turned a little further from the lens, so it reads in three-quarter view
 * like a product photograph. The interface shows fewer, larger elements that
 * read as real text, instead of placeholder bars.
 *
 * Scroll story (lp, reversible): the lid opens and the screen wakes → the
 * question is entered → the three agents complete in turn → the chart and
 * insights appear → the report slides out onto the desk.
 */

const I = 0;
// Same timing helpers as the other compositions (ProjectGallery.tsx).
const lp = () => Math.min(2, Math.max(0, story.project - I + 1));
const phase = (a: number, b: number) => smooth((Math.min(lp(), 1) - a) / (b - a));

/** Interface states, each shown from its scroll threshold onwards. */
const STEPS = [0.3, 0.42, 0.52, 0.6, 0.68, 0.78, 0.86];

const C = {
  bg: "#131315",
  bar: "#1a1a1d",
  panel: "#1b1c1f",
  line: "#2c2d31",
  text: "#e2ddd3",
  dim: "#8c867c",
  steel: "#8fa3b8",
  brass: "#c9a46a",
  bars: "#4a5560",
};

function rr(g: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number, fill: string) {
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

/** The sample analysis: quarterly revenue by region. */
const REGIONS = ["N", "S", "E", "W", "C"];
const VALUES = [0.86, 0.58, 0.67, 0.44, 0.52];
const LEAD = 0;

/** The app at a given step (0 = just woken … STEPS.length = complete). */
function drawApp(step: number) {
  return (g: CanvasRenderingContext2D, w: number, h: number) => {
    g.fillStyle = C.bg;
    g.fillRect(0, 0, w, h);
    if (step < 1) return;
    // App header: name and the loaded dataset
    rr(g, 0, 0, w, 38, 0, C.bar);
    label(g, "InsightGen", 18, 19, 16, C.text, 700);
    label(g, "sales.csv · 1,240 rows", w - 18, 19, 12, C.dim, 500, "right");
    // The natural-language question
    rr(g, 18, 52, w - 36, 38, 19, C.panel);
    g.strokeStyle = step >= 2 ? C.steel : C.line;
    g.lineWidth = 1.5;
    g.beginPath();
    g.roundRect(18.75, 52.75, w - 37.5, 36.5, 18);
    g.stroke();
    label(g, step >= 2 ? "Which region grew fastest?" : "Ask about your data…", 36, 71, 14, step >= 2 ? C.text : C.dim, step >= 2 ? 600 : 500);
    rr(g, w - 86, 59, 58, 24, 12, step >= 2 ? C.brass : "#2c2d31");
    label(g, "Ask", w - 57, 71, 12, step >= 2 ? "#15120e" : C.dim, 700, "center");
    // Agents: planner → coder → reporter
    ["Planner", "Coder", "Reporter"].forEach((name, k) => {
      const x = 18 + k * 124;
      const done = step >= 3 + k;
      const active = step === 2 + k && step >= 2;
      rr(g, x, 102, 114, 28, 14, C.panel);
      rr(g, x + 12, 112, 8, 8, 4, done ? C.brass : active ? C.steel : "#36383c");
      label(g, name, x + 28, 116, 12, done || active ? C.text : C.dim, 600);
    });
    // Chart: revenue growth by region
    const cx = 18;
    const cy = 144;
    const cw = w * 0.58;
    const ch = h - cy - 18;
    rr(g, cx, cy, cw, ch, 10, C.panel);
    label(g, "Revenue growth by region", cx + 16, cy + 20, 13, step >= 5 ? C.text : C.dim, 600);
    if (step >= 5) {
      const base = cy + ch - 28;
      const span = ch - 70;
      g.strokeStyle = C.line;
      g.lineWidth = 1;
      for (let k = 0; k <= 3; k++) {
        const y = base - (k * span) / 3;
        g.beginPath();
        g.moveTo(cx + 16, y);
        g.lineTo(cx + cw - 16, y);
        g.stroke();
      }
      const slot = (cw - 32) / VALUES.length;
      VALUES.forEach((v, k) => {
        const bx = cx + 16 + k * slot + slot * 0.22;
        rr(g, bx, base - v * span, slot * 0.56, v * span, 3, k === LEAD ? C.brass : C.bars);
        label(g, REGIONS[k], bx + slot * 0.28, base + 14, 11, C.dim, 600, "center");
      });
    }
    // Insights and the report
    const ix = cx + cw + 12;
    const iw = w - ix - 18;
    rr(g, ix, cy, iw, ch, 10, C.panel);
    label(g, "Insights", ix + 14, cy + 20, 13, step >= 6 ? C.text : C.dim, 700);
    if (step >= 6) {
      ["North leads", "West is flat", "South recovering"].forEach((s, k) => {
        const y = cy + 40 + k * 40;
        rr(g, ix + 12, y, iw - 24, 32, 7, "#222326");
        rr(g, ix + 20, y + 9, 3, 14, 1.5, [C.brass, C.steel, C.steel][k]);
        label(g, s, ix + 32, y + 16, 12, C.text, 500);
      });
    }
    if (step >= 7) {
      rr(g, ix + 12, cy + ch - 38, iw - 24, 26, 13, "#26272b");
      label(g, "Report ready", ix + 26, cy + ch - 25, 12, C.text, 600);
      rr(g, ix + iw - 34, cy + ch - 29, 8, 8, 4, C.brass);
    }
  };
}

/** The printed report: a heading, the same chart and set text lines. */
function drawReport(g: CanvasRenderingContext2D, w: number, h: number) {
  g.fillStyle = "#f3f0ea";
  g.fillRect(0, 0, w, h);
  const ink = "#2f2f31";
  const soft = "#c9c4ba";
  label(g, "Sales report", 24, 34, 20, ink, 700);
  label(g, "Revenue growth by region", 24, 58, 12, "#6d6a65", 500);
  g.fillStyle = soft;
  g.fillRect(24, 74, w - 48, 1.5);
  const slot = (w - 60) / VALUES.length;
  VALUES.forEach((v, k) => rr(g, 30 + k * slot + slot * 0.2, 196 - v * 100, slot * 0.6, v * 100, 2, k === LEAD ? "#a8875a" : "#9aa1a6"));
  g.fillStyle = soft;
  g.fillRect(24, 200, w - 48, 1.5);
  for (let k = 0; k < 9; k++) rr(g, 24, 222 + k * 20, (w - 48) * (k % 3 === 2 ? 0.6 : 0.95), 6, 3, "#d6d1c8");
}

const { w: W, d: D, t: T } = LAPTOP;
const DESK_Y = -1.05;
/** Lift on the laptop's feet: a sliver, so the contact shadow reads as contact. */
const FEET = 0.006;
const OPEN = -0.26; // lid tilted back ~15°
const CLOSED = Math.PI / 2;

export function InsightGenStill({ lite }: { lite: boolean }) {
  const env = useStillStudio(lite);
  const mats = useStillFinishes(env, ["chassis", "bezel", "keys", "well", "trackpad", "hinge", "paper"] as const);
  const screenTex = useDrawnTexture(640, 400, lite ? 1.6 : 2);
  const reportTex = useDrawnTexture(300, 420, lite ? 1.4 : 1.8);
  const screen = useDisplayMaterial(screenTex.texture, env);
  const lid = useRef<Group>(null);
  const report = useRef<Group>(null);
  const shown = useRef(-1);

  useEffect(() => {
    mats.paper.map = reportTex.texture;
    reportTex.paint(drawReport);
    mats.paper.needsUpdate = true;
  }, [mats, reportTex]);
  useEffect(() => () => reportTex.texture.dispose(), [reportTex]);
  // A display under glass: a restrained reflection of the studio, not a mirror.
  useEffect(() => void (screen.envMapIntensity = 0.4), [screen]);

  useFrame(() => {
    const open = phase(0, 0.35);
    if (lid.current) lid.current.rotation.x = CLOSED + (OPEN - CLOSED) * open;
    // The display wakes as the lid opens and dims a little while text is read.
    screen.emissiveIntensity = phase(0.22, 0.36) * 0.9 * (1 - story.calm * 0.3);
    const p = Math.min(lp(), 1);
    let step = 0;
    while (step < STEPS.length && p >= STEPS[step]) step++;
    if (step !== shown.current) {
      shown.current = step;
      screenTex.paint(drawApp(step));
    }
    // The report slides out from beside the laptop onto the desk (Phase 35:
    // further forward, since the turned composition carries its right side back).
    const r = phase(0.84, 1);
    if (report.current) {
      report.current.position.set(1.15 + r * 0.8, DESK_Y, 0.6 + r * 0.15);
      report.current.visible = r > 0.001;
    }
  });

  return (
    <group position={[-1.15, 0, 0]} rotation-y={0.3}>
      <DeskSurface y={DESK_Y} size={[10, 7]} env={env} color="#6c645a" roughness={0.78} envMapIntensity={0.8} />
      {/* Grounding: a wide soft occlusion, and a tight one at the footprint. */}
      <ContactShadow position={[0, DESK_Y + 0.002, 0.05]} size={[W + 1.3, D + 1.4]} opacity={0.5} />
      <ContactShadow position={[0, DESK_Y + 0.003, 0]} size={[W + 0.18, D + 0.22]} opacity={0.9} />

      <group position={[0, DESK_Y + FEET, 0]}>
        <StillLaptop body={mats.chassis} keys={mats.keys} glass={mats.bezel} display={screen} lid={lid} closed={CLOSED} well={mats.well} pad={mats.trackpad} />
        {/* Hinge cover along the back edge, where the lid turns. */}
        <mesh material={mats.hinge} position={[0, T, -D / 2 + 0.03]} rotation-z={Math.PI / 2}>
          <cylinderGeometry args={[0.04, 0.04, W - 0.7, 16, 1]} />
        </mesh>
      </group>

      {/* The printed report */}
      <group ref={report} rotation={[0, -0.18, 0]} visible={false}>
        <ContactShadow position={[0, 0.003, 0]} size={[1.55, 2.05]} opacity={0.45} />
        <mesh material={mats.paper} rotation-x={-Math.PI / 2} position={[0, 0.006, 0]}>
          <planeGeometry args={[1.25, 1.75]} />
        </mesh>
      </group>
    </group>
  );
}

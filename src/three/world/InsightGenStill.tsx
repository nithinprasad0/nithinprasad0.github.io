import { useEffect, useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { RoundedBox } from "@react-three/drei";
import { BufferGeometry, Float32BufferAttribute, type Group } from "three";
import { smooth } from "./kit";
import { story } from "./story";
import { ContactShadow, DeskSurface, useDisplayMaterial, useDrawnTexture, useFinishes, useProductStudio } from "./still";

/*
 * InsightGen as a product still life (Phase 25): a laptop on a desk running
 * the app, with a printed report beside it. What the screen shows follows the
 * project's real shape — a Streamlit app where a natural-language request is
 * handled by CrewAI planner, coder and reporter agents, producing a chart
 * (Plotly), written insights and a report — as a conceptual interface:
 * placeholder bars stand in for text and data, nothing is a screenshot, and
 * the scene keeps its ILLUSTRATION label.
 *
 * Scroll story (lp, reversible): the lid opens and the screen wakes → the
 * request is entered → the three agents complete in turn → the chart and
 * insights appear → the report slides out onto the desk.
 */

const I = 0;
// Same timing helpers as the other compositions (ProjectGallery.tsx).
const lp = () => Math.min(2, Math.max(0, story.project - I + 1));
const phase = (a: number, b: number) => smooth((Math.min(lp(), 1) - a) / (b - a));

/** Interface states, each shown from its scroll threshold onwards. */
const STEPS = [0.3, 0.42, 0.52, 0.6, 0.68, 0.78, 0.86];

const C = {
  bg: "#121315",
  bar: "#1a1b1e",
  panel: "#18191c",
  line: "#2a2c30",
  text: "#d0cabf",
  dim: "#7f7a72",
  steel: "#8fa3b8",
  teal: "#8fbcb7",
  brass: "#c9a46a",
};

function rr(g: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number, fill: string) {
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
const line = (g: CanvasRenderingContext2D, x: number, y: number, w: number, color = C.line, h = 6) => rr(g, x, y, w, h, h / 2, color);

/** The app at a given step (0 = just woken … STEPS.length = complete). */
function drawApp(step: number) {
  return (g: CanvasRenderingContext2D, w: number, h: number) => {
    g.fillStyle = C.bg;
    g.fillRect(0, 0, w, h);
    if (step < 1) return;
    // App header
    rr(g, 0, 0, w, 34, 0, C.bar);
    label(g, "InsightGen", 18, 17, 13, C.text, 700);
    [0, 1, 2].forEach((k) => rr(g, w - 22 - k * 14, 14, 6, 6, 3, "#3a3b3f"));
    // Natural-language request
    rr(g, 18, 48, w - 36, 34, 17, C.panel);
    g.strokeStyle = step >= 2 ? C.steel : C.line;
    g.lineWidth = 1.5;
    g.beginPath();
    g.roundRect(18.75, 48.75, w - 37.5, 32.5, 16);
    g.stroke();
    if (step < 2) label(g, "Ask about your data…", 36, 65, 11, C.dim, 500);
    else line(g, 36, 62, w * 0.42, "#4a4c51", 7);
    rr(g, w - 78, 54, 52, 22, 11, step >= 2 ? C.brass : "#2c2d31");
    label(g, "Ask", w - 63, 65, 10, step >= 2 ? "#15120e" : C.dim, 700);
    // Agents: planner → coder → reporter
    ["Planner", "Coder", "Reporter"].forEach((name, k) => {
      const x = 18 + k * 112;
      const done = step >= 3 + k;
      const active = step === 2 + k && step >= 2;
      rr(g, x, 96, 102, 24, 12, C.panel);
      rr(g, x + 10, 104, 8, 8, 4, done ? C.brass : active ? C.steel : "#34363a");
      label(g, name, x + 26, 108, 10, done || active ? C.text : C.dim, 600);
    });
    // Chart panel
    const cx = 18;
    const cy = 134;
    const cw = w * 0.6;
    const ch = h - cy - 18;
    rr(g, cx, cy, cw, ch, 10, C.panel);
    if (step >= 5) {
      g.strokeStyle = C.line;
      g.lineWidth = 1;
      for (let k = 1; k <= 4; k++) {
        const y = cy + 18 + (k * (ch - 40)) / 4;
        g.beginPath();
        g.moveTo(cx + 18, y);
        g.lineTo(cx + cw - 14, y);
        g.stroke();
      }
      line(g, cx + 18, cy + 12, 90, "#3a3c40", 6);
      const vals = [0.34, 0.52, 0.44, 0.7, 0.6, 0.82, 0.74];
      const base = cy + ch - 22;
      const span = ch - 52;
      const step7 = (cw - 46) / vals.length;
      vals.forEach((v, k) => rr(g, cx + 24 + k * step7, base - v * span, step7 * 0.55, v * span, 3, k === 5 ? C.brass : "#3b4a52"));
      g.strokeStyle = C.teal;
      g.lineWidth = 2.5;
      g.beginPath();
      vals.forEach((v, k) => {
        const x = cx + 24 + k * step7 + step7 * 0.27;
        const y = base - v * span - 10;
        if (k) g.lineTo(x, y);
        else g.moveTo(x, y);
      });
      g.stroke();
    }
    // Insights and report
    const ix = cx + cw + 12;
    const iw = w - ix - 18;
    rr(g, ix, cy, iw, ch, 10, C.panel);
    label(g, "Insights", ix + 14, cy + 18, 11, step >= 6 ? C.text : C.dim, 700);
    if (step >= 6) {
      [0, 1, 2].forEach((k) => {
        const y = cy + 36 + k * 46;
        rr(g, ix + 12, y, iw - 24, 38, 7, "#1f2023");
        rr(g, ix + 20, y + 9, 4, 20, 2, [C.teal, C.steel, C.brass][k]);
        line(g, ix + 32, y + 10, iw * (0.55 - k * 0.08), "#4a4c51", 6);
        line(g, ix + 32, y + 22, iw * 0.42, C.line, 5);
      });
    }
    if (step >= 7) {
      rr(g, ix + 12, cy + ch - 34, iw - 24, 22, 11, "#24252a");
      label(g, "Report", ix + 26, cy + ch - 23, 10, C.text, 600);
      rr(g, ix + iw - 34, cy + ch - 27, 8, 8, 4, C.brass);
    }
  };
}

/** The printed report: a heading, a small chart and placeholder text. */
function drawReport(g: CanvasRenderingContext2D, w: number, h: number) {
  g.fillStyle = "#e9e5dd";
  g.fillRect(0, 0, w, h);
  const ink = "#3a3a3c";
  const soft = "#bdb8ae";
  label(g, "Report", 24, 34, 20, ink, 700);
  line(g, 24, 54, w * 0.42, soft, 6);
  g.fillStyle = soft;
  g.fillRect(24, 74, w - 48, 1.5);
  const vals = [0.34, 0.52, 0.44, 0.7, 0.6, 0.82, 0.74];
  const bw = (w - 60) / vals.length;
  vals.forEach((v, k) => rr(g, 30 + k * bw, 196 - v * 96, bw * 0.55, v * 96, 2, k === 5 ? "#a8875a" : "#9aa3a8"));
  g.fillStyle = soft;
  g.fillRect(24, 200, w - 48, 1.5);
  for (let k = 0; k < 9; k++) line(g, 24, 222 + k * 20, (w - 48) * (k % 3 === 2 ? 0.6 : 0.95), "#cdc8bf", 6);
}

/* Laptop dimensions (scene units) */
const W = 3.3;
const D = 2.2;
const T = 0.08;
const LID_H = 2.08;
const LID_T = 0.05;
const SCREEN = { w: 3.04, h: 1.9 };
const DESK_Y = -1.05;
const OPEN = -0.26; // lid tilted back ~15°
const CLOSED = Math.PI / 2;

/*
 * The keyboard: one merged mesh (a single draw call), every key a low
 * chamfered cap — a flat top on sloped sides that catch the studio light as a
 * thin edge highlight — built at its true width, so wide keys keep the same
 * bevel as square ones. Laptop layout in key units: a half-height function
 * row, four staggered rows, and a space-bar row. Flat-shaded, 10 triangles a
 * key, no legends (nothing invented to read).
 */
const KEY = { pitch: 0.21, gap: 0.034, height: 0.024, bevel: 0.013 };
const KEY_ROWS: { units: number[]; depth?: number }[] = [
  { units: Array(14).fill(13 / 14), depth: 0.5 },
  { units: Array(13).fill(1) },
  { units: [1.5, ...Array(10).fill(1), 1.5] },
  { units: [1.75, ...Array(9).fill(1), 2.25] },
  { units: [2.25, ...Array(8).fill(1), 2.75] },
  { units: [1, 1, 1, 1.25, 4.5, 1.25, 1, 1, 1] },
];
const KEYS_W = 13 * KEY.pitch;
const KEYS_D = KEY_ROWS.reduce((s, r) => s + (r.depth ?? 1) * KEY.pitch, 0);

function keyboardGeometry() {
  const pos: number[] = [];
  type V = [number, number, number];
  const quad = (a: V, b: V, c: V, d: V) => pos.push(...a, ...b, ...c, ...a, ...c, ...d);
  const cap = (x: number, z: number, w: number, d: number) => {
    const [x0, x1, z0, z1] = [x - w / 2, x + w / 2, z - d / 2, z + d / 2];
    const [i, h] = [KEY.bevel, KEY.height];
    const B: V[] = [[x0, 0, z0], [x1, 0, z0], [x1, 0, z1], [x0, 0, z1]];
    const T: V[] = [[x0 + i, h, z0 + i], [x1 - i, h, z0 + i], [x1 - i, h, z1 - i], [x0 + i, h, z1 - i]];
    quad(T[3], T[2], T[1], T[0]); // top
    quad(B[3], B[2], T[2], T[3]); // front
    quad(B[2], B[1], T[1], T[2]); // right
    quad(B[1], B[0], T[0], T[1]); // back
    quad(B[0], B[3], T[3], T[0]); // left
  };
  let z = -KEYS_D / 2;
  for (const row of KEY_ROWS) {
    const rowD = (row.depth ?? 1) * KEY.pitch;
    let x = -KEYS_W / 2;
    for (const u of row.units) {
      cap(x + (u * KEY.pitch) / 2, z + rowD / 2, u * KEY.pitch - KEY.gap, rowD - KEY.gap);
      x += u * KEY.pitch;
    }
    z += rowD;
  }
  const g = new BufferGeometry();
  g.setAttribute("position", new Float32BufferAttribute(pos, 3));
  g.computeVertexNormals(); // non-indexed, so every face is flat
  return g;
}

export function InsightGenStill({ lite }: { lite: boolean }) {
  const env = useProductStudio(lite);
  const mats = useFinishes(env, ["aluminium", "glass", "keys", "paper", "well", "trackpad"] as const);
  const screenTex = useDrawnTexture(640, 400, lite ? 1.6 : 2);
  const reportTex = useDrawnTexture(300, 420, lite ? 1.4 : 1.8);
  const screen = useDisplayMaterial(screenTex.texture, env);
  const keys = useMemo(keyboardGeometry, []);
  const lid = useRef<Group>(null);
  const report = useRef<Group>(null);
  const shown = useRef(-1);

  useEffect(() => {
    mats.paper.map = reportTex.texture;
    reportTex.paint(drawReport);
    mats.paper.needsUpdate = true;
  }, [mats, reportTex]);
  useEffect(() => () => keys.dispose(), [keys]);
  useEffect(() => () => reportTex.texture.dispose(), [reportTex]);

  useFrame(() => {
    const open = phase(0, 0.35);
    if (lid.current) lid.current.rotation.x = CLOSED + (OPEN - CLOSED) * open;
    // The display wakes as the lid opens and dims a little while text is read.
    screen.emissiveIntensity = phase(0.22, 0.36) * 0.95 * (1 - story.calm * 0.3);
    const p = Math.min(lp(), 1);
    let step = 0;
    while (step < STEPS.length && p >= STEPS[step]) step++;
    if (step !== shown.current) {
      shown.current = step;
      screenTex.paint(drawApp(step));
    }
    // The report slides out from beside the laptop onto the desk.
    const r = phase(0.84, 1);
    if (report.current) {
      report.current.position.set(1.15 + r * 0.7, DESK_Y, 0.45 - r * 0.05);
      report.current.visible = r > 0.001;
    }
  });

  const baseY = DESK_Y + T / 2 + 0.012;
  return (
    <group position={[-1.15, 0, 0]} rotation-y={0.1}>
      <DeskSurface y={DESK_Y} size={[9, 6.5]} env={env} color="#5a554d" />
      <ContactShadow position={[0, DESK_Y + 0.002, 0]} size={[W + 0.7, D + 0.8]} opacity={0.7} />

      {/* Base: aluminium slab, keyboard and trackpad */}
      <group position={[0, baseY, 0]}>
        <RoundedBox args={[W, T, D]} radius={0.035} smoothness={3} material={mats.aluminium} />
        <mesh material={mats.well} rotation-x={-Math.PI / 2} position={[0, T / 2 + 0.001, -0.34]}>
          <planeGeometry args={[KEYS_W + 0.12, KEYS_D + 0.08]} />
        </mesh>
        <mesh geometry={keys} material={mats.keys} position={[0, T / 2 + 0.0015, -0.34]} />
        <mesh material={mats.trackpad} rotation-x={-Math.PI / 2} position={[0, T / 2 + 0.0015, 0.66]}>
          <planeGeometry args={[1.25, 0.72]} />
        </mesh>
      </group>

      {/* Lid on its hinge at the back edge of the base */}
      <group ref={lid} position={[0, baseY + T / 2, -D / 2 + 0.03]} rotation-x={CLOSED}>
        <group position={[0, LID_H / 2, 0]}>
          <RoundedBox args={[W, LID_H, LID_T]} radius={0.03} smoothness={3} material={mats.aluminium} />
          <mesh material={mats.glass} position={[0, 0, LID_T / 2 + 0.001]}>
            <planeGeometry args={[W - 0.04, LID_H - 0.04]} />
          </mesh>
          <mesh material={screen} position={[0, 0.035, LID_T / 2 + 0.003]}>
            <planeGeometry args={[SCREEN.w, SCREEN.h]} />
          </mesh>
        </group>
      </group>

      {/* The printed report */}
      <group ref={report} rotation={[0, -0.18, 0]} visible={false}>
        <ContactShadow position={[0, 0.003, 0]} size={[1.7, 2.2]} opacity={0.4} />
        <mesh material={mats.paper} rotation-x={-Math.PI / 2} position={[0, 0.006, 0]}>
          <planeGeometry args={[1.25, 1.75]} />
        </mesh>
      </group>
    </group>
  );
}

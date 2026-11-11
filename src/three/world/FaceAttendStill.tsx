import { useEffect, useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { RoundedBox } from "@react-three/drei";
import { MeshBasicMaterial } from "three";
import { smooth } from "./kit";
import { story } from "./story";
import { ContactShadow, DeskSurface, useDisplayMaterial, useDrawnTexture, useFinishes, useProductStudio } from "./still";

/*
 * FaceAttend as a product still life (Phase 29): a desktop monitor on its
 * stand, with a webcam clipped to the top of the bezel, running the Windows
 * attendance application. Only what the project describes is shown (see
 * portfolio.ts): a local desktop app that recognises enrolled faces through a
 * webcam and keeps attendance records (check-in and check-out times), with
 * weekly wages as one section of the app. Nothing suggests cloud processing or
 * surveillance infrastructure, and the optional liveness check appears only
 * as what it is: off by default and experimental. The face in the camera view
 * is a generic silhouette, names are blank placeholder bars, times and counts
 * are fictional, and the scene keeps its ILLUSTRATION label.
 *
 * Scroll story (lp, reversible): the screen wakes on today's attendance → the
 * webcam view opens (the camera's light comes on) → a face is detected → it
 * is recognised and a check-in is recorded at the top of the list, which is
 * the state held while the project is read.
 */

const I = 4;
// Same timing helpers as the other compositions (ProjectGallery.tsx).
const lp = () => Math.min(2, Math.max(0, story.project - I + 1));
const phase = (a: number, b: number) => smooth((Math.min(lp(), 1) - a) / (b - a));

/** Interface states, each shown from its scroll threshold onwards. */
const STEPS = [0.3, 0.44, 0.58, 0.72];

/* A dark graphite Windows app with a sage accent and brass for the new entry. */
const C = {
  bg: "#15171a",
  title: "#1b1d21",
  side: "#191b1f",
  panel: "#1f2226",
  raised: "#282b30",
  line: "#30343a",
  bars: "#4b5058",
  text: "#e1e3e4",
  dim: "#8b9096",
  faint: "#5d6268",
  sage: "#7fb3a2",
  sageDeep: "#24382f",
  brass: "#c9a46a",
  brassDeep: "#3a3020",
  feed: "#0d0f11",
};

function rr(g: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number, fill: string | CanvasGradient) {
  g.fillStyle = fill;
  g.beginPath();
  g.roundRect(x, y, w, h, r);
  g.fill();
}
function label(g: CanvasRenderingContext2D, s: string, x: number, y: number, px: number, color: string, weight = 600) {
  g.font = `${weight} ${px}px "Segoe UI", Inter, Arial, sans-serif`;
  g.fillStyle = color;
  g.textBaseline = "middle";
  g.fillText(s, x, y);
}
const bar = (g: CanvasRenderingContext2D, x: number, y: number, w: number, color: string, h = 7) => rr(g, x, y, w, h, h / 2, color);

function chip(g: CanvasRenderingContext2D, s: string, x: number, y: number, w: number, fill: string, color: string) {
  rr(g, x, y, w, 18, 9, fill);
  label(g, s, x + 9, y + 9.5, 9, color, 700);
}

/** A generic head-and-shoulders silhouette (no features, nobody in particular). */
function silhouette(g: CanvasRenderingContext2D, cx: number, cy: number, s: number) {
  const grad = g.createLinearGradient(0, cy - s, 0, cy + s * 1.4);
  grad.addColorStop(0, "#3a3f45");
  grad.addColorStop(1, "#24282c");
  g.fillStyle = grad;
  g.beginPath();
  g.ellipse(cx, cy, s * 0.42, s * 0.54, 0, 0, Math.PI * 2);
  g.fill();
  g.beginPath();
  g.moveTo(cx - s * 1.1, cy + s * 1.5);
  g.bezierCurveTo(cx - s * 1.05, cy + s * 0.75, cx - s * 0.5, cy + s * 0.62, cx, cy + s * 0.62);
  g.bezierCurveTo(cx + s * 0.5, cy + s * 0.62, cx + s * 1.05, cy + s * 0.75, cx + s * 1.1, cy + s * 1.5);
  g.closePath();
  g.fill();
}

/** Detection frame: four thin corner brackets. */
function brackets(g: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, color: string) {
  const k = Math.min(w, h) * 0.22;
  g.strokeStyle = color;
  g.lineWidth = 2;
  g.lineCap = "round";
  g.beginPath();
  for (const [px, py, dx, dy] of [
    [x, y, 1, 1],
    [x + w, y, -1, 1],
    [x, y + h, 1, -1],
    [x + w, y + h, -1, -1],
  ]) {
    g.moveTo(px + dx * k, py);
    g.lineTo(px, py);
    g.lineTo(px, py + dy * k);
  }
  g.stroke();
}

const ROWS = [
  { in: "08:41", out: "—", status: "Present", fresh: false },
  { in: "08:37", out: "—", status: "Present", fresh: false },
  { in: "08:30", out: "12:05", status: "Checked out", fresh: false },
  { in: "—", out: "—", status: "Absent", fresh: false },
];

/** The attendance window at a given step (0 = off … 4 = check-in recorded). */
function drawApp(step: number) {
  return (g: CanvasRenderingContext2D, w: number, h: number) => {
    g.fillStyle = "#0b0c0e";
    g.fillRect(0, 0, w, h);
    if (step < 1) return;
    // The application window, maximised: title bar with Windows controls.
    g.fillStyle = C.bg;
    g.fillRect(0, 0, w, h);
    rr(g, 0, 0, w, 30, 0, C.title);
    rr(g, 12, 9, 12, 12, 3, C.sage);
    label(g, "FaceAttend", 32, 15.5, 11, C.text, 600);
    [w - 92, w - 58, w - 24].forEach((x, k) => {
      g.strokeStyle = C.dim;
      g.lineWidth = 1.2;
      g.beginPath();
      if (k === 0) {
        g.moveTo(x - 5, 15.5);
        g.lineTo(x + 5, 15.5);
      } else if (k === 1) g.rect(x - 4.5, 11, 9, 9);
      else {
        g.moveTo(x - 4.5, 11);
        g.lineTo(x + 4.5, 20);
        g.moveTo(x + 4.5, 11);
        g.lineTo(x - 4.5, 20);
      }
      g.stroke();
    });

    // Sidebar
    const sw = 132;
    rr(g, 0, 30, sw, h - 54, 0, C.side);
    ["Attendance", "Employees", "Enrol face", "Weekly wages", "Settings"].forEach((s, k) => {
      const y = 50 + k * 34;
      if (k === 0) {
        rr(g, 8, y - 12, sw - 16, 26, 6, C.raised);
        rr(g, 8, y - 6, 3, 14, 1.5, C.sage);
      }
      label(g, s, 22, y + 1, 11, k === 0 ? C.text : C.dim, k === 0 ? 700 : 500);
    });

    // Status bar: everything stays on this computer; liveness is off.
    rr(g, 0, h - 24, w, 24, 0, C.title);
    rr(g, 12, h - 15, 6, 6, 3, C.sage);
    label(g, "Local database", 24, h - 11.5, 9, C.dim, 600);
    label(g, "Liveness check: off (experimental)", 132, h - 11.5, 9, C.faint, 600);

    // Camera view
    const cx = sw + 16;
    const cy = 44;
    const cw = 300;
    const ch = 300;
    rr(g, cx, cy, cw, ch + 70, 10, C.panel);
    label(g, "Camera", cx + 14, cy + 18, 12, C.text, 700);
    if (step >= 2) chip(g, "Live", cx + cw - 56, cy + 9, 42, C.sageDeep, C.sage);
    else chip(g, "Off", cx + cw - 50, cy + 9, 36, C.raised, C.dim);
    const fx = cx + 12;
    const fy = cy + 36;
    const fw = cw - 24;
    const fh = ch - 40;
    rr(g, fx, fy, fw, fh, 8, C.feed);
    if (step >= 2) {
      g.save();
      g.beginPath();
      g.roundRect(fx, fy, fw, fh, 8);
      g.clip();
      const glow = g.createRadialGradient(fx + fw / 2, fy + fh * 0.35, 10, fx + fw / 2, fy + fh * 0.35, fw * 0.7);
      glow.addColorStop(0, "#22262a");
      glow.addColorStop(1, C.feed);
      g.fillStyle = glow;
      g.fillRect(fx, fy, fw, fh);
      silhouette(g, fx + fw / 2, fy + fh * 0.4, 62);
      g.restore();
    }
    if (step >= 3) brackets(g, fx + fw / 2 - 46, fy + fh * 0.4 - 50, 92, 106, step >= 4 ? C.sage : "#c9cdd1");
    // Recognition result under the view
    const ry = fy + fh + 12;
    rr(g, fx, ry, fw, 54, 8, step >= 4 ? C.sageDeep : C.raised);
    if (step >= 4) {
      rr(g, fx + 12, ry + 13, 28, 28, 14, C.sage);
      g.strokeStyle = C.sageDeep;
      g.lineWidth = 2.4;
      g.beginPath();
      g.moveTo(fx + 19, ry + 27);
      g.lineTo(fx + 24, ry + 32);
      g.lineTo(fx + 33, ry + 22);
      g.stroke();
      label(g, "Recognised · checked in 08:52", fx + 50, ry + 20, 11, C.text, 700);
      bar(g, fx + 50, ry + 34, 96, "#46695c", 7);
    } else {
      label(g, step >= 3 ? "Face detected" : step >= 2 ? "Looking for a face" : "Camera off", fx + 14, ry + 27, 11, C.dim, 600);
    }

    // Today's attendance
    const tx = cx + cw + 14;
    const tw = w - tx - 16;
    rr(g, tx, cy, tw, ch + 70, 10, C.panel);
    label(g, "Today", tx + 14, cy + 18, 12, C.text, 700);
    label(g, step >= 4 ? "19 present" : "18 present", tx + tw - 84, cy + 18, 10, C.dim, 600);
    const cols = [tx + 14, tx + tw * 0.47, tx + tw * 0.6, tx + tw * 0.73];
    ["Employee", "In", "Out", "Status"].forEach((s, k) => label(g, s, cols[k], cy + 44, 9, C.faint, 700));
    rr(g, tx + 12, cy + 54, tw - 24, 1, 0, C.line);
    const rows = step >= 4 ? [{ in: "08:52", out: "—", status: "Present", fresh: true }, ...ROWS] : ROWS;
    rows.forEach((r, k) => {
      const y = cy + 62 + k * 52;
      if (r.fresh) rr(g, tx + 8, y, tw - 16, 44, 7, C.brassDeep);
      rr(g, tx + 16, y + 9, 22, 22, 11, C.raised);
      bar(g, tx + 46, y + 13, tw * 0.22, r.fresh ? "#7d6a4a" : C.bars, 7);
      bar(g, tx + 46, y + 24, tw * 0.13, C.line, 5);
      label(g, r.in, cols[1], y + 20, 11, r.fresh ? C.brass : C.text, 600);
      label(g, r.out, cols[2], y + 20, 11, C.dim, 600);
      const [fill, color] = r.status === "Present" ? [C.sageDeep, C.sage] : r.status === "Absent" ? [C.raised, C.dim] : ["#2a2c33", "#a9adb8"];
      chip(g, r.status, cols[3], y + 11, r.status === "Checked out" ? 70 : r.status === "Present" ? 52 : 48, fill, color);
    });
  };
}

/* Composition (stage units). The desk sits where the other still lifes' does. */
const DESK_Y = -1.05;
const MON = { w: 3.6, h: 2.1, t: 0.07, screen: { w: 3.48, h: 1.96 } };
const MON_Y = 0.42; // monitor centre above the stage origin

export function FaceAttendStill({ lite }: { lite: boolean }) {
  const env = useProductStudio(lite);
  const mats = useFinishes(env, ["keys", "aluminium", "glass", "housing"] as const);
  const screenTex = useDrawnTexture(800, 450, lite ? 1.4 : 2);
  const screen = useDisplayMaterial(screenTex.texture, env);
  // The webcam's privacy light (on while the camera view is open).
  const led = useMemo(() => new MeshBasicMaterial({ color: "#2a2d30", toneMapped: false }), []);
  useEffect(() => () => led.dispose(), [led]);
  const shown = useRef(-1);

  useFrame(() => {
    screen.emissiveIntensity = phase(0.14, 0.3) * 1.05 * (1 - story.calm * 0.3);
    const p = Math.min(lp(), 1);
    let step = 0;
    while (step < STEPS.length && p >= STEPS[step]) step++;
    if (step !== shown.current) {
      shown.current = step;
      screenTex.paint(drawApp(step));
      led.color.set(step >= 2 ? "#cfe8dc" : "#2a2d30");
    }
  });

  const { w, h, t, screen: s } = MON;
  const neckH = MON_Y - DESK_Y - 0.1;
  return (
    <group>
      {/* Desk and shadows draw before the stage labels (as in Phase 28), so a
          low line of sight across the transparent desk never dims them. */}
      <group renderOrder={-1}>
        <DeskSurface y={DESK_Y} size={[9, 6.5]} env={env} color="#5f5c58" />
      </group>
      <group renderOrder={-1}>
        <ContactShadow position={[0, DESK_Y + 0.002, -0.15]} size={[2.2, 1.5]} opacity={0.8} />
      </group>

      {/* Stand: a weighted aluminium foot and an upright neck behind the display */}
      <RoundedBox args={[1.4, 0.045, 0.9]} radius={0.02} smoothness={3} position={[0, DESK_Y + 0.0225, -0.2]} material={mats.aluminium} />
      <RoundedBox args={[0.42, neckH, 0.06]} radius={0.02} smoothness={3} position={[0, DESK_Y + neckH / 2 + 0.03, -0.4]} rotation-x={-0.06} material={mats.aluminium} />

      {/* Display: matte housing with a rear shell, black glass, lit panel */}
      <group position={[0, MON_Y, -0.28]}>
        <RoundedBox args={[w, h, t]} radius={0.03} smoothness={3} material={mats.housing} />
        <RoundedBox args={[w * 0.62, h * 0.6, 0.1]} radius={0.04} smoothness={3} position={[0, -0.05, -0.07]} material={mats.housing} />
        <mesh material={mats.glass} position={[0, 0, t / 2 + 0.001]}>
          <planeGeometry args={[w - 0.03, h - 0.03]} />
        </mesh>
        <mesh material={screen} position={[0, 0.03, t / 2 + 0.003]}>
          <planeGeometry args={[s.w, s.h]} />
        </mesh>

        {/* Webcam clipped to the top edge: its own housing, lens and light */}
        <group position={[0, h / 2 + 0.085, 0.03]}>
          <RoundedBox args={[0.62, 0.15, 0.15]} radius={0.06} smoothness={3} material={mats.keys} />
          <RoundedBox args={[0.2, 0.06, 0.2]} radius={0.02} smoothness={2} position={[0, -0.09, -0.04]} material={mats.aluminium} />
          <mesh material={mats.aluminium} position={[0, 0, 0.076]}>
            <circleGeometry args={[0.052, 24]} />
          </mesh>
          <mesh material={mats.glass} position={[0, 0, 0.078]}>
            <circleGeometry args={[0.038, 24]} />
          </mesh>
          <mesh material={led} position={[0.17, 0, 0.077]}>
            <circleGeometry args={[0.011, 10]} />
          </mesh>
        </group>
      </group>
    </group>
  );
}

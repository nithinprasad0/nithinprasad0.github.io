import { useEffect, useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { RoundedBox } from "@react-three/drei";
import { MeshBasicMaterial } from "three";
import { smooth } from "./kit";
import { story } from "./story";
import { ContactShadow, DeskSurface, useDisplayMaterial, useDrawnTexture, useStillFinishes, useStillStudio } from "./still";

/*
 * FaceAttend as a product still life (Phase 29; rebuilt in Phase 37 on the
 * still-life standard in still.tsx): a desktop monitor on its stand, with a
 * webcam clipped to the top of the bezel, running the Windows attendance
 * application. Only what the project describes is shown (see portfolio.ts):
 * a local desktop app that recognises enrolled faces through a webcam, keeps
 * check-in and check-out records with each person's status, and has a weekly
 * wages section. Nothing suggests cloud processing or surveillance
 * infrastructure, and the optional liveness check appears only as what it
 * is: off by default and experimental. The face in the camera view is a
 * generic silhouette, names are blank placeholder bars, the times are sample
 * content, and there are no head counts, wage figures or percentages. The
 * scene keeps its ILLUSTRATION label.
 *
 * Phase 37: lit by STILL_STUDIO with STILL_FINISH materials, the same baked
 * studio as InsightGen and Profexia (no further bake). The monitor is built
 * here from those finishes, not as a shared component: it is the only
 * monitor among the still lifes. The composition is the one device that
 * stands upright: a monitor on a weighted foot, turned a little off the lens
 * so its edge and stand have depth, with nothing else on the desk.
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
  raised: "#2a2d32",
  line: "#33373d",
  bars: "#4f545c",
  text: "#e4e6e7",
  dim: "#959aa0",
  faint: "#6c7177",
  sage: "#86baa8",
  sageDeep: "#24382f",
  brass: "#d2ad72",
  brassDeep: "#3a3020",
  feed: "#0d0f11",
};

const FONT = `"Segoe UI", Inter, Arial, sans-serif`;
function rr(g: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number, fill: string | CanvasGradient) {
  g.fillStyle = fill;
  g.beginPath();
  g.roundRect(x, y, w, h, r);
  g.fill();
}
function label(g: CanvasRenderingContext2D, s: string, x: number, y: number, px: number, color: string, weight = 600) {
  g.font = `${weight} ${px}px ${FONT}`;
  g.fillStyle = color;
  g.textBaseline = "middle";
  g.fillText(s, x, y);
}
const bar = (g: CanvasRenderingContext2D, x: number, y: number, w: number, color: string, h = 7) => rr(g, x, y, w, h, h / 2, color);

/** A status chip sized to its text. */
function chip(g: CanvasRenderingContext2D, s: string, x: number, y: number, fill: string, color: string, px = 10) {
  g.font = `700 ${px}px ${FONT}`;
  const w = g.measureText(s).width + 16;
  rr(g, x, y, w, px + 9, (px + 9) / 2, fill);
  label(g, s, x + 8, y + (px + 9) / 2 + 0.5, px, color, 700);
  return w;
}

/** A generic head-and-shoulders silhouette (no features, nobody in particular). */
function silhouette(g: CanvasRenderingContext2D, cx: number, cy: number, s: number) {
  const grad = g.createLinearGradient(0, cy - s, 0, cy + s * 1.4);
  grad.addColorStop(0, "#3c4147");
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

type Row = { in: string; out: string; status: "Present" | "Checked out" | "Absent"; fresh?: boolean };
/** Sample records: times only, no names (blank bars), no totals. */
const ROWS: Row[] = [
  { in: "08:41", out: "—", status: "Present" },
  { in: "08:30", out: "12:05", status: "Checked out" },
  { in: "—", out: "—", status: "Absent" },
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
    rr(g, 0, 0, w, 26, 0, C.title);
    rr(g, 10, 7, 12, 12, 3, C.sage);
    label(g, "FaceAttend", 29, 13.5, 11, C.text, 600);
    [w - 78, w - 50, w - 20].forEach((x, k) => {
      g.strokeStyle = C.dim;
      g.lineWidth = 1.2;
      g.beginPath();
      if (k === 0) {
        g.moveTo(x - 5, 13.5);
        g.lineTo(x + 5, 13.5);
      } else if (k === 1) g.rect(x - 4.5, 9, 9, 9);
      else {
        g.moveTo(x - 4.5, 9);
        g.lineTo(x + 4.5, 18);
        g.moveTo(x + 4.5, 9);
        g.lineTo(x - 4.5, 18);
      }
      g.stroke();
    });

    // Sidebar
    const sw = 112;
    rr(g, 0, 26, sw, h - 48, 0, C.side);
    ["Attendance", "Employees", "Enrol face", "Weekly wages", "Settings"].forEach((s, k) => {
      const y = 46 + k * 30;
      if (k === 0) {
        rr(g, 6, y - 11, sw - 12, 23, 6, C.raised);
        rr(g, 6, y - 6, 3, 13, 1.5, C.sage);
      }
      label(g, s, 17, y + 1, 11, k === 0 ? C.text : C.dim, k === 0 ? 700 : 500);
    });

    // Status bar: everything stays on this computer; liveness is off.
    rr(g, 0, h - 22, w, 22, 0, C.title);
    rr(g, 10, h - 14, 6, 6, 3, C.sage);
    label(g, "Local database", 22, h - 10.5, 9.5, C.dim, 600);
    label(g, "Liveness check: off (experimental)", 118, h - 10.5, 9.5, C.faint, 600);

    // Camera view
    const cx = sw + 12;
    const cy = 36;
    const cw = 210;
    const chH = h - 22 - 10 - cy;
    rr(g, cx, cy, cw, chH, 9, C.panel);
    label(g, "Camera", cx + 12, cy + 16, 12, C.text, 700);
    if (step >= 2) chip(g, "Live", cx + cw - 50, cy + 6, C.sageDeep, C.sage);
    else chip(g, "Off", cx + cw - 44, cy + 6, C.raised, C.dim);
    const fx = cx + 10;
    const fy = cy + 32;
    const fw = cw - 20;
    const fh = chH - 32 - 64;
    rr(g, fx, fy, fw, fh, 7, C.feed);
    if (step >= 2) {
      g.save();
      g.beginPath();
      g.roundRect(fx, fy, fw, fh, 7);
      g.clip();
      const glow = g.createRadialGradient(fx + fw / 2, fy + fh * 0.38, 8, fx + fw / 2, fy + fh * 0.38, fw * 0.7);
      glow.addColorStop(0, "#23272b");
      glow.addColorStop(1, C.feed);
      g.fillStyle = glow;
      g.fillRect(fx, fy, fw, fh);
      silhouette(g, fx + fw / 2, fy + fh * 0.42, 50);
      g.restore();
    }
    if (step >= 3) brackets(g, fx + fw / 2 - 38, fy + fh * 0.42 - 40, 76, 86, step >= 4 ? C.sage : "#c9cdd1");
    // Recognition result under the view
    const ry = fy + fh + 10;
    rr(g, fx, ry, fw, 46, 7, step >= 4 ? C.sageDeep : C.raised);
    if (step >= 4) {
      rr(g, fx + 10, ry + 11, 24, 24, 12, C.sage);
      g.strokeStyle = C.sageDeep;
      g.lineWidth = 2.4;
      g.beginPath();
      g.moveTo(fx + 16, ry + 23);
      g.lineTo(fx + 20.5, ry + 27.5);
      g.lineTo(fx + 28, ry + 19);
      g.stroke();
      label(g, "Recognised", fx + 42, ry + 16, 11.5, C.text, 700);
      label(g, "Checked in 08:52", fx + 42, ry + 31, 10.5, C.brass, 600);
    } else {
      label(g, step >= 3 ? "Face detected" : step >= 2 ? "Looking for a face" : "Camera off", fx + 12, ry + 23.5, 11.5, C.dim, 600);
    }

    // Right column: today's records, then the weekly wages section.
    const tx = cx + cw + 10;
    const tw = w - tx - 10;
    const th = 196;
    rr(g, tx, cy, tw, th, 9, C.panel);
    label(g, "Today's attendance", tx + 12, cy + 16, 12, C.text, 700);
    const cols = [tx + 12, tx + tw * 0.4, tx + tw * 0.54, tx + tw * 0.68];
    ["Employee", "In", "Out", "Status"].forEach((s, k) => label(g, s, cols[k], cy + 38, 9.5, C.faint, 700));
    rr(g, tx + 10, cy + 47, tw - 20, 1, 0, C.line);
    const rows: Row[] = step >= 4 ? [{ in: "08:52", out: "—", status: "Present", fresh: true }, ...ROWS.slice(0, 2)] : ROWS;
    rows.forEach((r, k) => {
      const y = cy + 53 + k * 46;
      if (r.fresh) rr(g, tx + 6, y, tw - 12, 40, 7, C.brassDeep);
      rr(g, tx + 12, y + 10, 20, 20, 10, C.raised);
      bar(g, tx + 38, y + 13, tw * 0.2, r.fresh ? "#86724f" : C.bars, 7);
      bar(g, tx + 38, y + 24, tw * 0.12, C.line, 5);
      label(g, r.in, cols[1], y + 20, 11.5, r.fresh ? C.brass : C.text, 600);
      label(g, r.out, cols[2], y + 20, 11.5, C.dim, 600);
      const [fill, color] = r.status === "Present" ? [C.sageDeep, C.sage] : r.status === "Absent" ? [C.raised, C.dim] : ["#2a2c33", "#adb1bc"];
      chip(g, r.status, cols[3], y + 10.5, fill, color, 9.5);
    });

    // Weekly wages: the section exists; its contents are placeholders, no figures.
    const wy = cy + th + 10;
    const wh = h - 22 - 10 - wy;
    rr(g, tx, wy, tw, wh, 9, C.panel);
    label(g, "Weekly wages", tx + 12, wy + 16, 12, C.text, 700);
    label(g, "This week", tx + tw - 64, wy + 16, 10, C.dim, 600);
    const wc = [tx + 12, tx + tw * 0.48, tx + tw * 0.72];
    ["Employee", "Days", "Wage"].forEach((s, k) => label(g, s, wc[k], wy + 36, 9.5, C.faint, 700));
    [0, 1].forEach((k) => {
      const y = wy + 50 + k * 18;
      bar(g, wc[0], y, tw * 0.24, C.bars, 7);
      bar(g, wc[1], y, tw * 0.08, C.line, 7);
      bar(g, wc[2], y, tw * 0.14, C.line, 7);
    });
  };
}

/* Composition (stage units). The desk sits where the other still lifes' does. */
const DESK_Y = -1.05;
/** A 16:9 panel in a slim bezel, with a slightly deeper chin. */
const MON = { w: 3.6, h: 2.1, t: 0.05, screen: { w: 3.5, h: 1.97 } };
const MON_Y = 0.42; // monitor centre above the stage origin
const MON_Z = -0.28;
/** The stand: a low weighted foot and a flat column behind the display. */
const FOOT = { w: 1.24, t: 0.035, d: 0.78, z: -0.26 };
const NECK = { w: 0.34, t: 0.05, z: -0.44 };

export function FaceAttendStill({ lite }: { lite: boolean }) {
  // The same studio bake as InsightGen and Profexia (still.tsx).
  const env = useStillStudio(lite);
  const mats = useStillFinishes(env, ["chassis", "bezel", "keys", "hinge"] as const);
  const screenTex = useDrawnTexture(640, 360, lite ? 1.6 : 2);
  const screen = useDisplayMaterial(screenTex.texture, env);
  // The webcam's privacy light (on while the camera view is open).
  const led = useMemo(() => new MeshBasicMaterial({ color: "#2a2d30", toneMapped: false }), []);
  useEffect(() => () => led.dispose(), [led]);
  // This scene's own instances: the stand is a darker graphite anodising than
  // a laptop deck, and the panel glass reflects less, so the screen reads.
  useEffect(() => {
    mats.chassis.color.set("#7d7f83");
    mats.chassis.roughness = 0.42;
    screen.envMapIntensity = 0.35;
  }, [mats, screen]);
  const shown = useRef(-1);

  useFrame(() => {
    screen.emissiveIntensity = phase(0.14, 0.3) * 1.0 * (1 - story.calm * 0.3);
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
  // Column from the foot up into the back of the display.
  const neckH = MON_Y - DESK_Y + 0.1;
  return (
    <group rotation-y={-0.14}>
      {/* Desk and shadows draw before the stage labels (as in Phase 28), so a
          low line of sight across the transparent desk never dims them. */}
      <group renderOrder={-1}>
        <DeskSurface y={DESK_Y} size={[10, 7]} env={env} color="#675e56" roughness={0.8} envMapIntensity={0.8} />
      </group>
      <group renderOrder={-1}>
        <ContactShadow position={[0, DESK_Y + 0.002, FOOT.z - 0.02]} size={[FOOT.w + 0.45, FOOT.d + 0.45]} opacity={0.85} />
      </group>

      {/* Stand: a weighted graphite foot and a flat column behind the display */}
      <RoundedBox args={[FOOT.w, FOOT.t, FOOT.d]} radius={0.015} smoothness={3} position={[0, DESK_Y + FOOT.t / 2, FOOT.z]} material={mats.chassis} />
      <RoundedBox args={[NECK.w, neckH, NECK.t]} radius={0.02} smoothness={3} position={[0, DESK_Y + neckH / 2 + 0.02, NECK.z]} rotation-x={-0.05} material={mats.chassis} />

      {/* Display: satin black housing with a rear shell, black glass, lit panel */}
      <group position={[0, MON_Y, MON_Z]}>
        <RoundedBox args={[w, h, t]} radius={0.022} smoothness={3} material={mats.hinge} />
        <RoundedBox args={[w * 0.66, h * 0.62, 0.12]} radius={0.05} smoothness={3} position={[0, -0.06, -0.08]} material={mats.hinge} />
        <mesh material={mats.bezel} position={[0, 0, t / 2 + 0.001]}>
          <planeGeometry args={[w - 0.02, h - 0.02]} />
        </mesh>
        <mesh material={screen} position={[0, 0.04, t / 2 + 0.003]}>
          <planeGeometry args={[s.w, s.h]} />
        </mesh>

        {/* Webcam clipped to the top edge: its own housing, lens and light */}
        <group position={[0, h / 2 + 0.08, 0.025]}>
          <RoundedBox args={[0.58, 0.14, 0.14]} radius={0.06} smoothness={3} material={mats.keys} />
          <RoundedBox args={[0.2, 0.055, 0.2]} radius={0.02} smoothness={2} position={[0, -0.085, -0.04]} material={mats.hinge} />
          <mesh material={mats.chassis} position={[0, 0, 0.071]}>
            <circleGeometry args={[0.05, 24]} />
          </mesh>
          <mesh material={mats.bezel} position={[0, 0, 0.073]}>
            <circleGeometry args={[0.036, 24]} />
          </mesh>
          <mesh material={led} position={[0.16, 0, 0.072]}>
            <circleGeometry args={[0.011, 10]} />
          </mesh>
        </group>
      </group>
    </group>
  );
}

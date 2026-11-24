import { useEffect, useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { RoundedBox } from "@react-three/drei";
import { MeshStandardMaterial } from "three";
import { smooth } from "./kit";
import { story } from "./story";
import { ContactShadow, DeskSurface, STILL_FINISH, StillTablet, TABLET, useDisplayMaterial, useDrawnTexture, useStillFinishes, useStillStudio } from "./still";

/*
 * Child Vaccination as a product still life (Phase 28; rebuilt in Phase 39 on
 * the still-life standard in still.tsx): a tablet on a low desk stand running
 * the scheduling system, and a printed vaccination record card on the desk in
 * front of it. Only what the project describes is shown (see portfolio.ts):
 * vaccination schedules, date-based scheduling and automated alerts. All
 * content is fictional and non-identifiable — the child's name and date of
 * birth are blank placeholder bars, and doses are numbered, never named, so
 * nothing reads as a patient record or as medical advice. The scene keeps its
 * ILLUSTRATION label.
 *
 * Phase 39: lit by STILL_STUDIO with STILL_FINISH materials, the same baked
 * studio as InsightGen, Profexia, FaceAttend and Revo (no further bake). The
 * shared StillTablet is used as it is; the pen of Phase 28 is gone, so the
 * card is the only object beside the tablet.
 *
 * Scroll story (lp, reversible): the screen wakes on the child's record → the
 * schedule lists the doses given → the upcoming doses follow, the next one
 * marked due → an automated reminder for it, which is the state held while
 * the project is read. The card is the paper side of the same record: the
 * doses given are ticked by hand and the next due date (dose 3, 28 Mar) is
 * ringed, the date the tablet reminds about.
 */

const I = 3;
// Same timing helpers as the other compositions (ProjectGallery.tsx).
const lp = () => Math.min(2, Math.max(0, story.project - I + 1));
const phase = (a: number, b: number) => smooth((Math.min(lp(), 1) - a) / (b - a));

/** Interface states, each shown from its scroll threshold onwards. */
const STEPS = [0.3, 0.44, 0.58, 0.74];

/* A light, calm clinical UI: pearl and white, a muted sage for what is done, brass for what is due. */
const C = {
  bg: "#e9ecea",
  bar: "#f6f7f6",
  panel: "#ffffff",
  line: "#dde1df",
  bars: "#c9cfcc",
  text: "#24282c",
  dim: "#6f767b",
  faint: "#a3a9ad",
  sage: "#447366",
  sageSoft: "#d5e4df",
  brass: "#9a7234",
  brassSoft: "#f1e4cc",
};

const FONT = `"Segoe UI", Inter, Arial, sans-serif`;
function rr(g: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number, fill: string) {
  g.fillStyle = fill;
  g.beginPath();
  g.roundRect(x, y, w, h, r);
  g.fill();
}
function label(g: CanvasRenderingContext2D, s: string, x: number, y: number, px: number, color: string, weight = 600, align: CanvasTextAlign = "left") {
  g.font = `${weight} ${px}px ${FONT}`;
  g.fillStyle = color;
  g.textAlign = align;
  g.textBaseline = "middle";
  g.fillText(s, x, y);
  g.textAlign = "left";
}
const bar = (g: CanvasRenderingContext2D, x: number, y: number, w: number, color: string, h = 8) => rr(g, x, y, w, h, h / 2, color);

/** A status chip sized to its text; returns its width. */
function chip(g: CanvasRenderingContext2D, s: string, x: number, y: number, fill: string, color: string, hollow = false) {
  g.font = `700 11px ${FONT}`;
  const w = g.measureText(s).width + 18;
  if (hollow) {
    g.strokeStyle = color;
    g.lineWidth = 1.3;
    g.beginPath();
    g.roundRect(x + 0.65, y + 0.65, w - 1.3, 20.7, 10.35);
    g.stroke();
  } else rr(g, x, y, w, 22, 11, fill);
  label(g, s, x + 9, y + 11.5, 11, color, 700);
  return w;
}

function tick(g: CanvasRenderingContext2D, x: number, y: number, s: number, color: string) {
  g.strokeStyle = color;
  g.lineWidth = 2.2;
  g.lineCap = "round";
  g.lineJoin = "round";
  g.beginPath();
  g.moveTo(x - s * 0.5, y);
  g.lineTo(x - s * 0.12, y + s * 0.4);
  g.lineTo(x + s * 0.55, y - s * 0.4);
  g.stroke();
}

function bell(g: CanvasRenderingContext2D, x: number, y: number, s: number, color: string) {
  g.fillStyle = color;
  g.beginPath();
  g.moveTo(x - s, y + s * 0.55);
  g.quadraticCurveTo(x - s * 0.72, y + s * 0.3, x - s * 0.72, y - s * 0.1);
  g.quadraticCurveTo(x - s * 0.7, y - s * 0.86, x, y - s * 0.9);
  g.quadraticCurveTo(x + s * 0.7, y - s * 0.86, x + s * 0.72, y - s * 0.1);
  g.quadraticCurveTo(x + s * 0.72, y + s * 0.3, x + s, y + s * 0.55);
  g.closePath();
  g.fill();
  g.beginPath();
  g.arc(x, y + s * 0.78, s * 0.22, 0, Math.PI * 2);
  g.fill();
}

/** A child: a generic head-and-shoulders in a disc (nobody in particular). */
function avatar(g: CanvasRenderingContext2D, x: number, y: number, r: number) {
  g.save();
  g.beginPath();
  g.arc(x, y, r, 0, Math.PI * 2);
  g.fillStyle = C.sageSoft;
  g.fill();
  g.clip();
  g.fillStyle = "#9fbab1";
  g.beginPath();
  g.arc(x, y - r * 0.16, r * 0.36, 0, Math.PI * 2);
  g.fill();
  g.beginPath();
  g.ellipse(x, y + r * 0.8, r * 0.68, r * 0.5, 0, 0, Math.PI * 2);
  g.fill();
  g.restore();
}

/* One fictional child's schedule; the dates match the printed card. "Today" is 25 March. */
const DOSES = [
  { dose: "Dose 1", date: "04 Jan", state: "given" },
  { dose: "Dose 2", date: "15 Feb", state: "given" },
  { dose: "Dose 3", date: "28 Mar", state: "due" },
  { dose: "Dose 4", date: "09 May", state: "upcoming" },
  { dose: "Dose 5", date: "20 Jun", state: "upcoming" },
] as const;

/** The scheduling app at a given step (0 = off … 4 = reminder). */
function drawSchedule(step: number) {
  return (g: CanvasRenderingContext2D, w: number, h: number) => {
    g.fillStyle = C.bg;
    g.fillRect(0, 0, w, h);
    if (step < 1) return;
    // App bar
    rr(g, 0, 0, w, 44, 0, C.bar);
    rr(g, 0, 44, w, 1, 0, C.line);
    rr(g, 16, 13, 18, 18, 4, C.sage);
    rr(g, 20, 20, 10, 7, 1.5, C.panel);
    label(g, "Vaccination schedule", 44, 22.5, 15, C.text, 700);

    // Left: the child's record
    const lx = 14;
    const ly = 58;
    const lw = 196;
    const lh = h - ly - 14;
    rr(g, lx, ly, lw, lh, 12, C.panel);
    label(g, "Child record", lx + 14, ly + 20, 12, C.dim, 700);
    avatar(g, lx + 38, ly + 64, 24);
    bar(g, lx + 72, ly + 54, 100, C.bars, 10);
    bar(g, lx + 72, ly + 72, 64, C.line, 8);
    rr(g, lx + 14, ly + 102, lw - 28, 1, 0, C.line);
    label(g, "Date of birth", lx + 14, ly + 122, 11, C.dim, 600);
    bar(g, lx + 14, ly + 134, 88, C.line, 8);
    label(g, "Next due", lx + 14, ly + 166, 11, C.dim, 600);
    if (step >= 3) {
      rr(g, lx + 14, ly + 178, lw - 28, 34, 9, C.brassSoft);
      label(g, "Dose 3 · 28 Mar", lx + 26, ly + 195.5, 14, C.brass, 700);
    } else bar(g, lx + 14, ly + 180, 96, C.line, 8);

    // The automated reminder for the next due dose
    if (step >= 4) {
      const ry = ly + lh - 76;
      rr(g, lx + 10, ry, lw - 20, 64, 10, "#faf3e6");
      rr(g, lx + 20, ry + 17, 30, 30, 15, C.brass);
      bell(g, lx + 35, ry + 31, 7, C.panel);
      label(g, "Reminder", lx + 60, ry + 24, 13, C.text, 700);
      label(g, "Dose 3 due in 3 days", lx + 60, ry + 42, 11, C.dim, 600);
    }

    // Right: the schedule, completed doses above the upcoming ones
    const sx = lx + lw + 12;
    const sw = w - sx - 14;
    rr(g, sx, ly, sw, lh, 12, C.panel);
    label(g, "Schedule", sx + 16, ly + 20, 14, C.text, 700);
    if (step < 2) return;
    const rowH = 56;
    DOSES.forEach((d, k) => {
      const done = d.state === "given";
      if (!done && step < 3) return;
      const y = ly + 40 + k * rowH;
      if (k > 0) rr(g, sx + 14, y - 4, sw - 28, 1, 0, C.line);
      const due = d.state === "due";
      if (due) rr(g, sx + 8, y + 2, sw - 16, rowH - 10, 9, "#faf6ee");
      // Status mark: filled with a tick when given, brass when due, outlined when upcoming.
      const mx = sx + 32;
      const my = y + rowH / 2 - 3;
      if (done) {
        rr(g, mx - 13, my - 13, 26, 26, 13, C.sage);
        tick(g, mx, my, 12, C.panel);
      } else if (due) {
        rr(g, mx - 13, my - 13, 26, 26, 13, C.brass);
      } else {
        g.strokeStyle = C.faint;
        g.lineWidth = 1.8;
        g.beginPath();
        g.arc(mx, my, 11.5, 0, Math.PI * 2);
        g.stroke();
      }
      label(g, d.dose, sx + 56, my - 8, 14, C.text, 700);
      label(g, d.date, sx + 56, my + 11, 12, C.dim, 600);
      const [text, fill, color, hollow] = done
        ? ["Given", C.sageSoft, C.sage, false]
        : due
          ? ["Due in 3 days", C.brassSoft, C.brass, false]
          : ["Upcoming", "", C.dim, true];
      g.font = `700 11px ${FONT}`;
      const cw = g.measureText(text).width + 18;
      chip(g, text, sx + sw - 18 - cw, my - 11, fill, color, hollow);
    });
  };
}

/** The printed record card: a fictional child, doses numbered, dates only. */
function drawCard(g: CanvasRenderingContext2D, w: number, h: number) {
  const ink = "#2c3036";
  const pen = "#34446a";
  g.fillStyle = "#f4efe5";
  g.fillRect(0, 0, w, h);
  rr(g, 0, 0, w, 10, 0, "#5f8a7e");
  label(g, "Vaccination record", 24, 38, 19, ink, 700);
  label(g, "Child", 24, 70, 10, "#7d7a72", 600);
  bar(g, 70, 66, 150, "#d9d3c6", 8);
  label(g, "Date of birth", 250, 70, 10, "#7d7a72", 600);
  bar(g, 330, 66, 96, "#d9d3c6", 8);
  // Table
  const top = 96;
  const rowH = 38;
  const cols = [24, 92, 236, 360];
  ["Dose", "Due date", "Given", "Next"].forEach((s, k) => label(g, s, cols[k], top + 12, 10, "#7d7a72", 700));
  g.fillStyle = "#cfc8b8";
  g.fillRect(24, top + 24, w - 48, 1.5);
  DOSES.forEach((d, k) => {
    const y = top + 26 + k * rowH;
    if (k > 0) {
      g.fillStyle = "#e3ddcf";
      g.fillRect(24, y, w - 48, 1);
    }
    const mid = y + rowH / 2;
    label(g, String(k + 1), cols[0] + 6, mid, 13, ink, 700);
    label(g, d.date, cols[1], mid, 13, ink, 600);
    if (d.state === "given") {
      // Given: a hand-written tick and initials.
      g.strokeStyle = pen;
      g.lineWidth = 2.2;
      g.lineCap = "round";
      g.beginPath();
      g.moveTo(cols[2] + 2, mid);
      g.lineTo(cols[2] + 8, mid + 6);
      g.lineTo(cols[2] + 20, mid - 8);
      g.stroke();
      g.lineWidth = 1.6;
      g.beginPath();
      g.moveTo(cols[2] + 30, mid + 3);
      g.bezierCurveTo(cols[2] + 36, mid - 9, cols[2] + 40, mid + 8, cols[2] + 48, mid - 4);
      g.bezierCurveTo(cols[2] + 52, mid - 9, cols[2] + 56, mid + 6, cols[2] + 64, mid);
      g.stroke();
    }
    if (d.state === "due") {
      // The next due date, ringed in pencil.
      g.strokeStyle = "#a57d3e";
      g.lineWidth = 1.8;
      g.beginPath();
      g.ellipse(cols[1] + 24, mid, 36, 13, -0.04, 0, Math.PI * 2);
      g.stroke();
      bar(g, cols[3], mid - 4, 46, "#e6dccb", 8);
    }
  });
}

/* Composition (stage units). The desk sits where the other still lifes' does. */
const DESK_Y = -1.05;
const LEAN = 0.5; // the stand's back rest, from vertical (the camera looks down here)
/** Printed cardstock, a little thicker than office paper; smaller than the tablet so it stays secondary. */
const CARD = { w: 1.45, d: 1.0, t: 0.012 };

export function VaccinationStill({ lite }: { lite: boolean }) {
  // The same studio bake as the other still lifes (still.tsx).
  const env = useStillStudio(lite);
  const mats = useStillFinishes(env, ["chassis", "bezel", "hinge", "paper"] as const);
  const screenTex = useDrawnTexture(600, 420, lite ? 1.6 : 2);
  const screen = useDisplayMaterial(screenTex.texture, env);
  // The card's printed face: the shared paper finish, with the print as its map.
  const cardTex = useDrawnTexture(480, 330, lite ? 1.5 : 2);
  const card = useMemo(() => {
    const f = STILL_FINISH.paper;
    return new MeshStandardMaterial({ map: cardTex.texture, roughness: f.roughness, metalness: 0, envMapIntensity: f.envMapIntensity });
  }, [cardTex]);
  useEffect(() => {
    card.envMap = env;
    card.needsUpdate = true;
  }, [card, env]);
  useEffect(() => {
    cardTex.paint(drawCard);
    return () => {
      card.dispose();
      cardTex.texture.dispose();
    };
  }, [card, cardTex]);
  // This scene's own instances: a graphite tablet body (as Revo's phones),
  // and restrained glass and screen reflections, since the camera looks down
  // onto the tablet and would otherwise see the overhead softbox across it.
  useEffect(() => {
    mats.chassis.color.set("#6f7175");
    mats.chassis.roughness = 0.34;
    mats.bezel.envMapIntensity = 0.45;
    screen.envMapIntensity = 0.25;
  }, [mats, screen]);
  const shown = useRef(-1);

  useFrame(() => {
    screen.emissiveIntensity = phase(0.14, 0.3) * 0.8 * (1 - story.calm * 0.3);
    const p = Math.min(lp(), 1);
    let step = 0;
    while (step < STEPS.length && p >= STEPS[step]) step++;
    if (step !== shown.current) {
      shown.current = step;
      screenTex.paint(drawSchedule(step));
    }
  });

  const TH = TABLET.h;
  const TT = TABLET.t;
  return (
    <group>
      {/* This chapter's camera looks down from above, so the line of sight to
          the stage's ILLUSTRATION label (below desk level) crosses the desk
          and the card's shadow. Both are transparent and write no depth;
          drawing them first (group render order) keeps them from being
          blended over the label. */}
      <group renderOrder={-1}>
        <DeskSurface y={DESK_Y} size={[10, 7]} env={env} color="#675e56" roughness={0.8} envMapIntensity={0.8} />
      </group>

      {/* The tablet on a low satin-black desk stand */}
      <group position={[-0.4, DESK_Y, 0.05]} rotation-y={0.1} scale={0.88}>
        <group renderOrder={-1}>
          <ContactShadow position={[0, 0.002, -0.3]} size={[TABLET.w + 0.5, 1.7]} opacity={0.85} />
        </group>
        <RoundedBox args={[1.5, 0.03, 1.05]} radius={0.012} smoothness={2} position={[0, 0.015, -0.3]} material={mats.hinge} />
        <RoundedBox args={[1.5, 0.08, 0.04]} radius={0.012} smoothness={2} position={[0, 0.07, TT + 0.04]} material={mats.hinge} />
        <group position={[0, 0.03, 0.02]} rotation-x={-LEAN}>
          <RoundedBox args={[1.2, 1.3, 0.03]} radius={0.012} smoothness={2} position={[0, 0.7, -0.016]} material={mats.hinge} />
          <group position={[0, TH / 2 + 0.005, TT / 2]}>
            <StillTablet body={mats.chassis} glass={mats.bezel} display={screen} />
          </group>
        </group>
      </group>

      {/* The printed record card, on the desk in front */}
      <group position={[1.45, DESK_Y, 0.6]} rotation-y={-0.32}>
        <group renderOrder={-1}>
          <ContactShadow position={[0, 0.002, 0]} size={[CARD.w + 0.25, CARD.d + 0.25]} opacity={0.7} />
        </group>
        <mesh position={[0, CARD.t / 2, 0]} material={mats.paper}>
          <boxGeometry args={[CARD.w, CARD.t, CARD.d]} />
        </mesh>
        <mesh position={[0, CARD.t + 0.001, 0]} rotation-x={-Math.PI / 2} material={card}>
          <planeGeometry args={[CARD.w, CARD.d]} />
        </mesh>
      </group>
    </group>
  );
}

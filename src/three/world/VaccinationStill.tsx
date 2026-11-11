import { useEffect, useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { RoundedBox } from "@react-three/drei";
import { MeshStandardMaterial } from "three";
import { smooth } from "./kit";
import { story } from "./story";
import { ContactShadow, DeskSurface, FINISH, StillTablet, TABLET, useDisplayMaterial, useDrawnTexture, useFinishes, useProductStudio } from "./still";

/*
 * Child Vaccination as a product still life (Phase 28): a tablet on a desk
 * stand running the scheduling system, and a printed vaccination record card
 * with a pen beside it. Only what the project describes is shown (see
 * portfolio.ts): vaccination schedules, date-based scheduling and automated
 * alerts. All content is fictional and non-identifiable — names are blank
 * placeholder bars and doses are numbered, never named, so nothing reads as a
 * patient record or as medical advice. The scene keeps its ILLUSTRATION label.
 *
 * Scroll story (lp, reversible): the screen wakes on the month → scheduled
 * doses appear on their dates → the upcoming doses are listed → an automated
 * reminder for the next due dose, which is the state held while the project
 * is read. The card's next due date (dose 3, 28 Mar) is the date the tablet
 * highlights and reminds about.
 */

const I = 3;
// Same timing helpers as the other compositions (ProjectGallery.tsx).
const lp = () => Math.min(2, Math.max(0, story.project - I + 1));
const phase = (a: number, b: number) => smooth((Math.min(lp(), 1) - a) / (b - a));

/** Interface states, each shown from its scroll threshold onwards. */
const STEPS = [0.3, 0.44, 0.58, 0.74];

/* A light, calm clinical UI: pearl and white, a muted sage, brass for what is due. */
const C = {
  bg: "#e9ecea",
  bar: "#f6f7f6",
  panel: "#ffffff",
  line: "#dde1df",
  text: "#24282c",
  dim: "#7a8186",
  faint: "#b4b9bc",
  sage: "#4c7c70",
  sageSoft: "#d5e4df",
  brass: "#a57d3e",
  brassSoft: "#f1e4cc",
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
const bar = (g: CanvasRenderingContext2D, x: number, y: number, w: number, color: string, h = 7) => rr(g, x, y, w, h, h / 2, color);

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

/* Fictional month: 1 March on a Monday, "today" the 25th. */
const TODAY = 25;
const DONE = [4, 11, 19]; // doses given this month
const NEXT = 28; // dose 3 — the card's next due date
const LATER = [31];
const UPCOMING = [
  { day: "28", month: "MAR", dose: "Dose 3", soon: true },
  { day: "31", month: "MAR", dose: "Dose 1", soon: false },
  { day: "02", month: "APR", dose: "Dose 2", soon: false },
];

/** The scheduling app at a given step (0 = off … 4 = reminder). */
function drawSchedule(step: number) {
  return (g: CanvasRenderingContext2D, w: number, h: number) => {
    g.fillStyle = C.bg;
    g.fillRect(0, 0, w, h);
    if (step < 1) return;
    // App bar
    rr(g, 0, 0, w, 42, 0, C.bar);
    rr(g, 0, 42, w, 1, 0, C.line);
    rr(g, 16, 12, 18, 18, 4, C.sage);
    rr(g, 20, 19, 10, 7, 1.5, C.panel);
    label(g, "Vaccination schedule", 44, 21, 14, C.text, 700);
    rr(g, w - 34, 12, 18, 18, 9, C.sageSoft);

    // Month calendar
    const cx = 16;
    const cy = 56;
    const cw = 362;
    rr(g, cx, cy, cw, h - cy - 14, 10, C.panel);
    label(g, "March", cx + 14, cy + 20, 14, C.text, 700);
    label(g, "‹", cx + cw - 52, cy + 20, 15, C.dim, 600);
    label(g, "›", cx + cw - 26, cy + 20, 15, C.dim, 600);
    const col = (cw - 20) / 7;
    const row = 56;
    "MTWTFSS".split("").forEach((d, k) => label(g, d, cx + 10 + col * (k + 0.5), cy + 46, 9, C.faint, 700, "center"));
    for (let day = 1; day <= 31; day++) {
      const n = day - 1;
      const x = cx + 10 + (n % 7) * col;
      const y = cy + 58 + Math.floor(n / 7) * row;
      const due = step >= 2 && day === NEXT;
      rr(g, x + 2, y, col - 4, row - 4, 6, due ? C.brassSoft : day === TODAY ? "#f1f4f2" : "#fafbfa");
      if (day === TODAY) {
        g.strokeStyle = C.sage;
        g.lineWidth = 1.5;
        g.beginPath();
        g.roundRect(x + 2.75, y + 0.75, col - 5.5, row - 5.5, 6);
        g.stroke();
      }
      label(g, String(day), x + 9, y + 11, 10, day === TODAY ? C.sage : C.dim, day === TODAY ? 700 : 600);
      if (step < 2) continue;
      // Scheduled doses: given (filled), next due (brass), later (outlined).
      const [dx, dy] = [x + col / 2, y + 34];
      if (DONE.includes(day)) {
        rr(g, dx - 5, dy - 5, 10, 10, 5, C.sage);
      } else if (due) {
        rr(g, dx - 6, dy - 6, 12, 12, 6, C.brass);
      } else if (LATER.includes(day)) {
        g.strokeStyle = C.sage;
        g.lineWidth = 1.6;
        g.beginPath();
        g.arc(dx, dy, 4.5, 0, Math.PI * 2);
        g.stroke();
      }
    }
    if (step < 3) return;

    // Upcoming doses, by date
    const px = cx + cw + 12;
    const pw = w - px - 16;
    rr(g, px, cy, pw, h - cy - 14, 10, C.panel);
    label(g, "Upcoming", px + 14, cy + 20, 13, C.text, 700);
    UPCOMING.forEach((u, k) => {
      const y = cy + 38 + k * 62;
      rr(g, px + 10, y, pw - 20, 54, 8, k === 0 ? "#faf6ee" : "#f7f8f7");
      rr(g, px + 18, y + 7, 38, 40, 7, u.soon ? C.brassSoft : C.sageSoft);
      label(g, u.day, px + 37, y + 22, 13, u.soon ? C.brass : C.sage, 700, "center");
      label(g, u.month, px + 37, y + 37, 7, u.soon ? C.brass : C.sage, 700, "center");
      label(g, u.dose, px + 66, y + 18, 11, C.text, 700);
      bar(g, px + 66, y + 32, pw * 0.38, C.line, 7);
    });
    if (step < 4) return;

    // Automated alert for the next due dose
    const ty = cy + 38 + 3 * 62 + 4;
    rr(g, px + 10, ty, pw - 20, h - ty - 24, 8, C.brassSoft);
    rr(g, px + 18, ty + 10, 30, 30, 15, C.brass);
    bell(g, px + 33, ty + 24, 7, C.panel);
    label(g, "Reminder", px + 58, ty + 18, 11, C.text, 700);
    label(g, "Dose 3 due in 3 days", px + 58, ty + 33, 9, C.dim, 600);
  };
}

/** The printed record card: a fictional child, doses numbered, dates only. */
function drawCard(g: CanvasRenderingContext2D, w: number, h: number) {
  const ink = "#2c3036";
  const pen = "#34446a";
  g.fillStyle = "#f5f1e8";
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
  const dates = ["04 Jan", "15 Feb", "28 Mar", "09 May", "20 Jun"];
  dates.forEach((d, k) => {
    const y = top + 26 + k * rowH;
    if (k > 0) {
      g.fillStyle = "#e3ddcf";
      g.fillRect(24, y, w - 48, 1);
    }
    const mid = y + rowH / 2;
    label(g, String(k + 1), cols[0] + 6, mid, 13, ink, 700);
    label(g, d, cols[1], mid, 13, ink, 600);
    if (k < 2) {
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
    if (k === 2) {
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
const CARD = { w: 1.6, d: 1.1, t: 0.008 };

export function VaccinationStill({ lite }: { lite: boolean }) {
  const env = useProductStudio(lite);
  const mats = useFinishes(env, ["aluminium", "glass", "graphite", "paper", "brass"] as const);
  const screenTex = useDrawnTexture(600, 420, lite ? 1.6 : 2);
  const screen = useDisplayMaterial(screenTex.texture, env);
  const cardTex = useDrawnTexture(480, 330, lite ? 1.5 : 2);
  const card = useMemo(() => {
    const f = FINISH.paper;
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
        <DeskSurface y={DESK_Y} size={[9, 6.5]} env={env} color="#6a6660" />
      </group>

      {/* The tablet on a low aluminium desk stand */}
      <group position={[-0.4, DESK_Y, 0.05]} rotation-y={0.1} scale={0.88}>
        <group renderOrder={-1}>
          <ContactShadow position={[0, 0.002, -0.3]} size={[TABLET.w + 0.7, 1.9]} opacity={0.75} />
        </group>
        <RoundedBox args={[1.5, 0.03, 1.05]} radius={0.012} smoothness={2} position={[0, 0.015, -0.3]} material={mats.aluminium} />
        <RoundedBox args={[1.5, 0.08, 0.04]} radius={0.012} smoothness={2} position={[0, 0.07, TT + 0.04]} material={mats.aluminium} />
        <group position={[0, 0.03, 0.02]} rotation-x={-LEAN}>
          <RoundedBox args={[1.2, 1.3, 0.03]} radius={0.012} smoothness={2} position={[0, 0.7, -0.016]} material={mats.aluminium} />
          <group position={[0, TH / 2 + 0.005, TT / 2]}>
            <StillTablet body={mats.aluminium} glass={mats.glass} display={screen} />
          </group>
        </group>
      </group>

      {/* The printed record card and a pen, on the desk in front */}
      <group position={[1.45, DESK_Y, 0.6]} rotation-y={-0.32}>
        <group renderOrder={-1}>
          <ContactShadow position={[0, 0.002, 0]} size={[CARD.w + 0.3, CARD.d + 0.3]} opacity={0.55} />
        </group>
        <mesh position={[0, CARD.t / 2, 0]} material={mats.paper}>
          <boxGeometry args={[CARD.w, CARD.t, CARD.d]} />
        </mesh>
        <mesh position={[0, CARD.t + 0.001, 0]} rotation-x={-Math.PI / 2} material={card}>
          <planeGeometry args={[CARD.w, CARD.d]} />
        </mesh>
        {/* Pen: graphite barrel, brass clip and tip */}
        <group position={[0.15, 0.03, 0.78]} rotation-y={0.35}>
          <mesh rotation-z={Math.PI / 2} material={mats.graphite}>
            <cylinderGeometry args={[0.028, 0.028, 1.1, 16]} />
          </mesh>
          <mesh rotation-z={Math.PI / 2} position={[-0.6, 0, 0]} material={mats.brass}>
            <coneGeometry args={[0.028, 0.1, 16]} />
          </mesh>
          <mesh position={[0.36, 0.03, 0]} material={mats.brass}>
            <boxGeometry args={[0.3, 0.012, 0.016]} />
          </mesh>
        </group>
      </group>
    </group>
  );
}

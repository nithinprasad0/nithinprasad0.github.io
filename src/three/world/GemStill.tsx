import { useEffect, useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { RoundedBox } from "@react-three/drei";
import { MeshStandardMaterial } from "three";
import { smooth } from "./kit";
import { story } from "./story";
import { ContactShadow, DeskSurface, FINISH, PHONE, StillPhone, useDisplayMaterial, useDrawnTexture, useFinishes, useProductStudio } from "./still";

/*
 * GEM Business Applications as a product still life (Phase 30): the two
 * role-specific Android apps on phones standing in one desk dock, and a
 * printed bill on a clipboard beside them. Only what the approved GEM Group
 * details describe is shown (see portfolio.ts): employees record customer
 * orders and payment collections along their route; administrators monitor
 * orders and collections, export the data and update delivery routes, which
 * are pushed to the employee apps; and a Windows .NET connector retrieves
 * order data from Firebase for bill entry in TallyPrime — represented only
 * by the printed bill, never as an automated accounting step. Names, items
 * and amounts are blank placeholder bars and the order reference is
 * fictional; the scene keeps its ILLUSTRATION label.
 *
 * Scroll story (lp, reversible): both apps wake → the employee records an
 * order at the current stop → it appears at the top of the admin's order
 * monitor → the admin sends a route update, which arrives on the employee's
 * phone; that is the state held while the project is read. The bill on the
 * clipboard carries the same order reference.
 */

const I = 5;
// Same timing helpers as the other compositions (ProjectGallery.tsx).
const lp = () => Math.min(2, Math.max(0, story.project - I + 1));
const phase = (a: number, b: number) => smooth((Math.min(lp(), 1) - a) / (b - a));

/** Interface states, each shown from its scroll threshold onwards. */
const STEPS = [0.3, 0.44, 0.58, 0.72];
const stepAt = () => {
  const p = Math.min(lp(), 1);
  let s = 0;
  while (s < STEPS.length && p >= STEPS[s]) s++;
  return s;
};

const ORDER = "ORD-1042"; // fictional

/* Warm graphite UI with champagne and brass (GEM's chapter). */
const C = {
  bg: "#141210",
  bar: "#1a1714",
  panel: "#211d19",
  raised: "#2b2621",
  line: "#3a332b",
  bars: "#5a5046",
  text: "#ece4d8",
  dim: "#9a8f80",
  brass: "#d2ab6c",
  brassDeep: "#3d3020",
  sage: "#8fb49f",
  sageDeep: "#22302a",
};

function rr(g: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number, fill: string) {
  g.fillStyle = fill;
  g.beginPath();
  g.roundRect(x, y, w, h, r);
  g.fill();
}
function label(g: CanvasRenderingContext2D, s: string, x: number, y: number, px: number, color: string, weight = 600, align: CanvasTextAlign = "left") {
  g.font = `${weight} ${px}px Roboto, Inter, Arial, sans-serif`;
  g.fillStyle = color;
  g.textAlign = align;
  g.textBaseline = "middle";
  g.fillText(s, x, y);
  g.textAlign = "left";
}
const bar = (g: CanvasRenderingContext2D, x: number, y: number, w: number, color: string, h = 7) => rr(g, x, y, w, h, h / 2, color);

function statusBar(g: CanvasRenderingContext2D, w: number) {
  label(g, "9:41", 18, 14, 10, C.dim, 600);
  rr(g, w - 44, 9, 26, 10, 3, C.line);
}
function chip(g: CanvasRenderingContext2D, s: string, x: number, y: number, fill: string, color: string) {
  g.font = `700 9px Roboto, Inter, Arial, sans-serif`;
  const w = g.measureText(s).width + 18;
  rr(g, x, y, w, 18, 9, fill);
  label(g, s, x + 9, y + 9.5, 9, color, 700);
  return w;
}
function tick(g: CanvasRenderingContext2D, x: number, y: number, color: string) {
  g.strokeStyle = color;
  g.lineWidth = 2;
  g.lineCap = "round";
  g.beginPath();
  g.moveTo(x - 4, y);
  g.lineTo(x - 1, y + 3);
  g.lineTo(x + 5, y - 4);
  g.stroke();
}
function nav(g: CanvasRenderingContext2D, w: number, h: number, items: string[]) {
  rr(g, 0, h - 50, w, 50, 0, C.bar);
  items.forEach((s, k) => {
    const x = (w / items.length) * (k + 0.5);
    rr(g, x - 8, h - 40, 16, 16, 5, k === 0 ? C.brass : C.line);
    label(g, s, x, h - 14, 8, k === 0 ? C.text : C.dim, 600, "center");
  });
}

/** Employee app: today's route, orders and collections at each stop. */
function drawEmployee(step: number) {
  return (g: CanvasRenderingContext2D, w: number, h: number) => {
    g.fillStyle = C.bg;
    g.fillRect(0, 0, w, h);
    if (step < 1) return;
    statusBar(g, w);
    label(g, "Today's route", 18, 48, 18, C.text, 700);
    label(g, "Employee", 18, 70, 10, C.dim, 600);
    let y = 90;
    if (step >= 4) {
      // The administrator's route update, pushed to this app.
      rr(g, 12, y, w - 24, 46, 10, C.brassDeep);
      rr(g, 24, y + 13, 20, 20, 10, C.brass);
      label(g, "↻", 34, y + 23.5, 12, C.brassDeep, 700, "center");
      label(g, "Route updated", 54, y + 17, 11, C.text, 700);
      label(g, "by admin · 1 stop added", 54, y + 32, 9, C.dim, 600);
      y += 56;
    }
    const stops = step >= 4 ? 4 : 3;
    for (let k = 0; k < stops; k++) {
      const done = k === 0 || (k === 1 && step >= 2);
      const current = (k === 1 && step < 2) || (k === 2 && step >= 2);
      const added = k === 3;
      rr(g, 12, y, w - 24, 88, 12, current ? C.raised : C.panel);
      // Stop number on the route line
      rr(g, 22, y + 14, 24, 24, 12, done ? C.sageDeep : current ? C.brass : C.raised);
      if (done) tick(g, 34, y + 26, C.sage);
      else label(g, String(k + 1), 34, y + 26.5, 11, current ? C.brassDeep : C.dim, 700, "center");
      bar(g, 56, y + 18, w * 0.42, done ? C.bars : "#7a6d5c", 8);
      bar(g, 56, y + 32, w * 0.28, C.line, 6);
      let x = 56;
      if (k === 1 && step >= 2) {
        x += chip(g, ORDER, x, y + 52, C.brassDeep, C.brass) + 6;
        chip(g, "Collection", x, y + 52, C.sageDeep, C.sage);
      } else if (k === 0) {
        x += chip(g, "Order", x, y + 52, C.raised, C.dim) + 6;
        chip(g, "Collection", x, y + 52, C.raised, C.dim);
      } else if (current) {
        rr(g, 56, y + 50, 84, 24, 12, C.brass);
        label(g, "New order", 98, y + 62.5, 10, "#1a140c", 700, "center");
      } else if (added) {
        chip(g, "Added", 56, y + 52, C.brassDeep, C.brass);
      }
      y += 96;
    }
    nav(g, w, h, ["Route", "Orders", "Collect"]);
  };
}

/** Admin app: order and collection monitoring, routes, data export. */
function drawAdmin(step: number) {
  return (g: CanvasRenderingContext2D, w: number, h: number) => {
    g.fillStyle = C.bg;
    g.fillRect(0, 0, w, h);
    if (step < 1) return;
    statusBar(g, w);
    label(g, "Admin", 18, 48, 18, C.text, 700);
    rr(g, w - 82, 36, 64, 24, 12, C.raised);
    label(g, "Export", w - 50, 48.5, 10, C.text, 600, "center");
    // Monitoring tabs
    ["Orders", "Collections"].forEach((s, k) => {
      const x = 18 + k * 74;
      label(g, s, x, 84, 11, k === 0 ? C.text : C.dim, k === 0 ? 700 : 500);
      if (k === 0) rr(g, x, 94, 44, 3, 1.5, C.brass);
    });
    rr(g, 12, 100, w - 24, 1, 0, C.line);
    const rows = step >= 3 ? [ORDER, "", "", ""] : ["", "", "", ""];
    rows.forEach((ref, k) => {
      const y = 110 + k * 52;
      const fresh = ref !== "";
      rr(g, 12, y, w - 24, 44, 10, fresh ? C.brassDeep : C.panel);
      rr(g, 22, y + 11, 22, 22, 11, C.raised);
      if (fresh) label(g, ref, 54, y + 15, 10, C.brass, 700);
      else bar(g, 54, y + 12, w * 0.3, C.bars, 7);
      bar(g, 54, y + 28, w * 0.22, C.line, 6);
      bar(g, w - 70, y + 18, 44, fresh ? "#8a7350" : C.line, 7);
    });
    // Delivery routes
    const ry = 110 + 4 * 52 + 14;
    label(g, "Routes", 18, ry, 11, C.dim, 700);
    rr(g, 12, ry + 12, w - 24, 92, 12, C.panel);
    [0, 1, 2].forEach((k) => {
      const y = ry + 30 + k * 22;
      rr(g, 24, y - 4, 8, 8, 4, k === 2 && step >= 4 ? C.brass : C.bars);
      if (k < 2) rr(g, 27, y + 4, 2, 14, 1, C.line);
      bar(g, 40, y - 3, w * (0.36 - k * 0.05), C.line, 6);
    });
    if (step >= 4) {
      chip(g, "Sent to employee", w - 128, ry + 76, C.sageDeep, C.sage);
    } else {
      rr(g, w - 104, ry + 72, 80, 24, 12, C.brass);
      label(g, "Update", w - 64, ry + 84.5, 10, "#1a140c", 700, "center");
    }
    nav(g, w, h, ["Monitor", "Routes", "Data"]);
  };
}

/** The printed bill: an invoice for the same (fictional) order. */
function drawBill(g: CanvasRenderingContext2D, w: number, h: number) {
  const ink = "#2b2824";
  const soft = "#8a8378";
  g.fillStyle = "#f4f0e7";
  g.fillRect(0, 0, w, h);
  label(g, "Invoice", 28, 92, 24, ink, 700);
  label(g, `Order ref  ${ORDER}`, 28, 122, 12, soft, 600);
  bar(g, w - 150, 86, 122, "#d8d1c3", 9);
  bar(g, w - 110, 106, 82, "#e2dccf", 7);
  label(g, "Customer", 28, 158, 11, soft, 600);
  bar(g, 28, 172, 170, "#d8d1c3", 9);
  // Line items
  const top = 214;
  const cols = [28, 196, 252, w - 28];
  ["Item", "Qty", "Rate", "Amount"].forEach((s, k) => label(g, s, cols[k], top, 11, soft, 700, k === 3 ? "right" : "left"));
  g.fillStyle = "#cfc7b6";
  g.fillRect(28, top + 12, w - 56, 1.5);
  for (let k = 0; k < 5; k++) {
    const y = top + 34 + k * 30;
    bar(g, 28, y - 4, 120 - (k % 3) * 22, "#ddd6c8", 8);
    bar(g, cols[1], y - 4, 22, "#ddd6c8", 8);
    bar(g, cols[2], y - 4, 40, "#ddd6c8", 8);
    bar(g, cols[3] - 52, y - 4, 52, "#ddd6c8", 8);
  }
  const ty = top + 34 + 5 * 30 + 6;
  g.fillStyle = "#cfc7b6";
  g.fillRect(28, ty, w - 56, 1.5);
  label(g, "Total", cols[2], ty + 24, 13, ink, 700);
  bar(g, cols[3] - 70, ty + 19, 70, "#b9ae9a", 10);
}

/* Composition (stage units). GEM's camera is the widest and lowest of the
   gallery, so everything stands up and is built larger than the other
   still lifes. */
const DESK_Y = -1.05;
const S = 1.38; // phone scale
const PH = PHONE.h * S;
const PT = PHONE.t * S;
const LEAN = 0.2; // the dock's back rests, from vertical
const BOARD = { w: 1.75, h: 2.35, t: 0.04 };

function DockedPhone({ x, body, glass, display, rest }: { x: number; body: MeshStandardMaterial; glass: MeshStandardMaterial; display: MeshStandardMaterial; rest: MeshStandardMaterial }) {
  return (
    <group position={[x, 0.07, 0.04]} rotation-x={-LEAN}>
      <RoundedBox args={[0.82, 1.3, 0.03]} radius={0.012} smoothness={2} position={[0, 0.7, -0.016]} material={rest} />
      <group position={[0, PH / 2 + 0.005, PT / 2]} scale={S}>
        <StillPhone body={body} glass={glass} display={display} />
      </group>
    </group>
  );
}

export function GemStill({ lite }: { lite: boolean }) {
  const env = useProductStudio(lite);
  const mats = useFinishes(env, ["aluminium", "keys", "glass", "brass"] as const);
  const empTex = useDrawnTexture(280, 580, lite ? 1.3 : 1.6);
  const admTex = useDrawnTexture(280, 580, lite ? 1.3 : 1.6);
  const emp = useDisplayMaterial(empTex.texture, env);
  const adm = useDisplayMaterial(admTex.texture, env);
  const billTex = useDrawnTexture(400, 520, lite ? 1.2 : 1.6);
  const bill = useMemo(() => {
    const f = FINISH.paper;
    return new MeshStandardMaterial({ map: billTex.texture, roughness: f.roughness, metalness: 0, envMapIntensity: f.envMapIntensity });
  }, [billTex]);
  useEffect(() => {
    bill.envMap = env;
    bill.needsUpdate = true;
  }, [bill, env]);
  useEffect(() => {
    billTex.paint(drawBill);
    return () => {
      bill.dispose();
      billTex.texture.dispose();
    };
  }, [bill, billTex]);
  const shown = useRef(-1);

  useFrame(() => {
    const on = phase(0.14, 0.3) * 1.1 * (1 - story.calm * 0.3);
    emp.emissiveIntensity = on;
    adm.emissiveIntensity = on;
    const s = stepAt();
    if (s !== shown.current) {
      shown.current = s;
      empTex.paint(drawEmployee(s));
      admTex.paint(drawAdmin(s));
    }
  });

  return (
    <group>
      {/* Desk and shadows draw before the stage labels (as in Phases 28–29). */}
      <group renderOrder={-1}>
        <DeskSurface y={DESK_Y} size={[11, 7]} env={env} color="#6b6158" />
      </group>

      {/* One aluminium dock, two role-specific phones */}
      <group position={[-1.15, DESK_Y, 0.1]} rotation-y={0.12}>
        <group renderOrder={-1}>
          <ContactShadow position={[0, 0.002, -0.15]} size={[3.6, 1.6]} opacity={0.8} />
        </group>
        <RoundedBox args={[3.0, 0.05, 1.0]} radius={0.02} smoothness={2} position={[0, 0.025, -0.2]} material={mats.aluminium} />
        <RoundedBox args={[3.0, 0.1, 0.05]} radius={0.015} smoothness={2} position={[0, 0.08, PT + 0.08]} material={mats.aluminium} />
        {/* Employee: a matte black field phone. Admin: aluminium. */}
        <DockedPhone x={-0.74} body={mats.keys} glass={mats.glass} display={emp} rest={mats.aluminium} />
        <DockedPhone x={0.74} body={mats.aluminium} glass={mats.glass} display={adm} rest={mats.aluminium} />
      </group>

      {/* The printed bill on a clipboard, standing on a slim easel */}
      <group position={[1.75, DESK_Y, 0.2]} rotation-y={-0.32}>
        <group renderOrder={-1}>
          <ContactShadow position={[0, 0.002, -0.3]} size={[2.2, 1.3]} opacity={0.65} />
        </group>
        <RoundedBox args={[0.06, 1.74, 0.05]} radius={0.015} smoothness={2} position={[0, 0.8, -0.76]} rotation-x={0.41} material={mats.aluminium} />
        <group position={[0, 0.02, 0]} rotation-x={-0.24}>
          <RoundedBox args={[BOARD.w, BOARD.h, BOARD.t]} radius={0.05} smoothness={3} position={[0, BOARD.h / 2, 0]} material={mats.keys} />
          <mesh material={bill} position={[0, BOARD.h / 2 - 0.08, BOARD.t / 2 + 0.003]}>
            <planeGeometry args={[BOARD.w - 0.16, (BOARD.w - 0.16) * 1.3]} />
          </mesh>
          <RoundedBox args={[0.72, 0.17, 0.07]} radius={0.03} smoothness={3} position={[0, BOARD.h - 0.12, BOARD.t / 2 + 0.03]} material={mats.brass} />
        </group>
      </group>
    </group>
  );
}

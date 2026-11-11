import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { RoundedBox } from "@react-three/drei";
import { smooth } from "./kit";
import { story } from "./story";
import { ContactShadow, DeskSurface, PHONE, StillPhone, useDisplayMaterial, useDrawnTexture, useFinishes, useProductStudio } from "./still";

/*
 * Revo as a product still life (Phase 26): two phones on a desk. The first
 * leans on a slim stand showing the community feed; the second lies beside it
 * showing moderation and access control. The screens follow the project's
 * stated scope only — content browsing, member profiles, interaction,
 * moderation and access control (Flutter app, Django backend) — as conceptual
 * interfaces: placeholder bars stand in for text, nothing is a screenshot, and
 * the scene keeps its ILLUSTRATION label.
 *
 * Scroll story (lp, reversible): the feed phone wakes → two posts arrive in
 * turn → a reaction lands → the moderation phone wakes → a reported post is
 * resolved → member access is reviewed.
 */

const I = 1;
// Same timing helpers as the other compositions (ProjectGallery.tsx).
const lp = () => Math.min(2, Math.max(0, story.project - I + 1));
const phase = (a: number, b: number) => smooth((Math.min(lp(), 1) - a) / (b - a));
const stepAt = (steps: number[]) => {
  const p = Math.min(lp(), 1);
  let s = 0;
  while (s < steps.length && p >= steps[s]) s++;
  return s;
};

/** Interface states, each shown from its scroll threshold onwards. */
const FEED_STEPS = [0.2, 0.3, 0.4, 0.52];
const MOD_STEPS = [0.62, 0.72, 0.8, 0.88];

/* Graphite screens with a muted plum accent (Revo's chapter) and one brass. */
const C = {
  bg: "#131215",
  bar: "#19171b",
  panel: "#211e24",
  raised: "#2b2730",
  line: "#3a353e",
  text: "#d5cfd6",
  dim: "#817a84",
  plum: "#b39cc8",
  plumDeep: "#3a3042",
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
const line = (g: CanvasRenderingContext2D, x: number, y: number, w: number, color = C.line, h = 6) => rr(g, x, y, w, h, h / 2, color);

/** A member: head and shoulders in a disc (no real people). */
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

function heart(g: CanvasRenderingContext2D, x: number, y: number, s: number, fill: string | null, stroke: string) {
  g.beginPath();
  g.moveTo(x, y + s * 0.35);
  g.bezierCurveTo(x - s * 0.9, y - s * 0.25, x - s * 0.45, y - s * 0.85, x, y - s * 0.38);
  g.bezierCurveTo(x + s * 0.45, y - s * 0.85, x + s * 0.9, y - s * 0.25, x, y + s * 0.35);
  if (fill) {
    g.fillStyle = fill;
    g.fill();
  } else {
    g.strokeStyle = stroke;
    g.lineWidth = 1.6;
    g.stroke();
  }
}

function bubble(g: CanvasRenderingContext2D, x: number, y: number, s: number, stroke: string) {
  g.strokeStyle = stroke;
  g.lineWidth = 1.6;
  g.beginPath();
  g.roundRect(x - s * 0.6, y - s * 0.45, s * 1.2, s * 0.8, s * 0.3);
  g.stroke();
}

function statusBar(g: CanvasRenderingContext2D, w: number) {
  line(g, 18, 12, 26, "#5a5560", 6);
  rr(g, w / 2 - 26, 8, 52, 14, 7, "#050506");
  rr(g, w - 44, 11, 26, 8, 3, "#5a5560");
}

const TONES = ["#8d7c96", "#9a8f84", "#7d8a93", "#a08a8f"];

/** The community feed at a given step (0 = just woken … 4 = a reaction lands). */
function drawFeed(step: number) {
  return (g: CanvasRenderingContext2D, w: number, h: number) => {
    g.fillStyle = C.bg;
    g.fillRect(0, 0, w, h);
    if (step < 1) return;
    statusBar(g, w);
    // Header and tabs: browsing content, and member profiles.
    label(g, "Revo", 18, 48, 20, C.text, 700);
    avatar(g, w - 32, 48, 14, TONES[0]);
    label(g, "Feed", 18, 84, 12, C.plum, 700);
    label(g, "Members", 74, 84, 12, C.dim, 600);
    rr(g, 18, 94, 32, 3, 1.5, C.plum);
    g.fillStyle = C.line;
    g.fillRect(0, 100, w, 1);
    // Posts: author, text, an optional image, and interaction (react, comment).
    let y = 112;
    const posts = [
      { media: true, lines: [0.8, 0.55] },
      { media: false, lines: [0.85, 0.7, 0.4] },
    ];
    posts.forEach((post, k) => {
      if (step < 2 + k) return;
      const ph = 62 + post.lines.length * 13 + (post.media ? 92 : 0) + 30;
      rr(g, 12, y, w - 24, ph, 12, C.panel);
      avatar(g, 34, y + 24, 13, TONES[(k + 1) % TONES.length]);
      line(g, 56, y + 16, 70 + k * 12, "#6a6470", 7);
      line(g, 56, y + 29, 38, C.line, 5);
      let ty = y + 50;
      post.lines.forEach((f) => {
        line(g, 24, ty, (w - 48) * f, "#58525d", 6);
        ty += 13;
      });
      if (post.media) {
        const grad = g.createLinearGradient(0, ty, 0, ty + 84);
        grad.addColorStop(0, "#2a2430");
        grad.addColorStop(1, "#1f1b23");
        rr(g, 24, ty + 2, w - 48, 82, 8, grad);
        ty += 92;
      }
      const reacted = k === 0 && step >= 4;
      heart(g, 32, ty + 13, 9, reacted ? C.brass : null, C.dim);
      line(g, 44, ty + 10, reacted ? 18 : 14, reacted ? "#8a7553" : C.line, 6);
      bubble(g, 82, ty + 13, 11, C.dim);
      line(g, 94, ty + 10, 12, C.line, 6);
      y += ph + 10;
    });
    // Navigation
    rr(g, 0, h - 50, w, 50, 0, C.bar);
    [0, 1, 2, 3].forEach((k) => rr(g, w * (0.14 + k * 0.24) - 9, h - 34, 18, 18, 9, k === 0 ? C.plum : C.line));
  };
}

/** Moderation and access control at a given step (0 = off … 4 = access changed). */
function drawModeration(step: number) {
  return (g: CanvasRenderingContext2D, w: number, h: number) => {
    g.fillStyle = C.bg;
    g.fillRect(0, 0, w, h);
    if (step < 1) return;
    statusBar(g, w);
    label(g, "Moderation", 18, 48, 18, C.text, 700);
    // Content: reported posts awaiting a decision.
    label(g, "Reported content", 18, 84, 11, C.dim, 600);
    [0, 1].forEach((k) => {
      const y = 98 + k * 92;
      const resolved = k === 0 && step >= 2;
      rr(g, 12, y, w - 24, 82, 12, C.panel);
      rr(g, 24, y + 12, 40, 40, 8, resolved ? "#1d1b20" : "#2a2430");
      line(g, 76, y + 18, w * 0.42, resolved ? C.line : "#6a6470", 7);
      line(g, 76, y + 33, w * 0.3, C.line, 6);
      if (resolved) {
        rr(g, 24, y + 58, 74, 16, 8, C.raised);
        label(g, "Removed", 36, y + 66, 9, C.dim, 600);
      } else {
        rr(g, w - 128, y + 56, 52, 20, 10, C.raised);
        label(g, "Keep", w - 116, y + 66, 9, C.text, 600);
        rr(g, w - 70, y + 56, 46, 20, 10, C.plumDeep);
        label(g, "Remove", w - 66, y + 66, 9, C.plum, 700);
      }
    });
    if (step < 3) return;
    // Access control: each member's role and access.
    label(g, "Access", 18, 296, 11, C.dim, 600);
    const roles = ["Admin", "Member", "Member"];
    roles.forEach((role, k) => {
      const y = 310 + k * 58;
      rr(g, 12, y, w - 24, 50, 12, C.panel);
      avatar(g, 36, y + 25, 13, TONES[k]);
      line(g, 58, y + 18, 64 + k * 10, "#6a6470", 7);
      rr(g, 58, y + 29, role === "Admin" ? 40 : 46, 13, 6.5, C.raised);
      label(g, role, 63, y + 36, 8, role === "Admin" ? C.brass : C.dim, 600);
      const on = !(k === 2 && step >= 4);
      rr(g, w - 66, y + 16, 36, 18, 9, on ? C.plumDeep : C.raised);
      rr(g, on ? w - 48 : w - 64, y + 18, 14, 14, 7, on ? C.plum : "#5a5560");
    });
  };
}

/* Composition (stage units). The desk sits where the other still life's does. */
const DESK_Y = -1.05;
const S = 1.4; // phone scale
const PH = PHONE.h * S;
const PT = PHONE.t * S;
const LEAN = 0.26; // the stand's back rest, from vertical

export function RevoStill({ lite }: { lite: boolean }) {
  const env = useProductStudio(lite);
  const mats = useFinishes(env, ["aluminium", "glass"] as const);
  const feedTex = useDrawnTexture(280, 580, lite ? 1.3 : 1.6);
  const modTex = useDrawnTexture(280, 580, lite ? 1.3 : 1.6);
  const feed = useDisplayMaterial(feedTex.texture, env);
  const mod = useDisplayMaterial(modTex.texture, env);
  const shown = useRef({ feed: -1, mod: -1 });

  useFrame(() => {
    const dim = 1 - story.calm * 0.3;
    feed.emissiveIntensity = phase(0.1, 0.24) * 1.15 * dim;
    mod.emissiveIntensity = phase(0.52, 0.66) * 1.15 * dim;
    const f = stepAt(FEED_STEPS);
    if (f !== shown.current.feed) {
      shown.current.feed = f;
      feedTex.paint(drawFeed(f));
    }
    const m = stepAt(MOD_STEPS);
    if (m !== shown.current.mod) {
      shown.current.mod = m;
      modTex.paint(drawModeration(m));
    }
  });

  return (
    <group>
      <DeskSurface y={DESK_Y} size={[9, 6.5]} env={env} color="#6e675f" />

      {/* The feed phone on a slim aluminium stand */}
      <group position={[-1.0, DESK_Y, 0.15]} rotation-y={0.16}>
        <ContactShadow position={[0, 0.002, -0.12]} size={[1.7, 1.5]} opacity={0.8} />
        <RoundedBox args={[1.0, 0.03, 0.85]} radius={0.012} smoothness={2} position={[0, 0.015, -0.16]} material={mats.aluminium} />
        <RoundedBox args={[1.0, 0.08, 0.04]} radius={0.012} smoothness={2} position={[0, 0.07, PT + 0.04]} material={mats.aluminium} />
        <group position={[0, 0.03, 0.02]} rotation-x={-LEAN}>
          <RoundedBox args={[0.8, 1.15, 0.03]} radius={0.012} smoothness={2} position={[0, 0.6, -0.016]} material={mats.aluminium} />
          <group position={[0, PH / 2 + 0.005, PT / 2]} scale={S}>
            <StillPhone body={mats.aluminium} glass={mats.glass} display={feed} />
          </group>
        </group>
      </group>

      {/* The moderation phone, lying on the desk beside it */}
      <group position={[1.3, DESK_Y, 0.35]} rotation-y={-0.32}>
        <ContactShadow position={[0, 0.002, 0]} size={[PHONE.w * S + 0.25, PH + 0.25]} opacity={0.9} />
        <group position={[0, PT / 2 + 0.004, 0]} rotation-x={-Math.PI / 2} scale={S}>
          <StillPhone body={mats.aluminium} glass={mats.glass} display={mod} />
        </group>
      </group>
    </group>
  );
}

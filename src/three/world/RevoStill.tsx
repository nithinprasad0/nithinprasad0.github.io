import { useEffect, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { RoundedBox } from "@react-three/drei";
import { smooth } from "./kit";
import { story } from "./story";
import { ContactShadow, DeskSurface, PHONE, StillPhone, useDisplayMaterial, useDrawnTexture, useStillFinishes, useStillStudio } from "./still";

/*
 * Revo as a product still life (Phase 26; rebuilt in Phase 38 on the
 * still-life standard in still.tsx): two phones on a desk showing two views
 * of the same community app. The first leans on a slim stand towards the
 * viewer with the feed; the second lies flat beside it, turned the other way,
 * with a member's profile. The screens follow the project's stated scope only
 * (see portfolio.ts) — content browsing, profiles, interaction, moderation
 * and access control (Flutter app, Django backend) — as conceptual
 * interfaces: post titles are sample content, names are placeholder bars,
 * there are no counts of any kind, nothing is a screenshot, and the scene
 * keeps its ILLUSTRATION label.
 *
 * Phase 38: lit by STILL_STUDIO with STILL_FINISH materials, the same baked
 * studio as InsightGen, Profexia and FaceAttend (no further bake). Both
 * phones are the shared StillPhone and share one set of material instances.
 *
 * Scroll story (lp, reversible): the feed phone wakes → two posts arrive in
 * turn → a reaction lands → the profile phone wakes on the author of the
 * first post → their posts appear → their role changes from Member to
 * Moderator (access control).
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
const PROFILE_STEPS = [0.62, 0.72, 0.8, 0.88];

/* Graphite screens with a muted plum accent (Revo's chapter) and one brass. */
const C = {
  bg: "#131215",
  bar: "#19171b",
  panel: "#211e24",
  raised: "#2b2730",
  line: "#3a353e",
  bars: "#5e5862",
  text: "#e2dce3",
  dim: "#8d8690",
  plum: "#bba5cf",
  plumDeep: "#3a3042",
  brass: "#d2ad72",
  brassDeep: "#3a3020",
};

const FONT = `"Segoe UI", Inter, Arial, sans-serif`;
function rr(g: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number, fill: string | CanvasGradient) {
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
    g.lineWidth = 1.8;
    g.stroke();
  }
}

function bubble(g: CanvasRenderingContext2D, x: number, y: number, s: number, stroke: string) {
  g.strokeStyle = stroke;
  g.lineWidth = 1.8;
  g.beginPath();
  g.roundRect(x - s * 0.6, y - s * 0.45, s * 1.2, s * 0.8, s * 0.3);
  g.stroke();
}

function statusBar(g: CanvasRenderingContext2D, w: number) {
  line(g, 18, 12, 26, "#5a5560", 6);
  rr(g, w / 2 - 26, 8, 52, 14, 7, "#050506");
  rr(g, w - 44, 11, 26, 8, 3, "#5a5560");
}

function nav(g: CanvasRenderingContext2D, w: number, h: number, active: number) {
  rr(g, 0, h - 50, w, 50, 0, C.bar);
  [0, 1, 2, 3].forEach((k) => rr(g, w * (0.14 + k * 0.24) - 9, h - 34, 18, 18, 9, k === active ? C.plum : C.line));
}

const TONES = ["#8d7c96", "#9a8f84", "#7d8a93", "#a08a8f"];

/** A sample photo: a soft gradient landscape (nothing real). */
function photo(g: CanvasRenderingContext2D, x: number, y: number, w: number, h: number) {
  g.save();
  g.beginPath();
  g.roundRect(x, y, w, h, 8);
  g.clip();
  const sky = g.createLinearGradient(0, y, 0, y + h);
  sky.addColorStop(0, "#3a3444");
  sky.addColorStop(1, "#5a4a50");
  g.fillStyle = sky;
  g.fillRect(x, y, w, h);
  g.fillStyle = "#2a2530";
  g.beginPath();
  g.moveTo(x, y + h * 0.75);
  g.lineTo(x + w * 0.3, y + h * 0.45);
  g.lineTo(x + w * 0.55, y + h * 0.68);
  g.lineTo(x + w * 0.78, y + h * 0.5);
  g.lineTo(x + w, y + h * 0.7);
  g.lineTo(x + w, y + h);
  g.lineTo(x, y + h);
  g.fill();
  g.fillStyle = "#c9a46a";
  g.beginPath();
  g.arc(x + w * 0.74, y + h * 0.28, h * 0.1, 0, Math.PI * 2);
  g.fill();
  g.restore();
}

/** The community feed at a given step (0 = just woken … 4 = a reaction lands). */
function drawFeed(step: number) {
  return (g: CanvasRenderingContext2D, w: number, h: number) => {
    g.fillStyle = C.bg;
    g.fillRect(0, 0, w, h);
    if (step < 1) return;
    statusBar(g, w);
    // Header and tabs: browsing content, and member profiles.
    label(g, "Revo", 18, 50, 22, C.text, 700);
    avatar(g, w - 32, 50, 14, TONES[0]);
    label(g, "Feed", 18, 86, 13, C.plum, 700);
    label(g, "Members", 70, 86, 13, C.dim, 600);
    rr(g, 18, 97, 32, 3, 1.5, C.plum);
    g.fillStyle = C.line;
    g.fillRect(0, 103, w, 1);
    // Posts: author, title, text, an optional photo, and interaction (react, comment).
    let y = 114;
    const posts = [
      { title: "Weekend photo walk", media: true, lines: [0.82, 0.5] },
      { title: "Ideas for the next meetup", media: false, lines: [0.86, 0.7, 0.42] },
    ];
    posts.forEach((post, k) => {
      if (step < 2 + k) return;
      const ph = 66 + post.lines.length * 13 + (post.media ? 98 : 0) + 30;
      rr(g, 12, y, w - 24, ph, 12, C.panel);
      avatar(g, 34, y + 24, 13, TONES[(k + 1) % TONES.length]);
      line(g, 56, y + 18, 70 + k * 12, "#6a6470", 7);
      line(g, 56, y + 30, 36, C.line, 5);
      label(g, post.title, 24, y + 56, 14, C.text, 700);
      let ty = y + 70;
      post.lines.forEach((f) => {
        line(g, 24, ty, (w - 48) * f, C.bars, 6);
        ty += 13;
      });
      if (post.media) {
        photo(g, 24, ty + 2, w - 48, 88);
        ty += 98;
      }
      const reacted = k === 0 && step >= 4;
      heart(g, 32, ty + 14, 10, reacted ? C.brass : null, C.dim);
      bubble(g, 62, ty + 14, 12, C.dim);
      y += ph + 10;
    });
    nav(g, w, h, 0);
  };
}

/** A member's profile at a given step (0 = off … 4 = made a moderator). */
function drawProfile(step: number) {
  return (g: CanvasRenderingContext2D, w: number, h: number) => {
    g.fillStyle = C.bg;
    g.fillRect(0, 0, w, h);
    if (step < 1) return;
    statusBar(g, w);
    // Back, title
    g.strokeStyle = C.text;
    g.lineWidth = 2;
    g.lineCap = "round";
    g.beginPath();
    g.moveTo(26, 43);
    g.lineTo(19, 50);
    g.lineTo(26, 57);
    g.stroke();
    label(g, "Profile", 38, 50, 16, C.text, 700);
    // The member (the first post's author): avatar, name, role.
    avatar(g, w / 2, 116, 36, TONES[1]);
    line(g, w / 2 - 50, 164, 100, "#6a6470", 9);
    line(g, w / 2 - 32, 180, 64, C.line, 6);
    const mod = step >= 4;
    const role = mod ? "Moderator" : "Member";
    g.font = `700 12px ${FONT}`;
    const cw = g.measureText(role).width + 22;
    rr(g, w / 2 - cw / 2, 196, cw, 22, 11, mod ? C.brassDeep : C.raised);
    label(g, role, w / 2, 207.5, 12, mod ? C.brass : C.dim, 700, "center");
    // Their posts
    label(g, "Posts", 18, 246, 13, C.plum, 700);
    label(g, "About", 70, 246, 13, C.dim, 600);
    rr(g, 18, 257, 34, 3, 1.5, C.plum);
    g.fillStyle = C.line;
    g.fillRect(0, 263, w, 1);
    const posts = [
      { title: "Weekend photo walk", media: true },
      { title: "Favourite reading spots", media: false },
    ];
    posts.forEach((p, k) => {
      if (step < 2 + k) return;
      const y = 274 + k * 84;
      rr(g, 12, y, w - 24, 74, 12, C.panel);
      label(g, p.title, 24, y + 22, 13, C.text, 700);
      line(g, 24, y + 40, p.media ? 150 : 190, C.bars, 6);
      line(g, 24, y + 53, p.media ? 100 : 130, C.line, 6);
      if (p.media) photo(g, w - 74, y + 14, 50, 46);
    });
    nav(g, w, h, 1);
  };
}

/* Composition (stage units). The desk sits where the other still lifes' does. */
const DESK_Y = -1.05;
const S = 1.4; // phone scale
const PH = PHONE.h * S;
const PT = PHONE.t * S;
const LEAN = 0.26; // the stand's back rest, from vertical

export function RevoStill({ lite }: { lite: boolean }) {
  // The same studio bake as the other still lifes (still.tsx); one material
  // set serves both phones.
  const env = useStillStudio(lite);
  const mats = useStillFinishes(env, ["chassis", "bezel", "hinge"] as const);
  const feedTex = useDrawnTexture(280, 580, lite ? 1.3 : 1.6);
  const profileTex = useDrawnTexture(280, 580, lite ? 1.3 : 1.6);
  const feed = useDisplayMaterial(feedTex.texture, env);
  const profile = useDisplayMaterial(profileTex.texture, env);
  // This scene's own instances: phone frames in a darker graphite than a
  // laptop deck; restrained glass and screens, the flat phone's screen most
  // of all, since it faces the overhead softbox and would otherwise wash out.
  useEffect(() => {
    mats.chassis.color.set("#6f7175");
    mats.chassis.roughness = 0.34;
    mats.bezel.envMapIntensity = 0.45;
    feed.envMapIntensity = 0.4;
    profile.envMapIntensity = 0.12;
  }, [mats, feed, profile]);
  const shown = useRef({ feed: -1, profile: -1 });

  useFrame(() => {
    const dim = 1 - story.calm * 0.3;
    feed.emissiveIntensity = phase(0.1, 0.24) * 1.1 * dim;
    profile.emissiveIntensity = phase(0.52, 0.66) * 1.1 * dim;
    const f = stepAt(FEED_STEPS);
    if (f !== shown.current.feed) {
      shown.current.feed = f;
      feedTex.paint(drawFeed(f));
    }
    const p = stepAt(PROFILE_STEPS);
    if (p !== shown.current.profile) {
      shown.current.profile = p;
      profileTex.paint(drawProfile(p));
    }
  });

  return (
    <group>
      <DeskSurface y={DESK_Y} size={[10, 7]} env={env} color="#675e56" roughness={0.8} envMapIntensity={0.8} />

      {/* The feed phone, leaning on a slim satin-black stand towards the viewer */}
      <group position={[-1.0, DESK_Y, 0.15]} rotation-y={0.16}>
        <ContactShadow position={[0, 0.002, -0.12]} size={[1.6, 1.4]} opacity={0.85} />
        <RoundedBox args={[1.0, 0.03, 0.85]} radius={0.012} smoothness={2} position={[0, 0.015, -0.16]} material={mats.hinge} />
        <RoundedBox args={[1.0, 0.08, 0.04]} radius={0.012} smoothness={2} position={[0, 0.07, PT + 0.04]} material={mats.hinge} />
        <group position={[0, 0.03, 0.02]} rotation-x={-LEAN}>
          <RoundedBox args={[0.8, 1.15, 0.03]} radius={0.012} smoothness={2} position={[0, 0.6, -0.016]} material={mats.hinge} />
          <group position={[0, PH / 2 + 0.005, PT / 2]} scale={S}>
            <StillPhone body={mats.chassis} glass={mats.bezel} display={feed} />
          </group>
        </group>
      </group>

      {/* The profile phone, lying flat beside it and turned the other way */}
      <group position={[1.3, DESK_Y, 0.35]} rotation-y={-0.32}>
        <ContactShadow position={[0, 0.002, 0]} size={[PHONE.w * S + 0.2, PH + 0.2]} opacity={0.9} />
        <group position={[0, PT / 2 + 0.004, 0]} rotation-x={-Math.PI / 2} scale={S}>
          <StillPhone body={mats.chassis} glass={mats.bezel} display={profile} />
        </group>
      </group>
    </group>
  );
}

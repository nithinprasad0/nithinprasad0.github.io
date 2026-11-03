import { useMemo, useRef, type ReactNode } from "react";
import { useFrame } from "@react-three/fiber";
import {
  AdditiveBlending,
  CanvasTexture,
  Color,
  MeshPhysicalMaterial,
  MeshStandardMaterial,
  SRGBColorSpace,
  type MeshBasicMaterial,
  Vector3,
  type Group,
  type Sprite,
  type SpriteMaterial,
} from "three";
import { story } from "./story";

export const ICE = new Color("#8fc8ff");
export const BLUE = new Color("#397bff");

// Shared materials: every station draws from the same small palette.
export const MAT = {
  metal: new MeshStandardMaterial({ color: "#151a24", metalness: 0.85, roughness: 0.32 }),
  glass: new MeshPhysicalMaterial({
    color: "#1b2433",
    metalness: 0.1,
    roughness: 0.12,
    clearcoat: 1,
    transparent: true,
    opacity: 0.55,
  }),
  /** Focal accents only (cores, active markers). */
  glow: new MeshStandardMaterial({ color: "#000", emissive: BLUE, emissiveIntensity: 2.2, toneMapped: false }),
  /** Connective lines and arcs: present, but never brighter than the subject. */
  glowSoft: new MeshStandardMaterial({ color: "#000", emissive: BLUE, emissiveIntensity: 0.95, toneMapped: false }),
  ice: new MeshStandardMaterial({ color: "#000", emissive: ICE, emissiveIntensity: 1.4, toneMapped: false }),
  screen: new MeshStandardMaterial({ color: "#0a1220", emissive: BLUE, emissiveIntensity: 0.35 }),
  /** Device bodies: brushed silver aluminium — the neutral highlight in every scene. */
  frame: new MeshStandardMaterial({ color: "#8a93a2", metalness: 0.9, roughness: 0.3 }),
  /** Translucent acrylic: smoked, slightly tinted, catches the light on its edges. */
  acrylic: new MeshPhysicalMaterial({
    color: "#9fb4d8",
    metalness: 0,
    roughness: 0.18,
    clearcoat: 1,
    clearcoatRoughness: 0.1,
    transparent: true,
    opacity: 0.32,
  }),
  /** Printed paper (a bill): matte and warm, kept dim so it never glares behind text. */
  paper: new MeshStandardMaterial({ color: "#8d887f", roughness: 0.92, metalness: 0 }),
  /** Sparing secondary accents, one per illustration at most. */
  amber: new MeshStandardMaterial({ color: "#000", emissive: new Color("#ffb257"), emissiveIntensity: 1.2, toneMapped: false }),
  mint: new MeshStandardMaterial({ color: "#000", emissive: new Color("#5fe0b0"), emissiveIntensity: 1.2, toneMapped: false }),
  violet: new MeshStandardMaterial({ color: "#000", emissive: new Color("#a394ff"), emissiveIntensity: 1.1, toneMapped: false }),
};

const BASE = { glow: 2.2, glowSoft: 0.95, ice: 1.4, accent: 1.2 };

/**
 * The current environment's accent (Phase 9). Every illustration's focal glow,
 * connecting lines and screens take it on, so each chapter has its own light
 * instead of one blue everywhere. Updated each frame by applyEnv.
 */
export const ACCENT = new Color("#397bff");
export const ACCENT_LIGHT = new Color("#8fc8ff");
const WHITE = new Color("#ffffff");

export function applyEnv(r: number, g: number, b: number) {
  ACCENT.setRGB(r, g, b, SRGBColorSpace);
  ACCENT_LIGHT.copy(ACCENT).lerp(WHITE, 0.35);
  MAT.glow.emissive.copy(ACCENT);
  MAT.glowSoft.emissive.copy(ACCENT);
  MAT.ice.emissive.copy(ACCENT_LIGHT);
  MAT.screen.emissive.copy(ACCENT);
}

/** One shared soft radial texture for light pools on the "floor". */
let poolTex: CanvasTexture | undefined;
export function poolTexture() {
  if (poolTex) return poolTex;
  const c = document.createElement("canvas");
  c.width = c.height = 128;
  const g = c.getContext("2d")!;
  const r = g.createRadialGradient(64, 64, 0, 64, 64, 64);
  r.addColorStop(0, "rgba(255,255,255,1)");
  r.addColorStop(0.5, "rgba(255,255,255,.3)");
  r.addColorStop(1, "rgba(255,255,255,0)");
  g.fillStyle = r;
  g.fillRect(0, 0, 128, 128);
  poolTex = new CanvasTexture(c);
  return poolTex;
}

/** Screen materials (each with its own UI texture) dim with the rest of the scene. */
export const SCREENS = new Set<MeshBasicMaterial>();

/** Section-aware brightness: quieter while text is read, full in showcase moments. */
export function applyCalm(calm: number) {
  MAT.glow.emissiveIntensity = BASE.glow * (1 - calm * 0.4);
  MAT.glowSoft.emissiveIntensity = BASE.glowSoft * (1 - calm * 0.5);
  MAT.ice.emissiveIntensity = BASE.ice * (1 - calm * 0.35);
  MAT.amber.emissiveIntensity = MAT.mint.emissiveIntensity = BASE.accent * (1 - calm * 0.4);
  MAT.violet.emissiveIntensity = BASE.accent * 0.92 * (1 - calm * 0.4);
  const level = 1 - calm * 0.35;
  SCREENS.forEach((m) => m.color.setScalar(level));
}

/** Text label rendered once to a canvas; used on sprites that face the camera. */
export function makeLabel(text: string, opts: { size?: number; color?: string; weight?: number; pill?: boolean } = {}) {
  const { size = 44, color = "#cfe4ff", weight = 600, pill = false } = opts;
  const font = `${weight} ${size}px "Space Grotesk", Inter, Arial, sans-serif`;
  const ctx = document.createElement("canvas").getContext("2d")!;
  ctx.font = font;
  const spacing = size * 0.12;
  const w = Math.ceil(ctx.measureText(text).width + spacing * text.length + size);
  const h = Math.ceil(size * 1.6);
  ctx.canvas.width = w;
  ctx.canvas.height = h;
  if (pill) {
    // Dark capsule behind the text: keeps labels legible over bright lines.
    ctx.fillStyle = "rgba(9,12,18,0.82)";
    ctx.strokeStyle = "rgba(143,200,255,0.28)";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.roundRect(1, 1, w - 2, h - 2, h / 2 - 1);
    ctx.fill();
    ctx.stroke();
  }
  ctx.font = font;
  ctx.fillStyle = color;
  ctx.textBaseline = "middle";
  let x = size / 2;
  for (const ch of text) {
    ctx.fillText(ch, x, h / 2);
    x += ctx.measureText(ch).width + spacing;
  }
  const tex = new CanvasTexture(ctx.canvas);
  tex.colorSpace = SRGBColorSpace;
  return { tex, aspect: w / h };
}

export function Label({
  text,
  position,
  height = 0.28,
  color,
  opacity = 1,
  pill = false,
  weight,
}: {
  text: string;
  position: [number, number, number];
  height?: number;
  color?: string;
  opacity?: number;
  pill?: boolean;
  /** Optional live multiplier (0..1), e.g. to quiet labels that are not in focus. */
  weight?: { current: number };
}) {
  const { tex, aspect } = useMemo(() => makeLabel(text, { color, pill }), [text, color, pill]);
  const ref = useRef<Sprite>(null);
  const world = useMemo(() => new Vector3(), []);
  // Labels fade out as the camera flies close past them, so they never fill
  // the screen as giant clipped letters mid-transition.
  useFrame(({ camera }) => {
    const s = ref.current;
    if (!s) return;
    // Labels are unreadable in the distant overview shot, so skip drawing them.
    s.visible = story.dim < 0.25;
    if (!s.visible || !s.parent?.visible) return;
    s.getWorldPosition(world);
    (s.material as SpriteMaterial).opacity =
      opacity * (weight?.current ?? 1) * smooth((camera.position.distanceTo(world) - 4.5) / 4) * (1 - story.calm * 0.3);
  });
  return (
    <sprite ref={ref} position={position} scale={[height * aspect, height, 1]}>
      <spriteMaterial map={tex} transparent opacity={opacity} depthWrite={false} toneMapped={false} />
    </sprite>
  );
}

/**
 * A world station: hidden entirely while the camera is far away (saves draw
 * calls), always shown during the overview shot.
 */
export function Station({ at, radius = 40, children }: { at: Vector3; radius?: number; children: ReactNode }) {
  const ref = useRef<Group>(null);
  useFrame(({ camera }) => {
    if (!ref.current) return;
    ref.current.visible = story.dim > 0.25 || camera.position.distanceTo(at) < radius;
  });
  return (
    <group ref={ref} position={at}>
      {children}
    </group>
  );
}

export const clamp01 = (v: number) => Math.min(1, Math.max(0, v));
export const smooth = (v: number) => {
  const t = clamp01(v);
  return t * t * (3 - 2 * t);
};

/**
 * A soft pool of light on the floor under a composition: grounds it in its
 * environment instead of floating in a void. Tinted live with the chapter
 * accent unless a fixed colour is given.
 */
export function Pool({ position, scale, opacity = 0.3, color }: { position: [number, number, number]; scale: [number, number]; opacity?: number; color?: string }) {
  const mat = useRef<MeshBasicMaterial>(null);
  useFrame(() => {
    if (mat.current && !color) mat.current.color.copy(ACCENT);
  });
  return (
    <mesh rotation-x={-Math.PI / 2} position={position} scale={[scale[0], scale[1], 1]}>
      <planeGeometry />
      <meshBasicMaterial ref={mat} map={poolTexture()} color={color ?? "#ffffff"} transparent opacity={opacity} blending={AdditiveBlending} depthWrite={false} toneMapped={false} />
    </mesh>
  );
}

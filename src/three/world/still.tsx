import { useEffect, useMemo, type Ref } from "react";
import { RoundedBox } from "@react-three/drei";
import {
  BufferGeometry,
  CanvasTexture,
  ExtrudeGeometry,
  Float32BufferAttribute,
  MeshStandardMaterial,
  Shape,
  ShapeGeometry,
  SRGBColorSpace,
  type Group,
  type Material,
  type Texture,
} from "three";
import { HERO_STUDIO, useStudioMap } from "../StudioEnvironment";
import { poolTexture } from "./kit";

/*
 * Product still life (Phase 25): the building blocks that let a project scene
 * be shot like the Phase 24 hero keyboard — real materials reflecting a warm
 * neutral studio, a matte desk that takes the light, and a soft contact
 * shadow under each object — without touching any other scene.
 *
 * - The studio reflections are the hero's own map, baked once and shared
 *   (see useStudioMap), assigned per material so nothing else changes.
 * - No lights are added: scene lights are global in three.js (every lit
 *   material in the world would pay for them). A still life is lit by the
 *   world's key light, its chapter's rim and these reflections.
 * - Grounding uses the shared radial pool texture, not shadow maps, so it
 *   works on phones too.
 */

/** The shared product-studio reflections (lower resolution on the light tier). */
export function useProductStudio(lite: boolean): Texture | null {
  return useStudioMap(HERO_STUDIO, lite ? 64 : 128);
}

type Finish = { color: string; roughness: number; metalness?: number; envMapIntensity?: number };

/** Physically plausible finishes for devices and props (dielectrics have no metalness). */
export const FINISH = {
  /** Bead-blasted aluminium: a satin space grey. */
  aluminium: { color: "#606368", roughness: 0.5, metalness: 0.9 },
  /** Black glass around a display: smooth, dark, reflective. */
  glass: { color: "#070708", roughness: 0.08, metalness: 0, envMapIntensity: 1.2 },
  /** Matte keycap plastic. */
  keys: { color: "#1b1c1e", roughness: 0.7, metalness: 0 },
  /**
   * Anodised graphite: darker and a touch smoother than the aluminium.
   * Phase 32C: lifted a step, so a graphite chassis separates from its black
   * glass and keys under the studio light.
   */
  graphite: { color: "#666970", roughness: 0.42, metalness: 0.85 },
  /** Uncoated office paper: bright but never glossy. */
  paper: { color: "#ffffff", roughness: 0.92, metalness: 0, envMapIntensity: 0.5 },
  /** Satin brass for small fittings (a pen clip and tip). */
  brass: { color: "#b8955a", roughness: 0.35, metalness: 1 },
  /** Phase 32C. A laptop's keyboard well: matte black, not mirror glass. */
  well: { color: "#0e0e10", roughness: 0.62, metalness: 0 },
  /** Phase 32C. A glass trackpad with an etched satin top: smoother than the chassis, not metal. */
  trackpad: { color: "#4b4e53", roughness: 0.3, metalness: 0, envMapIntensity: 0.8 },
  /** Phase 32C. Monitor housing: satin black plastic, a step lighter than keycaps so it keeps its form. */
  housing: { color: "#26272a", roughness: 0.55, metalness: 0 },
} satisfies Record<string, Finish>;

/** One standard material per finish, reflecting the given studio map. Dispose with the scene. */
export function useFinishes<K extends keyof typeof FINISH>(env: Texture | null, keys: readonly K[]) {
  const mats = useMemo(
    () =>
      Object.fromEntries(
        keys.map((k) => {
          const f: Finish = FINISH[k];
          return [k, new MeshStandardMaterial({ color: f.color, roughness: f.roughness, metalness: f.metalness ?? 0, envMapIntensity: f.envMapIntensity ?? 1 })];
        }),
      ) as Record<K, MeshStandardMaterial>,
    // Built once per scene; the finishes are constants.
    [],
  );
  useEffect(() => {
    Object.values<MeshStandardMaterial>(mats).forEach((m) => {
      m.envMap = env;
      m.needsUpdate = true;
    });
  }, [env, mats]);
  useEffect(() => () => Object.values<MeshStandardMaterial>(mats).forEach((m) => m.dispose()), [mats]);
  return mats;
}

/**
 * The desk: a matte surface that takes the key light's falloff and fades out
 * at its edges into the chapter's atmosphere (no hard horizon line).
 */
export function DeskSurface({ y, size, env, color = "#24221f" }: { y: number; size: [number, number]; env: Texture | null; color?: string }) {
  return (
    <mesh rotation-x={-Math.PI / 2} position={[0, y, 0]} scale={[size[0], size[1], 1]}>
      <planeGeometry />
      <meshStandardMaterial map={poolTexture()} color={color} roughness={0.9} metalness={0} transparent depthWrite={false} envMap={env} envMapIntensity={0.4} />
    </mesh>
  );
}

let footprint: CanvasTexture | undefined;
/**
 * A soft rounded-rectangle shadow (drawn once, 128 px, shared): dark across
 * an object's footprint with a short falloff, unlike the pool's wide radial
 * gradient, so the darkest shadow sits right at the edges where an object
 * meets the desk. Drawn with canvas shadowBlur (supported everywhere).
 */
function footprintTexture() {
  if (footprint) return footprint;
  const c = document.createElement("canvas");
  c.width = c.height = 128;
  const g = c.getContext("2d")!;
  // Opaque: the alpha map reads the green channel, and a transparent canvas
  // would upload its soft edge as solid white once un-premultiplied.
  g.fillStyle = "#000";
  g.fillRect(0, 0, 128, 128);
  g.shadowColor = "#fff";
  g.shadowBlur = 16;
  g.shadowOffsetX = 256; // draw only the blurred shadow, the shape itself lands off-canvas
  g.fillStyle = "#fff";
  g.beginPath();
  g.roundRect(22 - 256, 22, 84, 84, 10);
  g.fill();
  footprint = new CanvasTexture(c);
  return footprint;
}

/**
 * Soft occlusion where an object meets the desk (a baked, static contact
 * shadow): the wide soft pool, plus (Phase 32C) a tighter footprint layer
 * that darkens the contact edge, so objects sit on the desk instead of
 * hovering over a smudge. Both are static planes: no shadow maps.
 */
export function ContactShadow({ position, size, opacity = 0.75, rotation = 0 }: { position: [number, number, number]; size: [number, number]; opacity?: number; rotation?: number }) {
  return (
    <group rotation={[-Math.PI / 2, 0, rotation]} position={position}>
      <mesh scale={[size[0], size[1], 1]}>
        <planeGeometry />
        <meshBasicMaterial map={poolTexture()} color="#000" transparent opacity={opacity} depthWrite={false} />
      </mesh>
      <mesh scale={[size[0] * 0.9, size[1] * 0.9, 1]} position={[0, 0, 0.0005]}>
        <planeGeometry />
        <meshBasicMaterial alphaMap={footprintTexture()} color="#000" transparent opacity={opacity * 0.5} depthWrite={false} />
      </mesh>
    </group>
  );
}

/**
 * A canvas the size of a display (or a printed page), redrawn on demand —
 * only when the state it shows changes, never per frame.
 */
export function useDrawnTexture(width: number, height: number, scale: number) {
  return useMemo(() => {
    const canvas = document.createElement("canvas");
    canvas.width = Math.round(width * scale);
    canvas.height = Math.round(height * scale);
    const g = canvas.getContext("2d")!;
    const texture = new CanvasTexture(canvas);
    texture.colorSpace = SRGBColorSpace;
    texture.anisotropy = 8;
    const paint = (draw: (g: CanvasRenderingContext2D, w: number, h: number) => void) => {
      g.setTransform(scale, 0, 0, scale, 0, 0);
      draw(g, width, height);
      texture.needsUpdate = true;
    };
    return { texture, paint };
  }, [width, height, scale]);
}

/**
 * A lit display: the interface is emitted light (dimmed while text is read)
 * under a smooth glass surface that reflects the studio, so the screen reads
 * as a physical panel instead of a sticker.
 */
export function useDisplayMaterial(map: Texture, env: Texture | null) {
  const material = useMemo(
    () => new MeshStandardMaterial({ color: "#000", emissive: "#ffffff", emissiveMap: map, emissiveIntensity: 0, roughness: 0.14, metalness: 0, envMapIntensity: 0.55 }),
    [map],
  );
  useEffect(() => {
    material.envMap = env;
    material.needsUpdate = true;
  }, [env, material]);
  useEffect(
    () => () => {
      material.dispose();
      map.dispose();
    },
    [material, map],
  );
  return material;
}

function roundedRect(w: number, h: number, r: number) {
  const s = new Shape();
  const [x, y] = [-w / 2, -h / 2];
  s.moveTo(x + r, y);
  s.lineTo(x + w - r, y);
  s.quadraticCurveTo(x + w, y, x + w, y + r);
  s.lineTo(x + w, y + h - r);
  s.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
  s.lineTo(x + r, y + h);
  s.quadraticCurveTo(x, y + h, x, y + h - r);
  s.lineTo(x, y + r);
  s.quadraticCurveTo(x, y, x + r, y);
  return s;
}

/** A flat rectangle with rounded corners and 0–1 UVs (for glass and displays). */
function useRoundedPlane(w: number, h: number, r: number) {
  const geometry = useMemo(() => {
    const [x, y] = [-w / 2, -h / 2];
    const g = new ShapeGeometry(roundedRect(w, h, r), 6);
    const pos = g.attributes.position;
    const uv = g.attributes.uv;
    for (let i = 0; i < pos.count; i++) uv.setXY(i, (pos.getX(i) - x) / w, (pos.getY(i) - y) / h);
    return g;
  }, [w, h, r]);
  useEffect(() => () => geometry.dispose(), [geometry]);
  return geometry;
}

/** Smartphone proportions (the gallery's PhoneDevice), and its display area. */
export const PHONE = { w: 0.9, h: 1.78, t: 0.08, radius: 0.1, display: { w: 0.82, h: 1.7 } };

/**
 * A physical smartphone: a satin metal body with rounded edges, a black glass
 * face over a thin bezel, and a lit display (useDisplayMaterial). Lies in its
 * own XY plane, face towards +Z, centred on the body.
 */
export function StillPhone({ body, glass, display }: { body: Material; glass: Material; display: Material }) {
  const shell = useMemo(() => {
    const e = 0.028; // edge round
    const g = new ExtrudeGeometry(roundedRect(PHONE.w - 2 * e, PHONE.h - 2 * e, PHONE.radius - e), {
      depth: PHONE.t - 2 * e,
      bevelEnabled: true,
      bevelThickness: e,
      bevelSize: e,
      bevelSegments: 3,
      curveSegments: 6,
    });
    g.translate(0, 0, -(PHONE.t - 2 * e) / 2);
    return g;
  }, []);
  useEffect(() => () => shell.dispose(), [shell]);
  const face = useRoundedPlane(PHONE.w - 0.02, PHONE.h - 0.02, PHONE.radius - 0.01);
  const panel = useRoundedPlane(PHONE.display.w, PHONE.display.h, 0.075);
  return (
    <group>
      <mesh geometry={shell} material={body} />
      <mesh geometry={face} material={glass} position={[0, 0, PHONE.t / 2 + 0.001]} />
      <mesh geometry={panel} material={display} position={[0, 0, PHONE.t / 2 + 0.002]} />
    </group>
  );
}

/* ------------------------------------------------------------- Tablet */

/** Tablet proportions (scene units), landscape, and its display area. */
export const TABLET = { w: 2.9, h: 2.08, t: 0.06, radius: 0.13, display: { w: 2.66, h: 1.86 } };

/**
 * A physical tablet, the phone's larger sibling: a satin metal body with
 * rounded edges, a black glass face and a lit display. Lies in its own XY
 * plane, face towards +Z, centred on the body.
 */
export function StillTablet({ body, glass, display }: { body: Material; glass: Material; display: Material }) {
  const { w, h, t, radius } = TABLET;
  const shell = useMemo(() => {
    const e = 0.022; // edge round
    const g = new ExtrudeGeometry(roundedRect(w - 2 * e, h - 2 * e, radius - e), {
      depth: t - 2 * e,
      bevelEnabled: true,
      bevelThickness: e,
      bevelSize: e,
      bevelSegments: 3,
      curveSegments: 6,
    });
    g.translate(0, 0, -(t - 2 * e) / 2);
    return g;
  }, [w, h, t, radius]);
  useEffect(() => () => shell.dispose(), [shell]);
  const face = useRoundedPlane(w - 0.02, h - 0.02, radius - 0.01);
  const panel = useRoundedPlane(TABLET.display.w, TABLET.display.h, 0.03);
  return (
    <group>
      <mesh geometry={shell} material={body} />
      <mesh geometry={face} material={glass} position={[0, 0, t / 2 + 0.001]} />
      <mesh geometry={panel} material={display} position={[0, 0, t / 2 + 0.002]} />
    </group>
  );
}

/* ------------------------------------------------------------- Laptop */

/** Laptop proportions (scene units): a 16:10 display in a thin bezel. */
export const LAPTOP = { w: 3.3, d: 2.2, t: 0.08, lidH: 2.08, lidT: 0.05, screen: { w: 3.04, h: 1.9 } };

/*
 * Laptop keyboard: one merged mesh (a single draw call) of low chamfered caps
 * — a flat top on sloped sides that catch the studio light — built at true
 * width so wide keys keep the same bevel. A half-height function row, four
 * staggered rows and a space-bar row; flat-shaded, 10 triangles a key, no
 * legends.
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
    quad(T[3], T[2], T[1], T[0]);
    quad(B[3], B[2], T[2], T[3]);
    quad(B[2], B[1], T[1], T[2]);
    quad(B[1], B[0], T[0], T[1]);
    quad(B[0], B[3], T[3], T[0]);
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

/**
 * A physical laptop, base centred on the origin with its underside at y = 0:
 * a metal body with a chamfered keyboard in a black well and a trackpad, and
 * a lid on its hinge (the scene drives `lid.rotation.x`: π/2 closed, ~-0.2
 * open) carrying a black glass bezel and a lit display.
 */
export function StillLaptop({ body, keys, glass, display, lid, closed = Math.PI / 2, well = glass, pad = body }: { body: Material; keys: Material; glass: Material; display: Material; lid: Ref<Group>; closed?: number; well?: Material; pad?: Material }) {
  const keyGeometry = useMemo(keyboardGeometry, []);
  useEffect(() => () => keyGeometry.dispose(), [keyGeometry]);
  const { w, d, t, lidH, lidT, screen } = LAPTOP;
  return (
    <group>
      <group position={[0, t / 2, 0]}>
        <RoundedBox args={[w, t, d]} radius={0.035} smoothness={3} material={body} />
        <mesh material={well} rotation-x={-Math.PI / 2} position={[0, t / 2 + 0.001, -0.34]}>
          <planeGeometry args={[KEYS_W + 0.12, KEYS_D + 0.08]} />
        </mesh>
        <mesh geometry={keyGeometry} material={keys} position={[0, t / 2 + 0.0015, -0.34]} />
        <mesh material={pad} rotation-x={-Math.PI / 2} position={[0, t / 2 + 0.0015, 0.66]}>
          <planeGeometry args={[1.25, 0.72]} />
        </mesh>
      </group>
      <group ref={lid} position={[0, t, -d / 2 + 0.03]} rotation-x={closed}>
        <group position={[0, lidH / 2, 0]}>
          <RoundedBox args={[w, lidH, lidT]} radius={0.03} smoothness={3} material={body} />
          <mesh material={glass} position={[0, 0, lidT / 2 + 0.001]}>
            <planeGeometry args={[w - 0.04, lidH - 0.04]} />
          </mesh>
          <mesh material={display} position={[0, 0.035, lidT / 2 + 0.003]}>
            <planeGeometry args={[screen.w, screen.h]} />
          </mesh>
        </group>
      </group>
    </group>
  );
}

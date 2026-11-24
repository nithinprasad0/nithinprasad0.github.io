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
import { useStudioMap, type Studio } from "../StudioEnvironment";
import { poolTexture } from "./kit";

/*
 * Product still life (Phase 25): the building blocks that let a project scene
 * be shot like the Phase 24 hero keyboard — real materials reflecting a warm
 * neutral studio, a matte desk that takes the light, and a soft contact
 * shadow under each object — without touching any other scene.
 *
 * - Studio reflections are baked once per studio and resolution and shared
 *   (see useStudioMap), assigned per material so nothing else changes.
 * - No lights are added: scene lights are global in three.js (every lit
 *   material in the world would pay for them). A still life is lit by the
 *   world's key light, its chapter's rim and these reflections.
 * - Grounding uses the shared radial pool texture, not shadow maps, so it
 *   works on phones too.
 */

type Finish = { color: string; roughness: number; metalness?: number; envMapIntensity?: number };

/* ------------------------------------------- Still-life standard (Phase 35) */

/*
 * The project still-life standard, first used by InsightGen (Phase 35).
 * Reuse contract for later project scenes:
 *
 * - Light: no scene lights (they are global in three.js). A still life is lit
 *   by STILL_STUDIO, its own image-based studio, plus the world's key light
 *   and chapter rim. STILL_STUDIO is separate from HERO_STUDIO, which the hero
 *   keyboard keeps using unchanged; one bake per
 *   resolution is shared by every scene that adopts it.
 * - Materials: STILL_FINISH, read through useStillFinishes. Physically based
 *   values: metals are fully metallic, dielectrics have none, and roughness
 *   carries the difference between anodised metal, glass, matte plastic,
 *   rubber and paper. No texture maps.
 * - Grounding: DeskSurface and ContactShadow (baked, no shadow maps), so
 *   phones get the same grounding as desktops.
 * - Project-specific choices (composition, desk colour, what the screen
 *   shows) stay in the project's own file.
 *
 * Adopting it changes only the adopting scene. (Phase 41: the Phase 25
 * FINISH, useFinishes and useProductStudio, left without consumers once all
 * six project scenes moved to this standard, were removed.)
 *
 * Sharing (Phase 36, InsightGen and Profexia): every scene that calls
 * useStillStudio at the same tier receives the same baked texture, counted
 * by reference in StudioEnvironment, so a second adopter adds no bake. Each
 * scene builds its own material instances from STILL_FINISH (cheap objects;
 * three.js compiles one shader program per material configuration, so they
 * share programs) and can change its own instances (InsightGen maps its
 * printed report onto its paper) without affecting another scene.
 */

/**
 * A tabletop product studio, lit for a camera in front of and above the
 * object (+z towards the camera, as every chapter is filmed):
 * - key: a large warm softbox overhead, a little behind and to the left, so
 *   horizontal surfaces (a laptop deck, a keyboard, a desk) carry a soft
 *   gradient instead of reflecting the black studio walls;
 * - fill: a dim neutral card front-right for the faces towards the camera;
 * - front: a soft low card behind the camera, a faint sheen on screen glass;
 * - rim: a thin steel strip low behind, which edges lids and back corners;
 * - bounce: a warm, dark floor.
 * Warm-neutral throughout, with steel only in the rim: no blue.
 */
export const STILL_STUDIO: Studio = {
  shell: "#0c0b0a",
  panels: [
    { color: "#fff0de", intensity: 2.1, position: [-1.5, 7, -3], rotation: [Math.PI / 2, 0, 0], scale: [10, 7] },
    { color: "#e7e5e1", intensity: 0.55, position: [7, 2.5, 4], scale: [5, 4] },
    { color: "#e9e5de", intensity: 0.5, position: [0, 3.5, 9], scale: [14, 3] },
    { color: "#bcc6d0", intensity: 1.1, position: [0, 1.8, -8], scale: [16, 0.6] },
    { color: "#2a2520", intensity: 1, position: [0, -4, 1], rotation: [-Math.PI / 2, 0, 0], scale: [16, 12] },
  ],
};

/** The still-life studio's reflections (lower resolution on the light tier). */
export function useStillStudio(lite: boolean): Texture | null {
  return useStudioMap(STILL_STUDIO, lite ? 64 : 128);
}

/** Phase 35 finishes, tuned under STILL_STUDIO. */
export const STILL_FINISH = {
  /** Bead-blasted anodised aluminium in space grey: a fully metallic satin. */
  chassis: { color: "#9b9da1", roughness: 0.3, metalness: 1 },
  /** Black display glass around the panel: smooth and dark, a restrained reflection. */
  bezel: { color: "#060607", roughness: 0.06, metalness: 0, envMapIntensity: 0.7 },
  /** Matte PBT-like keycaps: dark graphite, never glossy. */
  keys: { color: "#17181a", roughness: 0.74, metalness: 0, envMapIntensity: 0.55 },
  /** The keyboard well: matte black. */
  well: { color: "#0b0b0c", roughness: 0.75, metalness: 0 },
  /** Etched glass trackpad: smoother than the chassis, not metal. */
  trackpad: { color: "#46494e", roughness: 0.3, metalness: 0, envMapIntensity: 0.6 },
  /** The hinge cover: satin black polymer. */
  hinge: { color: "#1d1e20", roughness: 0.45, metalness: 0 },
  /** Uncoated office paper, a little warm: bright, never glossy. */
  paper: { color: "#f3f0ea", roughness: 0.88, metalness: 0, envMapIntensity: 0.55 },
  /** Phase 36. Book cloth over board: a warm charcoal weave, fully matte. */
  cover: { color: "#3b3734", roughness: 0.92, metalness: 0, envMapIntensity: 0.5 },
  /** Phase 36. Satin brass for small fittings: an accent, never a large surface. */
  brass: { color: "#b8955a", roughness: 0.32, metalness: 1 },
} satisfies Record<string, Finish>;

/** One standard material per still-life finish, reflecting the given studio. Dispose with the scene. */
export function useStillFinishes<K extends keyof typeof STILL_FINISH>(env: Texture | null, keys: readonly K[]) {
  const mats = useMemo(
    () =>
      Object.fromEntries(
        keys.map((k) => {
          const f: Finish = STILL_FINISH[k];
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
export function DeskSurface({ y, size, env, color = "#24221f", roughness = 0.9, envMapIntensity = 0.4 }: { y: number; size: [number, number]; env: Texture | null; color?: string; roughness?: number; envMapIntensity?: number }) {
  // roughness / envMapIntensity: Phase 35 options for the still-life standard
  // (see STILL_STUDIO); the defaults are the values every earlier scene uses.
  return (
    <mesh rotation-x={-Math.PI / 2} position={[0, y, 0]} scale={[size[0], size[1], 1]}>
      <planeGeometry />
      <meshStandardMaterial map={poolTexture()} color={color} roughness={roughness} metalness={0} transparent depthWrite={false} envMap={env} envMapIntensity={envMapIntensity} />
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
export function StillLaptop({ body, keys, glass, display, lid, closed = Math.PI / 2, well = glass, pad = body, hinge }: { body: Material; keys: Material; glass: Material; display: Material; lid: Ref<Group>; closed?: number; well?: Material; pad?: Material; hinge?: Material }) {
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
      {/* Phase 36, optional: a hinge cover along the back edge, where the lid
          turns (the same part InsightGen draws itself, Phase 35). */}
      {hinge && (
        <mesh material={hinge} position={[0, t, -d / 2 + 0.03]} rotation-z={Math.PI / 2}>
          <cylinderGeometry args={[0.04, 0.04, w - 0.7, 16, 1]} />
        </mesh>
      )}
    </group>
  );
}

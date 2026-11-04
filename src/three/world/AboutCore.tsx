import { useMemo, useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import {
  AdditiveBlending,
  CanvasTexture,
  Color,
  MathUtils,
  MeshBasicMaterial,
  MeshPhysicalMaterial,
  MeshStandardMaterial,
  SpriteMaterial,
  Vector3,
  type Group,
  type Mesh,
  type PerspectiveCamera,
} from "three";
import { poolTexture, Station, smooth } from "./kit";
import { orbitFocus } from "./orbitFocus";
import { STATION, story } from "./story";

// Three focus areas as three orbits around one core. Scroll brings the
// orbits from scattered planes into one composed system; each carries a lit
// node (Mobile, Web, AI & Data) that the page's node controls (OrbitNodes)
// follow on screen. Hovering, focusing or tapping a node lights its orbit.
//
// Palette: graphite metal rings that catch the chapter's champagne rim
// light, a polished dark core with soft studio reflections, and three
// restrained node lights — ice white, champagne and a quiet electric blue.
// Each orbit has its own inclination, so the system reads as depth rather
// than a flat target; `angle` is where its node rests during the reading
// hold (upper arcs pass in front of the core, lower arcs behind it).
// `mid` (1024–1279px, where the open space beside the text card is
// narrower) keeps every node off the system's right edge; `compact` (phones
// and tablets) spreads them so the three labels never meet.
const RINGS = [
  { radius: 1.85, tilt: [1.0, 0.18, -0.14], from: [2.3, 0.35, 0.4], angle: 2.05, mid: 2.3, compact: 2.4, sweep: 2.2, color: "#eef4ff" },
  { radius: 1.42, tilt: [0.9, -0.22, 0.1], from: [-0.4, 0.95, -0.25], angle: -0.95, mid: -1.75, compact: -2.2, sweep: -2.6, color: "#e3c590" },
  { radius: 1.0, tilt: [0.78, 0.08, -0.05], from: [0.45, -1.2, 0.85], angle: 0.75, mid: 1.25, compact: -0.3, sweep: 3, color: "#79abff" },
] as const;
const CORE = 0.36;

/** A soft 1D falloff for the light trail behind each node (bright at the node). */
let trailTex: CanvasTexture | undefined;
function trailTexture() {
  if (trailTex) return trailTex;
  const c = document.createElement("canvas");
  c.width = 128;
  c.height = 4;
  const g = c.getContext("2d")!;
  const grad = g.createLinearGradient(0, 0, 128, 0);
  grad.addColorStop(0, "rgba(255,255,255,0)");
  grad.addColorStop(0.7, "rgba(255,255,255,.35)");
  grad.addColorStop(1, "rgba(255,255,255,1)");
  g.fillStyle = grad;
  g.fillRect(0, 0, 128, 4);
  trailTex = new CanvasTexture(c);
  return trailTex;
}

const TRAIL_ARC = 1.15;

/* ------------------------------------------------------- Label layout */

type Side = "right" | "left" | "above" | "below";
type Point = { a: HTMLElement; x: number; y: number; hidden: boolean; nameW: number; chip?: Rect; desc?: Rect };
type Rect = [number, number, number, number];
type Bounds = { minX: number; maxX: number; minY: number; maxY: number };

const DESC_H = 84;
const overlaps = (r: Rect, s: Rect, pad = 4) => r[0] < s[2] + pad && r[2] > s[0] - pad && r[1] < s[3] + pad && r[3] > s[1] - pad;
/** How far (px) a rect reaches outside the bounds, summed over its edges. */
const outside = (r: Rect, b: Bounds) =>
  Math.max(0, b.minX - r[0]) + Math.max(0, r[2] - b.maxX) + Math.max(0, b.minY - r[1]) + Math.max(0, r[3] - b.maxY);

/**
 * The name chip and the (open) description for a label on one side of its
 * node. The description slides (shift x/y) to stay inside `room`: the open
 * screen beside the text card.
 */
function labelRects(p: Point, side: Side, descW: number, room: Bounds): { chip: Rect; desc: Rect; dx: number; dy: number } {
  const { x, y, nameW: w } = p;
  const chip: Rect =
    side === "right" ? [x + 30, y - 11, x + 30 + w, y + 11]
    : side === "left" ? [x - 30 - w, y - 11, x - 30, y + 11]
    : side === "above" ? [x - w / 2, y - 46, x + w / 2, y - 24]
    : [x - w / 2, y + 24, x + w / 2, y + 46];
  const x0 = side === "right" ? x + 30 : side === "left" ? x - 30 - descW : x - descW / 2;
  const y0 = side === "above" ? y - 52 - DESC_H : side === "below" ? y + 52 : y + 18;
  const dx = Math.round(MathUtils.clamp(x0, room.minX, Math.max(room.minX, room.maxX - descW)) - x0);
  const dy = Math.round(MathUtils.clamp(y0, room.minY, Math.max(room.minY, room.maxY - DESC_H)) - y0);
  return { chip, desc: [x0 + dx, y0 + dy, x0 + dx + descW, y0 + dy + DESC_H], dx, dy };
}

/**
 * Places each visible node's label on the side with the lowest cost. The
 * name must stay on screen and clear of the other labels, nodes and the
 * core (heavy costs); the description, shown only on demand, should have
 * room within the open space and not cover the core (light costs, so a
 * tight frame degrades gracefully). Preference goes to the side away from
 * the core, and to the current side, so labels don't flicker. The camera
 * orbits during the chapter, so this runs every frame.
 */
function placeLabels(
  points: Point[],
  core: { cx: number; cy: number; coreR: number },
  b: Bounds,
  screen: Bounds,
  descW: number,
  card: Rect | null,
) {
  const { cx, cy, coreR } = core;
  const coreRect: Rect = [cx - coreR, cy - coreR, cx + coreR, cy + coreR];
  // Descriptions stay on screen and off the card.
  const room: Bounds = { minX: b.minX, maxX: screen.maxX, minY: screen.minY, maxY: screen.maxY };
  const placed: Rect[] = [];
  for (const p of points) {
    if (p.hidden) continue;
    const h: Side[] = p.x >= cx ? ["right", "left"] : ["left", "right"];
    const v: Side[] = p.y < cy ? ["above", "below"] : ["below", "above"];
    const order: Side[] = [h[0], v[0], h[1], v[1]];
    const current = p.a.dataset.side;
    const others = points.filter((q) => q !== p && !q.hidden).map((q): Rect => [q.x - 12, q.y - 12, q.x + 12, q.y + 12]);
    const cost = (s: Side, rank: number) => {
      const { chip, desc, dx, dy } = labelRects(p, s, descW, room);
      return (
        outside(chip, screen) * 40 +
        outside(chip, b) * 4 +
        (overlaps(chip, coreRect) ? 600 : 0) +
        (card && overlaps(chip, card, 8) ? 800 : 0) +
        (card && overlaps(desc, card, 8) ? 200 : 0) +
        (placed.some((q) => overlaps(chip, q)) ? 1000 : 0) +
        (others.some((q) => overlaps(chip, q)) ? 300 : 0) +
        // A description that had to slide far, or still doesn't fit, or would
        // cover its own name or the core, makes this side less attractive.
        outside(desc, room) * 3 +
        (Math.abs(dx) + Math.abs(dy)) * 0.15 +
        (overlaps(desc, chip, 0) ? 120 : 0) +
        (overlaps(desc, coreRect, 0) ? 40 : 0) +
        (others.some((q) => overlaps(desc, q, 0)) ? 30 : 0) +
        (s === current ? 0 : 6) +
        rank * 3
      );
    };
    let side = order[0];
    let best = Infinity;
    order.forEach((s, rank) => {
      const c = cost(s, rank);
      if (c < best) {
        best = c;
        side = s;
      }
    });
    const { chip, desc, dx, dy } = labelRects(p, side, descW, room);
    placed.push(chip);
    p.chip = chip;
    p.desc = desc;
    if (p.a.dataset.side !== side) p.a.dataset.side = side;
    const shift = `${dx} ${dy}`;
    if (p.a.dataset.shift !== shift) {
      p.a.dataset.shift = shift;
      p.a.style.setProperty("--dx", `${dx}px`);
      p.a.style.setProperty("--dy", `${dy}px`);
    }
  }
  // An open description lies above its neighbours: a name it would cut
  // through steps out of the way until it closes.
  const open = points.find((p) => !p.hidden && p.a.hasAttribute("data-active"));
  for (const p of points) {
    const covered = Boolean(open && p !== open && p.chip && open.desc && overlaps(p.chip, open.desc, 2));
    if (p.a.hasAttribute("data-covered") !== covered) p.a.toggleAttribute("data-covered", covered);
  }
}

const damp = (v: number, target: number, rate: number, dt: number) => v + (target - v) * (1 - Math.exp(-rate * dt));

export function AboutCore() {
  // Re-renders on resize; the breakpoints follow the page's CSS, which
  // measures the window (the canvas is narrower by the scrollbar).
  useThree((s) => s.size);
  const width = window.innerWidth;
  const narrow = width <= 520;
  // Phones and tablets (text below the scene): a larger system that settles
  // sooner, since the text card rises over it partway through the chapter.
  const compact = width <= 850;
  const fit = narrow
    ? { scale: 1.3, x: 0 }
    : compact
      ? { scale: 1.5, x: 0 }
      : width < 1024
        ? { scale: 0.85, x: -0.25 }
        : width < 1280
          ? { scale: 0.72, x: -1.2 }
        : { scale: 1, x: -0.55 };
  const all = useRef<Group>(null);
  const core = useRef<Group>(null);
  const rings = useRef<(Group | null)[]>([]);
  const carriers = useRef<(Group | null)[]>([]);
  const nodes = useRef<(Mesh | null)[]>([]);
  const glow = useRef<{ i: number; v: number }[]>(RINGS.map((_, i) => ({ i, v: 0 })));
  const scratch = useMemo(() => ({ p: new Vector3(), c: new Vector3(), cam: new Vector3() }), []);
  const cardRef = useRef<Element | null>(null);
  const shownRef = useRef(false);

  // Per-ring materials, so each orbit can light up on its own.
  const mats = useMemo(
    () =>
      RINGS.map((r) => {
        const color = new Color(r.color);
        return {
          color,
          ring: new MeshStandardMaterial({ color: "#2b2724", metalness: 1, roughness: 0.3, emissive: color, emissiveIntensity: 0.05 }),
          trail: new MeshBasicMaterial({ color, alphaMap: trailTexture(), transparent: true, opacity: 0.4, blending: AdditiveBlending, depthWrite: false, toneMapped: false }),
          node: new MeshStandardMaterial({ color: "#000", emissive: color, emissiveIntensity: 1.6, toneMapped: false }),
          halo: new SpriteMaterial({ map: poolTexture(), color, transparent: true, opacity: 0.32, blending: AdditiveBlending, depthWrite: false, toneMapped: false }),
        };
      }),
    [],
  );
  const coreMat = useMemo(
    () =>
      // Polished bronze-graphite under a clear lacquer, with a champagne
      // sheen that lights its silhouette (the "atmosphere" of the core).
      new MeshPhysicalMaterial({
        color: "#6a5643",
        metalness: 0.85,
        roughness: 0.36,
        clearcoat: 1,
        clearcoatRoughness: 0.08,
        envMapIntensity: 2,
        sheen: 1,
        sheenColor: new Color("#e2bd86"),
        sheenRoughness: 0.45,
      }),
    [],
  );
  const coreHalo = useMemo(
    () => new SpriteMaterial({ map: poolTexture(), color: "#d8b07a", transparent: true, opacity: 0.16, blending: AdditiveBlending, depthWrite: false, toneMapped: false }),
    [],
  );

  useFrame(({ camera, clock, size: view }, dt) => {
    // Hand-off: the aligned rings open outward and drift toward the network
    // ahead, becoming the first connections of the Experience chapter.
    const o = smooth(story.ringsOut);
    // Grows in as the hero keys are pressed, so its edge never peeks out
    // under the navigation in the opening hero frame.
    const enter = smooth(story.keyPress / 0.3);
    const g = all.current;
    if (g) {
      g.scale.setScalar(fit.scale * (1 + o * 2.4) * (0.001 + enter * 0.999));
      // Desktop: left of the lens-shifted centre, so the system (and its
      // node controls) sits in the open space beside the text card, which
      // is narrower on mid-size screens.
      g.position.set(o * 4.5 + fit.x, -o * 0.8, -o * 5);
      // The camera sweeps around the orbit through the chapter; the system
      // turns most of the way with it, so the three nodes stay spread out
      // (and their labels readable) while the sweep still gives depth.
      g.rotation.y = story.az * 0.7 * (1 - o);
      g.visible = o < 0.97 && enter > 0.001;
    }
    // Planes align over the first part of the chapter; the nodes travel
    // along their orbits and settle by the reading hold (rings ≈ 0.72).
    const t = smooth(story.rings / (compact ? 0.45 : 0.72));
    const time = clock.elapsedTime;
    const active = orbitFocus.active;

    rings.current.forEach((ring, i) => {
      if (!ring) return;
      const r = RINGS[i];
      ring.rotation.set(
        MathUtils.lerp(r.from[0], r.tilt[0], t),
        MathUtils.lerp(r.from[1], r.tilt[1], t),
        MathUtils.lerp(r.from[2], r.tilt[2], t),
      );
      // A slow breath along the orbit keeps the system alive at rest.
      const carrier = carriers.current[i];
      const rest = compact ? r.compact : width < 1280 ? r.mid : r.angle;
      if (carrier) carrier.rotation.z = rest - (1 - t) * r.sweep + Math.sin(time * 0.35 + i * 2.1) * 0.035;

      // Focus: the chosen orbit brightens, the others step back a little.
      const gl = glow.current[i];
      gl.v = damp(gl.v, active === i ? 1 : active >= 0 ? -1 : 0, 7, dt);
      const lit = Math.max(0, gl.v);
      const back = Math.max(0, -gl.v);
      const m = mats[i];
      m.ring.emissiveIntensity = 0.05 + lit * 0.28;
      m.trail.opacity = (0.4 + lit * 0.45) * (1 - back * 0.55);
      m.node.emissiveIntensity = (1.6 + lit * 1.2) * (1 - back * 0.4);
      m.halo.opacity = (0.32 + lit * 0.4) * (1 - back * 0.5);
      const node = nodes.current[i];
      if (node) node.scale.setScalar(1 + lit * 0.3);
    });
    if (core.current) core.current.scale.setScalar(0.85 + t * 0.15);

    // Node controls on the page: shown while the orbit is composed in
    // frame, each placed on its node's projected screen position.
    const layer = orbitFocus.layer;
    if (!layer) return;
    // The canvas (not the window, which includes the scrollbar) is the frame.
    const vw = view.width;
    const vh = view.height;
    core.current?.getWorldPosition(scratch.c);
    camera.getWorldPosition(scratch.cam);
    const coreDepth = scratch.c.distanceTo(scratch.cam);
    const fov = (camera as PerspectiveCamera).fov;
    const pxPerUnit = vh / (2 * Math.tan(MathUtils.degToRad(fov) / 2) * coreDepth);
    const coreR = CORE * (core.current?.getWorldScale(scratch.p).x ?? 1) * pxPerUnit + 14;
    scratch.c.project(camera);
    const cx = ((scratch.c.x + 1) / 2) * vw;
    const cy = ((1 - scratch.c.y) / 2) * vh;

    // Shown once the orbit is composed and the camera has it in frame
    // (not while it is still entering from an edge).
    const framed = cx > vw * 0.1 && cx < vw * 0.95 && cy > Math.min(100, vh * 0.12) && cy < vh * 0.85;
    const shown = Boolean(g?.visible && g.parent?.visible) && story.dim < 0.25 && t > 0.55 && o < 0.04 && enter > 0.99 && framed;
    if (shown !== shownRef.current) {
      shownRef.current = shown;
      layer.toggleAttribute("data-shown", shown);
      // Out of the tab order and accessibility tree at once (not after the fade).
      layer.inert = !shown;
    }
    if (!shown) {
      // Nothing stays in focus once the orbit has left the screen.
      if (orbitFocus.active >= 0) window.dispatchEvent(new Event("orbit:hidden"));
      return;
    }

    cardRef.current ??= document.querySelector("#about .chapter-card");
    const card = cardRef.current?.getBoundingClientRect();
    // Where a label may go: never over the text card.
    const bounds = {
      minX: card && card.right < vw * 0.7 ? card.right + 12 : 12,
      maxX: vw - 12,
      minY: 8,
      // Phones and tablets: the card rises from below across the full width.
      maxY: (card && card.right >= vw * 0.7 ? Math.min(vh, card.top) : vh) - 8,
    };

    const points: Point[] = [];
    orbitFocus.anchors.forEach((a, i) => {
      const node = nodes.current[i];
      if (!a || !node) return;
      node.getWorldPosition(scratch.p);
      const depth = scratch.p.distanceTo(scratch.cam);
      scratch.p.project(camera);
      const x = ((scratch.p.x + 1) / 2) * vw;
      const y = ((1 - scratch.p.y) / 2) * vh;
      // Hidden when off screen, under the text card, or behind the core.
      const offscreen = x < 16 || x > vw - 16 || y < 16 || y > vh - 16;
      // (On phones the card rises from below: a node bows out a little before
      // the card's edge reaches it, while its label still has room.)
      const above = card && card.right >= vw * 0.7 ? 48 : 12;
      const underCard = card ? x > card.left - 12 && x < card.right + 12 && y > card.top - above && y < card.bottom + 12 : false;
      const behindCore = depth > coreDepth && Math.hypot(x - cx, y - cy) < coreR;
      const hidden = offscreen || underCard || behindCore;
      if (a.hasAttribute("data-hidden") !== hidden) {
        a.toggleAttribute("data-hidden", hidden);
        a.inert = hidden;
      }
      a.style.transform = `translate3d(${x.toFixed(1)}px, ${y.toFixed(1)}px, 0)`;
      // The name's width never changes: measured once.
      const name = a.querySelector<HTMLElement>(".orbit-name");
      if (name && !a.dataset.nameWidth && name.offsetWidth) a.dataset.nameWidth = String(name.offsetWidth);
      points.push({ a, x, y, hidden, nameW: Number(a.dataset.nameWidth) || 84 });
    });
    placeLabels(
      points,
      { cx, cy, coreR },
      bounds,
      { minX: 8, maxX: vw - 8, minY: 8, maxY: bounds.maxY },
      Math.min(208, vw - 48),
      card ? [card.left, card.top, card.right, card.bottom] : null,
    );
  });

  return (
    <Station at={STATION.about}>
      <group ref={all}>
        <group ref={core}>
          <mesh material={coreMat}>
            <sphereGeometry args={[CORE, 64, 48]} />
          </mesh>
          {/* Ambient illumination: a soft champagne bloom behind the core. */}
          <sprite material={coreHalo} scale={narrow ? 2.2 : 2.8} position={[0, 0, -0.4]} />
        </group>
        {RINGS.map((r, i) => (
          <group
            key={r.radius}
            ref={(el) => {
              rings.current[i] = el;
            }}
          >
            <mesh material={mats[i].ring}>
              <torusGeometry args={[r.radius, narrow ? 0.02 : 0.014, 10, 180]} />
            </mesh>
            <group
              ref={(el) => {
                carriers.current[i] = el;
              }}
            >
              {/* The orbit's light trail: fades in along the ring toward the
                  node, behind it in its direction of travel. */}
              <group scale-y={r.sweep < 0 ? -1 : 1}>
                <mesh material={mats[i].trail} rotation-z={-TRAIL_ARC}>
                  <torusGeometry args={[r.radius, narrow ? 0.026 : 0.02, 6, 72, TRAIL_ARC]} />
                </mesh>
              </group>
              <mesh
                ref={(el) => {
                  nodes.current[i] = el;
                }}
                material={mats[i].node}
                position={[r.radius, 0, 0]}
              >
                <sphereGeometry args={[narrow ? 0.085 : 0.07, 20, 14]} />
              </mesh>
              <sprite material={mats[i].halo} position={[r.radius, 0, 0]} scale={narrow ? 0.62 : 0.5} />
            </group>
          </group>
        ))}
      </group>
    </Station>
  );
}

import { useEffect, useMemo, useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { Decal, RoundedBox } from "@react-three/drei";
import gsap from "gsap";
import {
  AdditiveBlending,
  BoxGeometry,
  Color,
  InstancedMesh,
  Matrix4,
  MeshStandardMaterial,
  Raycaster,
  Vector2,
  type Group,
  type Mesh,
  type MeshBasicMaterial,
  type SpotLight,
} from "three";
import { createGlowTexture, createKeycapGeometry, createLegendTexture, KEY } from "../keycap";
import { HERO_STUDIO, useStudioMap } from "../StudioEnvironment";
import { intro, story } from "./story";
import {
  activateCuriousKey,
  CURIOUS,
  keys as springs,
  physicalDown,
  physicalUp,
  press,
  release,
  releaseAll,
  shouldIgnoreKey,
  stepSprings,
  tap,
} from "./keyInput";

/**
 * Phase 24 — a product shot, not a gaming peripheral. At rest nothing glows:
 * dye-sublimated legends are printed, the caps are matte PBT, the housing is
 * anodised graphite aluminium with one thin brass inlay. Light appears only
 * where a real keyboard would show it: a warm backlight through a pressed key.
 */
const BACKLIGHT = new Color("#ffd2a0");
/** The curious key's hint: its legend and faint breathing light are brass, not blue. */
const BRASS = new Color("#c9a46a");
/**
 * Phase 34 — hero materials, tuned as a product photograph. Hero only: none of
 * these values is shared with another scene (the still lifes share the studio
 * map, HERO_STUDIO, which is deliberately unchanged).
 */
/** Dye-sublimated legends: a warm off-white, a little brighter so they read on phones. */
const LEGEND = "#e4dfd5";
/**
 * Graphite PBT: a near-neutral pigment (a touch cool, so the warm key light
 * doesn't turn the caps brown), each cap only a hair different in tone and a
 * little more in finish, as moulded caps are. Matte: PBT is rougher than ABS.
 */
const CAP_TONE = [0, 0.005, -0.003, 0.002, -0.005, 0.002];
const CAP_ROUGH = [0.66, 0.62, 0.68, 0.64, 0.61, 0.67];
const capColor = (i: number) => new Color("#25272a").offsetHSL(0, 0, CAP_TONE[i] ?? 0);
/** Less studio fill on the caps, so the key light shapes them (lit tops, darker fronts). */
const CAP_ENV = 0.7;
/** Anodised aluminium in neutral graphite (was faintly blue). */
const HOUSING = "#545455";
/** A dark warm desk that reads as a surface under the keyboard, not a void. */
const DESK = "#312e2a";
const LETTERS = "NITHIN".split("");
const PITCH = KEY.width + KEY.gap;
export const ROW_WIDTH = LETTERS.length * PITCH + 0.5;
const PLATE = { height: 0.3, depth: 1.6 };
const KEY_REST_Y = PLATE.height + KEY.height / 2 + 0.015;
const FONT = "Inter, Arial, sans-serif";
const PRESS_DEPTH = 0.09;
/** Full switch travel for a real press (scroll's sweep uses the shallower PRESS_DEPTH). */
const TRAVEL = 0.17;
const keyX = (i: number) => (i - (LETTERS.length - 1) / 2) * PITCH;
/** Elements that keep their own clicks: the keyboard never steals them. */
const INTERACTIVE = "a, button, input, textarea, select, label, summary, nav, [role='button'], [contenteditable='true']";

// Resolves once the signature intro overlay has gone, so the key drop is seen.
function whenIntroDone(): Promise<void> {
  if (!document.getElementById("opening")) return Promise.resolve();
  return new Promise((resolve) => {
    window.addEventListener("intro:done", () => resolve(), { once: true });
  });
}

/**
 * The approved NITHIN keyboard, now the origin and destination of the journey,
 * and an instrument: every key can be pressed with a click or tap, and the
 * physical N, I, T and H keys press their virtual counterparts (see keyInput).
 * One key (CURIOUS) glows a little differently; clicking or tapping it (or
 * pressing the physical T key, handled with the workbench) opens the hidden
 * workbench. Scroll still drives the sequential press as the hero
 * scrolls away, and the finale glow.
 */
export function Keyboard({ shadows }: { shadows: boolean }) {
  const geometry = useMemo(createKeycapGeometry, []);
  const legends = useMemo(() => LETTERS.map((l) => createLegendTexture(l, FONT)), []);
  const glow = useMemo(createGlowTexture, []);
  const keyRefs = useRef<(Group | null)[]>([]);
  const capRefs = useRef<(Mesh | null)[]>([]);
  const legendRefs = useRef<(MeshStandardMaterial | null)[]>([]);
  const underRefs = useRef<(MeshBasicMaterial | null)[]>([]);
  const ledRef = useRef<MeshStandardMaterial>(null);
  const glowRef = useRef<MeshBasicMaterial>(null);
  const sweepRef = useRef<SpotLight>(null);
  const lit = useRef({ legend: 0, led: 0, pool: 0 });
  const { camera, gl } = useThree();
  // The keyboard's own studio reflections (the rest of the world keeps its own).
  const env = useStudioMap(HERO_STUDIO, shadows ? 128 : 64);

  // Switch housings under the caps: one instanced draw, seen in the gaps as a key goes down.
  const housings = useMemo(() => {
    const mesh = new InstancedMesh(
      new BoxGeometry(0.66, 0.14, 0.66),
      new MeshStandardMaterial({ color: "#121212", roughness: 0.72, metalness: 0 }),
      LETTERS.length,
    );
    const m = new Matrix4();
    LETTERS.forEach((_, i) => mesh.setMatrixAt(i, m.makeTranslation(keyX(i), PLATE.height + 0.07, 0)));
    return mesh;
  }, []);

  useEffect(() => {
    const keyGroups = keyRefs.current.filter(Boolean) as Group[];
    // Keys wait above the frame, so they fall into view rather than hover in it.
    keyGroups.forEach((k) => (k.position.y = KEY_REST_Y + 7));
    let tl: gsap.core.Timeline | undefined;
    let cancelled = false;
    whenIntroDone().then(() => {
      if (cancelled) return;
      // Opening shot: the camera settles in (intro.t) while the keys drop and
      // light — one calm, readable move, then scroll takes over.
      tl = gsap
        .timeline({ defaults: { ease: "power4.out" } })
        .to(intro, { t: 1, duration: 2.6, ease: "power3.out" }, 0)
        .to(keyGroups.map((k) => k.position), { y: KEY_REST_Y, duration: 1.25, stagger: 0.085, ease: "back.out(1.15)" }, 0.15)
        .to(lit.current, { legend: 1, duration: 0.9 }, 0.6)
        .to(lit.current, { led: 1, pool: 1, duration: 1.4 }, 0.75)
        .fromTo(sweepRef.current!.position, { x: -7 }, { x: 7, duration: 2.4, ease: "power2.inOut" }, 0.35)
        .to(sweepRef.current!, { intensity: 6, duration: 1.2 }, 1.95);
    });
    return () => {
      cancelled = true;
      tl?.kill();
    };
  }, []);

  // Input: pointer (raycast against the six caps), physical keys, and the
  // accessible HTML key controls in the hero (a "key:tap" window event).
  useEffect(() => {
    const raycaster = new Raycaster();
    const ndc = new Vector2();
    const caps = () => capRefs.current.filter(Boolean) as Mesh[];
    const hit = (x: number, y: number): number => {
      if (story.dim > 0.25) return -1;
      const r = gl.domElement.getBoundingClientRect();
      ndc.set(((x - r.left) / r.width) * 2 - 1, -((y - r.top) / r.height) * 2 + 1);
      raycaster.setFromCamera(ndc, camera);
      const found = raycaster.intersectObjects(caps(), false)[0];
      return found ? capRefs.current.indexOf(found.object as Mesh) : -1;
    };

    let pointerKey = -1;
    let downAt = 0;
    const onPointerDown = (e: PointerEvent) => {
      if (!e.isPrimary || e.button !== 0) return;
      if ((e.target as Element | null)?.closest?.(INTERACTIVE)) return;
      const i = hit(e.clientX, e.clientY);
      if (i < 0) return;
      // Stops text selection/focus moves; a key is never on top of a link.
      e.preventDefault();
      pointerKey = i;
      downAt = performance.now();
      press(i);
    };
    const onPointerUp = (e: PointerEvent) => {
      if (pointerKey < 0) return;
      const i = pointerKey;
      pointerKey = -1;
      // A very quick tap still shows the full travel.
      window.setTimeout(() => release(i), Math.max(0, 90 - (performance.now() - downAt)));
      // The curious key opens the workbench when the press completes (not on a
      // cancelled touch) — through the same activation as the physical T key.
      if (i === CURIOUS && e.type === "pointerup") activateCuriousKey();
    };

    let hoverQueued = false;
    let lastMove: PointerEvent | null = null;
    const root = document.documentElement;
    const onPointerMove = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      lastMove = e;
      if (hoverQueued) return;
      hoverQueued = true;
      requestAnimationFrame(() => {
        hoverQueued = false;
        const m = lastMove;
        if (!m) return;
        const over = !(m.target as Element | null)?.closest?.(INTERACTIVE) && hit(m.clientX, m.clientY) >= 0;
        root.classList.toggle("key-hover", over);
      });
    };

    const onKeyDown = (e: KeyboardEvent) => {
      // Animation only: the physical T key's activation lives with the
      // workbench (so it also works without the 3D keyboard). Both use the
      // same guard, and nothing here ever calls preventDefault.
      if (shouldIgnoreKey(e)) return;
      physicalDown(e);
    };
    const onKeyUp = (e: KeyboardEvent) => physicalUp(e);
    const onBlur = () => releaseAll();
    const onHidden = () => document.hidden && releaseAll();

    const onTap = (e: Event) => tap((e as CustomEvent<number>).detail);

    window.addEventListener("pointerdown", onPointerDown);
    window.addEventListener("pointerup", onPointerUp);
    window.addEventListener("pointercancel", onPointerUp);
    window.addEventListener("pointermove", onPointerMove, { passive: true });
    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("keyup", onKeyUp);
    window.addEventListener("blur", onBlur);
    document.addEventListener("visibilitychange", onHidden);
    window.addEventListener("key:tap", onTap);
    return () => {
      window.removeEventListener("pointerdown", onPointerDown);
      window.removeEventListener("pointerup", onPointerUp);
      window.removeEventListener("pointercancel", onPointerUp);
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("keyup", onKeyUp);
      window.removeEventListener("blur", onBlur);
      document.removeEventListener("visibilitychange", onHidden);
      window.removeEventListener("key:tap", onTap);
      root.classList.remove("key-hover");
      releaseAll();
    };
  }, [camera, gl]);

  // The instanced switch housings are built imperatively, so their map is too.
  useEffect(() => {
    (housings.material as MeshStandardMaterial).envMap = env;
    (housings.material as MeshStandardMaterial).needsUpdate = true;
  }, [env, housings]);

  useEffect(
    () => () => {
      geometry.dispose();
      glow.dispose();
      legends.forEach((t) => t.dispose());
      housings.geometry.dispose();
      (housings.material as MeshStandardMaterial).dispose();
    },
    [geometry, glow, legends, housings],
  );

  useFrame(({ clock }, dt) => {
    stepSprings(dt);
    const boost = 1 + story.finale * 0.6;
    // The curious key breathes very slowly; enough to notice, not to shout.
    const breath = 0.5 + 0.5 * Math.sin(clock.elapsedTime * 1.3);
    // Sequential press: key i is down while keyPress sweeps through its slot.
    const n = LETTERS.length;
    let lightSum = 0;
    capRefs.current.forEach((cap, i) => {
      if (!cap) return;
      const t = story.keyPress * (n + 1) - i;
      const press = t > 0 && t < 2 ? Math.sin((t / 2) * Math.PI) : 0;
      const s = springs[i];
      cap.position.y = -PRESS_DEPTH * press - TRAVEL * s.x;
      // Light response: a restrained lift while pressed.
      const light = Math.max(0, s.x) * 0.9 + s.flash * 0.6;
      lightSum += light;
      const curious = i === CURIOUS ? 0.12 + breath * 0.1 : 0;
      const m = legendRefs.current[i];
      if (m) {
        m.opacity = lit.current.legend;
        // Printed at rest; a pressed key lets its switch light through.
        m.emissiveIntensity = lit.current.legend * ((press * 0.5 + light * 1.1) * boost + curious * 0.6);
      }
      const u = underRefs.current[i];
      if (u) u.opacity = lit.current.pool * Math.min(0.45, light * 0.35 + curious * 0.7);
    });
    // The brass inlay warms very slightly while keys are pressed.
    if (ledRef.current) ledRef.current.emissiveIntensity = lit.current.led * lightSum * 0.06 * boost;
    // Contact shadow: the keyboard settles onto the desk as it lands.
    if (glowRef.current) glowRef.current.opacity = lit.current.pool * 0.8;
  });

  return (
    <group rotation-y={-0.16}>
      <RoundedBox args={[ROW_WIDTH, PLATE.height, PLATE.depth]} radius={0.08} smoothness={4} position={[0, PLATE.height / 2, 0]} castShadow receiveShadow>
        {/* Bead-blasted, anodised graphite aluminium: metallic but satin, with
            a faint brushed (anisotropic) direction; no clearcoat. */}
        {shadows ? (
          <meshPhysicalMaterial color={HOUSING} metalness={0.85} roughness={0.42} anisotropy={0.45} envMap={env} envMapIntensity={1} />
        ) : (
          <meshStandardMaterial color={HOUSING} metalness={0.85} roughness={0.44} envMap={env} envMapIntensity={1} />
        )}
      </RoundedBox>

      <primitive object={housings} />

      {/* The desk: a matte surface that takes the key light's falloff (and,
          on the full tier, the real shadow), fading out at its edges. */}
      <mesh rotation-x={-Math.PI / 2} position={[0, -0.02, 0.1]} scale={[ROW_WIDTH + 7, PLATE.depth + 6, 1]} receiveShadow={shadows}>
        <planeGeometry />
        <meshStandardMaterial map={glow} color={DESK} roughness={0.9} metalness={0} transparent depthWrite={false} envMap={env} envMapIntensity={0.7} />
      </mesh>
      {/* Contact shadow: soft occlusion where the housing meets the desk
          (all tiers; phones have no shadow maps). */}
      <mesh rotation-x={-Math.PI / 2} position={[0, 0.002, 0.04]} scale={[ROW_WIDTH + 1.1, PLATE.depth + 1.1, 1]}>
        <planeGeometry />
        <meshBasicMaterial ref={glowRef} map={glow} color="#000" transparent opacity={0} depthWrite={false} />
      </mesh>

      {/* A single brushed-brass inlay along the front edge: the one warm metal. */}
      <mesh position={[0, 0.035, PLATE.depth / 2 + 0.004]}>
        <boxGeometry args={[ROW_WIDTH - 0.3, 0.022, 0.012]} />
        <meshStandardMaterial ref={ledRef} color="#a8885a" metalness={1} roughness={0.34} emissive={BACKLIGHT} emissiveIntensity={0} envMap={env} envMapIntensity={1.1} />
      </mesh>
      {/* Soft neutral fill from the front-right: opens the shadow side of the
          caps without flattening them. Phase 34: a true neutral, a little
          lower, so the warm key light does the shaping. */}
      <pointLight position={[2.6, 3.2, 5]} color="#e8e9ea" intensity={10} distance={12} decay={2} />
      {/* A low warm kicker from behind-left: separates the caps' top edges
          from the dark background (Phase 34: stronger, for a clean edge light). */}
      <pointLight position={[-3.4, 2.6, -3]} color="#f4ece2" intensity={20} distance={10} decay={2} />

      {LETTERS.map((_, i) => (
        <group
          key={i}
          ref={(el) => {
            keyRefs.current[i] = el;
          }}
          position={[keyX(i), KEY_REST_Y + 3, 0]}
        >
          <mesh
            ref={(el) => {
              capRefs.current[i] = el;
            }}
            geometry={geometry}
            castShadow={shadows}
            receiveShadow={shadows}
          >
            {/* Matte PBT: a dielectric (no metalness) with a soft, textured
                sheen at grazing angles instead of a glossy clearcoat. */}
            {/* Light tier (phones): standard material — far cheaper shader compile. */}
            {shadows ? (
              <meshPhysicalMaterial color={capColor(i)} roughness={CAP_ROUGH[i]} metalness={0} sheen={0.5} sheenRoughness={0.7} sheenColor="#6b6b6b" envMap={env} envMapIntensity={CAP_ENV} />
            ) : (
              <meshStandardMaterial color={capColor(i)} roughness={CAP_ROUGH[i]} metalness={0} envMap={env} envMapIntensity={CAP_ENV} />
            )}
            <Decal position={[0, KEY.height / 2, 0]} rotation={[-Math.PI / 2, 0, 0]} scale={[0.6, 0.6, 0.3]}>
              <meshStandardMaterial
                ref={(el) => {
                  legendRefs.current[i] = el;
                }}
                map={legends[i]}
                color={i === CURIOUS ? BRASS : LEGEND}
                roughness={0.55}
                metalness={0}
                envMap={env}
                emissive={i === CURIOUS ? BRASS : BACKLIGHT}
                emissiveMap={legends[i]}
                emissiveIntensity={0}
                transparent
                opacity={0}
                polygonOffset
                polygonOffsetFactor={-10}
                depthWrite={false}
              />
            </Decal>
          </mesh>
          {/* Per-key underglow: the switch's LED bleeding onto the plate when pressed. */}
          <mesh rotation-x={-Math.PI / 2} position={[0, -KEY.height / 2 + 0.01, 0.05]} scale={[1.5, 1.5, 1]}>
            <planeGeometry />
            <meshBasicMaterial
              ref={(el) => {
                underRefs.current[i] = el;
              }}
              map={glow}
              color={i === CURIOUS ? BRASS : BACKLIGHT}
              transparent
              opacity={0}
              blending={AdditiveBlending}
              depthWrite={false}
              toneMapped={false}
            />
          </mesh>
        </group>
      ))}

      {/* The opening sweep (timeline unchanged), now a warm studio light. */}
      <spotLight ref={sweepRef} position={[-7, 5, 5]} angle={0.32} penumbra={1} intensity={40} color="#ffeedd" distance={18} />
    </group>
  );
}

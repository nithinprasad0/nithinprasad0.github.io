import { useEffect, useMemo, useRef, useState } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { PerformanceMonitor } from "@react-three/drei";
import { Color, Fog, MathUtils, SRGBColorSpace, Vector3, type DirectionalLight, type PerspectiveCamera, type SpotLight } from "three";
import { StudioEnvironment } from "../StudioEnvironment";
import { AboutCore } from "./AboutCore";
import { Constellation } from "./Constellation";
import { Keyboard } from "./Keyboard";
import { ProjectGallery } from "./ProjectGallery";
import { Signal } from "./Signal";
import { applyCalm, applyEnv } from "./kit";
import { bindStory, intro, story } from "./story";
import { Systems } from "./Systems";
import { Waypoints } from "./Waypoints";

type Tier = "full" | "lite";
type Props = { tier: Tier; onReady: () => void; onError: () => void };

const OBSIDIAN = "#07090d";

// Applies story state to the camera every frame: position, target, a lens
// shift that places the subject beside the text, portrait pull-back, light
// pointer parallax (desktop), fog depth and the editorial dimming.
/** The rim lights take on each environment's colour (set by the Rig). */
const rims: { current: (DirectionalLight | SpotLight | null)[] } = { current: [] };

function Rig({ tier }: { tier: Tier }) {
  const { camera, size, scene, gl } = useThree();
  const pointer = useRef({ x: 0, y: 0, sx: 0, sy: 0 });
  const pos = useMemo(() => new Vector3(), []);
  const look = useMemo(() => new Vector3(), []);
  const fog = useMemo(() => new Fog(OBSIDIAN, 8, 42), []);
  const lastScrim = useRef(-1);
  const envColor = useMemo(() => new Color(), []);
  const rimColor = useMemo(() => new Color(), []);
  const lastEnv = useRef("");
  const lastFrame = useRef("");

  useEffect(() => {
    scene.fog = fog;
    if (tier !== "full") return;
    const onMove = (e: PointerEvent) => {
      pointer.current.x = (e.clientX / window.innerWidth) * 2 - 1;
      pointer.current.y = (e.clientY / window.innerHeight) * 2 - 1;
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => window.removeEventListener("pointermove", onMove);
  }, [scene, fog, tier]);

  useFrame((_, dt) => {
    const cam = camera as PerspectiveCamera;
    const p = pointer.current;
    const k = 1 - Math.exp(-dt * 2.5);
    p.sx += (p.x - p.sx) * k;
    p.sy += (p.y - p.sy) * k;

    // Narrow screens: a longer orbit distance so each station (all roughly
    // 7–8 units wide) still fits the narrower horizontal field of view.
    const aspect = size.width / size.height;
    const pullBack = aspect < 1.7 ? Math.min(2.2, Math.pow(1.7 / aspect, 0.85)) : 1;

    // Orbit → position: azimuth/elevation/distance around the target. Only
    // part of the narrow-screen pull-back is distance (so the camera never
    // backs into the previous station along the corridor); the rest widens
    // the lens.
    look.set(story.lookX, story.lookY, story.lookZ);
    // Desktop-layout widths (e.g. 1024×768) only need a mild pull-back, so it
    // is all distance there (keeps the hero keyboard inside the frame).
    const distScale = size.width > 850 ? Math.pow(pullBack, 1.5) : Math.pow(pullBack, 0.4);
    const lensScale = Math.max(1, pullBack / distScale);

    // One-time arrival on load: the camera settles in from further out and
    // lower, then hands over entirely to scroll.
    const arrive = 1 - intro.t;
    const d = story.dist * distScale * (1 + arrive * 0.32);
    const el = story.el - arrive * 0.2;
    const az = story.az + arrive * 0.28;
    const ce = Math.cos(el);
    pos.set(Math.sin(az) * ce * d, Math.sin(el) * d, Math.cos(az) * ce * d).add(look);
    pos.x += p.sx * 0.5;
    pos.y -= p.sy * 0.25;
    cam.position.copy(pos);
    cam.lookAt(look);
    cam.rotateZ(story.roll);
    const fov = MathUtils.radToDeg(2 * Math.atan(Math.tan(MathUtils.degToRad(story.fov) / 2) * lensScale));
    if (Math.abs(cam.fov - fov) > 0.01) {
      cam.fov = fov;
      cam.updateProjectionMatrix();
    }

    // Lens shift: positive frameX pushes the subject to the right of the
    // viewport (text column on the left); frameY pushes it upward.
    const w = size.width;
    const h = size.height;
    // Mid-width desktops (e.g. 1024×768) have a wider text column relative to
    // the screen, so the subject shifts a little further right.
    const shiftX = story.frameX * (aspect < 1.6 && w > 850 ? 1 + (1.6 - aspect) * 0.35 : 1);
    cam.setViewOffset(w, h, -shiftX * w, story.frameY * h, w, h);
    // Which side the text sits on, for the reading scrim (DOM write on change only).
    const side = story.frameX < -0.05 ? "right" : "left";
    if (side !== lastFrame.current) {
      lastFrame.current = side;
      document.documentElement.dataset.frame = side;
    }

    // Fog scales with the pull-back so distant framing doesn't wash subjects out.
    fog.far = story.fogFar * pullBack;
    fog.near = Math.min(8, story.fogFar * 0.2) * pullBack;
    gl.domElement.style.opacity = String(1 - story.dim * 0.55);

    // Environment: background, fog, rim lights and the illustrations' accent
    // all follow the chapter (Phase 9); a CSS atmosphere layer picks up the
    // rim colour, written only when it changes noticeably.
    // Palette values are sRGB; tell three so they aren't brightened as linear.
    envColor.setRGB(story.envR, story.envG, story.envB, SRGBColorSpace);
    gl.setClearColor(envColor);
    fog.color.copy(envColor);
    rimColor.setRGB(story.rimR, story.rimG, story.rimB, SRGBColorSpace);
    rims.current.forEach((l) => l?.color.copy(rimColor));
    applyEnv(story.accR, story.accG, story.accB);
    const key = `${Math.round(story.rimR * 255)} ${Math.round(story.rimG * 255)} ${Math.round(story.rimB * 255)}`;
    if (key !== lastEnv.current) {
      lastEnv.current = key;
      document.documentElement.style.setProperty("--env-rim", key);
    }

    // Section-aware readability: quieter accents and a soft scrim behind the
    // text column while a panel is being read (desktop layout only).
    applyCalm(story.calm);
    const scrim = Math.round(story.calm * 100) / 100;
    if (scrim !== lastScrim.current) {
      lastScrim.current = scrim;
      document.documentElement.style.setProperty("--world-calm", String(scrim));
    }
  });

  return null;
}

function FirstFrame({ onReady }: { onReady: () => void }) {
  const done = useRef(false);
  useFrame(() => {
    if (done.current) return;
    done.current = true;
    requestAnimationFrame(onReady);
  });
  return null;
}

// Framing follows the layout breakpoint (text beside vs. below the subject),
// not the device tier, so landscape tablets get the desktop composition.
function StoryBinder() {
  const narrow = useThree((s) => s.size.width <= 850);
  useEffect(() => bindStory(narrow), [narrow]);
  return null;
}

/**
 * The persistent world behind the whole page: one canvas, one camera, every
 * chapter's structure placed along one continuous signal path.
 */
// Builds the world in stages so no single task blocks the main thread for
// seconds on slower phones: the hero keyboard first, then the nearby
// stations, then the far ones — each in its own idle slot after a frame.
function useStagedMount(stages: number) {
  const [stage, setStage] = useState(0);
  useEffect(() => {
    if (stage >= stages) return;
    let id: number;
    const next = () => setStage((s) => s + 1);
    const raf = requestAnimationFrame(() => {
      id = typeof window.requestIdleCallback === "function" ? window.requestIdleCallback(next, { timeout: 700 }) : window.setTimeout(next, 120);
    });
    return () => {
      cancelAnimationFrame(raf);
      if (typeof window.cancelIdleCallback === "function") window.cancelIdleCallback(id);
      window.clearTimeout(id);
    };
  }, [stage, stages]);
  return stage;
}

/**
 * Rendering resolution. The canvas draws at the screen's own pixel density
 * (Retina phones are 3×), so edges, lines and in-scene text are as sharp as
 * the HTML around them, within a pixel budget per tier: a phone gets its full
 * 3×, a large tablet or desktop is held to a few million pixels. Under load
 * the resolution steps down gently, never below a floor that keeps edges
 * crisp (2× on touch devices), and returns when there is headroom.
 */
function resolutionRange(tier: Tier) {
  const full = tier === "full";
  const device = window.devicePixelRatio || 1;
  const area = window.innerWidth * window.innerHeight;
  const budget = full ? 5.5e6 : 4.2e6;
  const max = Math.max(1, Math.min(device, full ? 2 : 3, Math.sqrt(budget / area)));
  return { min: Math.min(max, full ? (device >= 2 ? 1.25 : 1) : 2), max };
}

const DPR_STEP = 0.25;

export default function World({ tier, onReady, onError }: Props) {
  const full = tier === "full";
  const range = useMemo(() => resolutionRange(tier), [tier]);
  const [dpr, setDpr] = useState(range.max);
  const stage = useStagedMount(4);
  // Performance is judged only once loading has settled: the first seconds
  // (shader compiles, staged mounts) are slow on every device and would
  // otherwise drop the resolution for good.
  const [watch, setWatch] = useState(false);
  useEffect(() => {
    const t = window.setTimeout(() => setWatch(true), 4000);
    return () => window.clearTimeout(t);
  }, []);

  return (
    <Canvas
      className="!pointer-events-none"
      dpr={dpr}
      shadows={full ? "percentage" : false}
      camera={{ position: [0, 4.6, 8.4], fov: 32, near: 0.1, far: 400 }}
      gl={{ antialias: true, alpha: false, powerPreference: "high-performance" }}
      onCreated={({ gl }) => {
        gl.setClearColor(OBSIDIAN);
        gl.domElement.addEventListener("webglcontextlost", onError, { once: true });
      }}
    >
      {watch && (
        <PerformanceMonitor
          // 60 Hz screens: below 45 fps step down, at a steady ~60 step back up
          // (a 30 fps Low Power Mode cap only ever reaches the floor).
          bounds={(refresh) => (refresh > 90 ? [55, 90] : [45, 58])}
          flipflops={6}
          onDecline={() => setDpr((d) => Math.max(range.min, d - DPR_STEP))}
          onIncline={() => setDpr((d) => Math.min(range.max, d + DPR_STEP))}
        />
      )}

      <ambientLight intensity={0.14} />
      <directionalLight
        position={[2.5, 7, 4]}
        intensity={2}
        color="#dbe8ff"
        castShadow={full}
        shadow-mapSize={[1024, 1024]}
        shadow-bias={-0.0004}
        shadow-normalBias={0.02}
        shadow-camera-left={-5}
        shadow-camera-right={5}
        shadow-camera-top={3}
        shadow-camera-bottom={-3}
      />
      {/* Rim lights: their colour follows the chapter's environment (see Rig). */}
      <directionalLight ref={(l) => void (rims.current[0] = l)} position={[-6, 4, -20]} intensity={0.7} color="#3a7bff" />
      <spotLight ref={(l) => void (rims.current[1] = l)} position={[-5, 3.5, -4]} angle={0.7} penumbra={1} intensity={70} color="#1f74ff" distance={16} />
      <spotLight ref={(l) => void (rims.current[2] = l)} position={[6, 2.5, -3.5]} angle={0.7} penumbra={1} intensity={45} color="#48a9ff" distance={16} />

      <StudioEnvironment resolution={full ? 256 : 64} />

      <Keyboard shadows={full} />
      {stage >= 1 && <Signal lite={!full} />}
      {stage >= 2 && (
        <>
          <AboutCore />
          <Systems />
        </>
      )}
      {stage >= 3 && <ProjectGallery />}
      {stage >= 4 && (
        <>
          <Constellation />
          <Waypoints />
        </>
      )}

      <StoryBinder />
      <Rig tier={tier} />
      <FirstFrame onReady={onReady} />
    </Canvas>
  );
}

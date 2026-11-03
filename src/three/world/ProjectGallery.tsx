import { useEffect, useMemo, useRef, type ReactNode } from "react";
import { useFrame } from "@react-three/fiber";
import { RoundedBox } from "@react-three/drei";
import {
  CatmullRomCurve3,
  EdgesGeometry,
  InstancedMesh,
  LineBasicMaterial,
  LineSegments,
  Matrix4,
  PlaneGeometry,
  SphereGeometry,
  TubeGeometry,
  Vector3,
  type Group,
  type Material,
  type Mesh,
  type MeshBasicMaterial,
  type MeshStandardMaterial,
} from "three";
import { BLUE, Label, MAT, Pool, clamp01, smooth } from "./kit";
import { PROJECT_COUNT, STATION, story } from "./story";
import { avatarMaterial, BrowserDevice, MonitorDevice, PhoneDevice, ui } from "./devices";

/*
 * Project illustrations. Each is a specific visual metaphor for what the
 * software does (not a screenshot — every one carries an ILLUSTRATION label
 * and the HTML says so). Every composition follows the same five scroll
 * phases, with its own choreography:
 *
 *   approach  lp 0 → 1   intro (elements appear) → assembly (take position)
 *                        → interaction (data / relationships flow)
 *   showcase  lp = 1     stable final state while the description is read
 *   leave     lp 1 → 2   hand-off: the composition recedes for the next one
 *
 * lp comes from story.project (scroll), so everything reverses on scroll-up.
 */

const lp = (i: number) => Math.min(2, Math.max(0, story.project - i + 1));
/** 0→1 as the approach passes from a to b (stays 1 in showcase and leave). */
const phase = (i: number, a: number, b: number) => smooth((Math.min(lp(i), 1) - a) / (b - a));
const leave = (i: number) => smooth(lp(i) - 1);

const v = (x: number, y: number, z: number) => new Vector3(x, y, z);
const curve = (...pts: Vector3[]) => new CatmullRomCurve3(pts);

/* ------------------------------------------------------------ Primitives */

/** Scales its children in over a phase window (intro / assembly beats). */
function Appear({ i, a, b, children, from = 0.001 }: { i: number; a: number; b: number; children: ReactNode; from?: number }) {
  const ref = useRef<Group>(null);
  useFrame(() => {
    const p = phase(i, a, b);
    if (!ref.current) return;
    ref.current.scale.setScalar(from + (1 - from) * p);
    ref.current.visible = p > 0.001;
  });
  return <group ref={ref}>{children}</group>;
}

/** A connection that draws itself along a curve over a phase window. */
function FlowArc({ i, a, b, path, radius = 0.014 }: { i: number; a: number; b: number; path: CatmullRomCurve3; radius?: number }) {
  const SEG = 40;
  const geo = useMemo(() => new TubeGeometry(path, SEG, radius, 5, false), [path, radius]);
  useEffect(() => () => geo.dispose(), [geo]);
  useFrame(() => geo.setDrawRange(0, Math.floor(phase(i, a, b) * SEG) * 5 * 6));
  return <mesh geometry={geo} material={MAT.glowSoft} frustumCulled={false} />;
}

/** A data packet that travels a curve over a phase window. */
function Packet({ i, a, b, path, keep = false, shape = "box" }: { i: number; a: number; b: number; path: CatmullRomCurve3; keep?: boolean; shape?: "box" | "token" }) {
  const ref = useRef<Mesh>(null);
  useFrame(() => {
    const p = phase(i, a, b);
    if (!ref.current) return;
    path.getPointAt(Math.min(0.999, p), ref.current.position);
    ref.current.visible = keep ? p > 0.001 : p > 0.001 && p < 0.999;
  });
  return (
    <mesh ref={ref} material={MAT.ice} visible={false}>
      {shape === "token" ? <octahedronGeometry args={[0.09, 0]} /> : <boxGeometry args={[0.1, 0.1, 0.1]} />}
    </mesh>
  );
}

function Tag({ text, at }: { text: string; at: [number, number, number] }) {
  return <Label text={text} position={at} height={0.15} pill />;
}

function Stage({ index, name, children }: { index: number; name: string; children: ReactNode }) {
  const at = useMemo(() => v(STATION.projectX(index), 0.6, STATION.projectZ(index)), [index]);
  const ref = useRef<Group>(null);
  const inner = useRef<Group>(null);
  useFrame(({ camera }) => {
    if (!ref.current || !inner.current) return;
    // Only near its own turn, never in the distant overview, and never while
    // the camera passes through it.
    const near = Math.abs(story.project - index) < 1.6 && story.dim < 0.25;
    // Hand-off: recede as the next project takes over, then shrink away so a
    // wide (tablet) lens never shows last project's leftovers beside the next.
    const l = leave(index);
    const gone = smooth((l - 0.55) / 0.45);
    ref.current.visible = near && gone < 0.999 && camera.position.distanceTo(at) > 3.4;
    inner.current.scale.setScalar(0.001 + (1 - l * 0.3) * (1 - gone));
    inner.current.position.set(0, -l * 0.4, -l * 1.6);
  });
  return (
    <group ref={ref} position={at}>
      <group rotation-y={-Math.sign(at.x) * 0.3}>
        <group ref={inner}>
          {children}
          {/* Grounding: a pool of the project's own light beneath it. */}
          <Pool position={[0, -2.3, 0]} scale={[7.5, 4.5]} opacity={0.26} />
          <Label text={name.toUpperCase()} position={[0, 2.15, 0]} height={0.26} />
          <Label text="ILLUSTRATION" position={[0, -1.85, 0]} height={0.12} color="#8f99ab" />
        </group>
      </group>
    </group>
  );
}

/* ------------------------------------------------------------ InsightGen */
// Dataset → question → analysis → visual insights.
function InsightGen() {
  const I = 0;
  const cols = 5;
  const rows = 6;
  const cells = useRef<(Mesh | null)[]>([]);
  const engine = useRef<Mesh>(null);
  const bars = useRef<(Mesh | null)[]>([]);
  const heights = [0.5, 0.82, 0.62, 1.1, 1.38];
  const toEngine = useMemo(() => [0, 1, 2, 3, 4].map((k) => curve(v(-1.75 + (k % 3) * 0.3, 0.3 - k * 0.12, 0.05), v(-0.8, 0.75 - k * 0.1, 0.4), v(0, 0.2, -0.2))), []);
  const toChart = useMemo(() => [0, 1, 2, 3].map((k) => curve(v(0, 0.2, -0.2), v(0.8, 0.9 - k * 0.12, 0.3), v(1.25 + k * 0.32, -0.2, 0))), []);
  const trend = useMemo(() => curve(...heights.map((h, k) => v(1.12 + k * 0.32, -0.62 + h + 0.22, 0.05))), []);
  useFrame(() => {
    cells.current.forEach((m, n) => {
      if (!m) return;
      const r = Math.floor(n / cols);
      m.scale.setScalar(0.001 + phase(I, 0.04 + r * 0.04, 0.2 + r * 0.04));
    });
    if (engine.current) engine.current.rotation.z = lp(I) * 2.2;
    bars.current.forEach((m, k) => {
      if (!m) return;
      const h = 0.02 + heights[k] * phase(I, 0.66 + k * 0.03, 0.86 + k * 0.03);
      m.scale.y = h;
      m.position.y = -0.62 + h / 2;
    });
  });
  return (
    <group>
      {/* Natural-language question */}
      <Appear i={I} a={0} b={0.22}>
        <group position={[-1.7, 1.28, 0.2]}>
          <BrowserDevice draw={ui.query} w={1.9} h={0.3} />
          <Tag text="NATURAL-LANGUAGE QUESTION" at={[0, 0.36, 0]} />
        </group>
      </Appear>
      {/* Uploaded dataset */}
      <group position={[-1.7, 0.1, 0]}>
        {Array.from({ length: cols * rows }, (_, n) => (
          <mesh
            key={n}
            ref={(el) => {
              cells.current[n] = el;
            }}
            material={n < cols ? MAT.ice : MAT.glass}
            position={[-0.68 + (n % cols) * 0.34, 0.45 - Math.floor(n / cols) * 0.19, 0]}
          >
            <boxGeometry args={[0.3, 0.14, 0.03]} />
          </mesh>
        ))}
        <Appear i={I} a={0.1} b={0.3}>
          <Tag text="DATASET" at={[0, -0.75, 0]} />
        </Appear>
      </group>
      {/* Analysis */}
      <Appear i={I} a={0.3} b={0.5}>
        <group position={[0, 0.2, -0.2]}>
          <mesh ref={engine} material={MAT.metal}>
            <torusGeometry args={[0.45, 0.05, 10, 48]} />
          </mesh>
          <mesh material={MAT.glow}>
            <icosahedronGeometry args={[0.18, 1]} />
          </mesh>
          <Tag text="ANALYSIS" at={[0, -0.72, 0.2]} />
        </group>
      </Appear>
      {toEngine.map((c, k) => (
        <Packet key={`in${k}`} i={I} a={0.42 + k * 0.03} b={0.6 + k * 0.03} path={c} />
      ))}
      {toChart.map((c, k) => (
        <Packet key={`out${k}`} i={I} a={0.6 + k * 0.03} b={0.76 + k * 0.03} path={c} />
      ))}
      {/* Insights */}
      <group>
        <Appear i={I} a={0.6} b={0.7}>
          <mesh material={MAT.metal} position={[1.76, -0.65, 0]}>
            <boxGeometry args={[1.75, 0.04, 0.4]} />
          </mesh>
        </Appear>
        {heights.map((_, k) => (
          <mesh
            key={k}
            ref={(el) => {
              bars.current[k] = el;
            }}
            material={k === 4 ? MAT.glow : MAT.glass}
            position={[1.12 + k * 0.32, -0.6, 0]}
          >
            <boxGeometry args={[0.22, 1, 0.22]} />
          </mesh>
        ))}
        <FlowArc i={I} a={0.82} b={0.96} path={trend} radius={0.016} />
        <Appear i={I} a={0.88} b={1}>
          <group position={[1.78, 1.35, 0.15]}>
            <BrowserDevice draw={ui.insights} w={1.4} h={0.74} />
            <Tag text="INSIGHTS" at={[0, 0.58, 0]} />
          </group>
        </Appear>
      </group>
    </group>
  );
}

/* ------------------------------------------------------------------ Revo */
// Members gather around a shared feed; reactions connect people to posts;
// moderation and access control frame the community.
function Revo() {
  const I = 1;
  const N = 8;
  const ring = useMemo(() => Array.from({ length: N }, (_, k) => { const t = (k / N) * Math.PI * 2 + 0.3; return v(Math.cos(t) * 2.0, Math.sin(t) * 1.15, -0.25); }), []);
  const scattered = useMemo(() => ring.map((p, k) => p.clone().multiplyScalar(1.75).add(v(0, (k % 3) * 0.3 - 0.3, 0.4))), [ring]);
  const members = useRef<(Group | null)[]>([]);
  const cards = useRef<(Group | null)[]>([]);
  const cardY = [0.55, 0.05, -0.45];
  const reactions = useMemo(() => ring.map((p, k) => curve(p, p.clone().lerp(v(0, cardY[k % 3], 0.1), 0.5).add(v(0, 0, 0.45)), v(0.32 * (p.x > 0 ? 1 : -1), cardY[k % 3], 0.06))), [ring]);
  useFrame(() => {
    members.current.forEach((g, k) => {
      if (!g) return;
      const p = phase(I, 0.02 + k * 0.02, 0.3 + k * 0.02);
      g.position.lerpVectors(scattered[k], ring[k], p);
      g.scale.setScalar(0.001 + Math.min(1, p * 3));
    });
    cards.current.forEach((g, k) => {
      if (!g) return;
      const p = phase(I, 0.3 + k * 0.06, 0.48 + k * 0.06);
      g.position.x = (1 - p) * 0.8;
      g.scale.setScalar(0.001 + p);
    });
  });
  return (
    <group>
      {/* Community feed */}
      <Appear i={I} a={0.18} b={0.34}>
        <PhoneDevice draw={ui.feed} scale={1.15} />
        <Tag text="COMMUNITY FEED" at={[0, 1.24, 0.1]} />
      </Appear>
      {cardY.map((y, k) => (
        <group
          key={k}
          ref={(el) => {
            cards.current[k] = el;
          }}
          position={[0, y, 0.06]}
        >
          <mesh material={MAT.glass}>
            <planeGeometry args={[0.86, 0.4]} />
          </mesh>
          <mesh material={MAT.ice} position={[-0.32, 0.08, 0.01]}>
            <circleGeometry args={[0.06, 16]} />
          </mesh>
          <mesh material={MAT.ice} position={[0.06, 0.08, 0.01]}>
            <planeGeometry args={[0.5, 0.04]} />
          </mesh>
          <mesh material={MAT.glowSoft} position={[-0.02, -0.06, 0.01]}>
            <planeGeometry args={[0.66, 0.03]} />
          </mesh>
        </group>
      ))}
      {/* Member profiles */}
      {ring.map((_, k) => (
        <group
          key={k}
          ref={(el) => {
            members.current[k] = el;
          }}
        >
          <mesh material={avatarMaterial()}>
            <circleGeometry args={[0.15, 24]} />
          </mesh>
          <mesh material={k % 3 === 0 ? MAT.glow : MAT.ice} rotation-x={0}>
            <torusGeometry args={[0.2, 0.015, 6, 32]} />
          </mesh>
        </group>
      ))}
      {/* Reactions and comments connect members to posts */}
      {reactions.map((c, k) => (
        <FlowArc key={k} i={I} a={0.56 + k * 0.03} b={0.72 + k * 0.03} path={c} radius={0.01} />
      ))}
      {/* Moderation and access control */}
      <Appear i={I} a={0.84} b={1}>
        <group position={[1.85, -1.3, 0.35]}>
          <RoundedBox args={[0.42, 0.5, 0.06]} radius={0.12} smoothness={3} material={MAT.glass} />
          <mesh material={MAT.glow} position={[-0.05, -0.02, 0.04]} rotation-z={-0.8}>
            <boxGeometry args={[0.04, 0.14, 0.02]} />
          </mesh>
          <mesh material={MAT.glow} position={[0.05, 0.03, 0.04]} rotation-z={0.6}>
            <boxGeometry args={[0.04, 0.26, 0.02]} />
          </mesh>
          <Tag text="MODERATION" at={[0, -0.45, 0]} />
        </group>
        <group position={[-1.85, -1.3, 0.35]}>
          <mesh material={MAT.metal}>
            <boxGeometry args={[0.36, 0.28, 0.12]} />
          </mesh>
          <mesh material={MAT.ice} position={[0, 0.16, 0]}>
            <torusGeometry args={[0.12, 0.025, 8, 24, Math.PI]} />
          </mesh>
          <Tag text="ACCESS CONTROL" at={[0, -0.42, 0]} />
        </group>
      </Appear>
    </group>
  );
}

/* -------------------------------------------------------------- Profexia */
// Learners and teachers exchange skills in both directions, on an admin layer.
function Profexia() {
  const I = 2;
  const cluster = (cx: number) => [v(cx, 0.1, 0), ...[0, 1, 2, 3, 4].map((k) => { const t = (k / 5) * Math.PI * 2 + 0.6; return v(cx + Math.cos(t) * 0.55, 0.1 + Math.sin(t) * 0.55, Math.sin(t * 2) * 0.15); })];
  const learners = useMemo(() => cluster(-1.7), []);
  const teachers = useMemo(() => cluster(1.7), []);
  const paths = useMemo(
    () => [1.05, 0.45, -0.25, -0.85].map((h, k) => curve(learners[1 + k], v(0, 0.1 + h, 0.35 * (k % 2 ? -1 : 1)), teachers[1 + ((k + 2) % 5)])),
    [learners, teachers],
  );
  const reversed = useMemo(() => paths.map((p) => new CatmullRomCurve3([...p.points].reverse())), [paths]);
  const grid = useMemo(() => new LineSegments(new EdgesGeometry(new PlaneGeometry(4.8, 1.6, 6, 2)), new LineBasicMaterial({ color: BLUE, transparent: true, opacity: 0.35 })), []);
  useEffect(() => () => grid.geometry.dispose(), [grid]);
  // The person is a profile card; the satellites around it are their skills.
  const node = (card: typeof ui.learner, skill: Material) => (p: Vector3, k: number) =>
    k === 0 ? (
      <group key={k} position={p}>
        <BrowserDevice draw={card} w={0.95} h={0.6} />
      </group>
    ) : (
      <mesh key={k} material={skill} position={p}>
        <sphereGeometry args={[0.1, 16, 12]} />
      </mesh>
    );
  return (
    <group>
      <Appear i={I} a={0} b={0.24}>
        {learners.map(node(ui.learner, MAT.glass))}
        <Tag text="LEARNERS" at={[-1.7, -0.75, 0.2]} />
      </Appear>
      <Appear i={I} a={0.1} b={0.34}>
        {teachers.map(node(ui.teacher, MAT.violet))}
        <Tag text="TEACHERS" at={[1.7, -0.75, 0.2]} />
      </Appear>
      {/* Administrative layer beneath the exchange */}
      <Appear i={I} a={0.3} b={0.5}>
        <group position={[0, -1.1, 0]} rotation-x={-Math.PI / 2}>
          <mesh material={MAT.glass}>
            <planeGeometry args={[4.8, 1.6]} />
          </mesh>
          <primitive object={grid} />
          <mesh material={MAT.glow} position={[0, 0, 0.02]}>
            <torusGeometry args={[0.28, 0.02, 6, 40]} />
          </mesh>
        </group>
        <Tag text="ADMIN" at={[0, -1.32, 0.75]} />
      </Appear>
      {/* Exchange pathways, then skills travelling both ways */}
      {paths.map((p, k) => (
        <FlowArc key={k} i={I} a={0.44 + k * 0.03} b={0.6 + k * 0.03} path={p} radius={0.012} />
      ))}
      {paths.map((p, k) => (
        <Packet key={k} i={I} a={0.62 + k * 0.04} b={0.9 + k * 0.025} path={k % 2 ? reversed[k] : p} keep shape="token" />
      ))}
      <Appear i={I} a={0.8} b={0.95}>
        <Tag text="SKILLS EXCHANGED BOTH WAYS" at={[0, 1.55, 0.3]} />
      </Appear>
    </group>
  );
}

/* ------------------------------------------------------ Child Vaccination */
// A calendar, a patient record, scheduled doses placed on dates, reminders.
function Vaccination() {
  const I = 3;
  const due = useMemo(() => [2, 6, 11, 15, 20, 26], []);
  const tiles = useRef<(Mesh | null)[]>([]);
  const doses = useRef<(Mesh | null)[]>([]);
  const dots = useRef<(Mesh | null)[]>([]);
  const tile = (n: number) => v(-1.05 + (n % 7) * 0.35, 0.55 - Math.floor(n / 7) * 0.3, 0);
  useFrame(() => {
    tiles.current.forEach((m, n) => {
      if (m) m.scale.setScalar(0.001 + phase(I, 0.02 + Math.floor(n / 7) * 0.04, 0.18 + Math.floor(n / 7) * 0.04));
    });
    doses.current.forEach((m, k) => {
      if (!m) return;
      const p = phase(I, 0.42 + k * 0.05, 0.56 + k * 0.05);
      const t = tile(due[k]);
      m.position.set(t.x, t.y + (1 - p) * 1.1, 0.08);
      m.visible = p > 0.01;
    });
    dots.current.forEach((m, k) => {
      if (m) m.material = phase(I, 0.42 + k * 0.05, 0.56 + k * 0.05) > 0.95 ? MAT.glow : MAT.glass;
    });
  });
  return (
    <group>
      {/* Schedule calendar */}
      <group position={[0.65, 0.3, 0]} rotation-x={-0.3}>
        <Appear i={I} a={0} b={0.14}>
          <mesh material={MAT.ice} position={[0, 0.88, 0]}>
            <boxGeometry args={[2.45, 0.08, 0.03]} />
          </mesh>
          <Tag text="VACCINATION SCHEDULE" at={[0, 1.15, 0]} />
        </Appear>
        {Array.from({ length: 35 }, (_, n) => (
          <mesh
            key={n}
            ref={(el) => {
              tiles.current[n] = el;
            }}
            material={MAT.glass}
            position={tile(n)}
          >
            <boxGeometry args={[0.3, 0.25, 0.03]} />
          </mesh>
        ))}
        {due.map((_, k) => (
          <mesh
            key={k}
            ref={(el) => {
              doses.current[k] = el;
            }}
            material={MAT.glow}
            visible={false}
          >
            <sphereGeometry args={[0.07, 12, 8]} />
          </mesh>
        ))}
        {/* Reminders on the next scheduled dates */}
        <Appear i={I} a={0.8} b={0.96}>
          {due.slice(3).map((n, k) => {
            const t = tile(n);
            return (
              <group key={k} position={[t.x + 0.12, t.y + 0.2, 0.12]}>
                <mesh material={MAT.ice}>
                  <coneGeometry args={[0.06, 0.09, 12]} />
                </mesh>
                <mesh material={MAT.ice} position={[0, -0.06, 0]}>
                  <sphereGeometry args={[0.022, 8, 6]} />
                </mesh>
              </group>
            );
          })}
          <Tag text="REMINDERS" at={[0.9, -1.0, 0.1]} />
        </Appear>
      </group>
      {/* Patient record */}
      <Appear i={I} a={0.18} b={0.38}>
        <group position={[-1.95, 0.25, 0.3]}>
          <RoundedBox args={[1.05, 1.45, 0.04]} radius={0.05} smoothness={2} material={MAT.glass} />
          <mesh material={MAT.ice} position={[0, 0.45, 0.03]}>
            <circleGeometry args={[0.13, 20]} />
          </mesh>
          {[0.18, 0.04, -0.1, -0.24, -0.38].map((y, k) => (
            <mesh key={y} material={k === 0 ? MAT.ice : MAT.glowSoft} position={[0, y, 0.03]}>
              <planeGeometry args={[k === 0 ? 0.62 : 0.78, 0.04]} />
            </mesh>
          ))}
          <Tag text="PATIENT RECORD" at={[0, -0.92, 0]} />
        </group>
      </Appear>
      {/* Dose timeline */}
      <Appear i={I} a={0.3} b={0.44}>
        <group position={[0.15, -1.25, 0.2]}>
          <mesh material={MAT.metal}>
            <boxGeometry args={[3.4, 0.03, 0.03]} />
          </mesh>
          {due.map((_, k) => (
            <mesh
              key={k}
              ref={(el) => {
                dots.current[k] = el;
              }}
              material={MAT.glass}
              position={[-1.5 + k * 0.6, 0, 0]}
            >
              <sphereGeometry args={[0.07, 12, 8]} />
            </mesh>
          ))}
          <Tag text="SCHEDULED DOSES" at={[-1.1, 0.24, 0]} />
        </group>
      </Appear>
    </group>
  );
}

/* ------------------------------------------------------------- FaceAttend */
// A wireframe face, a recognition frame locking on, a scan, attendance marked.
function FaceAttend() {
  const I = 4;
  const face = useRef<MeshBasicMaterial>(null);
  const corners = useRef<(Group | null)[]>([]);
  const scan = useRef<Mesh>(null);
  const marks = useRef<(Mesh | null)[]>([]);
  const present = useMemo(() => [1, 1, 0, 1, 1, 0], []);
  // Facial landmarks on the face's front surface (an ellipsoid 0.78 × 1.05 ×
  // 0.72): brows, eyes, nose, mouth and jaw — the points recognition measures.
  const landmarks = useMemo(() => {
    const pts: [number, number][] = [
      [-0.38, 0.42], [-0.26, 0.47], [-0.13, 0.44], [0.13, 0.44], [0.26, 0.47], [0.38, 0.42],
      [-0.3, 0.28], [-0.18, 0.28], [0.18, 0.28], [0.3, 0.28],
      [0, 0.18], [0, 0.0], [-0.09, -0.1], [0.09, -0.1],
      [-0.2, -0.36], [0, -0.32], [0.2, -0.36], [0, -0.42],
      [-0.46, -0.3], [0, -0.74], [0.46, -0.3],
    ];
    const mesh = new InstancedMesh(new SphereGeometry(0.025, 8, 6), MAT.ice, pts.length);
    const m = new Matrix4();
    pts.forEach(([x, y], k) => {
      const z = 0.72 * Math.sqrt(Math.max(0, 1 - (x / 0.78) ** 2 - (y / 1.05) ** 2)) + 0.02;
      mesh.setMatrixAt(k, m.makeTranslation(x, y, z));
    });
    return mesh;
  }, []);
  useEffect(() => () => landmarks.geometry.dispose(), [landmarks]);
  const marksGroup = useRef<Group>(null);
  useFrame(() => {
    if (face.current) face.current.opacity = 0.08 + phase(I, 0, 0.3) * 0.32 + phase(I, 0.62, 0.78) * 0.18;
    const lock = phase(I, 0.3, 0.55);
    if (marksGroup.current) {
      const l = phase(I, 0.42, 0.62);
      marksGroup.current.scale.setScalar(0.001 + l);
      marksGroup.current.visible = l > 0.01;
    }
    corners.current.forEach((g, k) => {
      if (!g) return;
      const sx = k % 2 ? 1 : -1;
      const sy = k < 2 ? 1 : -1;
      g.position.set(-0.85 + sx * (0.82 + (1 - lock) * 0.6), 0.15 + sy * (1.02 + (1 - lock) * 0.5), 0.3);
      g.visible = lock > 0.01;
    });
    const s = phase(I, 0.5, 0.74);
    if (scan.current) {
      scan.current.position.y = 1.1 - s * 1.95;
      scan.current.visible = s > 0.01 && s < 0.99;
    }
    marks.current.forEach((m, k) => {
      if (!m) return;
      const on = present[k] && phase(I, 0.72 + k * 0.02, 0.8 + k * 0.02) > 0.5;
      m.material = on ? MAT.mint : MAT.glass;
    });
  });
  return (
    <group>
      <group position={[-0.85, 0.15, 0]}>
        <mesh scale={[0.78, 1.05, 0.72]}>
          <sphereGeometry args={[1, 22, 16]} />
          <meshBasicMaterial ref={face} color="#8fc8ff" wireframe transparent opacity={0.08} />
        </mesh>
        <group ref={marksGroup}>
          <primitive object={landmarks} />
        </group>
      </group>
      {/* Recognition frame: four corner brackets close in on the face */}
      {[0, 1, 2, 3].map((k) => (
        <group
          key={k}
          ref={(el) => {
            corners.current[k] = el;
          }}
          rotation-z={[0, -Math.PI / 2, Math.PI / 2, Math.PI][k]}
        >
          <mesh material={MAT.glow} position={[0.12, 0, 0]}>
            <boxGeometry args={[0.26, 0.025, 0.02]} />
          </mesh>
          <mesh material={MAT.glow} position={[0, -0.12, 0]}>
            <boxGeometry args={[0.025, 0.26, 0.02]} />
          </mesh>
        </group>
      ))}
      {/* The camera the face is enrolled and recognised through. */}
      <Appear i={I} a={0} b={0.2}>
        <group position={[-0.85, 1.62, 0.25]}>
          <mesh material={MAT.frame}>
            <boxGeometry args={[0.56, 0.18, 0.2]} />
          </mesh>
          <mesh material={MAT.metal} position={[0, 0, 0.101]}>
            <circleGeometry args={[0.07, 24]} />
          </mesh>
          <mesh material={MAT.acrylic} position={[0, 0, 0.104]}>
            <circleGeometry args={[0.05, 24]} />
          </mesh>
          <mesh material={MAT.mint} position={[0.18, 0, 0.102]}>
            <circleGeometry args={[0.014, 10]} />
          </mesh>
        </group>
      </Appear>
      <mesh ref={scan} material={MAT.ice} position={[-0.85, 1.1, 0.32]} visible={false}>
        <boxGeometry args={[1.5, 0.018, 0.018]} />
      </mesh>
      <Appear i={I} a={0.7} b={0.84}>
        <Tag text="RECOGNISED" at={[-0.85, -1.25, 0.3]} />
      </Appear>
      {/* Attendance */}
      <Appear i={I} a={0.12} b={0.36}>
        <group position={[1.45, 0.15, 0]}>
          <BrowserDevice draw={ui.attendance} w={1.5} h={1.9} />
          {present.map((_, k) => (
            <mesh
              key={k}
              ref={(el) => {
                marks.current[k] = el;
              }}
              material={MAT.glass}
              position={[0.52, 0.95 - ((69 + k * 43.3) / 324) * 1.9, 0.03]}
            >
              <circleGeometry args={[0.055, 16]} />
            </mesh>
          ))}
          <Tag text="ATTENDANCE RECORDS" at={[0, -1.18, 0.1]} />
        </group>
      </Appear>
    </group>
  );
}

/* ------------------------------------------------------- GEM Applications */
// Employee & admin Android apps → Firebase → Windows .NET connector →
// TallyPrime bill entry: one connected business ecosystem.
function Phone({ label }: { label: string }) {
  return (
    <group>
      <PhoneDevice draw={label.startsWith("ADMIN") ? ui.admin : ui.employee} scale={0.68} />
      <Tag text={label} at={[0, -0.82, 0]} />
    </group>
  );
}

function GemApps() {
  const I = 5;
  const emp = v(-2.35, 0.25, 0.8);
  const adm = v(-1.55, 0.05, -0.85);
  const fb = v(0, 0.6, 0);
  const desk = v(1.9, 0.3, -0.9);
  const tally = v(2.55, -0.85, 0.35);
  const paths = useMemo(
    () => ({
      empFb: curve(emp, v(-1.2, 1.25, 0.5), fb),
      admFb: curve(adm, v(-0.75, 0.9, -0.6), fb),
      fbDesk: curve(fb, v(1.0, 1.2, -0.5), desk),
      deskTally: curve(desk, v(2.5, -0.1, -0.2), tally),
    }),
    [],
  );
  const sync = useRef<MeshStandardMaterial>(null);
  const sheets = useRef<(Mesh | null)[]>([]);
  useFrame(() => {
    const flow = phase(I, 0.5, 0.86);
    if (sync.current) sync.current.emissiveIntensity = 0.5 + Math.sin(Math.PI * flow) * 2 + phase(I, 0.86, 1) * 0.6;
    sheets.current.forEach((m, k) => {
      if (m) m.visible = phase(I, 0.8, 0.98) * 6 > k;
    });
  });
  return (
    <group>
      <Appear i={I} a={0} b={0.2}>
        <group position={emp} rotation-y={0.3}>
          <Phone label="EMPLOYEE APP" />
        </group>
      </Appear>
      <Appear i={I} a={0.06} b={0.26}>
        <group position={adm} rotation-y={0.35}>
          <Phone label="ADMIN APP" />
        </group>
      </Appear>
      {/* Employee workflows */}
      <Appear i={I} a={0.2} b={0.36}>
        <Tag text="ORDERS · PAYMENTS · ROUTES" at={[-2.35, 1.2, 0.85]} />
      </Appear>
      <Appear i={I} a={0.12} b={0.3}>
        <group position={fb}>
          {[0, 2].map((k) => (
            <mesh key={k} material={MAT.metal} position={[0, k * 0.18 - 0.18, 0]}>
              <cylinderGeometry args={[0.5, 0.5, 0.12, 40]} />
            </mesh>
          ))}
          <mesh>
            <cylinderGeometry args={[0.5, 0.5, 0.04, 40]} />
            <meshStandardMaterial ref={sync} color="#000" emissive={BLUE} emissiveIntensity={0.5} toneMapped={false} />
          </mesh>
          <Tag text="FIREBASE" at={[0, -0.52, 0.2]} />
        </group>
      </Appear>
      <Appear i={I} a={0.2} b={0.38}>
        <group position={desk} rotation-y={-0.3}>
          <MonitorDevice draw={ui.connector} w={1.15} h={0.7} />
          <Tag text="WINDOWS · .NET CONNECTOR" at={[0, 0.6, 0]} />
        </group>
      </Appear>
      <Appear i={I} a={0.28} b={0.44}>
        <group position={tally}>
          {Array.from({ length: 6 }, (_, k) => (
            <mesh
              key={k}
              ref={(el) => {
                sheets.current[k] = el;
              }}
              material={k === 5 ? MAT.glow : MAT.glass}
              position={[0, -0.18 + k * 0.07, 0]}
              visible={false}
            >
              <boxGeometry args={[0.7, 0.04, 0.5]} />
            </mesh>
          ))}
          <mesh material={MAT.metal} position={[0, -0.24, 0]}>
            <boxGeometry args={[0.8, 0.04, 0.6]} />
          </mesh>
          <Tag text="TALLYPRIME · BILL ENTRY" at={[0, -0.55, 0.2]} />
        </group>
      </Appear>
      {/* Connections draw, then data moves through the system in order */}
      <FlowArc i={I} a={0.34} b={0.48} path={paths.empFb} />
      <FlowArc i={I} a={0.38} b={0.52} path={paths.admFb} />
      <FlowArc i={I} a={0.42} b={0.56} path={paths.fbDesk} />
      <FlowArc i={I} a={0.46} b={0.6} path={paths.deskTally} />
      <Packet i={I} a={0.52} b={0.66} path={paths.empFb} />
      <Packet i={I} a={0.58} b={0.7} path={paths.empFb} />
      <Packet i={I} a={0.56} b={0.7} path={paths.admFb} />
      <Packet i={I} a={0.68} b={0.82} path={paths.fbDesk} />
      <Packet i={I} a={0.78} b={0.92} path={paths.deskTally} />
    </group>
  );
}

/* --------------------------------------------- Hand-off to the Stack chapter */
// Each project releases one token that arcs into the technology constellation.
function ConvergeTokens() {
  const curves = useMemo(
    () =>
      Array.from({ length: PROJECT_COUNT }, (_, i) => {
        const from = v(STATION.projectX(i), 0.6, STATION.projectZ(i));
        const to = STATION.stack;
        const midp = from.clone().lerp(to, 0.5).add(v(0, 6 + i, 0));
        return new CatmullRomCurve3([from, midp, to.clone()]);
      }),
    [],
  );
  const refs = useRef<(Mesh | null)[]>([]);
  useFrame(() => {
    const c = story.converge;
    refs.current.forEach((m, i) => {
      if (!m) return;
      const t = clamp01(c * 1.3 - i * 0.05);
      m.visible = t > 0.01 && t < 0.99;
      if (m.visible) curves[i].getPointAt(smooth(t), m.position);
    });
  });
  return (
    <>
      {curves.map((_, i) => (
        <mesh
          key={i}
          ref={(el) => {
            refs.current[i] = el;
          }}
          material={MAT.ice}
          visible={false}
        >
          <sphereGeometry args={[0.16, 14, 10]} />
        </mesh>
      ))}
    </>
  );
}

const COMPOSITIONS = [
  { name: "InsightGen", Comp: InsightGen },
  { name: "Revo", Comp: Revo },
  { name: "Profexia", Comp: Profexia },
  { name: "Child Vaccination", Comp: Vaccination },
  { name: "FaceAttend", Comp: FaceAttend },
  { name: "GEM Business Apps", Comp: GemApps },
] as const;

export function ProjectGallery() {
  return (
    <>
      {COMPOSITIONS.slice(0, PROJECT_COUNT).map(({ name, Comp }, i) => (
        <Stage key={name} index={i} name={name}>
          <Comp />
        </Stage>
      ))}
      <ConvergeTokens />
    </>
  );
}

import { useEffect, useMemo, useRef, type ReactNode } from "react";
import { useFrame } from "@react-three/fiber";
import { CatmullRomCurve3, TubeGeometry, Vector3, type Group, type Mesh } from "three";
import { clamp01, Label, MAT, Pool, Station, smooth } from "./kit";
import { STATION, story } from "./story";
import { BillStack, BrowserDevice, MonitorDevice, PhoneDevice, ServerRack, ui } from "./devices";

// GEM Group's business technology ecosystem, read top to bottom in the same
// order as the numbered Experience entries beside it:
//   01 employee and admin Android apps
//   02 Firebase, which carries orders, collections and routes
//   03 the Windows .NET connector feeding TallyPrime bill entry
//   04 the business websites, a separate deliverable (so no data link).
// Nodes are staggered front to back for depth, but within a range where none
// shrinks too far into the distance to read.
const NODES = {
  employee: new Vector3(-0.9, 2.8, 0.35),
  admin: new Vector3(0.9, 2.8, -0.9),
  firebase: new Vector3(0, 0.6, -0.5),
  connector: new Vector3(0, -1.6, -0.6),
  tally: new Vector3(1.95, -1.6, -1.35),
  web: new Vector3(2.75, 0.6, -1.7),
};
type NodeId = keyof typeof NODES;

/** Data flow, in reveal order, with each end anchored at a node's edge
    (offsets from the node) so lines never cross a label. */
const LINKS: [NodeId, [number, number], NodeId, [number, number]][] = [
  ["employee", [0.15, -1.15], "firebase", [-0.25, 0.45]],
  ["admin", [-0.15, -1.15], "firebase", [0.25, 0.45]],
  ["firebase", [0, -0.45], "connector", [0, 0.5]],
  ["connector", [0.7, 0], "tally", [-0.52, 0]],
];
const SEG = 48;

/** Index of the Experience entry being read (-1: none), shared by all nodes. */
const focus = { area: -1, frame: 0 };

/**
 * Marks the entry at the reading line, both here (for the nodes) and in the
 * HTML (data-active), at a few checks per second rather than on every scroll.
 */
function FocusSync() {
  const rows = useRef<NodeListOf<HTMLElement> | null>(null);
  useFrame(() => {
    if (++focus.frame % 8 || story.systems <= 0 || story.systemsOut >= 1) return;
    rows.current ??= document.querySelectorAll<HTMLElement>("[data-exp-area]");
    const line = window.innerHeight * 0.5;
    let area = -1;
    rows.current.forEach((row, k) => {
      const r = row.getBoundingClientRect();
      if (r.top <= line && r.bottom > line) area = k;
    });
    if (area !== focus.area) {
      focus.area = area;
      rows.current.forEach((row, k) => row.toggleAttribute("data-active", k === area));
    }
  });
  useEffect(
    () => () => {
      focus.area = -1;
      rows.current?.forEach((row) => row.removeAttribute("data-active"));
    },
    [],
  );
  return null;
}

function Node({
  id,
  area,
  order,
  label,
  labelAt = [0, -0.95, 0.25],
  children,
}: {
  id: NodeId;
  area: number;
  order: number;
  label: string;
  labelAt?: [number, number, number];
  children: ReactNode;
}) {
  const ref = useRef<Group>(null);
  const emphasis = useRef(0.5);
  const quiet = useRef(0);
  const weight = useRef(1);
  useFrame((_, dt) => {
    const k = 1 - Math.exp(-dt * 7);
    emphasis.current += ((focus.area === area ? 1 : 0) - emphasis.current) * k;
    quiet.current += ((focus.area >= 0 ? 1 : 0) - quiet.current) * k;
    // The entry being read stays full strength; the others step back.
    weight.current = 1 - quiet.current * (1 - emphasis.current) * 0.6;
    const v = smooth(story.systems * 5 - order * 0.6 + 0.6);
    ref.current?.scale.setScalar(0.001 + v * (1 + emphasis.current * quiet.current * 0.08 - quiet.current * (1 - emphasis.current) * 0.06));
  });
  return (
    <group ref={ref} position={NODES[id]}>
      {children}
      <Label text={label} position={labelAt} height={0.2} pill weight={weight} />
    </group>
  );
}

function Link({ a, from, b, to, index }: { a: NodeId; from: [number, number]; b: NodeId; to: [number, number]; index: number }) {
  const geo = useMemo(() => {
    const A = NODES[a].clone().add(new Vector3(from[0], from[1], 0));
    const B = NODES[b].clone().add(new Vector3(to[0], to[1], 0));
    const mid = A.clone().lerp(B, 0.5).add(new Vector3(0, 0, 0.7));
    const curve = new CatmullRomCurve3([A, mid, B]);
    return { tube: new TubeGeometry(curve, SEG, 0.022, 6, false), curve };
  }, [a, b, from, to]);
  const pulse = useRef<Mesh>(null);
  useEffect(() => () => geo.tube.dispose(), [geo]);
  useFrame(() => {
    const p = clamp01(story.systems * (LINKS.length + 1) - index - 0.5);
    geo.tube.setDrawRange(0, Math.floor(p * SEG) * 6 * 6);
    if (pulse.current) {
      pulse.current.visible = p >= 1;
      // Data packet position follows scroll, not the clock.
      const t = (story.systems * 6 + index * 0.37) % 1;
      geo.curve.getPointAt(t, pulse.current.position);
    }
  });
  return (
    <group>
      <mesh geometry={geo.tube} material={MAT.glowSoft} frustumCulled={false} />
      <mesh ref={pulse} material={MAT.ice}>
        <sphereGeometry args={[0.07, 12, 8]} />
      </mesh>
    </group>
  );
}

// Hand-off: the finished system folds down and slides toward the project
// corridor as the camera leaves, so the network seems to feed the projects.
function FoldOut({ children }: { children: ReactNode }) {
  const ref = useRef<Group>(null);
  useFrame(() => {
    const o = smooth(story.systemsOut);
    if (!ref.current) return;
    ref.current.scale.setScalar(1 - o * 0.65);
    ref.current.position.set(-o * 6, -o * 0.4, -o * 9);
    ref.current.rotation.y = o * 0.6;
  });
  return <group ref={ref}>{children}</group>;
}

export function Systems() {
  return (
    <Station at={STATION.systems}>
      <FocusSync />
      <FoldOut>
        {/* A warm desk light under the workspace: the devices sit somewhere. */}
        <Pool position={[1, -2.95, -0.6]} scale={[9, 6]} opacity={0.22} color="#d8c5a1" />

        {/* 01 — the two role-specific Android apps, showing their real jobs. */}
        <Node id="employee" area={0} order={0} label="01 · EMPLOYEE APP">
          <PhoneDevice draw={ui.employee} />
        </Node>
        <Node id="admin" area={0} order={0.4} label="01 · ADMIN APP">
          <PhoneDevice draw={ui.admin} />
        </Node>

        {/* 02 — Firebase as data infrastructure (a small rack, one warm status light). */}
        <Node id="firebase" area={1} order={1} label="02 · FIREBASE DATA" labelAt={[-1.85, 0.12, 0.25]}>
          <ServerRack />
          <Label text="ORDERS · COLLECTIONS · ROUTES" position={[-1.85, -0.2, 0.25]} height={0.14} color="#9fb3cc" />
        </Node>

        {/* 03 — a Windows workstation running the .NET connector, feeding bill entry. */}
        <Node id="connector" area={2} order={2} label="03 · .NET CONNECTOR" labelAt={[0, -1.2, 0.25]}>
          <MonitorDevice draw={ui.connector} w={1.2} h={0.74} desk />
        </Node>
        <Node id="tally" area={2} order={2.5} label="03 · TALLYPRIME BILL ENTRY">
          <BillStack draw={ui.bill} />
        </Node>

        {/* 04 — the business websites: a separate deliverable, so no data link. */}
        <Node id="web" area={3} order={3} label="04 · BUSINESS WEBSITES">
          <BrowserDevice draw={ui.website} />
        </Node>

        {LINKS.map(([a, from, b, to], i) => (
          <Link key={`${a}-${b}`} a={a} from={from} b={b} to={to} index={i} />
        ))}
      </FoldOut>
    </Station>
  );
}

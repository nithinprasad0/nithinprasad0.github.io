import { useEffect, useMemo, useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { BufferGeometry, Color, LineBasicMaterial, LineSegments, Vector3, type Group } from "three";
import { stackGraph, stackPathways } from "../../content/portfolio";
import { ACCENT, ACCENT_LIGHT, Label, MAT, Station, smooth } from "./kit";
import { STATION, story } from "./story";
import { createKeycapGeometry } from "../keycap";

const SPREAD = 1.35;
const DIM = new Color("#2c4a7a");

/**
 * The technology ecosystem as a constellation. Nodes and edges come only from
 * stackGraph (relationships used in real projects). As the Stack chapter
 * scrolls, one pathway at a time lights up — the same pathway the HTML list
 * highlights — so relationships read one by one instead of all at once.
 */
export function Constellation() {
  const groups = useRef<(Group | null)[]>([]);
  // Technologies as small keycaps (the hero keyboard's language), one shared geometry.
  const cap = useMemo(createKeycapGeometry, []);
  useEffect(() => () => cap.dispose(), [cap]);
  const hub = useRef<Group>(null);
  const ids = useMemo(() => new Map(stackGraph.nodes.map((n, i) => [n.id, i])), []);
  const byLabel = useMemo(() => new Map(stackGraph.nodes.map((n) => [n.label, n.id])), []);
  // Phones and tablets (portrait frame, text below): the constellation keeps
  // its height, depth and keycap size but draws in a little horizontally, so
  // the outer clusters (Flutter, Android Studio, TallyPrime, GitHub) stay in
  // frame. Re-renders on resize; follows the page's 850px layout breakpoint.
  useThree((s) => s.size);
  const portrait = window.innerWidth <= 850;
  // (The mobile cluster reaches further left than the integration cluster
  // reaches right, so the portrait layout also moves the whole a little right.)
  const pos = useMemo(
    () =>
      stackGraph.nodes.map((n) => {
        const p = new Vector3(...n.pos).multiplyScalar(SPREAD);
        if (portrait) p.x = p.x * 0.68 + 0.9;
        return p;
      }),
    [portrait],
  );

  // Labels sit outward from the centre (and slightly up), away from edges.
  const labelPos = useMemo(
    () =>
      pos.map((p, i) => {
        const out = p.clone().setZ(0);
        if (out.lengthSq() < 0.01) out.set(0, 1, 0);
        out.normalize().multiplyScalar(stackGraph.nodes[i].core ? 0.66 : 0.5);
        return [out.x, out.y + 0.22, 0.05] as [number, number, number];
      }),
    [pos],
  );

  // One LineSegments per edge so each pathway can be highlighted on its own.
  const edges = useMemo(
    () =>
      stackGraph.edges.map(([a, b]) => {
        const geo = new BufferGeometry().setFromPoints([pos[ids.get(a)!], pos[ids.get(b)!]]);
        return { a, b, line: new LineSegments(geo, new LineBasicMaterial({ color: DIM, transparent: true, opacity: 0 })) };
      }),
    [ids, pos],
  );
  useEffect(() => () => edges.forEach((e) => e.line.geometry.dispose()), [edges]);

  // Which edges belong to each HTML pathway (only edges that exist in the graph).
  const pathwayEdges = useMemo(
    () =>
      stackPathways.map((p) => {
        const chain = p.chain.map((l) => byLabel.get(l)).filter(Boolean) as string[];
        const extra = p.with.map((l) => byLabel.get(l)).filter(Boolean) as string[];
        const set = new Set<number>();
        edges.forEach((e, k) => {
          const inChain = chain.includes(e.a) && chain.includes(e.b);
          const toExtra = (chain.includes(e.a) && extra.includes(e.b)) || (chain.includes(e.b) && extra.includes(e.a));
          if (inChain || toExtra) set.add(k);
        });
        return set;
      }),
    [edges, byLabel],
  );

  const htmlRows = useRef<NodeListOf<HTMLElement> | null>(null);
  const lastActive = useRef(-2);

  useFrame(() => {
    const s = story.stack;
    const out = smooth(story.stackOut);
    const n = stackGraph.nodes.length;
    groups.current.forEach((g, i) => {
      if (!g) return;
      g.scale.setScalar(0.001 + smooth(s * (n * 0.5) - i * 0.5 + 1) * (1 - out));
      g.position.copy(pos[i]).multiplyScalar(1 - out * 0.95);
    });
    if (hub.current) hub.current.scale.setScalar(0.001 + out * 1.2);

    // Active pathway: sweeps through the six pathways across the chapter.
    const active = s > 0.04 && s < 0.97 ? Math.min(stackPathways.length - 1, Math.floor(((s - 0.04) / 0.93) * stackPathways.length)) : -1;
    const base = smooth(s * 1.6 - 0.3) * (1 - out);
    edges.forEach((e, k) => {
      const m = e.line.material as LineBasicMaterial;
      const lit = active >= 0 && pathwayEdges[active].has(k);
      m.opacity = base * (lit ? 0.95 : active >= 0 ? 0.18 : 0.42);
      m.color.copy(lit ? ACCENT_LIGHT : active >= 0 ? DIM : ACCENT);
    });

    // Mirror the highlight in the accessible HTML list (DOM write only on change).
    if (active !== lastActive.current) {
      lastActive.current = active;
      htmlRows.current ??= document.querySelectorAll<HTMLElement>("[data-pathway]");
      htmlRows.current.forEach((row, k) => row.toggleAttribute("data-active", k === active));
    }
  });

  return (
    <Station at={STATION.stack} radius={40}>
      {edges.map((e, k) => (
        <primitive key={k} object={e.line} />
      ))}
      {stackGraph.nodes.map((node, i) => (
        <group
          key={node.id}
          ref={(el) => {
            groups.current[i] = el;
          }}
          position={pos[i]}
        >
          {node.core ? (
            // Core technologies: a lit key in translucent acrylic.
            <group rotation={[0.55, -0.35, 0]} scale={0.72}>
              <mesh geometry={cap} material={MAT.acrylic} />
              <mesh material={MAT.glow} scale={[0.42, 0.3, 0.42]}>
                <boxGeometry />
              </mesh>
            </group>
          ) : (
            <mesh geometry={cap} material={MAT.frame} rotation={[0.55, -0.35, 0]} scale={0.46} />
          )}
          <Label text={node.label} position={labelPos[i]} height={node.core ? 0.32 : 0.24} pill />
        </group>
      ))}
      {/* The point the constellation collapses into before the overview. */}
      <group ref={hub}>
        <mesh material={MAT.glow}>
          <icosahedronGeometry args={[0.35, 2]} />
        </mesh>
      </group>
    </Station>
  );
}

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { MathUtils, type Group } from "three";
import { Label, MAT, Station, smooth } from "./kit";
import { STATION, story } from "./story";

// Three focus areas as three rings around one core. Scroll brings them from
// scattered orbits into a single aligned system.
const RINGS = [
  { label: "MOBILE", radius: 2.5, from: [1.15, 0.35, 0.4], spin: 0.9 },
  { label: "WEB", radius: 1.95, from: [-0.75, 0.95, -0.25], spin: -1.2 },
  { label: "AI & DATA", radius: 1.4, from: [0.45, -1.2, 0.85], spin: 1.5 },
] as const;
const ALIGNED = [0.42, 0, 0];

export function AboutCore() {
  const rings = useRef<(Group | null)[]>([]);
  const core = useRef<Group>(null);
  const all = useRef<Group>(null);

  useFrame(() => {
    // Hand-off: the aligned rings open outward and drift toward the network
    // ahead, becoming the first connections of the Experience chapter.
    const o = smooth(story.ringsOut);
    // Grows in as the hero keys are pressed, so its edge never peeks out
    // under the navigation in the opening hero frame.
    const enter = smooth(story.keyPress / 0.3);
    if (all.current) {
      all.current.scale.setScalar((1 + o * 2.4) * (0.001 + enter * 0.999));
      all.current.position.set(o * 4.5, -o * 0.8, -o * 5);
      all.current.visible = o < 0.97 && enter > 0.001;
    }
    const t = smooth(story.rings);
    rings.current.forEach((g, i) => {
      if (!g) return;
      const r = RINGS[i];
      g.rotation.set(
        MathUtils.lerp(r.from[0], ALIGNED[0], t),
        MathUtils.lerp(r.from[1], ALIGNED[1], t),
        MathUtils.lerp(r.from[2], ALIGNED[2], t) + story.rings * r.spin,
      );
    });
    if (core.current) core.current.scale.setScalar(0.85 + t * 0.3);
  });

  return (
    <Station at={STATION.about}>
      <group ref={all}>
        <group ref={core}>
          <mesh material={MAT.glow}>
            <icosahedronGeometry args={[0.42, 4]} />
          </mesh>
          <mesh material={MAT.glass} scale={1.6}>
            <icosahedronGeometry args={[0.42, 2]} />
          </mesh>
        </group>
        {RINGS.map((r, i) => (
          <group
            key={r.label}
            ref={(el) => {
              rings.current[i] = el;
            }}
          >
            <mesh material={MAT.metal}>
              <torusGeometry args={[r.radius, 0.04, 12, 140]} />
            </mesh>
            <mesh material={MAT.ice} position={[r.radius, 0, 0]}>
              <sphereGeometry args={[0.09, 16, 12]} />
            </mesh>
            <Label text={r.label} position={[r.radius + 0.15, 0.32, 0]} height={0.24} />
          </group>
        ))}
      </group>
    </Station>
  );
}

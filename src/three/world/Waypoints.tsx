import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { AdditiveBlending, Vector3, type Group, type SpriteMaterial } from "three";
import { ACCENT_LIGHT, poolTexture, smooth } from "./kit";
import { PROJECT_COUNT, STATION, story } from "./story";

/**
 * The closing scene: every place the journey passed through — the keyboard,
 * About, Experience, the six projects and the Stack — lit as a soft point of
 * light along the horizon, in the closing environment's warm accent. Drawn
 * only while the horizon is in view (story.horizon).
 */
export function Waypoints() {
  const points = useMemo(
    () => [
      new Vector3(0, 0.6, 0),
      STATION.about,
      STATION.systems,
      ...Array.from({ length: PROJECT_COUNT }, (_, i) => new Vector3(STATION.projectX(i), 0.6, STATION.projectZ(i))),
      STATION.stack,
    ],
    [],
  );
  const group = useRef<Group>(null);
  const mats = useRef<(SpriteMaterial | null)[]>([]);
  useFrame(() => {
    const h = smooth(story.horizon);
    if (!group.current) return;
    group.current.visible = h > 0.01;
    mats.current.forEach((m, i) => {
      if (!m) return;
      m.color.copy(ACCENT_LIGHT);
      // They light in order along the route, like a path being retraced.
      m.opacity = smooth(h * 1.6 - i * 0.06) * 0.85;
    });
  });
  return (
    <group ref={group} visible={false}>
      {points.map((p, i) => (
        <sprite key={i} position={p} scale={[3.2, 3.2, 1]}>
          <spriteMaterial
            ref={(m) => {
              mats.current[i] = m;
            }}
            map={poolTexture()}
            transparent
            opacity={0}
            blending={AdditiveBlending}
            depthWrite={false}
            toneMapped={false}
            fog={false}
          />
        </sprite>
      ))}
    </group>
  );
}

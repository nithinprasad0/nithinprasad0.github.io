import { useEffect, useMemo, useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import {
  AdditiveBlending,
  BufferGeometry,
  Line,
  LineBasicMaterial,
  TubeGeometry,
  Vector3,
  type Mesh,
  type MeshStandardMaterial,
  type Sprite,
  type SpriteMaterial,
} from "three";
import { createGlowTexture } from "../keycap";
import { ACCENT, ACCENT_LIGHT, BLUE, smooth } from "./kit";
import { PROJECT_COUNT, SIGNAL_PATH, story } from "./story";

const SEGMENTS = 900;
const RADIAL = 6;

/**
 * The journey's thread: a glowing line drawn from the keyboard as far as the
 * visitor has scrolled (story.signal), with a bright head, over a faint ghost
 * of the full route so the path ahead is always hinted.
 */
export function Signal({ lite }: { lite: boolean }) {
  const tube = useMemo(() => new TubeGeometry(SIGNAL_PATH, SEGMENTS, 0.024, RADIAL, false), []);
  const ghost = useMemo(
    () =>
      new Line(
        new BufferGeometry().setFromPoints(SIGNAL_PATH.getSpacedPoints(lite ? 300 : 600)),
        new LineBasicMaterial({ color: BLUE, transparent: true, opacity: 0.12, depthWrite: false }),
      ),
    [lite],
  );
  const glow = useMemo(createGlowTexture, []);
  const line = useRef<Mesh>(null);
  const mat = useRef<MeshStandardMaterial>(null);
  const head = useRef<Sprite>(null);
  const p = useMemo(() => new Vector3(), []);

  useEffect(
    () => () => {
      tube.dispose();
      ghost.geometry.dispose();
      glow.dispose();
    },
    [tube, ghost, glow],
  );

  const narrow = useThree((st) => st.size.width <= 850);

  useFrame(() => {
    const s = Math.min(1, Math.max(0, story.signal));
    tube.setDrawRange(0, Math.floor(s * SEGMENTS) * RADIAL * 6);
    if (head.current) {
      SIGNAL_PATH.getPointAt(Math.max(s, 0.0001), p);
      head.current.position.copy(p);
      head.current.visible = s > 0.002 && s < 0.999;
    }
    // Quieter while text is read. On phones the camera flies low over the
    // corridor, so there the line fades to a faint guide instead of crossing
    // the frame as foreground beams (it stays drawn, so continuity holds).
    const corridor = narrow ? smooth(Math.min(story.project + 0.6, PROJECT_COUNT - 0.4 - story.project) * 1.5) : 0;
    // The signal carries each chapter's accent, and is quieter than before: a
    // thread through the journey rather than a beam competing with the subject.
    if (mat.current) {
      mat.current.emissive.copy(ACCENT);
      mat.current.emissiveIntensity = 1.35 * (1 - story.calm * 0.65);
      mat.current.opacity = 1 - corridor * 0.78;
    }
    (ghost.material as LineBasicMaterial).opacity = 0.08 * (1 - story.calm * 0.6) * (1 - corridor);
    (ghost.material as LineBasicMaterial).color.copy(ACCENT);
    if (head.current) (head.current.material as SpriteMaterial).color.copy(ACCENT_LIGHT);
  });

  return (
    <group>
      <primitive object={ghost} />
      <mesh ref={line} geometry={tube} frustumCulled={false}>
        <meshStandardMaterial ref={mat} color="#000" emissive={BLUE} emissiveIntensity={1.8} transparent toneMapped={false} />
      </mesh>
      <sprite ref={head} scale={[0.6, 0.6, 1]}>
        <spriteMaterial map={glow} color="#9fd0ff" opacity={0.75} blending={AdditiveBlending} transparent depthWrite={false} toneMapped={false} />
      </sprite>
    </group>
  );
}

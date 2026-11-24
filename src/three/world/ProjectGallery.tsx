import { useMemo, useRef, type ReactNode } from "react";
import { useFrame } from "@react-three/fiber";
import { CatmullRomCurve3, Vector3, type Group, type Mesh } from "three";
import { Label, MAT, Pool, clamp01, smooth } from "./kit";
import { PROJECT_COUNT, STATION, story } from "./story";
import { InsightGenStill } from "./InsightGenStill";
import { RevoStill } from "./RevoStill";
import { ProfexiaStill } from "./ProfexiaStill";
import { VaccinationStill } from "./VaccinationStill";
import { FaceAttendStill } from "./FaceAttendStill";
import { GemStill } from "./GemStill";

/*
 * Project illustrations. Each is a specific visual metaphor for what the
 * software does (not a screenshot — every one carries an ILLUSTRATION label
 * and the HTML says so). All six are product still lifes (Phases 25–30:
 * InsightGenStill.tsx, RevoStill.tsx, ProfexiaStill.tsx, VaccinationStill.tsx,
 * FaceAttendStill.tsx, GemStill.tsx). Every composition follows the same five
 * scroll phases, with its own choreography:
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

/**
 * `still` marks a product still life (Phase 25): it brings its own desk and
 * contact shadows, so the additive light pool is left out.
 */
function Stage({ index, name, still = false, children }: { index: number; name: string; still?: boolean; children: ReactNode }) {
  const at = useMemo(() => v(STATION.projectX(index), 0.6, STATION.projectZ(index)), [index]);
  const ref = useRef<Group>(null);
  const inner = useRef<Group>(null);
  // Phase 41: the name and ILLUSTRATION labels arrive with the camera, over
  // the last fifth of the approach. Before, they were drawn from lp = 0, while
  // the still life itself was still absent: the next project's name floated
  // alone in the distance, behind the card being read, and mid-travel the
  // incoming name crossed the viewport edge. They stay at full strength
  // through the showcase and leave (phase holds at 1).
  const labels = useRef(0);
  useFrame(({ camera, size }) => {
    labels.current = phase(index, 0.8, 1);
    if (!ref.current || !inner.current) return;
    // Only near its own turn, never in the distant overview, and never while
    // the camera passes through it.
    const near = Math.abs(story.project - index) < 1.6 && story.dim < 0.25;
    // Hand-off: recede as the next project takes over, then shrink away so a
    // wide (tablet) lens never shows last project's leftovers beside the next.
    const l = leave(index);
    // The camera's long travel to the next station starts while the leave has
    // barely begun, so the composition would slide out of its own column and
    // through the band where the next project's card arrives. It shrinks away
    // within the first part of the leave instead (by its raw progress, before
    // the travel has moved it): Phase 32D for the narrow layout, and (Phase
    // 41) on desktop too, where the old late curve (gone from l = 0.55) let
    // it cross the incoming card and the chapter footer, and cut its name
    // label at the viewport edge. The desktop window is shorter: there the
    // composition stands beside the column the next card rises through, so
    // it must clear before that card's top edge reaches its base.
    const gone = smooth(clamp01(lp(index) - 1) / (size.width <= 850 ? 0.28 : 0.16));
    ref.current.visible = near && gone < 0.999 && camera.position.distanceTo(at) > 3.4;
    inner.current.scale.setScalar(0.001 + (1 - l * 0.3) * (1 - gone));
    inner.current.position.set(0, -l * 0.4, -l * 1.6);
  });
  return (
    <group ref={ref} position={at}>
      <group rotation-y={-Math.sign(at.x) * 0.3}>
        <group ref={inner}>
          {/* A still life is fully built at rest, so it joins the approach the
              way every other composition's first element does: absent at
              lp = 0 (story.project rests at -1 through the hero, About and
              Experience, which counts as "near" for the first stage), grown
              in over the intro beat. */}
          {still ? (
            <Appear i={index} a={0} b={0.2}>
              {children}
            </Appear>
          ) : (
            children
          )}
          {/* Grounding: a pool of the project's own light beneath it. */}
          {!still && <Pool position={[0, -2.3, 0]} scale={[7.5, 4.5]} opacity={0.26} />}
          <Label text={name.toUpperCase()} position={[0, 2.15, 0]} height={0.26} weight={labels} />
          <Label text="ILLUSTRATION" position={[0, -1.85, 0]} height={0.12} color="#8f99ab" weight={labels} />
        </group>
      </group>
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
  { name: "InsightGen", Comp: InsightGenStill, still: true },
  { name: "Revo", Comp: RevoStill, still: true },
  { name: "Profexia", Comp: ProfexiaStill, still: true },
  { name: "Child Vaccination", Comp: VaccinationStill, still: true },
  { name: "FaceAttend", Comp: FaceAttendStill, still: true },
  { name: "GEM Business Apps", Comp: GemStill, still: true },
] as const;

export function ProjectGallery({ lite = false }: { lite?: boolean }) {
  return (
    <>
      {COMPOSITIONS.slice(0, PROJECT_COUNT).map((c, i) => (
        <Stage key={c.name} index={i} name={c.name} still={"still" in c && c.still}>
          <c.Comp lite={lite} />
        </Stage>
      ))}
      <ConvergeTokens />
    </>
  );
}

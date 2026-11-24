import { useLayoutEffect, useState } from "react";
import { useThree } from "@react-three/fiber";
import {
  BackSide,
  Color,
  DoubleSide,
  Mesh,
  MeshBasicMaterial,
  PlaneGeometry,
  PMREMGenerator,
  Scene,
  SphereGeometry,
  type Texture,
  type WebGLRenderer,
  type WebGLRenderTarget,
} from "three";

type Panel = {
  color: string;
  intensity: number;
  position: [number, number, number];
  /** Omitted: the panel faces the studio's centre. */
  rotation?: [number, number, number];
  scale: [number, number];
};

// Soft-box reflections for the world's materials, baked once into a PMREM
// environment map. Replaces drei's <Environment>, which bundles HDR/EXR
// loaders this scene never uses.
const PANELS: Panel[] = [
  { color: "#ffffff", intensity: 1.6, position: [0, 6, 2], rotation: [Math.PI / 2, 0, 0], scale: [12, 1.2] },
  { color: "#2f86ff", intensity: 3, position: [-6, 2, -2], rotation: [0, Math.PI / 2, 0], scale: [8, 0.4] },
  { color: "#59b5ff", intensity: 2, position: [6, 1.5, -1], rotation: [0, -Math.PI / 2, 0], scale: [8, 0.3] },
];

/**
 * The hero keyboard's own product studio (Phase 24), used only by its
 * materials: a large warm-neutral softbox high and to the front-left (the key),
 * a dim neutral card front-right (the fill), a thin steel strip behind (the
 * rim the housing's top edge catches), a low wide card in front (a soft
 * gradient down the housing's front face) and a faint warm desk bounce.
 * No blue, so the graphite plastics and anodised aluminium keep their colour.
 */
export const HERO_STUDIO: Studio = {
  shell: "#0b0a09",
  panels: [
    { color: "#fff0dc", intensity: 2.4, position: [-3.5, 6.5, 4.5], scale: [7, 4.5] },
    { color: "#e6e3de", intensity: 0.45, position: [6, 2.2, 6], scale: [6, 3.5] },
    { color: "#c3ccd6", intensity: 1.5, position: [0, 3.2, -7], scale: [14, 0.7] },
    { color: "#e9e6e1", intensity: 0.7, position: [0, -1.6, 8], scale: [18, 3] },
    { color: "#2b2621", intensity: 1, position: [0, -4, 1], rotation: [-Math.PI / 2, 0, 0], scale: [16, 12] },
  ],
};

function bakeStudio(gl: WebGLRenderer, shellColor: string, panels: Panel[], resolution: number) {
  const studio = new Scene();
  const shell = new Mesh(new SphereGeometry(20, 16, 8), new MeshBasicMaterial({ color: shellColor, side: BackSide }));
  studio.add(shell);

  const plane = new PlaneGeometry(1, 1);
  const meshes = panels.map((p) => {
    const mesh = new Mesh(
      plane,
      new MeshBasicMaterial({ color: new Color(p.color).multiplyScalar(p.intensity), side: DoubleSide, toneMapped: false }),
    );
    mesh.position.set(...p.position);
    if (p.rotation) mesh.rotation.set(...p.rotation);
    else mesh.lookAt(0, 0, 0);
    mesh.scale.set(p.scale[0], p.scale[1], 1);
    studio.add(mesh);
    return mesh;
  });

  const pmrem = new PMREMGenerator(gl);
  const target = pmrem.fromScene(studio, 0.04, 0.1, 100, { size: resolution });
  pmrem.dispose();
  shell.geometry.dispose();
  (shell.material as MeshBasicMaterial).dispose();
  plane.dispose();
  meshes.forEach((m) => (m.material as MeshBasicMaterial).dispose());
  return target;
}

/** The shared environment every material in the world reflects by default. */
export function StudioEnvironment({ resolution = 128 }: { resolution?: number }) {
  const gl = useThree((s) => s.gl);
  const scene = useThree((s) => s.scene);

  useLayoutEffect(() => {
    const target = bakeStudio(gl, "#020305", PANELS, resolution);
    scene.environment = target.texture;
    return () => {
      scene.environment = null;
      target.dispose();
    };
  }, [gl, scene, resolution]);

  return null;
}

export type Studio = { shell: string; panels: Panel[] };

// One bake per studio and resolution, shared by every scene that asks for it
// (the hero keyboard and the product still lifes use the same studio), and
// released when the last user unmounts.
const baked = new WeakMap<Studio, Map<number, { target: WebGLRenderTarget; users: number }>>();

function acquire(gl: WebGLRenderer, studio: Studio, resolution: number) {
  let byRes = baked.get(studio);
  if (!byRes) baked.set(studio, (byRes = new Map()));
  let entry = byRes.get(resolution);
  if (!entry) byRes.set(resolution, (entry = { target: bakeStudio(gl, studio.shell, studio.panels, resolution), users: 0 }));
  entry.users++;
  const held = entry;
  return {
    texture: held.target.texture,
    release: () => {
      if (--held.users > 0) return;
      held.target.dispose();
      byRes!.delete(resolution);
    },
  };
}

/**
 * A private environment map for one set of materials (assigned as their
 * `envMap`, which takes precedence over `scene.environment`), so a scene can
 * be lit as a product shot without changing any other chapter.
 */
export function useStudioMap(studio: Studio, resolution: number): Texture | null {
  const gl = useThree((s) => s.gl);
  const [map, setMap] = useState<Texture | null>(null);
  useLayoutEffect(() => {
    const held = acquire(gl, studio, resolution);
    setMap(held.texture);
    return () => {
      setMap(null);
      held.release();
    };
  }, [gl, studio, resolution]);
  return map;
}

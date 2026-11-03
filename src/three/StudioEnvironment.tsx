import { useLayoutEffect } from "react";
import { useThree } from "@react-three/fiber";
import { BackSide, Color, Mesh, MeshBasicMaterial, PlaneGeometry, PMREMGenerator, Scene, SphereGeometry } from "three";

type Panel = {
  color: string;
  intensity: number;
  position: [number, number, number];
  rotation: [number, number, number];
  scale: [number, number];
};

// Soft-box reflections for the keycaps' clearcoat, baked once into a PMREM
// environment map. Replaces drei's <Environment>, which bundles HDR/EXR
// loaders this scene never uses.
const PANELS: Panel[] = [
  { color: "#ffffff", intensity: 1.6, position: [0, 6, 2], rotation: [Math.PI / 2, 0, 0], scale: [12, 1.2] },
  { color: "#2f86ff", intensity: 3, position: [-6, 2, -2], rotation: [0, Math.PI / 2, 0], scale: [8, 0.4] },
  { color: "#59b5ff", intensity: 2, position: [6, 1.5, -1], rotation: [0, -Math.PI / 2, 0], scale: [8, 0.3] },
];

export function StudioEnvironment({ resolution = 128 }: { resolution?: number }) {
  const gl = useThree((s) => s.gl);
  const scene = useThree((s) => s.scene);

  useLayoutEffect(() => {
    const studio = new Scene();
    const shell = new Mesh(new SphereGeometry(20, 16, 8), new MeshBasicMaterial({ color: "#020305", side: BackSide }));
    studio.add(shell);

    const plane = new PlaneGeometry(1, 1);
    const panels = PANELS.map((p) => {
      const mesh = new Mesh(
        plane,
        new MeshBasicMaterial({ color: new Color(p.color).multiplyScalar(p.intensity), side: 2, toneMapped: false }),
      );
      mesh.position.set(...p.position);
      mesh.rotation.set(...p.rotation);
      mesh.scale.set(p.scale[0], p.scale[1], 1);
      studio.add(mesh);
      return mesh;
    });

    const pmrem = new PMREMGenerator(gl);
    const target = pmrem.fromScene(studio, 0.04, 0.1, 100, { size: resolution });
    scene.environment = target.texture;

    return () => {
      scene.environment = null;
      target.dispose();
      pmrem.dispose();
      shell.geometry.dispose();
      (shell.material as MeshBasicMaterial).dispose();
      plane.dispose();
      panels.forEach((m) => (m.material as MeshBasicMaterial).dispose());
    };
  }, [gl, scene, resolution]);

  return null;
}

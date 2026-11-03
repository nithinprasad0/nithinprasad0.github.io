import { CanvasTexture, SRGBColorSpace, type BufferGeometry } from "three";
import { RoundedBoxGeometry } from "three/examples/jsm/geometries/RoundedBoxGeometry.js";
import { mergeVertices } from "three/examples/jsm/utils/BufferGeometryUtils.js";

export const KEY = {
  width: 1,
  depth: 1,
  height: 0.62,
  radius: 0.1,
  taper: 0.26, // top face is 26% narrower than the base, like a sculpted keycap
  dish: 0.04, // depth of the concave finger dish on top
  gap: 0.14, // spacing between neighbouring keys
};

// A keycap: rounded box, tapered towards the top, with a spherical dish.
export function createKeycapGeometry(): BufferGeometry {
  const { width, depth, height, radius, taper, dish } = KEY;
  const box = new RoundedBoxGeometry(width, height, depth, 6, radius);
  const pos = box.attributes.position;
  const half = height / 2;
  const flatHalf = width / 2 - radius;

  for (let i = 0; i < pos.count; i++) {
    let x = pos.getX(i);
    let y = pos.getY(i);
    let z = pos.getZ(i);

    const t = (y + half) / height;
    const scale = 1 - taper * t;
    x *= scale;
    z *= scale;

    if (y > half - 1e-4) {
      const topHalf = flatHalf * (1 - taper);
      const r2 = (x / topHalf) ** 2 + (z / topHalf) ** 2;
      y -= dish * Math.max(0, 1 - r2);
    }
    pos.setXYZ(i, x, y, z);
  }

  // Weld the separate box faces so normals are smooth across the rounded edges.
  box.deleteAttribute("normal");
  box.deleteAttribute("uv");
  const geometry = mergeVertices(box, 1e-4);
  geometry.computeVertexNormals();
  return geometry;
}

// Soft elliptical falloff for the underglow pool beneath the plate.
export function createGlowTexture(): CanvasTexture {
  const size = 256;
  const canvas = document.createElement("canvas");
  canvas.width = canvas.height = size;
  const ctx = canvas.getContext("2d")!;
  const g = ctx.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2);
  g.addColorStop(0, "rgba(255,255,255,1)");
  g.addColorStop(0.45, "rgba(255,255,255,.35)");
  g.addColorStop(1, "rgba(255,255,255,0)");
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, size, size);
  return new CanvasTexture(canvas);
}

// White legend on transparent canvas, used as the map/emissive map of a decal.
export function createLegendTexture(letter: string, font: string): CanvasTexture {
  const size = 256;
  const canvas = document.createElement("canvas");
  canvas.width = canvas.height = size;
  const ctx = canvas.getContext("2d")!;
  ctx.fillStyle = "#fff";
  ctx.font = `800 150px ${font}`;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText(letter, size / 2, size / 2 + 8);
  const texture = new CanvasTexture(canvas);
  texture.colorSpace = SRGBColorSpace;
  texture.anisotropy = 8;
  return texture;
}

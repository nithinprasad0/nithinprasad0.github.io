import { useEffect, useMemo } from "react";
import { RoundedBox } from "@react-three/drei";
import { CanvasTexture, MeshBasicMaterial, SRGBColorSpace } from "three";
import { MAT, SCREENS } from "./kit";

// Physical devices for the illustrations: brushed bodies, smoked glass and
// screens that show a conceptual interface. Each UI is drawn once into a
// canvas texture (no per-frame work) and is dark-themed, so a screen never
// becomes a bright patch behind the reading text. These are illustrations of
// what each system does, not product screenshots.

type Draw = (g: CanvasRenderingContext2D, w: number, h: number) => void;

const C = {
  bg: "#0b111c",
  panel: "#131c2b",
  line: "#22324a",
  ice: "#8fc8ff",
  blue: "#397bff",
  text: "#c9d3e2",
  dim: "#6f7d92",
  amber: "#ffb257",
  mint: "#5fe0b0",
  violet: "#a394ff",
};

function font(g: CanvasRenderingContext2D, px: number, weight = 600) {
  g.font = `${weight} ${px}px Inter, Arial, sans-serif`;
}

function rr(g: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number, fill: string) {
  g.fillStyle = fill;
  g.beginPath();
  g.roundRect(x, y, w, h, r);
  g.fill();
}

function text(g: CanvasRenderingContext2D, s: string, x: number, y: number, px: number, color = C.text, weight = 600) {
  font(g, px, weight);
  g.fillStyle = color;
  g.textBaseline = "middle";
  g.fillText(s, x, y);
}

/** A screen plane showing a drawn interface; dims with the scene's calm. */
export function Screen({ w, h, draw, res = 256 }: { w: number; h: number; draw: Draw; res?: number }) {
  const material = useMemo(() => {
    const cw = Math.round(res * (w >= h ? w / h : 1));
    const ch = Math.round(res * (h > w ? h / w : 1));
    const canvas = document.createElement("canvas");
    canvas.width = cw * 2;
    canvas.height = ch * 2;
    const g = canvas.getContext("2d")!;
    g.scale(2, 2);
    g.fillStyle = C.bg;
    g.fillRect(0, 0, cw, ch);
    draw(g, cw, ch);
    const tex = new CanvasTexture(canvas);
    tex.colorSpace = SRGBColorSpace;
    // Screens are often seen at an angle: keep their interface detail sharp.
    tex.anisotropy = 8;
    return new MeshBasicMaterial({ map: tex, toneMapped: false });
  }, [w, h, draw, res]);
  useEffect(() => {
    SCREENS.add(material);
    return () => {
      SCREENS.delete(material);
      material.map?.dispose();
      material.dispose();
    };
  }, [material]);
  return (
    <mesh material={material}>
      <planeGeometry args={[w, h]} />
    </mesh>
  );
}

/** Smartphone: brushed frame, black glass face, interface. */
export function PhoneDevice({ draw, scale = 1 }: { draw: Draw; scale?: number }) {
  return (
    <group scale={scale}>
      <RoundedBox args={[0.9, 1.78, 0.08]} radius={0.1} smoothness={3} material={MAT.frame} />
      <mesh material={MAT.metal} position={[0, 0, 0.041]}>
        <planeGeometry args={[0.84, 1.72]} />
      </mesh>
      <group position={[0, -0.02, 0.043]}>
        <Screen w={0.76} h={1.56} draw={draw} />
      </group>
    </group>
  );
}

/** Desktop monitor on a stand (optionally on a desk with a keyboard: a workstation). */
export function MonitorDevice({ draw, w = 1.5, h = 0.92, desk = false }: { draw: Draw; w?: number; h?: number; desk?: boolean }) {
  return (
    <group>
      <RoundedBox args={[w + 0.08, h + 0.08, 0.06]} radius={0.03} smoothness={2} material={MAT.metal} />
      <group position={[0, 0, 0.032]}>
        <Screen w={w} h={h} draw={draw} />
      </group>
      <mesh material={MAT.frame} position={[0, -h / 2 - 0.2, -0.05]}>
        <boxGeometry args={[0.09, 0.36, 0.05]} />
      </mesh>
      <mesh material={MAT.frame} position={[0, -h / 2 - 0.38, 0.02]}>
        <boxGeometry args={[0.5, 0.025, 0.3]} />
      </mesh>
      {desk && (
        <>
          <mesh material={MAT.metal} position={[0, -h / 2 - 0.405, 0.15]}>
            <boxGeometry args={[w + 0.9, 0.03, 0.8]} />
          </mesh>
          <mesh material={MAT.frame} position={[-0.05, -h / 2 - 0.378, 0.42]}>
            <boxGeometry args={[0.92, 0.025, 0.24]} />
          </mesh>
        </>
      )}
    </group>
  );
}

/** Browser window floating as a smoked-acrylic pane. */
export function BrowserDevice({ draw, w = 1.6, h = 1.05 }: { draw: Draw; w?: number; h?: number }) {
  return (
    <group>
      <RoundedBox args={[w + 0.06, h + 0.06, 0.04]} radius={0.04} smoothness={2} material={MAT.acrylic} />
      <group position={[0, 0, 0.022]}>
        <Screen w={w} h={h} draw={draw} />
      </group>
    </group>
  );
}

/** Small server rack: brushed units with status LEDs (one warm accent). */
export function ServerRack({ units = 3 }: { units?: number }) {
  return (
    <group>
      {Array.from({ length: units }, (_, k) => (
        <group key={k} position={[0, (k - (units - 1) / 2) * 0.34, 0]}>
          <RoundedBox args={[1.5, 0.28, 0.9]} radius={0.03} smoothness={2} material={MAT.frame} />
          <mesh material={MAT.metal} position={[0, 0, 0.452]}>
            <planeGeometry args={[1.38, 0.2]} />
          </mesh>
          {[0, 1, 2, 3, 4].map((n) => (
            <mesh key={n} material={n === 0 ? MAT.amber : MAT.glowSoft} position={[-0.58 + n * 0.09, 0, 0.456]}>
              <circleGeometry args={[0.022, 10]} />
            </mesh>
          ))}
          <mesh material={MAT.glowSoft} position={[0.32, 0, 0.456]}>
            <planeGeometry args={[0.6, 0.02]} />
          </mesh>
        </group>
      ))}
    </group>
  );
}

/** A printed bill on a small stack of paper. */
export function BillStack({ draw }: { draw: Draw }) {
  return (
    <group rotation-x={-0.35}>
      {[0, 1, 2].map((k) => (
        <mesh key={k} material={MAT.paper} position={[k * 0.03, -k * 0.012, -k * 0.03]} rotation-z={k * 0.04}>
          <boxGeometry args={[0.95, 1.25, 0.008]} />
        </mesh>
      ))}
      <group position={[0, 0, 0.006]}>
        <Screen w={0.9} h={1.2} draw={draw} />
      </group>
    </group>
  );
}

/* ------------------------------------------------------- Interface drawings */
// Generic, conceptual content only: no real customer data, no invented features.

const bar = (g: CanvasRenderingContext2D, x: number, y: number, w: number, color = C.line, h = 7) => rr(g, x, y, w, h, h / 2, color);

export const ui = {
  /** Employee app: today's tasks — orders, collections and route stops. */
  employee: ((g, w, h) => {
    rr(g, 0, 0, w, 54, 0, C.panel);
    text(g, "Today", 16, 27, 18, C.text, 700);
    text(g, "Route", w - 62, 27, 13, C.ice);
    const rows = [
      ["Order", C.ice],
      ["Collection", C.amber],
      ["Order", C.ice],
      ["Route stop", C.mint],
      ["Collection", C.amber],
    ] as const;
    rows.forEach(([label, color], k) => {
      const y = 70 + k * 62;
      rr(g, 12, y, w - 24, 52, 10, C.panel);
      rr(g, 22, y + 14, 24, 24, 12, color);
      text(g, label, 56, y + 18, 13, C.text);
      bar(g, 56, y + 32, w * 0.42, C.line);
    });
    rr(g, w / 2 - 60, h - 52, 120, 34, 17, C.blue);
    text(g, "+ New order", w / 2 - 44, h - 35, 13, "#fff", 700);
  }) as Draw,

  /** Admin app: monitoring at a glance and data export. */
  admin: ((g, w, h) => {
    rr(g, 0, 0, w, 54, 0, C.panel);
    text(g, "Admin", 16, 27, 18, C.text, 700);
    [0, 1].forEach((k) => {
      rr(g, 12 + k * ((w - 30) / 2 + 6), 66, (w - 30) / 2, 70, 10, C.panel);
      text(g, k ? "Collections" : "Orders", 22 + k * ((w - 30) / 2 + 6), 84, 11, C.dim);
      bar(g, 22 + k * ((w - 30) / 2 + 6), 108, 40 + k * 14, k ? C.amber : C.ice, 10);
    });
    rr(g, 12, 148, w - 24, 150, 10, C.panel);
    text(g, "Activity", 22, 166, 11, C.dim);
    [0.35, 0.6, 0.45, 0.8, 0.55, 0.9].forEach((v, k) => rr(g, 26 + k * ((w - 60) / 6), 288 - v * 100, (w - 60) / 6 - 8, v * 100, 4, k === 5 ? C.blue : C.line));
    rr(g, 12, 312, w - 24, 44, 10, C.panel);
    text(g, "Routes", 22, 334, 13, C.text);
    rr(g, 12, h - 56, w - 24, 38, 19, "#1d2a3f");
    text(g, "Export data", w / 2 - 38, h - 37, 13, C.ice);
  }) as Draw,

  /** Windows .NET connector: orders read from Firebase, prepared for bill entry. */
  connector: ((g, w, h) => {
    rr(g, 0, 0, w, 30, 0, "#1a2433");
    text(g, ".NET connector", 12, 15, 12, C.text, 600);
    ["#3a475c", "#3a475c", "#3a475c"].forEach((c, k) => rr(g, w - 18 - k * 18, 10, 10, 10, 2, c));
    text(g, "Firebase orders", 14, 50, 12, C.dim);
    text(g, "Bill entry", w * 0.6, 50, 12, C.dim);
    for (let k = 0; k < 5; k++) {
      const y = 66 + k * 30;
      bar(g, 14, y, w * 0.34, C.line, 9);
      text(g, "→", w * 0.5, y + 4, 14, C.ice);
      rr(g, w * 0.6, y - 3, w * 0.3, 16, 8, k < 3 ? "#173a2f" : "#1d2a3f");
      text(g, k < 3 ? "Ready" : "Queued", w * 0.6 + 10, y + 5, 10, k < 3 ? C.mint : C.dim);
    }
    rr(g, 0, h - 26, w, 26, 0, "#101826");
    rr(g, 10, h - 17, w * 0.55, 8, 4, C.blue);
  }) as Draw,

  /** A bill being entered: header, line items, total. */
  bill: ((g, w, h) => {
    g.fillStyle = "#aaa498";
    g.fillRect(0, 0, w, h);
    text(g, "Bill", 18, 28, 20, "#2a2f38", 800);
    bar(g, w - 110, 22, 90, "#a39d91", 8);
    g.fillStyle = "#a39d91";
    g.fillRect(18, 52, w - 36, 2);
    for (let k = 0; k < 7; k++) {
      const y = 70 + k * 26;
      bar(g, 18, y, w * (0.32 + ((k * 37) % 20) / 100), "#b3ada1", 8);
      bar(g, w - 80, y, 60, "#b3ada1", 8);
    }
    g.fillStyle = "#8f897d";
    g.fillRect(18, h - 56, w - 36, 2);
    text(g, "Total", 18, h - 32, 15, "#2a2f38", 700);
    bar(g, w - 100, h - 37, 80, "#5d6f8f", 10);
  }) as Draw,

  /** Business website: a product-led page (generic layout, no copied content). */
  website: ((g, w, h) => {
    rr(g, 0, 0, w, 26, 0, "#1a2433");
    ["#ff6b6b", "#ffb257", "#5fe0b0"].forEach((c, k) => rr(g, 10 + k * 14, 9, 8, 8, 4, c));
    rr(g, 60, 6, w - 80, 14, 7, "#0f1622");
    rr(g, 14, 38, w - 28, h * 0.32, 8, "#14233a");
    bar(g, 28, 58, w * 0.4, C.ice, 12);
    bar(g, 28, 80, w * 0.28, C.line, 8);
    rr(g, 28, 96, 70, 20, 10, C.blue);
    for (let k = 0; k < 4; k++) {
      const x = 14 + k * ((w - 28) / 4);
      rr(g, x, h * 0.32 + 52, (w - 28) / 4 - 10, h * 0.34, 8, C.panel);
      bar(g, x + 8, h * 0.32 + 52 + h * 0.34 - 18, (w - 28) / 4 - 30, C.line, 6);
    }
  }) as Draw,

};

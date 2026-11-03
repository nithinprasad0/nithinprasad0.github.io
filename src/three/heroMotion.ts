export type SceneTier = "full" | "lite" | "static";

// Decides once, on the client, how much 3D the device should get. The same
// rules run pre-paint in index.html (html.world) so layout never shifts.
export function detectSceneTier(): SceneTier {
  if (typeof window === "undefined") return "static";
  if (!document.documentElement.classList.contains("world")) return "static";
  return window.matchMedia("(max-width: 850px), (pointer: coarse)").matches ? "lite" : "full";
}

/** Marks the page once the 3D world has drawn its first frame (CSS fades the fallback). */
export function markWorldReady() {
  document.documentElement.classList.add("world-ready");
}

/** Drops back to the static page if WebGL fails after the world was chosen. */
export function abandonWorld() {
  document.documentElement.classList.remove("world", "world-ready");
}

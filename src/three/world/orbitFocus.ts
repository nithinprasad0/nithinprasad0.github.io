// Shared state between the About orbit in the 3D world and its HTML node
// controls (OrbitNodes in the page). Plain mutable values, like keyInput:
// nothing here re-renders React while scrolling.
//
// - The page sets `active` (hover, keyboard focus or tap).
// - The 3D scene reads it every frame to light that node's orbit, and writes
//   each node's screen position straight onto the registered anchors.

export const orbitFocus = {
  /** Node in focus (index into about.areas), or -1. */
  active: -1,
  /** The fixed overlay layer; `data-shown` while the About orbit is on screen. */
  layer: null as HTMLElement | null,
  /** One positioned anchor per node. */
  anchors: [] as (HTMLElement | null)[],
};

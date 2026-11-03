// Input state for the interactive hero keyboard. Plain mutable state (no React
// state), read every frame by Keyboard: presses never cause a re-render.
//
// Key mapping: the board only has the six keys N I T H I N, matched by the
// letter typed (so any keyboard layout works):
//   N → keys 1 and 6 (alternating)   I → keys 2 and 5 (alternating)
//   T → key 3                         H → key 4

export const LETTERS = "NITHIN";
/** The one key that glows a little differently and opens the hidden workspace. */
export const CURIOUS = 2;
const CODES: Record<string, string> = { KeyN: "N", KeyI: "I", KeyT: "T", KeyH: "H" };

export interface KeySpring {
  /** Number of active holds (pointer, physical key or HTML key control) on this key. */
  holds: number;
  /** Travel, 0 (up) → 1 (bottomed out); can overshoot slightly on release. */
  x: number;
  v: number;
  /** Brief light response after each press. */
  flash: number;
}

export const keys: KeySpring[] = Array.from({ length: LETTERS.length }, () => ({ holds: 0, x: 0, v: 0, flash: 0 }));

export function press(index: number) {
  const k = keys[index];
  k.holds += 1;
  k.flash = 1;
}

export function release(index: number) {
  const k = keys[index];
  k.holds = Math.max(0, k.holds - 1);
}

/** A complete press and release that still shows the full travel. */
export function tap(index: number) {
  press(index);
  window.setTimeout(() => release(index), 110);
}

// Repeated letters alternate between their two keys, like a real typist's fingers.
const nextOf: Record<string, number> = {};
function keyFor(letter: string): number {
  const all = [...LETTERS].flatMap((l, i) => (l === letter ? [i] : []));
  const n = nextOf[letter] ?? 0;
  nextOf[letter] = (n + 1) % all.length;
  return all[n];
}

/**
 * The letter a key types on the user's own layout (Dvorak, AZERTY and so on),
 * upper-cased; the key's QWERTY position only when the browser reports no
 * printable key.
 */
export function letterOf(e: KeyboardEvent): string {
  if (e.key && e.key.length === 1) return e.key.toUpperCase();
  return CODES[e.code] ?? "";
}

const physicalHeld = new Map<string, number>();

/** Physical key down. Never prevents the event; returns the key index pressed, or -1. */
export function physicalDown(e: KeyboardEvent): number {
  const letter = letterOf(e);
  // Held keys are tracked by position, so the release matches even if a
  // modifier changed the typed character in between.
  const id = e.code || letter;
  if (!letter || !LETTERS.includes(letter) || physicalHeld.has(id)) return -1;
  const index = keyFor(letter);
  physicalHeld.set(id, index);
  press(index);
  return index;
}

export function physicalUp(e: KeyboardEvent) {
  const id = e.code || letterOf(e);
  const index = physicalHeld.get(id);
  if (index === undefined) return;
  physicalHeld.delete(id);
  release(index);
}

/** Window lost focus mid-press: release everything so no key sticks down. */
export function releaseAll() {
  physicalHeld.clear();
  keys.forEach((k) => (k.holds = 0));
}

/**
 * Damped spring step for every key: stiff and slightly under-damped, like a
 * switch returning — one small settle, no bounce.
 */
export function stepSprings(dt: number) {
  const k = 900;
  const c = 2 * Math.sqrt(k) * 0.62;
  const steps = 2;
  const h = Math.min(dt, 1 / 30) / steps;
  for (const s of keys) {
    const target = s.holds > 0 ? 1 : 0;
    for (let n = 0; n < steps; n++) {
      s.v += (k * (target - s.x) - c * s.v) * h;
      s.x += s.v * h;
    }
    // The switch bottoms out: no travel past the plate.
    if (s.x > 1) {
      s.x = 1;
      s.v = Math.min(0, s.v);
    }
    s.flash = Math.max(0, s.flash - dt * 2.2);
  }
}

/* ------------------------------------------------------------ Curious Key */

/** True for the key that opens the workbench: whichever key types T (any case). */
export function isCuriousKey(e: KeyboardEvent) {
  return letterOf(e) === LETTERS[CURIOUS];
}

/** Event the workbench listens for. */
export const CURIOUS_OPEN = "curious:open";

/**
 * The single activation path for the Curious Key. A click or tap on the 3D T
 * key, the accessible T button in the hero and the physical T key all call
 * this, so they cannot behave differently. Opening an already-open workbench
 * is a no-op (handled by the workbench).
 */
export function activateCuriousKey() {
  window.dispatchEvent(new Event(CURIOUS_OPEN));
}

/** Editable elements keep every key to themselves. */
function isEditable(el: Element | null): boolean {
  if (!el || el === document.body || el === document.documentElement) return false;
  if ((el as HTMLElement).isContentEditable) return true;
  return Boolean(
    el.closest(
      "input, textarea, select, [contenteditable]:not([contenteditable='false']), [role='textbox'], [role='searchbox'], [role='combobox'], [role='listbox'], [role='spinbutton'], [role='slider'], [role='menu']",
    ),
  );
}

/**
 * The shared guard for global keyboard handling (animation and activation):
 * true when a key event must be left entirely alone. Nothing that uses it ever
 * calls preventDefault, so typing and browser shortcuts are never affected.
 *  - typing in an input, textarea, select or any editable element
 *  - IME composition
 *  - auto-repeat (holding a key acts once)
 *  - Ctrl, Alt or Meta combinations (browser and OS shortcuts); Shift is
 *    allowed, so Shift+T / Caps Lock T count as T
 *  - focus inside the open workbench (its own controls handle keys there)
 */
export function shouldIgnoreKey(e: KeyboardEvent): boolean {
  if (e.isComposing || e.key === "Process" || e.keyCode === 229) return true;
  if (e.repeat || e.ctrlKey || e.altKey || e.metaKey) return true;
  // The event's own target is fixed when the key is pressed, so a listener
  // that runs after the workbench has opened (and taken focus) still sees
  // where the key was really pressed.
  const target = (e.target instanceof Element ? e.target : document.activeElement) as Element | null;
  if (isEditable(target)) return true;
  return Boolean(target?.closest("[role='dialog']"));
}

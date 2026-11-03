import { useEffect, useState } from "react";
import { assets } from "../content/portfolio";

// Keep in sync with the .intro animation duration in index.css.
const INTRO_MS = 2200;
// Keep in sync with .intro-leave in index.css.
const LEAVE_MS = 380;

// Short, automatic signature intro. It never blocks the page:
// - it plays and fades out by itself in CSS (see .intro in index.css), even before hydration;
// - Skip, a click or tap anywhere, any key, wheel or touch dismisses it with a short fade
//   (a click on the overlay never reaches a hero link the visitor cannot see yet);
// - it is hidden without JS, for reduced motion, and after the first view in a session
//   (index.html sets those classes before the first paint), and all content is in the
//   page underneath it regardless.
export function OpeningScreen() {
  const [leaving, setLeaving] = useState(false);
  const [done, setDone] = useState(false);
  const [start] = useState(() => performance.now());
  // Once the intro's own fade has begun (70% in), finish it rather than restart a fade.
  const skip = () => (performance.now() - start > INTRO_MS * 0.7 ? setDone(true) : setLeaving(true));

  useEffect(() => {
    if (done) return;
    // Already hidden by CSS (reduced motion or seen this session): drop it from the DOM.
    if (getComputedStyle(document.getElementById("opening")!).display === "none") {
      setDone(true);
      return;
    }
    const dismiss = skip;
    const events = ["keydown", "wheel", "touchstart"] as const;
    events.forEach((e) => window.addEventListener(e, dismiss, { once: true, passive: true }));
    // Backstop in case the browser pauses CSS animations (background tabs, throttled frames).
    const timer = window.setTimeout(() => setDone(true), INTRO_MS + 200);
    return () => {
      window.clearTimeout(timer);
      events.forEach((e) => window.removeEventListener(e, dismiss));
    };
  }, [done]);

  // A skipped intro fades out quickly instead of cutting away.
  useEffect(() => {
    if (!leaving) return;
    const timer = window.setTimeout(() => setDone(true), LEAVE_MS + 120);
    return () => window.clearTimeout(timer);
  }, [leaving]);

  // Lets the 3D hero start its key-drop once the overlay is gone.
  useEffect(() => {
    if (done) window.dispatchEvent(new Event("intro:done"));
  }, [done]);

  if (done) return null;

  return (
    <div
      id="opening"
      className={`intro fixed inset-0 z-[9999] flex items-center justify-center bg-obsidian ${leaving ? "intro-leave" : ""}`}
      onPointerDown={skip}
      onAnimationEnd={(e) => {
        if (e.target === e.currentTarget) setDone(true);
      }}
    >
      <img
        className="intro-logo block h-auto w-[86vw] object-contain invert min-[521px]:w-[min(680px,78vw)]"
        src={assets.signature}
        width={1024}
        height={499}
        alt=""
        aria-hidden="true"
      />
      <button
        type="button"
        onClick={skip}
        className="absolute right-5 bottom-5 min-h-11 cursor-pointer rounded-full border border-white/40 bg-transparent px-5 py-2 text-sm text-white transition duration-250 hover:bg-white hover:text-obsidian"
      >
        Skip intro
      </button>
    </div>
  );
}

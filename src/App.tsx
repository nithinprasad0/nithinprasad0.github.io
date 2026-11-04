import { useEffect, useRef } from "react";
import { profile } from "./content/portfolio";
import { OpeningScreen } from "./components/OpeningScreen";
import { SiteIndex } from "./components/Chapters";
import { Hero } from "./components/Hero";
import { WorldStage } from "./components/WorldStage";
import { Workbench } from "./components/Workbench";
import {
  About,
  Certifications,
  Contact,
  Education,
  Experience,
  Leadership,
  Projects,
  Stack,
} from "./components/Sections";

// Restrained scroll reveals with GSAP ScrollTrigger (the same lazily loaded
// chunk the hero uses). Reduced motion skips it entirely (CSS keeps content
// visible); if GSAP cannot load, everything is revealed at once.
function useReveals() {
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const els = Array.from(document.querySelectorAll<HTMLElement>(".reveal"));
    const showAll = () => els.forEach((el) => el.classList.add("is-visible"));
    let cleanup: (() => void) | undefined;
    let cancelled = false;
    const fallback = window.setTimeout(showAll, 4000);

    Promise.all([import("gsap"), import("gsap/ScrollTrigger")])
      .then(([{ gsap }, { ScrollTrigger }]) => {
        window.clearTimeout(fallback);
        if (cancelled) return;
        gsap.registerPlugin(ScrollTrigger);
        const shown = new WeakSet<Element>();
        const reveal = (batch: Element[]) => {
          const fresh = batch.filter((el) => !shown.has(el));
          fresh.forEach((el) => shown.add(el));
          if (fresh.length) gsap.to(fresh, { opacity: 1, y: 0, duration: 0.8, ease: "power3.out", stagger: 0.08, overwrite: true });
        };
        const triggers = ScrollTrigger.batch(els, { start: "top 88%", once: true, onEnter: reveal });
        // Safety net for instant jumps (anchors, restored scroll position),
        // where a scroll-linked trigger can fire late: the browser's own
        // intersection callback reveals anything that is actually on screen.
        const io = new IntersectionObserver(
          (entries) => reveal(entries.filter((e) => e.isIntersecting).map((e) => e.target)),
          { rootMargin: "0px 0px -6% 0px" },
        );
        els.forEach((el) => io.observe(el));
        // Keyboard focus can land on a link at the very bottom edge, below
        // both triggers: reveal it rather than focus something invisible.
        const onFocus = (e: FocusEvent) => {
          const el = (e.target as Element | null)?.closest?.(".reveal");
          if (el) reveal([el]);
        };
        document.addEventListener("focusin", onFocus);
        // Backstop for navigation jumps (index, Next links, workbench
        // shortcuts): once scrolling settles, anything inside the viewport
        // that is still hidden is revealed. Runs only after scroll stops.
        let settle: number | undefined;
        // It reads the live DOM (not the list captured at mount) and only
        // trusts what GSAP has actually applied (an inline opacity).
        const sweep = () => {
          const h = window.innerHeight;
          const pending = Array.from(document.querySelectorAll<HTMLElement>(".reveal")).filter((el) => {
            if (el.style.opacity) return false;
            const r = el.getBoundingClientRect();
            return r.top < h * 0.94 && r.bottom > 0;
          });
          if (!pending.length) return;
          pending.forEach((el) => shown.add(el));
          gsap.to(pending, { opacity: 1, y: 0, duration: 0.8, ease: "power3.out", stagger: 0.08, overwrite: true });
        };
        const onScroll = () => {
          window.clearTimeout(settle);
          settle = window.setTimeout(sweep, 140);
        };
        window.addEventListener("scroll", onScroll, { passive: true });
        cleanup = () => {
          window.clearTimeout(settle);
          window.removeEventListener("scroll", onScroll);
          document.removeEventListener("focusin", onFocus);
          io.disconnect();
          triggers.forEach((t) => t.kill());
        };
      })
      .catch(showAll);

    return () => {
      cancelled = true;
      window.clearTimeout(fallback);
      cleanup?.();
    };
  }, []);
}

export function App() {
  const progressRef = useRef<HTMLDivElement>(null);
  useReveals();

  // Page scroll progress, written straight to the DOM to avoid re-rendering on scroll.
  useEffect(() => {
    const update = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      if (progressRef.current) {
        progressRef.current.style.width = `${max > 0 ? (window.scrollY / max) * 100 : 0}%`;
      }
    };
    window.addEventListener("scroll", update, { passive: true });
    update();
    return () => window.removeEventListener("scroll", update);
  }, []);

  return (
    <>
      <a
        href="#main-content"
        className="sr-only z-[3000] rounded-md bg-soft-white px-4 py-2 text-obsidian focus:not-sr-only focus:fixed focus:top-3 focus:left-3"
      >
        Skip to content
      </a>
      <a
        href="#site-index"
        className="sr-only z-[3000] rounded-md bg-soft-white px-4 py-2 text-obsidian focus:not-sr-only focus:fixed focus:top-3 focus:left-3"
      >
        Skip to section index
      </a>

      <OpeningScreen />

      {/* Journey progress: the one persistent indicator, a hairline at the top edge. */}
      <div ref={progressRef} aria-hidden="true" className="fixed top-0 left-0 z-[2000] h-[2px] w-0 bg-gradient-to-r from-electric via-ice to-champagne" />

      <WorldStage />

      <main id="main-content">
        <Hero />
        <About />
        <Experience />
        <Projects />
        <Stack />
        <Leadership />
        <Education />
        <Certifications />
        <Contact />
      </main>

      <Workbench />

      {/* The index rests on its own near-solid surface below the closing scene. */}
      <footer className="relative z-[1] border-t border-hairline bg-obsidian/95">
        <div className="container-page py-12">
          <SiteIndex />
          <div className="mt-10 flex flex-col items-start justify-between gap-4 border-t border-hairline pt-6 text-sm text-[#a3abb8] min-[521px]:flex-row min-[521px]:items-center">
            <p>{`© 2026 ${profile.name}`}</p>
            <a className="inline-flex min-h-11 items-center hover:text-soft-white" href="#home">
              Back to top ↑
            </a>
          </div>
        </div>
      </footer>
    </>
  );
}

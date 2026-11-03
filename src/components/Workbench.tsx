import { useCallback, useEffect, useRef, useState, type KeyboardEvent, type ReactNode } from "react";
import { about, assets, experience, profile, projects, stackPathways } from "../content/portfolio";
import { activateCuriousKey, CURIOUS, CURIOUS_CODE, CURIOUS_OPEN, LETTERS, shouldIgnoreKey } from "../three/world/keyInput";

// The Curious Key: an optional Easter egg. One key on the hero keyboard glows a
// little differently; clicking or tapping it, pressing the physical T key, or
// its accessible HTML control opens a small developer workbench. Everything it
// shows already appears on the page, so it hides nothing from visitors or
// search engines, and nothing requires it.


/* ------------------------------------------------------------ Hero clue */

/**
 * The clue under the keyboard, plus an accessible version of the six keys: a
 * toolbar with one tab stop (arrow keys move between keys). It stays visually
 * hidden until it receives keyboard focus; mouse and touch use the 3D keys.
 */
export function CuriousClue() {
  const [active, setActive] = useState(0);
  const buttons = useRef<(HTMLButtonElement | null)[]>([]);

  const onKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    const step = e.key === "ArrowRight" ? 1 : e.key === "ArrowLeft" ? -1 : 0;
    if (!step) return;
    e.preventDefault();
    const next = (active + step + LETTERS.length) % LETTERS.length;
    setActive(next);
    buttons.current[next]?.focus();
  };

  return (
    <div className="curious absolute z-20 max-[520px]:top-[calc(1.5rem+clamp(176px,50vw,300px)-1.6rem)] max-[850px]:right-5 min-[521px]:max-[850px]:top-[calc(1.5rem+clamp(240px,40vw,340px)-1.6rem)] min-[851px]:top-[64%] min-[851px]:right-[27%] min-[851px]:translate-x-1/2 min-[851px]:text-center">
      <p className="curious-clue font-display text-[12px] tracking-[0.04em] text-[#a3abb8] min-[851px]:text-[13px]">
        Some keys have more to say than others.
      </p>
      <div
        role="toolbar"
        aria-label="Keyboard keys"
        onKeyDown={onKeyDown}
        className="sr-only mt-2 gap-1.5 focus-within:not-sr-only focus-within:flex min-[851px]:justify-center"
      >
        {[...LETTERS].map((letter, i) => (
          <button
            key={i}
            ref={(el) => {
              buttons.current[i] = el;
            }}
            type="button"
            tabIndex={i === active ? 0 : -1}
            aria-label={i === CURIOUS ? `${letter} key, the one that glows differently` : `${letter} key, ${i + 1} of ${LETTERS.length}`}
            onFocus={() => setActive(i)}
            onClick={() => {
              window.dispatchEvent(new CustomEvent("key:tap", { detail: i }));
              if (i === CURIOUS) activateCuriousKey();
            }}
            className={`grid size-11 cursor-pointer place-items-center rounded-lg border bg-obsidian/80 font-display text-sm font-semibold transition ${
              i === CURIOUS ? "border-ice/50 text-[#d8ecff]" : "border-white/15 text-[#c9d3e2]"
            }`}
          >
            {letter}
          </button>
        ))}
      </div>
    </div>
  );
}

/* ------------------------------------------------------- The workbench */

type Line = { cmd: string; out: ReactNode };

const go = (hash: string, close: () => void) => () => {
  close();
  document.querySelector(hash)?.scrollIntoView({ behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth" });
};

function outputs(close: () => void): Record<string, { hint: string; out: ReactNode }> {
  const job = experience[0];
  return {
    whoami: { hint: "who is behind this", out: <p>{about.paragraphs[0]}</p> },
    approach: {
      hint: "how the work gets built",
      out: (
        <>
          <p>{job.approach}</p>
          <p className="mt-2 text-[#9aa3b1]">— from {job.title}, {job.org}</p>
        </>
      ),
    },
    focus: {
      hint: "current specialisation",
      out: (
        <ul className="space-y-1">
          {profile.specialisation.map((s) => (
            <li key={s}>
              <span className="text-ice">▸</span> {s}
            </li>
          ))}
        </ul>
      ),
    },
    projects: {
      hint: "jump to a project",
      out: (
        <ul className="space-y-1">
          {projects.map((p, i) => (
            <li key={p.name}>
              <a className="wb-link" href={`#project-${i}`} onClick={go(`#project-${i}`, close)}>
                {String(i + 1).padStart(2, "0")} {p.name}
              </a>
            </li>
          ))}
        </ul>
      ),
    },
    stack: {
      hint: "how the tools fit together",
      out: (
        <>
          <ul className="space-y-1">
            {stackPathways.map((p) => (
              <li key={p.title}>
                <span className="text-[#9aa3b1]">{p.title}:</span> {p.chain.join(" → ")}
              </li>
            ))}
          </ul>
          <a className="wb-link mt-2 inline-block" href="#stack" onClick={go("#stack", close)}>
            open the full stack
          </a>
        </>
      ),
    },
    next: { hint: "what comes next", out: <p>{profile.status}</p> },
    contact: {
      hint: "say hello",
      out: (
        <ul className="space-y-1">
          <li>
            <a className="wb-link" href={`mailto:${profile.email}`}>
              {profile.email}
            </a>
          </li>
          <li>
            <a className="wb-link" href={profile.linkedin} target="_blank" rel="noopener noreferrer">
              LinkedIn
            </a>{" "}
            ·{" "}
            <a className="wb-link" href={profile.github} target="_blank" rel="noopener noreferrer">
              GitHub
            </a>{" "}
            ·{" "}
            <a className="wb-link" href={assets.resume} download>
              résumé (PDF)
            </a>
          </li>
        </ul>
      ),
    },
  };
}

/**
 * A compact, non-modal panel: it never traps focus, the page keeps scrolling
 * behind it, Escape or the Close button dismisses it, and focus returns to
 * where it was.
 */
export function Workbench() {
  const [open, setOpen] = useState(false);
  const [lines, setLines] = useState<Line[]>([]);
  const heading = useRef<HTMLHeadingElement>(null);
  const log = useRef<HTMLDivElement>(null);
  const returnTo = useRef<HTMLElement | null>(null);
  const isOpen = useRef(false);

  const close = useCallback(() => {
    isOpen.current = false;
    setOpen(false);
    const back = returnTo.current;
    returnTo.current = null;
    if (back && document.contains(back)) back.focus({ preventScroll: true });
  }, []);

  useEffect(() => {
    const onOpen = () => {
      // Already open: leave it exactly as it is (no reset, no focus jump).
      if (isOpen.current) return;
      isOpen.current = true;
      const current = document.activeElement as HTMLElement | null;
      returnTo.current = current && current !== document.body ? current : null;
      setLines([]);
      setOpen(true);
    };
    // The physical T key opens the workbench too, through the same activation
    // as clicking the 3D T key. It lives here, not in the 3D scene, so it also
    // works with reduced motion or without WebGL. The shared guard leaves
    // typing, IME, auto-repeat and shortcuts alone; no preventDefault.
    const onKey = (e: globalThis.KeyboardEvent) => {
      if (e.code === CURIOUS_CODE && !shouldIgnoreKey(e)) activateCuriousKey();
    };
    window.addEventListener(CURIOUS_OPEN, onOpen);
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener(CURIOUS_OPEN, onOpen);
      window.removeEventListener("keydown", onKey);
    };
  }, []);

  useEffect(() => {
    if (!open) return;
    heading.current?.focus({ preventScroll: true });
    // Escape closes it from anywhere on the page, without blocking the key.
    const onEsc = (e: globalThis.KeyboardEvent) => e.key === "Escape" && close();
    window.addEventListener("keydown", onEsc);
    return () => window.removeEventListener("keydown", onEsc);
  }, [open, close]);

  useEffect(() => {
    log.current?.lastElementChild?.scrollIntoView({ block: "nearest" });
  }, [lines]);

  if (!open) return null;
  const commands = outputs(close);

  return (
    <section
      role="dialog"
      aria-modal="false"
      aria-labelledby="workbench-title"
      className="workbench fixed z-[2500] flex flex-col max-[640px]:inset-x-3 max-[640px]:bottom-3 max-[640px]:max-h-[72svh] min-[641px]:right-6 min-[641px]:bottom-6 min-[641px]:max-h-[min(560px,76vh)] min-[641px]:w-[440px]"
      onKeyDown={(e) => {
        if (e.key === "Escape") {
          e.stopPropagation();
          close();
        }
      }}
    >
      <header className="wb-titlebar flex items-center gap-3 border-b border-white/10 px-4 py-2.5">
        <span aria-hidden="true" className="flex gap-1.5">
          {[0, 1, 2].map((k) => (
            <span key={k} className="size-2.5 rounded-full bg-slate" />
          ))}
        </span>
        <h2 id="workbench-title" ref={heading} tabIndex={-1} className="font-mono text-[13px] text-silver outline-none">
          ~/workbench
        </h2>
        <button type="button" onClick={close} className="ml-auto inline-flex min-h-11 cursor-pointer items-center rounded-md px-3 text-sm text-[#c9d3e2] hover:bg-white/10 hover:text-white">
          Close <span className="sr-only">workbench</span>
        </button>
      </header>

      <div ref={log} className="flex-1 space-y-4 overflow-y-auto px-4 py-4 font-mono text-[13px] leading-relaxed text-[#d5dbe5]" aria-live="polite">
        <div className="wb-line">
          <p className="text-ice">You found the curious key.</p>
          <p className="mt-1 text-[#b4bbc7]">Most keys just type. This one opens the workbench. Pick a command:</p>
        </div>
        {lines.map((l, k) => (
          <div key={k} className="wb-line">
            <p>
              <span className="text-ice">$</span> {l.cmd}
            </p>
            <div className="mt-1 font-sans text-[14px] text-[#d5dbe5]">{l.out}</div>
          </div>
        ))}
      </div>

      <nav aria-label="Workbench commands" className="flex flex-wrap gap-2 border-t border-white/10 px-4 py-3">
        {Object.entries(commands).map(([cmd, c]) => (
          <button
            key={cmd}
            type="button"
            title={c.hint}
            data-active={lines.at(-1)?.cmd === cmd ? "" : undefined}
            onClick={() => setLines((ls) => [...ls, { cmd, out: c.out }].slice(-4))}
            className="wb-cmd min-h-11 cursor-pointer rounded-md border border-white/12 bg-white/[.04] px-3 font-mono text-[13px] text-[#c9d3e2] transition hover:border-ice/50 hover:text-white"
          >
            {cmd}
          </button>
        ))}
      </nav>
    </section>
  );
}

import { useEffect, useState } from "react";
import { navItems } from "../content/portfolio";

// Navigation without a navbar. The page reads as one continuous experience;
// wayfinding is quiet and contextual:
// - ChapterRail (desktop): a thin column of ticks at the right edge. Only the
//   current chapter's name is shown; the rest appear on hover or focus.
// - Below 1024px each chapter's own heading ("02 / Experience"), the progress
//   hairline and the Next links carry the wayfinding (a floating label there
//   would sit over the reading column).
// - SiteIndex (footer): every section as a plain list of links, which the
//   "Skip to section index" link jumps to.
// Both indicators stay out of the hero, so the opening stays immersive.

/** The section currently at the reading line ("" in the hero). */
export function useActiveChapter() {
  const [active, setActive] = useState("");
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) setActive(entry.target.id === "home" ? "" : entry.target.id);
        }
      },
      { rootMargin: "-35% 0px -55% 0px" },
    );
    document.querySelectorAll("main section[id]").forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);
  return active;
}

export function ChapterRail({ active }: { active: string }) {
  // The chapter's name shows briefly as it begins, then the rail settles back
  // to ticks so it never sits over the scene; hover and focus reveal names.
  const [announce, setAnnounce] = useState(false);
  useEffect(() => {
    if (!active) return;
    setAnnounce(true);
    const t = window.setTimeout(() => setAnnounce(false), 1800);
    return () => window.clearTimeout(t);
  }, [active]);
  return (
    <nav
      aria-label="Chapters"
      data-shown={active ? "" : undefined}
      data-announce={announce ? "" : undefined}
      className="chapter-rail fixed top-1/2 right-4 z-[1500] hidden -translate-y-1/2 min-[1024px]:block"
    >
      <ol className="flex flex-col items-end gap-1">
        {navItems.map((item, i) => {
          const current = item.id === active;
          return (
            <li key={item.id}>
              <a
                href={`#${item.id}`}
                aria-current={current ? "location" : undefined}
                className="group flex min-h-7 items-center justify-end gap-3 rounded-sm px-1"
              >
                <span className="chapter-rail-label font-display text-[11px] tracking-[0.14em] uppercase">
                  <span className="text-[#b3bac6]">{String(i + 1).padStart(2, "0")}</span> {item.label}
                </span>
                <span aria-hidden="true" className="chapter-rail-tick block h-px" />
              </a>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}

export function SiteIndex() {
  return (
    <nav id="site-index" aria-label="Section index" className="scroll-mt-6">
      <p className="eyebrow mb-4 text-[#a3abb8]">Index</p>
      <ol className="grid grid-cols-2 gap-x-6 gap-y-1 min-[521px]:grid-cols-4">
        {navItems.map((item, i) => (
          <li key={item.id}>
            <a className="inline-flex min-h-11 items-center gap-2 text-[15px] text-[#c9d0db] hover:text-soft-white" href={`#${item.id}`}>
              <span className="font-display text-xs text-[#9aa3b1]">{String(i + 1).padStart(2, "0")}</span>
              {item.label}
            </a>
          </li>
        ))}
      </ol>
    </nav>
  );
}

/** A quiet contextual link to the next chapter, at the end of a section. */
export function NextChapter({ id }: { id: string }) {
  const item = navItems.find((n) => n.id === id);
  if (!item) return null;
  return (
    <p className="mt-10">
      <a className="chapter-next inline-flex min-h-11 items-center gap-2 font-display text-sm text-[#b9c2d0] hover:text-soft-white" href={`#${item.id}`}>
        <span className="text-[#9aa3b1]">Next</span> {item.label}
        <span aria-hidden="true">↓</span>
      </a>
    </p>
  );
}

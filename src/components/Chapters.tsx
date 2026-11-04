import { navItems } from "../content/portfolio";

// Navigation without a navbar or persistent controls. The page reads as one
// continuous, scroll-driven experience; wayfinding lives in the content:
// - each chapter's own heading ("02 / Experience"), the progress hairline and
//   the Next links at the end of each chapter;
// - SiteIndex (footer): every section as a plain list of links, which the
//   "Skip to section index" link jumps to.

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

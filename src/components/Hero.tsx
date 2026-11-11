import { useEffect, useRef, type RefObject } from "react";
import { profile } from "../content/portfolio";
import { HeroVisual } from "./HeroVisual";
import { CuriousClue } from "./Workbench";
import { GitHubIcon, LinkedInIcon, ResumeLink } from "./Icons";

// Scroll-out transition for the hero copy and fallback visual. Scrubbed, so it
// follows the scrollbar exactly (and reverses on the way back up); the 3D
// camera move for the same stretch lives in the world's master timeline.
function useHeroScroll(section: RefObject<HTMLElement | null>) {
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let ctx: { revert: () => void } | undefined;
    let cancelled = false;

    Promise.all([import("gsap"), import("gsap/ScrollTrigger")]).then(([{ gsap }, { ScrollTrigger }]) => {
      if (cancelled || !section.current) return;
      gsap.registerPlugin(ScrollTrigger);
      ctx = gsap.context(() => {
        const scrub = { trigger: section.current, start: "top top", end: "bottom top", scrub: true };
        gsap.fromTo(".hero-copy", { y: 0, autoAlpha: 1 }, { y: -90, autoAlpha: 0, ease: "power1.in", scrollTrigger: scrub });
        gsap.fromTo(".hero-visual-wrap", { yPercent: 0 }, { yPercent: 18, ease: "none", scrollTrigger: scrub });
      }, section.current);
    });

    return () => {
      cancelled = true;
      ctx?.revert();
    };
  }, [section]);
}

export function Hero() {
  const section = useRef<HTMLElement>(null);
  useHeroScroll(section);

  return (
    <section
      ref={section}
      id="home"
      aria-labelledby="hero-title"
      className="chapter-hero relative isolate flex flex-col overflow-hidden bg-background text-text-primary min-[851px]:min-h-[100svh]"
    >
      {/* Warm ambient glow behind the fallback image (hidden once the 3D world is drawn). */}
      <div
        aria-hidden="true"
        className="hero-glow pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(60%_55%_at_50%_30%,rgba(201,164,106,.10),transparent_70%)] min-[851px]:bg-[radial-gradient(45%_60%_at_70%_55%,rgba(201,164,106,.12),transparent_70%)]"
      />

      {/* Phones/tablets: a wide, short band sized from the width, so the row fills it
          edge to edge and sits directly above the name; its top and bottom edges are
          masked so the underglow never ends in a hard line. Desktop: right column. */}
      <div className="hero-visual-wrap relative mt-6 max-[850px]:[mask-image:linear-gradient(to_bottom,transparent,#000_8%,#000_80%,transparent)] h-[clamp(176px,50vw,300px)] w-full min-[521px]:h-[clamp(240px,40vw,340px)] min-[851px]:absolute min-[851px]:inset-y-0 min-[851px]:right-0 min-[851px]:mt-0 min-[851px]:h-auto min-[851px]:w-[54%]">
        <HeroVisual />
      </div>

      <div className="container-page relative z-10 flex flex-1 items-start pb-12 min-[851px]:items-center min-[851px]:pt-10 min-[851px]:pb-12">
        <div className="hero-copy max-w-[560px] min-[851px]:max-w-[620px] min-[851px]:pl-[26px]">
          {/* Professional status label: an incoming role, not current employment. */}
          <p className="mb-5 inline-flex items-center gap-2 rounded-full border border-border bg-hover px-3 py-1.5 font-display text-xs font-semibold tracking-[0.1em] text-text-secondary uppercase min-[851px]:mb-7">
            <span aria-hidden="true" className="size-1.5 rounded-full bg-accent-primary" />
            {profile.status}
          </p>
          <h1
            id="hero-title"
            className="mb-5 font-display text-[clamp(56px,15vw,108px)] leading-[.86] font-bold tracking-[-0.035em] min-[851px]:mb-8 min-[851px]:text-[clamp(76px,9vw,124px)] min-[851px]:tracking-[-0.04em]"
          >
            Nithin
            <br />
            Prasad
          </h1>

          <p className="hero-role mb-4 font-display text-[clamp(17px,4.6vw,22px)] leading-snug font-medium tracking-[0.005em] text-accent-primary min-[851px]:mb-6 min-[851px]:text-[clamp(20px,1.9vw,26px)]">
            {profile.designation}
          </p>

          <p className="max-w-[540px] text-base text-text-secondary min-[521px]:text-lg">{profile.bio}</p>

          {/* Phones: primary pair, resume, then social pair, in a tidy 2-column grid. */}
          <div className="mt-6 grid grid-cols-2 gap-3 min-[521px]:mt-[38px] min-[521px]:flex min-[521px]:flex-wrap min-[521px]:items-center">
            <a className="btn btn-primary min-w-0" href="#projects">
              View Projects
            </a>
            <a className="btn btn-secondary min-w-0" href={`mailto:${profile.email}`}>
              Get in Touch
            </a>
            <ResumeLink className="btn btn-secondary btn-icon col-span-2" />
            <a className="btn btn-secondary btn-icon" href={profile.github} target="_blank" rel="noopener noreferrer">
              <GitHubIcon /> GitHub
            </a>
            <a className="btn btn-secondary btn-icon" href={profile.linkedin} target="_blank" rel="noopener noreferrer">
              <LinkedInIcon /> LinkedIn
            </a>
          </div>
        </div>
      </div>

      {/* The Curious Key clue: after the CTAs in tab order, positioned under the keyboard. */}
      <CuriousClue />
    </section>
  );
}

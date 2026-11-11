import { NextChapter } from "./Chapters";
import type { ReactNode } from "react";
import {
  about,
  certificationGroups,
  extras,
  contact,
  education,
  experience,
  leadership,
  profile,
  projects,
  stackIcons,
  stackPathways,
  type Project,
  type TimelineEntry,
} from "../content/portfolio";
import { ArrowUpRightIcon, GitHubIcon, LinkedInIcon, MailIcon, ResumeLink, StackIcon } from "./Icons";
import { OrbitNodes } from "./OrbitNodes";

/*
 * Every section is a chapter of the scroll story. In world mode (html.world)
 * the chapter content sits in a readable glass card in a left column (text
 * below the subject on phones) while the 3D world performs beside it; without
 * the world, the same markup is the editorial layout.
 */
const COLUMN = "world:min-[851px]:max-w-[min(620px,50vw)]";

function SectionHeader({ id, index, label, title }: { id: string; index: string; label: string; title: string }) {
  return (
    <header className="reveal mb-10 grid gap-4 min-[851px]:mb-14 min-[851px]:grid-cols-[200px_1fr] min-[851px]:gap-8 world:min-[851px]:mb-10 world:min-[851px]:grid-cols-1 world:min-[851px]:gap-4">
      <p className="eyebrow min-[851px]:pt-4 world:min-[851px]:pt-0">
        {index} <span className="text-text-muted">/ {label}</span>
      </p>
      <h2 id={`${id}-title`} className="section-title max-w-[16ch]">
        {title}
      </h2>
    </header>
  );
}

function Section({
  id,
  index,
  label,
  title,
  children,
  quiet = false,
  next,
  material = "",
  band = false,
  scene,
}: {
  id: string;
  index: string;
  label: string;
  title: string;
  children: ReactNode;
  quiet?: boolean;
  /** Contextual link to the following chapter (navigation without a navbar). */
  next?: string;
  /** Surface treatment for this chapter's panel (see the material-* rules in index.css). */
  material?: string;
  /** Editorial band: a full-width surface instead of a floating panel. */
  band?: boolean;
  /** Controls that belong to the chapter's 3D scene (outside the glass card, which would contain fixed positioning). */
  scene?: ReactNode;
}) {
  return (
    <section id={id} aria-labelledby={`${id}-title`} className={`section chapter ${quiet ? "chapter-quiet" : ""} ${band ? "chapter-band" : ""}`}>
      <div className="container-page">
        <div className={`chapter-card ${quiet ? "" : COLUMN} ${material} ${band ? "" : "world:glass world:p-6 world:min-[521px]:p-9"}`}>
          <SectionHeader id={id} index={index} label={label} title={title} />
          {children}
          {next && <NextChapter id={next} />}
        </div>
      </div>
      {scene}
    </section>
  );
}

function TagList({ tags, label }: { tags: string[]; label: string }) {
  if (tags.length === 0) return null;
  return (
    <ul className="flex flex-wrap gap-2" aria-label={label}>
      {tags.map((tag) => (
        <li key={tag} className="chip">
          {tag}
        </li>
      ))}
    </ul>
  );
}

/* ---------------------------------------------------------------- About */

export function About() {
  return (
    <Section id="about" index="01" label="About" title={about.headline} next="experience" material="material-warm" scene={<OrbitNodes />}>
      <div className="grid gap-10 min-[1024px]:grid-cols-[1.25fr_1fr] min-[1024px]:gap-14 world:min-[1024px]:grid-cols-1 world:min-[1024px]:gap-8">
        <div className="reveal space-y-5 text-lg leading-relaxed text-text-secondary min-[851px]:text-xl">
          {about.paragraphs.map((p) => (
            <p key={p}>{p}</p>
          ))}
        </div>
        <dl className="reveal panel divide-y divide-border-subtle">
          {about.facts.map((fact) => (
            <div key={fact.label} className="px-6 py-5">
              <dt className="label mb-2">{fact.label}</dt>
              <dd className="font-display text-lg font-medium text-text-primary">{fact.value}</dd>
              <dd className="mt-1 text-sm text-text-muted">{fact.detail}</dd>
            </div>
          ))}
        </dl>
      </div>
    </Section>
  );
}

/* ----------------------------------------------------------- Experience */

export function Experience() {
  return (
    <Section id="experience" index="02" label="Experience" title="Experience" next="projects" material="material-metal">
      {/* Editorial sequence rather than a grid of cards: company line, role,
          a one-line overview, then four numbered capabilities divided by fine
          rules. The 3D system beside it follows the same order. */}
      {experience.map((job) => (
        <article key={job.title} className="reveal">
          <p className="flex flex-wrap items-center gap-x-3 gap-y-1 font-display text-sm">
            <span className="font-semibold text-text-primary">{job.org}</span>
            <span aria-hidden="true" className="text-text-muted">
              ·
            </span>
            <span className="text-text-muted">{job.type}</span>
            <span aria-hidden="true" className="text-text-muted">
              ·
            </span>
            <span className="text-(--chapter-accent)">{job.period}</span>
          </p>
          <h3 className="mt-4 font-display text-[clamp(28px,3.4vw,40px)] leading-[1.1] font-semibold tracking-[-0.02em]">
            {job.title}
          </h3>
          <p className="mt-4 max-w-[52ch] text-lg leading-relaxed text-text-secondary">{job.summary}</p>

          <ol className="mt-8 border-t border-border-subtle min-[521px]:mt-10">
            {job.responsibilities.map((r, i) => (
              <li
                key={r.area}
                data-exp-area={i}
                className="exp-area grid grid-cols-[2.5rem_1fr] gap-x-3 border-b border-border-subtle py-5 min-[521px]:grid-cols-[3.5rem_1fr] min-[521px]:gap-x-4 min-[521px]:py-6"
              >
                <span aria-hidden="true" className="exp-num pt-0.5 font-display text-sm font-medium tracking-[0.08em] text-(--chapter-accent)">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <div>
                  <h4 className="font-display text-lg leading-snug font-semibold text-text-primary">{r.area}</h4>
                  <p className="mt-2 text-[15px] leading-relaxed text-text-secondary">{r.text}</p>
                  {r.links && (
                    <ul className="mt-3 flex flex-wrap gap-x-5 gap-y-2" aria-label="Live websites">
                      {r.links.map((l) => (
                        <li key={l.href}>
                          <a
                            className="link inline-flex min-h-7 items-center gap-1.5 text-sm"
                            href={l.href}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            {l.label} <ArrowUpRightIcon className="size-3.5" />
                          </a>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </li>
            ))}
          </ol>

          {job.approach && (
            <p className="mt-6 text-[15px] leading-relaxed text-text-secondary">
              <span className="label mr-2">Approach</span>
              {job.approach}
            </p>
          )}

          <div className="mt-8">
            <p className="label mb-3">Technologies</p>
            <TagList tags={job.tags} label={`${job.title} technologies`} />
          </div>
        </article>
      ))}
    </Section>
  );
}

/* ------------------------------------------------------------- Projects */

// Static/no-JS cover: a real screenshot when supplied, otherwise a typographic
// cover. In world mode it is hidden — the 3D illustration takes its place.
function ProjectCover({ project }: { project: Project }) {
  return (
    <div className="relative aspect-[16/10] overflow-hidden rounded-xl border border-border-subtle bg-background world:hidden">
      {project.screenshot ? (
        <img
          src={project.screenshot.src}
          alt={project.screenshot.alt}
          width={project.screenshot.width}
          height={project.screenshot.height}
          loading="lazy"
          decoding="async"
          className="size-full object-cover object-top"
        />
      ) : (
        <div aria-hidden="true" className="project-cover absolute inset-0">
          <span className="absolute inset-0 grid place-items-center font-display text-[clamp(88px,13vw,180px)] leading-none font-bold tracking-[-0.05em] text-transparent [-webkit-text-stroke:1px_rgba(201,164,106,.32)]">
            {project.mark}
          </span>
          <span className="label absolute bottom-5 left-5 text-xs">{project.name}</span>
        </div>
      )}
    </div>
  );
}

/** One accent per project, the hue of its 3D environment (see .project-stop in index.css). */
const PROJECT_ACCENTS = ["teal", "mauve", "indigo", "pearl", "steel", "brass"];

export function Projects() {
  return (
    <section id="projects" aria-labelledby="projects-title" className="section chapter">
      <div className="container-page">
        <div className={`${COLUMN} world:glass world:p-6 world:min-[521px]:p-9`}>
          <SectionHeader id="projects" index="03" label="Projects" title="Selected Projects" />
          <p className="reveal -mt-4 hidden max-w-[52ch] text-sm leading-relaxed text-text-muted world:block">
            Each project has its own scene along the route. The 3D scenes illustrate what each system does — they
            are not product screenshots.
          </p>
        </div>

        <ol className="space-y-8 min-[851px]:space-y-12 world:space-y-0">
          {projects.map((project, i) => (
            <li key={project.name} data-project-index={i} data-accent={PROJECT_ACCENTS[i]} className="project-stop reveal">
              <article
                className={`panel panel-hover grid gap-6 p-4 min-[521px]:p-5 min-[1024px]:grid-cols-12 min-[1024px]:items-center min-[1024px]:gap-10 min-[1024px]:p-6 world:glass world:glass-showcase world:block world:p-6 world:min-[521px]:p-8 ${COLUMN} ${i % 2 ? "world:min-[851px]:ml-auto" : ""}`}
                aria-labelledby={`project-${i}`}
              >
                <div className={`min-[1024px]:col-span-7 ${i % 2 ? "min-[1024px]:order-2" : ""}`}>
                  <ProjectCover project={project} />
                </div>
                <div className="px-2 pb-3 min-[1024px]:col-span-5 min-[1024px]:px-2 min-[1024px]:pb-0 world:p-0">
                  <p className="project-index font-display text-sm">
                    {String(i + 1).padStart(2, "0")} <span className="text-text-muted">/{String(projects.length).padStart(2, "0")}</span>
                  </p>
                  <h3 id={`project-${i}`} className="project-title mt-2">
                    {project.name}
                  </h3>
                  <p className="mt-4 text-[16px] leading-relaxed text-text-secondary">{project.description}</p>
                  {project.tags.length > 0 && (
                    <>
                      <h4 className="label mt-6 mb-3">Built with</h4>
                      <TagList tags={project.tags} label={`${project.name} technologies`} />
                    </>
                  )}
                  {project.links && project.links.length > 0 && (
                    // The live deployment is the primary action (light, like
                    // the hero's View Projects); the source is secondary.
                    <ul className="mt-6 flex flex-wrap gap-3" aria-label={`${project.name} links`}>
                      {project.links.map((link) => (
                        <li key={link.href}>
                          <a
                            className={`btn btn-icon ${link.kind === "demo" ? "btn-primary" : "btn-secondary"}`}
                            href={link.href}
                            target="_blank"
                            rel="noopener noreferrer"
                            aria-label={`${project.name} ${link.kind === "demo" ? "live demo" : "source code on GitHub"} (opens in a new tab)`}
                          >
                            {link.kind === "source" && <GitHubIcon />}
                            {link.label}
                            {link.kind === "demo" && <ArrowUpRightIcon />}
                          </a>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </article>
            </li>
          ))}
        </ol>

        <p className={`projects-more reveal mt-10 text-text-muted world:mt-0 ${COLUMN}`}>
          More of my work is on{" "}
          <a className="link -my-3 py-3" href={profile.github} target="_blank" rel="noopener noreferrer">
            GitHub
          </a>
          .
        </p>
        <div className={`projects-more reveal ${COLUMN}`}>
          <NextChapter id="stack" />
        </div>
      </div>
    </section>
  );
}

/* ---------------------------------------------------------------- Stack */

/** Each technology group's accent: mobile, web, Python, AI, integration, workflow. */
const PATHWAY_ACCENTS = ["steel", "mauve", "brass", "patina", "pearl", "pearl"];

function Tech({ name, quiet = false }: { name: string; quiet?: boolean }) {
  const icon = stackIcons[name];
  return (
    <span className={`inline-flex items-center gap-2 rounded-lg border px-3 py-1.5 text-sm ${quiet ? "border-border-subtle text-text-muted" : "tech-pill border-border bg-hover text-text-primary"}`}>
      {icon ? (
        <StackIcon slug={icon} className="size-4 shrink-0 text-accent-secondary" />
      ) : (
        <span aria-hidden="true" className="size-1.5 rounded-full bg-text-muted" />
      )}
      {name}
    </span>
  );
}

// The ecosystem as pathways: how the technologies connect in real work,
// rather than another grid of logo cards. Mirrors the 3D constellation.
export function Stack() {
  return (
    <Section id="stack" index="04" label="Stack" title="Technical Stack" next="leadership">
      {/* AI specialisation first — the skills that differentiate the profile. */}
      <div className="reveal mb-8">
        <p className="label mb-3">Specialisation</p>
        <ul className="flex flex-wrap gap-2.5">
          {profile.specialisation.map((s) => (
            <li
              key={s}
              className="rounded-full border border-accent-primary/40 bg-accent-primary/[.08] px-4 py-2 font-display text-[15px] font-medium text-text-primary"
            >
              {s}
            </li>
          ))}
        </ul>
      </div>
      <ol className="divide-y divide-border-subtle border-y border-border-subtle">
        {stackPathways.map((path, k) => (
          <li key={path.title} data-pathway={k} data-accent={PATHWAY_ACCENTS[k]} className="pathway reveal grid gap-3 py-5">
            <h3 className="label font-semibold">{path.title}</h3>
            <p className="flex flex-wrap items-center gap-2">
              {path.chain.map((name, i) => (
                <span key={name} className="inline-flex items-center gap-2">
                  {i > 0 && (
                    <span aria-label="connects to" className="text-text-muted">
                      →
                    </span>
                  )}
                  <Tech name={name} />
                </span>
              ))}
              {path.with.length > 0 && (
                <>
                  <span aria-label="with" className="mx-1 text-text-muted">
                    +
                  </span>
                  {path.with.map((name) => (
                    <Tech key={name} name={name} quiet />
                  ))}
                </>
              )}
            </p>
          </li>
        ))}
      </ol>
    </Section>
  );
}

/* --------------------------------------------- Leadership and Education */

function Timeline({ entries }: { entries: TimelineEntry[] }) {
  return (
    <ol className="relative min-[851px]:ml-[200px] min-[851px]:pl-8">
      <span aria-hidden="true" className="absolute top-2 bottom-2 left-[5px] w-px bg-border-subtle min-[851px]:left-0" />
      {entries.map((entry) => (
        <li key={entry.title} className="reveal relative pb-12 pl-8 last:pb-0 min-[851px]:pl-0">
          <span aria-hidden="true" className="absolute top-2 left-0 size-[11px] rounded-full border-2 border-(--chapter-accent) bg-background min-[851px]:-left-[37.5px]" />
          <div className="grid gap-2 min-[1024px]:grid-cols-[180px_1fr] min-[1024px]:gap-8">
            <div>
              {entry.period && <p className="font-display text-sm font-medium text-(--chapter-accent)">{entry.period}</p>}
              <p className="mt-1 text-sm text-text-muted">{entry.org}</p>
            </div>
            <div>
              <h3 className="font-display text-[clamp(20px,2.2vw,24px)] leading-snug font-semibold tracking-[-0.01em]">{entry.title}</h3>
              {entry.points.map((p) => (
                <p key={p} className="mt-2 leading-relaxed text-text-secondary">
                  {p}
                </p>
              ))}
              {entry.note && <p className="mt-3 inline-block chip">{entry.note}</p>}
            </div>
          </div>
        </li>
      ))}
    </ol>
  );
}

export function Leadership() {
  return (
    <Section id="leadership" index="05" label="Leadership" title="Leadership" quiet next="education" material="material-warm">
      <Timeline entries={leadership} />
    </Section>
  );
}

export function Education() {
  return (
    <Section id="education" index="06" label="Education" title="Education" quiet next="certifications" material="material-metal">
      <Timeline entries={education} />
    </Section>
  );
}

/* ------------------------------------------------------- Certifications */

export function Certifications() {
  return (
    <Section id="certifications" index="07" label="Certifications" title="Certifications" quiet band next="contact">
      {/* Editorial credential timeline: grouped by discipline, newest first
          within each group; the most relevant credentials (priority ≤ 4) are
          featured, the rest are compact. Dates are the LinkedIn issue months. */}
      <div className="space-y-10 min-[851px]:space-y-14">
        {certificationGroups.map((group, g) => (
          <section
            key={group.title}
            aria-labelledby={`cert-${group.title}`}
            data-accent={[undefined, "steel", "brass"][g]}
            className="cert-group reveal grid gap-5 min-[851px]:grid-cols-[200px_minmax(0,1fr)] min-[851px]:gap-10"
          >
            {/* Category column: each discipline has its own accent rule; AI leads the list. */}
            <header>
              <span aria-hidden="true" className={`cert-rule mb-3 block h-0.5 ${g === 0 ? "w-10" : "w-8"}`} />
              <h3 id={`cert-${group.title}`} className="font-display text-lg leading-snug font-semibold text-text-primary min-[851px]:text-xl">
                {group.title}
              </h3>
              <p className="mt-1 text-sm text-text-muted">
                {group.items.length} {group.items.length === 1 ? "certification" : "certifications"}
              </p>
            </header>
            <ol className="relative max-w-[760px] border-l border-border-subtle pl-6 min-[521px]:pl-8">
              {group.items.map((c) => {
                const featured = c.priority <= 4;
                return (
                  <li key={c.name} className="relative pb-5 last:pb-0 min-[521px]:pb-6">
                    <span
                      aria-hidden="true"
                      className={`absolute top-1.5 -left-[29px] rounded-full min-[521px]:-left-[37px] ${
                        featured ? "cert-marker-featured size-[11px] border-2 bg-background" : "ml-[2px] size-[7px] bg-text-muted/60"
                      }`}
                    />
                    {/* Phones: issuer · date on one line. Wider: the date sits in its own aligned column. */}
                    <div className="grid grid-cols-[auto_1fr] gap-x-2 min-[640px]:grid-cols-[minmax(0,1fr)_5.5rem] min-[640px]:gap-x-6">
                      <p
                        className={`col-span-2 text-balance min-[640px]:col-span-1 ${
                          featured
                            ? "font-display text-[17px] leading-snug font-semibold text-text-primary min-[521px]:text-[clamp(18px,1.9vw,21px)]"
                            : "font-display text-base leading-snug font-medium text-text-secondary"
                        }`}
                      >
                        {c.name}
                      </p>
                      <p className="mt-1 text-sm text-text-secondary min-[640px]:row-start-2">{c.issuer}</p>
                      <p className="mt-1 font-display text-sm text-(--chapter-accent) tabular-nums before:mr-2 before:text-text-muted before:content-['·'] min-[640px]:col-start-2 min-[640px]:row-start-1 min-[640px]:mt-0 min-[640px]:pt-1 min-[640px]:text-right min-[640px]:before:content-none">
                        <time>{c.issued}</time>
                      </p>
                    </div>
                  </li>
                );
              })}
            </ol>
          </section>
        ))}

        {/* Compact, secondary information. */}
        <section aria-labelledby="extras-title" className="reveal border-t border-border-subtle pt-8 min-[851px]:ml-[240px]">
          <h3 id="extras-title" className="sr-only">
            Additional information
          </h3>
          <dl className="grid gap-6 min-[851px]:grid-cols-[1fr_1.4fr] min-[851px]:gap-10">
            <div>
              <dt className="label mb-2">Languages</dt>
              <dd className="text-[15px] leading-relaxed text-text-secondary">
                {extras.languages.map((l, i) => (
                  <span key={l.name}>
                    {i > 0 && <span aria-hidden="true" className="mx-2 text-text-muted">·</span>}
                    {l.name} <span className="text-text-muted">({l.level})</span>
                  </span>
                ))}
              </dd>
            </div>
            <div>
              <dt className="label mb-2">Publication</dt>
              <dd className="text-[15px] leading-relaxed text-text-secondary">{extras.publication}</dd>
            </div>
          </dl>
        </section>
      </div>
    </Section>
  );
}

/* -------------------------------------------------------------- Contact */

export function Contact() {
  return (
    <section id="contact" aria-labelledby="contact-title" className="chapter chapter-finale relative isolate overflow-hidden border-t border-border-subtle">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(55%_60%_at_78%_58%,rgba(201,164,106,.12),transparent_70%),radial-gradient(40%_50%_at_10%_0%,rgba(143,163,184,.06),transparent_70%)] world:hidden"
      />
      <div className="container-page py-24 min-[851px]:py-36 world:py-0">
        {/* World: the closing scene — the invitation centred over the journey's warm horizon. */}
        <div className="finale-copy world:mx-auto world:max-w-[820px] world:text-center">
          <p className="eyebrow reveal">
            08 <span className="text-text-secondary">/ Contact</span>
          </p>
          <h2 id="contact-title" className="reveal mt-6 max-w-[14ch] font-display world:mx-auto text-[clamp(44px,8vw,112px)] leading-[0.95] font-semibold tracking-[-0.045em] world:text-[clamp(40px,5.6vw,84px)]">
            {contact.heading}
          </h2>
          <p className="reveal mt-8 max-w-[560px] text-lg leading-relaxed text-text-secondary world:mx-auto">{contact.body}</p>

          <a
            href={`mailto:${profile.email}`}
            className="reveal group mt-12 inline-flex min-h-12 max-w-full items-center gap-3 border-b border-border pb-3 font-display text-[clamp(20px,3.4vw,40px)] font-medium break-all text-text-primary transition-colors hover:border-accent-primary world:text-[clamp(18px,2.4vw,30px)]"
          >
            <MailIcon className="size-[0.8em] shrink-0 text-accent-primary" />
            {profile.email}
            <ArrowUpRightIcon className="size-[0.7em] shrink-0 text-accent-primary transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1" />
          </a>

          <div className="reveal mt-10 grid grid-cols-2 gap-3 min-[521px]:flex min-[521px]:flex-wrap world:min-[521px]:justify-center">
            <ResumeLink className="btn btn-primary btn-icon col-span-2" />
            <a className="btn btn-secondary btn-icon" href={profile.linkedin} target="_blank" rel="noopener noreferrer">
              <LinkedInIcon /> LinkedIn
            </a>
            <a className="btn btn-secondary btn-icon" href={profile.github} target="_blank" rel="noopener noreferrer">
              <GitHubIcon /> GitHub
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

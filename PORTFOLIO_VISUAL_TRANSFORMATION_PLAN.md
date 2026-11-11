# Portfolio Visual Transformation Plan

Phase 22 — audit and redesign proposal. **Nothing in the site has been changed.**
Audited build: `redesign` @ `c1a13cc` (identical to `main` @ `e11a5a8`, live), production build served locally, Chrome, 10 viewports, every chapter.

Supporting material in [`docs/visual-transformation/`](docs/visual-transformation/):

| File | What it shows |
|---|---|
| `current-320.jpg`, `current-393.jpg`, `current-1024.jpg`, `current-1440.jpg` | Contact sheets: opening, hero, About, Experience, all six projects, Stack, Leadership, Education, Certifications, Contact, footer — as the site renders today |
| `palette-directions.png` | The three proposed palettes, each applied to a real Profexia panel, with measured contrast ratios |
| `palettes.json` | Exact palette values and every contrast measurement |

---

## 1. Current portfolio visual assessment

### What already works (keep it)

- **One continuous world.** A single canvas (`src/three/world/World.tsx`) with one camera flies a scroll-scrubbed timeline (`story.ts`, GSAP ScrollTrigger) through every chapter. It is reversible, and the reading holds give the content time. This is the BMW-like storytelling the brief asks for, and it is the strongest asset of the site.
- **Chapter environments already exist.** `story.ts` (`ENV`, lines 157–181) gives each chapter its own background, accent and rim light: warm umber for About (`#140f0a` / `#d2a26a`), graphite for Experience, teal, plum, indigo, pearl, steel and brass for the six projects, warm copper for Contact. The **About and Contact chapters are the best-looking scenes on the site** precisely because they leave blue behind.
- **Engineering discipline.** Adaptive DPR within a pixel budget, staged mounting, a lite tier for phones, a `Station` component that hides distant scenes, shared materials, and working reduced-motion, no-WebGL and no-JS fallbacks. Rendering is cheap: at most ~120 draw calls and ~80k triangles per frame on any chapter (§8).
- **Content credibility.** Experience, projects, skills, certifications, leadership, education and contact are all present and accurate.

### Why it still reads as "animated / illustrative" and "black and blue"

| # | Finding | Evidence |
|---|---|---|
| 1 | **The 3D is drawn mostly with light, not with matter.** Diagram lines, nodes and accents use unlit, non-tone-mapped emissive materials that ignore the scene's lighting. | `kit.tsx` `MAT.glow`, `glowSoft`, `ice`, `amber`, `mint`, `violet` — all `color:#000` + emissive + `toneMapped:false`. `ProjectGallery.tsx` uses `MAT.glow`/`MAT.ice` 28 times against 7 uses of `MAT.metal`. |
| 2 | **Every reflection is blue.** The only environment map is a procedural "studio" with one white and **two blue** soft-boxes (`#2f86ff`, `#59b5ff`), so all metal, glass and clearcoat in every chapter reflects electric blue, whatever the chapter's palette. | `src/three/StudioEnvironment.tsx` `PANELS` |
| 3 | **Surfaces are mathematically perfect.** No material has a roughness, normal or AO map; every keycap, device and plinth is a single flat colour, so highlights are uniform and objects read as CG. | No texture maps anywhere except canvas labels/UI (`keycap.ts`, `devices.tsx`). |
| 4 | **Objects float.** Shadows exist only on the full tier and only around the hero keyboard (one directional light, 1024² map, ±5 unit frustum). Every other station is grounded by an additive "light pool" sprite instead of contact shadow or occlusion. | `World.tsx` lines 240–252; `kit.tsx` `Pool` |
| 5 | **Gaming-peripheral cues in the hero.** Blue under-glow, an electric LED strip, blue sheen on the caps and an electric point light under a near-black navy background. | `Keyboard.tsx` lines 260–284, 306 (`sheenColor="#2a4f8f"`), `ELECTRIC` |
| 6 | **Light trails everywhere.** The signal path is a bright additive tube that crosses most frames (visible in About, InsightGen, GEM, Stack and Contact screenshots). | `Signal.tsx` (TubeGeometry r=0.024, additive) |
| 7 | **The UI layer is blue regardless of chapter.** Eyebrows are ice blue (`.eyebrow` → `text-ice`), the progress hairline is electric→ice, tech icons are `#8FC8FF`, the hero badge/subtitle are ice, timeline dots are electric. So even in the warm About chapter, the interface stays blue. | `index.css` `.eyebrow`, `Sections.tsx` `Tech`, `App.tsx` progress bar |
| 8 | **Backgrounds are near-black in every chapter.** Chapter backgrounds have 2–5 % luminance; differences between them are barely perceptible behind the 50–76 % opaque glass. | `ENV` values; `@utility glass` |
| 9 | **One composition, repeated nine times.** Every chapter is the same glass card (`world:glass`, blur 20px) with the same `NN / Label` uppercase eyebrow, the same 3D-beside-text split, the same "Next →" link. | `Sections.tsx` (`Chapter`, `SectionHeader`), 12 `.eyebrow` uses |
| 10 | **Token sprawl.** 17 different hard-coded grey text colours in components on top of the theme tokens (`#9aa3b1` ×5, `#b4bbc7` ×4, `#c9d3e2`, `#c9cfda`, `#c3c9d4`, …). | `grep text-\[#` in `src/components` |

---

## 2. 3D realism audit — scene by scene

Legend: **Retain** = keep asset and behaviour, re-material only · **Improve** = keep composition, rebuild materials/lighting/some geometry · **Replace** = keep the story beat and camera slot, build a new still life.

| Scene (file) | What looks artificial | Why | What should change | Decision | Expected improvement | Performance |
|---|---|---|---|---|---|---|
| **Hero keyboard** (`Keyboard.tsx`, `keycap.ts`) | Navy "gamer" mood; under-glow and LED strip; caps look like smooth plastic; blue reflections | Emissive `ELECTRIC` light sources, blue sheen, blue PMREM, no surface texture, no AO in the key gaps | Machined aluminium plate (anisotropic, brushed roughness map), PBT caps with a fine noise roughness/normal map and slightly worn edges, legends as subtle dye-sub (not glowing) at rest; replace under-glow + LED with a warm key light, cool fill and a real contact shadow on a matte desk/plinth surface; keep the press animation and the Curious "T" (its glow becomes a restrained backlight only when pressed) | **Improve** (geometry is good) | Biggest single uplift: reads as a product shot instead of a gaming peripheral | +1 roughness/normal map (512², shared by all caps), contact shadow baked once; net cost ≈ neutral (LED/point light removed) |
| **Signal path** (`Signal.tsx`) | Glowing white/blue light trail across most frames | Additive, non-tone-mapped tube | Either retire it, or make it a physical object: a thin braided cable / brushed rail that catches the key light; visible only in transits, absent in reading holds | **Replace** (as cable) or **remove** | Removes the most "sci-fi" element on the site | Cheaper (no additive overdraw) |
| **About core** (`AboutCore.tsx`) | Orbit rings + glowing nodes + light trails; core sphere is good | Emissive nodes and additive trails; tiny on 320 px and 1024 px (see §7) | Keep the polished core (already PBR with sheen/clearcoat); rings become thin machined metal hoops with real thickness; nodes become small anodised beads with the accessible DOM buttons unchanged; drop additive trails | **Improve** | Turns a "diagram" into a kinetic sculpture / object | Same draw calls; trails removed |
| **Experience systems** (`Systems.tsx`, `devices.tsx`) | Floating phones, stacked trays and monitor tied by glowing lines; UI textures tiny | Devices hover with no shadow; connectors are emissive; scale between devices is arbitrary | Arrange as a desk still life: two phones on a dock, a small server/NAS block for Firebase, a laptop for the .NET connector, a printed bill on paper — at true relative scale on one surface with contact shadows; data flow shown by **light in the device screens** sequencing 01→04, not by lines | **Improve** (devices) / **Replace** (connectors) | Credible "real hardware" story for real client work | Lines removed; 1 baked shadow texture |
| **InsightGen** (`ProjectGallery.tsx` §InsightGen) | Black slabs, white bar chart, glowing ring | Abstract primitives, emissive | A monitor/laptop showing a rendered (illustrative) analysis report with a chart, a printed CSV on paper beside it | **Replace** | Reads as a real tool producing reports | Similar |
| **Revo** | Circles of avatars joined by glowing curves | Pure infographic | Two phones on a surface showing a community feed and a moderation view | **Replace** | Matches what Revo is (a Flutter app) | Fewer meshes |
| **Profexia** | Neon curves between two cards over a blue grid | Infographic + emissive | Laptop showing the learning hub (the real screens: catalogue, course detail, teacher workspace) beside a phone; label stays "Illustration" | **Replace** | Pairs naturally with the new Live Demo / GitHub actions | Similar |
| **Child Vaccination** | Calendar board with white dots and a dotted line | Flat, diagrammatic | Printed wall-calendar / clipboard with dose stickers and a phone showing a reminder | **Improve** | Tactile, credible | Similar |
| **FaceAttend** | Wireframe sphere with dots and HUD brackets | The most "sci-fi" scene; HUD language | Desktop monitor with the attendance window and a webcam on top; recognition shown as a subtle on-screen frame | **Replace** | Matches a real Windows desktop app; removes sci-fi look | Wireframe (many lines) removed: cheaper |
| **GEM applications** | Devices joined by a glowing cable | Same as Experience | Reuse the Experience still life from another angle with the TallyPrime bill printed | **Improve** (shares assets) | Consistency with Experience | Asset reuse |
| **Stack constellation** (`Constellation.tsx`) | Floating keycaps and lines in a void | Emissive edges, additive pools | Keep the keycap metaphor (strong link to the hero): a keycap **tray** — caps resting in a machined aluminium organiser grouped by pathway, the active pathway's caps lifted; lines removed | **Improve** | Keeps identity, gains physicality | Fewer lines; instanced caps |
| **Leadership / Education / Certifications overview** (`story.ts` "quiet") | Long near-black frames with a faint line (very visible on phones) | Overview shot at `dim 0.6`, `fogFar 260`: little to see | A quiet "studio" pause: the camera rests on the hero desk from a high angle with soft daylight, or a dedicated quiet set (bookshelf / certificate frames) | **Replace the frame**, keep the beat | Removes the empty-black gap; gives these credentials their own atmosphere | Cheap (static set, baked shadows) |
| **Contact finale** (`Waypoints.tsx`) | Floating glowing orbs on black | Additive sprites | Return to the keyboard at dusk: warm low key light, the "T" key lit, horizon replaced by a softly lit backdrop | **Improve** | Satisfying bookend to the hero | Cheaper |
| **3D labels** (`kit.tsx` `Label`, `makeLabel`) | Uppercase pill sprites, unreadable on phones | Canvas sprites at 0.12–0.32 world units | Keep only one label per scene (the project name); everything else lives in HTML | **Improve** | Cleaner frames, readable | Fewer textures |

### Global rendering changes (apply to all scenes)

| Area | Current | Proposed (no new dependencies) |
|---|---|---|
| Environment map | Procedural blue studio, PMREM 256 (full) / 64 (lite) | Neutral/warm studio soft-boxes per chapter palette (still procedural, still PMREM — just new panel colours/positions), or three's `RoomEnvironment` (ships inside `three`, no npm change) |
| Tone mapping | R3F default ACES Filmic | `NeutralToneMapping` (three r162+), better for product colour fidelity; tune exposure per chapter |
| Shadows | 1 directional, full tier only, keyboard area only | Per station: drei `ContactShadows` with `frames={1}` (rendered once, then static) — works on phones too; keep the keyboard's real-time shadow on full tier |
| Ambient occlusion | None | Baked: a shared AO/contact texture under each still life; no SSAO pass |
| Surface detail | None | 2–3 shared procedural textures generated once on a canvas (fine noise roughness, brushed-metal streaks, paper grain), 512² on phones / 1024² on desktop |
| Emissive use | Lines, nodes, accents, LEDs | Only real light sources: device screens, the pressed key; `toneMapped:false` removed except the screens |
| Post-processing | None | Keep none. A subtle vignette and grain can be done in CSS over the canvas (free) |

---

## 3. Colour-system assessment

**Current tokens** (`index.css` `@theme`): obsidian `#080a0e`, charcoal `#11151d`, graphite `#171b22`, slate `#252c36`, electric `#397bff`, ice `#a9dfff`, plus violet, champagne, pearl, silver, soft-white, cool-grey `#9299a8`.

- **Accessible today**: text 18.1:1, muted 6.4:1 on surface, electric 4.7:1 on surface (borderline for small text).
- **Problems**: (1) one global blue UI accent fights every non-blue chapter; (2) near-black in every chapter; (3) 17 ad-hoc greys; (4) champagne/violet/pearl exist in tokens but are almost unused in the UI; (5) glass is the only surface type.

## 4. Three visual directions

All values are exact; all ratios measured (`palettes.json`). Every pairing passes WCAG AA; most exceed 6:1.

### Direction 1 — Graphite & Brass (warm metallic, product-studio)

*Philosophy:* a precision-instrument studio. Warm graphite, brushed aluminium, PBT and brass under a warm key light and a cool fill — how premium hardware and watches are photographed.

| Role | Value |
|---|---|
| Background primary / secondary | `#0e0d0c` / `#171513` |
| Surface / surface-2 | `#1d1b19` / `#26231f` |
| Primary accent (buttons, links, active) | Brass `#c9a46a` (on surface 7.4:1; dark text on it 8.0:1) |
| Secondary accent (focus, data, secondary links) | Steel `#8fa3b8` (6.6:1) |
| Text / muted | `#f2eee8` (14.9:1) / `#a8a197` (6.7:1) |
| Border / separator | `#332f2a` |
| 3D key / rim / fill light | `#ffe2c0` / `#c9a46a` / `#8fa3b8` |
| Typography | Keep Inter for body; replace Space Grotesk display with a refined grotesk (e.g. **Inter Tight** or **Manrope**, both free, same Google Fonts request) |

*Section atmospheres:* Hero — warm studio dusk · About — umber (as now) · Experience — cool daylight office graphite · Projects — each keeps its own hue but desaturated toward the graphite base (teal `#0f1a1a`, plum `#191319`, indigo `#12131d`, paper `#1a1917`, steel `#121518`, brass `#1a1610`) · Stack — machined steel, cooler · Credentials — quiet library warm grey · Contact — brass dusk.

*Pros:* most distinctive versus the sea of blue developer portfolios; brass + aluminium + PBT render convincingly with PBR; the existing About/Contact/GEM chapters already prove it works. *Cons:* warmth must be restrained or it becomes "luxury"; brass needs care on links (use underline + weight, not colour alone). *Performance:* neutral.

### Direction 2 — Studio Graphite (restrained cool)

*Philosophy:* an architectural-visualisation studio: neutral graphite, overcast daylight, one desaturated steel-blue accent.

| Role | Value |
|---|---|
| Background | `#0d0f12` / `#14171b` |
| Surface | `#1a1e23` / `#23282e` |
| Accents | Steel blue `#86a9c8` (6.8:1) · Silver `#c5cbd4` (10.3:1) |
| Text / muted | `#eef1f4` (14.8:1) / `#9ba4ae` (6.6:1) |
| Border | `#2f353c` |
| 3D key / rim / fill | `#f4f6f8` / `#86a9c8` / `#5d6772` |

*Pros:* lowest risk; closest to today's identity; very professional. *Cons:* still reads "blue and black" — fails the brief's main complaint; less memorable. *Performance:* neutral.

### Direction 3 — Ink & Copper (deep atmospheric)

*Philosophy:* cinematic night: deep ink-teal atmosphere with copper light — film grading rather than product studio.

| Role | Value |
|---|---|
| Background | `#0a1114` / `#101a1e` |
| Surface | `#152126` / `#1d2b31` |
| Accents | Copper `#d4905f` (6.2:1) · Sage mist `#9fc4b9` (8.7:1) |
| Text / muted | `#eef3f2` (14.7:1) / `#9aabaa` (6.9:1) |
| Border | `#2a3a40` |
| 3D key / rim / fill | `#ffd7b5` / `#d4905f` / `#4e8a8f` |

*Pros:* most cinematic and atmospheric; strong teal/orange contrast. *Cons:* teal-orange is a recognisable film cliché; teal ambient tints every material (realism suffers); harder to give six projects distinct atmospheres. *Performance:* needs fog/atmosphere tuning, otherwise neutral.

## 5. Recommended direction: **Graphite & Brass (Direction 1)**

1. **It answers the brief directly**: it removes the "black and blue" monotony while staying dark, serious and recruiter-friendly.
2. **It is the direction the site's best scenes already point to.** About (umber), GEM (brass) and Contact (copper) are the strongest frames in the current screenshots; Direction 1 generalises them instead of discarding work.
3. **It is the palette in which PBR reads as real.** Warm key + cool fill on aluminium, PBT and paper is the language of premium product photography; it makes the keyboard, devices and desk still lifes credible.
4. **It is distinctive for a software portfolio** without copying BMW (BMW's identity is cool blue/white).
5. **It is cheap to implement on the current architecture**: `story.ts` `ENV` already drives background, fog, rim and accent per chapter; `kit.tsx` `applyEnv` already re-tints shared materials; CSS tokens already exist. The change is values, materials and a handful of new still-life meshes — not a rewrite.

Steel `#8fa3b8` stays as the secondary accent so focus rings, data and the Stack chapter keep a cool counterpoint; electric blue is retired from the UI.

---

## 6. Section-by-section redesign plan

| Section | Today | Proposed hierarchy & composition | Desktop | Mobile |
|---|---|---|---|---|
| **Opening** (`OpeningScreen.tsx`) | Signature writes in on near-black (~2.2 s) | Keep; signature in warm off-white on graphite; shorten to ~1.6 s | Same | Same |
| **Hero** (`Hero.tsx`, `Keyboard.tsx`) | Name left, keyboard right; navy | Product shot: keyboard on a desk surface, warm key light from upper left, name and role in editorial type; one primary CTA (View Projects) in brass, secondary actions as quiet text buttons | 55/45 split | Keyboard first, larger (≈ 90 % width, angled 3/4 view), then name; actions as a 2×2 grid as now |
| **About** (`AboutCore.tsx`, `OrbitNodes.tsx`) | Glass card + orbit | Remove the card on desktop: text set directly on the umber atmosphere with a soft scrim; kinetic metal sculpture beside it | Text column without a box | Sculpture above (fixed size, never clipped), text below on a solid surface |
| **Experience** (`Sections.tsx` `Experience`, `Systems.tsx`) | Card + floating devices | Desk still life; numbered entries 01–04 light the matching device's screen | Text left, still life right | Still life as a sticky header image (40 % height), entries scroll beneath |
| **Projects ×6** (`Projects`, `ProjectGallery.tsx`) | Same glass card for all six; diagrams | Each project a still life on its own plinth, shot like a product page: name, one-line description, tags (max ~8), actions. Alternate left/right as now | Card becomes a lighter "spec sheet" panel with a solid surface, not glass | Full-width still life (16:10), then the spec sheet; descriptions ≤ ~55 words (Profexia currently ~60) |
| **Stack** (`Stack`, `Constellation.tsx`) | Card + floating caps | Keycap tray; pathway list stays in HTML | Same split | Tray from above (top-down camera), list below |
| **Leadership / Education / Certifications** | Three glass cards over an empty overview | One "credentials" atmosphere, three distinct layouts: Leadership as a timeline, Education as two large entries, Certifications as a compact grid grouped by theme; quiet static 3D set behind | Two-column editorial layout | Single column, no empty black gap before each card |
| **Contact** (`Contact`, `Waypoints.tsx`) | Orbs on black + centred CTA | Keyboard at dusk; centred CTA; email as a large brass link | Centred | Centred; email 48 px tall target |
| **Footer** | Index grid | Keep; warm graphite | Same | Same |

**Repetition to remove:** the glass card on every chapter (use three surface types: none/scrim, solid panel, spec sheet), the identical `NN / LABEL` uppercase eyebrow (keep numbers, sentence-case labels), "Next →" links on every chapter (keep on long chapters only), the additive light-pool under every object.

---

## 7. Mobile responsiveness audit

Measured at 320, 360, 375, 393, 430, 768, 1024, 1366, 1440, 1920 (contact sheets: `current-320/393/1024/1440.jpg`).

**Passes everywhere:** no horizontal overflow at any width; 0 console errors; all nine sections present; fallbacks work.

| Issue | Where | Evidence |
|---|---|---|
| Long empty near-black frames before Leadership, Education, Certifications and Contact | 320–430 | `current-393.jpg` 06–09: up to ~60 % of the screen is empty dark |
| About orbit renders tiny and partly off the top | 320, 1024 | `current-320.jpg` 02-about, `current-1024.jpg` 02-about |
| 3D labels unreadable (≈ 6–8 px apparent) | all phones | "NATURAL-LANGUAGE QUESTION", "VACCINATION SCHEDULE" etc. |
| Hero keyboard small (≈ 45 % of height budget used by text) | 320–430 | `current-393.jpg` 01-hero |
| Project illustrations occupy the top ~35 % and are small; text card dominates | 320–430 | project frames |
| Profexia description ~60 words, fills the card | 320–430 | project3 |
| Touch target under 44 px: contact email link (42 px tall) | 360–768 | audit |
| Touch target under 44 px: "GitHub" inline link under Projects (20 px tall) | 1024+ | audit |
| 11 px uppercase hero badge, 10 px project-cover label (fallback) | all | `Hero.tsx:60`, `Sections.tsx:220` |
| Display headings break into 4–5 lines at 320 ("Practical software across mobile, web and AI.") | 320 | about |

**Mobile 3D strategy per scene**

| Scene | Mobile treatment |
|---|---|
| Hero keyboard | Different camera (closer, 3/4 from above), larger in frame; standard material + baked contact shadow |
| About sculpture | Fixed screen-size framing (fit by bounding sphere, not by width breakpoint) |
| Experience / GEM still life | Top-down "flat lay" camera, which suits portrait |
| Projects | Same still life, portrait camera preset per project (`PROJECT_SHOTS` gains a mobile variant) |
| Stack tray | Top-down |
| Credentials / Contact | Static set, low cost; no empty frames |
| Very low-end / Low Power | Existing lite tier, plus a static poster frame per chapter (pre-rendered WebP) when the PerformanceMonitor reaches the floor |

---

## 8. Performance and rendering analysis

Measured per chapter (WebGL calls hooked in the page; Chrome headless — **counts are device-independent, frame times are not**, so fps is not reported):

| Chapter | Draw calls (phone / desktop) | Triangles (phone / desktop) |
|---|---|---|
| Hero | 26 / 33 | 13k / 27k |
| About | 36–66 / 33–69 | 22–32k / 35k |
| Experience | 60 / 104 | 9k / 22k |
| Projects (6) | 35–93 / 43–103 | 6–13k / 20–55k |
| Stack | 72–74 / 69 | 50–52k / 55k |
| Credentials | 53–54 / 62–109 | 18k / 32–79k |
| Contact / footer | 110–116 / 116–119 | 66k / 79k |

- **Budget headroom is large.** iPhone-class GPUs comfortably handle 150–250 draw calls and 300k+ triangles at 60 fps; the real costs are **pixels** (3× DPR) and **shader complexity** (`MeshPhysicalMaterial` with clearcoat/sheen/anisotropy).
- **Canvas resolution today:** phones 3× within a 4.2 MP budget (e.g. 1080×2340 at 360 px); desktop ≤ 2× within 5.5 MP. Keep the Phase 13 adaptive DPR system unchanged.
- **JS heap:** 19–28 MB. **Ready time** (world-ready, local): 2.2–4.9 s.
- **Bundles:** World chunk 993 kB (267 kB gzip) is the main cost; index 276 kB (86 kB gzip); CSS 60 kB (12 kB gzip).

Implications for the redesign:

| Lever | Recommendation |
|---|---|
| Materials | `MeshPhysicalMaterial` only for hero caps/plate on the full tier; `MeshStandardMaterial` + textures elsewhere and on phones |
| Textures | Procedural canvas textures (zero download); if photographic textures are added, KTX2/Basis via `KTX2Loader` from `three/examples` (no npm dependency) at 512² (phone) / 1024² (desktop) |
| Shadows | Contact shadows rendered once per station (static) — no per-frame shadow maps on phones |
| Geometry | Still lifes from rounded boxes and lathe/extrude primitives (as `devices.tsx` already does); instancing for repeated caps; target < 150 draw calls, < 150k tris per chapter |
| Rendering frequency | Consider `frameloop="demand"` during reading holds when nothing animates (battery/thermal win on iPhone) |
| Scroll | Already GSAP ScrollTrigger scrub + per-frame story state; keep |
| Lazy loading | Keep staged mounting; mount each still life only when its station is within range (extend `Station`) |
| GPU memory | Dispose per-station textures when far away; shared texture atlas for screen UIs |

---

## 9. Typography and accessibility

**Typography today:** Space Grotesk (display) + Inter (body), one Google Fonts request; section titles `clamp(36px, 5.4vw, 64px)`, project titles `clamp(26px, 3vw, 38px)`, 12 uppercase eyebrows with 0.22 em tracking, hero badge 11 px uppercase.

Recommendations:

- Replace Space Grotesk (geometric, slightly "tech") with **Inter Tight** (or Manrope) for display: editorial, precise, same request, no new dependency. Keep Inter for body.
- Sentence-case labels; keep uppercase only for the chapter number line, at ≥ 12 px and ≤ 0.12 em tracking.
- Type scale tokens: display 64/56/44/36, title 32/28, body 17/16, small 14, label 12 — mobile display caps at 40 px at 320 px.
- Body measure 60–70 characters: desktop already fits (≈ 67 characters per line in the project panels); the problem is phones, where long descriptions run to 13+ lines.
- Replace the 17 ad-hoc greys with 4 text tokens: `text`, `text-secondary`, `text-muted`, `text-on-accent`.

**Accessibility (preserve and improve):**

- Contrast: all proposed text/accent pairs ≥ 6.1:1 (measured); the Phase 18 label fix becomes unnecessary once muted = `#a8a197`.
- Brass links must also be underlined (colour is not the only cue).
- Focus ring: 2 px steel `#8fa3b8` + 2 px offset on graphite (≥ 3:1 non-text contrast).
- Touch targets ≥ 44×44 (fix the two listed in §7).
- Keep: skip links, OrbitNodes DOM buttons, Curious Key rules (`keyInput.ts`), `prefers-reduced-motion` (static poster frames per chapter), no-WebGL and no-JS fallbacks (fallback images re-shot in the new palette).

---

## 10. Technical architecture recommendations

Keep React 19, Vite 8, Tailwind v4, three r187, R3F 9, drei 10, GSAP 3.15 — **no new framework, no new runtime dependency**.

| Change | Where | Notes |
|---|---|---|
| Design tokens | `src/index.css` `@theme` | New palette, text tokens, surface types; delete ad-hoc hex in components |
| Chapter environments | `src/three/world/story.ts` `ENV` | New values; add `exposure`, `keyColor`, `fillColor` per chapter |
| Environment map | `src/three/StudioEnvironment.tsx` | Neutral/warm panels; optionally regenerate per chapter group (3 maps: warm, neutral, cool) |
| Material library | `src/three/world/kit.tsx` `MAT` | Replace emissive set with physical set: `aluminium`, `anodised`, `pbt`, `paper`, `glassScreen`, `rubber`, `walnut/matte desk`; keep `screen` emissive |
| Procedural textures | new `src/three/textures.ts` | Noise/brushed/paper generated once on canvas; cached |
| Still lifes | `devices.tsx` (extend), `ProjectGallery.tsx` (rewrite per project, one at a time) | Reuse devices across Experience/GEM/projects |
| Shadows | `World.tsx`, per `Station` | drei `ContactShadows frames={1}` |
| Tone mapping | `World.tsx` `<Canvas gl={{ toneMapping: NeutralToneMapping }}>` | Exposure per chapter in `Rig` |
| Mobile cameras | `story.ts` (`mobile` branch already exists) | Per-chapter mobile camera presets |
| Poster fallbacks | `public/assets/posters/*.webp` | For reduced motion, low power and no-WebGL |

---

## 11. Phased implementation roadmap

Each phase is a separate, reviewable change with its own screenshots and approval, in this order (A unlocks everything; B before C because still lifes depend on the material library; D runs alongside C per chapter; E closes).

### Phase A — Design system and colour identity
- **Files:** `src/index.css`, `src/components/*.tsx` (colour classes only), `index.html` (font request), `src/three/world/story.ts` (`ENV` values only), `src/three/StudioEnvironment.tsx` (panel colours).
- **Approach:** tokens first; replace the 17 greys; surface types (none/scrim, panel, spec sheet); new display font; brass/steel accents; chapter backgrounds and env-map panels re-tinted. No geometry changes.
- **Visual objectives:** blue gone from the UI; each chapter visibly its own atmosphere.
- **Risks:** contrast regressions over 3D; font swap shifts line breaks.
- **Acceptance:** all text ≥ 4.5:1 measured over rendered backgrounds at 360/393/768/1440 (Phase 18 method); no `text-[#…]` greys left in components; no layout overflow; Lighthouse a11y unchanged or better.
- **Complexity:** medium. **Testing:** contrast sweep, 10-viewport screenshots, regression suite.

### Phase B — 3D rendering quality (global)
- **Files:** `kit.tsx`, new `textures.ts`, `World.tsx`, `StudioEnvironment.tsx`, `Keyboard.tsx`, `Signal.tsx`.
- **Approach:** physical material library; procedural textures; Neutral tone mapping; contact shadows per station; hero keyboard re-materialised and re-lit (no under-glow/LED); signal path becomes a cable or is removed.
- **Visual objectives:** hero reads as a product shot; no unlit glow outside screens and the pressed key.
- **Risks:** shader compile time on phones; physical materials on lite tier.
- **Acceptance:** hero visually approved; draw calls ≤ 150 and tris ≤ 150k per chapter; iPhone 16 ≥ 55 fps sustained over 60 s at the hero (real device); no new npm dependency; reduced-motion/no-WebGL unchanged.
- **Complexity:** high. **Testing:** real iPhone 16 (HUD config `.claude/vite.hud.config.mjs`), desktop Chrome/Safari, perf counters.

### Phase C — Section-by-section still lifes (one chapter per step)
Order: Experience+GEM (shared assets) → Projects (Profexia, InsightGen, Revo, FaceAttend, Vaccination) → About → Stack → Credentials set → Contact.
- **Files:** `Systems.tsx`, `devices.tsx`, `ProjectGallery.tsx`, `AboutCore.tsx`, `Constellation.tsx`, `Waypoints.tsx`, `Sections.tsx` (layout per chapter), `story.ts` (cameras).
- **Approach:** replace diagrams with still lifes; keep camera beats, scroll timing and accessible DOM controls; "Illustration" label kept.
- **Risks:** content honesty (screens must remain illustrative, not fake screenshots); asset creep.
- **Acceptance per chapter:** approved before/after screenshots at 393 and 1440; no regression in Curious Key, orbit DOM buttons, project actions; budget as Phase B.
- **Complexity:** high (spread over steps). **Testing:** per-chapter screenshots, regression suite, keyboard tests.

### Phase D — Mobile-specific composition
- **Files:** `story.ts` (mobile cameras), `Sections.tsx`, `index.css`, `World.tsx` (`resolutionRange`, demand frameloop), poster assets.
- **Approach:** per-chapter mobile cameras; remove empty frames; type scale caps; touch targets; poster fallbacks.
- **Acceptance:** at 320–430: no frame with > 30 % empty background between chapters; no clipped 3D subject; all targets ≥ 44 px; text ≥ 12 px; iPhone 16 smooth scroll with no thermal throttling in a 5-minute session (real device).
- **Complexity:** medium–high. **Testing:** 320/360/375/393/430/768, real iPhone 16, Low Power Mode.

### Phase E — Final optimisation and validation
- **Scope:** bundle review (World chunk split per station group), texture disposal, demand rendering, Firefox and Safari passes, visual regression baseline, SEO unchanged, résumé unchanged.
- **Acceptance:** World chunk gzip not larger than today (267 kB) + 10 %; all regression suites green; Firefox and real iPhone Safari checked manually; Lighthouse performance not worse than the current live site.
- **Complexity:** medium.

---

## 12. Acceptance criteria summary

| Phase | Must be true to approve |
|---|---|
| A | Palette + fonts applied; 0 ad-hoc greys; all text ≥ 4.5:1 over rendered scenes; no overflow; regression green |
| B | Hero approved as "product shot"; no unlit glow except screens/pressed key; ≤ 150 calls / 150k tris per chapter; iPhone 16 ≥ 55 fps hero; no new dependency |
| C | Each chapter approved individually; interactions unchanged; budgets held |
| D | No empty frames, no clipped subjects, targets ≥ 44 px, text ≥ 12 px on phones; real iPhone session smooth and cool |
| E | Bundle within +10 %; Firefox + Safari + iPhone validated; SEO, résumé and URLs unchanged |

---

## 13. Git status and preserved changes

- Branch `redesign` at `c1a13cc` ("Add Profexia live demo and GitHub links"); `origin/redesign` the same; `main` at `e11a5a8` (merge of PR #4) contains it. The Phase 21 Profexia work is committed and live; there were **no uncommitted changes** before this audit.
- This phase added only untracked documentation: `PORTFOLIO_VISUAL_TRANSFORMATION_PLAN.md` and `docs/visual-transformation/` (4 contact sheets, palette sheet, palette JSON). No source file was modified.
- No branch switch, reset, stash, stage, commit, push, merge or deployment was performed. The résumé PDF is unchanged.

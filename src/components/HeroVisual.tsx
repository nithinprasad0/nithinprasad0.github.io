import { assets } from "../content/portfolio";

/**
 * Hero visual fallback: the keyboard image is always in the prerendered HTML
 * (no-JS, crawlers, first paint, reduced motion, no WebGL). When the 3D world
 * has drawn its first frame, CSS (html.world-ready) fades it out and the
 * world's keyboard takes its place.
 */
export function HeroVisual() {
  return (
    <div className="hero-visual relative h-full w-full">
      <picture className="contents">
        <source srcSet={assets.keyboardAvif} type="image/avif" />
        <source srcSet={assets.keyboardWebp} type="image/webp" />
        <img
          className="hero-fallback absolute inset-0 m-auto h-auto max-h-full w-[78%] object-contain drop-shadow-[0_30px_40px_rgba(0,0,0,.6)] transition-opacity duration-300 min-[851px]:w-[min(560px,80%)]"
          src={assets.keyboard}
          width={1106}
          height={960}
          alt="Nithin name arranged as a keyboard composition"
          fetchPriority="high"
        />
      </picture>
    </div>
  );
}

/**
 * Original file, cropped by viewBox. The bar of L is near y 1306;
 * a viewBox that ended at 1280 cut it off. Glow is a CSS shadow of this
 * same artwork, not a redraw and not an SVG filter on the external image
 * (those filters do not paint the rim in Chromium).
 */
export type MarkArt = {
  href: string;
  viewBox: string;
  width: number;
  height: number;
  label: string;
  /** Platinum BEAUTY WORLD over the black wordmark, dark theme only. Same outlines. */
  words?: string;
};

export const brandArt: MarkArt = {
  href: "/brand/logo.svg",
  viewBox: "40 160 1380 1190",
  width: 1500,
  height: 1500,
  label: "LV Beauty World",
  words: "/brand/logo-words.svg",
};

/** 404 drawn in the strokes of the brand mark. Lit by the same lamp. */
export const lostArt: MarkArt = {
  href: "/brand/404.svg",
  viewBox: "0 0 1240 600",
  width: 1240,
  height: 600,
  label: "404",
};

const Layer = ({ art, href, className, label }: { art: MarkArt; href: string; className: string; label?: string }) => (
  <svg
    className={className}
    viewBox={art.viewBox}
    preserveAspectRatio="xMidYMid meet"
    overflow="visible"
    role={label ? "img" : undefined}
    aria-label={label}
    aria-hidden={label ? undefined : true}
  >
    <image href={href} x="0" y="0" width={art.width} height={art.height} />
  </svg>
);

export const LogoMark = ({ art = brandArt }: { art?: MarkArt }) => (
  <div className="logo-mark" data-logo="">
    <Layer art={art} href={art.href} className="logo-svg logo-glow is-halo" />
    <Layer art={art} href={art.href} className="logo-svg logo-glow is-edge" />
    <Layer art={art} href={art.href} className="logo-svg logo-body" label={art.label} />
    {art.words ? <Layer art={art} href={art.words} className="logo-svg logo-words" /> : null}
  </div>
);

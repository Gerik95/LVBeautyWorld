"use client";

import { useEffect, useRef } from "react";

const rand = (min: number, max: number) => min + Math.random() * (max - min);

/** One frost fern: a stem that forks a few times, thinner at every fork. */
const fern = (
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  angle: number,
  length: number,
  depth: number,
) => {
  if (depth <= 0 || length < 1.5) return;
  const x2 = x + Math.cos(angle) * length;
  const y2 = y + Math.sin(angle) * length;
  ctx.lineWidth = Math.max(0.35, depth * 0.32);
  ctx.beginPath();
  ctx.moveTo(x, y);
  ctx.lineTo(x2, y2);
  ctx.stroke();
  const forks = 2 + Math.round(Math.random());
  for (let i = 1; i <= forks; i += 1) {
    const t = i / (forks + 1);
    const bx = x + (x2 - x) * t;
    const by = y + (y2 - y) * t;
    const spread = rand(0.6, 1.05);
    fern(ctx, bx, by, angle - spread, length * rand(0.32, 0.5), depth - 1);
    fern(ctx, bx, by, angle + spread, length * rand(0.32, 0.5), depth - 1);
  }
  fern(ctx, x2, y2, angle + rand(-0.25, 0.25), length * rand(0.5, 0.7), depth - 1);
};

/**
 * Frost on the glass dock. Ferns grow from both rounded ends and here and
 * there along the rims. The glass lens thaws a clear window that travels
 * with it. Painted once per size; only the window follows the lens.
 */
export default function DockFrost() {
  const wrapRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const wrap = wrapRef.current;
    const canvas = canvasRef.current;
    const dock = wrap?.closest<HTMLElement>(".dock");
    const ctx = canvas?.getContext("2d");
    if (!wrap || !canvas || !dock || !ctx) return;
    const root = document.documentElement;

    let frame = 0;
    let follow = 0;

    const paint = () => {
      const rect = wrap.getBoundingClientRect();
      const width = Math.max(1, rect.width);
      const height = Math.max(1, rect.height);
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, width, height);
      const dark = root.dataset.theme === "dark";
      ctx.lineCap = "round";

      // Rime glow at the ends, where frost gathers first.
      for (const side of [0, 1]) {
        const cx = side ? width : 0;
        const glow = ctx.createRadialGradient(cx, height / 2, 0, cx, height / 2, height * 1.6);
        glow.addColorStop(0, dark ? "rgba(214, 230, 255, 0.2)" : "rgba(255, 255, 255, 0.6)");
        glow.addColorStop(1, "rgba(255, 255, 255, 0)");
        ctx.fillStyle = glow;
        ctx.fillRect(0, 0, width, height);
      }

      // Frost hugs the rims and the rounded ends; labels in the middle stay clear.
      ctx.strokeStyle = dark ? "rgba(226, 238, 255, 0.3)" : "rgba(255, 255, 255, 0.9)";
      ctx.shadowColor = dark ? "rgba(170, 200, 255, 0.35)" : "rgba(90, 112, 150, 0.4)";
      ctx.shadowBlur = dark ? 1.5 : 1;
      const unit = height;
      for (let i = 0; i < 3; i += 1) {
        fern(ctx, rand(0, 0.08) * unit, rand(0.2, 0.8) * height, rand(-0.6, 0.6), unit * rand(0.22, 0.36), 3);
        fern(ctx, width - rand(0, 0.08) * unit, rand(0.2, 0.8) * height, Math.PI + rand(-0.6, 0.6), unit * rand(0.22, 0.36), 3);
      }
      const along = Math.round(width / (unit * 1.4));
      for (let i = 0; i < along; i += 1) {
        const x = rand(0.1, 0.9) * width;
        const topEdge = Math.random() < 0.6;
        const sideways = Math.random() < 0.5 ? 0 : Math.PI;
        // Rime creeps along the rim, tilted only slightly into the glass.
        fern(ctx, x, topEdge ? 1 : height - 1, sideways + (topEdge ? 0.35 : -0.35) * (sideways ? -1 : 1), unit * rand(0.14, 0.24), 3);
      }
    };

    const placeWindow = () => {
      const lens = dock.querySelector<HTMLElement>(".dock-lens");
      if (!lens || lens.classList.contains("is-hidden")) {
        wrap.style.setProperty("--thaw-l", "-999px");
        wrap.style.setProperty("--thaw-r", "-999px");
        return;
      }
      wrap.style.setProperty("--thaw-l", `${lens.offsetLeft}px`);
      wrap.style.setProperty("--thaw-r", `${lens.offsetLeft + lens.offsetWidth}px`);
    };

    /** The lens glides with a CSS transition; read its box for a moment after any change. */
    const track = () => {
      follow = performance.now() + 700;
      if (frame) return;
      const loop = () => {
        placeWindow();
        frame = performance.now() < follow ? window.requestAnimationFrame(loop) : 0;
      };
      frame = window.requestAnimationFrame(loop);
    };

    paint();
    placeWindow();

    const resizeObserver = new ResizeObserver(() => {
      paint();
      placeWindow();
    });
    resizeObserver.observe(wrap);

    const lens = dock.querySelector<HTMLElement>(".dock-lens");
    const lensObserver = new MutationObserver(track);
    if (lens) lensObserver.observe(lens, { attributes: true, attributeFilter: ["style", "class"] });

    const themeObserver = new MutationObserver(paint);
    themeObserver.observe(root, { attributes: true, attributeFilter: ["data-theme"] });

    return () => {
      if (frame) window.cancelAnimationFrame(frame);
      resizeObserver.disconnect();
      lensObserver.disconnect();
      themeObserver.disconnect();
    };
  }, []);

  return (
    <div ref={wrapRef} className="winter-frost">
      <canvas ref={canvasRef} />
    </div>
  );
}

/**
 * Display fireworks for Silvester. Rockets climb with a spark trail and
 * break into shells: peony, chrysanthemum, willow, ring, crossette, palm,
 * often with a crackle afterwards. Each particle keeps a short history of
 * positions for its trail, so the canvas is cleared every frame and leaves
 * no ghosts; colours blend additively in the dark theme. Particles over the
 * hero copy are dimmed and shells are aimed away from it, so text stays legible.
 */

type Kind = "rocket" | "star" | "comet" | "spark" | "glitter";

type Particle = {
  kind: Kind;
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  max: number;
  hue: number;
  sat: number;
  light: number;
  size: number;
  drag: number;
  grav: number;
  /** Sparks per second left behind (comets, willow, rockets). */
  emit: number;
  emitAcc: number;
  emitHue: number;
  /** Twinkle near the end of life. */
  glitter: boolean;
  /** Crossette: splits into four at this remaining life. */
  splitAt: number;
  shell: Shell;
  /** Colour of the shell a rocket carries. */
  shellColor: readonly [number, number, number];
  /** Recent positions, x0 y0 x1 y1 …, oldest first. */
  trail: number[];
  trailLength: number;
  /** CSS colours built once, not every frame. */
  css: string | null;
  hot: string | null;
};

type Shell = "peony" | "chrysanthemum" | "willow" | "ring" | "crossette" | "palm";

type Flash = { x: number; y: number; r: number; life: number; max: number; hue: number };

type Crackle = { x: number; y: number; r: number; at: number; count: number };

export type Rect = { left: number; top: number; right: number; bottom: number };

const rand = (min: number, max: number) => min + Math.random() * (max - min);
const pick = <T,>(list: readonly T[]) => list[Math.floor(Math.random() * list.length)];

/** Hue, saturation, lightness of shell colours. Gold and silver are the classics. */
const palette = [
  [44, 100, 62],
  [356, 92, 62],
  [322, 90, 66],
  [272, 86, 70],
  [212, 96, 66],
  [186, 92, 60],
  [140, 78, 58],
  [30, 100, 60],
  [0, 0, 92],
] as const;

const MAX_PARTICLES = 2400;

export class Fireworks {
  private particles: Particle[] = [];
  private flashes: Flash[] = [];
  private crackles: Crackle[] = [];
  private width = 1;
  private height = 1;
  private avoid: Rect | null = null;

  constructor(
    private ctx: CanvasRenderingContext2D,
    private dark: boolean,
    private maxParticles = MAX_PARTICLES,
  ) {}

  setSize(width: number, height: number) {
    this.width = width;
    this.height = height;
  }

  setDark(dark: boolean) {
    this.dark = dark;
  }

  setAvoid(rect: Rect | null) {
    this.avoid = rect;
  }

  get busy() {
    return this.particles.length > 0 || this.flashes.length > 0 || this.crackles.length > 0;
  }

  /** A burst point in the upper sky, clear of the copy. */
  pickTarget() {
    const w = this.width;
    const h = this.height;
    let best = { x: w * 0.7, y: h * 0.25 };
    for (let i = 0; i < 10; i += 1) {
      const x = rand(0.1, 0.9) * w;
      const y = rand(0.1, 0.5) * h;
      best = { x, y };
      const a = this.avoid;
      const margin = Math.min(w, h) * 0.12;
      if (!a || x < a.left - margin || x > a.right + margin || y < a.top - margin || y > a.bottom + margin) break;
    }
    return best;
  }

  launch(shell?: Shell) {
    const target = this.pickTarget();
    const g = 260;
    const x0 = target.x + rand(-0.06, 0.06) * this.width;
    const y0 = this.height + 8;
    const vy = -Math.sqrt(2 * g * (y0 - target.y));
    const time = -vy / g;
    const color = pick(palette);
    this.particles.push(
      this.make("rocket", x0, y0, (target.x - x0) / time, vy, {
        life: time + 0.05,
        hue: 40,
        sat: 90,
        light: 80,
        size: 1.6,
        drag: 0,
        grav: g,
        emit: 70,
        emitHue: 38,
        shell: shell ?? this.randomShell(),
        shellColor: color,
      }),
    );
  }

  private randomShell(): Shell {
    const roll = Math.random();
    if (roll < 0.3) return "peony";
    if (roll < 0.5) return "chrysanthemum";
    if (roll < 0.64) return "willow";
    if (roll < 0.76) return "ring";
    if (roll < 0.88) return "crossette";
    return "palm";
  }

  private make(kind: Kind, x: number, y: number, vx: number, vy: number, patch: Partial<Particle>): Particle {
    return {
      kind,
      x,
      y,
      vx,
      vy,
      life: 1,
      max: patch.life ?? 1,
      hue: 0,
      sat: 0,
      light: 90,
      size: 1.2,
      drag: 1.6,
      grav: 80,
      emit: 0,
      emitAcc: 0,
      emitHue: 40,
      glitter: false,
      splitAt: -1,
      shell: "peony",
      shellColor: [40, 90, 80],
      trail: [],
      trailLength: kind === "rocket" ? 9 : kind === "comet" ? 10 : kind === "star" ? 6 : kind === "spark" ? 3 : 1,
      css: null,
      hot: null,
      ...patch,
    };
  }

  private explode(rocket: Particle) {
    const { x, y } = rocket;
    const scale = Math.min(this.width, this.height);
    const radius = scale * rand(0.2, 0.34);
    const [hue, sat, light] = rocket.shellColor;
    const second = Math.random() < 0.45 ? pick(palette) : null;
    const add = (p: Particle) => {
      if (this.particles.length < this.maxParticles) this.particles.push(p);
    };

    this.flashes.push({ x, y, r: radius * 0.55, life: 0.22, max: 0.22, hue });

    const sphere = (count: number, speed: number, patch: (i: number) => Partial<Particle>) => {
      for (let i = 0; i < count; i += 1) {
        const u = rand(-1, 1);
        const theta = rand(0, Math.PI * 2);
        const r = Math.sqrt(1 - u * u);
        const s = speed * rand(0.9, 1);
        add(this.make("star", x, y, Math.cos(theta) * r * s, Math.sin(theta) * r * s, patch(i)));
      }
    };

    const colour = (i: number): readonly [number, number, number] =>
      second && i % 2 ? second : [hue, sat, light];

    switch (rocket.shell) {
      case "peony": {
        const drag = 1.7;
        sphere(Math.round(rand(120, 170)), radius * drag, (i) => {
          const [h, s, l] = colour(i);
          return { life: rand(1.5, 2.1), hue: h, sat: s, light: l, size: rand(1.2, 1.8), drag, grav: 70, glitter: Math.random() < 0.35 };
        });
        if (Math.random() < 0.5) this.crackles.push({ x, y, r: radius, at: 1.1, count: 60 });
        break;
      }
      case "chrysanthemum": {
        const drag = 1.5;
        sphere(Math.round(rand(90, 120)), radius * drag, (i) => {
          const [h, s, l] = colour(i);
          return { life: rand(1.8, 2.4), hue: h, sat: s, light: l, size: 1.4, drag, grav: 60, emit: 26, emitHue: 42, glitter: true };
        });
        break;
      }
      case "willow": {
        const drag = 2.3;
        sphere(Math.round(rand(80, 110)), radius * 0.9 * drag, () => ({
          life: rand(3, 3.8),
          hue: 42,
          sat: 92,
          light: 62,
          size: 1.3,
          drag,
          grav: 34,
          emit: 22,
          emitHue: 40,
          glitter: true,
          trailLength: 14,
        }));
        break;
      }
      case "ring": {
        const drag = 1.8;
        const count = Math.round(rand(64, 84));
        const tilt = rand(0.3, 1);
        const turn = rand(0, Math.PI);
        for (let i = 0; i < count; i += 1) {
          const a = (i / count) * Math.PI * 2;
          const rx = Math.cos(a);
          const ry = Math.sin(a) * tilt;
          const s = radius * drag;
          add(
            this.make("star", x, y, (rx * Math.cos(turn) - ry * Math.sin(turn)) * s, (rx * Math.sin(turn) + ry * Math.cos(turn)) * s, {
              life: rand(1.6, 1.9),
              hue,
              sat,
              light,
              size: 1.6,
              drag,
              grav: 55,
            }),
          );
        }
        const [h2, s2, l2] = second ?? pick(palette);
        sphere(40, radius * 0.45 * drag, () => ({ life: 1.3, hue: h2, sat: s2, light: l2, size: 1.2, drag, grav: 60 }));
        break;
      }
      case "crossette": {
        const drag = 1.2;
        const count = Math.round(rand(12, 16));
        for (let i = 0; i < count; i += 1) {
          const a = (i / count) * Math.PI * 2 + rand(-0.1, 0.1);
          const s = radius * 0.8 * drag;
          add(
            this.make("comet", x, y, Math.cos(a) * s, Math.sin(a) * s, {
              life: 1.7,
              hue,
              sat,
              light: Math.min(85, light + 10),
              size: 2,
              drag,
              grav: 70,
              emit: 40,
              emitHue: hue,
              splitAt: 1.05,
              shell: "crossette",
            }),
          );
        }
        break;
      }
      case "palm": {
        const drag = 1.1;
        const count = Math.round(rand(7, 10));
        for (let i = 0; i < count; i += 1) {
          const a = -Math.PI / 2 + ((i / (count - 1)) - 0.5) * Math.PI * 1.7 + rand(-0.08, 0.08);
          const s = radius * 0.95 * drag;
          add(
            this.make("comet", x, y, Math.cos(a) * s, Math.sin(a) * s, {
              life: rand(1.7, 2.1),
              hue: 40,
              sat: 95,
              light: 70,
              size: 2.4,
              trailLength: 14,
              drag,
              grav: 95,
              emit: 90,
              emitHue: 38,
              glitter: true,
            }),
          );
        }
        this.crackles.push({ x, y: y + radius * 0.2, r: radius * 0.8, at: 1.3, count: 50 });
        break;
      }
    }
  }

  update(dt: number) {
    const next: Particle[] = [];
    const spawned: Particle[] = [];
    for (const p of this.particles) {
      p.life -= dt;
      const drag = Math.exp(-p.drag * dt);
      p.vx *= drag;
      p.vy = p.vy * drag + p.grav * dt;
      p.trail.push(p.x, p.y);
      if (p.trail.length > p.trailLength * 2) p.trail.splice(0, 2);
      p.x += p.vx * dt;
      p.y += p.vy * dt;

      if (p.emit > 0) {
        p.emitAcc += p.emit * dt * (p.kind === "rocket" ? 1 : Math.max(0, p.life / p.max));
        while (p.emitAcc >= 1) {
          p.emitAcc -= 1;
          spawned.push(
            this.make("spark", p.x, p.y, p.vx * 0.1 + rand(-14, 14), p.vy * 0.1 + rand(-6, 14), {
              life: p.kind === "rocket" ? rand(0.25, 0.5) : rand(0.5, 1.1),
              hue: p.emitHue,
              sat: 90,
              light: 64,
              size: 0.8,
              drag: 2.2,
              grav: 40,
              glitter: true,
            }),
          );
        }
      }

      if (p.kind === "rocket" && (p.vy >= -10 || p.life <= 0)) {
        this.explode(p);
        continue;
      }
      if (p.splitAt > 0 && p.life <= p.splitAt) {
        p.splitAt = -1;
        const base = Math.atan2(p.vy, p.vx);
        const speed = Math.hypot(p.vx, p.vy) + 60;
        for (let k = 0; k < 4; k += 1) {
          const a = base + Math.PI / 4 + (k * Math.PI) / 2;
          spawned.push(
            this.make("star", p.x, p.y, Math.cos(a) * speed, Math.sin(a) * speed, {
              life: rand(0.7, 1),
              hue: p.hue,
              sat: p.sat,
              light: Math.min(90, p.light + 8),
              size: 1.4,
              drag: 1.6,
              grav: 70,
              glitter: true,
            }),
          );
        }
        continue;
      }
      if (p.life > 0) next.push(p);
    }

    for (const crackle of this.crackles) {
      crackle.at -= dt;
      if (crackle.at > 0) continue;
      for (let i = 0; i < crackle.count; i += 1) {
        const a = rand(0, Math.PI * 2);
        const d = Math.sqrt(Math.random()) * crackle.r;
        spawned.push(
          this.make("glitter", crackle.x + Math.cos(a) * d, crackle.y + Math.sin(a) * d * 0.9, 0, rand(5, 25), {
            life: rand(0.05, 0.35),
            hue: 48,
            sat: 30,
            light: 96,
            size: rand(0.8, 1.6),
            drag: 0,
            grav: 20,
          }),
        );
      }
      crackle.count = 0;
    }
    this.crackles = this.crackles.filter((crackle) => crackle.count > 0);

    for (const flash of this.flashes) flash.life -= dt;
    this.flashes = this.flashes.filter((flash) => flash.life > 0);

    const room = this.maxParticles - next.length;
    this.particles = room > 0 ? next.concat(spawned.slice(0, room)) : next;
  }

  private dim(x: number, y: number) {
    const a = this.avoid;
    if (!a) return 1;
    return x > a.left && x < a.right && y > a.top && y < a.bottom ? 0.2 : 1;
  }

  draw(dt: number) {
    const { ctx, width, height, dark } = this;
    ctx.clearRect(0, 0, width, height);
    if (!this.busy) return;
    ctx.globalCompositeOperation = dark ? "lighter" : "source-over";

    if (dark) {
      for (const flash of this.flashes) {
        const k = flash.life / flash.max;
        const glow = ctx.createRadialGradient(flash.x, flash.y, 0, flash.x, flash.y, flash.r);
        glow.addColorStop(0, `hsla(${flash.hue}, 100%, 86%, ${0.14 * k * k * this.dim(flash.x, flash.y)})`);
        glow.addColorStop(1, `hsla(${flash.hue}, 100%, 70%, 0)`);
        ctx.fillStyle = glow;
        ctx.fillRect(flash.x - flash.r, flash.y - flash.r, flash.r * 2, flash.r * 2);
      }
    }

    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    for (const p of this.particles) {
      const k = Math.max(0, p.life / p.max);
      let alpha = p.kind === "spark" ? k * 0.7 : p.kind === "glitter" ? 1 : Math.min(1, k * 1.6);
      if (p.glitter && k < 0.45) alpha *= Math.random() < 0.5 ? 1 : 0.15;
      alpha *= this.dim(p.x, p.y);
      if (alpha < 0.02) continue;
      if (!p.css) {
        const light = dark ? p.light : Math.max(32, p.light - 22);
        p.css = `hsl(${p.hue} ${p.sat}% ${light}%)`;
        p.hot = `hsl(${p.hue} ${p.sat}% ${Math.min(96, light + 18)}%)`;
      }
      const colour = (p.kind === "star" || p.kind === "comet") && k > 0.82 ? p.hot ?? p.css : p.css;

      // Tail: the recent path, faint; head: the newest stretch, full.
      const trail = p.trail;
      ctx.strokeStyle = colour;
      if (trail.length >= 4) {
        ctx.globalAlpha = alpha * 0.32;
        ctx.lineWidth = Math.max(0.6, p.size * 0.75);
        ctx.beginPath();
        ctx.moveTo(trail[0], trail[1]);
        for (let i = 2; i < trail.length; i += 2) ctx.lineTo(trail[i], trail[i + 1]);
        ctx.lineTo(p.x, p.y);
        ctx.stroke();
      }
      const hx = trail.length >= 2 ? trail[trail.length - 2] : p.x - p.vx * dt;
      const hy = trail.length >= 2 ? trail[trail.length - 1] : p.y - p.vy * dt;
      ctx.globalAlpha = alpha;
      ctx.lineWidth = p.size;
      ctx.beginPath();
      ctx.moveTo(hx, hy);
      ctx.lineTo(p.x, p.y);
      ctx.stroke();
      if (dark && (p.kind === "star" || p.kind === "comet" || p.kind === "rocket") && k > 0.3) {
        ctx.globalAlpha = alpha * 0.14;
        ctx.fillStyle = p.css;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size * 3, 0, Math.PI * 2);
        ctx.fill();
      }
    }
    ctx.globalAlpha = 1;
    ctx.globalCompositeOperation = "source-over";
  }

  clear() {
    this.particles = [];
    this.flashes = [];
    this.crackles = [];
    this.ctx.clearRect(0, 0, this.width, this.height);
  }
}

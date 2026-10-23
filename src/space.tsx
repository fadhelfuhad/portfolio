import { useEffect, useRef } from "react";

// Deep-space backdrop: three layers of stars at different distances that drift past at
// different speeds as the page scrolls and lean a little toward the mouse, plus an
// occasional shooting star. Most stars shine steadily; a rare few twinkle, flaring now and
// then with a small four-point glint. The coloured glows behind it read as nebulae.
// With reduced motion the stars are drawn once and hold still.

type Star = { x: number; y: number; r: number; base: number; speed: number; phase: number; tint: string; twinkles: boolean };
type Meteor = { x: number; y: number; vx: number; vy: number; born: number; life: number };

// Far, middle and near: count per 10,000 px², size, brightness, scroll speed, mouse lean.
const LAYERS = [
  { density: 1.18, size: [0.35, 0.8], light: [0.18, 0.42], scroll: 0.05, lean: 8 },
  { density: 0.44, size: [0.6, 1.15], light: [0.3, 0.6], scroll: 0.12, lean: 18 },
  { density: 0.1, size: [0.9, 1.6], light: [0.5, 0.8], scroll: 0.24, lean: 34 },
];
const TINTS = ["255, 255, 255", "255, 255, 255", "200, 220, 255", "165, 243, 252", "216, 180, 254"];

export function Space() {
  const canvas = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const el = canvas.current;
    const ctx = el?.getContext("2d");
    if (!el || !ctx) return;
    const still = matchMedia("(prefers-reduced-motion: reduce)").matches;
    const rand = (a: number, b: number) => a + Math.random() * (b - a);

    let w = 0, h = 0, layers: Star[][] = [];
    const meteors: Meteor[] = [];
    let mx = 0, my = 0, lx = 0, ly = 0, frame = 0, nextMeteor = performance.now() + rand(2500, 6000);

    const setup = () => {
      const dpr = Math.min(devicePixelRatio, 2);
      w = innerWidth;
      h = innerHeight;
      el.width = w * dpr;
      el.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      layers = LAYERS.map((l) =>
        Array.from({ length: Math.round(((w * h) / 10000) * l.density) }, () => ({
          x: Math.random() * w,
          y: Math.random() * h,
          r: rand(l.size[0], l.size[1]),
          base: rand(l.light[0], l.light[1]),
          speed: rand(0.5, 1.4),
          phase: Math.random() * Math.PI * 2,
          tint: TINTS[Math.floor(Math.random() * TINTS.length)],
          twinkles: Math.random() < 0.025,
        })),
      );
    };

    const draw = (now: number) => {
      ctx.clearRect(0, 0, w, h);
      lx += (mx - lx) * 0.05;
      ly += (my - ly) * 0.05;
      const t = now / 1000;
      layers.forEach((stars, i) => {
        const l = LAYERS[i];
        // Stars wrap around the screen, so each layer scrolls forever.
        const oy = (((-scrollY * l.scroll - ly * l.lean) % h) + h) % h;
        const ox = (((-lx * l.lean) % w) + w) % w;
        for (const s of stars) {
          const x = (s.x + ox) % w, y = (s.y + oy) % h;
          // Twinklers dim and then flare briefly, about every few seconds each.
          const flare = still || !s.twinkles ? 0 : Math.max(0, Math.sin(t * s.speed + s.phase)) ** 8;
          const a = s.twinkles && !still ? s.base * 0.5 + (1 - s.base * 0.5) * flare : s.base;
          if (flare > 0.05) {
            const len = s.r * 2 + 7 * flare;
            ctx.strokeStyle = `rgba(${s.tint}, ${(0.55 * flare).toFixed(3)})`;
            ctx.lineWidth = 0.7;
            ctx.beginPath();
            ctx.moveTo(x - len, y);
            ctx.lineTo(x + len, y);
            ctx.moveTo(x, y - len);
            ctx.lineTo(x, y + len);
            ctx.stroke();
          }
          ctx.fillStyle = `rgba(${s.tint}, ${a.toFixed(3)})`;
          ctx.beginPath();
          ctx.arc(x, y, s.r, 0, Math.PI * 2);
          ctx.fill();
          // The nearest, brightest stars get a soft halo.
          if (i === 2 && s.r > 1.3) {
            ctx.fillStyle = `rgba(${s.tint}, ${(a * 0.08).toFixed(3)})`;
            ctx.beginPath();
            ctx.arc(x, y, s.r * 4, 0, Math.PI * 2);
            ctx.fill();
          }
        }
      });

      if (!still) {
        if (now > nextMeteor) {
          const angle = rand(0.35, 0.6);
          const speed = rand(700, 1100);
          meteors.push({ x: rand(w * 0.1, w * 0.9), y: rand(-20, h * 0.4), vx: Math.cos(angle) * speed * (Math.random() < 0.5 ? -1 : 1), vy: Math.sin(angle) * speed, born: now, life: rand(700, 1100) });
          nextMeteor = now + rand(4000, 9000);
        }
        for (let i = meteors.length - 1; i >= 0; i--) {
          const m = meteors[i];
          const age = (now - m.born) / m.life;
          if (age >= 1) {
            meteors.splice(i, 1);
            continue;
          }
          const sec = (now - m.born) / 1000;
          const x = m.x + m.vx * sec, y = m.y + m.vy * sec;
          const tail = 0.14;
          const g = ctx.createLinearGradient(x, y, x - m.vx * tail, y - m.vy * tail);
          const fade = Math.sin(age * Math.PI);
          g.addColorStop(0, `rgba(255, 255, 255, ${(0.9 * fade).toFixed(3)})`);
          g.addColorStop(0.3, `rgba(165, 243, 252, ${(0.4 * fade).toFixed(3)})`);
          g.addColorStop(1, "rgba(168, 85, 247, 0)");
          ctx.strokeStyle = g;
          ctx.lineWidth = 1.6;
          ctx.lineCap = "round";
          ctx.beginPath();
          ctx.moveTo(x, y);
          ctx.lineTo(x - m.vx * tail, y - m.vy * tail);
          ctx.stroke();
        }
        frame = requestAnimationFrame(draw);
      }
    };

    const move = (e: PointerEvent) => {
      mx = e.clientX / innerWidth - 0.5;
      my = e.clientY / innerHeight - 0.5;
    };
    const resize = () => {
      setup();
      if (still) draw(performance.now());
    };
    const onScroll = () => still && draw(performance.now());

    setup();
    if (still) draw(performance.now());
    else frame = requestAnimationFrame(draw);
    addEventListener("resize", resize);
    addEventListener("pointermove", move, { passive: true });
    addEventListener("scroll", onScroll, { passive: true });
    return () => {
      cancelAnimationFrame(frame);
      removeEventListener("resize", resize);
      removeEventListener("pointermove", move);
      removeEventListener("scroll", onScroll);
    };
  }, []);

  return <canvas ref={canvas} className="space" />;
}

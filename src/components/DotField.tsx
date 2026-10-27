import { useReducedMotion } from "framer-motion";
import { useEffect, useRef } from "react";

type Dot = {
  x: number;
  y: number;
  hx: number;
  hy: number;
  vx: number;
  vy: number;
  r: number;
  /** Opacity, so shadows can recede instead of every dot being equally bright */
  a: number;
  accent: boolean;
};

const GAP = 9; // grid spacing in CSS px for the "o." mark
const IMAGE_GAP = 7; // denser for a portrait, so a face stays readable
const PUSH_RADIUS = 90;
const SPRING = 0.06;
const DAMPING = 0.82;

const cssColor = (name: string) =>
  `rgb(${getComputedStyle(document.documentElement).getPropertyValue(name).trim()})`;

/**
 * Samples a shape into home positions for the dots.
 * Without an image it draws the "o." mark; with one, dark pixels become dots
 * (bigger where darker), so a high-contrast portrait on a light background reads well.
 * In dark mode the dots are light, so a cut-out portrait flips to sizing dots by
 * brightness (otherwise it would read as a photo negative), with its tones
 * stretched to the full range and shadows fading out, so the face has depth.
 */
function sample(
  w: number,
  h: number,
  image: HTMLImageElement | null,
  dark: boolean
): Omit<Dot, "x" | "y" | "vx" | "vy">[] {
  const off = document.createElement("canvas");
  off.width = w;
  off.height = h;
  const c = off.getContext("2d", { willReadFrequently: true })!;
  const s = Math.min(w, h);
  const accentAt = { x: 0, y: 0, r: 0 };

  if (image) {
    const fit = Math.min(w / image.width, h / image.height) * 0.92;
    const iw = image.width * fit;
    const ih = image.height * fit;
    c.drawImage(image, (w - iw) / 2, (h - ih) / 2, iw, ih);
  } else {
    // The "o." mark: a thick ring and a smaller dot at its lower right
    const r = s * 0.27;
    const cx = w / 2 - s * 0.08;
    const cy = h / 2;
    c.lineWidth = r * 0.42;
    c.beginPath();
    c.arc(cx, cy, r, 0, Math.PI * 2);
    c.stroke();
    Object.assign(accentAt, { x: cx + r * 1.6, y: cy + r * 0.88, r: r * 0.27 });
  }

  const data = c.getImageData(0, 0, w, h).data;
  // A cut-out portrait (transparent background) marks exactly where the person is,
  // so even the lightest skin gets a dot and the outline of the face stays whole
  let cutout = false;
  if (image) {
    for (let i = 3; i < data.length; i += 4 * 97) {
      if (data[i] === 0) {
        cutout = true;
        break;
      }
    }
  }
  const gap = image ? IMAGE_GAP : GAP;
  const lumAt = (i: number) => (0.299 * data[i] + 0.587 * data[i + 1] + 0.114 * data[i + 2]) / 255;
  const index = (x: number, y: number) => (Math.floor(y) * w + Math.floor(x)) * 4;

  // Tonal range of the person, used to stretch a flat photo to full contrast
  let lo = 0;
  let hi = 1;
  if (cutout) {
    const lums: number[] = [];
    for (let y = gap / 2; y < h; y += gap)
      for (let x = gap / 2; x < w; x += gap) {
        const i = index(x, y);
        if (data[i + 3] > 128) lums.push(lumAt(i));
      }
    lums.sort((a, b) => a - b);
    lo = lums[Math.floor(lums.length * 0.03)] ?? 0;
    hi = lums[Math.floor(lums.length * 0.97)] ?? 1;
  }

  const dots: Omit<Dot, "x" | "y" | "vx" | "vy">[] = [];
  for (let y = gap / 2; y < h; y += gap) {
    for (let x = gap / 2; x < w; x += gap) {
      const accent = Math.hypot(x - accentAt.x, y - accentAt.y) < accentAt.r;
      if (accent) {
        dots.push({ hx: x, hy: y, r: 2.2, a: 1, accent });
        continue;
      }
      const i = index(x, y);
      const alpha = data[i + 3] / 255;
      if (!image) {
        if (alpha >= 0.18) dots.push({ hx: x, hy: y, r: 2.2, a: 1, accent: false });
        continue;
      }
      if (alpha < 0.08) continue;
      const lum = lumAt(i);
      if (cutout) {
        // Dots grow and strengthen with the "ink" of the theme: in dark mode light
        // dots follow brightness (lit skin big and bright, shadows small and faint),
        // in light mode dark dots follow darkness (hair and eyes big, skin faint)
        const level = Math.min(1, Math.max(0, (lum - lo) / (hi - lo || 1)));
        const tone = Math.pow(dark ? level : 1 - level, 1.1);
        dots.push({ hx: x, hy: y, r: 0.8 + tone * 2.3, a: alpha * (0.38 + 0.62 * tone), accent: false });
        continue;
      }
      // Dark dots: a curve keeps skin light and lets eyes, brows and hair stand out
      const tone = Math.pow(1 - lum, 1.35);
      const ink = alpha * (cutout ? Math.max(0.14, tone) : tone);
      if (ink < 0.08) continue;
      dots.push({ hx: x, hy: y, r: 0.45 + ink * 2.6, a: 1, accent: false });
    }
  }
  return dots;
}

/**
 * The hero's dot field: dots assemble into a shape, scatter away from the
 * cursor and spring back. Pass `image` to draw a portrait instead of "o.".
 * The loop only runs while the field is on screen and something is moving.
 */
export default function DotField({ image, className }: { image?: string | null; className?: string }) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const reduced = useReducedMotion();

  useEffect(() => {
    const wrap = wrapRef.current!;
    const canvas = canvasRef.current!;
    const ctx = canvas.getContext("2d")!;
    let dots: Dot[] = [];
    let img: HTMLImageElement | null = null;
    let w = 0;
    let h = 0;
    let frame = 0;
    let visible = true;
    let pointer = { x: -9999, y: -9999 };
    let colors = { fg: cssColor("--fg"), accent: cssColor("--accent") };

    const draw = () => {
      ctx.clearRect(0, 0, w, h);
      for (const d of dots) {
        ctx.fillStyle = d.accent ? colors.accent : colors.fg;
        ctx.globalAlpha = d.a;
        ctx.beginPath();
        ctx.arc(d.x, d.y, d.r, 0, Math.PI * 2);
        ctx.fill();
      }
    };

    const step = () => {
      frame = 0;
      let moving = false;
      for (const d of dots) {
        const dx = d.x - pointer.x;
        const dy = d.y - pointer.y;
        const dist = Math.hypot(dx, dy);
        if (dist < PUSH_RADIUS && dist > 0) {
          const force = (1 - dist / PUSH_RADIUS) * 6;
          d.vx += (dx / dist) * force;
          d.vy += (dy / dist) * force;
        }
        d.vx = (d.vx + (d.hx - d.x) * SPRING) * DAMPING;
        d.vy = (d.vy + (d.hy - d.y) * SPRING) * DAMPING;
        d.x += d.vx;
        d.y += d.vy;
        if (Math.abs(d.vx) + Math.abs(d.vy) > 0.02) moving = true;
      }
      draw();
      // Sleep once everything has settled; the next pointer move wakes it up
      if (moving && visible) frame = requestAnimationFrame(step);
    };
    const wake = () => {
      if (!frame && visible && !reduced) frame = requestAnimationFrame(step);
    };

    const build = () => {
      const rect = wrap.getBoundingClientRect();
      w = Math.round(rect.width);
      h = Math.round(rect.height);
      // Wait for the portrait instead of flashing "o." first
      if (!w || !h || (image && !img)) return;
      const dpr = window.devicePixelRatio || 1;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const homes = sample(w, h, img, document.documentElement.classList.contains("dark"));
      const first = dots.length === 0;
      dots = homes.map((home, i) => {
        const prev = dots[i];
        // On first build the dots fly in from scattered positions
        const start = reduced
          ? { x: home.hx, y: home.hy }
          : prev ?? (first ? { x: Math.random() * w, y: Math.random() * h } : { x: home.hx, y: home.hy });
        return { ...home, x: start.x, y: start.y, vx: 0, vy: 0 };
      });
      draw();
      wake();
    };

    const onPointer = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      const r = canvas.getBoundingClientRect();
      pointer = { x: e.clientX - r.left, y: e.clientY - r.top };
      const near =
        pointer.x > -PUSH_RADIUS && pointer.y > -PUSH_RADIUS && pointer.x < w + PUSH_RADIUS && pointer.y < h + PUSH_RADIUS;
      if (near) wake();
    };

    const resize = new ResizeObserver(build);
    resize.observe(wrap);

    const onScreen = new IntersectionObserver(([e]) => {
      visible = e.isIntersecting;
      if (visible) wake();
    });
    onScreen.observe(wrap);

    // When light/dark mode flips, re-read the colors and, for a portrait,
    // re-sample it so the dots flow into the mapping for the new theme
    const theme = new MutationObserver(() => {
      colors = { fg: cssColor("--fg"), accent: cssColor("--accent") };
      if (img) build();
      else draw();
    });
    theme.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });

    if (image) {
      const el = new Image();
      el.onload = () => {
        img = el;
        dots = [];
        build();
      };
      el.src = image;
    }

    window.addEventListener("pointermove", onPointer, { passive: true });
    return () => {
      cancelAnimationFrame(frame);
      resize.disconnect();
      onScreen.disconnect();
      theme.disconnect();
      window.removeEventListener("pointermove", onPointer);
    };
  }, [image, reduced]);

  return (
    <div ref={wrapRef} aria-hidden className={`relative ${className ?? ""}`}>
      <canvas ref={canvasRef} className="absolute inset-0 h-full w-full" />
    </div>
  );
}

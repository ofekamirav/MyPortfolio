import { motion, useMotionValue, useMotionValueEvent, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { MaskLine } from "./Reveal";

const LIFT = 0.08; // em a letter rises when the cursor is right on it
const GROW = 0.06; // extra scale at the same point
const REACH = 260; // px from a letter's center where the cursor starts to lift it

/**
 * The hero's big name. Each letter lifts and grows slightly as the cursor
 * gets close (the heading font has a single weight, so this stands in for a
 * weight change), and on scroll the name shrinks into the
 * navbar's "ofek." wordmark, which takes over once it arrives.
 */
export default function HeroName({ text, className }: { text: string; className?: string }) {
  const wrapRef = useRef<HTMLSpanElement>(null);
  const nameRef = useRef<HTMLSpanElement>(null);
  const letters = useRef<(HTMLSpanElement | null)[]>([]);
  const reduced = useReducedMotion();

  // Geometry of the hand-off, measured from the layout (untransformed boxes)
  const geo = useRef({ end: 1, scale: 1, dx: 0 });
  const progress = useMotionValue(0);
  const { scrollY } = useScroll();
  const update = () => {
    progress.set(reduced ? 0 : Math.min(1, Math.max(0, scrollY.get() / geo.current.end)));
  };
  useMotionValueEvent(scrollY, "change", update);

  useLayoutEffect(() => {
    const measure = () => {
      const wrap = wrapRef.current;
      const name = nameRef.current;
      const logo = document.querySelector<HTMLElement>("[data-nav-logo]");
      if (!wrap || !name || !logo) return;
      const scale = parseFloat(getComputedStyle(logo).fontSize) / parseFloat(getComputedStyle(name).fontSize);
      // The logo's box inside the fixed header (offset* ignores the header's own slide animation)
      const header = logo.offsetParent as HTMLElement | null;
      const logoCenter = logo.offsetTop + (header?.offsetTop ?? 0) + logo.offsetHeight / 2;
      const wrapBox = wrap.getBoundingClientRect();
      // Scroll distance after which the scaled name sits centered on the logo.
      // Scrolling moves it up 1:1, so only the scale and a small x shift are animated.
      const docTop = wrapBox.top + window.scrollY;
      geo.current = {
        end: Math.max(1, docTop - (logoCenter - (name.offsetHeight * scale) / 2)),
        scale,
        dx: logo.getBoundingClientRect().left - wrapBox.left,
      };
      update();
    };
    measure();
    document.fonts?.ready.then(measure);
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reduced]);

  const scale = useTransform(progress, (p) => 1 + (geo.current.scale - 1) * p);
  const x = useTransform(progress, (p) => geo.current.dx * p);
  // "Amirav" fades on the way, and the whole name hands off to the navbar logo at the end
  const surnameOpacity = useTransform(progress, [0.25, 0.7], [1, 0]);
  const opacity = useTransform(progress, [0.88, 1], [1, 0]);

  // Hide the hero name from assistive tech once the navbar logo has taken over
  const [handedOff, setHandedOff] = useState(false);
  useMotionValueEvent(progress, "change", (p) => setHandedOff(p >= 1));

  // Letters rise toward the cursor; written straight to the DOM to skip re-renders
  useEffect(() => {
    if (reduced) return;
    let frame = 0;
    let last: PointerEvent | null = null;
    const paint = () => {
      frame = 0;
      if (!last) return;
      for (const el of letters.current) {
        if (!el) continue;
        const r = el.getBoundingClientRect();
        const dist = Math.hypot(r.left + r.width / 2 - last.clientX, r.top + r.height / 2 - last.clientY);
        const t = Math.max(0, 1 - dist / REACH);
        const k = t * t;
        el.style.transform = k ? `translateY(${-LIFT * k}em) scale(${1 + GROW * k})` : "";
      }
    };
    const onMove = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      last = e;
      if (!frame) frame = requestAnimationFrame(paint);
    };
    const reset = () => {
      last = null;
      letters.current.forEach((el) => el && (el.style.transform = ""));
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    document.documentElement.addEventListener("mouseleave", reset);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("pointermove", onMove);
      document.documentElement.removeEventListener("mouseleave", reset);
    };
  }, [reduced]);

  const [first, ...rest] = text.split(" ");
  let count = 0;
  const word = (w: string) =>
    [...w].map((ch) => {
      const index = count++;
      return (
        <span
          key={index}
          ref={(el) => {
            letters.current[index] = el;
          }}
          className="inline-block origin-bottom transition-transform duration-300 ease-out"
        >
          {ch}
        </span>
      );
    });

  return (
    <span ref={wrapRef} className={`block ${className ?? ""}`}>
      <motion.span
        ref={nameRef}
        data-hero-name
        style={{ scale, x, opacity, originX: 0, originY: 0 }}
        aria-hidden={handedOff}
        className="block whitespace-nowrap"
      >
        <MaskLine delay={0.2}>
          <span className="sr-only">{text}</span>
          <span aria-hidden>
            {word(first)}
            <motion.span style={{ opacity: surnameOpacity }} className="inline-block">
              {" "}
              {word(rest.join(" "))}
            </motion.span>
          </span>
        </MaskLine>
      </motion.span>
    </span>
  );
}

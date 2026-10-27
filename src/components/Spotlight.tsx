import { motion, useMotionTemplate, useMotionValue, useSpring } from "framer-motion";
import { useEffect } from "react";

/**
 * A soft accent glow that trails the cursor across the whole page, with a
 * faint dot grid that only shows inside it. Fixed behind the content, so it
 * never gets cut off at a section edge. Desktop only, purely decorative.
 */
export default function Spotlight() {
  const mx = useMotionValue(-600);
  const my = useMotionValue(-600);
  const x = useSpring(mx, { stiffness: 80, damping: 20 });
  const y = useSpring(my, { stiffness: 80, damping: 20 });

  const glow = useMotionTemplate`radial-gradient(420px circle at ${x}px ${y}px, rgb(var(--accent) / 0.08), transparent 70%)`;
  const reveal = useMotionTemplate`radial-gradient(260px circle at ${x}px ${y}px, black, transparent 75%)`;

  useEffect(() => {
    const onMove = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      mx.set(e.clientX);
      my.set(e.clientY);
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => window.removeEventListener("pointermove", onMove);
  }, [mx, my]);

  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 z-0 hidden md:block">
      <motion.div style={{ background: glow }} className="absolute inset-0" />
      <motion.div
        style={{
          backgroundImage: "radial-gradient(rgb(var(--fg) / 0.22) 1px, transparent 1px)",
          backgroundSize: "22px 22px",
          maskImage: reveal,
          WebkitMaskImage: reveal,
        }}
        className="absolute inset-0"
      />
    </div>
  );
}

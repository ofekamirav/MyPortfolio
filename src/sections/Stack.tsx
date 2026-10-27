import { motion, useScroll, useTransform, type MotionValue } from "framer-motion";
import { useRef } from "react";
import { aiSkills, skills } from "../data/projects";

function Row({
  items,
  x,
  muted,
}: {
  items: string[];
  x: MotionValue<string>;
  muted?: boolean;
}) {
  return (
    <motion.div style={{ x }} className="flex w-max gap-8 whitespace-nowrap">
      {[...items, ...items, ...items].map((s, i) => (
        <span
          key={i}
          className={`flex items-center gap-8 text-4xl font-medium tracking-tight sm:text-6xl ${
            muted ? "text-muted/40" : "text-fg"
          }`}
        >
          {s}
          <span className="h-2 w-2 rounded-full bg-accent" aria-hidden />
        </span>
      ))}
    </motion.div>
  );
}

/** Two rows of skills that slide in opposite directions as the page scrolls. */
export default function Stack() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const x1 = useTransform(scrollYProgress, [0, 1], ["0%", "-30%"]);
  const x2 = useTransform(scrollYProgress, [0, 1], ["-30%", "0%"]);

  return (
    <section id="stack" ref={ref} className="py-6 sm:py-10">
      <h2 className="sr-only">Stack</h2>
      <div
        aria-label={[...skills, ...aiSkills].join(", ")}
        className="space-y-3 overflow-hidden py-6"
      >
        <Row items={skills} x={x1} />
        <Row items={aiSkills} x={x2} muted />
      </div>
    </section>
  );
}

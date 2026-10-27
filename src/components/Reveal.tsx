import { motion } from "framer-motion";
import type { ReactNode } from "react";

export const ease = [0.22, 1, 0.36, 1] as const;

type RevealProps = {
  children: ReactNode;
  delay?: number;
  y?: number;
  className?: string;
};

/** Fades and lifts its children into place the first time they scroll into view. */
export function Reveal({ children, delay = 0, y = 24, className }: RevealProps) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.8, ease, delay }}
    >
      {children}
    </motion.div>
  );
}

/**
 * Slides a line of text up from behind a mask.
 * `inView` waits until the line scrolls into view instead of animating on load.
 */
export function MaskLine({
  children,
  delay = 0,
  className,
  inView = false,
}: {
  children: ReactNode;
  delay?: number;
  className?: string;
  inView?: boolean;
}) {
  // The outer (unmoved) span is what gets observed: the inner one starts
  // hidden below the mask, so it would never count as "in view" itself.
  return (
    <motion.span
      className={`block overflow-hidden pb-[0.08em] ${className ?? ""}`}
      initial="hidden"
      {...(inView
        ? { whileInView: "shown", viewport: { once: true, margin: "-40px" } }
        : { animate: "shown" })}
    >
      <motion.span
        className="block"
        variants={{ hidden: { y: "110%" }, shown: { y: 0 } }}
        transition={{ duration: 1, ease, delay }}
      >
        {children}
      </motion.span>
    </motion.span>
  );
}

/** A hairline that draws itself from left to right when it scrolls into view. */
export function DrawLine({ className = "" }: { className?: string }) {
  return (
    <motion.div
      aria-hidden
      className={`h-px origin-left bg-line ${className}`}
      initial={{ scaleX: 0 }}
      whileInView={{ scaleX: 1 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 1.2, ease }}
    />
  );
}

import {
  motion,
  useMotionTemplate,
  useMotionValue,
  useScroll,
  useSpring,
  useTransform,
} from "framer-motion";
import { ArrowDown, ArrowUpRight } from "lucide-react";
import { useRef, type MouseEvent } from "react";
import { MaskLine, ease } from "../components/Reveal";
import Typewriter from "../components/Typewriter";
import { links } from "../data/projects";

const fade = (delay: number) => ({
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.8, ease, delay },
});

const roles = [
  "Software Developer",
  "Applied AI Engineer",
  "Mobile Developer",
  "Full-Stack Developer",
];

export default function Hero() {
  const ref = useRef<HTMLElement>(null);

  // Soft spotlight that trails the cursor (desktop only, purely decorative)
  const mx = useMotionValue(-400);
  const my = useMotionValue(-400);
  const x = useSpring(mx, { stiffness: 80, damping: 20 });
  const y = useSpring(my, { stiffness: 80, damping: 20 });
  const spotlight = useMotionTemplate`radial-gradient(420px circle at ${x}px ${y}px, rgb(var(--accent) / 0.08), transparent 70%)`;

  // As you scroll past the hero, its content drifts up and fades out
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const contentY = useTransform(scrollYProgress, [0, 1], ["0%", "-25%"]);
  const contentOpacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  const onMove = (e: MouseEvent<HTMLElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    mx.set(e.clientX - r.left);
    my.set(e.clientY - r.top);
  };

  return (
    <section
      id="top"
      ref={ref}
      onMouseMove={onMove}
      className="relative flex min-h-[92svh] items-end overflow-hidden pb-16 pt-32 sm:items-center sm:pb-0"
    >
      <motion.div
        aria-hidden
        style={{ background: spotlight }}
        className="pointer-events-none absolute inset-0 hidden md:block"
      />

      <motion.div style={{ y: contentY, opacity: contentOpacity }} className="container-x relative">
        <motion.img
          {...fade(0.1)}
          src={`${import.meta.env.BASE_URL}assets/ofek.jpg`}
          alt="Ofek Amirav"
          className="mb-10 h-12 w-12 rounded-full object-cover grayscale transition duration-500 hover:grayscale-0"
        />

        <h1 className="font-medium tracking-tightest">
          <MaskLine delay={0.2} className="text-[clamp(2.75rem,9vw,6.5rem)] leading-[0.95]">
            Ofek Amirav
          </MaskLine>
          <motion.span
            {...fade(0.5)}
            className="mt-2 block min-h-[1.1em] text-[clamp(1.75rem,5.5vw,4rem)] leading-[1.1] text-muted"
          >
            <Typewriter words={roles} startDelay={1000} />
          </motion.span>
        </h1>

        <motion.p
          {...fade(0.7)}
          className="mt-8 max-w-md text-base leading-relaxed text-muted sm:text-lg"
        >
          I build AI agents, backend services and cross-platform apps. Currently
          shipping QuiverSync, live on Google Play and the App Store.
        </motion.p>

        <motion.div
          {...fade(0.85)}
          className="mt-10 flex flex-wrap items-center gap-x-6 gap-y-3 text-sm"
        >
          <a href="#work" className="group inline-flex items-center gap-2 font-medium">
            See my work
            <ArrowDown
              size={15}
              className="transition-transform duration-300 group-hover:translate-y-0.5"
            />
          </a>
          <span className="h-4 w-px bg-line" aria-hidden />
          {[
            ["GitHub", links.github],
            ["LinkedIn", links.linkedin],
          ].map(([label, href]) => (
            <a
              key={label}
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              className="link-underline text-muted transition-colors hover:text-fg"
            >
              {label}
              <ArrowUpRight size={13} />
            </a>
          ))}
        </motion.div>
      </motion.div>

      {/* Scroll cue: a dot that slides down a short track */}
      <motion.div
        {...fade(1.2)}
        aria-hidden
        className="absolute bottom-8 left-[calc(50%-0.5px)] hidden h-10 w-px overflow-hidden bg-line sm:block"
      >
        <motion.span
          className="absolute left-0 top-0 h-3 w-px bg-fg"
          animate={{ y: [-12, 40] }}
          transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
        />
      </motion.div>
    </section>
  );
}

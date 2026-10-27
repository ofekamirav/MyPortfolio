import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowDown, ArrowUpRight } from "lucide-react";
import { useRef } from "react";
import { MaskLine, ease } from "../components/Reveal";
import Typewriter from "../components/Typewriter";
import { links } from "../data/projects";

const fade = (delay: number) => ({
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.8, ease, delay },
});

const roles = [
  "Mobile Developer",
  "Applied AI Engineer",
  "Full-Stack Developer",
  "Software Developer",
];

export default function Hero() {
  const ref = useRef<HTMLElement>(null);

  // As you scroll past the hero, its content drifts up and fades out
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const contentY = useTransform(scrollYProgress, [0, 1], ["0%", "-25%"]);
  const contentOpacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  return (
    <section
      id="top"
      ref={ref}
      className="relative flex min-h-[92svh] items-end overflow-hidden pb-16 pt-32 sm:items-center sm:pb-0"
    >
      <motion.div style={{ y: contentY, opacity: contentOpacity }} className="container-x relative">
        {/* Portrait in a thin ring, with the accent dot used across the site */}
        <motion.div {...fade(0.1)} className="group relative mb-10 h-[72px] w-[72px]">
          <div className="h-full w-full rounded-full border border-line bg-bg p-1 transition-colors duration-500 group-hover:border-accent/50">
            <img
              src={`${import.meta.env.BASE_URL}assets/ofek.jpg`}
              alt="Ofek Amirav"
              className="h-full w-full rounded-full object-cover grayscale transition duration-500 group-hover:grayscale-0"
            />
          </div>
          <span
            aria-hidden
            className="absolute bottom-1 right-1 h-3 w-3 rounded-full border-2 border-bg bg-accent"
          />
        </motion.div>

        <h1 className="font-medium tracking-tightest">
          <MaskLine delay={0.2} className="text-[clamp(2.75rem,8vw,8.5rem)] leading-[0.95]">
            Ofek Amirav
          </MaskLine>
          <motion.span
            {...fade(0.5)}
            className="mt-2 block min-h-[1.1em] text-[clamp(1.75rem,4.8vw,5rem)] leading-[1.1] text-muted"
          >
            <Typewriter words={roles} startDelay={1000} />
          </motion.span>
        </h1>

        <motion.p
          {...fade(0.7)}
          className="mt-8 max-w-md text-base leading-relaxed text-muted sm:text-lg xl:max-w-lg xl:text-xl"
        >
          I build mobile apps for Android and iOS, plus the backends and AI agents
          behind them. Currently shipping QuiverSync, live on Google Play and the App Store.
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

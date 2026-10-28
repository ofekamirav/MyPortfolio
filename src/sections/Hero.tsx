import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowDown, ArrowUpRight } from "lucide-react";
import { useRef } from "react";
import DotField from "../components/DotField";
import HeroName from "../components/HeroName";
import { ease } from "../components/Reveal";
import Typewriter from "../components/Typewriter";
import { heroPortrait, links } from "../data/projects";

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

  // As you scroll, everything but the name fades out (the name flies into the navbar).
  // Fading only, no drift, so nothing slides over the shrinking name.
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const contentOpacity = useTransform(scrollYProgress, [0, 0.35], [1, 0]);
  const fieldOpacity = useTransform(scrollYProgress, [0, 0.6], [1, 0]);
  const fieldY = useTransform(scrollYProgress, [0, 1], ["0%", "-15%"]);

  return (
    <section
      id="top"
      ref={ref}
      className="relative flex min-h-[92svh] items-end overflow-hidden pb-16 pt-32 sm:items-center sm:pb-0"
    >
      <div className="container-x relative grid items-center gap-y-6 lg:grid-cols-12 lg:gap-x-10">
        <div className="lg:col-span-7">
          <h1 className="font-medium tracking-tightest">
            <HeroName
              text="Ofek Amirav"
              className="font-display text-[clamp(2.75rem,7.4vw,8.5rem)] font-normal leading-[0.95] tracking-tight"
            />
            <motion.span style={{ opacity: contentOpacity }} className="block">
              <motion.span
                {...fade(0.5)}
                className="mt-2 block min-h-[1.1em] text-[clamp(1.75rem,4.4vw,5rem)] leading-[1.1] text-muted"
              >
                <Typewriter words={roles} startDelay={1000} />
              </motion.span>
            </motion.span>
          </h1>

          <motion.div style={{ opacity: contentOpacity }}>
            <motion.p
              {...fade(0.7)}
              className="mt-8 max-w-md text-base leading-relaxed text-muted sm:text-lg xl:max-w-lg xl:text-xl"
            >
              Mobile developer building Android and iOS apps with Kotlin Multiplatform,
              along with the backend services and AI features that support them.
              Currently working on QuiverSync, a surfboard rental marketplace available
              on Google Play and the App Store.
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
        </div>

        {/* Dot field: the portrait from heroPortrait, or the "o." mark when it's null */}
        <motion.div
          style={{ opacity: fieldOpacity, y: fieldY }}
          className="order-first w-full max-w-[260px] justify-self-end sm:max-w-[340px] lg:order-none lg:col-span-5 lg:max-w-[560px]"
        >
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1.2, ease, delay: 0.3 }}
          >
            <DotField image={heroPortrait} className="aspect-square w-full" />
          </motion.div>
        </motion.div>
      </div>

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

import {
  AnimatePresence,
  motion,
  useMotionValue,
  useScroll,
  useSpring,
  useTransform,
} from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { useRef, useState, type CSSProperties, type MouseEvent } from "react";
import AgentFlow from "../components/AgentFlow";
import { DrawLine, MaskLine, Reveal, ease } from "../components/Reveal";
import { projects, type Project } from "../data/projects";

/** The one line a reader should remember about the project. */
function Highlight({ text, color }: { text: string; color: string }) {
  return (
    <p className="relative mt-6 max-w-sm pl-4 text-[15px] xl:max-w-md xl:text-base font-medium leading-relaxed text-fg">
      <span
        className="absolute left-0 top-[0.6em] h-1.5 w-1.5 rounded-full"
        style={{ background: color }}
        aria-hidden
      />
      {text}
    </p>
  );
}

/**
 * The screenshot: unmasks from its center on enter, grows to full size as it
 * reaches the middle of the screen, tilts toward the cursor, drifts with
 * parallax, and shows a "Watch demo" pill that follows the cursor.
 */
function ProjectImage({ project }: { project: Project }) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const scale = useTransform(scrollYProgress, [0, 0.4, 1], [0.88, 1, 1]);
  const imgY = useTransform(scrollYProgress, [0, 1], ["-6%", "6%"]);

  // Cursor position inside the card, -0.5..0.5 on each axis
  const px = useMotionValue(0);
  const py = useMotionValue(0);
  const rotateY = useSpring(useTransform(px, [-0.5, 0.5], [-6, 6]), { stiffness: 150, damping: 18 });
  const rotateX = useSpring(useTransform(py, [-0.5, 0.5], [5, -5]), { stiffness: 150, damping: 18 });

  // The pill follows the cursor in pixels, with a slight lag
  const cx = useSpring(useMotionValue(0), { stiffness: 350, damping: 30 });
  const cy = useSpring(useMotionValue(0), { stiffness: 350, damping: 30 });
  const [hover, setHover] = useState(false);

  const onMove = (e: MouseEvent<HTMLElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    px.set((e.clientX - r.left) / r.width - 0.5);
    py.set((e.clientY - r.top) / r.height - 0.5);
    cx.set(e.clientX - r.left);
    cy.set(e.clientY - r.top);
  };
  const onLeave = () => {
    px.set(0);
    py.set(0);
    setHover(false);
  };

  const href = project.demoUrl ?? project.websiteUrl ?? project.codeUrl;
  const label = project.demoUrl
    ? "Watch demo"
    : project.websiteUrl
      ? "Visit site"
      : project.codeUrl
        ? "View code"
        : null;
  const Tag = href ? motion.a : motion.div;

  return (
    <div ref={ref} className="[perspective:1200px] md:order-2 md:col-span-7">
      <motion.div style={{ scale }}>
        <Tag
          {...(href ? { href, target: "_blank", rel: "noopener noreferrer" } : {})}
          aria-label={label ? `${project.title}: ${label}` : undefined}
          onMouseMove={onMove}
          onMouseEnter={() => setHover(true)}
          onMouseLeave={onLeave}
          initial={{ clipPath: "inset(12% 12% 12% 12% round 28px)", opacity: 0 }}
          whileInView={{ clipPath: "inset(0% 0% 0% 0% round 16px)", opacity: 1 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 1.2, ease }}
          style={{ rotateX, rotateY }}
          className={`relative block aspect-[16/10] overflow-hidden rounded-2xl border border-line bg-surface shadow-[0_30px_80px_-40px_transparent] transition-shadow duration-500 group-hover:shadow-[0_30px_80px_-35px_var(--c)] ${
            href ? "md:cursor-none" : ""
          }`}
        >
          <div className="absolute inset-0 transition-transform duration-700 ease-out group-hover:scale-[1.04]">
            {project.image === "agent" ? (
              <AgentFlow />
            ) : (
              <motion.img
                src={project.image}
                alt={`${project.title} preview`}
                loading="lazy"
                style={{ y: imgY, objectPosition: project.imagePosition ?? "center" }}
                className="absolute inset-x-0 -top-[6%] h-[112%] w-full object-cover"
              />
            )}
          </div>

          <AnimatePresence>
            {hover && label && (
              <motion.span
                aria-hidden
                style={{ x: cx, y: cy, background: project.color }}
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0, opacity: 0 }}
                transition={{ duration: 0.25, ease }}
                className="pointer-events-none absolute left-0 top-0 z-10 -ml-14 -mt-5 hidden h-10 w-28 items-center justify-center gap-1 rounded-full text-xs font-medium text-white shadow-lg md:flex"
              >
                {label}
                <ArrowUpRight size={13} />
              </motion.span>
            )}
          </AnimatePresence>
        </Tag>
      </motion.div>
    </div>
  );
}

function ProjectRow({ project, index }: { project: Project; index: number }) {
  const ref = useRef<HTMLElement>(null);
  // A thin line in the project's color fills as you scroll through the project
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 0.8", "end 0.5"] });
  const fill = useTransform(scrollYProgress, [0, 1], [0, 1]);

  // The first link is the primary one; the rest are shown muted
  const links = [
    { label: "Watch demo", href: project.demoUrl },
    { label: "Website", href: project.websiteUrl },
    { label: "Google Play", href: project.playStoreUrl },
    { label: "App Store", href: project.appStoreUrl },
    { label: "Source", href: project.codeUrl },
  ].filter((l): l is { label: string; href: string } => !!l.href);

  return (
    <article
      ref={ref}
      style={{ "--c": project.color } as CSSProperties}
      className="group relative"
    >
      <DrawLine />
      <div className="grid gap-6 py-10 md:grid-cols-12 md:gap-10 md:py-16">
        <div className="relative flex flex-col md:order-1 md:col-span-5 md:pl-6">
          {/* Scroll progress rail on the left (desktop) */}
          <div className="absolute bottom-0 left-0 top-0 hidden w-px bg-line md:block" aria-hidden>
            <motion.div
              style={{ scaleY: fill, background: project.color }}
              className="h-full w-px origin-top"
            />
          </div>

          <Reveal className="flex items-baseline justify-between" y={12}>
            <span className="font-mono text-xs" style={{ color: project.color }}>
              {String(index + 1).padStart(2, "0")}
              <span className="text-muted"> / {String(projects.length).padStart(2, "0")}</span>
            </span>
            <span className="label inline-flex items-center gap-2">
              <span
                className="h-1.5 w-1.5 rounded-full"
                style={{ background: project.color }}
                aria-hidden
              />
              {project.type}
              <span className="text-muted/60" aria-hidden>
                ·
              </span>
              <span className="tabular-nums">{project.year}</span>
            </span>
          </Reveal>

          <h3 className="mt-6 font-display text-4xl font-normal tracking-tight sm:text-5xl">
            <MaskLine inView delay={0.1}>
              {project.title}
            </MaskLine>
          </h3>
          {project.context && (
            <Reveal delay={0.15} y={8}>
              <p className="mt-2 font-mono text-xs text-muted">{project.context}</p>
            </Reveal>
          )}

          <Reveal delay={0.2} y={16}>
            <Highlight text={project.highlight} color={project.color} />
          </Reveal>

          <Reveal delay={0.3} y={16}>
            <p className="mt-4 max-w-sm leading-relaxed text-muted xl:max-w-md">{project.description}</p>
          </Reveal>

          <ul className="mt-6 flex flex-wrap gap-2">
            {project.stack.map((tech, i) => (
              <motion.li
                key={tech}
                initial={{ opacity: 0, y: 10, scale: 0.9 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, ease, delay: 0.4 + i * 0.07 }}
                whileHover={{ y: -2 }}
                className="rounded-full border border-line px-2.5 py-1 font-mono text-[11px] text-muted transition-colors duration-300 hover:border-[var(--c)] hover:text-fg"
              >
                {tech}
              </motion.li>
            ))}
          </ul>

          <Reveal delay={0.5} y={10} className="mt-auto flex flex-wrap gap-x-6 gap-y-3 pt-8 text-sm">
            {links.length > 0 ? (
              links.map((link, i) =>
                i === 0 ? (
                  <a
                    key={link.label}
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="link-underline font-medium"
                  >
                    {link.label}
                    <ArrowUpRight
                      size={14}
                      style={{ color: project.color }}
                      className="transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                    />
                  </a>
                ) : (
                  <a
                    key={link.label}
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="link-underline text-muted transition-colors hover:text-fg"
                  >
                    {link.label}
                    <ArrowUpRight size={14} />
                  </a>
                )
              )
            ) : (
              <span className="inline-flex items-center gap-2 font-mono text-xs text-muted">
                <span className="relative flex h-1.5 w-1.5">
                  <span
                    className="absolute inline-flex h-full w-full animate-ping rounded-full opacity-60"
                    style={{ background: project.color }}
                  />
                  <span
                    className="relative inline-flex h-1.5 w-1.5 rounded-full"
                    style={{ background: project.color }}
                  />
                </span>
                {project.status ?? "In development"}
              </span>
            )}
          </Reveal>
        </div>

        <ProjectImage project={project} />
      </div>
    </article>
  );
}

export default function Projects() {
  const ref = useRef<HTMLDivElement>(null);
  // The big heading slides sideways as it passes through the viewport
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const headingX = useTransform(scrollYProgress, [0, 1], ["4%", "-8%"]);

  return (
    <section id="work" className="overflow-hidden py-16 sm:py-24">
      <div className="container-x">
        <div ref={ref} className="mb-10 flex items-end justify-between gap-6 sm:mb-14">
          <motion.h2
            style={{ x: headingX }}
            className="font-display text-[clamp(2.75rem,9vw,10rem)] font-normal leading-[0.9] tracking-tight"
          >
            <MaskLine inView>Selected</MaskLine>
            <MaskLine inView delay={0.1} className="text-muted">
              work<span className="text-accent">.</span>
            </MaskLine>
          </motion.h2>
          <Reveal delay={0.3} y={10} className="shrink-0 pb-2 text-right">
            <span className="label">Projects</span>
            <span className="mt-1 block font-mono text-3xl tabular-nums sm:text-4xl">
              {String(projects.length).padStart(2, "0")}
            </span>
          </Reveal>
        </div>

        <div>
          {projects.map((p, i) => (
            <ProjectRow key={p.title} project={p} index={i} />
          ))}
          <DrawLine />
        </div>
      </div>
    </section>
  );
}

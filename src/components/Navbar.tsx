import { useEffect, useState } from "react";
import {
  AnimatePresence,
  motion,
  useMotionValueEvent,
  useScroll,
} from "framer-motion";
import { Moon, Sun } from "lucide-react";
import { ease } from "./Reveal";

const navLinks = [
  { id: "work", label: "Work" },
  { id: "stack", label: "Stack" },
  { id: "contact", label: "Contact" },
];

function useTheme() {
  const [dark, setDark] = useState(() =>
    document.documentElement.classList.contains("dark")
  );
  const toggle = () => {
    const next = !dark;
    setDark(next);
    document.documentElement.classList.toggle("dark", next);
    try {
      localStorage.setItem("theme", next ? "dark" : "light");
    } catch {}
  };
  return { dark, toggle };
}

function useActiveSection(ids: string[]) {
  const [active, setActive] = useState<string | null>(null);
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => e.isIntersecting && setActive(e.target.id));
      },
      { rootMargin: "-45% 0px -50% 0px" }
    );
    ids.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, [ids]);
  return active;
}

/** True once the hero's name has shrunk into the navbar (or scrolled past it). */
function usePastHeroName() {
  const [past, setPast] = useState(false);
  useEffect(() => {
    const name = document.querySelector("[data-hero-name]");
    if (!name) return;
    const observer = new IntersectionObserver(
      ([e]) => setPast(!e.isIntersecting && e.boundingClientRect.top < 64),
      { rootMargin: "-64px 0px 0px 0px" }
    );
    observer.observe(name);
    return () => observer.disconnect();
  }, []);
  return past;
}

const ids = navLinks.map((l) => l.id);

export default function Navbar() {
  const { dark, toggle } = useTheme();
  const active = useActiveSection(ids);
  const showLogo = usePastHeroName();
  const { scrollY } = useScroll();
  const [hidden, setHidden] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  // Hide while scrolling down, reveal on the way back up. While the hero name
  // is shrinking into the logo the bar stays put and transparent, so the name
  // never slides under its blur, and it stays until the hero has scrolled away
  // so the logo that just arrived doesn't vanish right away.
  useMotionValueEvent(scrollY, "change", (y) => {
    const prev = scrollY.getPrevious() ?? 0;
    const heroHeight = document.getElementById("top")?.offsetHeight ?? 160;
    setHidden(showLogo && y > prev && y > heroHeight);
    setScrolled(y > 12);
  });
  // Combined at render time, so the bar turns solid as soon as the logo
  // arrives, even if scrolling had already stopped (e.g. after a jump link)
  const solid = showLogo && scrolled;

  return (
    <motion.header
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: hidden ? -80 : 0, opacity: 1 }}
      transition={{ duration: 0.5, ease }}
      className={`fixed inset-x-0 top-0 z-50 transition-[background-color,border-color] duration-300 ${
        solid
          ? "border-b border-line/70 bg-bg/75 backdrop-blur-md"
          : "border-b border-transparent"
      }`}
    >
      <nav className="container-x flex h-16 items-center justify-between">
        {/* Wordmark ending in the accent dot used by the section headings.
            Hidden while the hero shows the name; stays in the layout so the links don't shift. */}
        <motion.a
          href="#top"
          data-nav-logo
          aria-label="Ofek Amirav, back to top"
          aria-hidden={!showLogo}
          tabIndex={showLogo ? 0 : -1}
          initial={false}
          animate={showLogo ? { opacity: 1, y: 0 } : { opacity: 0, y: 8 }}
          transition={{ duration: 0.35, ease }}
          className={`group font-display text-xl font-normal tracking-tight ${showLogo ? "" : "pointer-events-none"}`}
        >
          ofek
          <span className="inline-block text-accent transition-transform duration-300 ease-out group-hover:-translate-y-1">
            .
          </span>
        </motion.a>

        <div className="flex items-center gap-1 sm:gap-2">
          {navLinks.map((link) => (
            <a
              key={link.id}
              href={`#${link.id}`}
              className={`relative px-2.5 py-1.5 text-sm transition-colors sm:px-3 ${
                active === link.id ? "text-fg" : "text-muted hover:text-fg"
              }`}
            >
              {link.label}
              {active === link.id && (
                <motion.span
                  layoutId="nav-dot"
                  className="absolute -bottom-0.5 left-1/2 h-1 w-1 -translate-x-1/2 rounded-full bg-accent"
                  transition={{ type: "spring", stiffness: 380, damping: 30 }}
                />
              )}
            </a>
          ))}

          <button
            onClick={toggle}
            aria-label="Toggle theme"
            className="ml-1 grid h-9 w-9 place-items-center rounded-full text-muted transition-colors hover:bg-surface hover:text-fg"
          >
            <AnimatePresence mode="wait" initial={false}>
              <motion.span
                key={dark ? "sun" : "moon"}
                initial={{ rotate: -90, opacity: 0, scale: 0.6 }}
                animate={{ rotate: 0, opacity: 1, scale: 1 }}
                exit={{ rotate: 90, opacity: 0, scale: 0.6 }}
                transition={{ duration: 0.25 }}
              >
                {dark ? <Sun size={16} /> : <Moon size={16} />}
              </motion.span>
            </AnimatePresence>
          </button>
        </div>
      </nav>
    </motion.header>
  );
}

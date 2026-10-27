import { AnimatePresence, motion } from "framer-motion";
import { ArrowUpRight, Check, Copy } from "lucide-react";
import { useState } from "react";
import { MaskLine, Reveal } from "../components/Reveal";
import { links } from "../data/projects";

export default function Contact() {
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(links.email);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      window.location.href = `mailto:${links.email}`;
    }
  };

  return (
    <section id="contact" className="pb-10 pt-16 sm:pt-24">
      <div className="container-x">
        <div className="border-t border-line pt-16 sm:pt-24">
          <Reveal>
            <h2 className="label">Contact</h2>
          </Reveal>

          <p className="mt-8 text-[clamp(2.25rem,7vw,5rem)] font-medium leading-[1] tracking-tightest">
            <MaskLine inView>Let's build</MaskLine>
            <MaskLine inView delay={0.12} className="text-muted">
              something good<span className="text-accent">.</span>
            </MaskLine>
          </p>

          <Reveal delay={0.12} className="mt-12 flex flex-wrap items-center gap-4">
            <a
              href={`mailto:${links.email}`}
              className="link-underline text-lg font-medium sm:text-2xl"
            >
              {links.email}
            </a>
            <button
              onClick={copy}
              aria-label="Copy email address"
              className="grid h-9 w-9 place-items-center rounded-full border border-line text-muted transition-colors hover:border-fg/30 hover:text-fg"
            >
              <AnimatePresence mode="wait" initial={false}>
                <motion.span
                  key={copied ? "check" : "copy"}
                  initial={{ scale: 0.5, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.5, opacity: 0 }}
                  transition={{ duration: 0.15 }}
                >
                  {copied ? (
                    <Check size={14} className="text-accent" />
                  ) : (
                    <Copy size={14} />
                  )}
                </motion.span>
              </AnimatePresence>
            </button>
          </Reveal>
        </div>

        <footer className="mt-24 flex flex-col-reverse gap-4 border-t border-line pt-6 text-sm text-muted sm:flex-row sm:items-center sm:justify-between">
          <span className="font-mono text-xs">© {new Date().getFullYear()} Ofek Amirav · Tel Aviv</span>
          <div className="flex gap-6">
            {[
              ["GitHub", links.github],
              ["LinkedIn", links.linkedin],
            ].map(([label, href]) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className="link-underline transition-colors hover:text-fg"
              >
                {label}
                <ArrowUpRight size={13} />
              </a>
            ))}
          </div>
        </footer>
      </div>
    </section>
  );
}

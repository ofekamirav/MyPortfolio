import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, ArrowUpRight, Check, Loader2 } from "lucide-react";
import { useState, type ChangeEvent, type FormEvent } from "react";
import { MaskLine, Reveal, ease } from "../components/Reveal";
import { links } from "../data/projects";

type Status = "idle" | "sending" | "sent" | "error";

const empty = { name: "", email: "", message: "", "bot-field": "" };

const encode = (data: Record<string, string>) =>
  Object.entries(data)
    .map(([k, v]) => `${encodeURIComponent(k)}=${encodeURIComponent(v)}`)
    .join("&");

/** An input with a floating label and an underline that fills with the accent color on focus. */
function Field({
  name,
  label,
  type = "text",
  value,
  onChange,
  multiline,
  autoComplete,
}: {
  name: keyof typeof empty;
  label: string;
  type?: string;
  value: string;
  onChange: (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  multiline?: boolean;
  autoComplete?: string;
}) {
  const shared = {
    id: name,
    name,
    value,
    onChange,
    required: true,
    placeholder: " ",
    className:
      "peer block w-full resize-none border-0 border-b border-line bg-transparent px-0 pb-3 pt-7 text-lg text-fg outline-none transition-colors placeholder:text-transparent focus:ring-0",
  };

  return (
    <div className="group/field relative">
      {multiline ? (
        <textarea {...shared} rows={4} />
      ) : (
        <input {...shared} type={type} autoComplete={autoComplete} />
      )}
      <label
        htmlFor={name}
        className="pointer-events-none absolute left-0 top-7 origin-left text-lg text-muted transition-all duration-300 peer-focus:top-0 peer-focus:scale-75 peer-focus:font-mono peer-focus:text-fg peer-[:not(:placeholder-shown)]:top-0 peer-[:not(:placeholder-shown)]:scale-75 peer-[:not(:placeholder-shown)]:font-mono"
      >
        {label}
      </label>
      {/* Accent underline that grows from the left on focus */}
      <span
        aria-hidden
        className="absolute bottom-0 left-0 h-px w-full origin-left scale-x-0 bg-accent transition-transform duration-500 peer-focus:scale-x-100"
      />
    </div>
  );
}

export default function Contact() {
  const [form, setForm] = useState(empty);
  const [status, setStatus] = useState<Status>("idle");

  const onChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  // Submitted to Netlify Forms; public/assets/form.html is the static copy Netlify detects at build time
  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStatus("sending");
    try {
      const res = await fetch("/", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: encode({ "form-name": "contact", ...form }),
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      setStatus("sent");
      setForm(empty);
    } catch {
      setStatus("error");
    }
  };

  return (
    <section id="contact" className="pb-10 pt-16 sm:pt-24">
      <div className="container-x">
        <div className="grid gap-14 border-t border-line pt-16 sm:pt-24 md:grid-cols-12 md:gap-10">
          <div className="md:col-span-5">
            <Reveal>
              <h2 className="label">Contact</h2>
            </Reveal>

            <p className="mt-8 text-[clamp(2.25rem,5vw,5.5rem)] font-medium leading-[1] tracking-tightest">
              <MaskLine inView>Let's build</MaskLine>
              <MaskLine inView delay={0.12} className="text-muted">
                something good<span className="text-accent">.</span>
              </MaskLine>
            </p>

            <Reveal delay={0.2} y={12}>
              <p className="mt-8 max-w-xs leading-relaxed text-muted">
                Have a role, a project or an idea? Send a message and I'll get back to you
                within a day or two.
              </p>
            </Reveal>
          </div>

          <Reveal delay={0.15} y={20} className="md:col-span-6 md:col-start-7">
            <AnimatePresence mode="wait" initial={false}>
              {status === "sent" ? (
                <motion.div
                  key="sent"
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -16 }}
                  transition={{ duration: 0.5, ease }}
                  className="flex min-h-[22rem] flex-col items-start justify-center"
                  role="status"
                >
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 300, damping: 18, delay: 0.1 }}
                    className="grid h-12 w-12 place-items-center rounded-full bg-accent text-white"
                  >
                    <Check size={20} />
                  </motion.span>
                  <p className="mt-6 text-2xl font-medium tracking-tight">Message sent.</p>
                  <p className="mt-2 text-muted">Thanks for reaching out, I'll reply soon.</p>
                  <button
                    onClick={() => setStatus("idle")}
                    className="link-underline mt-8 text-sm text-muted transition-colors hover:text-fg"
                  >
                    Send another
                  </button>
                </motion.div>
              ) : (
                <motion.form
                  key="form"
                  name="contact"
                  method="POST"
                  data-netlify="true"
                  data-netlify-honeypot="bot-field"
                  onSubmit={onSubmit}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -16 }}
                  transition={{ duration: 0.5, ease }}
                  className="flex flex-col gap-8"
                >
                  <input type="hidden" name="form-name" value="contact" />
                  <p hidden>
                    <label>
                      Don't fill this out: <input name="bot-field" value={form["bot-field"]} onChange={onChange} />
                    </label>
                  </p>

                  <div className="grid gap-8 sm:grid-cols-2">
                    <Field name="name" label="Name" value={form.name} onChange={onChange} autoComplete="name" />
                    <Field
                      name="email"
                      label="Email"
                      type="email"
                      value={form.email}
                      onChange={onChange}
                      autoComplete="email"
                    />
                  </div>
                  <Field name="message" label="Message" value={form.message} onChange={onChange} multiline />

                  <div className="flex flex-wrap items-center justify-between gap-4">
                    <motion.button
                      type="submit"
                      disabled={status === "sending"}
                      whileTap={{ scale: 0.97 }}
                      className="group inline-flex h-12 items-center gap-2 rounded-full bg-fg px-6 text-sm font-medium text-bg transition-opacity disabled:opacity-60"
                    >
                      {status === "sending" ? (
                        <>
                          Sending
                          <Loader2 size={15} className="animate-spin" />
                        </>
                      ) : (
                        <>
                          Send message
                          <ArrowRight
                            size={15}
                            className="transition-transform duration-300 group-hover:translate-x-1"
                          />
                        </>
                      )}
                    </motion.button>

                    <AnimatePresence>
                      {status === "error" && (
                        <motion.p
                          initial={{ opacity: 0, y: 6 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0 }}
                          role="alert"
                          className="text-sm text-red-500"
                        >
                          Couldn't send. Email me at{" "}
                          <a href={`mailto:${links.email}`} className="underline">
                            {links.email}
                          </a>
                        </motion.p>
                      )}
                    </AnimatePresence>
                  </div>
                </motion.form>
              )}
            </AnimatePresence>
          </Reveal>
        </div>

        <footer className="mt-24 flex flex-col-reverse gap-4 border-t border-line pt-6 text-sm text-muted sm:flex-row sm:items-center sm:justify-between">
          <span className="font-mono text-xs">© {new Date().getFullYear()} Ofek Amirav</span>
          <div className="flex gap-6">
            {[
              ["Email", `mailto:${links.email}`],
              ["GitHub", links.github],
              ["LinkedIn", links.linkedin],
            ].map(([label, href]) => (
              <a
                key={label}
                href={href}
                target={href.startsWith("mailto:") ? undefined : "_blank"}
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

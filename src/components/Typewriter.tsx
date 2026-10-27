import { useEffect, useState } from "react";
import { useReducedMotion } from "framer-motion";

type Props = {
  words: string[];
  startDelay?: number;
  typeSpeed?: number;
  deleteSpeed?: number;
  pause?: number;
  className?: string;
};

/** Types each word, pauses, deletes it, and moves on to the next one. */
export default function Typewriter({
  words,
  startDelay = 900,
  typeSpeed = 70,
  deleteSpeed = 35,
  pause = 1700,
  className = "",
}: Props) {
  const reduce = useReducedMotion();
  const [wordIndex, setWordIndex] = useState(0);
  const [text, setText] = useState("");
  const [deleting, setDeleting] = useState(false);
  const [started, setStarted] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setStarted(true), startDelay);
    return () => clearTimeout(t);
  }, [startDelay]);

  useEffect(() => {
    if (!started || reduce) return;
    const word = words[wordIndex % words.length];

    let delay = deleting ? deleteSpeed : typeSpeed;
    if (!deleting && text === word) delay = pause;
    if (deleting && text === "") delay = 300;

    const t = setTimeout(() => {
      if (!deleting && text === word) return setDeleting(true);
      if (deleting && text === "") {
        setDeleting(false);
        setWordIndex((i) => i + 1);
        return;
      }
      setText(deleting ? word.slice(0, text.length - 1) : word.slice(0, text.length + 1));
    }, delay);
    return () => clearTimeout(t);
  }, [started, reduce, text, deleting, wordIndex, words, typeSpeed, deleteSpeed, pause]);

  const shown = reduce ? words[0] : text;

  return (
    <span className={className}>
      {/* Screen readers get the full list instead of letter-by-letter noise */}
      <span className="sr-only">{words.join(", ")}</span>
      <span aria-hidden>
        {shown}
        <span className="ml-[0.06em] inline-block h-[0.85em] w-[0.06em] translate-y-[0.08em] animate-caret bg-accent" />
      </span>
    </span>
  );
}

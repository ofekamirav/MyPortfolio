import { motion } from "framer-motion";

/**
 * Illustration for the AI Admin Assistant: a request flows into the agent,
 * out to its tools, back, and stops at a human approval step.
 * Drawn with theme tokens so it reads in light and dark.
 */
const C = "#8B5CF6";

type Node = { x: number; y: number; w: number; title: string; sub: string; accent?: boolean };

const nodes: Record<string, Node> = {
  request: { x: 30, y: 205, w: 200, title: "Admin request", sub: '"review disputes"' },
  agent: { x: 280, y: 205, w: 210, title: "LangGraph agent", sub: "plan · call tools", accent: true },
  tools: { x: 550, y: 85, w: 220, title: "Tools", sub: "bookings · disputes" },
  approve: { x: 550, y: 325, w: 220, title: "Human approval", sub: "interrupt() · approve" },
};

const H = 90;
const mid = (n: Node) => ({ x: n.x + n.w / 2, y: n.y + H / 2 });
const right = (n: Node) => ({ x: n.x + n.w, y: n.y + H / 2 });
const left = (n: Node) => ({ x: n.x, y: n.y + H / 2 });

const edges = [
  [right(nodes.request), left(nodes.agent)],
  [right(nodes.agent), left(nodes.tools)],
  [right(nodes.agent), left(nodes.approve)],
];

const path = ([a, b]: { x: number; y: number }[]) => {
  const dx = (b.x - a.x) / 2;
  return `M ${a.x} ${a.y} C ${a.x + dx} ${a.y}, ${b.x - dx} ${b.y}, ${b.x} ${b.y}`;
};

// The token travels: request → agent → tools → agent → approval
const r = right(nodes.request);
const al = left(nodes.agent);
const ar = right(nodes.agent);
const tl = left(nodes.tools);
const pl = left(nodes.approve);
const tokenX = [r.x, al.x, ar.x, tl.x, ar.x, pl.x, pl.x];
const tokenY = [r.y, al.y, ar.y, tl.y, ar.y, pl.y, pl.y];

export default function AgentFlow() {
  return (
    <div className="absolute inset-0 bg-surface">
      {/* faint dot grid */}
      <div
        aria-hidden
        className="absolute inset-0 opacity-60"
        style={{
          backgroundImage: "radial-gradient(rgb(var(--line)) 1px, transparent 1px)",
          backgroundSize: "18px 18px",
        }}
      />
      <svg viewBox="0 0 800 500" className="relative h-full w-full" role="img" aria-label="Agent flow: request, agent, tools, human approval">
        {edges.map((e, i) => (
          <motion.path
            key={i}
            d={path(e)}
            fill="none"
            stroke="rgb(var(--muted))"
            strokeOpacity={0.5}
            strokeWidth={1.5}
            strokeDasharray="4 5"
            initial={{ pathLength: 0 }}
            whileInView={{ pathLength: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1, delay: 0.4 + i * 0.25 }}
          />
        ))}

        {Object.values(nodes).map((n, i) => (
          <motion.g
            key={n.title}
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 + i * 0.15 }}
          >
            <rect
              x={n.x}
              y={n.y}
              width={n.w}
              height={H}
              rx={14}
              fill="rgb(var(--bg))"
              stroke={n.accent ? C : "rgb(var(--line))"}
              strokeWidth={n.accent ? 2 : 1.5}
            />
            <circle cx={n.x + 22} cy={n.y + 32} r={5} fill={n.accent ? C : "rgb(var(--muted))"} />
            <text x={n.x + 36} y={n.y + 38} fontSize={20} fontWeight={500} fill="rgb(var(--fg))" fontFamily="Geist, sans-serif">
              {n.title}
            </text>
            <text x={n.x + 22} y={n.y + 68} fontSize={14} fill="rgb(var(--muted))" fontFamily="'Geist Mono', monospace">
              {n.sub}
            </text>
          </motion.g>
        ))}

        {/* travelling token */}
        <motion.circle
          r={7}
          fill={C}
          animate={{ cx: tokenX, cy: tokenY, opacity: [0, 1, 1, 1, 1, 1, 0] }}
          transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", repeatDelay: 0.6 }}
        />

        {/* approval pulse */}
        <motion.rect
          x={nodes.approve.x}
          y={nodes.approve.y}
          width={nodes.approve.w}
          height={H}
          rx={14}
          fill="none"
          stroke={C}
          strokeWidth={2}
          animate={{ opacity: [0, 0, 1, 0] }}
          transition={{ duration: 5.6, repeat: Infinity, times: [0, 0.82, 0.9, 1] }}
        />

        {/* eval badge */}
        <g>
          <rect x={30} y={430} width={210} height={40} rx={20} fill="rgb(var(--bg))" stroke="rgb(var(--line))" />
          <circle cx={52} cy={450} r={5} fill="#22C55E" />
          <text x={66} y={455} fontSize={14} fill="rgb(var(--fg))" fontFamily="'Geist Mono', monospace">
            96 eval scenarios
          </text>
        </g>
        <text x={30} y={50} fontSize={14} fill="rgb(var(--muted))" fontFamily="'Geist Mono', monospace" letterSpacing="1.5">
          QUIVERSYNC · BACK-OFFICE
        </text>
      </svg>
    </div>
  );
}

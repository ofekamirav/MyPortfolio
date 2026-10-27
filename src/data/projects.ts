const asset = (file: string) => `${import.meta.env.BASE_URL}assets/${file}`;

export type Project = {
  title: string;
  /** Short context shown under the title, e.g. where the project lives */
  context?: string;
  description: string;
  /** The one thing a reader should remember. Shown in bold next to the project's color. */
  highlight: string;
  /** Brand color of the project, used for its number, rail, pill and hover glow */
  color: string;
  /** A screenshot, or "agent" for the animated agent-flow illustration */
  image: string | "agent";
  /** CSS object-position, to keep the important part of the cover in frame */
  imagePosition?: string;
  stack: string[];
  demoUrl?: string;
  websiteUrl?: string;
  playStoreUrl?: string;
  appStoreUrl?: string;
  codeUrl?: string;
  /** Shown instead of links when there is nothing public to open */
  status?: string;
  type: string;
  /** When the project was built, so older tech reads in context */
  year: string;
};

export const projects: Project[] = [
  {
    title: "QuiverSync",
    context: "Product venture",
    description:
      "A surfboard rental marketplace. I work across the mobile apps, backend integrations and release process, plus an internal back-office for bookings, disputes and transactions.",
    highlight: "Live on Google Play and the App Store, from one Kotlin Multiplatform codebase",
    color: "#007A86",
    // The promo banner extended to the card's shape, so neither the headline nor the phone is cut
    image: asset("QuiverSync-card.png"),
    stack: ["Kotlin Multiplatform", "Compose", "SwiftUI", "Firestore", "Next.js"],
    websiteUrl: "https://quiversync.app",
    playStoreUrl: "https://play.google.com/store/apps/details?id=com.quiversync.app",
    appStoreUrl: "https://apps.apple.com/app/id6762154301",
    type: "Multiplatform",
    year: "2025–now",
  },
  {
    title: "Mumlatz",
    context: "Live product",
    description:
      "Checks whether ChatGPT, Gemini, Perplexity, Claude and Google AI Overviews recommend a local Israeli business, shows who they recommend instead, and writes the fixes that improve its odds.",
    highlight:
      "Answers from five AI engines, grounded and scored by a queue-based worker pipeline",
    color: "#0F6E5C",
    image: asset("mumlatz.png"),
    imagePosition: "center top",
    stack: ["Next.js", "TypeScript", "Supabase", "BullMQ", "LLM APIs"],
    websiteUrl: "https://mumlatz.com",
    type: "AI · Web",
    year: "2026",
  },
  {
    title: "AI Admin Assistant",
    context: "QuiverSync back-office",
    description:
      "An agent that pulls bookings, transactions, disputes and failure signals into structured workflows, with per-turn tracking of latency, tool failures, tokens and cost.",
    highlight:
      "Human-in-the-loop approvals with LangGraph interrupts, tested by a 96-scenario eval suite",
    color: "#8B5CF6",
    image: "agent",
    stack: ["LangGraph", "Python", "Tool Calling", "Agent Evals"],
    status: "Internal tool",
    type: "AI Agent",
    year: "2026",
  },
  {
    title: "RooMatch",
    description:
      "Finds apartments and roommates that actually fit. Recommendations adapt to your preferences and interactions.",
    highlight: "Personal match score for every apartment and roommate",
    color: "#14B8A6",
    image: asset("RooMatch-portfoilo.png"),
    stack: ["Kotlin", "Jetpack Compose", "Ktor", "MongoDB"],
    demoUrl: "https://www.youtube.com/watch?v=kSwQQ943zFM",
    codeUrl: "https://github.com/ofekamirav/RooMatchApp",
    type: "Android",
    year: "2025",
  },
  {
    title: "Chargehood",
    description:
      "An Android app for finding and managing private EV charging stations, built with MVVM and Firebase.",
    highlight: "Turns private home chargers into stations anyone nearby can use",
    color: "#F5B301",
    image: asset("chargehood.png"),
    stack: ["Kotlin", "Firebase", "MVVM", "Room"],
    demoUrl: "https://youtube.com/shorts/DOYsdSXpadM?feature=share",
    codeUrl: "https://github.com/ofekamirav/ChargehoodApp",
    type: "Android",
    year: "2025",
  },
];

/** Top row of the skills band */
export const skills = [
  "Android",
  "iOS",
  "Kotlin",
  "Python",
  "TypeScript",
  "Kotlin Multiplatform",
  "Jetpack Compose",
  "SwiftUI",
  "Next.js",
  "FastAPI",
  "Node.js",
  "Firebase",
  "Redis",
  "PostgreSQL",
  "Docker",
];

/** Bottom row of the skills band */
export const aiSkills = [
  "LangGraph",
  "LangChain",
  "State Management",
  "RAG",
  "MCP",
  "Tool Calling",
  "Structured Outputs",
  "Agent Evaluation",
  "Guardrails",
  "Prompt Engineering",
];

/**
 * Image for the hero's dot field. Leave null to draw the "o." mark.
 * For a portrait: a square, black-and-white PNG of about 800px, e.g.
 * asset("portrait.png"). Dark pixels become dots, larger where darker.
 * Best with a transparent background (cut out): then every point on the
 * person gets a dot, so light skin doesn't vanish. A plain white background
 * also works, but the lightest areas drop out.
 */
export const heroPortrait: string | null = asset("portrait.png");

export const links = {
  email: "ofek.amirav@gmail.com",
  github: "https://github.com/ofekamirav",
  linkedin: "https://www.linkedin.com/in/ofek-amirav",
};

export interface Project {
  id: string;
  title: string;
  description: string;
  tags?: string[];
  stack?: string[];
  details?: string;
  architecture?: string;
  links?: {
    github?: string;
    demo?: string;
    docs?: string;
  };
}
export const projects: Project[] = [
  {
    id: "chat-lines",
    title: "Chat Lines",
    description:
      "Explore local AI conversations as connected 3D semantic paths.",
    tags: ["Visualization", "Local-first", "AI"],
    stack: ["TypeScript", "React", "Three.js"],
    details:
      "A local viewer for Codex, Pi, and Pu.sh conversations. Messages and tool calls become nodes in a 3D path, with alternate views for exploring semantic relationships.",
    architecture:
      "Runs embeddings through a local Ollama or LM Studio runtime; transcript text and vectors stay in browser memory for the session.",
  },
  {
    id: "vitest-adaptive",
    title: "Vitest Adaptive",
    description:
      "Speed up local test iterations by selecting tests that cover changed code.",
    tags: ["Testing", "Developer tools"],
    stack: ["TypeScript", "Vitest"],
    details:
      "Records per-test coverage, maps a branch diff to affected source lines, and ranks tests that exercised those lines.",
    architecture:
      "Coverage-based selection gives faster feedback during development; run the full suite for broader confidence.",
  },
  {
    id: "tendryl",
    title: "Tendryl",
    description:
      "A workflow orchestrator with chainable async interfaces, ledger integration for operation tracking, and race-condition detection.",
    tags: ["Workflow", "Developer tools"],
    stack: ["TypeScript"],
    details:
      "Tendryl provides chainable workflow steps, operation ledgers, structured logging, and conflict detection.",
    architecture: "Composable async workflows with optional ledger tracking.",
    links: {
      github: "https://github.com/nivoset/tendryl",
    },
  },
  {
    id: "mimicry",
    title: "Mimicry",
    description:
      "AI-powered browser testing that turns plain-language tests into Playwright actions and can repair them when applications change.",
    tags: ["Testing", "AI", "Developer tools"],
    stack: ["TypeScript", "Node.js", "Playwright"],
    details:
      "Mimicry interprets natural-language test instructions, selects page elements, records successful behavior, and can adapt the test after a failure. It tracks token use and supports OpenAI-compatible providers.",
    architecture:
      "Built on Playwright with AI-assisted interpretation and test repair.",
    links: {
      github: "https://github.com/nivoset/mimicry",
    },
  },
];

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

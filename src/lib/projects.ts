export interface Project {
	id: string;
	title: string;
	description: string;
	tags: string[];
	stack: string[];
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
		id: 'testique',
		title: 'Testique',
		description: 'A testing framework and tooling suite for modern development workflows.',
		tags: ['#DevTools', '#Testing'],
		stack: ['TypeScript', 'Node.js'],
		details: 'Testique provides a comprehensive testing framework with advanced mocking capabilities, parallel test execution, and detailed reporting.',
		architecture: 'Modular architecture with plugin system for extensibility.',
		links: {
			github: 'https://github.com/nivoset/testique',
		},
	},
	{
		id: 'tendryl',
		title: 'Tendryl',
		description: 'Workflow orchestration and pipeline management system.',
		tags: ['#Workflow', '#DevTools'],
		stack: ['TypeScript', 'YAML'],
		details: 'Tendryl enables complex workflow definitions with dependency management, parallel execution, and error handling.',
		architecture: 'Graph-based execution engine with dependency resolution.',
		links: {
			github: 'https://github.com/nivoset/tendryl',
		},
	},
	{
		id: 'mcp-server',
		title: 'MCP Server Experiments',
		description: 'Model Context Protocol server implementations and experiments.',
		tags: ['#LLM', '#AI'],
		stack: ['TypeScript', 'Python'],
		details: 'Experiments with MCP protocol for LLM context management and tool integration.',
		architecture: 'Protocol-based server with plugin architecture.',
		links: {
			github: 'https://github.com/nivoset/mcp-experiments',
		},
	},
	{
		id: 'mimicry',
		title: 'Mimicry',
		description: 'AI-powered browser testing framework that converts Gherkin or plain language tests into executable code, with self-repair capabilities when tests break due to code changes.',
		tags: ['#Testing', '#AI', '#DevTools'],
		stack: ['TypeScript', 'Node.js', 'Playwright'],
		details: 'Mimicry takes your Gherkin or plain language test specifications and converts them into executable code to be run with Playwright. When application code changes and tests break, Mimicry can automatically repair them by reasoning through the failures and updating the test code accordingly. It uses AI language models to understand natural language test instructions, intelligently select elements based on semantic understanding, and adapt to changes in the application under test. Features include smart element selection, support for navigation, clicks, form updates, and multiple action types. Built-in token usage tracking helps monitor AI model call costs. Supports OpenAI, Ollama, and other compatible providers from the AI SDK.',
		architecture: 'Built on top of Playwright with AI model integration for natural language processing and test repair. Converts plain language or Gherkin syntax into executable Playwright test code, then monitors test execution to detect failures and automatically repair broken tests when application code changes.',
		links: {
			github: 'https://github.com/nivoset/mimicry',
		},
	},
];

export function getProjectsByTag(tag: string): Project[] {
	if (!tag || tag === 'all') {
		return projects;
	}
	return projects.filter(project => 
		project.tags.some(t => t.toLowerCase().includes(tag.toLowerCase()))
	);
}

export function getProjectById(id: string): Project | undefined {
	return projects.find(p => p.id === id);
}


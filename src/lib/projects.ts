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
		id: 'tinytask',
		title: 'TinyTask-like ASync Interface',
		description: 'Async task management interface inspired by TinyTask, built for modern web applications.',
		tags: ['#DevTools', '#Workflow'],
		stack: ['TypeScript', 'React'],
		details: 'A lightweight task queue and execution system with a clean async interface for managing background tasks.',
		architecture: 'Event-driven architecture with promise-based API.',
		links: {
			github: 'https://github.com/nivoset/tinytask',
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


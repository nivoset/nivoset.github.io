/**
 * Terminal command definitions and handlers
 */

export interface Command {
	name: string;
	description: string;
	handler: (args: string[]) => string;
}

export const commands: Command[] = [
	{
		name: 'help',
		description: 'Show available commands',
		handler: () => {
			return `Available commands:
  help           - Show this help message
  list-projects  - List all projects
  show-union     - Show union organizing information
  show-games     - Show game experiments
  stretch-break  - Office-friendly workout sequence
  clear          - Clear the terminal
`;
		},
	},
	{
		name: 'list-projects',
		description: 'List all projects',
		handler: () => {
			return `Projects:
  - Testique: Testing framework and tooling suite
  - Tendryl: Workflow orchestration system
  - TinyTask: Async task management interface
  - MCP Server: Model Context Protocol experiments

Visit /systems for more details.`;
		},
	},
	{
		name: 'show-union',
		description: 'Show union organizing information',
		handler: () => {
			return `Union Organizing:
  Supporting workers in organizing for better conditions.
  Building solidarity and collective power.
  
  Visit /organizing for resources and information.
  
  Remember: An injury to one is an injury to all.`;
		},
	},
	{
		name: 'show-games',
		description: 'Show game experiments',
		handler: () => {
			return `Game Experiments:
  - Horror Game Concept
  - Pro-Union Co-op Board Game
  - Pixel Art Gallery
  - HTML/CSS D-pad Widget
  
  Visit /play for more details.`;
		},
	},
	{
		name: 'stretch-break',
		description: 'Office-friendly workout sequence',
		handler: () => {
			return `Stretch Break Sequence:
  
  1. Neck Rolls (5 each direction)
  2. Shoulder Shrugs (10 reps)
  3. Wrist Circles (10 each direction)
  4. Standing Forward Fold (hold 30 seconds)
  5. Seated Spinal Twist (hold 20 seconds each side)
  6. Leg Raises (10 each leg)
  7. Deep Breathing (5 breaths)
  
  Take care of your body!`;
		},
	},
	{
		name: 'clear',
		description: 'Clear the terminal',
		handler: () => {
			return 'CLEAR';
		},
	},
];

export function executeCommand(input: string): string {
	const parts = input.trim().split(/\s+/);
	const commandName = parts[0].toLowerCase();
	const args = parts.slice(1);
	
	const command = commands.find(cmd => cmd.name === commandName);
	
	if (!command) {
		return `Command not found: ${commandName}. Type 'help' for available commands.`;
	}
	
	return command.handler(args);
}


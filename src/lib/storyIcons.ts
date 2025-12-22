/**
 * Icon mapping for different story types
 */

export const storyIcons: Record<string, string> = {
	'coffee': '☕',
	'printer': '🖨️',
	'wifi': '📶',
	'meeting': '📅',
	'email': '📧',
	'reorg': '🌪️',
	'buzzword': '💼',
	'snack': '🍩',
	'default': '🌩️',
};

export function getIconForStory(story: string): string {
	const lowerStory = story.toLowerCase();
	
	if (lowerStory.includes('coffee')) return storyIcons.coffee;
	if (lowerStory.includes('printer')) return storyIcons.printer;
	if (lowerStory.includes('wifi') || lowerStory.includes('network')) return storyIcons.wifi;
	if (lowerStory.includes('meeting') || lowerStory.includes('conference')) return storyIcons.meeting;
	if (lowerStory.includes('email')) return storyIcons.email;
	if (lowerStory.includes('reorg') || lowerStory.includes('restructuring')) return storyIcons.reorg;
	if (lowerStory.includes('buzzword') || lowerStory.includes('synergy')) return storyIcons.buzzword;
	if (lowerStory.includes('snack') || lowerStory.includes('donut') || lowerStory.includes('pizza')) return storyIcons.snack;
	
	return storyIcons.default;
}


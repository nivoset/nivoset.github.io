import type { APIRoute } from 'astro';
import { generateStormStory } from '../../lib/stormGrammar';

export const GET: APIRoute = async () => {
	const story = generateStormStory();
	
	return new Response(JSON.stringify(story), {
		status: 200,
		headers: {
			'Content-Type': 'application/json',
		},
	});
};


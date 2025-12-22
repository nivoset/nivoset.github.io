/**
 * Tracery grammar for corporate weather stories
 */

export interface StormStory {
	story: string;
	icon: string;
	moodColor: string;
}

const officeDisasters = [
	'coffee machine breakdown',
	'printer jam epidemic',
	'WiFi outage',
	'conference room booking conflict',
	'email server hiccup',
];

const managerBuzzwords = [
	'synergy',
	'leverage',
	'circle back',
	'touch base',
	'low-hanging fruit',
	'paradigm shift',
	'think outside the box',
];

const snackOmens = [
	'donuts in the break room',
	'empty coffee pot',
	'mysterious leftover pizza',
	'expired yogurt',
	'healthy snack options',
];

const reorgTornadoes = [
	'reorganization announcement',
	'team restructuring',
	'new reporting structure',
	'strategic realignment',
	'organizational changes',
];

export function generateStormStory(): StormStory {
	const disaster = officeDisasters[Math.floor(Math.random() * officeDisasters.length)];
	const buzzword = managerBuzzwords[Math.floor(Math.random() * managerBuzzwords.length)];
	const snack = snackOmens[Math.floor(Math.random() * snackOmens.length)];
	const reorg = reorgTornadoes[Math.floor(Math.random() * reorgTornadoes.length)];
	
	const templates = [
		`Today's forecast: ${disaster} with a chance of ${buzzword}. Watch out for ${snack} in the break room.`,
		`Corporate weather update: ${reorg} approaching from the east. Expect ${buzzword} levels to rise throughout the day.`,
		`Weather advisory: ${disaster} detected. Managers advised to use ${buzzword} with caution. ${snack} may indicate incoming changes.`,
		`Extended forecast: ${reorg} expected this week. ${disaster} possible. ${buzzword} advisory in effect.`,
	];
	
	const story = templates[Math.floor(Math.random() * templates.length)];
	
	const icons = ['🌩️', '⛈️', '🌧️', '☁️', '🌪️', '⚡'];
	const icon = icons[Math.floor(Math.random() * icons.length)];
	
	const moodColors = ['#D7423C', '#4E8C82', '#8EAAC9', '#B39DFF', '#E3C46F'];
	const moodColor = moodColors[Math.floor(Math.random() * moodColors.length)];
	
	return { story, icon, moodColor };
}


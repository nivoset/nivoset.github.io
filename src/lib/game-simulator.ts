import {
	initGame,
	startMatch,
	executeAction,
	getBestCurrentHand,
	gameConfig,
	type GameState,
	type Action
} from './nomad-poker';

// Optimal player strategy: always try to be on the best hand
export function getOptimalAction(state: GameState): Action | null {
	if (state.gameOver) return null;
	
	const bestColumn = getBestCurrentHand(state);
	
	// If we don't know the best column yet (no cards revealed), stay
	if (bestColumn === -1) {
		// Check if we can afford to stay (double pot)
		const halfPot = Math.ceil(state.pot / 2);
		if (state.credits >= halfPot) {
			return 'stay';
		}
		// If we can't afford to stay, try to move if we can afford it
		if (state.credits >= gameConfig.moveCost) {
			// Randomly choose left or right if both available
			if (state.currentColumn > 0 && state.currentColumn < 4) {
				return Math.random() < 0.5 ? 'left' : 'right';
			}
			if (state.currentColumn > 0) return 'left';
			if (state.currentColumn < 4) return 'right';
		}
		return null; // Can't do anything
	}
	
	// We know the best column, try to move to it
	if (state.currentColumn < bestColumn) {
		// Need to move right
		if (state.credits >= gameConfig.moveCost) {
			return 'right';
		}
		// Can't afford to move, try to stay if affordable
		const halfPot = Math.ceil(state.pot / 2);
		if (state.credits >= halfPot) {
			return 'stay';
		}
		return null;
	} else if (state.currentColumn > bestColumn) {
		// Need to move left
		if (state.credits >= gameConfig.moveCost) {
			return 'left';
		}
		// Can't afford to move, try to stay if affordable
		const halfPot = Math.ceil(state.pot / 2);
		if (state.credits >= halfPot) {
			return 'stay';
		}
		return null;
	} else {
		// We're already on the best column, stay to double pot
		const halfPot = Math.ceil(state.pot / 2);
		if (state.credits >= halfPot) {
			return 'stay';
		}
		// Can't afford to stay, but we're on the best column so that's okay
		return null; // No action needed
	}
}

// Simulate a single match (returns null if can't afford buy-in)
// Optionally accepts a function to get actions (for ML model)
export function simulateMatch(
	state: GameState,
	getActionFn?: (state: GameState) => Action | null
): {
	won: boolean;
	finalState: GameState;
	actions: Action[];
} | null {
	// Start a new match
	const matchState = startMatch(state);
	if (!matchState) {
		return null; // Can't afford buy-in
	}
	
	let currentState = matchState;
	const matchActions: Action[] = [];
	
	// Use provided action function or default to optimal strategy
	const getAction = getActionFn || getOptimalAction;
	
	// Play the match
	while (!currentState.gameOver) {
		const action = getAction(currentState);
		if (!action) {
			// Can't make any action, game should end
			break;
		}
		
		matchActions.push(action);
		currentState = executeAction(currentState, action);
	}
	
	// Check if player won
	const won = currentState.winningColumn === currentState.currentColumn;
	
	return {
		won,
		finalState: currentState,
		actions: matchActions
	};
}

// Run a single game simulation (plays until out of credits)
export function simulateGame(): {
	matchesPlayed: number;
	finalCredits: number;
	wins: number;
	losses: number;
	actions: Action[][]; // Actions taken in each match
} {
	let state = initGame();
	let matchesPlayed = 0;
	let wins = 0;
	let losses = 0;
	const actions: Action[][] = [];
	
	while (true) {
		const matchResult = simulateMatch(state);
		if (!matchResult) {
			// Can't afford buy-in
			break;
		}
		
		state = matchResult.finalState;
		matchesPlayed++;
		actions.push(matchResult.actions);
		
		if (matchResult.won) {
			wins++;
		} else {
			losses++;
		}
	}
	
	return {
		matchesPlayed,
		finalCredits: state.credits,
		wins,
		losses,
		actions
	};
}

// Run multiple simulations and get statistics
export function runSimulations(count: number): {
	avgMatchesPlayed: number;
	avgFinalCredits: number;
	avgWins: number;
	avgLosses: number;
	winRate: number;
	minMatches: number;
	maxMatches: number;
	minCredits: number;
	maxCredits: number;
} {
	let totalMatches = 0;
	let totalCredits = 0;
	let totalWins = 0;
	let totalLosses = 0;
	let minMatches = Infinity;
	let maxMatches = 0;
	let minCredits = Infinity;
	let maxCredits = 0;
	
	for (let i = 0; i < count; i++) {
		const result = simulateGame();
		totalMatches += result.matchesPlayed;
		totalCredits += result.finalCredits;
		totalWins += result.wins;
		totalLosses += result.losses;
		
		if (result.matchesPlayed < minMatches) minMatches = result.matchesPlayed;
		if (result.matchesPlayed > maxMatches) maxMatches = result.matchesPlayed;
		if (result.finalCredits < minCredits) minCredits = result.finalCredits;
		if (result.finalCredits > maxCredits) maxCredits = result.finalCredits;
	}
	
	return {
		avgMatchesPlayed: totalMatches / count,
		avgFinalCredits: totalCredits / count,
		avgWins: totalWins / count,
		avgLosses: totalLosses / count,
		winRate: totalWins / (totalWins + totalLosses),
		minMatches,
		maxMatches,
		minCredits,
		maxCredits
	};
}


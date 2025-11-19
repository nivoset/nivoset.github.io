import { evaluateHand, type Card, type HandEvaluation } from './poker';

// Game configuration
export const gameConfig = {
	initialCredits: 100,
	buyInCost: 10,
	moveCost: 5,
	stayMultiplier: 2 // Doubles the pot
};

// Game state
export type GameState = {
	grid: Card[][]; // 5x5 grid: grid[column][row]
	currentColumn: number; // 0-4
	currentRound: number; // 0-4 (5 rounds total)
	revealedRows: number; // How many rows are revealed
	gameOver: boolean;
	winningColumn: number; // Column index of the winning hand (-1 if game not over)
	credits: number;
	pot: number;
};

// Action type
export type Action = 'left' | 'right' | 'stay';

// Create a standard 52-card deck
function createDeck(): Card[] {
	const suits: Card['suit'][] = ['hearts', 'diamonds', 'clubs', 'spades'];
	const ranks = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'];
	const deck: Card[] = [];
	
	for (const suit of suits) {
		for (const rank of ranks) {
			deck.push({ suit, rank });
		}
	}
	
	return deck;
}

// Shuffle deck using Fisher-Yates algorithm
function shuffleDeck(deck: Card[]): Card[] {
	const shuffled = [...deck];
	for (let i = shuffled.length - 1; i > 0; i--) {
		const j = Math.floor(Math.random() * (i + 1));
		[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
	}
	return shuffled;
}

// Deal cards into 5x5 grid (5 columns, 5 rows)
function dealCards(): Card[][] {
	const deck = shuffleDeck(createDeck());
	const grid: Card[][] = [[], [], [], [], []]; // 5 columns
	
	// Deal row by row: first card to each column, then second card to each column, etc.
	for (let row = 0; row < 5; row++) {
		for (let col = 0; col < 5; col++) {
			grid[col][row] = deck[row * 5 + col];
		}
	}
	
	return grid;
}

// Initialize a new game
export function initGame(): GameState {
	return {
		grid: dealCards(),
		currentColumn: 2, // Start in middle
		currentRound: 0,
		revealedRows: 0,
		gameOver: false,
		winningColumn: -1,
		credits: gameConfig.initialCredits,
		pot: 0
	};
}

// Start a new match (deduct buy-in and add to pot)
export function startMatch(state: GameState): GameState | null {
	if (state.credits < gameConfig.buyInCost) {
		return null; // Can't afford buy-in
	}
	
	return {
		...state,
		credits: state.credits - gameConfig.buyInCost,
		pot: gameConfig.buyInCost, // Buy-in goes into the pot
		grid: dealCards(),
		currentColumn: 2,
		currentRound: 0,
		revealedRows: 0,
		gameOver: false,
		winningColumn: -1
	};
}

// Execute an action
export function executeAction(state: GameState, action: Action): GameState {
	if (state.gameOver) return state;
	
	const newState = { ...state };
	
	// Handle credit costs and pot updates
	if (action === 'left' || action === 'right') {
		// Moving left or right costs 5 credits and adds 5 to pot
		if (newState.credits < gameConfig.moveCost) {
			return state; // Can't afford the move
		}
		
		// Check if move is valid
		if (action === 'left' && newState.currentColumn === 0) {
			return state; // Can't move left
		}
		if (action === 'right' && newState.currentColumn === 4) {
			return state; // Can't move right
		}
		
		newState.credits -= gameConfig.moveCost;
		newState.pot += gameConfig.moveCost;
		
		// Move marker
		if (action === 'left') {
			newState.currentColumn--;
		} else {
			newState.currentColumn++;
		}
	} else if (action === 'stay') {
		// Staying doubles the pot (player pays half, dealer matches half)
		const halfPot = Math.ceil(newState.pot / 2);
		if (newState.credits < halfPot) {
			return state; // Can't afford to double
		}
		newState.credits -= halfPot;
		newState.pot = newState.pot * gameConfig.stayMultiplier;
	}
	
	// Reveal next row
	newState.revealedRows++;
	newState.currentRound++;
	
	// Check if game is over
	if (newState.currentRound >= 5) {
		return endGame(newState);
	}
	
	return newState;
}

// End game and evaluate hands
function endGame(state: GameState): GameState {
	const newState = { ...state, gameOver: true };
	
	// Evaluate all 5 hands
	const handEvaluations = newState.grid.map((hand, col) => {
		const evaluation = evaluateHand(hand);
		return { column: col, ...evaluation };
	});
	
	// Find the highest hand
	const highestHand = handEvaluations.reduce((best, current) => {
		return current.value > best.value ? current : best;
	});
	
	// Store winning column
	newState.winningColumn = highestHand.column;
	
	// Check if player won
	const playerWon = highestHand.column === newState.currentColumn;
	
	// Handle payout
	if (playerWon) {
		// Player wins: add entire pot to credits
		newState.credits += newState.pot;
	}
	// If player loses: pot is already lost (credits already deducted when adding to pot)
	
	return newState;
}

// Get the best current hand based on revealed cards
export function getBestCurrentHand(state: GameState): number {
	if (state.revealedRows === 0) {
		return -1; // No cards revealed yet
	}
	
	let bestColumn = -1;
	let bestValue = -1;
	
	for (let col = 0; col < 5; col++) {
		// Get revealed cards for this column
		const revealedCards = state.grid[col].slice(0, state.revealedRows);
		
		if (revealedCards.length > 0) {
			// Evaluate the partial hand
			const evaluation = evaluateHand(revealedCards);
			if (evaluation.value > bestValue) {
				bestValue = evaluation.value;
				bestColumn = col;
			}
		}
	}
	
	return bestColumn;
}

// Get hand evaluation for a specific column
export function getHandEvaluation(state: GameState, column: number): HandEvaluation | null {
	if (column < 0 || column >= 5) return null;
	const hand = state.grid[column];
	if (!hand || hand.length === 0) return null;
	return evaluateHand(hand);
}

// Check if an action is valid
export function canExecuteAction(state: GameState, action: Action): boolean {
	if (state.gameOver) return false;
	
	if (action === 'left') {
		return state.currentColumn > 0 && state.credits >= gameConfig.moveCost;
	} else if (action === 'right') {
		return state.currentColumn < 4 && state.credits >= gameConfig.moveCost;
	} else if (action === 'stay') {
		const halfPot = Math.ceil(state.pot / 2);
		return state.credits >= halfPot;
	}
	
	return false;
}


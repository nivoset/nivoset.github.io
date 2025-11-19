import { initGame, type GameState, type Action } from './nomad-poker';
import { simulateMatch } from './game-simulator';
import { getBestCurrentHand, getHandEvaluation } from './nomad-poker';
import { evaluateHand } from './poker';
import * as readline from 'readline';
import * as fs from 'fs';
import * as path from 'path';
// Use pure JS version for now (no native bindings required)
// Can switch to @tensorflow/tfjs-node-gpu later for CUDA support
import * as tf from '@tensorflow/tfjs';

interface MatchResult {
	won: boolean;
	credits: number;
}

interface Generation {
	matches: number;
	peakCredits: number;
	wins: number;
	losses: number;
}

interface SaveData {
	totalMatches: number;
	totalWins: number;
	recentMatches: MatchResult[];
	generations: Generation[];
	lastSavedGeneration: number;
	bestScore: {
		peakCredits: number;
		matchesBeforeOut: number;
		generation: number;
	};
	bestWeights: any | null; // Neural network weights from best generation
	recentWeights: any | null; // Neural network weights from most recent generation
}

const SAVE_FILE = path.join(process.cwd(), 'simulation-save.json');
const WEIGHTS_DIR = path.join(process.cwd(), 'weights');

// Load save data if it exists
function loadSaveData(): SaveData | null {
	try {
		if (fs.existsSync(SAVE_FILE)) {
			const data = fs.readFileSync(SAVE_FILE, 'utf-8');
			return JSON.parse(data) as SaveData;
		}
	} catch (error) {
		console.error('Error loading save data:', error);
	}
	return null;
}

// Save weights to file
function saveWeights(weights: any, filename: string) {
	try {
		// Ensure weights directory exists
		if (!fs.existsSync(WEIGHTS_DIR)) {
			fs.mkdirSync(WEIGHTS_DIR, { recursive: true });
		}
		
		const weightsPath = path.join(WEIGHTS_DIR, filename);
		// Save weights as JSON (TensorFlow.js weights are serializable)
		fs.writeFileSync(weightsPath, JSON.stringify(weights, null, 2), 'utf-8');
	} catch (error) {
		console.error(`Error saving weights to ${filename}:`, error);
	}
}

// Load weights from file
function loadWeights(filename: string): any | null {
	try {
		const weightsPath = path.join(WEIGHTS_DIR, filename);
		if (fs.existsSync(weightsPath)) {
			const data = fs.readFileSync(weightsPath, 'utf-8');
			return JSON.parse(data);
		}
	} catch (error) {
		console.error(`Error loading weights from ${filename}:`, error);
	}
	return null;
}

// Save progress to file
function saveProgress(
	totalMatches: number,
	totalWins: number,
	recentMatches: MatchResult[],
	generations: Generation[],
	lastSavedGeneration: number,
	bestScore: { peakCredits: number; matchesBeforeOut: number; generation: number },
	bestWeights: any | null,
	recentWeights: any | null
) {
	try {
		// Save weights to separate files
		if (bestWeights !== null) {
			saveWeights(bestWeights, `best-weights-gen-${bestScore.generation}.json`);
		}
		if (recentWeights !== null) {
			saveWeights(recentWeights, `recent-weights-gen-${lastSavedGeneration}.json`);
		}
		
		const saveData: SaveData = {
			totalMatches,
			totalWins,
			recentMatches,
			generations,
			lastSavedGeneration,
			bestScore,
			bestWeights: bestWeights !== null ? `best-weights-gen-${bestScore.generation}.json` : null,
			recentWeights: recentWeights !== null ? `recent-weights-gen-${lastSavedGeneration}.json` : null
		};
		fs.writeFileSync(SAVE_FILE, JSON.stringify(saveData, null, 2), 'utf-8');
		console.log(`\n[Saved progress at generation ${lastSavedGeneration}]`);
		if (bestWeights !== null) {
			console.log(`[Saved best weights from generation ${bestScore.generation}]`);
		}
		if (recentWeights !== null) {
			console.log(`[Saved recent weights from generation ${lastSavedGeneration}]`);
		}
	} catch (error) {
		console.error('Error saving progress:', error);
	}
}

// Neural network model for decision making
let model: tf.Sequential | null = null;

// Convert game state to feature vector for neural network input
function stateToFeatures(state: GameState): number[] {
	const features: number[] = [];
	
	// Basic state features (normalized)
	features.push(state.currentColumn / 4); // 0-1
	features.push(state.currentRound / 4); // 0-1
	features.push(state.revealedRows / 5); // 0-1
	features.push(Math.min(state.credits / 1000, 1)); // Normalized credits (cap at 1000)
	features.push(Math.min(state.pot / 500, 1)); // Normalized pot (cap at 500)
	
	// Best column index (normalized, -1 becomes 0)
	const bestColumn = getBestCurrentHand(state);
	features.push((bestColumn + 1) / 5); // -1 to 4 becomes 0 to 1
	
	// Hand evaluations for each column (if revealed)
	for (let col = 0; col < 5; col++) {
		if (state.revealedRows > 0) {
			const columnCards = state.grid[col].slice(0, state.revealedRows);
			if (columnCards.length >= 2) {
				const evaluation = evaluateHand(columnCards);
				// Convert hand type to numeric value (0-9 for different hand types)
				const handTypeValue = evaluation?.type === 'high-card' ? 0 :
					evaluation?.type === 'pair' ? 1 :
					evaluation?.type === 'two-pair' ? 2 :
					evaluation?.type === 'three-of-a-kind' ? 3 :
					evaluation?.type === 'straight' ? 4 :
					evaluation?.type === 'flush' ? 5 :
					evaluation?.type === 'full-house' ? 6 :
					evaluation?.type === 'four-of-a-kind' ? 7 :
					evaluation?.type === 'straight-flush' ? 8 :
					evaluation?.type === 'royal-flush' ? 9 : 0;
				features.push(handTypeValue / 9); // Normalized 0-1
				// Add value (0-1) - normalized hand value
				features.push((evaluation?.value || 0) / 1000000);
			} else {
				features.push(0, 0); // No hand yet
			}
		} else {
			features.push(0, 0); // No cards revealed
		}
	}
	
	// Affordability features
	const moveCost = 5; // gameConfig.moveCost
	const stayCost = Math.ceil(state.pot / 2);
	features.push(state.credits >= moveCost ? 1 : 0); // Can afford move
	features.push(state.credits >= stayCost ? 1 : 0); // Can afford stay
	features.push(state.currentColumn === 0 ? 1 : 0); // At left edge
	features.push(state.currentColumn === 4 ? 1 : 0); // At right edge
	
	return features;
}

// Create neural network model
function createModel(): tf.Sequential {
	const model = tf.sequential({
		layers: [
			// Input layer: 5 (basic) + 1 (best col) + 10 (hand evals) + 4 (affordability) = 20 features
			tf.layers.dense({
				inputShape: [20],
				units: 64,
				activation: 'relu',
				kernelInitializer: 'heNormal'
			}),
			tf.layers.dropout({ rate: 0.2 }),
			tf.layers.dense({
				units: 32,
				activation: 'relu',
				kernelInitializer: 'heNormal'
			}),
			tf.layers.dropout({ rate: 0.2 }),
			// Output layer: 3 actions (left, right, stay)
			tf.layers.dense({
				units: 3,
				activation: 'softmax',
				kernelInitializer: 'glorotUniform'
			})
		]
	});
	
	model.compile({
		optimizer: tf.train.adam(0.001),
		loss: 'categoricalCrossentropy',
		metrics: ['accuracy']
	});
	
	return model;
}

// Initialize model (create new or load weights)
function initializeModel(weights: any | null = null): void {
	if (model) {
		model.dispose();
	}
	
	model = createModel();
	
	if (weights !== null) {
		try {
			// Convert loaded weights to TensorFlow format
			const weightTensors = weights.map((w: any) => 
				tf.tensor(w.data, w.shape)
			);
			model.setWeights(weightTensors);
			console.log('[Initialized model with loaded weights]');
		} catch (error) {
			console.error('[Error loading weights, using random initialization]:', error);
		}
	} else {
		console.log('[Initialized new model with random weights]');
	}
}

// Get current neural network weights
function getCurrentWeights(): any | null {
	if (!model) return null;
	
	try {
		const weights = model.getWeights();
		// Convert TensorFlow tensors to serializable format
		return weights.map(w => ({
			data: Array.from(w.dataSync()),
			shape: w.shape
		}));
	} catch (error) {
		console.error('[Error getting weights]:', error);
		return null;
	}
}

// Initialize model with weights
function initializeModelWithWeights(weights: any | null): void {
	if (weights !== null) {
		initializeModel(weights);
		console.log('[Initialized model with best weights from previous run]');
	} else {
		initializeModel(); // Initialize with random weights
	}
}

// Get action from ML model
export function getMLAction(state: GameState): Action | null {
	if (!model || state.gameOver) return null;
	
	try {
		// Convert state to features
		const features = stateToFeatures(state);
		const featureTensor = tf.tensor2d([features]);
		
		// Get prediction from model
		const prediction = model.predict(featureTensor) as tf.Tensor;
		const probabilities = Array.from(prediction.dataSync());
		
		// Clean up tensors
		featureTensor.dispose();
		prediction.dispose();
		
		// Map probabilities to actions: [left, right, stay]
		const actions: Action[] = ['left', 'right', 'stay'];
		
		// Filter out invalid actions based on affordability and position
		const validActions: { action: Action; prob: number }[] = [];
		for (let i = 0; i < actions.length; i++) {
			const action = actions[i];
			// Check if action is valid
			if (action === 'left' && state.currentColumn > 0 && state.credits >= 5) {
				validActions.push({ action, prob: probabilities[i] });
			} else if (action === 'right' && state.currentColumn < 4 && state.credits >= 5) {
				validActions.push({ action, prob: probabilities[i] });
			} else if (action === 'stay' && state.credits >= Math.ceil(state.pot / 2)) {
				validActions.push({ action, prob: probabilities[i] });
			}
		}
		
		// If no valid actions, return null
		if (validActions.length === 0) return null;
		
		// Select action based on probabilities (weighted random selection)
		const totalProb = validActions.reduce((sum, a) => sum + a.prob, 0);
		if (totalProb === 0) {
			// If all probabilities are 0, pick randomly
			return validActions[Math.floor(Math.random() * validActions.length)].action;
		}
		
		let random = Math.random() * totalProb;
		for (const { action, prob } of validActions) {
			random -= prob;
			if (random <= 0) {
				return action;
			}
		}
		
		// Fallback to first valid action
		return validActions[0].action;
	} catch (error) {
		console.error('[Error getting ML action]:', error);
		return null;
	}
}

// Continuous simulation runner
export async function runContinuousSimulation() {
	// Try to load saved data
	const savedData = loadSaveData();
	
	let totalMatches = savedData?.totalMatches || 0;
	let totalWins = savedData?.totalWins || 0;
	let currentGeneration = savedData?.generations.length || 0;
	let matchesInCurrentGeneration = 0;
	let peakCreditsInGeneration = 0;
	let winsInGeneration = 0;
	let lossesInGeneration = 0;
	const recentMatches: MatchResult[] = savedData?.recentMatches || [];
	const generations: Generation[] = savedData?.generations || [];
	let lastSavedGeneration = savedData?.lastSavedGeneration || 0;
	let bestScore = savedData?.bestScore || {
		peakCredits: 0,
		matchesBeforeOut: 0,
		generation: 0
	};
	
	// Load weights if they exist
	let bestWeights: any | null = null;
	let recentWeights: any | null = null;
	if (savedData?.bestWeights) {
		bestWeights = loadWeights(savedData.bestWeights);
		if (bestWeights) {
			console.log(`[Loaded best weights from generation ${savedData.bestScore.generation}]`);
		}
	}
	if (savedData?.recentWeights) {
		recentWeights = loadWeights(savedData.recentWeights);
	}
	
	// Initialize model with best weights (prioritize best over recent)
	// Best weights represent the best performing generation, so use those as base
	if (bestWeights !== null) {
		initializeModelWithWeights(bestWeights);
	} else if (recentWeights !== null) {
		// Fallback to recent weights if best weights don't exist
		initializeModelWithWeights(recentWeights);
		console.log('[Using recent weights as best weights were not available]');
	} else {
		// No saved weights, initialize new model
		initializeModel();
	}
	
	let state: GameState = initGame();
	peakCreditsInGeneration = state.credits;
	
	if (savedData) {
		console.log(`Loaded previous simulation: ${totalMatches} matches, ${currentGeneration} generations`);
		console.log(`Resuming from generation ${currentGeneration + 1}\n`);
	} else {
		console.log('Starting new continuous simulation...');
	}
	
	console.log('Press "q" + Enter to quit\n');
	console.log('Each generation ends after 10 matches or when credits run out');
	console.log('Progress saved every 1000 generations\n');
	
	// Set up stdin for reading input
	const rl = readline.createInterface({
		input: process.stdin,
		output: process.stdout
	});
	
	let shouldQuit = false;
	
	// Listen for 'q' to quit
	rl.on('line', (input: string) => {
		if (input.trim().toLowerCase() === 'q') {
			shouldQuit = true;
		}
	});
	
	// Function to start a new generation
	function startNewGeneration() {
		// Save current generation if it had matches
		if (matchesInCurrentGeneration > 0) {
			const generationData: Generation = {
				matches: matchesInCurrentGeneration,
				peakCredits: peakCreditsInGeneration,
				wins: winsInGeneration,
				losses: lossesInGeneration
			};
			
			generations.push(generationData);
			
			// Update best score - prioritize maximizing credits
			// Best score is determined by peak credits (primary) and matches as tiebreaker
			const isBetterPeak = peakCreditsInGeneration > bestScore.peakCredits;
			const isSamePeak = peakCreditsInGeneration === bestScore.peakCredits;
			const isBetterMatches = matchesInCurrentGeneration > bestScore.matchesBeforeOut;
			
			// Update if: better peak credits, OR same peak but more matches
			if (isBetterPeak || (isSamePeak && isBetterMatches)) {
				bestScore = {
					peakCredits: peakCreditsInGeneration,
					matchesBeforeOut: matchesInCurrentGeneration,
					generation: currentGeneration
				};
				// Save best weights when best score is updated
				bestWeights = getCurrentWeights();
			}
			
			// Keep only last 1000 generations
			if (generations.length > 1000) {
				generations.shift();
			}
		}
		
		// Reset for new generation
		currentGeneration++;
		matchesInCurrentGeneration = 0;
		winsInGeneration = 0;
		lossesInGeneration = 0;
		state = initGame();
		peakCreditsInGeneration = state.credits;
	}
	
	// Function to display stats
	function displayStats() {
		const overallWinRate = totalMatches > 0 ? (totalWins / totalMatches * 100).toFixed(2) : '0.00';
		
		// Calculate last 100 matches win rate
		const last100Matches = recentMatches.slice(-100);
		const last100Wins = last100Matches.filter(m => m.won).length;
		const last100WinRate = last100Matches.length > 0 
			? (last100Wins / last100Matches.length * 100).toFixed(2) 
			: '0.00';
		
		// Calculate last 1000 matches win rate
		const last1000Matches = recentMatches.slice(-1000);
		const last1000Wins = last1000Matches.filter(m => m.won).length;
		const last1000WinRate = last1000Matches.length > 0 
			? (last1000Wins / last1000Matches.length * 100).toFixed(2) 
			: '0.00';
		
		// Clear previous line and display stats
		process.stdout.write('\r\x1b[K'); // Clear line
		process.stdout.write(
			`Gen: ${currentGeneration} | ` +
			`Matches: ${totalMatches} | ` +
			`Overall: ${overallWinRate}% | ` +
			`Last 100: ${last100WinRate}% | ` +
			`Last 1000: ${last1000WinRate}% | ` +
			`Credits: ${state.credits} | ` +
			`Peak: ${peakCreditsInGeneration} | ` +
			`Best: ${bestScore.peakCredits}cr/${bestScore.matchesBeforeOut}m (Gen ${bestScore.generation})`
		);
	}
	
	// Initial display
	displayStats();
	
	// Run simulations continuously
	while (!shouldQuit) {
		const matchResult = simulateMatch(state, getMLAction);
		
		if (!matchResult) {
			// Can't afford buy-in, end generation and start new one
			startNewGeneration();
			continue;
		}
		
		// Update state
		state = matchResult.finalState;
		
		// Update peak credits for this generation
		if (state.credits > peakCreditsInGeneration) {
			peakCreditsInGeneration = state.credits;
		}
		
		// Track match result
		totalMatches++;
		matchesInCurrentGeneration++;
		if (matchResult.won) {
			totalWins++;
			winsInGeneration++;
		} else {
			lossesInGeneration++;
		}
		
		// Add to recent matches (keep last 1000)
		recentMatches.push({
			won: matchResult.won,
			credits: state.credits
		});
		
		if (recentMatches.length > 1000) {
			recentMatches.shift();
		}
		
		// Display updated stats
		displayStats();
		
		// Check if generation should end (10 matches or out of credits)
		if (matchesInCurrentGeneration >= 10 || state.credits < 10) {
			// Get current weights before starting new generation
			recentWeights = getCurrentWeights();
			
			startNewGeneration();
			
			// Save every 1000 generations
			if (currentGeneration > 0 && currentGeneration % 1000 === 0) {
				// Get current weights before saving (in case they changed during generation)
				recentWeights = getCurrentWeights();
				
				saveProgress(
					totalMatches,
					totalWins,
					recentMatches,
					generations,
					currentGeneration,
					bestScore,
					bestWeights,
					recentWeights
				);
				lastSavedGeneration = currentGeneration;
			}
		}
		
		// Small delay to prevent overwhelming the console
		await new Promise(resolve => setTimeout(resolve, 10));
	}
	
	rl.close();
	
	// Save final generation if it had matches
	if (matchesInCurrentGeneration > 0) {
		generations.push({
			matches: matchesInCurrentGeneration,
			peakCredits: peakCreditsInGeneration,
			wins: winsInGeneration,
			losses: lossesInGeneration
		});
	}
	
	// Save final progress before exiting
	if (currentGeneration > lastSavedGeneration) {
		// Get current weights before final save
		recentWeights = getCurrentWeights();
		
		saveProgress(
			totalMatches,
			totalWins,
			recentMatches,
			generations,
			currentGeneration,
			bestScore,
			bestWeights,
			recentWeights
		);
	}
	
	// Final stats
	console.log('\n\n=== Final Statistics ===');
	console.log(`Total Generations: ${currentGeneration}`);
	console.log(`Total Matches: ${totalMatches}`);
	console.log(`Total Wins: ${totalWins}`);
	console.log(`Total Losses: ${totalMatches - totalWins}`);
	console.log(`Overall Win Rate: ${totalMatches > 0 ? (totalWins / totalMatches * 100).toFixed(2) : '0.00'}%`);
	
	if (recentMatches.length > 0) {
		const last100 = recentMatches.slice(-100);
		const last100Wins = last100.filter(m => m.won).length;
		console.log(`Last 100 Matches Win Rate: ${(last100Wins / last100.length * 100).toFixed(2)}%`);
		
		if (recentMatches.length >= 1000) {
			const last1000 = recentMatches.slice(-1000);
			const last1000Wins = last1000.filter(m => m.won).length;
			console.log(`Last 1000 Matches Win Rate: ${(last1000Wins / last1000.length * 100).toFixed(2)}%`);
		}
	}
	
	if (generations.length > 0) {
		const avgPeakCredits = generations.reduce((sum, g) => sum + g.peakCredits, 0) / generations.length;
		const avgMatchesPerGen = generations.reduce((sum, g) => sum + g.matches, 0) / generations.length;
		console.log(`\n=== Best Score ===`);
		console.log(`Best Peak Credits: ${bestScore.peakCredits} (Generation ${bestScore.generation})`);
		console.log(`Best Matches Before Out: ${bestScore.matchesBeforeOut} (Generation ${bestScore.generation})`);
		console.log(`\n=== Averages ===`);
		console.log(`Average Peak Credits per Generation: ${avgPeakCredits.toFixed(2)}`);
		console.log(`Average Matches per Generation: ${avgMatchesPerGen.toFixed(2)}`);
		
		if (generations.length >= 100) {
			const last100Gens = generations.slice(-100);
			const last100AvgPeak = last100Gens.reduce((sum, g) => sum + g.peakCredits, 0) / last100Gens.length;
			console.log(`Last 100 Generations Avg Peak: ${last100AvgPeak.toFixed(2)}`);
		}
		
		if (generations.length >= 1000) {
			const last1000Gens = generations.slice(-1000);
			const last1000AvgPeak = last1000Gens.reduce((sum, g) => sum + g.peakCredits, 0) / last1000Gens.length;
			console.log(`Last 1000 Generations Avg Peak: ${last1000AvgPeak.toFixed(2)}`);
		}
	}
	
	console.log(`Final Credits: ${state.credits}`);
}

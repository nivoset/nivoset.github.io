import { runSimulations, simulateGame } from './game-simulator';

// Run a single simulation and log results
console.log('Running single simulation...\n');
const singleResult = simulateGame();
console.log('Single Simulation Results:');
console.log(`  Matches Played: ${singleResult.matchesPlayed}`);
console.log(`  Final Credits: ${singleResult.finalCredits}`);
console.log(`  Wins: ${singleResult.wins}`);
console.log(`  Losses: ${singleResult.losses}`);
console.log(`  Win Rate: ${((singleResult.wins / (singleResult.wins + singleResult.losses)) * 100).toFixed(2)}%`);
console.log(`  Actions per match: ${singleResult.actions.map(a => a.length).join(', ')}`);
console.log('\n');

// Run multiple simulations
const simulationCount = 100;
console.log(`Running ${simulationCount} simulations...\n`);
const stats = runSimulations(simulationCount);

console.log(`Statistics from ${simulationCount} simulations:`);
console.log(`  Average Matches Played: ${stats.avgMatchesPlayed.toFixed(2)}`);
console.log(`  Average Final Credits: ${stats.avgFinalCredits.toFixed(2)}`);
console.log(`  Average Wins: ${stats.avgWins.toFixed(2)}`);
console.log(`  Average Losses: ${stats.avgLosses.toFixed(2)}`);
console.log(`  Overall Win Rate: ${(stats.winRate * 100).toFixed(2)}%`);
console.log(`  Min Matches: ${stats.minMatches}`);
console.log(`  Max Matches: ${stats.maxMatches}`);
console.log(`  Min Final Credits: ${stats.minCredits}`);
console.log(`  Max Final Credits: ${stats.maxCredits}`);


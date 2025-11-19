// Card data structure
export type Card = {
	suit: 'hearts' | 'diamonds' | 'clubs' | 'spades' | 'joker';
	rank: string;
};

export type HandEvaluation = {
	type: string;
	value: number;
	description: string;
};

// Get rank value for comparison (A=14, K=13, Q=12, J=11, 10-2, Joker=15)
export function getRankValue(rank: string): number {
	if (rank === 'Joker') return 15; // Jokers are highest for sorting purposes
	if (rank === 'A') return 14;
	if (rank === 'K') return 13;
	if (rank === 'Q') return 12;
	if (rank === 'J') return 11;
	return parseInt(rank);
}

export function getRankName(rankValue: number): string {
	if (rankValue === 15) return 'Joker';
	if (rankValue === 14) return 'Ace';
	if (rankValue === 13) return 'King';
	if (rankValue === 12) return 'Queen';
	if (rankValue === 11) return 'Jack';
	return rankValue.toString();
}

// Evaluate a poker hand and return hand type and value for comparison
export function evaluateHand(hand: Card[]): HandEvaluation {
	// Separate jokers from regular cards
	const jokers = hand.filter(c => c.rank === 'Joker' || c.suit === 'joker');
	const regularCards = hand.filter(c => c.rank !== 'Joker' && c.suit !== 'joker');
	const jokerCount = jokers.length;
	
	// If all cards are jokers, it's 5 of a kind (jokers)
	if (jokerCount === 5) {
		return { type: 'Five of a Kind', value: 10000000, description: 'Five of a Kind (Jokers)' };
	}
	
	// Sort regular cards by rank value
	const sorted = [...regularCards].sort((a, b) => getRankValue(b.rank) - getRankValue(a.rank));
	const ranks = sorted.map(c => getRankValue(c.rank));
	const suits = sorted.map(c => c.suit);
	
	// Count occurrences of each rank
	const rankCounts: Record<number, number> = {};
	ranks.forEach(rank => {
		rankCounts[rank] = (rankCounts[rank] || 0) + 1;
	});
	
	const counts = Object.values(rankCounts).sort((a, b) => b - a);
	
	// With jokers, we need to evaluate the best possible hand
	// Jokers can be used to complete pairs, straights, flushes, etc.
	
	// Check for flush (all same suit, jokers can be any suit)
	// Only consider it a flush if all regular cards are same suit OR if we have enough cards + jokers
	const isFlush = suits.length > 0 && (
		(suits.length === 5 && suits.every(suit => suit === suits[0])) || 
		(jokerCount > 0 && suits.length > 0 && suits.every(suit => suit === suits[0]) && suits.length + jokerCount >= 5)
	);
	
	// Check for straight with jokers
	let isStraight = false;
	let straightHigh = 0;
	
	if (jokerCount === 0) {
		// No jokers - check regular straight
		isStraight = (() => {
			for (let i = 0; i < ranks.length - 1; i++) {
				if (ranks[i] - ranks[i + 1] !== 1) {
					// Check for A-2-3-4-5 straight (wheel)
					if (ranks[0] === 14 && ranks[1] === 5 && ranks[2] === 4 && ranks[3] === 3 && ranks[4] === 2) {
						return true;
					}
					return false;
				}
			}
			return true;
		})();
		straightHigh = ranks[0];
		if (isStraight && ranks[0] === 14 && ranks[1] === 5) {
			straightHigh = 5;
		}
	} else {
		// With jokers, check if we can make a straight
		// Sort unique ranks
		const uniqueRanks = [...new Set(ranks)].sort((a, b) => b - a);
		const gaps = [];
		for (let i = 0; i < uniqueRanks.length - 1; i++) {
			gaps.push(uniqueRanks[i] - uniqueRanks[i + 1] - 1);
		}
		const totalGaps = gaps.reduce((sum, gap) => sum + gap, 0);
		
		// Check for wheel straight possibility
		if (uniqueRanks.includes(14) && uniqueRanks.includes(5) && uniqueRanks.includes(4) && uniqueRanks.includes(3) && uniqueRanks.includes(2)) {
			isStraight = true;
			straightHigh = 5;
		} else if (totalGaps <= jokerCount && uniqueRanks.length + jokerCount >= 5) {
			// Can fill gaps with jokers
			isStraight = true;
			straightHigh = uniqueRanks[0];
		}
	}
	
	// With jokers, adjust counts (jokers can be used to complete pairs, etc.)
	const adjustedCounts = [...counts];
	if (jokerCount > 0 && adjustedCounts.length > 0) {
		adjustedCounts[0] += jokerCount; // Use jokers to enhance the highest count
	}
	
	// Five of a Kind (only possible with jokers)
	if (adjustedCounts[0] >= 5) {
		const fiveRank = counts[0] >= 4 
			? parseInt(Object.keys(rankCounts).find(k => rankCounts[parseInt(k)] === counts[0])!)
			: (counts[0] === 3 
				? parseInt(Object.keys(rankCounts).find(k => rankCounts[parseInt(k)] === 3)!)
				: parseInt(Object.keys(rankCounts).find(k => rankCounts[parseInt(k)] === counts[0])!));
		return { type: 'Five of a Kind', value: 10000000 + fiveRank, description: `Five of a Kind (${getRankName(fiveRank)}s)` };
	}
	
	// Royal Flush: A-K-Q-J-10 of same suit (can be made with jokers)
	if (isStraight && isFlush) {
		// Check if we have A, K, Q, J, 10 (or can make it with jokers)
		const hasRoyalRanks = ranks.includes(14) && ranks.includes(13) && ranks.includes(12) && ranks.includes(11) && ranks.includes(10);
		const canMakeRoyal = hasRoyalRanks || (ranks.filter(r => r >= 10 && r <= 14).length + jokerCount >= 5);
		// Only make royal flush if we actually have the right cards
		if (canMakeRoyal && ranks.length >= 4 && (ranks[0] === 14 || (jokerCount > 0 && ranks.includes(14) && ranks.includes(13) && ranks.includes(12) && ranks.includes(11)))) {
			return { type: 'Royal Flush', value: 9000000, description: 'Royal Flush' };
		}
	}
	
	// Straight Flush
	if (isStraight && isFlush) {
		return { type: 'Straight Flush', value: 8000000 + straightHigh, description: `Straight Flush, ${sorted[0]?.rank || 'A'} high` };
	}
	
	// Four of a Kind (with or without jokers)
	if (adjustedCounts[0] >= 4) {
		let fourRank: number;
		if (counts[0] >= 4) {
			fourRank = parseInt(Object.keys(rankCounts).find(k => rankCounts[parseInt(k)] === 4)!);
		} else if (counts[0] === 3 && jokerCount >= 1) {
			fourRank = parseInt(Object.keys(rankCounts).find(k => rankCounts[parseInt(k)] === 3)!);
		} else if (counts[0] === 2 && jokerCount >= 2) {
			const rankKeys = Object.keys(rankCounts).map(k => parseInt(k)).sort((a, b) => b - a);
			fourRank = rankKeys.find(r => rankCounts[r] === 2) || rankKeys[0];
		} else {
			fourRank = parseInt(Object.keys(rankCounts).find(k => rankCounts[parseInt(k)] === counts[0])!);
		}
		const remainingCards = ranks.filter(r => r !== fourRank);
		const kicker = remainingCards.length > 0 ? remainingCards[0] : 14; // Default to Ace if no kicker
		return { type: 'Four of a Kind', value: 7000000 + fourRank * 100 + kicker, description: `Four ${getRankName(fourRank)}s` };
	}
	
	// Full House (with or without jokers)
	if ((adjustedCounts[0] >= 3 && adjustedCounts[1] >= 2) || (adjustedCounts[0] >= 3 && jokerCount >= 2)) {
		let threeRank: number;
		let pairRank: number;
		
		if (counts[0] >= 3 && counts[1] >= 2) {
			threeRank = parseInt(Object.keys(rankCounts).find(k => rankCounts[parseInt(k)] === 3)!);
			pairRank = parseInt(Object.keys(rankCounts).find(k => rankCounts[parseInt(k)] === 2)!);
		} else if (counts[0] >= 3 && jokerCount >= 2) {
			threeRank = parseInt(Object.keys(rankCounts).find(k => rankCounts[parseInt(k)] === 3)!);
			pairRank = counts[1] >= 2 
				? parseInt(Object.keys(rankCounts).find(k => rankCounts[parseInt(k)] === 2)!)
				: parseInt(Object.keys(rankCounts).find(k => rankCounts[parseInt(k)] === counts[1] || counts[0])!);
		} else if (counts[0] >= 2 && jokerCount >= 3) {
			const rankKeys = Object.keys(rankCounts).map(k => parseInt(k)).sort((a, b) => b - a);
			threeRank = rankKeys[0];
			pairRank = rankKeys.length > 1 ? rankKeys[1] : rankKeys[0];
		} else {
			threeRank = parseInt(Object.keys(rankCounts).find(k => rankCounts[parseInt(k)] === counts[0])!);
			pairRank = threeRank; // Fallback
		}
		return { type: 'Full House', value: 6000000 + threeRank * 100 + pairRank, description: `${getRankName(threeRank)}s full of ${getRankName(pairRank)}s` };
	}
	
	// Flush
	if (isFlush) {
		// Use base 15 encoding to fit all 5 cards in range 0-999999
		// Max value: 14*15^4 + 14*15^3 + 14*15^2 + 14*15 + 14 = 759374 < 1000000
		const highCards = ranks.slice(0, 5);
		const value = 5000000 + highCards.reduce((sum, r, i) => sum + r * Math.pow(15, 4 - i), 0);
		return { type: 'Flush', value, description: `Flush, ${getRankName(ranks[0])} high` };
	}
	
	// Straight
	if (isStraight) {
		return { type: 'Straight', value: 4000000 + straightHigh, description: `Straight, ${getRankName(straightHigh)} high` };
	}
	
	// Three of a Kind (with or without jokers)
	if (adjustedCounts[0] >= 3) {
		let threeRank: number;
		if (counts[0] >= 3) {
			threeRank = parseInt(Object.keys(rankCounts).find(k => rankCounts[parseInt(k)] === 3)!);
		} else if (counts[0] === 2 && jokerCount >= 1) {
			threeRank = parseInt(Object.keys(rankCounts).find(k => rankCounts[parseInt(k)] === 2)!);
		} else {
			threeRank = parseInt(Object.keys(rankCounts).find(k => rankCounts[parseInt(k)] === counts[0])!);
		}
		const kickers = ranks.filter(r => r !== threeRank).sort((a, b) => b - a).slice(0, 2);
		while (kickers.length < 2) kickers.push(14); // Fill with Aces if needed
		const value = 3000000 + threeRank * 10000 + kickers[0] * 100 + kickers[1];
		return { type: 'Three of a Kind', value, description: `Three ${getRankName(threeRank)}s` };
	}
	
	// Two Pair (with or without jokers)
	if ((counts[0] === 2 && counts[1] === 2) || (counts[0] === 2 && jokerCount >= 2)) {
		let pairs: number[];
		if (counts[0] === 2 && counts[1] === 2) {
			pairs = Object.keys(rankCounts)
				.filter(k => rankCounts[parseInt(k)] === 2)
				.map(k => parseInt(k))
				.sort((a, b) => b - a);
		} else {
			const pairRank = parseInt(Object.keys(rankCounts).find(k => rankCounts[parseInt(k)] === 2)!);
			pairs = [pairRank, pairRank]; // Use same rank for both pairs with jokers
		}
		const kicker = ranks.filter(r => !pairs.includes(r))[0] || 14;
		const value = 2000000 + pairs[0] * 10000 + pairs[1] * 100 + kicker;
		return { type: 'Two Pair', value, description: `${getRankName(pairs[0])}s and ${getRankName(pairs[1])}s` };
	}
	
	// One Pair (with or without jokers)
	if (adjustedCounts[0] >= 2) {
		let pairRank: number;
		if (counts[0] >= 2) {
			pairRank = parseInt(Object.keys(rankCounts).find(k => rankCounts[parseInt(k)] === 2)!);
		} else {
			pairRank = parseInt(Object.keys(rankCounts).find(k => rankCounts[parseInt(k)] === counts[0])!);
		}
		const kickers = ranks.filter(r => r !== pairRank).sort((a, b) => b - a).slice(0, 3);
		while (kickers.length < 3) kickers.push(14); // Fill with Aces if needed
		const value = 1000000 + pairRank * 10000 + kickers[0] * 100 + kickers[1] * 10 + kickers[2];
		return { type: 'One Pair', value, description: `Pair of ${getRankName(pairRank)}s` };
	}
	
	// High Card
	// Use base 15 encoding to fit all 5 cards in range 0-999999
	// Max value: 14*15^4 + 14*15^3 + 14*15^2 + 14*15 + 14 = 759374 < 1000000
	const highCards = ranks.slice(0, 5);
	const value = highCards.reduce((sum, r, i) => sum + r * Math.pow(15, 4 - i), 0);
	return { type: 'High Card', value, description: `${getRankName(ranks[0])} high` };
}


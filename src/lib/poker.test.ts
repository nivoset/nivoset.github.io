import { test, expect } from 'vitest';
import { evaluateHand, getRankValue, getRankName, type Card } from './poker.js';

// Helper function to create a card
function card(suit: Card['suit'], rank: string): Card {
	return { suit, rank };
}

// Helper function to create a hand
function hand(...cards: Card[]): Card[] {
	return cards;
}

// Helper function to create a joker
function joker(): Card {
	return { suit: 'joker', rank: 'Joker' };
}

// Test cases for cross-hand-type comparisons (winning hand beats losing hand)
const crossTypeTestCases = [
	{
		name: 'Royal Flush beats Straight Flush',
		winning: hand(card('hearts', 'A'), card('hearts', 'K'), card('hearts', 'Q'), card('hearts', 'J'), card('hearts', '10')),
		losing: hand(card('spades', '9'), card('spades', '8'), card('spades', '7'), card('spades', '6'), card('spades', '5')),
	},
	{
		name: 'Straight Flush beats Four of a Kind',
		winning: hand(card('spades', '9'), card('spades', '8'), card('spades', '7'), card('spades', '6'), card('spades', '5')),
		losing: hand(card('hearts', 'A'), card('diamonds', 'A'), card('clubs', 'A'), card('spades', 'A'), card('hearts', 'K')),
	},
	{
		name: 'Four of a Kind beats Full House',
		winning: hand(card('hearts', '2'), card('diamonds', '2'), card('clubs', '2'), card('spades', '2'), card('hearts', 'K')),
		losing: hand(card('hearts', 'A'), card('diamonds', 'A'), card('clubs', 'A'), card('spades', 'K'), card('hearts', 'K')),
	},
	{
		name: 'Full House beats Flush',
		winning: hand(card('hearts', '3'), card('diamonds', '3'), card('clubs', '3'), card('spades', '2'), card('hearts', '2')),
		losing: hand(card('hearts', 'A'), card('hearts', 'K'), card('hearts', 'Q'), card('hearts', 'J'), card('hearts', '9')),
	},
	{
		name: 'Flush beats Straight',
		winning: hand(card('hearts', '2'), card('hearts', '3'), card('hearts', '5'), card('hearts', '7'), card('hearts', '9')),
		losing: hand(card('hearts', '10'), card('diamonds', '9'), card('clubs', '8'), card('spades', '7'), card('hearts', '6')),
	},
	{
		name: 'Straight beats Three of a Kind',
		winning: hand(card('hearts', '5'), card('diamonds', '4'), card('clubs', '3'), card('spades', '2'), card('hearts', 'A')),
		losing: hand(card('hearts', 'A'), card('diamonds', 'A'), card('clubs', 'A'), card('spades', 'K'), card('hearts', 'Q')),
	},
	{
		name: 'Three of a Kind beats Two Pair',
		winning: hand(card('hearts', '2'), card('diamonds', '2'), card('clubs', '2'), card('spades', 'K'), card('hearts', 'Q')),
		losing: hand(card('hearts', 'A'), card('diamonds', 'A'), card('clubs', 'K'), card('spades', 'K'), card('hearts', 'Q')),
	},
	{
		name: 'Two Pair beats One Pair',
		winning: hand(card('hearts', '2'), card('diamonds', '2'), card('clubs', '3'), card('spades', '3'), card('hearts', 'K')),
		losing: hand(card('hearts', 'A'), card('diamonds', 'A'), card('clubs', 'K'), card('spades', 'Q'), card('hearts', 'J')),
	},
	{
		name: 'One Pair beats High Card',
		winning: hand(card('hearts', '2'), card('diamonds', '2'), card('clubs', 'K'), card('spades', 'Q'), card('hearts', 'J')),
		losing: hand(card('hearts', 'A'), card('diamonds', 'K'), card('clubs', 'Q'), card('spades', 'J'), card('hearts', '9')),
	},
];

// Test cases for tie-breaking (same hand type, winning hand beats losing hand)
const tieBreakingTestCases = [
	// One Pair comparisons
	{
		name: 'One Pair - Higher pair wins',
		winning: hand(card('hearts', 'A'), card('diamonds', 'A'), card('clubs', 'K'), card('spades', 'Q'), card('hearts', 'J')),
		losing: hand(card('hearts', 'K'), card('diamonds', 'K'), card('clubs', 'A'), card('spades', 'Q'), card('hearts', 'J')),
	},
	{
		name: 'One Pair - Same pair, higher kicker wins',
		winning: hand(card('hearts', '10'), card('diamonds', '10'), card('clubs', 'A'), card('spades', 'K'), card('hearts', 'Q')),
		losing: hand(card('hearts', '10'), card('diamonds', '10'), card('clubs', 'K'), card('spades', 'Q'), card('hearts', 'J')),
	},
	// Two Pair comparisons
	{
		name: 'Two Pair - Higher pair wins',
		winning: hand(card('hearts', 'A'), card('diamonds', 'A'), card('clubs', '2'), card('spades', '2'), card('hearts', 'K')),
		losing: hand(card('hearts', 'K'), card('diamonds', 'K'), card('clubs', 'Q'), card('spades', 'Q'), card('hearts', 'A')),
	},
	{
		name: 'Two Pair - Same high pair, higher low pair wins',
		winning: hand(card('hearts', '10'), card('diamonds', '10'), card('clubs', '5'), card('spades', '5'), card('hearts', 'K')),
		losing: hand(card('hearts', '10'), card('diamonds', '10'), card('clubs', '4'), card('spades', '4'), card('hearts', 'K')),
	},
	{
		name: 'Two Pair - Same pairs, higher kicker wins',
		winning: hand(card('hearts', '10'), card('diamonds', '10'), card('clubs', '5'), card('spades', '5'), card('hearts', 'A')),
		losing: hand(card('hearts', '10'), card('diamonds', '10'), card('clubs', '5'), card('spades', '5'), card('hearts', 'K')),
	},
	// Three of a Kind comparisons
	{
		name: 'Three of a Kind - Higher three wins',
		winning: hand(card('hearts', 'A'), card('diamonds', 'A'), card('clubs', 'A'), card('spades', '2'), card('hearts', '3')),
		losing: hand(card('hearts', 'K'), card('diamonds', 'K'), card('clubs', 'K'), card('spades', 'A'), card('hearts', 'Q')),
	},
	// Straight comparisons
	{
		name: 'Straight - Higher straight wins',
		winning: hand(card('hearts', 'A'), card('diamonds', 'K'), card('clubs', 'Q'), card('spades', 'J'), card('hearts', '10')),
		losing: hand(card('hearts', '9'), card('diamonds', '8'), card('clubs', '7'), card('spades', '6'), card('hearts', '5')),
	},
	{
		name: 'Straight - Wheel (A-2-3-4-5) loses to 6-7-8-9-10',
		winning: hand(card('hearts', '10'), card('diamonds', '9'), card('clubs', '8'), card('spades', '7'), card('hearts', '6')),
		losing: hand(card('hearts', 'A'), card('diamonds', '5'), card('clubs', '4'), card('spades', '3'), card('hearts', '2')),
	},
	// Flush comparisons
	{
		name: 'Flush - Higher cards win',
		winning: hand(card('hearts', 'A'), card('hearts', 'K'), card('hearts', 'Q'), card('hearts', 'J'), card('hearts', '9')),
		losing: hand(card('spades', 'K'), card('spades', 'Q'), card('spades', 'J'), card('spades', '9'), card('spades', '7')),
	},
	// Full House comparisons
	{
		name: 'Full House - Higher three wins',
		winning: hand(card('hearts', 'A'), card('diamonds', 'A'), card('clubs', 'A'), card('spades', '2'), card('hearts', '2')),
		losing: hand(card('hearts', 'K'), card('diamonds', 'K'), card('clubs', 'K'), card('spades', 'A'), card('hearts', 'A')),
	},
	{
		name: 'Full House - Same three, higher pair wins',
		winning: hand(card('hearts', '10'), card('diamonds', '10'), card('clubs', '10'), card('spades', 'A'), card('hearts', 'A')),
		losing: hand(card('hearts', '10'), card('diamonds', '10'), card('clubs', '10'), card('spades', 'K'), card('hearts', 'K')),
	},
	// Four of a Kind comparisons
	{
		name: 'Four of a Kind - Higher four wins',
		winning: hand(card('hearts', 'A'), card('diamonds', 'A'), card('clubs', 'A'), card('spades', 'A'), card('hearts', '2')),
		losing: hand(card('hearts', 'K'), card('diamonds', 'K'), card('clubs', 'K'), card('spades', 'K'), card('hearts', 'A')),
	},
	{
		name: 'Four of a Kind - Same four, higher kicker wins',
		winning: hand(card('hearts', '10'), card('diamonds', '10'), card('clubs', '10'), card('spades', '10'), card('hearts', 'A')),
		losing: hand(card('hearts', '10'), card('diamonds', '10'), card('clubs', '10'), card('spades', '10'), card('hearts', 'K')),
	},
	// High Card comparisons
	{
		name: 'High Card - Higher cards win',
		winning: hand(card('hearts', 'A'), card('diamonds', 'K'), card('clubs', 'Q'), card('spades', 'J'), card('hearts', '9')),
		losing: hand(card('hearts', 'K'), card('diamonds', 'Q'), card('clubs', 'J'), card('spades', '9'), card('hearts', '8')),
	},
];

// Individual hand type validation test cases
const handTypeTestCases = [
	{
		name: 'Royal Flush',
		hand: hand(card('hearts', 'A'), card('hearts', 'K'), card('hearts', 'Q'), card('hearts', 'J'), card('hearts', '10')),
		expectedType: 'Royal Flush',
		expectedValue: 9000000,
		expectedDescription: 'Royal Flush',
	},
	{
		name: 'Straight Flush',
		hand: hand(card('spades', '9'), card('spades', '8'), card('spades', '7'), card('spades', '6'), card('spades', '5')),
		expectedType: 'Straight Flush',
		expectedValue: 8000009,
		descriptionContains: 'Straight Flush',
	},
	{
		name: 'Straight Flush - Wheel (A-2-3-4-5)',
		hand: hand(card('diamonds', 'A'), card('diamonds', '5'), card('diamonds', '4'), card('diamonds', '3'), card('diamonds', '2')),
		expectedType: 'Straight Flush',
		expectedValue: 8000005,
	},
	{
		name: 'Four of a Kind',
		hand: hand(card('hearts', '7'), card('diamonds', '7'), card('clubs', '7'), card('spades', '7'), card('hearts', 'K')),
		expectedType: 'Four of a Kind',
		expectedValue: 7000700 + 13,
		descriptionContains: 'Four 7s',
	},
	{
		name: 'Full House',
		hand: hand(card('hearts', '8'), card('diamonds', '8'), card('clubs', '8'), card('spades', '4'), card('hearts', '4')),
		expectedType: 'Full House',
		expectedValue: 6000800 + 4,
		descriptionContains: '8s full of 4s',
	},
	{
		name: 'Flush',
		hand: hand(card('clubs', 'A'), card('clubs', 'K'), card('clubs', '10'), card('clubs', '7'), card('clubs', '3')),
		expectedType: 'Flush',
		valueRange: { min: 5000000, max: 6000000 },
		descriptionContains: 'Flush',
	},
	{
		name: 'Straight',
		hand: hand(card('hearts', '10'), card('diamonds', '9'), card('clubs', '8'), card('spades', '7'), card('hearts', '6')),
		expectedType: 'Straight',
		expectedValue: 4000010,
		descriptionContains: 'Straight',
	},
	{
		name: 'Straight - Wheel (A-2-3-4-5)',
		hand: hand(card('hearts', 'A'), card('diamonds', '5'), card('clubs', '4'), card('spades', '3'), card('hearts', '2')),
		expectedType: 'Straight',
		expectedValue: 4000005,
	},
	{
		name: 'Three of a Kind',
		hand: hand(card('hearts', 'Q'), card('diamonds', 'Q'), card('clubs', 'Q'), card('spades', '9'), card('hearts', '5')),
		expectedType: 'Three of a Kind',
		valueRange: { min: 3000000, max: 4000000 },
		descriptionContains: 'Three Queens',
	},
	{
		name: 'Two Pair',
		hand: hand(card('hearts', '10'), card('diamonds', '10'), card('clubs', '5'), card('spades', '5'), card('hearts', 'K')),
		expectedType: 'Two Pair',
		valueRange: { min: 2000000, max: 3000000 },
		descriptionContains: '10s and 5s',
	},
	{
		name: 'One Pair',
		hand: hand(card('hearts', '2'), card('diamonds', '2'), card('clubs', 'K'), card('spades', 'Q'), card('hearts', '7')),
		expectedType: 'One Pair',
		valueRange: { min: 1000000, max: 2000000 },
		descriptionContains: 'Pair of 2s',
	},
	{
		name: 'High Card',
		hand: hand(card('hearts', 'Q'), card('diamonds', '10'), card('clubs', '8'), card('spades', '5'), card('hearts', '3')),
		expectedType: 'High Card',
		valueRange: { max: 1000000 },
		descriptionContains: 'Queen high',
	},
];

// Joker test cases
const jokerTestCases = [
	{
		name: 'Five of a Kind - All jokers',
		hand: hand(joker(), joker(), joker(), joker(), joker()),
		expectedType: 'Five of a Kind',
		expectedValue: 10000000,
		descriptionContains: 'Five of a Kind',
	},
	{
		name: 'Five of a Kind - Four Aces + Joker',
		hand: hand(card('hearts', 'A'), card('diamonds', 'A'), card('clubs', 'A'), card('spades', 'A'), joker()),
		expectedType: 'Five of a Kind',
		valueRange: { min: 10000000, max: 10000015 },
		descriptionContains: 'Five of a Kind',
	},
	{
		name: 'Five of a Kind - Three 7s + Two Jokers',
		hand: hand(card('hearts', '7'), card('diamonds', '7'), card('clubs', '7'), joker(), joker()),
		expectedType: 'Five of a Kind',
		valueRange: { min: 10000000, max: 10000015 },
		descriptionContains: 'Five of a Kind',
	},
	{
		name: 'Royal Flush - Four cards + Joker',
		hand: hand(card('hearts', 'A'), card('hearts', 'K'), card('hearts', 'Q'), card('hearts', 'J'), joker()),
		expectedType: 'Royal Flush',
		expectedValue: 9000000,
	},
	{
		name: 'Straight Flush - Four cards + Joker',
		hand: hand(card('spades', '9'), card('spades', '8'), card('spades', '7'), card('spades', '6'), joker()),
		expectedType: 'Straight Flush',
		valueRange: { min: 8000000, max: 9000000 },
	},
	{
		name: 'Four of a Kind - Three 10s + Joker',
		hand: hand(card('hearts', '10'), card('diamonds', '10'), card('clubs', '10'), joker(), card('hearts', 'K')),
		expectedType: 'Four of a Kind',
		valueRange: { min: 7000000, max: 8000000 },
		descriptionContains: 'Four 10s',
	},
	{
		name: 'Full House - Two pairs + Joker',
		hand: hand(card('hearts', '8'), card('diamonds', '8'), card('clubs', '4'), card('spades', '4'), joker()),
		expectedType: 'Full House',
		valueRange: { min: 6000000, max: 7000000 },
	},
	{
		name: 'Flush - Four cards + Joker (not royal)',
		hand: hand(card('hearts', 'A'), card('hearts', 'K'), card('hearts', 'Q'), card('hearts', '9'), joker()),
		expectedType: 'Flush',
		valueRange: { min: 5000000, max: 6000000 },
	},
	{
		name: 'Straight - Four cards + Joker',
		hand: hand(card('hearts', '10'), card('diamonds', '9'), card('clubs', '8'), card('spades', '7'), joker()),
		expectedType: 'Straight',
		valueRange: { min: 4000000, max: 5000000 },
	},
	{
		name: 'Three of a Kind - Pair + Joker (no flush possible)',
		hand: hand(card('hearts', '5'), card('diamonds', '5'), joker(), card('spades', 'K'), card('clubs', 'Q')),
		expectedType: 'Three of a Kind',
		valueRange: { min: 3000000, max: 4000000 },
		descriptionContains: 'Three 5s',
	},
	{
		name: 'Two Pair - Two pairs already present',
		hand: hand(card('hearts', '10'), card('diamonds', '10'), card('spades', '5'), card('clubs', '5'), joker()),
		expectedType: 'Full House',
		valueRange: { min: 6000000, max: 7000000 },
	},
	{
		name: 'One Pair - High card + Joker (no straight/flush possible)',
		hand: hand(card('hearts', 'A'), joker(), card('clubs', 'K'), card('spades', 'Q'), card('diamonds', '9')),
		expectedType: 'One Pair',
		valueRange: { min: 1000000, max: 2000000 },
	},
];

// Joker cross-type comparison test cases
const jokerCrossTypeTestCases = [
	{
		name: 'Five of a Kind beats Royal Flush',
		winning: hand(card('hearts', 'A'), card('diamonds', 'A'), card('clubs', 'A'), card('spades', 'A'), joker()),
		losing: hand(card('hearts', 'A'), card('hearts', 'K'), card('hearts', 'Q'), card('hearts', 'J'), card('hearts', '10')),
	},
	{
		name: 'Five of a Kind beats Straight Flush',
		winning: hand(card('hearts', '7'), card('diamonds', '7'), card('clubs', '7'), card('spades', '7'), joker()),
		losing: hand(card('spades', '9'), card('spades', '8'), card('spades', '7'), card('spades', '6'), card('spades', '5')),
	},
	{
		name: 'Royal Flush with joker beats Straight Flush',
		winning: hand(card('hearts', 'A'), card('hearts', 'K'), card('hearts', 'Q'), card('hearts', 'J'), joker()),
		losing: hand(card('spades', '9'), card('spades', '8'), card('spades', '7'), card('spades', '6'), card('spades', '5')),
	},
	{
		name: 'Four of a Kind with joker beats Full House',
		winning: hand(card('hearts', '10'), card('diamonds', '10'), card('clubs', '10'), joker(), card('hearts', 'K')),
		losing: hand(card('hearts', 'A'), card('diamonds', 'A'), card('clubs', 'A'), card('spades', 'K'), card('hearts', 'K')),
	},
	{
		name: 'Full House with joker beats Flush',
		winning: hand(card('hearts', '8'), card('diamonds', '8'), card('clubs', '4'), card('spades', '4'), joker()),
		losing: hand(card('hearts', 'A'), card('hearts', 'K'), card('hearts', 'Q'), card('hearts', 'J'), card('hearts', '9')),
	},
	{
		name: 'Three of a Kind with joker beats Two Pair',
		winning: hand(card('hearts', '5'), card('diamonds', '5'), joker(), card('spades', 'K'), card('hearts', 'Q')),
		losing: hand(card('hearts', 'A'), card('diamonds', 'A'), card('clubs', 'K'), card('spades', 'K'), card('hearts', 'Q')),
	},
	{
		name: 'One Pair with joker beats High Card',
		winning: hand(card('hearts', 'A'), joker(), card('clubs', 'K'), card('spades', 'Q'), card('hearts', 'J')),
		losing: hand(card('hearts', 'A'), card('diamonds', 'K'), card('clubs', 'Q'), card('spades', 'J'), card('hearts', '9')),
	},
];

// Joker tie-breaking test cases
const jokerTieBreakingTestCases = [
	{
		name: 'Five of a Kind - Higher rank wins',
		winning: hand(card('hearts', 'A'), card('diamonds', 'A'), card('clubs', 'A'), card('spades', 'A'), joker()),
		losing: hand(card('hearts', 'K'), card('diamonds', 'K'), card('clubs', 'K'), card('spades', 'K'), joker()),
	},
	{
		name: 'Four of a Kind with joker - Higher four wins',
		winning: hand(card('hearts', 'A'), card('diamonds', 'A'), card('clubs', 'A'), joker(), card('hearts', '2')),
		losing: hand(card('hearts', 'K'), card('diamonds', 'K'), card('clubs', 'K'), joker(), card('hearts', 'A')),
	},
	{
		name: 'Three of a Kind with joker - Higher three wins',
		winning: hand(card('hearts', 'A'), card('diamonds', 'A'), joker(), card('spades', 'K'), card('hearts', 'Q')),
		losing: hand(card('hearts', 'K'), card('diamonds', 'K'), joker(), card('spades', 'A'), card('hearts', 'Q')),
	},
	{
		name: 'Three of a Kind with joker (pair of Aces) beats Three of a Kind 2s',
		winning: hand(card('hearts', 'A'), card('diamonds', 'A'), joker(), card('spades', 'K'), card('hearts', 'Q')),
		losing: hand(card('hearts', '2'), card('diamonds', '2'), card('clubs', '2'), card('spades', 'K'), card('hearts', 'Q')),
	},
];

// Edge case test cases
const edgeCaseTestCases = [
	{
		name: 'Identical hands should have same value',
		hand1: hand(card('hearts', 'A'), card('diamonds', 'K'), card('clubs', 'Q'), card('spades', 'J'), card('hearts', '10')),
		hand2: hand(card('spades', 'A'), card('clubs', 'K'), card('diamonds', 'Q'), card('hearts', 'J'), card('clubs', '10')),
	},
	{
		name: 'Wheel straight flush value is correct',
		hand: hand(card('hearts', 'A'), card('hearts', '5'), card('hearts', '4'), card('hearts', '3'), card('hearts', '2')),
		expectedType: 'Straight Flush',
		expectedValue: 8000005,
	},
	{
		name: 'Wheel straight (non-flush) value is correct',
		hand: hand(card('hearts', 'A'), card('diamonds', '5'), card('clubs', '4'), card('spades', '3'), card('hearts', '2')),
		expectedType: 'Straight',
		expectedValue: 4000005,
	},
];

// Basic utility function tests
test('getRankValue', () => {
	expect(getRankValue('A')).toBe(14);
	expect(getRankValue('K')).toBe(13);
	expect(getRankValue('Q')).toBe(12);
	expect(getRankValue('J')).toBe(11);
	expect(getRankValue('10')).toBe(10);
	expect(getRankValue('2')).toBe(2);
	expect(getRankValue('Joker')).toBe(15);
});

test('getRankName', () => {
	expect(getRankName(14)).toBe('Ace');
	expect(getRankName(13)).toBe('King');
	expect(getRankName(12)).toBe('Queen');
	expect(getRankName(11)).toBe('Jack');
	expect(getRankName(10)).toBe('10');
	expect(getRankName(2)).toBe('2');
	expect(getRankName(15)).toBe('Joker');
});

// Individual hand type tests
test.each(handTypeTestCases)('$name', ({ hand: testHand, expectedType, expectedValue, valueRange, expectedDescription, descriptionContains }) => {
	const result = evaluateHand(testHand);
	expect(result.type).toBe(expectedType);
	
	if (expectedValue !== undefined) {
		expect(result.value).toBe(expectedValue);
	}
	
	if (valueRange) {
		if (valueRange.min !== undefined) {
			expect(result.value).toBeGreaterThanOrEqual(valueRange.min);
		}
		if (valueRange.max !== undefined) {
			expect(result.value).toBeLessThan(valueRange.max);
		}
	}
	
	if (expectedDescription) {
		expect(result.description).toBe(expectedDescription);
	}
	
	if (descriptionContains) {
		expect(result.description).toContain(descriptionContains);
	}
});

// Cross-hand-type comparison tests
test.each(crossTypeTestCases)('$name', ({ winning, losing }) => {
	const winningResult = evaluateHand(winning);
	const losingResult = evaluateHand(losing);
	expect(winningResult.value).toBeGreaterThan(losingResult.value);
});

// Tie-breaking tests (same hand type)
test.each(tieBreakingTestCases)('$name', ({ winning, losing }) => {
	const winningResult = evaluateHand(winning);
	const losingResult = evaluateHand(losing);
	expect(winningResult.value).toBeGreaterThan(losingResult.value);
});

// Joker hand type tests
test.each(jokerTestCases)('$name', ({ hand: testHand, expectedType, expectedValue, valueRange, descriptionContains }) => {
	const result = evaluateHand(testHand);
	expect(result.type).toBe(expectedType);
	
	if (expectedValue !== undefined) {
		expect(result.value).toBe(expectedValue);
	}
	
	if (valueRange) {
		if (valueRange.min !== undefined) {
			expect(result.value).toBeGreaterThanOrEqual(valueRange.min);
		}
		if (valueRange.max !== undefined) {
			expect(result.value).toBeLessThan(valueRange.max);
		}
	}
	
	if (descriptionContains) {
		expect(result.description).toContain(descriptionContains);
	}
});

// Joker cross-hand-type comparison tests
test.each(jokerCrossTypeTestCases)('$name', ({ winning, losing }) => {
	const winningResult = evaluateHand(winning);
	const losingResult = evaluateHand(losing);
	expect(winningResult.value).toBeGreaterThan(losingResult.value);
});

// Joker tie-breaking tests
test.each(jokerTieBreakingTestCases)('$name', ({ winning, losing }) => {
	const winningResult = evaluateHand(winning);
	const losingResult = evaluateHand(losing);
	expect(winningResult.value).toBeGreaterThan(losingResult.value);
});

// Edge case tests
test.each(edgeCaseTestCases)('$name', (testCase) => {
	if ('hand1' in testCase && 'hand2' in testCase) {
		// Identical hands test
		const result1 = evaluateHand(testCase.hand1);
		const result2 = evaluateHand(testCase.hand2);
		expect(result1.value).toBe(result2.value);
	} else if ('hand' in testCase) {
		// Single hand edge case test
		const result = evaluateHand(testCase.hand);
		if (testCase.expectedType) {
			expect(result.type).toBe(testCase.expectedType);
		}
		if (testCase.expectedValue !== undefined) {
			expect(result.value).toBe(testCase.expectedValue);
		}
	}
});

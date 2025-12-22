/**
 * Konami code detection and handler
 */

const KONAMI_CODE = [
	'ArrowUp',
	'ArrowUp',
	'ArrowDown',
	'ArrowDown',
	'ArrowLeft',
	'ArrowRight',
	'ArrowLeft',
	'ArrowRight',
	'KeyB',
	'KeyA',
];

let konamiSequence: string[] = [];

export function initKonamiCode(): void {
	document.addEventListener('keydown', (e) => {
		konamiSequence.push(e.code);
		
		// Keep only the last N keys
		if (konamiSequence.length > KONAMI_CODE.length) {
			konamiSequence.shift();
		}
		
		// Check if sequence matches
		if (konamiSequence.length === KONAMI_CODE.length) {
			let matches = true;
			for (let i = 0; i < KONAMI_CODE.length; i++) {
				if (konamiSequence[i] !== KONAMI_CODE[i]) {
					matches = false;
					break;
				}
			}
			
			if (matches) {
				// Trigger solidarity overlay
				window.dispatchEvent(new CustomEvent('konami-code-activated'));
				konamiSequence = []; // Reset sequence
			}
		}
	});
}

// Auto-initialize if in browser
if (typeof window !== 'undefined') {
	initKonamiCode();
}

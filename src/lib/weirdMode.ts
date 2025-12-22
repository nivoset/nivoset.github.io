/**
 * Weird Mode toggle for AI & Automation page
 * Changes color scheme and reveals surreal prompt options
 */

export function initWeirdMode(): void {
	const toggle = document.getElementById('weird-mode-toggle');
	const container = document.body;
	
	if (toggle) {
		const isWeird = localStorage.getItem('weird-mode') === 'true';
		
		if (isWeird) {
			container.classList.add('weird-mode');
			toggle.setAttribute('aria-pressed', 'true');
		}
		
		toggle.addEventListener('click', () => {
			const isActive = container.classList.toggle('weird-mode');
			toggle.setAttribute('aria-pressed', String(isActive));
			localStorage.setItem('weird-mode', String(isActive));
			
			// Reveal surreal prompts
			const surrealPrompts = document.querySelectorAll('.surreal-prompt');
			surrealPrompts.forEach((prompt) => {
				if (isActive) {
					prompt.classList.remove('hidden');
				} else {
					prompt.classList.add('hidden');
				}
			});
		});
	}
}


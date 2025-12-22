/**
 * Tooltip system for interactive easter eggs and hover tooltips
 */

export interface TooltipConfig {
	selector: string;
	text: string;
	position?: 'top' | 'bottom' | 'left' | 'right';
}

export function initTooltips(configs: TooltipConfig[]): void {
	configs.forEach((config) => {
		const elements = document.querySelectorAll(config.selector);
		elements.forEach((element) => {
			if (element instanceof HTMLElement) {
				element.setAttribute('data-tooltip', config.text);
				element.classList.add('tooltip');
				
				// Add aria-label for accessibility
				if (!element.getAttribute('aria-label')) {
					element.setAttribute('aria-label', `${element.textContent}. ${config.text}`);
				}
			}
		});
	});
}

export function createEasterEggTooltip(
	element: HTMLElement,
	text: string,
	trigger: 'hover' | 'click' = 'hover'
): void {
	element.setAttribute('data-tooltip', text);
	element.classList.add('tooltip');
	element.setAttribute('role', 'button');
	element.setAttribute('tabindex', '0');
	
	if (trigger === 'click') {
		element.addEventListener('click', () => {
			// Show tooltip on click
			const tooltip = document.createElement('div');
			tooltip.className = 'fixed bg-graphite-black text-warmlight-sand p-3 rounded shadow-lg z-50 max-w-xs';
			tooltip.textContent = text;
			tooltip.setAttribute('role', 'tooltip');
			
			const rect = element.getBoundingClientRect();
			tooltip.style.left = `${rect.left + rect.width / 2}px`;
			tooltip.style.top = `${rect.top - 10}px`;
			tooltip.style.transform = 'translate(-50%, -100%)';
			
			document.body.appendChild(tooltip);
			
			setTimeout(() => {
				tooltip.remove();
			}, 3000);
		});
	}
}


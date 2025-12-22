/** @type {import('tailwindcss').Config} */
export default {
	theme: {
		extend: {
			colors: {
				// Primary colors
				'storm-slate': '#1B1E26',
				'federal-gray': '#2C2F38',
				'union-red': '#D7423C',
				'worker-gold': '#E3C46F',
				'technocrat-purple': '#B39DFF',
				// Secondary colors
				'fog-blue': '#8EAAC9',
				'ominous-teal': '#4E8C82',
				'warmlight-sand': '#F1EDE5',
				'graphite-black': '#0E0F11',
				// Fun extras
				'bear-bear-brown': '#7B5A3E',
				'coffee-emergency-amber': '#F4A259',
				'spreadsheet-green': '#94C973',
			},
			fontFamily: {
				'heading': ['JetBrains Mono', 'Space Grotesk', 'monospace'],
				'heading-alt': ['Space Grotesk', 'JetBrains Mono', 'sans-serif'],
				'body': ['Inter', 'Roboto', 'system-ui', 'sans-serif'],
				'body-alt': ['Roboto', 'Inter', 'system-ui', 'sans-serif'],
				'mono': ['JetBrains Mono', 'monospace'],
			},
			animation: {
				'fade-in': 'fadeIn 0.3s ease-in-out',
				'fade-out': 'fadeOut 0.3s ease-in-out',
				'slide-up': 'slideUp 0.3s ease-out',
				'slide-down': 'slideDown 0.3s ease-out',
				'pulse-subtle': 'pulseSubtle 2s ease-in-out infinite',
				'wiggle': 'wiggle 0.5s ease-in-out',
			},
			keyframes: {
				fadeIn: {
					'0%': { opacity: '0' },
					'100%': { opacity: '1' },
				},
				fadeOut: {
					'0%': { opacity: '1' },
					'100%': { opacity: '0' },
				},
				slideUp: {
					'0%': { transform: 'translateY(10px)', opacity: '0' },
					'100%': { transform: 'translateY(0)', opacity: '1' },
				},
				slideDown: {
					'0%': { transform: 'translateY(-10px)', opacity: '0' },
					'100%': { transform: 'translateY(0)', opacity: '1' },
				},
				pulseSubtle: {
					'0%, 100%': { opacity: '1' },
					'50%': { opacity: '0.8' },
				},
				wiggle: {
					'0%, 100%': { transform: 'rotate(0deg)' },
					'25%': { transform: 'rotate(-3deg)' },
					'75%': { transform: 'rotate(3deg)' },
				},
			},
		},
	},
};


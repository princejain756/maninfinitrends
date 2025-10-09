import type { Config } from "tailwindcss";

export default {
	darkMode: ["class"],
	content: [
		"./pages/**/*.{ts,tsx}",
		"./components/**/*.{ts,tsx}",
		"./app/**/*.{ts,tsx}",
		"./src/**/*.{ts,tsx}",
	],
	prefix: "",
	theme: {
		container: {
			center: true,
			padding: '2rem',
			screens: {
				'2xl': '1400px'
			}
		},
		extend: {
			fontFamily: {
				'cormorant': ['Cormorant Garamond', 'serif'],
				'inter': ['Inter', 'sans-serif'],
			},
			colors: {
				// Maninfini Brand Colors
				'mnf-maroon': 'hsl(var(--mnf-maroon))',
				'mnf-ivory': 'hsl(var(--mnf-ivory))',
				'mnf-ink': 'hsl(var(--mnf-ink))',
				'mnf-gold': 'hsl(var(--mnf-gold))',
				'mnf-leaf': 'hsl(var(--mnf-leaf))',
				
				// Semantic Colors
				border: 'hsl(var(--border))',
				input: 'hsl(var(--input))',
				ring: 'hsl(var(--ring))',
				background: 'hsl(var(--background))',
				foreground: 'hsl(var(--foreground))',
				primary: {
					DEFAULT: 'hsl(var(--primary))',
					foreground: 'hsl(var(--primary-foreground))'
				},
				secondary: {
					DEFAULT: 'hsl(var(--secondary))',
					foreground: 'hsl(var(--secondary-foreground))'
				},
				destructive: {
					DEFAULT: 'hsl(var(--destructive))',
					foreground: 'hsl(var(--destructive-foreground))'
				},
				muted: {
					DEFAULT: 'hsl(var(--muted))',
					foreground: 'hsl(var(--muted-foreground))'
				},
				accent: {
					DEFAULT: 'hsl(var(--accent))',
					foreground: 'hsl(var(--accent-foreground))'
				},
				popover: {
					DEFAULT: 'hsl(var(--popover))',
					foreground: 'hsl(var(--popover-foreground))'
				},
				card: {
					DEFAULT: 'hsl(var(--card))',
					foreground: 'hsl(var(--card-foreground))'
				},
				sidebar: {
					DEFAULT: 'hsl(var(--sidebar-background))',
					foreground: 'hsl(var(--sidebar-foreground))',
					primary: 'hsl(var(--sidebar-primary))',
					'primary-foreground': 'hsl(var(--sidebar-primary-foreground))',
					accent: 'hsl(var(--sidebar-accent))',
					'accent-foreground': 'hsl(var(--sidebar-accent-foreground))',
					border: 'hsl(var(--sidebar-border))',
					ring: 'hsl(var(--sidebar-ring))'
				}
			},
			borderRadius: {
				lg: 'var(--radius)',
				md: 'calc(var(--radius) - 2px)',
				sm: 'calc(var(--radius) - 4px)'
			},
			keyframes: {
				'accordion-down': {
					from: { height: '0' },
					to: { height: 'var(--radix-accordion-content-height)' }
				},
				'accordion-up': {
					from: { height: 'var(--radix-accordion-content-height)' },
					to: { height: '0' }
				},
				'silk-wave': {
					'0%, 100%': { transform: 'translateY(0px) rotate(0deg) scale(1)' },
					'25%': { transform: 'translateY(-15px) rotate(1.5deg) scale(1.02)' },
					'50%': { transform: 'translateY(-5px) rotate(-1deg) scale(0.98)' },
					'75%': { transform: 'translateY(10px) rotate(0.5deg) scale(1.01)' }
				},
				'silk-shimmer': {
					'0%, 100%': { transform: 'translateX(-100%) rotate(45deg)' },
					'50%': { transform: 'translateX(100%) rotate(45deg)' }
				},
				'mesh-flow': {
					'0%, 100%': { transform: 'rotate(0deg) scale(1)' },
					'33%': { transform: 'rotate(120deg) scale(1.1)' },
					'66%': { transform: 'rotate(240deg) scale(0.9)' }
				},
				'fade-in-up': {
					'0%': { opacity: '0', transform: 'translateY(40px) scale(0.95)' },
					'100%': { opacity: '1', transform: 'translateY(0) scale(1)' }
				},
				'fade-in-scale': {
					'0%': { opacity: '0', transform: 'scale(0.8) rotate(-5deg)' },
					'100%': { opacity: '1', transform: 'scale(1) rotate(0deg)' }
				},
				'float': {
					'0%, 100%': { transform: 'translateY(0px) translateX(0px) rotate(0deg)' },
					'33%': { transform: 'translateY(-20px) translateX(5px) rotate(1deg)' },
					'66%': { transform: 'translateY(-10px) translateX(-3px) rotate(-0.5deg)' }
				},
				'spiral-float': {
					'0%': { transform: 'translateY(0px) rotate(0deg)' },
					'25%': { transform: 'translateY(-15px) rotate(90deg)' },
					'50%': { transform: 'translateY(-30px) rotate(180deg)' },
					'75%': { transform: 'translateY(-15px) rotate(270deg)' },
					'100%': { transform: 'translateY(0px) rotate(360deg)' }
				},
				'shimmer': {
					'0%': { backgroundPosition: '-200% 0' },
					'100%': { backgroundPosition: '200% 0' }
				},
				'pulse-glow': {
					'0%, 100%': { 
						boxShadow: '0 0 10px hsl(var(--mnf-gold) / 0.3), 0 0 20px hsl(var(--mnf-gold) / 0.1)',
						transform: 'scale(1)'
					},
					'50%': { 
						boxShadow: '0 0 25px hsl(var(--mnf-gold) / 0.6), 0 0 40px hsl(var(--mnf-gold) / 0.3), 0 0 60px hsl(var(--mnf-gold) / 0.1)',
						transform: 'scale(1.05)'
					}
				},
				'luxury-entrance': {
					'0%': { 
						opacity: '0', 
						transform: 'translateY(60px) scale(0.8) rotateX(15deg)',
						filter: 'blur(10px)'
					},
					'100%': { 
						opacity: '1', 
						transform: 'translateY(0) scale(1) rotateX(0deg)',
						filter: 'blur(0px)'
					}
				},
				'cinematic-zoom': {
					'0%': { transform: 'scale(1.2) translateZ(0)' },
					'100%': { transform: 'scale(1) translateZ(0)' }
				},
				'particle-dance': {
					'0%, 100%': { transform: 'translateY(0px) translateX(0px) rotate(0deg) scale(1)' },
					'25%': { transform: 'translateY(-30px) translateX(15px) rotate(90deg) scale(1.1)' },
					'50%': { transform: 'translateY(-20px) translateX(-20px) rotate(180deg) scale(0.9)' },
					'75%': { transform: 'translateY(-35px) translateX(10px) rotate(270deg) scale(1.05)' }
				}
			},
			animation: {
				'accordion-down': 'accordion-down 0.2s ease-out',
				'accordion-up': 'accordion-up 0.2s ease-out',
				'silk-wave': 'silk-wave 8s ease-in-out infinite',
				'silk-shimmer': 'silk-shimmer 3s ease-in-out infinite',
				'mesh-flow': 'mesh-flow 20s linear infinite',
				'fade-in-up': 'fade-in-up 0.8s cubic-bezier(0.25, 0.8, 0.25, 1)',
				'fade-in-scale': 'fade-in-scale 0.6s cubic-bezier(0.25, 0.8, 0.25, 1)',
				'float': 'float 4s ease-in-out infinite',
				'spiral-float': 'spiral-float 8s ease-in-out infinite',
				'shimmer': 'shimmer 3s linear infinite',
				'pulse-glow': 'pulse-glow 3s ease-in-out infinite',
				'luxury-entrance': 'luxury-entrance 1.2s cubic-bezier(0.25, 0.8, 0.25, 1)',
				'cinematic-zoom': 'cinematic-zoom 2s cubic-bezier(0.25, 0.8, 0.25, 1)',
				'particle-dance': 'particle-dance 6s ease-in-out infinite'
			},
			boxShadow: {
				'soft': 'var(--shadow-soft)',
				'elegant': 'var(--shadow-elegant)',
				'luxury': 'var(--shadow-luxury)',
				'glow': 'var(--shadow-glow)',
				'silk': 'var(--shadow-silk)'
			},
			backdropBlur: {
				'xs': '2px',
				'3xl': '64px'
			}
		}
	},
	plugins: [require("tailwindcss-animate")],
} satisfies Config;

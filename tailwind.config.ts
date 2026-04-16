import type { Config } from 'tailwindcss'
import animatePlugin from 'tailwindcss-animate'
import typographyPlugin from '@tailwindcss/typography'
import aspectRatioPlugin from '@tailwindcss/aspect-ratio'

export default {
  darkMode: ['class'],
  content: [
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
    './src/**/*.{ts,tsx}',
  ],
  prefix: '',
  theme: {
    container: {
      center: true,
      padding: '2rem',
      screens: {
        sm: '640px',
        md: '768px',
        lg: '1024px',
        xl: '1280px',
        '2xl': '1350px',
      },
    },
    extend: {
      fontFamily: {
        sans: ['Figtree', 'system-ui', 'sans-serif'],
        display: ['Figtree', 'system-ui', 'sans-serif'],
      },
      fontWeight: {
        normal: '400',
        medium: '500',
        semibold: '600',
        bold: '600',
      },
      colors: {
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))',
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))',
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))',
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))',
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))',
        },
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))',
        },
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))',
        },
        av: {
          bg: 'hsl(var(--av-bg))',
          surface: 'hsl(var(--av-surface))',
          'surface-2': 'hsl(var(--av-surface-2))',
          border: 'hsl(var(--av-border))',
          wm: 'hsl(var(--av-wm-fill))',
          text: 'hsl(var(--av-text-primary))',
          'text-secondary': 'hsl(var(--av-text-secondary))',
          'text-muted': 'hsl(var(--av-text-muted))',
          amber: 'hsl(var(--av-amber))',
          orange: 'hsl(var(--av-orange))',
          coral: 'hsl(var(--av-coral))',
          'cta-orange': 'hsl(var(--av-cta-orange))',
          'cta-red': 'hsl(var(--av-cta-red))',
        },
      },
      backgroundImage: {
        'av-gradient': 'var(--av-gradient-text)',
        'av-cta': 'var(--av-gradient-cta)',
      },
      borderRadius: {
        lg: 'var(--radius)',             /* 12px */
        md: 'calc(var(--radius) - 4px)', /* 8px  */
        sm: 'calc(var(--radius) - 6px)', /* 6px  (botões AV) */
        xl: 'calc(var(--radius) + 4px)', /* 16px */
      },
      boxShadow: {
        subtle: '0 1px 3px 0 rgba(0, 0, 0, 0.3), 0 1px 2px -1px rgba(0, 0, 0, 0.2)',
        elevation: '0 10px 30px -5px rgba(0, 0, 0, 0.5)',
        'av-glow': '0 0 38px 0 #fc8338',
      },
      keyframes: {
        'marquee-up': {
          '0%': { transform: 'translateY(0%)' },
          '100%': { transform: 'translateY(-50%)' },
        },
      },
      animation: {
        'marquee-up': 'marquee-up 35s linear infinite',
      },
    },
  },
  plugins: [animatePlugin, typographyPlugin, aspectRatioPlugin],
} satisfies Config

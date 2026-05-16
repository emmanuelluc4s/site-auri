import type { Config } from 'tailwindcss'

const config: Config = {
  darkMode: 'class',
  content: [
    './index.html',
    './src/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        gold: {
          50:  '#FBF6E9',
          100: '#F5E9C4',
          200: '#EBD394',
          300: '#E0BC63',
          400: '#D4A53A',
          500: '#C9962C', // dourado base da logo AURI
          600: '#A87B22',
          700: '#876119',
          800: '#664810',
          900: '#3D2B08',
        },
        ink: {
          50:  '#F5F5F5',
          100: '#E5E5E5',
          200: '#C4C4C4',
          300: '#9E9E9E',
          400: '#6E6E6E',
          500: '#3F3F3F',
          600: '#2A2A2A',
          700: '#1A1A1A',
          800: '#0F0F0F', // preto da logo
          900: '#000000', // preto absoluto
        },
        success: '#1F8A4C',
        danger:  '#B23A48',
        warning: '#D4A53A',
        info:    '#5A6E8C',

        // Tokens semânticos via CSS vars (compatível com shadcn/ui).
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
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))',
        },
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))',
        },
      },
      fontFamily: {
        serif: ['"Playfair Display"', 'Georgia', 'serif'],
        sans:  ['Inter', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        'gold-glow':    '0 0 24px -4px rgba(201, 150, 44, 0.35)',
        'gold-glow-sm': '0 0 12px -2px rgba(201, 150, 44, 0.25)',
        'soft':         '0 4px 24px -8px rgba(0, 0, 0, 0.15)',
        'soft-lg':      '0 12px 48px -12px rgba(0, 0, 0, 0.25)',
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },
      animation: {
        'fade-in':    'fadeIn 0.5s ease-out',
        'fade-in-up': 'fadeInUp 0.6s ease-out',
        'shimmer':    'shimmer 2.5s linear infinite',
      },
      keyframes: {
        fadeIn: {
          '0%':   { opacity: '0' },
          '100%': { opacity: '1' },
        },
        fadeInUp: {
          '0%':   { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        shimmer: {
          '0%':   { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
      },
      transitionDuration: {
        '400': '400ms',
      },
    },
  },
  plugins: [],
}

export default config

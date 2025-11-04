import type { Config } from 'tailwindcss';
import animatePlugin from 'tailwindcss-animate';

const config: Config = {
  content: ['app/**/*.{ts,tsx}', 'components/**/*.{ts,tsx}', 'lib/**/*.{ts,tsx}'],
  theme: {
    container: {
      center: true,
      padding: {
        DEFAULT: '1.25rem',
        lg: '2rem'
      },
      screens: {
        '2xl': '1400px'
      }
    },
    extend: {
      borderRadius: {
        lg: '1.125rem',
        xl: '1.5rem',
        '2xl': '2rem'
      },
      colors: {
        brand: {
          DEFAULT: '#09090b',
          foreground: '#ffffff',
          accent: '#ff6f61'
        }
      },
      fontFamily: {
        display: ['var(--font-satoshi)', 'system-ui'],
        sans: ['var(--font-inter)', 'system-ui']
      },
      boxShadow: {
        soft: '0 15px 45px -30px rgba(15, 23, 42, 0.45)',
        focus: '0 0 0 3px rgba(255, 111, 97, 0.35)'
      },
      keyframes: {
        'accordion-down': {
          from: { height: '0' },
          to: { height: 'var(--radix-accordion-content-height)' }
        },
        'accordion-up': {
          from: { height: 'var(--radix-accordion-content-height)' },
          to: { height: '0' }
        }
      },
      animation: {
        'accordion-down': 'accordion-down 0.25s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out'
      }
    }
  },
  plugins: [animatePlugin]
};

export default config;

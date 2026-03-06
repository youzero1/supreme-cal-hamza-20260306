import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          purple: '#8B5CF6',
          blue: '#3B82F6',
          pink: '#EC4899',
          dark: '#0F0F1A',
          card: '#1A1A2E',
          surface: '#16213E',
          border: '#2D2D4E',
        },
      },
      backgroundImage: {
        'gradient-brand': 'linear-gradient(135deg, #8B5CF6 0%, #3B82F6 100%)',
        'gradient-pink': 'linear-gradient(135deg, #EC4899 0%, #8B5CF6 100%)',
      },
      animation: {
        'press': 'press 0.1s ease-in-out',
        'fade-in': 'fadeIn 0.3s ease-in-out',
        'slide-up': 'slideUp 0.3s ease-out',
      },
      keyframes: {
        press: {
          '0%, 100%': { transform: 'scale(1)' },
          '50%': { transform: 'scale(0.95)' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
      },
    },
  },
  plugins: [],
};

export default config;

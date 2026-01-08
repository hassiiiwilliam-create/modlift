/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{js,jsx,ts,tsx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        display: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      colors: {
        // Premium Stealth Theme - Deep blacks with electric lime accent

        // Primary backgrounds - Deep, rich blacks
        night: {
          50: '#f7f7f7',
          100: '#e3e3e3',
          200: '#c8c8c8',
          300: '#a4a4a4',
          400: '#818181',
          500: '#666666',
          600: '#515151',
          700: '#434343',
          800: '#383838',
          900: '#1a1a1a',
          950: '#0a0a0a',
        },

        // Primary accent - Electric Lime (performance, energy)
        lime: {
          50: '#fefff0',
          100: '#fcffd6',
          200: '#f7ffab',
          300: '#eeff70',
          400: '#e2ff3d',
          500: '#d4ff00', // Primary accent
          600: '#a8cc00',
          700: '#7f9900',
          800: '#647a00',
          900: '#526606',
          950: '#2d3900',
        },

        // Secondary accent - Cool gray (sophisticated, clean)
        slate: {
          50: '#f8fafc',
          100: '#f1f5f9',
          200: '#e2e8f0',
          300: '#cbd5e1',
          400: '#94a3b8',
          500: '#6b7280', // Primary text gray
          600: '#475569',
          700: '#374151',
          800: '#1f2937',
          900: '#111827',
          950: '#030712',
        },

        // Success - Mint green
        mint: {
          50: '#ecfdf5',
          100: '#d1fae5',
          200: '#a7f3d0',
          300: '#6ee7b7',
          400: '#34d399',
          500: '#10b981',
          600: '#059669',
          700: '#047857',
          800: '#065f46',
          900: '#064e3b',
          950: '#022c22',
        },

        // Error/Warning - Coral red
        coral: {
          50: '#fff1f2',
          100: '#ffe4e6',
          200: '#fecdd3',
          300: '#fda4af',
          400: '#fb7185',
          500: '#f43f5e',
          600: '#e11d48',
          700: '#be123c',
          800: '#9f1239',
          900: '#881337',
          950: '#4c0519',
        },

        // Info - Electric blue
        electric: {
          50: '#eff6ff',
          100: '#dbeafe',
          200: '#bfdbfe',
          300: '#93c5fd',
          400: '#60a5fa',
          500: '#3b82f6',
          600: '#2563eb',
          700: '#1d4ed8',
          800: '#1e40af',
          900: '#1e3a8a',
          950: '#172554',
        },

        // Legacy mappings for backwards compatibility
        steel: {
          50: '#f7f7f7',
          100: '#e3e3e3',
          200: '#c8c8c8',
          300: '#a4a4a4',
          400: '#818181',
          500: '#6b7280',
          600: '#515151',
          700: '#434343',
          800: '#383838',
          900: '#1a1a1a',
          950: '#0a0a0a',
        },
        carbon: {
          50: '#f7f7f7',
          100: '#e3e3e3',
          200: '#c8c8c8',
          300: '#a4a4a4',
          400: '#818181',
          500: '#666666',
          600: '#515151',
          700: '#434343',
          800: '#27272a',
          900: '#18181b',
          950: '#09090b',
        },
        flame: {
          50: '#fefff0',
          100: '#fcffd6',
          200: '#f7ffab',
          300: '#eeff70',
          400: '#e2ff3d',
          500: '#d4ff00',
          600: '#a8cc00',
          700: '#7f9900',
          800: '#647a00',
          900: '#526606',
          950: '#2d3900',
        },
        volt: {
          50: '#fefff0',
          100: '#fcffd6',
          200: '#f7ffab',
          300: '#eeff70',
          400: '#e2ff3d',
          500: '#d4ff00',
          600: '#a8cc00',
          700: '#7f9900',
          800: '#647a00',
          900: '#526606',
          950: '#2d3900',
        },
        torque: {
          50: '#ecfdf5',
          100: '#d1fae5',
          200: '#a7f3d0',
          300: '#6ee7b7',
          400: '#34d399',
          500: '#10b981',
          600: '#059669',
          700: '#047857',
          800: '#065f46',
          900: '#064e3b',
          950: '#022c22',
        },
        redline: {
          50: '#fff1f2',
          100: '#ffe4e6',
          200: '#fecdd3',
          300: '#fda4af',
          400: '#fb7185',
          500: '#f43f5e',
          600: '#e11d48',
          700: '#be123c',
          800: '#9f1239',
          900: '#881337',
          950: '#4c0519',
        },

        // Brand colors
        brand: {
          primary: '#d4ff00',
          accent: '#d4ff00',
          gray: '#6b7280',
          background: '#0a0a0a',
          dark: '#050505',
          success: '#10b981',
          error: '#f43f5e',
        },
      },
      spacing: {
        'header': '80px',
        '18': '4.5rem',
        '88': '22rem',
        '128': '32rem',
      },
      borderRadius: {
        '4xl': '2rem',
        '5xl': '2.5rem',
      },
      boxShadow: {
        'card': '0 4px 20px rgba(0, 0, 0, 0.25)',
        'card-hover': '0 8px 40px rgba(0, 0, 0, 0.4)',
        'glow-lime': '0 0 40px rgba(212, 255, 0, 0.3)',
        'glow-lime-sm': '0 0 20px rgba(212, 255, 0, 0.2)',
        'glow-lime-lg': '0 0 60px rgba(212, 255, 0, 0.4)',
        // Legacy mappings
        'glow-flame': '0 0 40px rgba(212, 255, 0, 0.3)',
        'glow-volt': '0 0 40px rgba(212, 255, 0, 0.3)',
        'inner-highlight': 'inset 0 1px 0 rgba(255, 255, 255, 0.05)',
        'brutal': '4px 4px 0 rgba(0, 0, 0, 0.9)',
        'brutal-sm': '2px 2px 0 rgba(0, 0, 0, 0.9)',
        'glass': '0 8px 32px rgba(0, 0, 0, 0.5)',
        'inner-glow': 'inset 0 0 20px rgba(212, 255, 0, 0.1)',
      },
      backgroundImage: {
        'grid-pattern': 'linear-gradient(to right, rgba(255,255,255,0.02) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.02) 1px, transparent 1px)',
        'gradient-radial': 'radial-gradient(ellipse at center, var(--tw-gradient-stops))',
        'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
        'mesh-gradient': 'linear-gradient(135deg, #0a0a0a 0%, #1a1a1a 50%, #0a0a0a 100%)',
        'carbon-fiber': 'repeating-linear-gradient(45deg, transparent, transparent 2px, rgba(255,255,255,0.01) 2px, rgba(255,255,255,0.01) 4px)',
        'steel-brush': 'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.01) 50%, transparent 100%)',
        'lime-gradient': 'linear-gradient(135deg, #d4ff00 0%, #a8cc00 100%)',
        'dark-gradient': 'linear-gradient(180deg, #0a0a0a 0%, #1a1a1a 100%)',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(12px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        fadeInUp: {
          '0%': { opacity: '0', transform: 'translateY(24px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideInRight: {
          '0%': { opacity: '0', transform: 'translateX(-24px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        scaleIn: {
          '0%': { opacity: '0', transform: 'scale(0.95)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        pulse: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.7' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-8px)' },
        },
        revEngine: {
          '0%': { transform: 'scale(1)' },
          '50%': { transform: 'scale(1.02)' },
          '100%': { transform: 'scale(1)' },
        },
        glow: {
          '0%, 100%': { boxShadow: '0 0 20px rgba(212, 255, 0, 0.4)' },
          '50%': { boxShadow: '0 0 40px rgba(212, 255, 0, 0.6)' },
        },
        glowPulse: {
          '0%, 100%': { opacity: '1', filter: 'brightness(1)' },
          '50%': { opacity: '0.8', filter: 'brightness(1.2)' },
        },
      },
      animation: {
        'fadeIn': 'fadeIn 0.5s ease-out both',
        'fadeInUp': 'fadeInUp 0.6s ease-out both',
        'slideInRight': 'slideInRight 0.5s ease-out both',
        'scaleIn': 'scaleIn 0.4s ease-out both',
        'shimmer': 'shimmer 2s infinite linear',
        'pulse-slow': 'pulse 3s ease-in-out infinite',
        'float': 'float 3s ease-in-out infinite',
        'rev': 'revEngine 0.3s ease-in-out',
        'glow': 'glow 2s ease-in-out infinite',
        'glow-pulse': 'glowPulse 2s ease-in-out infinite',
      },
      backdropBlur: {
        xs: '2px',
      },
      transitionDuration: {
        '400': '400ms',
      },
      transitionTimingFunction: {
        'bounce-in': 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
        'smooth': 'cubic-bezier(0.4, 0, 0.2, 1)',
      },
    },
  },
  plugins: [],
}

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    screens: {
      'xs': '360px',
      'sm': '640px',
      'md': '768px',
      'tab': '820px',
      'lg': '1024px',
      'xl': '1280px',
      '2xl': '1440px',
      '3xl': '1920px',
      '4xl': '2560px',
    },
    extend: {
      colors: {
        espresso: {
          950: '#0B0705',
          900: '#140D09',
          850: '#1B120C',
          800: '#231710',
          700: '#322218',
          600: '#453022',
        },
        roast: {
          900: '#20140D',
          800: '#2C1C13',
          700: '#3B271A',
          600: '#4D3424',
          500: '#634430',
        },
        cream: {
          50: '#FAF8F5',
          100: '#F5EFEB',
          200: '#EBE1D7',
          300: '#DDD0C3',
          400: '#CCBAA9',
        },
        beige: {
          100: '#EFE7DE',
          200: '#E2D5C7',
          300: '#D2C1AF',
          400: '#BEA893',
          500: '#A99079',
        },
        caramel: {
          300: '#E6B074',
          400: '#D99B57',
          500: '#C88A4A',
          600: '#AB7137',
          700: '#8A5626',
        },
        copper: {
          300: '#E4986E',
          400: '#D38053',
          500: '#B86B43',
          600: '#9C5531',
          700: '#7E4122',
        },
        charcoal: {
          950: '#0E0E0E',
          900: '#151515',
          800: '#1F1F1F',
          700: '#2C2C2C',
          600: '#3D3D3D',
        },
        'warm-white': '#FAF8F5',
      },
      fontFamily: {
        serif: ['"Playfair Display"', 'Georgia', 'serif'],
        sans: ['"Plus Jakarta Sans"', 'system-ui', '-apple-system', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'ui-monospace', 'monospace'],
      },
      fontSize: {
        // Fluid typography clamp definitions
        'fluid-display': 'clamp(2.5rem, 6vw + 1rem, 5.5rem)',
        'fluid-h1': 'clamp(2rem, 4vw + 0.75rem, 3.75rem)',
        'fluid-h2': 'clamp(1.5rem, 2.75vw + 0.5rem, 2.75rem)',
        'fluid-h3': 'clamp(1.25rem, 1.75vw + 0.4rem, 2rem)',
        'fluid-body-lg': 'clamp(1.05rem, 0.5vw + 0.95rem, 1.25rem)',
        'fluid-body': 'clamp(0.925rem, 0.35vw + 0.85rem, 1.05rem)',
        'fluid-sm': 'clamp(0.8rem, 0.2vw + 0.75rem, 0.875rem)',
      },
      boxShadow: {
        'warm-sm': '0 2px 8px -2px rgba(18, 11, 8, 0.25)',
        'warm-md': '0 8px 24px -4px rgba(18, 11, 8, 0.35)',
        'warm-lg': '0 16px 48px -8px rgba(18, 11, 8, 0.5)',
        'copper-glow': '0 0 30px -5px rgba(184, 107, 67, 0.3)',
        'caramel-glow': '0 0 30px -5px rgba(200, 138, 74, 0.25)',
      },
      letterSpacing: {
        'editorial': '0.04em',
        'cinematic': '0.12em',
        'superwide': '0.2em',
      },
    },
  },
  plugins: [],
};

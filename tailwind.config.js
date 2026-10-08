/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#FBF8F5',
          100: '#F6EFE7',
          200: '#EADBCF',
          300: '#DABFA9',
          400: '#C49B7A',
          500: '#AA744D', // Artisan Terracotta / Warm Umber
          600: '#8E5833',
          700: '#714224',
          800: '#54301B',
          900: '#3D2213',
          950: '#23120A',
        },
        accent: {
          50: '#FFFBEB',
          100: '#FEF3C7',
          500: '#D97706',
          600: '#B45309',
        },
        surface: {
          50: '#FAFAFA',
          100: '#F5F5F4',
          200: '#E7E5E4',
          800: '#292524',
          900: '#1C1917',
        }
      },
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'Inter', 'system-ui', '-apple-system', 'sans-serif'],
        serif: ['Cinzel', 'Playfair Display', 'Georgia', 'serif'],
      },
      boxShadow: {
        'soft': '0 2px 15px -3px rgba(0, 0, 0, 0.05), 0 4px 6px -2px rgba(0, 0, 0, 0.02)',
        'premium': '0 20px 25px -5px rgba(0, 0, 0, 0.04), 0 8px 10px -6px rgba(0, 0, 0, 0.03)',
        'elevated': '0 25px 50px -12px rgba(0, 0, 0, 0.08)',
      }
    },
  },
  plugins: [],
};

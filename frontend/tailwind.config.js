/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#fffaf5',
          100: '#fff1e6',
          200: '#ffddb8',
          300: '#ffc580',
          400: '#ffab47',
          500: '#f5921c',
          600: '#e07813',
          700: '#b35a0c',
          800: '#8a4510',
          900: '#6b3510',
        },
      },
    },
  },
  plugins: [],
};

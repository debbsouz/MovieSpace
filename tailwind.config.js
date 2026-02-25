/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'dark-bg': '#141414',
        'dark-secondary': '#1F1F1F',
        'text-primary': '#E5E5E5',
        'text-secondary': '#B3B3B3',
        'accent-red': '#E50914',
        'accent-red-hover': '#B20710',
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
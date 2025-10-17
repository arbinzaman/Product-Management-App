/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: false, // explicitly disable dark mode
  content: [
    './app/**/*.{js,jsx,ts,tsx}',
    './components/**/*.{js,jsx,ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        richBlack: '#0D1821',   // dark background
        aliceBlue: '#EFF1F3',   // light background
        sage: '#4E6E5D',        // accents/buttons
        tan: '#AD8A64',         // secondary accents
        redOxide: '#A44A3F'     // error/highlight
      },
    },
  },
  plugins: [],
}

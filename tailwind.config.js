/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {},
  },
  plugins: [
    function({ addComponents }) {
      addComponents({
        '.dark': {
          '*, ::before, ::after': {
            'border-color': 'rgb(55 65 81)', // gray-700
          },
          '*::-webkit-scrollbar-track': {
            'background': 'rgb(31 41 55)', // gray-800
          },
          '*::-webkit-scrollbar-thumb': {
            'background-color': 'rgb(75 85 99)', // gray-600
          },
        },
      });
    },
  ],
}


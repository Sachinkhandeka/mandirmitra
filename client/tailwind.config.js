import plugin from 'flowbite/plugin';

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "node_modules/flowbite-react/lib/esm/**/*.js",
  ],
  theme: {
    extend: {},
  },
  plugins: [
    plugin,
    function ({ addUtilities }) {
      const newUtilities = {
        '.scrollbar-hidden::-webkit-scrollbar': {
          display: 'none',
        },
        '.scrollbar-hidden': {
          '-ms-overflow-style': 'none', /* for Internet Explorer, Edge */
          'scrollbar-width': 'none', /* for Firefox */
        },     
      };

      addUtilities(newUtilities, ['responsive', 'hover']);
    },
  ],
};

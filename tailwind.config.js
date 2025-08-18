// tailwind.config.js
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./public/index.html"
  ],
  theme: {
    extend: {
      screens:{
        'x-small': '360px',
        'small': '390px'
      },
      fontFamily: {
        jersey25: ['"Jersey 25"', 'sans-serif'],
        vt323: ['"VT323"', 'monospace'],
      },
      colors: {
        brand: {
          purple:'#8666d5',
          lightblue: '#8293CF',
          stone: '#687C75',
          forest: '#092313',
          olive: '#607C46',
          lime: '#B7EF82',
          secondary:'#d4c693',
          darkgray: '#3A3C3C',
          skyblue: '#A3D8FD',
          aqua: '#A9CACC',
          olive: '#BDB3B6',
          rose: '#c49799',
          gray:'#D9D9D9',
          primary:'#092313',
          lightGreen:'#06491D'
        },
      },
    },
  },
  plugins: [],
};

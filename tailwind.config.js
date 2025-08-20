// tailwind.config.js - Fixed TypeScript version
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./public/index.html"
  ],
  theme: {
    extend: {
      // Your existing screens
      screens: {
        'x-small': '360px',
        'small': '390px'
      },
      
      // Enhanced font families
      fontFamily: {
        jersey25: ['"Jersey 25"', 'sans-serif'],
        vt323: ['"VT323"', 'monospace'],
     
      },
      
      // Enhanced color system - keeping your existing colors and adding more
      colors: {
        // Your existing brand colors
        brand: {
          purple: '#8666d5',
          lightblue: '#8293CF',
          stone: '#687C75',
          forest: '#092313',
          olive: '#607C46',
          lime: '#B7EF82',
          secondary: '#d4c693',
          darkgray: '#3A3C3C',
          skyblue: '#A3D8FD',
          aqua: '#A9CACC',
          rose: '#c49799',
          gray: '#D9D9D9',
          primary: '#092313',
          lightGreen: '#06491D'
        },
        
        // Enhanced Yogeshwari theme colors based on your CSS variables
        yogeshwari: {
          // Greens from CSS variables
          green: '#9FFF82',
          'light-green': '#CFDF82',
          'dark-green': '#092313',
          'ticket-green': '#9FFF82',
          
          // Other theme colors
          purple: '#8666D5',
          rose: '#c2b4bb',
          'dark-rose': '#C49799',
          blue: '#99d5ff',
          'shade-blue': '#AFD0D6',
          light: '#CCCCCC',
          
          // Zone specific colors
          zone: {
            a: '#c49799', // Zone A color from your images
            z: '#8666d5', // Zone Z color
          }
        },
        
      
        // Status colors
        status: {
          success: '#22c55e',
          warning: '#f59e0b',
          error: '#ef4444',
          info: '#3b82f6',
        }
      },
      
      // Enhanced spacing
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
        '100': '25rem',
        '112': '28rem',
        '128': '32rem',
      },
      
      
    },
  },
  plugins: [],
};

// SEPARATE CSS FILE: src/styles/yogeshwari-utilities.css
// Create this file and import it in your main CSS after Tailwind

/* 
Add this content to: src/styles/yogeshwari-utilities.css
Then import it in your index.css: @import './styles/yogeshwari-utilities.css';
*/
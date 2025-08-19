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
        // Add modern alternatives
        'mono': ['VT323', 'Jersey 25', 'Courier New', 'monospace'],
        'display': ['Jersey 25', 'VT323', 'sans-serif'],
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
        
        // Dark theme system
        dark: {
          50: '#f9fafb',
          100: '#f3f4f6',
          200: '#e5e7eb',
          300: '#d1d5db',
          400: '#9ca3af',
          500: '#6b7280',
          600: '#4b5563',
          700: '#374151',
          800: '#1f2937',
          900: '#111827',
          950: '#030712',
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
      
      // Enhanced animations matching your retro theme
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.3s ease-out',
        'glow': 'glow 2s ease-in-out infinite alternate',
        'matrix-scroll': 'matrixScroll 15s linear infinite',
        'crt-flicker': 'crtFlicker 0.15s linear infinite',
        'cassette-spin': 'cassetteSpin 3s linear infinite',
        'scanner-sweep': 'scannerSweep 4s ease-in-out infinite',
        'type-writer': 'typeWriter 3.5s steps(40, end)',
        'retro-blink': 'retroBlink 1s step-end infinite',
      },
      
      // Enhanced keyframes
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        glow: {
          '0%': { boxShadow: '0 0 5px rgba(159, 255, 130, 0.5)' },
          '100%': { boxShadow: '0 0 20px rgba(159, 255, 130, 0.8)' },
        },
        matrixScroll: {
          '0%': { transform: 'translateY(0)', opacity: '1' },
          '70%': { transform: 'translateY(0)', opacity: '1' },
          '100%': { transform: 'translateY(-50px)', opacity: '0' },
        },
        crtFlicker: {
          '0%': { opacity: '1' },
          '97%': { opacity: '1' },
          '98%': { opacity: '0.98' },
          '99%': { opacity: '0.95' },
          '100%': { opacity: '1' },
        },
        cassetteSpin: {
          '0%': { transform: 'rotate(0deg)' },
          '100%': { transform: 'rotate(360deg)' },
        },
        scannerSweep: {
          '0%, 100%': { top: '100%', opacity: '0' },
          '10%, 90%': { opacity: '1' },
          '50%': { top: '0%' },
        },
        typeWriter: {
          'from': { width: '0' },
          'to': { width: '100%' },
        },
        retroBlink: {
          '50%': { opacity: '0' },
        },
        glitch1: {
          '0%, 14%, 15%, 49%, 50%, 99%, 100%': {
            transform: 'skew(0deg) translate3d(0, 0, 0)',
          },
          '1%, 13%': {
            transform: 'skew(-0.5deg) translate3d(-1px, 0, 0)',
          },
          '16%, 48%': {
            transform: 'skew(0.5deg) translate3d(1px, 0, 0)',
          },
        },
        glitch2: {
          '0%, 20%, 21%, 62%, 63%, 99%, 100%': {
            transform: 'skew(0deg) translate3d(0, 0, 0)',
          },
          '1%, 19%': {
            transform: 'skew(0.5deg) translate3d(1px, 0, 0)',
          },
          '22%, 61%': {
            transform: 'skew(-0.5deg) translate3d(-1px, 0, 0)',
          },
        },
      },
      
      // Enhanced backdrop blur
      backdropBlur: {
        xs: '2px',
      },
      
      // Box shadows for retro effects
      boxShadow: {
        'retro': '5px 5px 0 #333',
        'retro-hover': '6px 6px 0 #333',
        'retro-active': '3px 3px 0 #333',
        'glow-green': '0 0 20px rgba(159, 255, 130, 0.5)',
        'glow-purple': '0 0 20px rgba(134, 102, 213, 0.5)',
        'glow-rose': '0 0 20px rgba(196, 151, 153, 0.5)',
        'terminal': 'inset 0 0 20px rgba(0, 0, 0, 0.5)',
      },
      
      // Border radius for retro styling
      borderRadius: {
        'retro': '0px', // No border radius for authentic retro look
      }
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
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        pri: {
          100: '#18181b',
          200: '#27272a'
        },
        sec: {
          100: '#fafafa',
          200: '#d4d4d8'
        },
      },
    },
  },
  plugins: [],
}


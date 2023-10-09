/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        pri: {
          100: '#18181b',
          200: '#202023',
          300: '#28282b'
        },
        sec: {
          100: '#fafafa',
          200: '#d4d4d8'
        },
        error: '#46181b',
        success: '#18461b',
      },
      gridTemplateColumns: {
        'auto-fit-20': 'repeat(auto-fit, minmax(20rem, 1fr))',
      }
    },
  },
  plugins: [],
}


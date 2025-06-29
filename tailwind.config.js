/ ** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  safelist: [
    'text-4xl',
    'text-6xl',
  ],
  theme: {
    extend: {},
  },
  plugins: [],
};
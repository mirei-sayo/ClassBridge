/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'accent-primary': '#6366f1', // Indigo
        'accent-secondary': '#a855f7', // Purple
      },
    },
  },
  plugins: [],
}

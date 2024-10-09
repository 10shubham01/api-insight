/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}", // Path to your components
    "./public/popup.html",         // Path to your main HTML file
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}
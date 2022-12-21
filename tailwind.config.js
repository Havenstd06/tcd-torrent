/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        "primary": "#22282F",
        "secondary": "#2A313A",
        "emerald": "#66DDB8",
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
  ],
}

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/app/**/*.{js,ts,jsx,tsx}",
    "./src/components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-6px)' },
        },
      },
      animation: {
        float: 'float 3s ease-in-out infinite',
      },
      colors: {
        haruRose: "#F2B5D4",
        haruPurple: "#A97BCA",
        personaPurple: "#6D3793",
        personaRed: "#8B1E3F",
        royalGold: "#D4AF37",
        darkBlack: "#1A1A1A",
        creamWhite: "#FAF5F0",
      },
      fontFamily: {
        display: ["'Playfair Display'", "serif"],
        body: ["'Inter'", "sans-serif"],
      },
    },
  },
  plugins: [],
}

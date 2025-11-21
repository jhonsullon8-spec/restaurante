/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/public/**/*.html",
    "./src/public/**/*.js",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#264653",
        accent: "#e76f51",
        "warm-light": "#f4f4f4",
        "warm-dark": "#333",
        "restaurant-brown": "#b65c28",
        "warm-bg": "#FFF8F0",
      },
      fontFamily: {
        playfair: ["Playfair Display", "serif"],
        arima: ["Arima", "cursive"],
        mulish: ["Mulish", "sans-serif"],
      },
      spacing: {
        "nav-height": "85px",
      },
      backgroundImage: {
        "gradient-dark": "linear-gradient(rgba(0,0,0,0.4), rgba(0,0,0,0.4))",
      },
    },
  },
  plugins: [],
};

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#00d2d3",
        secondary: "#01a3a4",
        text: "#2d3436",
        bg: "#f5f6fa",
        white: "#ffffff",
        danger: "#ff6b6b",
        "deep-blue": "#1e2756", // Hero Section
        "card-yellow": "#fef08a", // Instant Video
        "card-green": "#bbf7d0", // Find Doctors
        "card-pink": "#fbcfe8", // Medicines
        "card-blue": "#bfdbfe", // Lab Tests
      },
      fontFamily: {
        poppins: ["Poppins", "sans-serif"],
      },
      boxShadow: {
        custom: "0 4px 15px rgba(0, 0, 0, 0.1)",
      },
      borderRadius: {
        DEFAULT: "8px",
      },
      animation: {
        blob: "blob 7s infinite",
      },
      keyframes: {
        blob: {
          "0%": {
            transform: "translate(0px, 0px) scale(1)",
          },
          "33%": {
            transform: "translate(30px, -50px) scale(1.1)",
          },
          "66%": {
            transform: "translate(-20px, 20px) scale(0.9)",
          },
          "100%": {
            transform: "translate(0px, 0px) scale(1)",
          },
        },
      },
    },
  },
  plugins: [],
};

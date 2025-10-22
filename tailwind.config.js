/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./src/**/*.{js,ts,jsx,tsx}"
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["'Inter'", "ui-sans-serif", "system-ui"]
      },
      colors: {
        midnight: "#0f172a",
        orchid: "#a855f7",
        mint: "#5eead4"
      },
      boxShadow: {
        glow: "0 20px 50px -25px rgba(94, 234, 212, 0.45)"
      }
    }
  },
  plugins: []
};

/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#A0402B",
        "primary-hover": "#82331F",
        accent: "#8B5A2B",
        dark: "#1A1A1A",
        cream: "#FBF3E7",
        sand: "#F0E2C8",
        ink: "#241A12",
        muted: "#7A6A57",
        gold: "#C68642",
        whatsapp: "#25D366",
        line: "#E3D2AE",
      },
      fontFamily: {
        heading: ['"Playfair Display"', "Georgia", "serif"],
        body: ["Poppins", "Arial", "sans-serif"],
      },
    },
  },
  plugins: [],
};

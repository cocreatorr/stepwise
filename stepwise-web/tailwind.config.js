/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Core palette
        background: "#ffffff", // white
        text: "#000000",       // black
        heading: "#1e3a8a",    // blue-900
        link: "#1d4ed8",       // blue-700
        linkHover: "#1e40af",  // blue-800
        subtle: "#374151",     // gray-700 for muted text
        border: "#e5e7eb",     // gray-200 for borders
      },
      fontFamily: {
        sans: [
          "Inter",
          "system-ui",
          "-apple-system",
          "BlinkMacSystemFont",
          "Segoe UI",
          "Roboto",
          "Oxygen",
          "Ubuntu",
          "Cantarell",
          "Open Sans",
          "Helvetica Neue",
          "sans-serif",
        ],
      },
    },
  },
  plugins: [require("@tailwindcss/typography")],
};

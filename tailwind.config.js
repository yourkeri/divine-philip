/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "index.html",
    "officialdivine.html",
    "admin.html",
    "js/*.js"
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          DEFAULT: "#15803d",
          dark: "#166534",
          light: "#dcfce7"
        }
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"]
      }
    }
  }
};
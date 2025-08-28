/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "./**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#ea580c', // A warm orange
        secondary: '#475569', // Slate 600
        light: '#f1f5f9', // Slate 100
        dark: '#1e293b', // Slate 800
      },
    }
  },
  plugins: [],
}

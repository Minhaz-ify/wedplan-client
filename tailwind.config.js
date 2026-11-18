/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        brand: { 50: "#fff1f3", 100: "#ffe0e6", 200: "#fec7d2", 300: "#fda0b3", 400: "#fb6c8c", 500: "#f43f69", 600: "#e11d51", 700: "#be1242", 800: "#9f123f", 900: "#881339" },
        gold: { 400: "#d4af6a", 500: "#c39a4a", 600: "#a47f35" },
      },
      fontFamily: { serif: ["var(--font-serif)", "Georgia", "serif"], sans: ["var(--font-sans)", "system-ui", "sans-serif"] },
    },
  },
  plugins: [],
};

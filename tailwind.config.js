module.exports = {
  darkMode: 'class',
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./public/index.html"
  ],
  theme: {
    extend: {
      colors: {
        // Optional: Add custom dark mode colors
        gray: {
          900: '#111827',
          800: '#1F2937',
          700: '#374151',
        }
      }
    },
  },
  plugins: [],
}
/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{vue,js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Inter", "ui-sans-serif", "system-ui", "-apple-system", "Segoe UI", "Roboto", "sans-serif"],
      },
      colors: {
        brand: {
          50: "#ecf8fe",
          100: "#d4eefc",
          200: "#aee0f9",
          300: "#77cdf4",
          400: "#38b3ea",
          500: "#1a9ad6",
          600: "#0e7bb5",
          700: "#0d6293",
          800: "#105379",
          900: "#134565",
        },
      },
    },
  },
  plugins: [],
};

/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#1A4C95",
        secondary: "#E8EAF5",
        grey: "#D3D3D3",
      },
    },
  },
  plugins: [],
};

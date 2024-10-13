/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./dist/*.{html,js}"],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        "primary-color": "#356aff",
        "bg-color": "#f5f5f5",
        "light-bg-color": "#fff",
        "light-text-color": "#cdcdc1",
        "text-color": "#111116",
        "primary-text-color": "#fff",
      },
    },
    fontFamily: {
      Poppins: "Poppins, sans-serif",
    },
  },
  plugins: [],
};

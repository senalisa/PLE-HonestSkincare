/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
      "./App.{js,jsx,ts,tsx}",
      "./components/**/*.{js,jsx,ts,tsx}",
      "./screens/*.{js,jsx,ts,tsx}",
      "./navigation/*.{js,jsx,ts,tsx}",
      // "./<custom directory>/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
      extend: {
      colors: {
          "dark-pink" : "#FB6F93",
          "light-beige" : "#F5EDE5",
          "dark-beige" : "#C8BBA8",
          "pastel-green" : "#E2E0C1",

        // Blue
          "light-blue" : "#F7FDFF",
          "blue" : "#4F9EC5",

        //   Pink
          "pink" : "#FB6F93",
          "pink-light" : "#FFFAFB",
          "pastel-pink": "#E7B1AF",
          "pinkie" : "#F5EBEF",

        //Yellow
        "yellow" : "#FFFEFB",
        "dark-yellow" : "#D59630",
      },
      width: {
        '18': '4.5rem',
      },
      height:{
        '18': '4.5rem',
      },
      fontSize: {
        xxs: ['10px', '14px']
      }
      },
  },
  plugins: [],
}

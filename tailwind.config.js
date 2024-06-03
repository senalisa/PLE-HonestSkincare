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
          "dark-pink" : "#63254E",
          "light-beige" : "#F5EDE5",
          "dark-beige" : "#C8BBA8",
          "pastel-green" : "#E2E0C1",

        // Blue
          "light-blue" : "#F4FBFD",
          "blue" : "#7BB6D7",

        //   Pink
          "pink" : "#AE466D",
          "pink-light" : "#EBDBE3",
          "pastel-pink": "#E7B1AF",
          "pinkie" : "#F5EBEF",

        //Yellow
        "yellow" : "#F2EFD7",
        "dark-yellow" : "#B4A18A",
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

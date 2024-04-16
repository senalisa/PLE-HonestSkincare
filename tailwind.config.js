/** @type {import('tailwindcss').Config} */
module.exports = {
  // NOTE: Update this to include the paths to all of your component files.
  content: [
    "./App/**/*.{js,jsx,ts,tsx}",
    "./components/**/*.{js,jsx,ts,tsx}",
    "./views/*.{js,jsx,ts,tsx}",
    "./navigation/*.{js,jsx,ts,tsx}",
  ],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {},
    colors: {
      "primary" : "#63254E",
      "light-blue" : "#F1FAFC",
      "light-blue-border" : "#BDE6EF",
      "light-pink": "#F5E5EC",
      "light-pink-border" : "#EAD6DF",
      "light-green" : "#F2EFD7",
      "light-green-border" : "#DFDBBB",
    }
  },
  plugins: [],
}


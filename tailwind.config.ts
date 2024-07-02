/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./App.js', './Screens/*.js', './Component/**/*.{js,jsx}'],
  theme: {
    extend: {
      backgroundImage: {
        'sign-up-bg-image': "url('./assets/background-image-login.jpeg')",
        logo: './assets/farm-21-logo.jpeg',
      },
    },
  },
  plugins: [],
}

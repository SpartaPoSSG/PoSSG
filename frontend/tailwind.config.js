/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "node_modules/flowbite-react/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      boxShadow: {
        '3xl': '0 35px 60px -15px rgba(0, 0, 0, 0.3)',
      }
    },
    fontFamily: {
      'seoleim': ['seolleimcool-bold']
    }
  },
  plugins: [
    require('flowbite/plugin'), require("tailwind-scrollbar-hide")
  ],
}


/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "node_modules/flowbite-react/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    fontFamily: {
      'seoleim': ['seolleimcool-bold']
    }
  },
  plugins: [
    require('flowbite/plugin'), require("tailwind-scrollbar-hide")
  ],
}


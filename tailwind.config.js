/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './layout/*.liquid',
    './sections/*.liquid',
    './snippets/*.liquid',
    './templates/*.liquid',
    './templates/customers/*.liquid'
  ],
  theme: {
    extend: {

      height : {
        "screen-90" : "90vh"
      },
      width : {
        "screen-1/2" : "40vw"
      }

     
    },
  },
  plugins: [],
}

